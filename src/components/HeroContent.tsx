import ProductFeatures from "./ProductFeatures";
import CustomersCount from "./CustomersCount";
import Heading from "./Heading";

function HeroContent() {
  return (
    <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
      <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
        <Heading />

        <ProductFeatures />

        <CustomersCount />
      </div>
    </div>
  );
}

export default HeroContent;
