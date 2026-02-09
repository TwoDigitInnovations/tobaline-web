import axios from "axios";

const DOMAIN = "https://www.tobaline.com";

const staticPages = [
  { url: `${DOMAIN}/`, priority: 1.0 },
  { url: `${DOMAIN}/aboutus`, priority: 0.8 },
  { url: `${DOMAIN}/Collection`, priority: 0.8 },
  { url: `${DOMAIN}/Contactus`, priority: 0.7 },
  { url: `${DOMAIN}/Faq`, priority: 0.6 },
  { url: `${DOMAIN}/shippingInfo`, priority: 0.6 },
  { url: `${DOMAIN}/Returnsexchange`, priority: 0.6 },
  { url: `${DOMAIN}/privacypolicy`, priority: 0.5 },
  { url: `${DOMAIN}/termsConditions`, priority: 0.5 },
  { url: `${DOMAIN}/Sustainability`, priority: 0.5 },

  { url: `${DOMAIN}/login`, priority: 0.3 },
  { url: `${DOMAIN}/signup`, priority: 0.3 },
  { url: `${DOMAIN}/forgotpassword`, priority: 0.3 },
  { url: `${DOMAIN}/account`, priority: 0.3 },
  { url: `${DOMAIN}/Editprofile`, priority: 0.3 },
  { url: `${DOMAIN}/myorder`, priority: 0.3 },
  { url: `${DOMAIN}/MyHistory`, priority: 0.3 },
  { url: `${DOMAIN}/Cart`, priority: 0.2 },
];

function generateSiteMap(products, categories) {
  const now = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join("")}

 
  ${products
    .map(
      (p) => `
  <url>
    <loc>${DOMAIN}/product-details/${p.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")}


  ${categories
    .map(
      (c) => `
  <url>
    <loc>${DOMAIN}/Collection/${c.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")}

</urlset>`;
}

const SiteMap = () => null;

export async function getServerSideProps({ res }) {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get("https://api.tobaline.com/product/getProduct"),
      axios.get("https://api.tobaline.com/category/getCategories"),
    ]);

    const products = productsRes.data?.data || [];
    const categories = categoriesRes.data?.data || [];

    const sitemap = generateSiteMap(products, categories);

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Sitemap generation failed:", error);
  }

  return { props: {} };
}

export default SiteMap;
