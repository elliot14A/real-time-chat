import { fectchRedis as fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // verify body users not already friends
    const isAlreadyFriend = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriend) {
      return new Response("Already friends", { status: 400 });
    }

    // verify body user is in pending list
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }
    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:friends`),
      "new_friend",
      {}
    );

    // add to friends
    await db.sadd(`user:${session.user.id}:friends`, idToAdd);
    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    // remove friend request
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request body", { status: 400 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
