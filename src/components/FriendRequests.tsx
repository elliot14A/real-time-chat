"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

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

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    function friendRequestHandler(data: IncomingFriendRequest) {
      setIncomingRequests((prev) => [...prev, data]);
    }
    pusherClient.bind("incoming_friend_requests", friendRequestHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

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
        <p className="w-full h-full font-semibold text-sm text-zinc-500">
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
                className="w-8 h-8 bg-black rounded-full grid place-items-center transition"
              >
                <Check className="font-semibold text-white h-3/4 w-3/4" />
              </button>
              <button
                onClick={() => denyFriendRequest(req.senderId)}
                className="w-8 h-8 border border-black bg-white text-black rounded-full grid place-items-center transition"
              >
                <X className="font-semibold text-black h-3/4 w-3/4" />
              </button>
            </div>
          </>
        ))
      )}
    </div>
  );
};
