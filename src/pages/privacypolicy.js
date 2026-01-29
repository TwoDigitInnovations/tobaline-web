import React from "react";
import Head from "next/head";
const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>

          {/* Intro */}
          <p className="text-md mb-8 leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect your information when you use our website.
          </p>

          {/* Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              1. Information We Collect
            </h2>
            <p className="text-md leading-relaxed">
              We may collect personal information such as your name, email
              address, phone number, and any other information you voluntarily
              provide when you interact with our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-md leading-relaxed">
              The information we collect is used to provide, maintain, and
              improve our services, communicate with you, and ensure a secure
              experience on our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. Data Protection</h2>
            <p className="text-md leading-relaxed">
              We implement appropriate security measures to protect your
              personal data against unauthorized access, alteration, or
              disclosure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              4. Third-Party Services
            </h2>
            <p className="text-md leading-relaxed">
              We do not sell or rent your personal information to third parties.
              However, we may use trusted third-party services to help operate
              our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              5. Changes to This Policy
            </h2>
            <p className="text-md leading-relaxed">
              We reserve the right to update this Privacy Policy at any time.
              Changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
            <p className="text-md leading-relaxed">
              If you have any questions about this Privacy Policy, please
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

export default PrivacyPolicy;
