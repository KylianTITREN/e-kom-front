import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Désactiver le draft mode
  const draft = await draftMode();
  draft.disable();

  console.log("❌ Preview mode désactivé");

  // Rediriger vers la page d'accueil ou la page d'origine
  const { searchParams } = request.nextUrl;
  const returnUrl = searchParams.get("returnUrl") || "/";

  redirect(returnUrl);
}
