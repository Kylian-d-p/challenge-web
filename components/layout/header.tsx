import { getSession } from "@/lib/session";
import Link from "next/link";
import { Button } from "../ui/button";
import HeaderNav from "./header-nav";

export default async function Header() {
  const session = await getSession();
  return (
    <header className="w-full bg-background shadow-sm border-b h-16 flex items-center sticky top-0 z-50">
      <div className="flex items-center gap-3 px-4 justify-between w-full">
        <Link href={"/"}>
          <Button
            className="text-xl font-bold text-foreground"
            variant={"link"}
          >
            Fit&Flex
          </Button>
        </Link>
        <HeaderNav user={session?.user} />
      </div>
    </header>
  );
}
