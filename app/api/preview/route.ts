import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Récupérer les paramètres
  const secret = searchParams.get("secret");
  const url = searchParams.get("url");
  const status = searchParams.get("status");

  // Vérifier le secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  // Vérifier que l'URL est fournie
  if (!url) {
    return new Response("URL parameter is required", { status: 400 });
  }

  // Activer le draft mode de Next.js
  const draft = await draftMode();
  draft.enable();

  // Log pour debug
  console.log("✅ Preview mode activé pour:", url, "- Status:", status || "published");

  // Rediriger vers la page demandée
  redirect(url);
}
