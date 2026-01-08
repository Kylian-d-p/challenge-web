"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import AddScheduledCourseForm from "./add-scheduled-course/form";

dayjs.locale("fr");

export default function Program(props: { activities: { id: string; name: string; duration: number }[] }) {
  const [dayOfWeek, setDayOfWeek] = useState<number>(dayjs().day());
  const [addScheduledCourseFormOpen, setAddScheduledCourseFormOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="flex items-center gap-2">
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
        <span className="mx-4 font-bold">{dayjs().day(dayOfWeek).format("dddd")}</span>
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
      <div className="flex flex-col gap-2 items-center">
        {props.activities.length === 0 ? (
          <span className="text-muted-foreground">Aucune activité disponible. Veuillez en ajouter dans la section activités.</span>
        ) : (
          <span className="text-muted-foreground">La programmation des sessions sera affichée ici bientôt.</span>
        )}
      </div>
    </div>
  );
}
