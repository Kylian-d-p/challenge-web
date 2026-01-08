"use client";

import ImageSelector from "@/components/forms/image-selector/image-selector";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formSchemas } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { upsertActivityAction } from "./action";

export default function UpsertActivityForm(props: {
  defaultValues?: { id: string; name: string; description: string; imageUrl: string; duration: string };
  onSubmit?: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(formSchemas.upsertActivity),
    defaultValues: {
      id: props.defaultValues?.id || "",
      description: props.defaultValues?.description || "",
      duration: props.defaultValues?.duration || "60",
      imageUrl: props.defaultValues?.imageUrl || "",
      name: props.defaultValues?.name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchemas.upsertActivity>) => {
    const res = await upsertActivityAction(values);

    if (res.serverError) {
      toast.error(res.serverError.message);
      return;
    }

    props.onSubmit?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'activité" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description de l'activité" autoComplete="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              {field.value ? (
                <Image src={field.value} alt="Image sélectionnée" width={150} height={150} className="max-h-40 rounded object-contain" />
              ) : null}
              <FormControl>
                <ImageSelector
                  onChange={(image) => {
                    field.onChange(image);
                  }}
                  defaultValue={field.value}
                  mode="single"
                >
                  <Button variant="secondary" className="flex-1 h-10 flex flex-col gap-2 w-full">
                    {field.value ? "Modifier l'image" : "Ajouter une image"}
                  </Button>
                </ImageSelector>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée (min)</FormLabel>
              <FormControl>
                <Input placeholder="Durée" autoComplete="duration" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting}>{props.defaultValues ? "Modifier l'activité" : "Ajouter l'activité"}</Button>
      </form>
    </Form>
  );
}
