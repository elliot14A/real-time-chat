"use client";
import React, { FC, useRef, useState } from "react";
import { Message } from "@/lib/validations/message";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface MessageProps {
  initialMessages: Message[];
  sessionId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
}

export const Messages: FC<MessageProps> = ({
  initialMessages,
  sessionId,
  sessionImg,
  chatPartner,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const formatTime = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-red scrollbar-thumb-rounded scrollbar-track-red-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}></div>
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const nextMessageFromSameUser =
          messages[index - 1]?.senderId === message.senderId;
        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-black text-white": !isCurrentUser,
                    "bg-white border border-black text-black": isCurrentUser,
                    "rounded-br-none":
                      isCurrentUser && !nextMessageFromSameUser,
                    "rounded-bl-none":
                      !isCurrentUser && !nextMessageFromSameUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: nextMessageFromSameUser,
                })}
              >
                {
                  <Image
                    fill
                    src={
                      isCurrentUser ? (sessionImg as string) : chatPartner.image
                    }
                    alt="Profile picture"
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                  />
                }
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
