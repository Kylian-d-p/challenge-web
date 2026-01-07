import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "./form";

export default function LoginPage() {
  return (
    <main>
      <Card className="shadow-none border-none md:shadow-sm md:border md:max-w-2xl mx-auto mt-4">
        <CardHeader className="flex flex-col items-center">
          <Image src="/images/logo.png" alt="Fit&Flex Logo" width={100} height={100} />
          <CardTitle>
            <h1 className="text-3xl font-bold">Inscription</h1>
          </CardTitle>
          <CardDescription>Bienvenue, veuillez vous inscrire.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="text-center mt-4">
            <span className="text-muted-foreground">Déjà un compte ? </span>
            <Link href="/auth/login">
              <Button variant={"link"} size={"text"}>
                Se connecter
              </Button>
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
