const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Built By Boyka database seeding...");

  // 1. Admin User
  const defaultUsername = process.env.ADMIN_DEFAULT_USERNAME || "Boyka";
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Boyka1234";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // Clean up any old default admin accounts
  await prisma.adminUser.deleteMany({
    where: { username: { not: defaultUsername } },
  });

  const admin = await prisma.adminUser.upsert({
    where: { username: defaultUsername },
    update: { passwordHash },
    create: {
      username: defaultUsername,
      passwordHash,
      name: "Coach Boyka",
      email: "admin@builtbyboyka.com",
    },
  });
  console.log(`✓ Admin user configured: ${admin.username}`);

  // 2. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      brandName: "Built By Boyka",
      siteTitle: "Built By Boyka | Premium Coaching",
      tagline: "Forge Your Physique. Master Your Discipline.",
      logoText: "BUILT BY BOYKA",
      logoUrl: "/images/logo-boyka.png",
      faviconUrl: "/images/logo-boyka.png",
      whatsappLocal: "01140108262",
      whatsappInternational: "+201140108262",
      whatsappDefaultMessage: "Hello Built By Boyka, I would like to know more about your coaching services.",
      whatsappPackageTemplate: "Hello Built By Boyka, I'm interested in the [Package Name] package. Please send me more details.",
      whatsappServiceTemplate: "Hello Built By Boyka, I'm interested in [Service Name]. Could you provide more information?",
      whatsappFloatingEnabled: true,
      whatsappFloatingPosition: "bottom-right",
      contactEmail: "contact@builtbyboyka.com",
      contactPhone: "+201140108262",
      location: "Cairo, Egypt / Worldwide Online Coaching",
      workingHours: "Daily: 9:00 AM - 11:00 PM (GMT+2)",
    },
    create: {
      id: "default",
      brandName: "Built By Boyka",
      siteTitle: "Built By Boyka | Premium Coaching",
      tagline: "Forge Your Physique. Master Your Discipline.",
      logoText: "BUILT BY BOYKA",
      logoUrl: "/images/logo-boyka.png",
      faviconUrl: "/images/logo-boyka.png",
      whatsappLocal: "01140108262",
      whatsappInternational: "+201140108262",
      whatsappDefaultMessage: "Hello Built By Boyka, I would like to know more about your coaching services.",
      whatsappPackageTemplate: "Hello Built By Boyka, I'm interested in the [Package Name] package. Please send me more details.",
      whatsappServiceTemplate: "Hello Built By Boyka, I'm interested in [Service Name]. Could you provide more information?",
      whatsappFloatingEnabled: true,
      whatsappFloatingPosition: "bottom-right",
      contactEmail: "contact@builtbyboyka.com",
      contactPhone: "+201140108262",
      location: "Cairo, Egypt / Worldwide Online Coaching",
      workingHours: "Daily: 9:00 AM - 11:00 PM (GMT+2)",
    },
  });
  console.log("✓ Site settings seeded");

  // 3. Theme Settings & Presets
  const gradientPresets = [
    {
      id: "luminous-purple",
      name: "Luminous Violet (Logo Identity)",
      primary: "#7547F5",
      secondary: "#9B7BFF",
      accent: "#C9B9FF",
      background: "#05030a",
      cardBackground: "rgba(14, 9, 28, 0.75)",
      cardBorderColor: "rgba(155, 123, 255, 0.2)",
      gradient: "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
      glow: "rgba(117, 71, 245, 0.45)",
    },
    {
      id: "royal-amethyst",
      name: "Royal Amethyst",
      primary: "#8b5cf6",
      secondary: "#c084fc",
      accent: "#e9d5ff",
      background: "#07040d",
      cardBackground: "rgba(18, 10, 32, 0.8)",
      cardBorderColor: "rgba(192, 132, 252, 0.25)",
      gradient: "linear-gradient(135deg, #6b21a8 0%, #8b5cf6 50%, #c084fc 100%)",
      glow: "rgba(139, 92, 246, 0.4)",
    },
    {
      id: "cyber-lilac",
      name: "Cyber Lilac & Obsidian",
      primary: "#9B7BFF",
      secondary: "#5424D8",
      accent: "#F0EAFF",
      background: "#040207",
      cardBackground: "rgba(12, 7, 24, 0.8)",
      cardBorderColor: "rgba(155, 123, 255, 0.3)",
      gradient: "linear-gradient(135deg, #9B7BFF 0%, #7547F5 45%, #5424D8 100%)",
      glow: "rgba(155, 123, 255, 0.45)",
    },
    {
      id: "deep-violet-glow",
      name: "Deep Violet Shadow",
      primary: "#5424D8",
      secondary: "#7547F5",
      accent: "#C9B9FF",
      background: "#030206",
      cardBackground: "rgba(10, 6, 20, 0.85)",
      cardBorderColor: "rgba(117, 71, 245, 0.25)",
      gradient: "linear-gradient(135deg, #37149e 0%, #5424D8 50%, #7547F5 100%)",
      glow: "rgba(84, 36, 216, 0.5)",
    },
    {
      id: "obsidian-charcoal",
      name: "Obsidian Charcoal with Lilac",
      primary: "#7547F5",
      secondary: "#64748b",
      accent: "#C9B9FF",
      background: "#08070b",
      cardBackground: "rgba(18, 17, 24, 0.85)",
      cardBorderColor: "rgba(201, 185, 255, 0.2)",
      gradient: "linear-gradient(135deg, #1e1b29 0%, #5424D8 50%, #9B7BFF 100%)",
      glow: "rgba(117, 71, 245, 0.35)",
    },
  ];

  await prisma.themeSettings.upsert({
    where: { id: "default" },
    update: {
      activePreset: "luminous-purple",
      primaryColor: "#7547F5",
      primaryHover: "#6532eb",
      secondaryColor: "#9B7BFF",
      secondaryHover: "#8963ff",
      accentColor: "#C9B9FF",
      backgroundColor: "#05030a",
      cardBackground: "rgba(14, 9, 28, 0.75)",
      cardBorderColor: "rgba(155, 123, 255, 0.2)",
      textColor: "#ffffff",
      textMutedColor: "#9d8ec2",
      headingColor: "#ffffff",
      buttonBg: "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
      buttonText: "#ffffff",
      navBackground: "rgba(5, 3, 10, 0.85)",
      footerBackground: "#05030a",
      heroGradient: "linear-gradient(135deg, rgba(84, 36, 216, 0.25) 0%, rgba(117, 71, 245, 0.18) 50%, transparent 100%)",
      borderGradient: "linear-gradient(135deg, rgba(155, 123, 255, 0.3) 0%, rgba(117, 71, 245, 0.1) 100%)",
      glowIntensity: "medium",
      glowColor: "rgba(117, 71, 245, 0.45)",
      glassBlur: 16,
      borderRadius: "1rem",
      customGradientsJson: JSON.stringify(gradientPresets),
    },
    create: {
      id: "default",
      activePreset: "luminous-purple",
      primaryColor: "#7547F5",
      primaryHover: "#6532eb",
      secondaryColor: "#9B7BFF",
      secondaryHover: "#8963ff",
      accentColor: "#C9B9FF",
      backgroundColor: "#05030a",
      cardBackground: "rgba(14, 9, 28, 0.75)",
      cardBorderColor: "rgba(155, 123, 255, 0.2)",
      textColor: "#ffffff",
      textMutedColor: "#9d8ec2",
      headingColor: "#ffffff",
      buttonBg: "linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)",
      buttonText: "#ffffff",
      navBackground: "rgba(5, 3, 10, 0.85)",
      footerBackground: "#05030a",
      heroGradient: "linear-gradient(135deg, rgba(84, 36, 216, 0.25) 0%, rgba(117, 71, 245, 0.18) 50%, transparent 100%)",
      borderGradient: "linear-gradient(135deg, rgba(155, 123, 255, 0.3) 0%, rgba(117, 71, 245, 0.1) 100%)",
      glowIntensity: "medium",
      glowColor: "rgba(117, 71, 245, 0.45)",
      glassBlur: 16,
      borderRadius: "1rem",
      customGradientsJson: JSON.stringify(gradientPresets),
    },
  });
  console.log("✓ Theme settings seeded with Logo Identity palette");

  // 3b. Featured Video Settings
  await prisma.featuredVideoSettings.upsert({
    where: { id: "default" },
    update: {
      title: "THE BUILT BY BOYKA METHOD",
      subtitle: "WATCH HOW WE TRANSFORM YOUR PHYSIQUE & DISCIPLINE IN 12 WEEKS",
      description: "Coach Boyka breaks down the exact science of progressive hypertrophy, metabolic meal planning, and daily 1-on-1 WhatsApp accountability that delivers championship-level transformations.",
      videoType: "youtube",
      videoUrl: "https://www.youtube.com/watch?v=4Y2ZdHCOXok",
      thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
      ctaLabel: "Claim Your Free VIP Assessment",
      ctaUrl: "https://wa.me/201140108262?text=Hello%20Coach%20Boyka%2C%20I%20watched%20your%20service%20video%20and%20want%20to%20apply%20for%20VIP%20coaching.",
      showHeadline: true,
      showDescription: true,
      showCta: true,
      playMode: "inline",
      autoplay: false,
      videoWidth: "max-w-5xl",
      maxHeight: "aspect-video",
      backgroundGradient: "radial-gradient(ellipse at center, rgba(117, 71, 245, 0.15) 0%, rgba(5, 3, 10, 0.98) 75%)",
      order: 1,
      isVisible: true,
    },
    create: {
      id: "default",
      title: "THE BUILT BY BOYKA METHOD",
      subtitle: "WATCH HOW WE TRANSFORM YOUR PHYSIQUE & DISCIPLINE IN 12 WEEKS",
      description: "Coach Boyka breaks down the exact science of progressive hypertrophy, metabolic meal planning, and daily 1-on-1 WhatsApp accountability that delivers championship-level transformations.",
      videoType: "youtube",
      videoUrl: "https://www.youtube.com/watch?v=4Y2ZdHCOXok",
      thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
      ctaLabel: "Claim Your Free VIP Assessment",
      ctaUrl: "https://wa.me/201140108262?text=Hello%20Coach%20Boyka%2C%20I%20watched%20your%20service%20video%20and%20want%20to%20apply%20for%20VIP%20coaching.",
      showHeadline: true,
      showDescription: true,
      showCta: true,
      playMode: "inline",
      autoplay: false,
      videoWidth: "max-w-5xl",
      maxHeight: "aspect-video",
      backgroundGradient: "radial-gradient(ellipse at center, rgba(117, 71, 245, 0.15) 0%, rgba(5, 3, 10, 0.98) 75%)",
      order: 1,
      isVisible: true,
    },
  });
  console.log("✓ Featured Service Video settings seeded");

  // 4. Animation Settings
  await prisma.animationSettings.upsert({
    where: { id: "default" },
    update: {
      animationsEnabled: true,
      reducedMotion: false,
      orbCount: 3,
      animationSpeed: "normal",
      animationIntensity: "medium",
      blurAmount: 90,
      backgroundEffect: "floating-orbs",
      entranceAnimation: "fade-up",
      hoverEffects: true,
    },
    create: {
      id: "default",
      animationsEnabled: true,
      reducedMotion: false,
      orbCount: 3,
      animationSpeed: "normal",
      animationIntensity: "medium",
      blurAmount: 90,
      backgroundEffect: "floating-orbs",
      entranceAnimation: "fade-up",
      hoverEffects: true,
    },
  });
  console.log("✓ Animation settings seeded");

  // 5. Navigation Items (Programs item removed completely)
  const navItems = [
    { label: "Home", url: "/#home", order: 0 },
    { label: "About", url: "/#about", order: 1 },
    { label: "Transformations", url: "/#results", order: 2 },
    { label: "Packages", url: "/#packages", order: 3 },
    { label: "Testimonials", url: "/#testimonials", order: 4 },
    { label: "FAQ", url: "/#faq", order: 5 },
    { label: "Contact", url: "/#contact", order: 6 },
  ];

  await prisma.navigationItem.deleteMany({});
  for (const item of navItems) {
    await prisma.navigationItem.create({
      data: {
        label: item.label,
        url: item.url,
        order: item.order,
        isVisible: true,
        isExternal: false,
      },
    });
  }
  console.log("✓ Navigation items seeded without Programs");

  // 6. Section Contents
  const sections = [
    {
      sectionKey: "hero",
      title: "FORGE YOUR ULTIMATE PHYSIQUE",
      subtitle: "Uncompromising Elite Online Coaching. Custom Periodized Training, Metabolic Nutrition & Direct 24/7 WhatsApp Mentorship with Coach Boyka.",
      badge: "ELITE 1-ON-1 ONLINE COACHING",
      body: "Stop wasting months on generic cookie-cutter workout routines. Join the elite athletes, busy professionals, and determined individuals who transformed their bodies and minds under the Built By Boyka system.",
      primaryButtonText: "Claim Your VIP Spot",
      primaryButtonLink: "https://wa.me/201140108262?text=Hello%20Built%20By%20Boyka%2C%20I%20would%20like%20to%20know%20more%20about%20your%20coaching%20services.",
      secondaryButtonText: "View Transformations",
      secondaryButtonLink: "/#results",
      imageUrl: "/images/head-coach.jpg",
      statsJson: JSON.stringify([
        { number: "1,450+", label: "Transformations Delivered" },
        { number: "10+ Yrs", label: "Professional Coaching" },
        { number: "99.4%", label: "Client Goal Achievement" },
        { number: "24/7", label: "Direct WhatsApp Line" },
      ]),
      order: 0,
      isVisible: true,
    },
    {
      sectionKey: "trust",
      title: "BACKED BY SCIENCE. PROVEN BY RESULTS.",
      subtitle: "The Built By Boyka coaching methodology combines evidence-based hypertrophy mechanics, tailored metabolic programming, and relentless accountability.",
      badge: "THE BOYKA STANDARD",
      body: "",
      order: 1,
      isVisible: true,
    },
    {
      sectionKey: "about",
      title: "MEET COACH BOYKA",
      subtitle: "Head Coach & Founder of Built By Boyka",
      badge: "THE COACH",
      body: "With over a decade of hands-on coaching, competitive bodybuilding, and transformative sports science education, Coach Boyka has helped thousands of athletes and everyday individuals shatter physical plateaus and sculpt championship physiques.\n\nCertified by ISSA in Master Personal Training, Sports Nutrition, and Strength Periodization, Boyka delivers an authentic, no-nonsense coaching experience tailored around your life, your metabolism, and your schedule.",
      primaryButtonText: "Start With Boyka Today",
      primaryButtonLink: "https://wa.me/201140108262?text=Hello%20Built%20By%20Boyka%2C%20I%20would%20like%20to%20start%20coaching%20with%20you.",
      secondaryButtonText: "Explore Packages",
      secondaryButtonLink: "/#packages",
      imageUrl: "/images/head-coach.jpg",
      secondaryImageUrl: null,
      statsJson: JSON.stringify([
        { number: "ISSA Master", label: "Certified Coach" },
        { number: "12,000+", label: "Hours Coaching" },
        { number: "100%", label: "Custom Programming" },
      ]),
      order: 2,
      isVisible: true,
    },
    {
      sectionKey: "services",
      title: "SPECIALIZED COACHING PROGRAMS",
      subtitle: "Engineered specifically for your exact physiological targets and lifestyle demands.",
      badge: "OUR PROGRAMS",
      order: 3,
      isVisible: true,
    },
    {
      sectionKey: "transformations",
      title: "REAL CLIENT TRANSFORMATIONS",
      subtitle: "Documented progress from real people who committed to the Built By Boyka methodology.",
      badge: "UNFILTERED RESULTS",
      order: 4,
      isVisible: true,
    },
    {
      sectionKey: "videos",
      title: "TRAINING MASTERCLASSES & HIGHLIGHTS",
      subtitle: "Watch exercise mechanics, nutrition breakdowns, and client success breakdowns.",
      badge: "VIDEO HUB",
      order: 5,
      isVisible: true,
    },
    {
      sectionKey: "packages",
      title: "INVEST IN YOUR PHYSIQUE",
      subtitle: "Choose your commitment level. Direct WhatsApp enrollment with Coach Boyka.",
      badge: "PRICING & PACKAGES",
      order: 6,
      isVisible: true,
    },
    {
      sectionKey: "testimonials",
      title: "WHAT OUR ATHLETES SAY",
      subtitle: "Hear directly from those who took the leap and rebuilt themselves from the ground up.",
      badge: "TESTIMONIALS",
      order: 7,
      isVisible: true,
    },
    {
      sectionKey: "faq",
      title: "FREQUENTLY ASKED QUESTIONS",
      subtitle: "Everything you need to know before joining the Built By Boyka inner circle.",
      badge: "GOT QUESTIONS?",
      order: 8,
      isVisible: true,
    },
    {
      sectionKey: "contact",
      title: "READY TO BUILD YOUR BEST SELF?",
      subtitle: "Connect directly with Coach Boyka on WhatsApp for instant evaluation and enrollment.",
      badge: "DIRECT ACCESS",
      primaryButtonText: "Message on WhatsApp",
      primaryButtonLink: "https://wa.me/201140108262?text=Hello%20Built%20By%20Boyka%2C%20I%20would%20like%20to%20know%20more%20about%20your%20coaching%20services.",
      order: 9,
      isVisible: true,
    },
  ];

  await prisma.sectionContent.deleteMany({});
  for (const sec of sections) {
    await prisma.sectionContent.create({ data: sec });
  }
  console.log("✓ Section contents seeded");

  // 7. Coaching Services
  const servicesData = [
    {
      name: "VIP 1-on-1 Complete Transformation",
      slug: "vip-1-on-1-transformation",
      badge: "SIGNATURE PROGRAM",
      shortDescription: "Our flagship end-to-end bespoke coaching program combining personalized nutrition, progressive overload periodization, and daily WhatsApp mentorship.",
      fullDescription: "Designed for high-performers who want zero guesswork. We build your daily calorie and macro target, construct your custom split based on your biomechanics, analyze your lifting form via weekly video submissions, and adjust protocols dynamically.",
      coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop",
      featuresJson: JSON.stringify([
        "100% Customized Macro & Meal Plan (adjusted weekly)",
        "Biomechanically tailored resistance training split",
        "Direct 24/7 WhatsApp VIP line with Coach Boyka",
        "Weekly comprehensive video check-in & form audit",
        "Cardio & metabolic recovery programming",
        "Supplement strategy tailored to your budget",
      ]),
      duration: "12 - 24 Weeks",
      price: 3500,
      currency: "EGP",
      ctaText: "Inquire on WhatsApp",
      order: 0,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: "Hypertrophy & Muscle Architecture",
      slug: "hypertrophy-muscle-architecture",
      badge: "MAXIMUM GAINS",
      shortDescription: "Scientific volume-based muscle hypertrophy protocol designed to pack dense, lean muscle onto lagging body parts.",
      fullDescription: "Overcome muscle growth plateaus with progressive tension overload, specialized intensity techniques, and an optimal caloric surplus framework that builds muscle with minimal fat gain.",
      coverImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop",
      featuresJson: JSON.stringify([
        "Calculated hyper-caloric lean bulk diet protocol",
        "Periodized 4-day to 6-day hypertrophy workout routines",
        "Focus on mind-muscle connection & tempo control",
        "Lagging muscle prioritization system",
        "Bi-weekly progress and body composition check-ins",
      ]),
      duration: "8 - 16 Weeks",
      price: 2800,
      currency: "EGP",
      ctaText: "Inquire on WhatsApp",
      order: 1,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: "Aggressive Shred & Body Recomp",
      slug: "aggressive-shred-recomp",
      badge: "SHREDDED PHYSIQUE",
      shortDescription: "Precision fat incinerating protocol engineered to strip body fat while strictly preserving your hard-earned muscle mass.",
      fullDescription: "Forget crash diets and endless boring cardio. We implement metabolic rate conservation, carb cycling, satiety-boosting nutrition, and targeted resistance stimulus to reveal razor-sharp muscular definition.",
      coverImage: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=1470&auto=format&fit=crop",
      featuresJson: JSON.stringify([
        "Custom deficit nutrition with refeed strategies",
        "Carb cycling and intermittent fasting protocols (optional)",
        "NEAT and intelligent low-impact cardio prescription",
        "Supplements for stubborn fat mobilization",
        "Weekly photo updates and macro adjustments",
      ]),
      duration: "8 - 12 Weeks",
      price: 2800,
      currency: "EGP",
      ctaText: "Inquire on WhatsApp",
      order: 2,
      isFeatured: false,
      isPublished: true,
    },
    {
      name: "Competition & Stage Mastery",
      slug: "competition-stage-mastery",
      badge: "ELITE ATHLETES",
      shortDescription: "Peak-level contest preparation for Men's Physique, Classic Physique, and Bodybuilding competitors seeking trophies.",
      fullDescription: "Comprehensive preparation covering reverse dieting, water and sodium manipulation, stage posing routines, tan selection, backstage timing, and mental peak state conditioning.",
      coverImage: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=1470&auto=format&fit=crop",
      featuresJson: JSON.stringify([
        "Peak week sodium, potassium & water strategy",
        "Posing critique & stage presentation mastery",
        "Daily check-ins during final 2 weeks",
        "Backstage contest coordination & guidance",
        "Post-contest reverse dieting protocol",
      ]),
      duration: "16 - 24 Weeks",
      price: 5000,
      currency: "EGP",
      ctaText: "Inquire on WhatsApp",
      order: 3,
      isFeatured: false,
      isPublished: true,
    },
  ];

  await prisma.coachingService.deleteMany({});
  for (const s of servicesData) {
    await prisma.coachingService.create({ data: s });
  }
  console.log("✓ Coaching services seeded");

  // 8. Coaching Packages & Pricing
  const packagesData = [
    {
      name: "Silver Transformation",
      slug: "silver-transformation",
      badge: "STARTER",
      shortDescription: "Perfect for beginners who need a rock-solid roadmap, clear diet macros, and foundational accountability.",
      fullDescription: "The essential 4-week kickstart to establish proper workout mechanics, clean up your eating habits, and experience rapid initial fat loss or strength gains.",
      price: 1800,
      originalPrice: 2400,
      currency: "EGP",
      billingPeriod: "1 Month",
      duration: "4 Weeks Full Access",
      sessionsCount: "Bi-weekly check-ins",
      featuresJson: JSON.stringify([
        "Complete Initial Physique & Lifestyle Audit",
        "Custom 4-Week Training Routine (Gym or Home)",
        "Personalized Calorie & Macronutrient Blueprint",
        "Direct WhatsApp Q&A Support (Office Hours)",
        "Bi-Weekly Progress Review & Routine Update",
        "PDF Exercise Execution & Technique Guides",
      ]),
      benefitsJson: JSON.stringify([
        "No guesswork regarding what to eat or lift",
        "Instant clarity on weight loss fundamentals",
        "Fast-track your gym confidence",
      ]),
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop",
      ctaText: "Enroll in Silver",
      order: 0,
      isPublished: true,
    },
    {
      name: "Gold Dominance",
      slug: "gold-dominance",
      badge: "MOST POPULAR",
      shortDescription: "Our most chosen 12-week intensive transformation program. Maximum results with weekly video check-ins and direct WhatsApp support.",
      fullDescription: "12 weeks is the sweet spot for an undeniable physical transformation. Whether dropping 10-15kg of stubborn fat or packing on noticeable lean muscle, this program leaves nothing to chance.",
      price: 4200,
      originalPrice: 5500,
      currency: "EGP",
      billingPeriod: "3 Months",
      duration: "12 Weeks Full Access",
      sessionsCount: "Weekly video check-ins",
      featuresJson: JSON.stringify([
        "Everything in Silver Program",
        "Weekly Comprehensive Video Check-ins with Coach Boyka",
        "Priority 24/7 WhatsApp Direct Communication Line",
        "Lifting Form & Technique Video Critique & Correction",
        "Dynamic Macro & Workout Adjustments as You Progress",
        "Targeted Supplement Protocol Based on Your Health",
        "Exclusive Built By Boyka Workout & Nutrition Tracker App Sheet",
      ]),
      benefitsJson: JSON.stringify([
        "Average client result: 8-14kg body fat lost or 4-7kg muscle built",
        "Guaranteed progression with zero plateaus",
        "Direct accountability prevents skipping gym sessions",
      ]),
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1374&auto=format&fit=crop",
      ctaText: "Join Gold Dominance",
      order: 1,
      isPublished: true,
    },
    {
      name: "VIP Elite Inner Circle",
      slug: "vip-elite-inner-circle",
      badge: "VIP MASTERCLASS",
      shortDescription: "The ultimate 6-month mentorship for individuals demanding world-class physical transformation, mental toughness, and concierge attention.",
      fullDescription: "6 full months of private, personalized coaching with Coach Boyka. Includes bi-weekly 1-on-1 private video calls, bloodwork and biomarker optimization guidance, contest/photo shoot prep, and unrestricted access.",
      price: 7500,
      originalPrice: 9800,
      currency: "EGP",
      billingPeriod: "6 Months",
      duration: "24 Weeks Full Mentorship",
      sessionsCount: "Unlimited VIP check-ins & 1-on-1 Video Calls",
      featuresJson: JSON.stringify([
        "Everything in Gold Dominance Program",
        "Bi-Weekly 1-on-1 Video Consultation Calls with Boyka",
        "Private VIP WhatsApp Direct Priority (Instant Response)",
        "Bloodwork & Biomarker Optimization Guidance",
        "Contest Prep, Photo Shoot Conditioning or Beach Body Peak Week",
        "Personalized Lifestyle, Sleep, Stress & Hormone Optimization",
        "Built By Boyka VIP Athlete Cap & Custom Shaker Pack",
      ]),
      benefitsJson: JSON.stringify([
        "Total lifestyle and physical overhaul",
        "Highest tier of private coaching in Egypt & Middle East",
        "Lifetime fitness and nutrition autonomy",
      ]),
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop",
      ctaText: "Apply For VIP Circle",
      order: 2,
      isPublished: true,
    },
  ];

  await prisma.coachingPackage.deleteMany({});
  for (const p of packagesData) {
    await prisma.coachingPackage.create({ data: p });
  }
  console.log("✓ Coaching packages seeded");

  // 9. Client Transformations
  const transformations = [
    {
      clientName: "Omar H.",
      category: "Fat Loss & Shred",
      beforeImage: "https://images.unsplash.com/photo-1579758630668-188c22746c07?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
      durationWeeks: 12,
      weightLossKg: 14.5,
      muscleGainKg: 2.5,
      description: "Omar came to Coach Boyka after struggling with high body fat for 3 years. We optimized his protein distribution, implemented a targeted calorie deficit, and trained 4 days per week.",
      clientQuote: "Coach Boyka completely changed my relationship with food and lifting. In just 12 weeks, I saw my abs for the first time in my life!",
      isFeatured: true,
      order: 0,
    },
    {
      clientName: "Karim M.",
      category: "Muscle Hypertrophy",
      beforeImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
      durationWeeks: 16,
      weightLossKg: 0,
      muscleGainKg: 6.8,
      description: "Karim was a hardgainer who couldn't break 68kg. We placed him on an intelligent 3,200 calorie meal plan with high mechanical tension training focusing on chest and back width.",
      clientQuote: "Boyka's form critiques were the game changer. My bench and squat jumped by 40kg while adding clean mass without gaining a gut.",
      isFeatured: true,
      order: 1,
    },
    {
      clientName: "Tarek S.",
      category: "Total Body Recomp",
      beforeImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop",
      durationWeeks: 10,
      weightLossKg: 9.2,
      muscleGainKg: 3.1,
      description: "Tarek is an executive working 60+ hours a week. We created an efficient 45-minute training system that fit seamlessly into his hectic schedule.",
      clientQuote: "The WhatsApp check-ins kept me 100% accountable. Boyka made sure I never missed a beat no matter how busy work got.",
      isFeatured: true,
      order: 2,
    },
    {
      clientName: "Youssef F.",
      category: "Contest Prep",
      beforeImage: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800&auto=format&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=800&auto=format&fit=crop",
      durationWeeks: 20,
      weightLossKg: 12.0,
      muscleGainKg: 1.5,
      description: "Prepared for the national Men's Physique stage. Achieved sub-6% body fat with full muscle bellies and immaculate stage conditioning.",
      clientQuote: "Coach Boyka's peak week protocol was flawless. Stepped on stage full, dry, and took home 1st place in my division.",
      isFeatured: false,
      order: 3,
    },
  ];

  await prisma.clientTransformation.deleteMany({});
  for (const t of transformations) {
    await prisma.clientTransformation.create({ data: t });
  }
  console.log("✓ Client transformations seeded");

  // 10. Video Library
  const videos = [
    {
      title: "Mastering Chest Hypertrophy: The Perfect Cable Fly Angle",
      description: "Coach Boyka breaks down biomechanical alignment, humeral adduction, and how to recruit 100% of the pectoralis major without shoulder impingement.",
      videoType: "youtube",
      videoUrl: "https://www.youtube.com/watch?v=4Y2ZdHCOXok",
      thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
      category: "Training Mechanics",
      duration: "12:45",
      isFeatured: true,
      order: 0,
    },
    {
      title: "How to Calculate Your Maintenance & Cut Calories Accurately",
      description: "Stop relying on random internet calorie calculators. Learn Coach Boyka's exact formula used with over 1,400 successful clients.",
      videoType: "youtube",
      videoUrl: "https://www.youtube.com/watch?v=r0X9qL6cK8E",
      thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
      category: "Nutrition Science",
      duration: "15:20",
      isFeatured: true,
      order: 1,
    },
    {
      title: "The Ultimate Back Width Masterclass: Lat Pulldowns vs Rows",
      description: "Why most lifters only feel their biceps during back day, and how elbow drive unlocks maximum lat flare and density.",
      videoType: "youtube",
      videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
      thumbnailUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
      category: "Training Mechanics",
      duration: "18:10",
      isFeatured: false,
      order: 2,
    },
  ];

  await prisma.videoItem.deleteMany({});
  for (const v of videos) {
    await prisma.videoItem.create({ data: v });
  }
  console.log("✓ Video items seeded");

  // 11. Testimonials
  const testimonials = [
    {
      clientName: "Mostafa El-Sayed",
      clientTitle: "Civil Engineer & Powerlifter",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop",
      rating: 5,
      program: "Gold Dominance (12 Weeks)",
      content: "I have worked with 3 other online coaches before finding Built By Boyka. The difference is night and day. Boyka doesn't send you a generic PDF and disappear. His WhatsApp responses are rapid, insightful, and brutally honest. I dropped 11kg and set PRs on all my main lifts.",
      isFeatured: true,
      order: 0,
    },
    {
      clientName: "Amr Nabil",
      clientTitle: "Software Architect",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=300&auto=format&fit=crop",
      rating: 5,
      program: "VIP Elite Inner Circle (6 Months)",
      content: "Sitting at a desk 10 hours a day destroyed my posture and caused severe weight gain. Boyka built a nutrition protocol that worked with my irregular sleep and meetings. 6 months later, I am down 18kg and in the best shape of my life at age 34.",
      isFeatured: true,
      order: 1,
    },
    {
      clientName: "Ziad Mahmoud",
      clientTitle: "University Student & Footballer",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      rating: 5,
      program: "Hypertrophy Architecture",
      content: "The level of detail in the exercise biomechanics videos Coach Boyka sent was insane. He corrected my knee path on squats and shoulder flare on bench. My strength skyrocketed within the first 3 weeks. Built By Boyka is the real deal.",
      isFeatured: true,
      order: 2,
    },
    {
      clientName: "Hassan Al-Sharif",
      clientTitle: "Business Owner",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
      rating: 5,
      program: "Silver Transformation",
      content: "What stood out most was how sustainable the diet was. No starvation, no crazy extreme detoxes. Just solid whole foods, flexible budgeting for eating out, and continuous encouragement on WhatsApp.",
      isFeatured: false,
      order: 3,
    },
  ];

  await prisma.testimonial.deleteMany({});
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("✓ Testimonials seeded");

  // 12. FAQ Items
  const faqs = [
    {
      question: "How does online coaching with Built By Boyka work?",
      answer: "Once you sign up via WhatsApp, you receive our comprehensive onboarding intake form. Coach Boyka analyzes your training history, medical notes, lifestyle schedule, food preferences, and current physique photos. You then receive your completely customized training program and macronutrient/meal blueprint within 48 hours. From there, you report directly via WhatsApp with weekly progress check-ins, lifting videos for form audits, and continuous protocol updates.",
      category: "Coaching Process",
      order: 0,
    },
    {
      question: "Do I need a fully equipped gym, or can I train at home?",
      answer: "We accommodate both! Coach Boyka designs workout programs specifically around the equipment you have access to. Whether you train in a premier bodybuilding facility, a basic local gym, or at home with adjustable dumbbells and resistance bands, your routine will be periodized for maximum mechanical tension and progression.",
      category: "Training",
      order: 1,
    },
    {
      question: "Will I have to eat bland chicken and rice every day?",
      answer: "Absolutely not. We practice flexible, evidence-based nutrition. We provide you with calculated calories and macronutrients (protein, carbs, fats) alongside structured meal plan examples utilizing foods you actually enjoy. You'll learn how to eat out with friends, manage social events, and enjoy life while staying on track.",
      category: "Nutrition",
      order: 2,
    },
    {
      question: "How do I communicate with Coach Boyka?",
      answer: "All communication takes place directly via our official VIP WhatsApp line (+201140108262). You are not handed off to an assistant coach or an automated bot—you speak directly with Coach Boyka for all questions, check-ins, and exercise video reviews.",
      category: "Support",
      order: 3,
    },
    {
      question: "How soon can I expect visible results?",
      answer: "Most clients notice significant improvements in their energy levels, strength, and water retention within the first 10-14 days. By week 4, visible body composition changes (waist reduction, muscle tightness) become very evident. By 12 weeks, the transformation is dramatic.",
      category: "Results",
      order: 4,
    },
    {
      question: "What payment methods are supported?",
      answer: "We accept Vodafone Cash, InstaPay, direct bank transfers in Egypt, as well as Western Union and international credit/debit transfers for clients worldwide. Reach out on WhatsApp to choose your preferred payment option.",
      category: "Billing",
      order: 5,
    },
  ];

  await prisma.faqItem.deleteMany({});
  for (const f of faqs) {
    await prisma.faqItem.create({ data: f });
  }
  console.log("✓ FAQ items seeded");

  // 13. Social Links
  const socials = [
    { platform: "Instagram", url: "https://instagram.com/builtbyboyka", icon: "Instagram", order: 0 },
    { platform: "YouTube", url: "https://youtube.com/@builtbyboyka", icon: "Youtube", order: 1 },
    { platform: "TikTok", url: "https://tiktok.com/@builtbyboyka", icon: "Video", order: 2 },
    { platform: "Facebook", url: "https://facebook.com/builtbyboyka", icon: "Facebook", order: 3 },
  ];

  await prisma.socialLink.deleteMany({});
  for (const s of socials) {
    await prisma.socialLink.create({ data: s });
  }
  console.log("✓ Social links seeded");

  // 14. SEO Settings
  await prisma.seoSettings.upsert({
    where: { id: "default" },
    update: {
      metaTitle: "Built By Boyka | Premium Coaching",
      metaDescription: "Elite online fitness coaching, custom diet protocols, personalized training programs, and transformation guidance by Boyka.",
      keywords: "fitness coaching, online coach, body transformation, muscle building, fat loss, Boyka coaching, Egypt fitness, VIP fitness",
      canonicalUrl: "https://builtbyboyka.com",
    },
    create: {
      id: "default",
      metaTitle: "Built By Boyka | Premium Coaching",
      metaDescription: "Elite online fitness coaching, custom diet protocols, personalized training programs, and transformation guidance by Boyka.",
      keywords: "fitness coaching, online coach, body transformation, muscle building, fat loss, Boyka coaching, Egypt fitness, VIP fitness",
      canonicalUrl: "https://builtbyboyka.com",
    },
  });
  console.log("✓ SEO settings seeded");

  // 15. Media Assets
  await prisma.mediaAsset.deleteMany({
    where: {
      url: { in: ["/images/logo-boyka.png", "/images/head-coach.jpg"] },
    },
  });
  await prisma.mediaAsset.createMany({
    data: [
      {
        fileName: "Logo Boyka.png",
        url: "/images/logo-boyka.png",
        fileSize: 1248940,
        mimeType: "image/png",
        category: "branding",
        altText: "Built By Boyka Official Brand Logo",
      },
      {
        fileName: "Head Coach.jpg",
        url: "/images/head-coach.jpg",
        fileSize: 51247,
        mimeType: "image/jpeg",
        category: "coach",
        altText: "Coach Boyka - Head Coach and Founder",
      },
    ],
  });
  console.log("✓ Media assets seeded");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
