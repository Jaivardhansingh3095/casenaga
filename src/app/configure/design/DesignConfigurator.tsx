"use client";

import { Description, Radio, RadioGroup } from "@headlessui/react";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import uniqueFilename from "unique-filename";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import HandleComponent from "@/components/HandleComponent";
import { BASE_PRICE } from "@/config/products";
import { cn, formatPrice } from "@/lib/utils";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option-validators";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { SaveConfigArgs, saveConfig } from "./actions";
import { useRouter } from "next/navigation";

//Mentioning colors explicity in order to use them dynamically in tailwind
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colorVariants = {
  black: "bg-zinc-900 border-zinc-900",
  blue: "bg-blue-900 border-blue-900",
  rose: "bg-rose-900 border-rose-900",
};

function base64ToBlob(base64: string, mimeType: string) {
  //Old way for converting image string data  to Unit8Array
  // const byteCharacters = atob(base64);
  // const byteNumbers = new Array(byteCharacters.length);

  // for (let i = 0; i < byteCharacters.length; i++) {
  //   byteNumbers[i] = byteCharacters.charCodeAt(i);
  // }
  // const byteArray = new Uint8Array(byteNumbers);

  const byteArray = Buffer.from(base64, "base64");

  return new Blob([byteArray], { type: mimeType });
}

interface DesignConfiguratorProps {
  configId: string;
  imageDimensions: { width: number; height: number };
  imageUrl: string;
}

function DesignConfigurator({
  configId,
  imageDimensions,
  imageUrl,
}: DesignConfiguratorProps) {
  const router = useRouter();

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });

  const [renderPosition, setRenderPosition] = useState({
    x: 150,
    y: 205,
  });

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { user } = useKindeBrowserClient();

  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

  //Updating the cropped-image and phone case config data
  const { mutate: updateConfig } = useMutation({
    mutationKey: ["save-congfig"],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), saveConfig(args)]);
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: "Unable to update the configuration data",
        description: "There was an error on our end. Please try again",
        variant: "destructive",
      });
    },
  });

  async function saveConfiguration() {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width: caseWidth,
        height: caseHeight,
      } = phoneCaseRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      //Here the rendered position of dragable image is relative to container div and not the page.
      // Ww will remove the offset distance between case and container from the rendered position of image.
      // We will create a canvas and drow the canvas on the image. We will use the same width and height of phone case for canvas.
      // We will get the position canvas wrt image by subtracting the offset distance which we calculated earlier from the rendered position of image
      // This will give us the index of canvas with height and width
      // Once we get the image url in string format through base64, and further convert it in image file using blob function.
      // Finally we will update the file to server with filename wrt signed user

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderPosition.x - leftOffset;
      const actualY = renderPosition.y - topOffset;

      //Creating canvas in order to draw the cropped image on phone case
      const canvas = document.createElement("canvas");
      canvas.width = caseWidth;
      canvas.height = caseHeight;
      const ctx = canvas.getContext("2d");

      //Creating new img element
      const userImage = document.createElement("img");
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      const base64 = canvas.toDataURL();

      const base64Data = base64.split(",")[1];
      const blob = base64ToBlob(base64Data, "image/png");

      //File name will be generated for signed-in user and guest users respectively
      let filename;
      if (!user?.email) {
        filename = uniqueFilename("filename-") + ".png";
      } else {
        filename =
          user.email?.slice(0, user.email?.indexOf("@")) + `-cropped-image.png`;
      }

      const file = new File([blob], filename, { type: "image/png" });

      //uploading file to servers
      await startUpload([file], { configId });

      toast({
        title: "File Uploaded Successfully",
        variant: "default",
      });
    } catch {
      toast({
        title: "Something went wrong!",
        description:
          "There was a problem saving your congfig, please try again",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      {/*  Container for case and Image  */}
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-center p-12 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <Image
              src="/phone-template.png"
              fill
              alt="phone image"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px bottom-px right-[3px] rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px bottom-px right-[3px] rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>
        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          className="absolute z-20 border-[3px] border-primary"
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension((prev) => ({
              ...prev,
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            }));

            setRenderPosition((prev) => ({ ...prev, x, y }));
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderPosition((prev) => ({ ...prev, x, y }));
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              fill
              alt="your image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>

      {/* phone case features customization section */}
      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8 ">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize your case
            </h2>

            <div className="w-full h-px bg-zinc-200 my-6" />

            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(val) =>
                    setOptions((prev) => ({ ...prev, color: val }))
                  }
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <Radio
                        key={color.label}
                        value={color}
                        className={`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-0 active:ring-2 focus:ring-2 active:outline-none focus:outline-none border-2 border-transparent data-[checked]:border-${color.tw}`}
                      >
                        <span
                          className={cn(
                            `bg-${color.tw} `,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() =>
                            setOptions((prev) => ({ ...prev, model }))
                          }
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectedOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) =>
                        setOptions((prev) => ({ ...prev, [name]: val }))
                      }
                    >
                      <Label>
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className="mt-3 space-y-4">
                        {selectedOptions.map((option) => (
                          <Radio
                            key={option.label}
                            value={option}
                            className="relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between data-[checked]:border-primary"
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioGroup.Label as="span">
                                  {option.label}
                                </RadioGroup.Label>

                                {option.description ? (
                                  <Description
                                    as="span"
                                    className="text-gray-500"
                                  >
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </Description>
                                ) : null}
                              </span>
                            </span>

                            <Description
                              as="span"
                              className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            >
                              <span className="font-medium text-gray-900">
                                {formatPrice(option.price)}
                              </span>
                            </Description>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center sm:w-1/2 md:w-1/2 lg:w-full">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  BASE_PRICE + options.finish.price + options.material.price
                )}
              </p>
              <Button
                onClick={() =>
                  updateConfig({
                    configId,
                    color: options.color.value,
                    model: options.model.value,
                    material: options.material.value,
                    finish: options.finish.value,
                  })
                }
                size="sm"
                className="w-full"
              >
                Continue <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignConfigurator;
