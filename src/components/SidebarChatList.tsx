"use client";
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { UnseenMsgToast } from "./UnseenMsgToast";
import { toast } from "react-hot-toast";

interface SidebarChatListProps {
  friends: User[];
  sessionID: string;
}
interface ExtendedMessage extends Message {
  senderName: string;
  senderImg: string;
}

export const SidebarChatList: FC<SidebarChatListProps> = ({
  friends,
  sessionID,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const [unseenMsgs, setUnseenMsgs] = useState<Message[]>([]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionID}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionID}:friends`));
    function handleUnseenMessage(message: ExtendedMessage) {
      const chatId = chatHrefConstructor(sessionID, message.senderId);
      const shouldNotify = pathName !== `/dashboard${chatId}`;
      if (!shouldNotify) return;
      toast.custom((t) => (
        <UnseenMsgToast
          t={t}
          senderMsg={message.text}
          senderName={message.senderName}
          senderImg={message.senderImg}
          chatId={chatId}
        />
      ));
      setUnseenMsgs((prev) => [...prev, message]);
    }
    pusherClient.bind("new_unseen_message", handleUnseenMessage);
    function newFriendHandler() {
      router.refresh();
    }
    pusherClient.bind("new_friend", newFriendHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionID}:friends`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionID}:chats`));
      pusherClient.unbind("new_unseen_message", handleUnseenMessage);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathName, sessionID, router]);

  useEffect(() => {
    if (pathName?.includes("chat")) {
      setUnseenMsgs((prev) => {
        return prev?.filter((msg) => !pathName.includes(msg.senderId));
      });
    }
  }, [pathName]);

  return (
    <ul role="list" className="max-h-[25rem] -mx-2 overflow-y-auto space-y-1 ">
      {friends.sort().map((friend) => {
        const unseenMsgsCount = unseenMsgs?.filter(
          (unseenMsg) => unseenMsg.senderId === friend.id
        ).length!;
        return (
          <li key={friend.id} className="leading-6">
            <div className="flex hover:border hover:border-black p-1.5 rounded-md gap-x-2">
              <div className="relative h-8 w-8">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={friend.image}
                  alt="Your Profile Picture"
                />
              </div>
              <a
                className="my-1 text-md"
                href={`/dashboard/${chatHrefConstructor(friend.id, sessionID)}`}
              >
                {friend.name}
                {unseenMsgsCount > 0 ? (
                  <div className="bg-black font-medium text-xs text-white h-4 w-4 rounded-full flex justify-center items-center">
                    {unseenMsgsCount}
                  </div>
                ) : null}
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
