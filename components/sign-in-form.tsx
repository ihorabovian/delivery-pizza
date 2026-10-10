"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import pizzaIcon from "@/app/icon.png";
import { Button } from "@/components/ui/button";
import { OTP_CODES_URL, requestOtp, signIn } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const inputClassName =
  "h-10 w-full rounded-full border border-border bg-background px-4 text-xl outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function BackButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className={cn("cursor-pointer text-foreground", className)}
    >
      <ChevronLeft className="size-6" />
    </button>
  );
}

export function SignInForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const phoneDigits = phone.replace(/\D/g, "");
  const secondsLeft = Math.max(0, Math.ceil((resendAt - now) / 1000));

  // Tick the resend countdown while it runs
  useEffect(() => {
    if (resendAt <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [resendAt]);

  const sendCode = async () => {
    setPending(true);
    setError(null);
    try {
      const retryDelay = await requestOtp(phoneDigits);
      setNow(Date.now());
      setResendAt(Date.now() + retryDelay);
      setStep("code");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setPending(false);
    }
  };

  const handlePhoneSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (phoneDigits && !pending) sendCode();
  };

  const handleCodeSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!code || pending) return;
    setPending(true);
    setError(null);
    try {
      const { token, user } = await signIn(phoneDigits, Number(code));
      setSession(token, user);
      router.replace(redirectTo);
    } catch (error) {
      setError((error as Error).message);
      setPending(false);
    }
  };

  const handleBack = () => {
    if (step === "code") {
      setStep("phone");
      setCode("");
      setError(null);
    } else {
      router.back();
    }
  };

  return (
    <main className="flex min-h-svh justify-center bg-background px-4 py-6 sm:items-center sm:py-16">
      <div className="flex w-full max-w-85 flex-col gap-6 sm:gap-12">
        <div className="relative hidden h-6 items-center justify-center sm:flex">
          <BackButton onClick={handleBack} className="absolute left-0" />
          <Link
            href="/"
            className="flex items-center gap-1 text-base font-extrabold uppercase text-foreground"
          >
            <Image src={pizzaIcon} alt="" className="size-6" aria-hidden />
            Pizza
          </Link>
        </div>

        <div className="flex flex-col gap-6 sm:gap-4">
          <div className="flex items-center gap-4 sm:justify-center">
            {step === "code" && (
              <BackButton onClick={handleBack} className="sm:hidden" />
            )}
            <h1 className="text-2xl font-bold">
              {step === "phone" ? "Sign in" : "Verification code"}
            </h1>
          </div>

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <label htmlFor="phone" className="text-base font-medium">
                  Enter your phone number to sign in to your profile
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1"
                  className={inputClassName}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button
                type="submit"
                variant="brand"
                size="xl"
                disabled={!phoneDigits || pending}
                className="w-full"
              >
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <label htmlFor="code" className="text-base font-medium">
                  We sent a verification code to the phone number you entered
                </label>
                <input
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Verification code"
                  className={inputClassName}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  variant="brand"
                  size="xl"
                  disabled={!code || pending}
                  className="w-full"
                >
                  Sign in
                </Button>
                {secondsLeft > 0 ? (
                  <p className="flex h-13 items-center justify-center text-sm font-medium">
                    Resend code in {secondsLeft} sec
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="xl"
                    disabled={pending}
                    onClick={sendCode}
                    className="w-full"
                  >
                    Resend code
                  </Button>
                )}
                <p className="text-sm leading-[22px] text-muted-foreground">
                  This OTP code is not real and is used only in this training
                  project. You can find it on the{" "}
                  <a
                    href={OTP_CODES_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    OTP codes page
                  </a>
                  .
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
