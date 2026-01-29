import React from "react";
import Head from "next/head";
const ReturnExchangePolicy = () => {
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
      <div className="min-h-screen bg-white text-black px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <h1 className="text-4xl font-bold mb-6 border-b border-black pb-4">
            Return & Exchange Policy
          </h1>

          {/* Intro */}
          <p className="text-md mb-8 leading-relaxed">
            We want you to be completely satisfied with your purchase. This
            Return & Exchange Policy explains the conditions under which returns
            and exchanges are accepted.
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              1. Eligibility for Returns
            </h2>
            <p className="text-md leading-relaxed">
              Products are eligible for return if they are unused, in original
              packaging, and returned within the specified return period from
              the date of delivery.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">2. Return Period</h2>
            <p className="text-md leading-relaxed">
              Returns must be initiated within <strong>7 days</strong> of
              receiving the product. Requests made after this period may not be
              accepted.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. Exchange Policy</h2>
            <p className="text-md leading-relaxed">
              Exchanges are allowed for defective or damaged products only.
              Exchange requests are subject to product availability.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              4. Non-Returnable Items
            </h2>
            <p className="text-md leading-relaxed">
              Certain items such as customized products, digital goods, or items
              marked as non-returnable are not eligible for return or exchange.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. Refund Process</h2>
            <p className="text-md leading-relaxed">
              Once your return is approved, refunds will be processed to the
              original payment method within 5–7 business days.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
            <p className="text-md leading-relaxed">
              If you have any questions regarding returns or exchanges, please
              contact us at{" "}
              <span className="font-semibold">support@example.com</span>.
            </p>
          </section>

          {/* Footer */}
          <p className="text-sm mt-12 border-t border-black pt-4">
            Last updated: January 2026
          </p>
        </div>
      </div>
    </>
  );
};

export default ReturnExchangePolicy;
