import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/session";
import { Calendar, Dumbbell, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default async function Home() {
  const session = await getSession();
  return (
    <main>
      {/* Hero */}
      <section className="bg-linear-to-b from-primary/5 to-background pt-8 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="mx-auto w-fit">
            <Image src="/images/logo.png" alt="logo" width={300} height={300} />
          </div>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transformez votre corps et votre esprit avec Fit&Flex. Réservez vos cours en ligne et rejoignez une communauté passionnée de fitness.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/planning">
              <Button size="lg">Réserver un cours</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-3">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Planning flexible</h3>
              <p className="text-muted-foreground">Réservez vos cours à tout moment, 24h/24</p>
            </Card>

            <Card className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Cours variés</h3>
              <p className="text-muted-foreground">Yoga, CrossFit, Pilates et bien plus encore</p>
            </Card>

            <Card className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Coachs experts</h3>
              <p className="text-muted-foreground">Des professionnels certifiés à votre écoute</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-18 bg-primary/5 mt-18">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold">Commencez aujourd&apos;hui</h2>
          <p className="text-lg text-muted-foreground">Créez votre compte et réservez votre premier cours gratuitement</p>
          {session ? (
            <Link href="/planning">
              <Button size="lg">Planning</Button>
            </Link>
          ) : (
            <Link href="/auth/signup">
              <Button size="lg">Créer mon compte</Button>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
