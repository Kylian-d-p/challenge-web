import { env } from "@/lib/env";
import s3Client from "@/lib/s3";
import { getSession } from "@/lib/session";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return new Response(JSON.stringify({ error: "Aucun fichier fourni" }), { status: 400 });
  }

  if (typeof file !== "object" || !(file instanceof File)) {
    return new Response(JSON.stringify({ error: "Fichier invalide" }), { status: 400 });
  }

  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return new Response(JSON.stringify({ error: "Type de fichier non pris en charge" }), { status: 400 });
  }

  try {
    const filename = uuid() + (file.name ? `.${file.name.split(".").pop()}` : "");

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: `${env.NEXT_PUBLIC_AWS_ROOT_DIRECTORY}/medias/${filename}`,
        Body: fileBuffer,
        ContentType: file.type,
        ACL: "public-read",
      })
    );

    return new Response(
      JSON.stringify({
        message: "Fichier uploadé avec succès",
        url: `https://${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${env.NEXT_PUBLIC_AWS_ROOT_DIRECTORY}/medias/${filename}`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier");
    console.error(error);
    return new Response(JSON.stringify({ error: "Erreur lors de l'upload du fichier" }), { status: 500 });
  }
}
