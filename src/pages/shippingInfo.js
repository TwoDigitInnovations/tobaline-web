import React from "react";
import Head from "next/head";
const ShippingInformation = () => {
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
            Shipping Information
          </h1>

          {/* Intro */}
          <p className="text-md mb-8 leading-relaxed">
            This Shipping Information page explains how orders are processed,
            shipped, and delivered when you purchase from our website.
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              1. Order Processing Time
            </h2>
            <p className="text-md leading-relaxed">
              All orders are processed within 1–3 business days after order
              confirmation. Orders are not shipped or delivered on weekends or
              public holidays.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              2. Shipping Methods & Delivery Time
            </h2>
            <p className="text-md leading-relaxed">
              We offer standard and express shipping options. Estimated delivery
              time depends on your location and the shipping method selected at
              checkout.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. Shipping Charges</h2>
            <p className="text-md leading-relaxed">
              Shipping charges are calculated at checkout based on your order
              value, shipping method, and delivery location. Any applicable fees
              will be clearly shown before payment.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">4. Order Tracking</h2>
            <p className="text-md leading-relaxed">
              Once your order has been shipped, you will receive a confirmation
              email with tracking details so you can monitor your shipment.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. Shipping Delays</h2>
            <p className="text-md leading-relaxed">
              Delivery delays may occur due to unforeseen circumstances such as
              weather conditions, courier issues, or high demand periods. We
              appreciate your patience in such cases.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
            <p className="text-md leading-relaxed">
              If you have any questions regarding shipping or delivery, please
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

export default ShippingInformation;
