import OpengraphImage from "@/components/opengraph-image";
import { getPage } from "@/lib/firebase/storefront";

export const runtime = "edge";

export default async function Image({ params }: { params: { page: string } }) {
  const page = await getPage(params.page);
  const title = page?.seo?.title || page?.title || "Aldo Website Shop";

  return await OpengraphImage({ title });
}
