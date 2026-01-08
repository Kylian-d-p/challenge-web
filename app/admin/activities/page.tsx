import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Image from "next/image";
import { redirect } from "next/navigation";
import AddActivityButton from "./add-activity-button";
import UpsertActivityForm from "./upsert-activity/form";

export default async function ActivitiesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const activities = await prisma.activities.findMany();

  return (
    <main className="max-w-7xl w-full mx-auto p-6 mt-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight">Activités disponibles</h1>
            <p className="text-muted-foreground mt-2">Gérez vos activités et créez de nouvelles expériences</p>
          </div>
          <AddActivityButton />
        </div>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground text-lg mb-4">Aucune activité disponible</p>
            <p className="text-sm text-muted-foreground">Commencez par créer votre première activité</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <Dialog key={activity.id}>
                <DialogTrigger className="cursor-pointer" asChild>
                  <div className="group bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={activity.imageUrl}
                        alt={activity.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {activity.duration} min
                      </div>
                    </div>
                    <div className="p-5">
                      <h2 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{activity.name}</h2>
                      <p className="text-muted-foreground text-sm line-clamp-2">{activity.description}</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier l&apos;activité</DialogTitle>
                    <DialogDescription>Modifiez les informations de l&apos;activité sélectionnée.</DialogDescription>
                  </DialogHeader>
                  <UpsertActivityForm
                    defaultValues={{
                      id: activity.id,
                      name: activity.name,
                      description: activity.description,
                      imageUrl: activity.imageUrl,
                      duration: activity.duration.toString(),
                    }}
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
