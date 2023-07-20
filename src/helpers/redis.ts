const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const updateSecret = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "get" | "zrange" | "sismember" | "smembers";

export const fectchRedis = async (
  command: Command,
  ...args: (string | number)[]
) => {
  const url = `${upstashUrl}/${command}/${args.join("/")}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${updateSecret}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis fetch failed, ${response.status}`);
  }

  const data = await response.json();
  return data.result;
};
