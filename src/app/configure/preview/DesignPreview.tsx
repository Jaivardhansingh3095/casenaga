"use client";

import LoginModal from "@/components/LoginModal";
import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { useToast } from "@/hooks/use-toast";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS, MODELS } from "@/validators/option-validators";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Configuration } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { createChekoutSession } from "./action";
import { useRouter } from "next/navigation";

//this page is for preview
function DesignPreview({ configuration }: { configuration: Configuration }) {
  const [showConfetti, setShowConfetti] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useKindeBrowserClient();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setShowConfetti(true);

    function loadScript(src: string) {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.body.appendChild(script);
    }
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const { color, model, finish, material } = configuration;
  const tw = COLORS.find((matchedColor) => matchedColor.value === color)?.tw;
  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model
  )!;

  let totalPrice = BASE_PRICE;

  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;

  if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured;

  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createChekoutSession,
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    },
    onSuccess: ({ orderId, price }: { orderId: string; price: number }) => {
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: price,
        currency: "INR",
        name: "casenaga",
        description: "Custom iPhone case",
        image:
          "https://utfs.io/f/zXukaeWoVhcMipHyxa8LrWYGgXkoOKqZVvHCpQl13dMwzJFf",
        order_id: orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: (response: any) => {
          console.log(response);
          if (response.razorpay_order_id && response.razorpay_payment_id) {
            router.push(
              `/thank-you?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`
            );
          } else {
            router.push(`/configure/preview?id=${configuration.id}`);
          }
        },
        prefill: {
          name: `${user?.given_name} ${user?.family_name}`,
          email: user?.email,
          contact: "6375229522",
        },
        theme: {
          color: "#3399cc",
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const razorpayPayment = new (window as any).Razorpay(options);
      razorpayPayment.open();
    },
  });

  function handleCheckout() {
    if (user) {
      //create payment session
      console.log("proceed to payment");

      createPaymentSession({ configId: configuration.id });
    } else {
      //direct to login
      localStorage.setItem("configurationId", configuration.id);
      setIsLoginModalOpen(true);
    }
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      {/* <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        type="text/javascript"
      /> */}

      <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Phone
            imgSrc={configuration.croppedImageUrl!}
            className={cn(`bg-${tw}`)}
          />
        </div>

        <div className="mt-6 sm:col-span-9 sm:mt-0 md: row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock and ready to ship
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlight</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>Shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>

            <div>
              <p className="font-medium text-zinc-950 ">Materials</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, durable material</li>
                <li>Scratch and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE)}
                  </p>
                </div>

                {finish === "textured" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Textured finish</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured)}
                    </p>
                  </div>
                ) : null}
                {material === "polycarbonate" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Soft polycarbonate material</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate)}
                    </p>
                  </div>
                ) : null}

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order total</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button className="px-4 sm:px-6 lg:px-8" onClick={handleCheckout}>
                Check out <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DesignPreview;
