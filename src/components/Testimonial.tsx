import { Check, Star } from "lucide-react";
import Image from "next/image";

function Testimonial() {
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16">
      <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
        <div className="flex gap-0.5 mb-2">
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
        </div>
        <div className="text-lg leading-8">
          <p>
            &quot;The case feels durable and I even got a compliment on the
            design. Had the case for two and a half months now and{" "}
            <span className="p-0.5 bg-slate-800 text-white">
              the image is super clear
            </span>
            , on the case I had before, the image stated fading into yellow-ish
            color after a couple weeks. Love it.&quot;
          </p>
        </div>
        <div className="flex gap-4 mt-2 ">
          <Image
            src="/users/user-1.png"
            width={50}
            height={50}
            className="rounded-full object-cover"
            alt="user-1"
          />

          <div className="flex flex-col">
            <p className="font-semibold">Jonathan</p>
            <div className="flex gap-1.5 items-center text-zinc-600">
              <Check className="h-4 w-4 stroke-[3px] text-green-600" />
              <p className="text-sm">Verified Purchase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Second user review*/}
      <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
        <div className="flex gap-0.5 mb-2">
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
        </div>
        <div className="text-lg leading-8">
          <p>
            &quot;I usually keep my phone together with my keys in my pocket and
            led to some pretty heavy scratchmarks on all of my last phone cases.
            This one, besides a barely noticeable scratch on the corner,{" "}
            <span className="p-0.5 bg-slate-800 text-white">
              looks brand new after about half a year
            </span>
            . I dig it.&quot;
          </p>
        </div>
        <div className="flex gap-4 mt-2 ">
          <Image
            src="/users/user-4.jpg"
            width={50}
            height={50}
            className="rounded-full object-cover"
            alt="user-2"
          />

          <div className="flex flex-col">
            <p className="font-semibold">Max</p>
            <div className="flex gap-1.5 items-center text-zinc-600">
              <Check className="h-4 w-4 stroke-[3px] text-green-600" />
              <p className="text-sm">Verified Purchase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
