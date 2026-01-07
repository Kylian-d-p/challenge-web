import { getSession } from "@/lib/session";
import { Button } from "../ui/button";
import HeaderNav from "./header-nav";

export default async function Header() {
  const session = await getSession();

  console.log(session);
  return (
    <header className="w-full bg-background shadow-sm border-b h-16 flex items-center sticky top-0 z-50">
      <div className="flex items-center gap-3 px-4 justify-between w-full">
        <Button className="text-xl font-bold text-foreground" variant={"link"}>
          Fit&Flex
        </Button>
        <HeaderNav user={session?.user} />
      </div>
    </header>
  );
}
