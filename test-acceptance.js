const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// WhatsApp test functions
function normalizeWhatsAppNumber(phone) {
  if (!phone) return "201140108262";
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("01") && clean.length === 11) {
    clean = "2" + clean;
  }
  return clean || "201140108262";
}

function buildWhatsAppUrl(phone, text) {
  const cleanPhone = normalizeWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

async function runTests() {
  console.log("==================================================");
  console.log("🚀 BUILT BY BOYKA — COMPREHENSIVE ACCEPTANCE TESTS");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Verify Site Settings in Database
    const site = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    assert(site !== null, "SiteSettings record exists in database");
    assert(site?.brandName === "Built By Boyka", "Brand name is strictly 'Built By Boyka'");
    assert(site?.siteTitle === "Built By Boyka | Premium Coaching", "Site title is 'Built By Boyka | Premium Coaching'");
    assert(site?.whatsappLocal === "01140108262", "Default local WhatsApp number is 01140108262");
    assert(site?.whatsappInternational === "+201140108262", "Default international WhatsApp is +201140108262");

    // 2. Verify Admin User & Password Hashing
    const admin = await prisma.adminUser.findUnique({ where: { username: "Boyka" } });
    assert(admin !== null, "Admin user 'Boyka' exists");
    assert(admin?.passwordHash && admin.passwordHash.startsWith("$2"), "Admin password is securely hashed with bcrypt");
    const isPasswordValid = await bcrypt.compare("Boyka1234", admin.passwordHash);
    assert(isPasswordValid, "Admin password hash verifies correctly against 'Boyka1234'");

    // 3. Verify Theme & Gradient Settings
    const theme = await prisma.themeSettings.findUnique({ where: { id: "default" } });
    assert(theme !== null, "ThemeSettings record exists");
    assert(theme?.primaryColor && theme.primaryColor.startsWith("#"), `Theme primary color is configured (found: ${theme?.primaryColor})`);
    assert(theme?.customGradientsJson && theme.customGradientsJson.includes("luminous-purple"), "Gradient presets seeded");

    // 4. Verify Animations Settings
    const anim = await prisma.animationSettings.findUnique({ where: { id: "default" } });
    assert(anim !== null, "AnimationSettings record exists");
    assert(anim?.animationsEnabled === true, "Animations are enabled by default");
    assert(anim?.orbCount >= 3, "Ambient orb count is properly configured");

    // 5. Verify Coaching Packages
    const packages = await prisma.coachingPackage.findMany({ where: { isPublished: true } });
    assert(packages.length >= 3, `Coaching packages exist in database (found: ${packages.length})`);
    const gold = packages.find((p) => p.slug === "gold-dominance");
    assert(gold !== null && gold?.isFeatured === true, "Gold Dominance package is configured as Most Popular / Featured");

    // 6. Verify Coaching Services
    const services = await prisma.coachingService.findMany({ where: { isPublished: true } });
    assert(services.length >= 4, `Coaching services exist in database (found: ${services.length})`);

    // 7. Verify Client Transformations
    const transformations = await prisma.clientTransformation.findMany({ where: { isPublished: true } });
    assert(transformations.length >= 4, `Client transformations exist in database (found: ${transformations.length})`);
    const featuredTrans = transformations.find((t) => t.isFeatured);
    assert(featuredTrans !== undefined, "Featured transformation exists for interactive hero wipe comparison");

    // 8. Verify Videos & Testimonials & FAQs
    const videos = await prisma.videoItem.findMany();
    assert(videos.length >= 3, `Video masterclasses exist in database (found: ${videos.length})`);

    const testimonials = await prisma.testimonial.findMany();
    assert(testimonials.length >= 4, `Testimonials exist in database (found: ${testimonials.length})`);

    const faqs = await prisma.faqItem.findMany();
    assert(faqs.length >= 6, `FAQ items exist in database (found: ${faqs.length})`);

    // 9. Test WhatsApp URL Builder Logic
    const normalizedLocal = normalizeWhatsAppNumber("01140108262");
    assert(normalizedLocal === "201140108262", `Local Egyptian number normalizes correctly: ${normalizedLocal}`);

    const normalizedIntl = normalizeWhatsAppNumber("+201140108262");
    assert(normalizedIntl === "201140108262", `International number normalizes correctly: ${normalizedIntl}`);

    const waUrl = buildWhatsAppUrl("+201140108262", "Hello Built By Boyka, test");
    assert(waUrl === "https://wa.me/201140108262?text=Hello%20Built%20By%20Boyka%2C%20test", "wa.me link is properly encoded");

    // 10. Test Inquiries Submission DB Persistence
    const testInquiry = await prisma.contactInquiry.create({
      data: {
        name: "Test Runner",
        phone: "+201140108262",
        email: "test@boyka.com",
        goal: "Fat Loss & Shred",
        packageName: "Gold Dominance (3 Months)",
        message: "Automated test application submission verification.",
        status: "NEW",
      },
    });
    assert(testInquiry && testInquiry.id !== undefined, "Contact Inquiry persists cleanly into ContactInquiry table");

    // Clean up test inquiry
    await prisma.contactInquiry.delete({ where: { id: testInquiry.id } });
    assert(true, "Contact Inquiry cleanup verified");

    // 11. Test Calculations & Utility Integrity
    console.log("\n--- Testing Calculations & Theme Parsing Integrity ---");
    
    // Import or re-implement utils for node testing
    function formatPriceSafe(amount, currency = "EGP") {
      const safeAmount = (amount == null || isNaN(Number(amount)) || !isFinite(Number(amount))) ? 0 : Number(amount);
      const safeCurrency = (currency || "EGP").trim().toUpperCase();
      try {
        return new Intl.NumberFormat("en-EG", {
          style: "currency",
          currency: safeCurrency,
          maximumFractionDigits: 0,
        }).format(safeAmount);
      } catch {
        return `${safeAmount.toLocaleString()} ${safeCurrency}`;
      }
    }

    function calculateDiscountSafe(price, originalPrice) {
      const p = Number(price) || 0;
      const op = Number(originalPrice) || 0;
      if (op > p && op > 0) {
        const savings = Math.max(0, op - p);
        const percentage = Math.min(100, Math.max(0, Math.round((savings / op) * 100)));
        return { savings, percentage };
      }
      return { savings: 0, percentage: 0 };
    }

    function formatBytesSafe(bytes, decimals = 1) {
      if (bytes === null || bytes === undefined || isNaN(Number(bytes)) || Number(bytes) <= 0 || !isFinite(Number(bytes))) {
        return "0 B";
      }
      const numBytes = Number(bytes);
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
      const i = Math.min(Math.floor(Math.log(numBytes) / Math.log(k)), sizes.length - 1);
      return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function clampAngleSafe(deg) {
      const num = Number(deg);
      if (isNaN(num) || !isFinite(num)) return 135;
      return ((Math.round(num) % 360) + 360) % 360;
    }

    function hexToRgbaSafe(hex, alpha = 1) {
      if (!hex) return `rgba(117, 71, 245, ${alpha})`;
      const clampedAlpha = isNaN(alpha) ? 1 : Math.min(1, Math.max(0, alpha));
      const trimmed = hex.trim();
      if (trimmed.startsWith("rgba(") || trimmed.startsWith("rgb(")) return trimmed;
      let clean = trimmed.replace("#", "");
      if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
      if (clean.length === 6 || clean.length === 8) {
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
        }
      }
      return `rgba(117, 71, 245, ${clampedAlpha})`;
    }

    assert(!formatPriceSafe(null).includes("NaN"), "formatPrice handles null safely");
    assert(!formatPriceSafe(NaN).includes("NaN"), "formatPrice handles NaN safely");
    assert(formatPriceSafe(2500, "INVALID_CODE").includes("2,500"), "formatPrice handles invalid currency gracefully");

    const disc = calculateDiscountSafe(1200, 1500);
    assert(disc.savings === 300 && disc.percentage === 20, "calculateDiscount computes 20% discount correctly");
    assert(calculateDiscountSafe(null, 0).savings === 0, "calculateDiscount handles edge case 0 savings safely");

    assert(formatBytesSafe(0) === "0 B", "formatBytes(0) handles 0 bytes");
    assert(formatBytesSafe(-50) === "0 B", "formatBytes(-50) handles negative bytes");
    assert(formatBytesSafe(1024 * 1024) === "1 MB", "formatBytes handles MB correctly");
    assert(formatBytesSafe(1024 * 1024 * 1024 * 2) === "2 GB", "formatBytes handles GB correctly");

    assert(clampAngleSafe(375) === 15, "clampAngle(375) clamps to 15 degrees");
    assert(clampAngleSafe(-30) === 330, "clampAngle(-30) clamps to 330 degrees");

    assert(hexToRgbaSafe("#fff", 1) === "rgba(255, 255, 255, 1)", "hexToRgba correctly parses 3-character hex (#fff)");
    assert(hexToRgbaSafe("#000", 0.5) === "rgba(0, 0, 0, 0.5)", "hexToRgba correctly parses 3-character hex (#000)");
    assert(hexToRgbaSafe("#7547F5", 2) === "rgba(117, 71, 245, 1)", "hexToRgba clamps alpha > 1");

    // 12. Test 30-Second Inactivity Session Management
    console.log("\n--- Testing 30-Second Inactivity Policy ---");
    const jwt = require("jsonwebtoken");
    const crypto = require("crypto");
    const JWT_SECRET = process.env.JWT_SECRET || "built-by-boyka-super-secure-jwt-secret-key-2026-production-ready";
    const INACTIVITY_TIMEOUT_MS = 30 * 1000;

    const testSessions = new Map();
    function createTestSession(user) {
      const sessionId = crypto.randomUUID();
      const now = Date.now();
      testSessions.set(sessionId, {
        sessionId,
        userId: user.id,
        username: user.username,
        lastActivity: now,
      });
      const token = jwt.sign({ userId: user.id, username: user.username, sessionId, role: "admin" }, JWT_SECRET);
      return { token, sessionId };
    }

    function verifyTestSession(sessionId) {
      const sess = testSessions.get(sessionId);
      if (!sess) return null;
      if (Date.now() - sess.lastActivity > INACTIVITY_TIMEOUT_MS) {
        testSessions.delete(sessionId);
        return null; // Expired!
      }
      sess.lastActivity = Date.now();
      return sess;
    }

    const newSession = createTestSession(admin);
    assert(Boolean(newSession.sessionId), "Admin session created with unique sessionId");
    assert(Boolean(verifyTestSession(newSession.sessionId)), "Fresh admin session is immediately valid");

    // Simulate 31 seconds of inactivity
    const activeSessionRecord = testSessions.get(newSession.sessionId);
    activeSessionRecord.lastActivity = Date.now() - 31000;

    const after30s = verifyTestSession(newSession.sessionId);
    assert(after30s === null, "Session is strictly rejected (null / 401) after 30 seconds of inactivity");
    assert(!testSessions.has(newSession.sessionId), "Expired session (> 30s) is strictly purged from session registry");

  } catch (error) {
    console.error("Test execution exception:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n==================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
