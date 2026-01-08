import z from "zod";

const types = {
  email: z.string("L'adresse e-mail est invalide").min(1, "L'adresse e-mail est requise"),
  password: z
    .string("Veuillez entrer un mot de passe valide")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .max(100, "Le mot de passe ne peut pas contenir plus de 100 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{6,}$/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    ),
};

export const formSchemas = {
  login: z.object({
    email: types.email,
    password: types.password,
  }),
  signup: z
    .object({
      name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas contenir plus de 100 caractères"),
      email: types.email,
      password: types.password,
      passwordc: types.password,
    })
    .superRefine(({ password, passwordc }, ctx) => {
      if (password !== passwordc) {
        ctx.addIssue({
          code: "custom",
          message: "Les mots de passe ne correspondent pas",
          path: ["passwordc"],
        });
      }
    }),
  upsertScheduledCourse: z.object({
    id: z.string().optional(),
    activityId: z.string("L'ID de l'activité est invalide"),
    dayOfWeek: z
      .string()
      .refine((value) => !isNaN(Number(value)))
      .refine(
        (value) => {
          const num = Number(value);
          return num >= 0 && num <= 6;
        },
        { message: "Le jour de la semaine est invalide" }
      ),
    startTime: z
      .string()
      .refine((value) => !isNaN(Number(value)))
      .refine(
        (value) => {
          const num = Number(value);
          return num >= 0 && num <= 86400;
        },
        { message: "L'heure de début est invalide" }
      ),
    capacity: z
      .string()
      .refine((value) => !isNaN(Number(value)), { message: "La capacité doit être un nombre valide" })
      .refine(
        (value) => {
          const num = Number(value);
          return num > 0 && num <= 1000;
        },
        { message: "La capacité doit être comprise entre 1 et 1000" }
      ),
  }),
  upsertActivity: z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas contenir plus de 100 caractères"),
    description: z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères")
      .max(1000, "La description ne peut pas contenir plus de 1000 caractères"),
    imageUrl: z.url("L'URL de l'image est invalide"),
    duration: z
      .string()
      .refine((value) => !isNaN(Number(value)), {
        message: "La durée doit être un nombre valide",
      })
      .refine((value) => value === "" || (Number(value) > 0 && Number(value) <= 1440), {
        message: "La durée doit être comprise entre 1 et 1440 minutes",
      }),
  }),
  deleteActivity: z.object({
    id: z.string("L'ID de l'activité est invalide"),
  }),
  deleteScheduledCourse: z.object({
    id: z.string("L'ID de la session programmée est invalide"),
  }),
  listMedias: z.object({
    nextContinuationToken: z.string().optional(),
  }),
  getScheduledCourses: z.object({
    dayOfWeek: z
      .string()
      .refine((value) => !isNaN(Number(value)))
      .refine(
        (value) => {
          const num = Number(value);
          return num >= 0 && num <= 6;
        },
        { message: "Le jour de la semaine est invalide" }
      ),
  }),
  updateProfile: z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas contenir plus de 100 caractères"),
    email: types.email,
  }),
};
