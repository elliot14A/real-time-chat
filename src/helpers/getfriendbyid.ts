import { fectchRedis } from "./redis";

export const getFriendById = async (id: string): Promise<User[]> => {
  try {
    const friendIds = (await fectchRedis(
      "smembers",
      `user:${id}:friends`
    )) as string[];
    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        const friend = (await fectchRedis("get", `user:${friendId}`)) as string;
        return JSON.parse(friend) as User;
      })
    );
    return friends;
  } catch (error) {
    return [];
  }
};
