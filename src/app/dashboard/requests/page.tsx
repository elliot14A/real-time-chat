import { FriendRequests } from "@/components/FriendRequests";
import { fectchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const incomingSenderIds = (await fectchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];
  const incomingFriendRequests: IncomingFriendRequest[] = await Promise.all(
    incomingSenderIds.map(async (id) => {
      const sender = (await fectchRedis("get", `user:${id}`)) as string;
      const senderParsed = JSON.parse(sender) as User;
      return {
        senderId: id,
        senderEmail: senderParsed.email,
      };
    })
  );
  return (
    <main className="w-full pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          sessionId={session.user.id}
          incomingFriendRequests={incomingFriendRequests}
        />
      </div>
    </main>
  );
};

export default Page;
