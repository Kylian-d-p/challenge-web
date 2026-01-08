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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-5">
        <h1 className="font-bold text-2xl">Programmation</h1>
        <Dialog open={addScheduledCourseFormOpen} onOpenChange={setAddScheduledCourseFormOpen}>
          <DialogTrigger asChild>
            <Button variant={"secondary"} size={"icon"}>
              <Plus />
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
      <div className="w-full flex items-center justify-between">
        <Button
          onClick={() =>
            setDayOfWeek((c) => {
              if (c === 0) return 6;
              return c - 1;
            })
          }
        >
          <ChevronLeft />
        </Button>
        <span className="mx-4 font-bold">{dayjs().weekday(dayOfWeek).format("dddd")}</span>
        <Button
          onClick={() =>
            setDayOfWeek((c) => {
              if (c === 6) return 0;
              return c + 1;
            })
          }
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="flex flex-col gap-2 items-center p-2">
        {props.activities.length === 0 ? (
          <span className="text-muted-foreground">Aucune activité disponible. Veuillez en ajouter dans la section activités.</span>
        ) : calculatedScheduledCourses.length === 0 ? (
          <span className="text-muted-foreground">Aucune session programmée pour ce jour.</span>
        ) : (
          calculatedScheduledCourses.map((sc) => {
            const activity = props.activities.find((a) => a.id === sc.activityId);
            if (!activity) return null;
            return (
              <div key={sc.id} className="w-full p-4 border shadow rounded-lg flex flex-col relative">
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <Dialog
                    open={editScheduledCourseFormsOpened[sc.id] || false}
                    onOpenChange={(open) => {
                      setEditScheduledCourseFormsOpened((prev) => ({ ...prev, [sc.id]: open }));
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant={"secondary"} size={"icon"}>
                        <EditIcon />
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
                <div>
                  <h2 className="font-bold text-lg">{activity?.name}</h2>
                  <p className="text-sm text-muted-foreground">Durée : {activity?.duration} minutes</p>
                </div>
                <div className="mt-2 md:mt-0 text-sm text-muted-foreground">
                  <p>
                    Heure de début :{" "}
                    {Math.floor(sc.startTime / 3600)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {Math.floor((sc.startTime % 3600) / 60)
                      .toString()
                      .padStart(2, "0")}
                  </p>
                  <p>Capacité : {sc.capacity} participants</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
