import React from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen ">
      <section className="relative flex flex-col items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 bg-[url('/images/geminibg.png')] bg-cover bg-center "></div>

        <div className="relative z-10 text-center max-w-4xl mb-16">
          <h2 className="text-3xl lg:text-[48px] font-serif text-stone-800 mb-6">
            {t("When Luxury Meets The Purity of Nature")}.
          </h2>
          <div className="w-[80%] h-px bg-stone-400 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl font-serif italic text-stone-700 mb-12">
            {t("Rooted in purity. Designed beyond time")}.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/Collection")}
              className="px-8 py-2 bg-[#FFF6ED] border-2 border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white cursor-pointer transition-colors duration-300"
            >
              {t("Explore the Collection")}
            </button>
            <button
              onClick={() => router.push("/Sustainability")}
              className="px-8 py-2 bg-[#FFF6ED] border-2 border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white cursor-pointer   transition-colors duration-300"
            >
              {t("Our story")}
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4 mb-12 ">
          {[
            {
              img: "/images/Rectangle3.png",
              title: "Pure Materials",
              subtitle: "Ethically Sourced",
              bg: "from-stone-100 to-white",
            },
            {
              img: "/images/Rectangle2.png",
              title: "Conscious Elegance",
              subtitle: "Woven for Tomorrow",
              bg: "from-amber-50 to-white",
            },
            {
              img: "/images/Rectangle1.png",
              title: "Sustainable Luxury",
              subtitle: "Crafted to Last",
              bg: "from-stone-50 to-white",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white md:h-[450px] rounded-lg  shadow-lg transform hover:scale-105 transition-transform duration-300 "
            >
              <div
                className={`relative bg-gradient-to-br ${card.bg} flex items-center justify-center`}
              >
                {/* Image */}
                <div className=" bg-white rounded-full shadow-inner flex items-center justify-center">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="max-w-full max-h-full object-cover"
                  />
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                  <h3 className="text-[20px] font-serif text-stone-800 mb-1">
                    {t(card.title)}
                  </h3>
                  <p className="text-black">{t(card.subtitle)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 relative z-10 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-black text-sm tracking-widest">
            {t("SCROLL DOWN")}
          </p>
          <ChevronDown className="text-black" size={24} />
        </div>
      </section>
    </div>
  );
}
