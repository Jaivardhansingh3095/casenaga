import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(
      z.object({
        configId: z.string().optional(),
      })
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      // If you throw, the user will not be able to upload
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      const { configId } = metadata.input;

      //fetching image url and generating image buffer
      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();

      //passing the buffer data to sharp and fetching image metadata
      const imgMetadata = await sharp(buffer).metadata();
      const { width, height } = imgMetadata;

      //If we do not have configId in first image upload step
      //we will create the configId
      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            imageUrl: file.url,
            width: width || 500,
            height: height || 500,
          },
        });

        return { configId: configuration.id };
      } else {
        //if we have already created configId then we will update the
        //cropped image url using latest file.url which we will get in
        //second step when we crop the image
        const configuration = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.url,
          },
        });

        return { configId: configuration.id };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
