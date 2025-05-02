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
        <title>{"Cyclone Tracker Official Website"}</title>
        <meta
          name="description"
          content={"This is the official website of Cyclone Tracker  "}
        />
        <meta name="author" content={"Cyclone Tracker "} />
        <meta name="keywords" content="news, articles, updates, latest news" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph tags for social media sharing */}
        <meta
          property="og:title"
          content={"Cyclone Tracker  Official Website"}
        />
        <meta
          property="og:description"
          content={"This is the official website of Cyclone Tracker . "}
        />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Cyclone Tracker" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={"Cyclone Tracker  Official Website"}
        />
        <meta
          name="twitter:description"
          content={"This is the official website of Cyclone Tracker . "}
        />
        <meta name="twitter:site" content="@YourTwitterHandle" />

        {/* Structured Data (JSON-LD for SEO) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomePage",
            headline: "Cyclone Tracker  Official Website",
            author: "Cyclone Tracker  Office",
            datePublished: new Date().toISOString(),
            image: "",
            publisher: {
              "@type": "Organization",
              name: "Cyclone Tracker ",
              logo: {
                "@type": "ImageObject",
                url: "https://barangaydicklum.web.app/favicon.ico", // ✅ Fix double https
              },
            },
            description: "This is the official website of Cyclone Tracker . ",
          })}
        </script>
      </Helmet>

      <div style={{ minHeight: "100vh" }}>
        <Suspense fallback={<></>}>
          <Navigation_main />
          <HeroSection_main />
          <div className="container">
          
            <Weather_main />
            <AboutTropicalCyclones />
            <CallToAction />
          </div>
          <Footer_main />
        </Suspense>
      </div>
    </>
  );
}
