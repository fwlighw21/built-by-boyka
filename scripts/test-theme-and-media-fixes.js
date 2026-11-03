const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

async function runTests() {
  console.log('==================================================');
  console.log('🔬 VERIFYING THEME FIX & GLOBAL IMAGE MANAGEMENT');
  console.log('==================================================\n');

  // 1. Verify themeLibrary.ts
  console.log('--- 1. Testing Theme Library & Normalizer ---');
  const themeLibContent = fs.readFileSync('src/lib/themeLibrary.ts', 'utf8');
  assert(themeLibContent.includes('export function normalizeTheme'), 'normalizeTheme function exported from themeLibrary.ts');
  assert(themeLibContent.includes('export function normalizeThemeList'), 'normalizeThemeList function exported from themeLibrary.ts');

  // Match ready made theme count
  const themeIds = (themeLibContent.match(/id:\s*["'][a-z0-9-]+["']/g) || []);
  assert(themeIds.length >= 30, `Theme library contains at least 30 ready-made themes (found: ${themeIds.length})`);

  // Verify DB customGradientsJson normalization
  const currentTheme = await prisma.themeSettings.findUnique({ where: { id: 'default' } });
  assert(Boolean(currentTheme), 'Default ThemeSettings record exists in SQLite');
  assert(Boolean(currentTheme.customGradientsJson), 'ThemeSettings.customGradientsJson exists');

  const customThemes = JSON.parse(currentTheme.customGradientsJson);
  assert(Array.isArray(customThemes) && customThemes.length > 0, `Database contains ${customThemes.length} custom themes`);

  let allHaveSwatches = true;
  customThemes.forEach((t, i) => {
    if (!Array.isArray(t.swatches) || t.swatches.length < 5) {
      allHaveSwatches = false;
      console.error(`Theme [${t.id}] "${t.name}" missing valid 5 swatches:`, t.swatches);
    }
  });
  assert(allHaveSwatches, 'Every custom theme in database has a guaranteed 5-element swatches array');

  // 2. Verify Theme Page Defensive Mapping
  console.log('\n--- 2. Testing Theme Page Code Resiliency ---');
  const themePageContent = fs.readFileSync('src/app/admin/theme/page.tsx', 'utf8');
  assert(themePageContent.includes('normalizeThemeList(parsed)'), 'Theme page parses custom themes via normalizeThemeList');
  assert(themePageContent.includes('normalizeThemeList([...READY_MADE_THEMES, ...customThemes])'), 'allAvailableThemes memo runs normalizeThemeList');
  assert(themePageContent.includes('currentActiveTheme = useMemo'), 'currentActiveTheme uses normalized useMemo');
  assert(themePageContent.includes('currentActiveTheme.swatches.length > 0'), 'currentActiveTheme swatches rendering has defensive array check');
  assert(themePageContent.includes('t.swatches && Array.isArray(t.swatches)'), 'Theme grid card swatches rendering has defensive array check');

  // 3. Verify Global Image Field Integration
  console.log('\n--- 3. Testing Global ImageFieldPicker Integration ---');

  const pagesToCheck = [
    { file: 'src/app/admin/settings/page.tsx', labels: ['Custom Brand Logo', 'Website Favicon / Icon'] },
    { file: 'src/app/admin/content/page.tsx', labels: ['Primary Section Image (Coach Portrait / Hero)', 'Secondary Image (About Section Action Shot)'] },
    { file: 'src/app/admin/services/page.tsx', labels: ['Coaching Program Cover Image'] },
    { file: 'src/app/admin/packages/page.tsx', labels: ['Package Cover Banner (Optional)'] },
    { file: 'src/app/admin/testimonials/page.tsx', labels: ['Client Avatar Photo'] },
    { file: 'src/app/admin/featured-video/page.tsx', labels: ['Custom Video Poster Thumbnail'] },
    { file: 'src/app/admin/videos/page.tsx', labels: ['Masterclass Video Thumbnail'] },
    { file: 'src/app/admin/transformations/page.tsx', labels: ['Before Image', 'After Image'] },
    { file: 'src/app/admin/pages/page.tsx', labels: ['Content Image'] },
    { file: 'src/app/admin/seo/page.tsx', labels: ['Social Sharing Image (Open Graph)'] },
  ];

  pagesToCheck.forEach(({ file, labels }) => {
    const content = fs.readFileSync(file, 'utf8');
    const hasImport = content.includes("import ImageFieldPicker from '@/components/admin/ImageFieldPicker'") ||
                      content.includes('import ImageFieldPicker from "@/components/admin/ImageFieldPicker"');
    assert(hasImport, `${file} imports ImageFieldPicker`);

    labels.forEach(lbl => {
      const hasLabel = content.includes(lbl);
      assert(hasLabel, `${file} provides ImageFieldPicker for "${lbl}"`);
    });
  });

  // 4. Verify Media Picker Modal & Upload API
  console.log('\n--- 4. Testing Media Picker Modal & Direct Upload ---');
  const modalContent = fs.readFileSync('src/components/admin/MediaPickerModal.tsx', 'utf8');
  assert(modalContent.includes('transformations'), 'MediaPickerModal filters by transformations');
  assert(modalContent.includes('coach'), 'MediaPickerModal filters by coach');
  assert(modalContent.includes('branding'), 'MediaPickerModal filters by branding');
  assert(modalContent.includes('services'), 'MediaPickerModal filters by services');
  assert(modalContent.includes('packages'), 'MediaPickerModal filters by packages');
  assert(modalContent.includes('videos'), 'MediaPickerModal filters by videos');
  assert(modalContent.includes('avatars'), 'MediaPickerModal filters by avatars');

  const pickerContent = fs.readFileSync('src/components/admin/ImageFieldPicker.tsx', 'utf8');
  assert(pickerContent.includes('handleDirectUpload'), 'ImageFieldPicker contains handleDirectUpload method');
  assert(pickerContent.includes('/api/upload'), 'ImageFieldPicker posts directly to /api/upload');
  assert(pickerContent.includes('Replace from Library'), 'ImageFieldPicker contains "Replace from Library" option');
  assert(pickerContent.includes('Upload New'), 'ImageFieldPicker contains "Upload New" direct upload button');
  assert(pickerContent.includes('Remove'), 'ImageFieldPicker contains "Remove" image button');

  // 5. Verify Head Coach Image & Logo File Preservation
  console.log('\n--- 5. Testing Coach Photo & Logo Brand Assets ---');
  const heroSection = await prisma.sectionContent.findUnique({ where: { sectionKey: 'hero' } });
  const aboutSection = await prisma.sectionContent.findUnique({ where: { sectionKey: 'about' } });
  const siteSettings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });

  assert(Boolean(heroSection?.imageUrl), `Hero section coach portrait is set: ${heroSection?.imageUrl}`);
  assert(Boolean(aboutSection?.imageUrl), `About section coach portrait is set: ${aboutSection?.imageUrl}`);
  assert(Boolean(siteSettings?.logoUrl), `Site settings logo URL is set: ${siteSettings?.logoUrl}`);

  console.log('\n==================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch(err => {
    console.error('Test execution error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
