"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export default function HeaderNav(props: { user?: { name: string } }) {
  const pathname = usePathname();

  const navLinks = useMemo(
    () => [
      ...(pathname.startsWith("/admin")
        ? [
            {
              title: "Programme",
              href: "/admin/program",
            },
            {
              title: "Activités",
              href: "/admin/activities",
            },
            {
              title: "Réservations",
              href: "/admin/reservations",
            },
            {
              title: "Utilisateurs",
              href: "/admin/users",
            },
          ]
        : [
            {
              title: "Planning",
              href: "/planning",
            },
            {
              title: "Reservations",
              href: "/reservations",
            },
          ]),
      ...(props.user
        ? [
            {
              title: "Mon compte",
              href: "/account",
            },
          ]
        : [
            {
              title: "Connexion",
              href: "/auth/login",
            },
          ]),
    ],
    [pathname, props.user]
  );

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="md:hidden text-foreground" variant={"ghost"} size={"icon"}>
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Navigation principale</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col items-start gap-4 mt-4">
            {navLinks.map((link) => (
              <div key={link.href} className="border-b w-full">
                <Button className="text-foreground hover:text-primary" variant={"link"}>
                  <Link href={link.href}>{link.title}</Link>
                </Button>
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <nav className="hidden gap-6 md:flex">
        {navLinks.map((link) => (
          <Button key={link.href} className="text-foreground hover:text-primary" variant={"link"}>
            <Link href={link.href}>{link.title}</Link>
          </Button>
        ))}
      </nav>
    </>
  );
}
