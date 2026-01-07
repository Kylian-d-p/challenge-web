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
};
