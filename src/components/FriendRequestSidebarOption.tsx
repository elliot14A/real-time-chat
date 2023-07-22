"use client";
import { User } from "lucide-react";
import Link from "next/link";
import React, { FC, useState } from "react";

interface FriendRequestSidebarOptionProps {
  sessionId: string;
  initialUnRequestCount: number;
}

export const FriendRequestSidebarOption: FC<
  FriendRequestSidebarOptionProps
> = ({ initialUnRequestCount }) => {
  const [unSeenRequests, setUnSeenRequests] = useState<number>(
    initialUnRequestCount
  );
  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 hover:border hover:border-black group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
      <div className="text-gray-400 border-gray-200 group-hover:border-black group-hover:text-black flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend Request</p>
      {unSeenRequests > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs items-center justify-center bg-red-600 text-white flex">
          {unSeenRequests}
        </div>
      ) : (
        ""
      )}
    </Link>
  );
};
