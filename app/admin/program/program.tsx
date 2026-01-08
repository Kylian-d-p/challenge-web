"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import weekday from "dayjs/plugin/weekday";
import { ChevronLeft, ChevronRight, EditIcon, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import DeleteScheduledCourse from "./delete-scheduled-course/form";
import { default as AddScheduledCourseForm, default as UpsertScheduledCourseForm } from "./upsert-scheduled-course/form";

dayjs.locale("fr");
dayjs.extend(weekday);

export default function Program(props: {
  activities: { id: string; name: string; duration: number }[];
  scheduledCourses: { id: string; activityId: string; dayOfWeek: number; startTime: number; capacity: number }[];
}) {
  const [dayOfWeek, setDayOfWeek] = useState<number>(dayjs().weekday());
  const [addScheduledCourseFormOpen, setAddScheduledCourseFormOpen] = useState<boolean>(false);
  const [editScheduledCourseFormsOpened, setEditScheduledCourseFormsOpened] = useState<Record<string, boolean>>({});
  const calculatedScheduledCourses = useMemo(() => {
    return props.scheduledCourses.filter((sc) => sc.dayOfWeek === dayOfWeek);
  }, [dayOfWeek, props.scheduledCourses]);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto p-4 md:p-6">
      {/* En-tête avec titre et bouton d'ajout */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-bold text-3xl md:text-4xl">Programmation</h1>
          <p className="text-muted-foreground text-sm mt-1">Gérez vos sessions hebdomadaires</p>
        </div>
        <Dialog open={addScheduledCourseFormOpen} onOpenChange={setAddScheduledCourseFormOpen}>
          <DialogTrigger asChild>
            <Button variant={"default"} className="gap-2 shadow-md hover:shadow-lg transition-shadow">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvelle session</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programmer une session</DialogTitle>
              <DialogDescription>Remplissez le formulaire pour programmer une nouvelle session.</DialogDescription>
            </DialogHeader>
            <AddScheduledCourseForm activities={props.activities} onSubmit={() => setAddScheduledCourseFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Sélecteur de jour amélioré */}
      <div className="flex items-center justify-center gap-4 bg-linear-to-r from-primary/5 to-primary/10 p-6 rounded-xl border shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/20 transition-colors rounded-full"
          onClick={() =>
            setDayOfWeek((c) => {
              if (c === 0) return 6;
              return c - 1;
            })
          }
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="text-center min-w-50">
          <span className="text-2xl md:text-3xl font-bold capitalize block">{dayjs().weekday(dayOfWeek).format("dddd")}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/20 transition-colors rounded-full"
          onClick={() =>
            setDayOfWeek((c) => {
              if (c === 6) return 0;
              return c + 1;
            })
          }
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Liste des sessions */}
      <div className="flex flex-col gap-4">
        {props.activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground text-center max-w-md">
              Aucune activité disponible. Veuillez en ajouter dans la section activités pour commencer à programmer des sessions.
            </span>
          </div>
        ) : calculatedScheduledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
            <span className="text-muted-foreground text-center mb-4">Aucune session programmée pour ce jour.</span>
            <Button variant="outline" onClick={() => setAddScheduledCourseFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une session
            </Button>
          </div>
        ) : (
          calculatedScheduledCourses
            .sort((a, b) => a.startTime - b.startTime)
            .map((sc) => {
              const activity = props.activities.find((a) => a.id === sc.activityId);
              if (!activity) return null;
              return (
                <div
                  key={sc.id}
                  className="group w-full p-6 border-2 shadow-sm hover:shadow-md rounded-xl flex flex-col md:flex-row md:items-center gap-4 relative transition-all hover:border-primary/50 bg-card"
                >
                  {/* Badge d'heure */}
                  <div className="shrink-0 bg-primary/10 text-primary font-bold px-4 py-3 rounded-lg text-center min-w-25">
                    <div className="text-2xl">
                      {Math.floor(sc.startTime / 3600)
                        .toString()
                        .padStart(2, "0")}
                      :
                      {Math.floor((sc.startTime % 3600) / 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                    <div className="text-xs opacity-70">Début</div>
                  </div>

                  {/* Informations de l'activité */}
                  <div className="flex-1">
                    <h2 className="font-bold text-xl mb-1">{activity?.name}</h2>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Durée:</span> {activity?.duration} minutes
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Capacité:</span> {sc.capacity} participants
                      </span>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Dialog
                      open={editScheduledCourseFormsOpened[sc.id] || false}
                      onOpenChange={(open) => {
                        setEditScheduledCourseFormsOpened((prev) => ({ ...prev, [sc.id]: open }));
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="hover:bg-primary/10 hover:border-primary/50">
                          <EditIcon className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier la session</DialogTitle>
                          <DialogDescription>Modifiez les informations de la session ci-dessous.</DialogDescription>
                        </DialogHeader>
                        <UpsertScheduledCourseForm
                          activities={props.activities}
                          defaultValues={{
                            ...sc,
                            dayOfWeek: sc.dayOfWeek.toString(),
                            startTime: sc.startTime.toString(),
                            capacity: sc.capacity.toString(),
                          }}
                          onSubmit={() => {
                            setEditScheduledCourseFormsOpened((prev) => ({ ...prev, [sc.id]: false }));
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <DeleteScheduledCourse scheduledCourseId={sc.id} />
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
