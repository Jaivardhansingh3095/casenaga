import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function Page(props: { searchParams: SearchParams }) {
  const { id } = await props.searchParams;
  if (!id || typeof id !== "string") return notFound();

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) return notFound();

  return <DesignPreview configuration={configuration} />;
}

export default Page;
