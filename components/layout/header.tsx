import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="w-full bg-background shadow-sm border-b h-16 flex items-center">
      <div className="flex items-center max-w-7xl w-full mx-auto">
        <Button className="text-xl font-bold text-foreground" variant={"link"}>
          Fit&Flex
        </Button>
      </div>
    </header>
  );
}
