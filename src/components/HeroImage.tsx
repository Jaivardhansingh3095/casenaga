import Phone from "./Phone";

function HeroImage() {
  return (
    <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
      <div className="relative md:max-w-xl ">
        <img
          src="/your-image.png"
          alt="your custom image on phone case"
          className="absolute w-40 lg:w-52  left-56 -top-20 select-none hidden sm:block lg:hidden xl:block"
        />
        <img
          src="/line.png"
          className="absolute w-20 -left-6 -bottom-6 select-none"
          alt="line-image"
        />
        <Phone className="w-64" imgSrc="/testimonials/1.jpg" />
      </div>
    </div>
  );
}

export default HeroImage;
