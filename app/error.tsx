"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import errorMascotMobile from "@/public/error-mascot-mobile.svg";
import errorMascotDesktop from "@/public/error-mascot.svg";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-82 flex-col items-center gap-6 px-4 py-16 text-center sm:px-8 lg:max-w-144.5 lg:px-10">
      <Image
        src={errorMascotMobile}
        alt=""
        className="h-24 w-23 lg:hidden"
        aria-hidden
      />
      <Image
        src={errorMascotDesktop}
        alt=""
        className="hidden h-37 w-35 lg:block"
        aria-hidden
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold leading-8 lg:text-[48px] lg:leading-none lg:tracking-tight">
          Oops... Something went wrong
        </h1>
        <p className="text-base font-medium leading-6 text-muted-foreground lg:text-[18px] lg:font-normal lg:leading-6.5">
          An internal server error occurred. Our team is already aware and
          fixing the code. It&apos;ll be working again soon!
        </p>
      </div>

      <Button
        asChild
        className="h-13 w-full rounded-full bg-[#f14e1d] text-sm font-medium text-white hover:bg-[#f14e1d]/90 lg:w-88.5"
      >
        <Link href="/">View menu</Link>
      </Button>
    </div>
  );
}
