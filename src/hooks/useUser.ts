import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function useUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return { user };
}

export default useUser;
