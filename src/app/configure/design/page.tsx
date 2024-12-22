import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function Page(props: { searchParams: SearchParams }) {
  const { id } = await props.searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) return notFound();

  const { height, width, imageUrl } = configuration;

  return (
    <DesignConfigurator
      configId={id}
      imageDimensions={{ width, height }}
      imageUrl={imageUrl}
    />
  );
}

export default Page;
