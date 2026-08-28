import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Research } from "@/components/sections/Research";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/ui/Footer";
import { DynamicScene, DynamicScrollJourney } from "@/components/ui/DynamicImports";

export default function Home() {
  return (
    <>
      <DynamicScene />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <DynamicScrollJourney />
      <Research />
      <Skills />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
