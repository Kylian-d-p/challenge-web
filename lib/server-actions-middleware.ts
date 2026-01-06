import { createMiddleware } from "next-safe-action";
import { getSession } from "./session";

export const isAdmin = createMiddleware().define(async ({ next }) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Vous n'avez pas les autorisations requises");
  }

  return next({ ctx: { session } });
});

export const isAuthenticated = createMiddleware().define(async ({ next }) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  return next({ ctx: { session } });
});
