import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { FC } from "react";
import { Toast, toast } from "react-hot-toast";

interface UnseenMsgToastProps {
  t: Toast;
  chatId: string;
  senderImg: string;
  senderName: string;
  senderMsg: string;
}

export const UnseenMsgToast: FC<UnseenMsgToastProps> = ({
  t,
  chatId,
  senderImg,
  senderName,
  senderMsg,
}) => {
  return (
    <div
      className={cn(
        "max-w-md border border-black w-full bg-white rounded-lg pointer-events-auto flex",
        {
          "animate-enter": t.visible,
          "animate-leave": !t.visible,
        }
      )}
    >
      <a
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/${chatId}`}
        className="flex-1 w-0 p-4"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5 ">
            <div className="relative h-10 w-10">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="h-6 w-6 rounded-full"
                alt="profile picture"
                src={senderImg}
              />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{senderName}</p>
            <p className="mt-1 text-sm text-gray-500">{senderMsg}</p>
          </div>
        </div>
      </a>
      <div className="flex border-1 border-black">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full rounded-none rounder-r-lg p-4 flex items-center justify-center text-sm font-md text-black"
        >
          Close
        </button>
      </div>
    </div>
  );
};
