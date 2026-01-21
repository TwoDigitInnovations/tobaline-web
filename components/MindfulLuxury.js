import React from "react";

const MindfulLuxury = () => {
  return (
    <div className="bg-[#C5C5BA] px-6 py-10 md:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative md:h-87.5 ">
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden
                        w-full h-64
                        md:absolute md:-bottom-16 md:left-0 md:h-72 md:w-87.5"
            >
              <img
                src="./images/image2.png"
                alt="Silk cocoons"
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden
                        w-full h-64 mt-6
                        md:mt-0 md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:h-72 md:w-87.5"
            >
              <img
                src="./images/image1.png"
                alt="Silk fabric texture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 text-center md:text-left md:mt-20">
            <h1 className="text-4xl md:text-6xl font-serif text-stone-700">
              Mindful Luxury
            </h1>
            <p className="text-stone-600 leading-relaxed text-base md:text-lg">
              Sustainable, ethical, and designed to last. Our Toba line
              certified silk is free from harmful chemicals, our packaging
              is plastic-free, and we repurpose fabric offcuts to reduce waste.
              Indulge in comfort and sustainability without compromise.
            </p>
          </div>
        </div>

        <div className="text-center space-y-6 rounded-2xl p-6 md:p-12">
          <div className="text-6xl md:text-9xl font-serif text-stone-700">
            100%
          </div>
          <p className="text-stone-600 leading-relaxed text-base md:text-lg max-w-4xl mx-auto">
            OOur fabrics are hand-selected from some of the world’s most revered textile artisans, chosen not only for their superior quality, but for their alignment with our values. Every material we use is ethically, environmentally, and socially responsible, allowing us to create with care and integrity. This is conscious luxury, where sustainability meets softness, and every thread tells a story of love. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default MindfulLuxury;
