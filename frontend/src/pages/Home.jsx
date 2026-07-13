import Hero from "../components/landing/Hero";
import PlatformCards from "../components/landing/PlatformCards";
import Statistics from "../components/landing/Statistics";
import IDEPreview from "../components/landing/IDEPreview";
import AIPreview from "../components/landing/AIPreview";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";
import FAQ from "../components/landing/FAQ";

export default function Home() {
  return (
    <>
      <Hero />

      <PlatformCards />

      <Statistics />

      <IDEPreview />

      <AIPreview />

      <Features />

      <Pricing />

      <FAQ />
    </>
  );
}

