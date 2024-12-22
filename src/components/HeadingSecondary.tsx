import Image from "next/image";
import { Icons } from "./Icons";

function HeadingSecondary() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
      <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
        What our{" "}
        <span className="relative px-2">
          customers{" "}
          <Icons.underline className="hidden sm:block pointer-events-none absolute inset-x-0 -bottom-6 text-green-500" />
        </span>{" "}
        say
      </h2>

      <Image
        src="/snake-2.png"
        width={100}
        height={100}
        className="order-0 lg:order-2"
        alt="snake secondary logo"
      />
    </div>
  );
}

export default HeadingSecondary;
