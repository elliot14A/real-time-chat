"use client";

import axios from "axios";
import { Check, UserPlus2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";

interface FriendRequestProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

export const FriendRequests: FC<FriendRequestProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const [incomingRequests, setIncomingRequests] = useState<
    IncomingFriendRequest[]
  >(incomingFriendRequests);

  const router = useRouter();

  const acceptFriendRequest = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });
    setIncomingRequests((prev) =>
      prev.filter((req) => req.senderId !== senderId)
    );
    router.refresh();
  };

  const denyFriendRequest = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });
    setIncomingRequests((prev) =>
      prev.filter((req) => req.senderId !== senderId)
    );
    router.refresh();
  };
  return (
    <div>
      {incomingRequests.length === 0 ? (
        <p className="font-semibold text-sm text-zinc-500">
          Woooo How empty....!
        </p>
      ) : (
        incomingRequests.map((req) => (
          <>
            <div key={req.senderId} className="flex gap-4 items-center">
              <UserPlus2 className="text-black" />
              <p className="font-medium text-sm">{req.senderEmail}</p>
              <button
                onClick={() => acceptFriendRequest(req.senderId)}
                className="w-8 h-8 bg-red-500 rounded-full hover:bg-red-600 grid place-items-center transition hover:shadow-md "
              >
                <Check className="font-semibold text-white h-3/4 w-3/4" />
              </button>
              <button
                onClick={() => denyFriendRequest(req.senderId)}
                className="w-8 h-8 bg-black rounded-full grid place-items-center transition hover:shadow-md "
              >
                <X className="font-semibold text-white h-3/4 w-3/4" />
              </button>
            </div>
          </>
        ))
      )}
    </div>
  );
};
