"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import AddActivityForm from "./upsert-activity/form";

export default function AddActivityButton() {
  const [createActivityDialogOpen, setCreateActivityDialogOpen] = useState(false);
  return (
    <Dialog open={createActivityDialogOpen} onOpenChange={setCreateActivityDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une activité</DialogTitle>
          <DialogDescription>Remplissez le formulaire pour ajouter une nouvelle activité.</DialogDescription>
        </DialogHeader>
        <AddActivityForm
          onSubmit={() => {
            setCreateActivityDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
