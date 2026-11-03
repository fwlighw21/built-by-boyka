// Comprehensive Test Suite for 30-Second Inactivity Session & Safe Calculations
const {
  formatPrice,
  calculateDiscount,
  formatBytes,
  clampAngle,
  clampPercentage,
  hexToRgba,
} = require("../src/lib/utils");

const {
  createAdminSession,
  verifyAdminToken,
  touchAdminSession,
  destroyAdminSession,
  getSessionRemainingSeconds,
  getSessionRegistry,
  INACTIVITY_TIMEOUT_MS,
} = require("../src/lib/auth");

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log("==================================================");
console.log("🧪 TESTING 30-SECOND INACTIVITY SESSION & CALCS");
console.log("==================================================\n");

// 1. Calculations & Formatters Audit
console.log("--- 1. Calculations & Utilities Verification ---");

// formatPrice
assert(formatPrice(1500) === "EGP 1,500" || formatPrice(1500).includes("1,500"), "formatPrice handles standard number");
assert(!formatPrice(null).includes("NaN"), "formatPrice handles null without NaN");
assert(!formatPrice(undefined).includes("NaN"), "formatPrice handles undefined without NaN");
assert(!formatPrice(NaN).includes("NaN"), "formatPrice handles NaN safely");
assert(formatPrice(2000, "INVALID_CODE").includes("2,000"), "formatPrice handles invalid currency codes gracefully without throwing");

// calculateDiscount
const d1 = calculateDiscount(800, 1000);
assert(d1.savings === 200 && d1.percentage === 20, "calculateDiscount computes 20% savings correctly");
const d2 = calculateDiscount(1000, 800);
assert(d2.savings === 0 && d2.percentage === 0, "calculateDiscount handles price > originalPrice safely");
const d3 = calculateDiscount(null, undefined);
assert(d3.savings === 0 && d3.percentage === 0, "calculateDiscount handles null/undefined safely");

// formatBytes
assert(formatBytes(0) === "0 B", "formatBytes(0) -> 0 B");
assert(formatBytes(null) === "0 B", "formatBytes(null) -> 0 B");
assert(formatBytes(undefined) === "0 B", "formatBytes(undefined) -> 0 B");
assert(formatBytes(-100) === "0 B", "formatBytes(-100) -> 0 B");
assert(formatBytes(NaN) === "0 B", "formatBytes(NaN) -> 0 B");
assert(formatBytes(1024) === "1 KB", "formatBytes(1024) -> 1 KB");
assert(formatBytes(1048576) === "1 MB", "formatBytes(1048576) -> 1 MB");
assert(formatBytes(1073741824) === "1 GB", "formatBytes(1073741824) -> 1 GB");

// clampAngle
assert(clampAngle(135) === 135, "clampAngle(135) -> 135");
assert(clampAngle(370) === 10, "clampAngle(370) -> 10");
assert(clampAngle(-45) === 315, "clampAngle(-45) -> 315");
assert(clampAngle(null) === 135, "clampAngle(null) -> default 135");
assert(clampAngle(NaN) === 135, "clampAngle(NaN) -> default 135");

// clampPercentage
assert(clampPercentage(50) === 50, "clampPercentage(50) -> 50");
assert(clampPercentage(150) === 100, "clampPercentage(150) -> clamped to 100");
assert(clampPercentage(-10) === 0, "clampPercentage(-10) -> clamped to 0");

// hexToRgba
assert(hexToRgba("#7547F5", 0.5) === "rgba(117, 71, 245, 0.5)", "hexToRgba standard 6-char hex");
assert(hexToRgba("#fff", 1) === "rgba(255, 255, 255, 1)", "hexToRgba 3-char shorthand #fff");
assert(hexToRgba("#000", 0.8) === "rgba(0, 0, 0, 0.8)", "hexToRgba 3-char shorthand #000");
assert(hexToRgba("rgba(10, 20, 30, 0.4)", 1) === "rgba(10, 20, 30, 0.4)", "hexToRgba preserves existing rgba");
assert(hexToRgba("#7547F5", 2) === "rgba(117, 71, 245, 1)", "hexToRgba clamps alpha > 1 to 1");
assert(hexToRgba("#7547F5", -0.5) === "rgba(117, 71, 245, 0)", "hexToRgba clamps alpha < 0 to 0");

// 2. Strict 30-Second Inactivity Session Management
console.log("\n--- 2. 30-Second Inactivity Session Policy Verification ---");
assert(INACTIVITY_TIMEOUT_MS === 30000, "INACTIVITY_TIMEOUT_MS is strictly set to 30,000 milliseconds (30s)");

const mockUser = { id: "user-boyka-1", username: "Boyka" };
const sessionData = createAdminSession(mockUser);
assert(Boolean(sessionData.token), "createAdminSession generates valid JWT token");
assert(Boolean(sessionData.sessionId), "createAdminSession returns unique sessionId");

const decoded = verifyAdminToken(sessionData.token);
assert(decoded && decoded.sessionId === sessionData.sessionId, "verifyAdminToken decodes sessionId matching registry");
assert(decoded && decoded.username === "Boyka", "verifyAdminToken decodes username 'Boyka'");

// Active session initial remaining time
const remaining1 = getSessionRemainingSeconds(sessionData.sessionId);
assert(remaining1 >= 29 && remaining1 <= 30, `Active session initial remaining time is ~30s (found: ${remaining1}s)`);

// Touch active session
const touched = touchAdminSession(sessionData.sessionId);
assert(touched === true, "touchAdminSession successfully touches active session");

// Inactivity Expiration Simulation (simulate 31 seconds of inactivity)
const registry = getSessionRegistry();
const liveSession = registry.get(sessionData.sessionId);
assert(Boolean(liveSession), "Session exists in registry");

// Set lastActivity to 31 seconds in the past
liveSession.lastActivity = Date.now() - 31000;

// Now check getSessionRemainingSeconds -> should expire and delete from registry
const remainingExpired = getSessionRemainingSeconds(sessionData.sessionId);
assert(remainingExpired === 0, "getSessionRemainingSeconds returns 0 for inactive session (> 30s)");
assert(!registry.has(sessionData.sessionId), "Expired session (> 30s) is strictly removed from session registry");

// Re-verify touching expired session
const touchExpired = touchAdminSession(sessionData.sessionId);
assert(touchExpired === false, "touchAdminSession fails on expired session");

// Test explicit destroyAdminSession
const sessionData2 = createAdminSession(mockUser);
assert(registry.has(sessionData2.sessionId), "Second session registered");
destroyAdminSession(sessionData2.sessionId);
assert(!registry.has(sessionData2.sessionId), "destroyAdminSession immediately deletes session from registry");

console.log("\n==================================================");
console.log(`📊 TOTAL: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
