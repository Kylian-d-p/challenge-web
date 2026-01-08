"use server";

import { env } from "@/lib/env";
import s3Client from "@/lib/s3";
import { getSession } from "@/lib/session";
import { formSchemas } from "@/lib/types";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createSafeActionClient } from "next-safe-action";

export default createSafeActionClient()
  .inputSchema(formSchemas.listMedias)
  .action(async ({ parsedInput }) => {
    const session = await getSession();

    if (!session) {
      return { error: "Non autorisé" };
    }

    try {
      const res = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Prefix: `${process.env.NEXT_PUBLIC_AWS_ROOT_DIRECTORY}/`,
          MaxKeys: 15,
          ContinuationToken: parsedInput.nextContinuationToken,
        })
      );

      return {
        medias:
          res.Contents?.map((item) => item.Key)
            .filter((key) => key !== undefined && key !== `${env.NEXT_PUBLIC_AWS_ROOT_DIRECTORY}/`)
            .map((item) => `https://${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${item}`) || [],
        nextContinuationToken: res.NextContinuationToken || null,
      };
    } catch (e) {
      console.error("Erreur lors de la récupération des médias");
      console.error(e);
      return { error: "Erreur lors de la récupération des médias" };
    }
  });
