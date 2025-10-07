import OpengraphImage from "@/components/opengraph-image";

export const runtime = "nodejs"; // forces Node runtime
export const dynamic = "force-static"; // guarantees SSG

export default async function Image() {
  return await OpengraphImage();
}
