import React from "react";
import Head from "next/head";
const TermsAndConditions = () => {
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
          <h1 className="text-4xl font-bold mb-6 border-b border-black pb-4">
            Terms & Conditions
          </h1>

          <p className="text-md mb-8 leading-relaxed">
            These Terms and Conditions govern your use of our website and
            services. By accessing or using our platform, you agree to comply
            with these terms. If you do not agree, please do not use our
            services.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              1. Use of Our Services
            </h2>
            <p className="text-md leading-relaxed">
              You agree to use our website and services only for lawful purposes
              and in a way that does not infringe the rights of others or
              restrict their use of the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              2. Intellectual Property
            </h2>
            <p className="text-md leading-relaxed">
              All content, designs, logos, text, graphics, and other materials
              on this website are owned by us and are protected by applicable
              intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              3. User Responsibilities
            </h2>
            <p className="text-md leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account information and for all activities that occur under your
              account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              4. Limitation of Liability
            </h2>
            <p className="text-md leading-relaxed">
              We shall not be liable for any direct, indirect, incidental, or
              consequential damages arising from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
            <p className="text-md leading-relaxed">
              We reserve the right to suspend or terminate access to our
              services at any time, without prior notice, if you violate these
              Terms and Conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
            <p className="text-md leading-relaxed">
              We may update these Terms and Conditions from time to time.
              Continued use of the website after changes indicates your
              acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              7. Contact Information
            </h2>
            <p className="text-md leading-relaxed">
              If you have any questions regarding these Terms and Conditions,
              please contact us at{" "}
              <span className="font-semibold">support@example.com</span>.
            </p>
          </section>

          <p className="text-sm mt-12 border-t border-black pt-4">
            Last updated: January 2026
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
