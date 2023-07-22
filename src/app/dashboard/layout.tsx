import { FriendRequestSidebarOption } from "@/components/FriendRequestSidebarOption";
import { SidebarChatList } from "@/components/SidebarChatList";
import { SignOutButton } from "@/components/SignOutButton";
import { Icon, Icons } from "@/components/ui/icons";
import { getFriendById } from "@/helpers/getfriendbyid";
import { fectchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

interface SideBarOptions {
  id: number;
  name: string;
  icon: Icon;
  href: string;
}

const sideBarOptions: SideBarOptions[] = [
  {
    id: 1,
    name: "Add a friend",
    icon: "UserPlus",
    href: "/dashboard/add",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const unseenRequests = (
    (await fectchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  const friends = await getFriendById(session.user.id);
  const logoText = "Let's Chat";
  return (
    <div className="w-full flex h-screen">
      <div className="w-full h-full flex max-w-xs grow flex-col gap-y-5 overflow-auto border-r border-black bg-white px-6">
        <Link
          href="/dashboard"
          className="flex gap-4 h-16 shrink-0 items-center"
        >
          <p className="text-3xl font-bold ">{logoText}</p>
          <Icons.Logo className="h-8 w-auto text-black" />
        </Link>
        {friends.length > 0 ? (
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Your Chats
          </div>
        ) : null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList friends={friends} sessionID={session.user.id} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-2">
                {sideBarOptions.map((opt) => {
                  const Icon = Icons[opt.icon];
                  return (
                    <li key={opt.id}>
                      <Link
                        href={opt.href}
                        className="text-gray-700 hover:text-black hover:border-black hover:border group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:text-black group-hover:border-black flex h-6 w-6 shrink-0 justify-center items-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{opt.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <FriendRequestSidebarOption
                    sessionId={session.user.id}
                    initialUnRequestCount={unseenRequests}
                  />
                </li>
              </ul>
            </li>
            <li className="-mx-9 mt-auto flex items-center">
              <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-600">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session?.user.image || ""}
                    alt="Your Profile Picture"
                  />
                </div>
                <span className="sr-only">Your Profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session?.user.name}</span>
                  <span
                    aria-hidden="true"
                    className="truncate text-sm text-zinc-400"
                  >
                    {session?.user.email}
                  </span>
                </div>
                <SignOutButton className="flex-1 h-full aspect-square text-slate-800 hover:text-white hover:bg-black" />
              </div>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default Layout;
