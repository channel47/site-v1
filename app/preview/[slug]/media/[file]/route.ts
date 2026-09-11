import { getEditorialPreviewImage } from "@/lib/editorial-preview";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: {
  params: Promise<{ slug: string; file: string }>;
}) {
  const { slug, file } = await params;
  const image = getEditorialPreviewImage(slug, file);
  if (!image) return new Response(null, { status: 404 });

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
