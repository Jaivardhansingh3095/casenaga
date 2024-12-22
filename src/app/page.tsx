import CustomersReviews from "@/components/CustomersReviews";
import DemoImageToCase from "@/components/DemoImageToCase";
import HeroContent from "@/components/HeroContent";
import HeroImage from "@/components/HeroImage";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  return (
    <div className="bg-slate-50">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <HeroContent />

          <HeroImage />
        </MaxWidthWrapper>
      </section>

      {/* Value proposition section */}
      <CustomersReviews />

      {/* Case selling section*/}
      <DemoImageToCase />
    </div>
  );
}
