"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formSchemas } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { addScheduledCourseAction } from "./action";

export default function AddScheduledCourseForm(props: { activities: { id: string; name: string; duration: number }[]; onSubmit?: () => void }) {
  const form = useForm({
    resolver: zodResolver(formSchemas.addScheduledCourse),
    defaultValues: {
      activityId: "",
      dayOfWeek: "0",
      startTime: "0",
      capacity: "1",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchemas.addScheduledCourse>) => {
    const res = await addScheduledCourseAction(values);

    props.onSubmit?.();

    if (res.serverError) {
      toast.error(res.serverError.message);
      return;
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="activityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activité</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full" disabled={props.activities.length === 0}>
                        <SelectValue placeholder="Sélectionner une activité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {props.activities.map((activity) => (
                            <SelectItem value={activity.id} key={activity.id}>
                              {activity.name} - {activity.duration} min
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Link href="/admin/activities">
                      <Button type="button" variant={"ghost"} size={"icon"}>
                        <PlusIcon />
                      </Button>
                    </Link>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jour de la semaine</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un jour" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={"0"}>Lundi</SelectItem>
                        <SelectItem value={"1"}>Mardi</SelectItem>
                        <SelectItem value={"2"}>Mercredi</SelectItem>
                        <SelectItem value={"3"}>Jeudi</SelectItem>
                        <SelectItem value={"4"}>Vendredi</SelectItem>
                        <SelectItem value={"5"}>Samedi</SelectItem>
                        <SelectItem value={"6"}>Dimanche</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de début</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from({ length: 24 * 4 }).map((_, index) => {
                          const totalMinutes = index * 15;
                          const hours = Math.floor(totalMinutes / 60);
                          const minutes = totalMinutes % 60;
                          const seconds = totalMinutes * 60;
                          const displayTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                          return (
                            <SelectItem value={seconds.toString()} key={seconds}>
                              {displayTime}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacité</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting}>Programmer</Button>
        </form>
      </Form>
    </>
  );
}
