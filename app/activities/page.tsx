import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import {
  Activity,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mapping d'icônes par type d'activité (basé sur le nom)
const getIconForActivity = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes("yoga")) return Heart;
  if (nameLower.includes("crossfit") || nameLower.includes("force"))
    return Dumbbell;
  if (nameLower.includes("hiit") || nameLower.includes("cardio")) return Zap;
  if (nameLower.includes("pilates")) return Target;
  if (nameLower.includes("cycling") || nameLower.includes("rpm"))
    return TrendingUp;
  if (nameLower.includes("boxe") || nameLower.includes("combat")) return Flame;
  return Activity;
};

// Mapping de couleurs par type d'activité
const getColorForActivity = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes("yoga"))
    return { text: "text-purple-500", bg: "bg-purple-500/10" };
  if (nameLower.includes("crossfit") || nameLower.includes("force"))
    return { text: "text-orange-500", bg: "bg-orange-500/10" };
  if (nameLower.includes("hiit") || nameLower.includes("cardio"))
    return { text: "text-yellow-500", bg: "bg-yellow-500/10" };
  if (nameLower.includes("pilates"))
    return { text: "text-green-500", bg: "bg-green-500/10" };
  if (nameLower.includes("cycling") || nameLower.includes("rpm"))
    return { text: "text-blue-500", bg: "bg-blue-500/10" };
  if (nameLower.includes("boxe") || nameLower.includes("combat"))
    return { text: "text-red-500", bg: "bg-red-500/10" };
  return { text: "text-primary", bg: "bg-primary/10" };
};

export default async function ProgrammesPage() {
  const activities = await prisma.activities.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Nos Programmes
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez notre large gamme de programmes adaptés à tous les
              objectifs et niveaux. De la détente au dépassement de soi, trouvez
              votre voie.
            </p>
          </div>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Aucune activité disponible pour le moment.
              </p>
              <Link href="/" className="mt-4 inline-block">
                <Button variant="outline">Retour à l&apos;accueil</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => {
                const Icon = getIconForActivity(activity.name);
                const colors = getColorForActivity(activity.name);
                const durationInMinutes = Math.floor(activity.duration / 60);

                return (
                  <Card
                    key={activity.id}
                    className="hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {activity.imageUrl && (
                      <div className="relative w-full h-48">
                        <Image
                          src={activity.imageUrl}
                          alt={activity.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div
                        className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}
                      >
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                      <CardTitle className="text-2xl">
                        {activity.name}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {activity.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{durationInMinutes}Heures</span>
                      </div>

                      <Link href="/planning" className="block pt-2">
                        <Button className="w-full">Voir le planning</Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Prêt à vous lancer ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Consultez notre planning et réservez votre premier cours dès
            maintenant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/planning">
              <Button size="lg" className="text-lg px-8">
                Voir le planning
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
