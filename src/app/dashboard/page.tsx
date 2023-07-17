import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  return <pre>{session?.user.id}</pre>;
};

export default Page;
