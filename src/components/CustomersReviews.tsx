import CustomPhoneCasesAnimation from "./CustomPhoneCasesAnimation";
import HeadingSecondary from "./HeadingSecondary";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Testimonial from "./Testimonial";

function CustomersReviews() {
  return (
    <section className="bg-slate-100 py-24">
      <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-32">
        <HeadingSecondary />

        <Testimonial />
      </MaxWidthWrapper>

      <div className="pt-16">
        <CustomPhoneCasesAnimation />
      </div>
    </section>
  );
}

export default CustomersReviews;
