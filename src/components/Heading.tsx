import Image from "next/image";

function Heading() {
  return (
    <>
      <div className="absolute w-28 left-0 -top-20 hidden lg:block">
        <Image
          src="/snake-1.png"
          width={112}
          height={146}
          quality={80}
          alt="casenaga-logo"
        />
      </div>
      <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text7xl">
        Your Image on a{" "}
        <span className="bg-green-600 px-2 text-white">Custom</span> phone case
      </h1>
      <p className="mt-8 text-lg lg:text-xl lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
        Capture your favorite memories with your own,{" "}
        <span className="font-semibold">one-of-one</span> phone case. CaseNaga
        allows you to protect your memories, not just your phone case
      </p>
    </>
  );
}

export default Heading;
