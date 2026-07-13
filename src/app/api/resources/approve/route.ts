import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getResourceForReview, publishResource } from "@/lib/resource-store";

// Publishes a draft resource. Posted from the review page's Approve button with
// the resource slug + its review token (the token is the authorization: only
// someone with the emailed link can approve). On success, flips status to
// published, refreshes the site cache, and redirects to the now-live post.
export async function POST(req: Request) {
  const form = await req.formData();
  const slug = String(form.get("slug") ?? "");
  const token = String(form.get("token") ?? "");
  if (!slug || !token) {
    return new NextResponse("Missing slug or token", { status: 400 });
  }

  const ok = await publishResource(slug, token);
  if (!ok) {
    // The token is single-use (cleared on publish), so a second click of the
    // same approve link lands here. If the post is already live, just send the
    // reviewer to it instead of showing an error.
    const existing = await getResourceForReview(slug);
    if (existing?.status === "published") {
      return NextResponse.redirect(new URL(`/resources/${slug}`, req.url), 303);
    }
    return new NextResponse("Could not publish (bad token or already gone)", {
      status: 400,
    });
  }

  revalidateTag("resources", "max");
  // 303 so the browser follows with a GET to the live post.
  return NextResponse.redirect(new URL(`/resources/${slug}`, req.url), 303);
}
