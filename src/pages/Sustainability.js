import React from "react";
import Head from "next/head";
import SEO from "../../components/SEO";
import { useRouter } from "next/router";

function Sustainability() {
  const router = useRouter();
  const sustainabilityData = [
    {
      title: "Mindful Sourcing",
      image: "/images/sustanbility4.png",
      description: "We select only purest, organically grown fibers.",
      largeText: true,
    },
    {
      title: "Ethical Craftsmanship",
      image: "/images/sustanbility3.png",
      description: "We minimize our environmental footprint in every step.",
    },
    {
      title: "Low Impact Process",
      image: "/images/sustanbility1.png",
      description: "We craft pieces that endure, embodying sustainable luxury.",
    },
    {
      title: "Timeless Quality",
      image: "/images/sustanbility2.png",
      description: "We craft pieces that endure, embodying sustainable luxury.",
    },
  ];

  return (
    <>
      <SEO
        title="Sustainability at Tobaline"
        description="Discover how Tobaline is committed to sustainability and responsible practices."
        canonical="/sustainability"
      />

      <div className=" min-h-screen -mt-20">
        <section className="pt-44 min-h-screen relative flex flex-col items-center justify-center px-4 ">
          <div className="absolute inset-0 bg-[url('/images/Imagehomepage.png')] bg-cover md:bg-top bg-center  "></div>

          <div className="relative z-10 text-center max-w-4xl mb-16">
            <h2 className="text-3xl lg:text-[48px] font-serif text-stone-800 mb-6 ">
              Sustainability
            </h2>
            <div className="w-[80%] h-px bg-stone-400 mx-auto mb-6"></div>
            <p className="text-xl md:text-[32px] font-serif italic text-stone-700 mb-12">
              Luxury, Woven with Purpose.
            </p>
            <div className="flex flex-col gap-4 justify-center">
              <p className="text-xl md:text-2xl font-serif  text-stone-700 mb-12">
                At ToBa line, sustainability isn’t just a commitment - it’s a
                craft. We weave elegance with ethics, ensuring our pieces honor
                the earth as much as they adorn the body.
              </p>
            </div>
            <button className="px-8 py-2 bg-[#DFD3C578]  border-2 border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white cursor-pointer   transition-colors duration-300"
            onClick={()=> router.push("/aboutus")}
            >
              Learn More
            </button>
          </div>
        </section>

        <div className="bg-[#C5C5BA] mb-16 py-16">
          <div className="grid grid-cols-1 max-w-7xl mx-auto md:grid-cols-2 gap-8">
            {sustainabilityData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center"
              >
                {/* Heading */}
                <h2 className="md:text-3xl text-2xl font-bold font-serif mb-3 text-[#575743]">
                  {item.title}
                </h2>

                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {/* Text */}
                <div className="p-6 text-center">
                  <p
                    className={`text-[#575743] md:text-[28px] text-[20px] md:w-[80%] mx-auto`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto bg-white mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Content */}
            <div className="p-12 flex flex-col justify-center items-center gap-8">
              <h2 className="text-4xl font-serif mb-2 text-[#575743]">
                Elegance with Ethics
              </h2>
              <p className="text-stone-700 mb-2 text-[18px] md:text-[28px]">
                Every Toås Line is a testament to purity and purpose. From the
                purest, ethically sourced fibers to our eco - conscious
                production, we ensure our luxury is light on the earth.
              </p>

              <div className="flex justify-center items-center md:gap-8 gap-4">
                <div className="text-center w-25">
                  <div className="w-18 h-18 mx-auto mb-3 bg-white border border-black border-dotted rounded-full flex items-center justify-center">
                    <img
                      src="/images/aboutus-icon3.png"
                      alt="Environment conscious"
                      className="w-14 h-auto text-stone-600"
                    />
                  </div>
                  <p className="text-xs text-stone-500">
                    Environment conscious
                  </p>
                </div>
                <div className="text-center w-25">
                  <div className="w-18 h-18 mx-auto mb-3 bg-white border border-black border-dotted rounded-full flex items-center justify-center">
                    <img
                      src="/images/aboutus-icon2.png"
                      alt="Environment conscious"
                      className="w-14 h-auto text-stone-600"
                    />
                  </div>
                  <p className="text-xs text-stone-500">
                    Small to medium scale production
                  </p>
                </div>
                <div className="text-center w-25">
                  <div className="w-18 h-18 mx-auto mb-3 bg-white border border-black border-dotted rounded-full flex items-center justify-center">
                    <img
                      src="/images/aboutus-icon1.png"
                      alt="Environment conscious"
                      className="w-14 h-auto text-stone-600"
                    />
                  </div>
                  <p className="text-xs text-stone-500">Handmade</p>
                </div>
              </div>

              <button className="text-center border-2 border-stone-800 text-stone-800 px-8 py-2 hover:bg-stone-800 hover:text-white cursor-pointer transition-colors w-fit"
               onClick={()=> router.push("/aboutus")}
              >
                Read More
              </button>
            </div>

            <div className="h-full min-h-96">
              <img
                src="./images/sustanbility12.png"
                alt="Woman in white dress in nature"
                className="w-full h-[400px] object-contain md:h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sustainability;
