import React, { Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection_main from "./Components/HeroSection/HeroSection";
import FeaturedProduct from "./AboutTropical/AboutTropicalCyclones";
import CallToAction from "./Components/CallToAction/CallToAction";
import AboutTropicalCyclones from "./AboutTropical/AboutTropicalCyclones";
import Weather_main from "./Weather/Weather_main";



const Footer_main = lazy(() => import("../../navigations/Footer/Footer_main"));
const Navigation_main = lazy(() =>
  import("../../navigations/NavBar/Navigation_main")
);


export default function Home_main() {
  const url = window.location.href;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{"Bakester Mumshie Official Website"}</title>
        <meta
          name="description"
          content={"This is the official website of Bakester Mumshie "}
        />
        <meta name="author" content={"Bakester Mumshie Office"} />
        <meta name="keywords" content="news, articles, updates, latest news" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph tags for social media sharing */}
        <meta
          property="og:title"
          content={"Bakester Mumshie Official Website"}
        />
        <meta
          property="og:description"
          content={"This is the official website of Bakester Mumshie. "}
        />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Bakester Mumshie" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={"Bakester Mumshie Official Website"}
        />
        <meta
          name="twitter:description"
          content={"This is the official website of Bakester Mumshie. "}
        />
        <meta name="twitter:site" content="@YourTwitterHandle" />

        {/* Structured Data (JSON-LD for SEO) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomePage",
            headline: "Bakester Mumshie Official Website",
            author: "Bakester Mumshie Office",
            datePublished: new Date().toISOString(),
            image: "",
            publisher: {
              "@type": "Organization",
              name: "Bakester Mumshie",
              logo: {
                "@type": "ImageObject",
                url: "https://barangaydicklum.web.app/favicon.ico", // ✅ Fix double https
              },
            },
            description: "This is the official website of Bakester Mumshie. ",
          })}
        </script>
      </Helmet>

      <div style={{ minHeight: "100vh" }}>
        <Suspense fallback={<></>}>
          <Navigation_main />
          <HeroSection_main />
          <Weather_main/>
          <AboutTropicalCyclones/>
          <CallToAction />
          <Footer_main />
        </Suspense>
      </div>
    </>
  );
}
