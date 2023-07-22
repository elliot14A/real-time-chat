import { fectchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export const POST = async (req: Request) => {
  try {
    const { text, chatId } = (await req.json()) as {
      text: string;
      chatId: string;
    };
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const [userId1, userId2] = chatId.split("--");
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }
    const friendId = session.user.id === userId2 ? userId1 : userId2;
    const friendList = (await fectchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[];
    const isFriend = friendList.includes(friendId);
    if (!isFriend) {
      return new Response("Unauthorized", { status: 401 });
    }
    const senderString = (await fectchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(senderString) as User;
    const timestamp = Date.now();
    const message: Message = {
      id: nanoid(),
      senderId: session.user.id,
      receiverId: friendId,
      text,
      timestamp,
    };
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "new_message",
      message
    );
    await pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      "new_unseen_message",
      {
        ...message,
        senderName: sender.name,
        senderImg: sender.image,
      }
    );

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Internal server error", { status: 500 });
  }
};
