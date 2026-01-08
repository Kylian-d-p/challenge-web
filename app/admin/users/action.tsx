"use server";

import prisma from "@/lib/prisma";
import { createSafeAction } from "@/lib/safe-actions";
import { isAdmin } from "@/lib/server-actions-middleware";
import { z } from "zod";

const getUsersSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().default(20),
});

export const getUsersAction = createSafeAction
  .use(isAdmin)
  .inputSchema(getUsersSchema)
  .action(async ({ parsedInput }) => {
    const { cursor, limit } = parsedInput;

    const users = await prisma.users.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    let nextCursor: string | undefined = undefined;
    if (users.length > limit) {
      const nextItem = users.pop();
      nextCursor = nextItem?.id;
    }

    return {
      users,
      nextCursor,
      hasMore: !!nextCursor,
    };
  });
