import Head from "next/head";

const SEO = ({ title, description, canonical }) => {
  const siteUrl = "https://www.tobaline.com";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}${canonical}`} />
    </Head>
  );
};

export default SEO;
