import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(...input));
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return `/chat/${sortedIds[0]}--${sortedIds[1]}`;
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}
