"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteActivityAction } from "./action";

export default function DeleteActivity(props: { activityId: string }) {
  return (
    <Button
      variant={"destructive"}
      onClick={async () => {
        const res = await deleteActivityAction({ id: props.activityId });

        if (res.serverError) {
          toast.error(res.serverError.message);
          return;
        }
      }}
    >
      <Trash />
    </Button>
  );
}
