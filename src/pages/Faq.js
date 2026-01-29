import React from "react";
import Head from "next/head";

const Faq = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What kind of products do you offer?",
      answer:
        "We offer a curated range of sustainable and handcrafted products made from natural fabrics like cotton, silk, and linen, including handwoven and embroidered pieces created by skilled artisans.",
    },
    {
      question: "Are your products handmade?",
      answer:
        "Yes, all our products are handmade or hand-finished by experienced artisans, ensuring uniqueness, quality, and attention to detail in every piece.",
    },
    {
      question: "How do you ensure sustainability?",
      answer:
        "We focus on eco-friendly materials, ethical sourcing, low-waste production processes, and support traditional handcraft techniques to minimize environmental impact.",
    },
    {
      question: "Do you use natural fabrics only?",
      answer:
        "Yes, our collections primarily use natural fabrics such as cotton, silk, and linen, chosen for their comfort, durability, and reduced environmental footprint.",
    },
    {
      question: "Are the products ethically sourced?",
      answer:
        "Absolutely. We work closely with artisans and small production units, ensuring fair wages, safe working conditions, and respect for traditional craftsmanship.",
    },
    {
      question: "How should I care for handmade fabrics?",
      answer:
        "We recommend gentle hand wash or dry cleaning for most items, using mild detergents to maintain fabric quality and extend the life of your garments.",
    },
    {
      question: "Do you support artisans and local communities?",
      answer:
        "Yes, supporting artisan communities is at the heart of our brand. Every purchase helps preserve traditional crafts and provides sustainable livelihoods.",
    },
    {
      question: "Why choose sustainable handmade products?",
      answer:
        "Sustainable handmade products are not only better for the environment but also offer superior craftsmanship, timeless design, and a meaningful story behind every item.",
    },
  ];

  return (
    <>
      <Head>
        <title>Shop Everyday Essentials at Tobaline Today</title>
        <meta
          name="description"
          content="Tobaline offers top-quality Clothes!"
        />
        <link rel="canonical" href="" />
      </Head>

      <section className="md:mt-0 mt-14 w-full flex flex-col items-center justify-center min-h-[700px] px-4">
        <div className="w-full max-w-5xl">
          <div className="mb-10">
            <h2 className="text-5xl font-semibold text-neutral-900 text-center md:text-start mb-4">
              Most asked FAQ's
            </h2>
            <p className="text-neutral-800 max-w-md text-lg text-center md:text-start mx-auto md:mx-0">
              We're here to help you and solve doubts. Find answers to the most
              common questions below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                onClick={() => toggleFAQ(index)}
                className={`bg-slate-50 p-3.5 rounded-lg cursor-pointer transition-all duration-300 border border-slate-200 hover:bg-slate-100 ${openIndex === index ? "row-span-2" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-neutral-800">
                    {faq.question}
                  </span>
                  <div
                    className={`text-slate-400 p-1 rounded transition-colors ${openIndex === index ? "bg-slate-200 text-slate-500" : "hover:bg-slate-300 hover:text-slate-500"}`}
                  >
                    {openIndex === index ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-minus"
                      >
                        <path d="M5 12h14" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-plus"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    )}
                  </div>
                </div>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-lg text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
