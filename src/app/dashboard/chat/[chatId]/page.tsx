import { Messages } from "@/components/Messages";
import { fectchRedis as fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { FC } from "react";
import { Message as IMessage } from "@/lib/validations/message";
import { ChatInput } from "@/components/ChatInput";

interface PageProps {
  params: {
    chatId: string;
  };
}

const getChatMessages = async (chatId: string) => {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const results = result.map((msg) => JSON.parse(msg)) as Message[];
    const messages = messageArrayValidator.parse(results);

    return messages.reverse();
  } catch (err) {
    notFound();
  }
};

const Page: FC<PageProps> = async ({ params }) => {
  const chatId = params.chatId;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2] = chatId.split("--");

  if (userId1 !== user.id && userId2 !== user.id) notFound();

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartnerString = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerString) as User;
  const messages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex justify-between py-3 border-b border-black">
        <div className="relative flex items-center space-x-4 ">
          <div className="relative">
            <div className="relative w-8 h-8">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image}
                alt={chatPartner.name}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages
        initialMessages={messages}
        sessionId={session.user.id}
        sessionImg={session.user.image}
        chatPartner={chatPartner}
      />
      <ChatInput chatPartner={chatPartner} chatId={chatId} />
    </div>
  );
};

export default Page;
