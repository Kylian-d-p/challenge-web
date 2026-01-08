import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CRON_SECRET: z.string().min(1),
    AWS_ACCESS_KEY: z.string().min(1),
    AWS_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_AWS_BUCKET_NAME: z.string().min(1),
    NEXT_PUBLIC_AWS_REGION: z.string().min(1),
    NEXT_PUBLIC_AWS_ROOT_DIRECTORY: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CRON_SECRET: process.env.CRON_SECRET,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY_ID,
    NEXT_PUBLIC_AWS_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
    NEXT_PUBLIC_AWS_ROOT_DIRECTORY: process.env.NEXT_PUBLIC_AWS_ROOT_DIRECTORY,
  },
});
