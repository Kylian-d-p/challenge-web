"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteScheduledCourseAction } from "./action";

export default function DeleteScheduledCourse(props: { scheduledCourseId: string }) {
  return (
    <Button
      variant={"destructive"}
      onClick={async () => {
        const res = await deleteScheduledCourseAction({ id: props.scheduledCourseId });

        if (res.serverError) {
          toast.error(res.serverError.message);
          return;
        }
      }}
      size={"icon"}
    >
      <Trash />
    </Button>
  );
}
