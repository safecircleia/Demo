import { motion } from "framer-motion";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DemoUI from "@/components/DemoUI";

export default async function DemoPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return <DemoUI />;
}
