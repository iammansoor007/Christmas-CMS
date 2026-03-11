"use client";
import Hero from "../components/Hero";
import ChristmasLightingSection from "../components/servicesection";
import ChristmasLightingServices from "../components/ChristmasLightingServices";
import HowWeWorkSection from "../components/HowWeWorkSection";
import RecentWorkMarquee from "../components/RecentWorkMarquee";
import dynamic from "next/dynamic";

// Eagerly load above-the-fold components
// Lazy-load below-the-fold components for faster initial page load
const ChristmasLightingMap = dynamic(
  () => import("../components/ChristmasLightingMap"),
  { ssr: false }
);
const Testimonials = dynamic(
  () => import("../components/TestimonialCard"),
  { ssr: false }
);
const FAQSection = dynamic(
  () => import("../components/FAQSection"),
  { ssr: false }
);
const GetQuoteFormAdvanced = dynamic(
  () => import("./GetQuoteForm"),
  { ssr: false }
);

const Home = () => {
  return (
    <>
      <Hero />
      <ChristmasLightingSection />
      <ChristmasLightingServices />
      <HowWeWorkSection />
      <RecentWorkMarquee />
      <ChristmasLightingMap />
      <Testimonials id="testimonials" />
      <FAQSection />
      <GetQuoteFormAdvanced id="freequote" />
    </>
  );
};

export default Home;