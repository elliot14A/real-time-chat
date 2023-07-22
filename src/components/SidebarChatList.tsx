"use client";
import { chatHrefConstructor } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

interface SidebarChatListProps {
  friends: User[];
  sessionID: string;
}

export const SidebarChatList: FC<SidebarChatListProps> = ({
  friends,
  sessionID,
}) => {
  console.log(friends);
  const router = useRouter();
  const pathName = usePathname();
  const [unseenMsgs, setUnseenMsgs] = useState<Message[]>();
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
