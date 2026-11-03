import React from "react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import TrustIndicators from "@/components/public/TrustIndicators";
import FeaturedVideoSection from "@/components/public/FeaturedVideoSection";
import AboutSection from "@/components/public/AboutSection";
import TransformationsSection from "@/components/public/TransformationsSection";
import PackagesSection from "@/components/public/PackagesSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import FaqSection from "@/components/public/FaqSection";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";

// Revalidate data dynamically on each request
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    site,
    navItems,
    sectionsList,
    packages,
    transformations,
    featuredVideo,
    testimonials,
    faqs,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.navigationItem.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.sectionContent.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.coachingPackage.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.clientTransformation.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.featuredVideoSettings.findUnique({ where: { id: "default" } }),
    prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.faqItem.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
  ]);

  // Map sections by sectionKey for easy lookup
  const sectionsMap = new Map(sectionsList.map((s) => [s.sectionKey, s]));

  const heroSec = sectionsMap.get("hero");
  const trustSec = sectionsMap.get("trust");
  const aboutSec = sectionsMap.get("about");
  const transSec = sectionsMap.get("transformations");
  const packagesSec = sectionsMap.get("packages");
  const testimonialsSec = sectionsMap.get("testimonials");
  const faqSec = sectionsMap.get("faq");
  const contactSec = sectionsMap.get("contact");

  const phone = site?.whatsappInternational || "+201140108262";
  const localPhone = site?.whatsappLocal || "01140108262";

  return (
    <main className="relative flex flex-col min-h-screen">
      {/* 1. Navigation */}
      <Navbar
        brandName={site?.brandName}
        logoText={site?.logoText}
        logoUrl={site?.logoUrl}
        whatsappPhone={phone}
        navItems={navItems}
      />

      {/* 2. Hero Section */}
      <Hero
        title={heroSec?.title}
        subtitle={heroSec?.subtitle || undefined}
        badge={heroSec?.badge}
        body={heroSec?.body}
        primaryButtonText={heroSec?.primaryButtonText}
        primaryButtonLink={heroSec?.primaryButtonLink}
        secondaryButtonText={heroSec?.secondaryButtonText}
        secondaryButtonLink={heroSec?.secondaryButtonLink || "/#results"}
        imageUrl={heroSec?.imageUrl}
        statsJson={heroSec?.statsJson}
      />

      {/* 3. Trust Indicators */}
      {trustSec?.isVisible !== false && (
        <TrustIndicators
          title={trustSec?.title}
          subtitle={trustSec?.subtitle || undefined}
          badge={trustSec?.badge}
        />
      )}

      {/* 4. Single Large Featured Service Video (Cinematic 16:9 Breakdown) */}
      {featuredVideo?.isVisible !== false && (
        <FeaturedVideoSection
          title={featuredVideo?.title}
          subtitle={featuredVideo?.subtitle}
          description={featuredVideo?.description}
          videoType={featuredVideo?.videoType}
          videoUrl={featuredVideo?.videoUrl}
          thumbnailUrl={featuredVideo?.thumbnailUrl}
          ctaLabel={featuredVideo?.ctaLabel}
          ctaUrl={featuredVideo?.ctaUrl}
          showHeadline={featuredVideo?.showHeadline}
          showDescription={featuredVideo?.showDescription}
          showCta={featuredVideo?.showCta}
          playMode={featuredVideo?.playMode}
          autoplay={featuredVideo?.autoplay}
          videoWidth={featuredVideo?.videoWidth}
          backgroundGradient={featuredVideo?.backgroundGradient}
          isVisible={featuredVideo?.isVisible}
        />
      )}

      {/* 5. About Coach Boyka */}
      {aboutSec?.isVisible !== false && (
        <AboutSection
          title={aboutSec?.title}
          subtitle={aboutSec?.subtitle || undefined}
          badge={aboutSec?.badge}
          body={aboutSec?.body}
          imageUrl={aboutSec?.imageUrl}
          secondaryImageUrl={aboutSec?.secondaryImageUrl}
          primaryButtonText={aboutSec?.primaryButtonText}
          primaryButtonLink={aboutSec?.primaryButtonLink}
          statsJson={aboutSec?.statsJson}
        />
      )}

      {/* 6. Client Transformations (Before & After Interactive Comparison) */}
      {transSec?.isVisible !== false && (
        <TransformationsSection
          title={transSec?.title}
          subtitle={transSec?.subtitle || undefined}
          badge={transSec?.badge}
          transformations={transformations}
          whatsappPhone={phone}
        />
      )}

      {/* 7. Coaching Packages & Pricing */}
      {packagesSec?.isVisible !== false && (
        <PackagesSection
          title={packagesSec?.title}
          subtitle={packagesSec?.subtitle || undefined}
          badge={packagesSec?.badge}
          packages={packages}
          whatsappPhone={phone}
          packageTemplate={site?.whatsappPackageTemplate}
        />
      )}

      {/* 8. Testimonials */}
      {testimonialsSec?.isVisible !== false && (
        <TestimonialsSection
          title={testimonialsSec?.title}
          subtitle={testimonialsSec?.subtitle || undefined}
          badge={testimonialsSec?.badge}
          testimonials={testimonials}
        />
      )}

      {/* 9. FAQ */}
      {faqSec?.isVisible !== false && (
        <FaqSection
          title={faqSec?.title}
          subtitle={faqSec?.subtitle || undefined}
          badge={faqSec?.badge}
          faqs={faqs}
          whatsappPhone={phone}
        />
      )}

      {/* 10. Contact & VIP WhatsApp CTA */}
      {contactSec?.isVisible !== false && (
        <ContactSection
          title={contactSec?.title}
          subtitle={contactSec?.subtitle || undefined}
          badge={contactSec?.badge}
          whatsappPhone={phone}
          whatsappLocal={localPhone}
          contactEmail={site?.contactEmail}
          location={site?.location}
          workingHours={site?.workingHours}
        />
      )}

      {/* 11. Footer */}
      <Footer
        brandName={site?.brandName}
        logoText={site?.logoText}
        logoUrl={site?.logoUrl || "/images/logo-boyka.png"}
        whatsappPhone={phone}
        whatsappLocal={localPhone}
      />
    </main>
  );
}
