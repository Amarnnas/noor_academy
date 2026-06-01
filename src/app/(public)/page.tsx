import { Hero } from "@/components/home/hero";
import { WhyUs } from "@/components/home/why-us";
import { CoursesPreview } from "@/components/home/courses-preview";
import { TestimonialSlider } from "@/components/testimonials/testimonial-slider";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyUs />
      <CoursesPreview />
      <TestimonialSlider />
      <CTASection />
    </>
  );
}
