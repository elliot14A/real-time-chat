import { fectchRedis, fectchRedis as fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);
    const idToAdd = (await fectchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    if (!idToAdd) {
      return new Response("This person does not exist", { status: 404 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself", { status: 400 });
    }

    const alreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (alreadyAdded) {
      return new Response("You already sent a request", { status: 400 });
    }

    const alreadyFriends = (await fectchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (alreadyFriends) {
      return new Response("You are already friends", { status: 400 });
    }
    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );
    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:friends`),
      "new_friend",
      {}
    );

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("Friend request sent");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("invalid request paylod", { status: 400 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
