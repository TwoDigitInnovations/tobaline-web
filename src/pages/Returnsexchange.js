import React from "react";
import Head from "next/head";
import SEO from "../../components/SEO";
import { useTranslation } from "react-i18next";

const ReturnExchangePolicy = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title="Returns & Exchange Policy | Tobaline"
        description="Read Tobaline’s returns and exchange policy for a hassle-free shopping experience."
        canonical="/Returnsexchange"
      />

      <div className="min-h-screen bg-white text-black px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 border-b border-black pb-4">
            {t("Return & Exchange Policy")}
          </h1>

          <p className="text-md mb-8 leading-relaxed">
            {t("We want you to be completely satisfied with your purchase. Please read our exchange and return conditions carefully")}.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">1. {t("Exchange Policy")}</h2>
            <p className="text-md leading-relaxed">
              {t("Exchange requests are available within")} <strong>{t("3 days")}</strong> {t("of receiving the order")}.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              2. {t("Return / Refund Policy")}
            </h2>
            <p className="text-md leading-relaxed">
              {t("Return or refund requests are accepted within")}{" "}
              <strong>{t("24 hours")}</strong> {t("of receiving the order")}.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. {t("Conditions")}</h2>
            <ul className="list-disc pl-6 text-md leading-relaxed space-y-2">
              <li>
                {t("Items must be in their original condition (unworn, unwashed, with tags)")}.
              </li>
              <li>{t("The original packaging must be intact")}.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">4. {t("Exclusions")}</h2>
            <p className="text-md leading-relaxed">
              {t("For hygiene reasons, customized pieces or items with altered sizes are not eligible for exchange or return")}.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. {t("Fees")}</h2>
            <p className="text-md leading-relaxed">
              {t("Delivery fees are non-refundable. A pickup or delivery fee will apply for exchange requests")}.
            </p>
          </section>

          <p className="text-sm mt-12 border-t border-black pt-4">
            {t("Last updated: March 2026")}
          </p>
        </div>
      </div>
    </>
  );
};

export default ReturnExchangePolicy;
