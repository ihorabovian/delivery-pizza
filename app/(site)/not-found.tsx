import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import notFoundMascot from "@/public/not-found-mascot.svg";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-163.5 flex-col items-center gap-6 px-4 pt-16 text-center sm:px-8 lg:px-10">
      <div className="flex items-center justify-center gap-4">
        <span className="text-6xl font-extrabold leading-none text-foreground lg:text-[164px]">
          4
        </span>
        <Image
          src={notFoundMascot}
          alt=""
          className="h-23 w-22 lg:h-37 lg:w-35"
          aria-hidden
        />
        <span className="text-6xl font-extrabold leading-none text-foreground lg:text-[164px]">
          4
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold leading-8 lg:text-[32px] lg:leading-10">
          Oops, this page got lost in production...
        </h1>
        <p className="text-sm leading-6 text-muted-foreground lg:text-[18px] lg:leading-6.5">
          Page not found: it may have been removed during a merge request, or
          this endpoint is still in development.
        </p>
      </div>

      <Button
        variant="brand"
        size="xl"
        asChild
        className="w-full lg:w-88.5"
      >
        <Link href="/">View menu</Link>
      </Button>
    </div>
  );
}
