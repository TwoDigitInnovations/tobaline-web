import React from "react";

export default function AboutUs() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundColor: "#D9D9D9",
          backgroundImage:
            'url(\'data:image/svg+xml;utf8,\
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">\
          <filter id="n">\
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4"/>\
          </filter>\
          <rect width="100%" height="100%" filter="url(%23n)" opacity="0.25"/>\
        </svg>\')',
        }}
      />
      <section className="relative h-screen ">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-200 to-stone-100"></div>
        <div className="absolute inset-0 ">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('./images/aboutusmainimage.png')",
            }}
          ></div>
        </div>
        <div className="relative z-10 flex justify-center items-center flex-col px-4 mx-auto max-w-5xl">
          <h1 className="text-center mt-20 text-3xl md:text-[64px] italic font-light text-stone-800 mb-6 tracking-wide">
            A Tale From The Depth Of
            <br />
            Nature.
          </h1>
          <p className="text-lg md:text-[28px] text-[#1E1E1E]  font-light ">
            Elegance with roots. ToBa Line
          </p>
          <p className="mt-60 text-[20px] md:text-[24px] text-[#1E1E1E] text-center px-4">
            We researched the origin of the material, tracing the path of
            natural fibers from their pure sources, and we believed that purity
            is not just a characteristic, but a commitment that begins with the
            supplier and ends in your hands.
          </p>
        </div>
      </section>

      <section className="md:py-16 py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 w-[80%]">
            <h2 className="md:text-[48px] text-3xl  underline font-light text-stone-800 mb-6">
              Our Story
            </h2>
            <p className="text-[20px] md:text-[22px] text-stone-600 mb-4">
              At Table lace, we all know Ocean conservation. how, the
              sustainable option is hard to reach. Our family has operated in
              the apparel brand, where nature's bounty is both a treasure and a
              responsibility. We feel blessed to be surrounded by such natural
              beauty. However, we often witness the tension between the woman
              who depends on the sea for their livelihood and the need to
              preserve its delicate ecosystems. Whether or not they mention one
              of the earth.
            </p>
          </div>
          <div className="relative flex justify-end w-fit order-1 md:order-1">
            <img
              src="./images/aboutus-img-4.png"
              alt="aboutus-img"
              className="absolute -left-30 top-40 w-75 object-cover z-10"
            />

            <img
              src="./images/aboutus-img-6.png"
              alt="aboutus-img"
              className="relative z-0 h-[500px] w-auto object-cover "
            />
          </div>
        </div>
      </section>

      <section className="md:py-16 py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-end w-fit ">
            <img
              src="./images/aboutus-img-3.png"
              alt="aboutus-img"
              className="absolute -right-20 bottom-0 w-65 object-cover z-10"
            />

            <img
              src="./images/aboutus-img-5.png"
              alt="aboutus-img"
              className="relative z-0 h-[500px] w-auto object-cover "
            />
          </div>
          <div>
            <h2 className="md:text-[48px] text-3xl  underline font-light text-stone-800 mb-6">
              Our Vision
            </h2>
            <p className="text-[20px] md:text-[22px] text-stone-600 mb-4">
              We envision a world where fashion and sustainability are not
              mutually exclusive. As a brand, we aspire to create an ethical
              business standard, inspired a lifestyle based on principle like
              kindness, mindfulness and love for the planet. We believe that
              every choice we make, no matter how small, can have a profound
              impact on the world around us. By choosing sustainable, we are not
              just buying clothes. We are making a statement about the kind of
              world we want to live in and the legacy we want to leave behind.
            </p>
          </div>
        </div>
      </section>

      <section className="md:py-16 py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="md:text-[48px] text-3xl  underline font-light text-stone-800 mb-6">
              Proudly Sustainable
            </h2>
            <p className="text-[20px] md:text-[22px] text-stone-600 mb-4 w-[90%]">
              Table lace pride in sourcing materials and producing garments that
              are not only beautiful but also ethically made. From the luxurious
              Irish lace to the sustainable fabrics we choose, every element in
              our collection reflects our commitment to environmental
              responsibility. Each piece is created with love and care, ensuring
              that it not only looks beautiful but also feels good to wear. We
              are dedicated and transparent in sourcing and established process
              is tailored to those who value luxury as much as they value the
              planet. By prioritizing sustainability, we aim to set a new
              standard in the fashion industry that proves that style and
              environmental consciousness can coexist harmoniously. We also
              hope, for also making and raising awareness to every layer that
              with our production process, is made of their resources wisely,
              and contribute better future for generations to come.
            </p>
          </div>
          <div className="relative flex justify-end w-fit order-1 md:order-1">
            <img
              src="./images/aboutus-img-1.png"
              alt="aboutus-img"
              className="absolute -left-20 -top-30 h-[400px] w-auto object-cover  z-10"
            />

            <img
              src="./images/aboutus-img-2.png"
              alt="aboutus-img"
              className="relative z-0 h-[400px] w-auto object-cover "
            />
          </div>
        </div>
      </section>

      <section className="md:py-10 py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-4 md:gap-16">
          <div className="text-center w-25">
            <div className="w-20 h-20 mx-auto mb-3 bg-white border border-black border-dotted rounded-full flex items-center justify-center">
              <img
                src="/images/aboutus-icon3.png"
                alt="Environment conscious"
                className="w-14 h-auto text-stone-600"
              />
            </div>
            <p className="text-xs text-stone-500">Environment conscious</p>
          </div>
          <div className="text-center w-25">
            <div className="w-20 h-20 mx-auto mb-3 bg-white border border-black border-dotted rounded-full flex items-center justify-center">
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
            <div className="w-20 h-20 mx-auto mb-3 bg-white border border-black border-dotted rounded-full flex items-center justify-center">
              <img
                src="/images/aboutus-icon1.png"
                alt="Environment conscious"
                className="w-14 h-auto text-stone-600"
              />
            </div>
            <p className="text-xs text-stone-500">Handmade</p>
          </div>
        </div>
      </section>
    </div>
  );
}
