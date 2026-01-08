"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchemas } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { updateProfileAction } from "./action";

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
  };
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchemas.updateProfile),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchemas.updateProfile>) => {
    const res = await updateProfileAction(values);

    if (res?.serverError) {
      toast.error(res.serverError.message);
      return;
    }

    if (res?.data?.success) {
      toast.success(res.data.message);
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="border-b pb-4 mb-6">
        <h1 className="font-bold text-3xl md:text-4xl">Mon compte</h1>
        <p className="text-muted-foreground text-sm mt-1">Gérez vos informations personnelles</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nom
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="votre@email.com" type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Modification du mot de passe</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Pour modifier votre mot de passe, veuillez contacter l&apos;administrateur système.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
