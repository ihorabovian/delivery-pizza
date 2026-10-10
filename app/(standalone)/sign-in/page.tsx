import type { Metadata } from "next";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  // Only same-site paths, so the link can't send the user to another site
  const redirectTo =
    redirect?.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/profile";

  return <SignInForm redirectTo={redirectTo} />;
}
