import { auth } from "@clerk/nextjs/server";
import Navbar from "../_components/navebar";
import { redirect } from "next/navigation";

const SubscriptionPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/login");
  }

  return <Navbar />;
};

export default SubscriptionPage;
