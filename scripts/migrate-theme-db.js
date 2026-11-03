const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalizeTheme(raw, fallbackId) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const id = String(raw.id || fallbackId || `custom-${Date.now()}`);
  const name = String(raw.name || 'Untitled Custom Theme').trim();
  const category = raw.category || 'Multicolor';
  const description = String(raw.description || 'Custom coaching website theme preset.');

  const primaryColor = String(raw.primaryColor || raw.primary || '#7547F5').trim();
  const primaryHover = String(raw.primaryHover || '#6532eb').trim();
  const secondaryColor = String(raw.secondaryColor || raw.secondary || '#9B7BFF').trim();
  const secondaryHover = String(raw.secondaryHover || '#8963ff').trim();
  const accentColor = String(raw.accentColor || raw.accent || '#C9B9FF').trim();
  const backgroundColor = String(raw.backgroundColor || raw.background || '#05030a').trim();
  const cardBackground = String(raw.cardBackground || 'rgba(14, 9, 28, 0.75)').trim();
  const cardBorderColor = String(raw.cardBorderColor || 'rgba(155, 123, 255, 0.22)').trim();
  const textColor = String(raw.textColor || '#ffffff').trim();
  const textMutedColor = String(raw.textMutedColor || '#9d8ec2').trim();
  const headingColor = String(raw.headingColor || '#ffffff').trim();

  const buttonBg = String(
    raw.buttonBg ||
    raw.previewGradient ||
    raw.gradient ||
    `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
  ).trim();

  const buttonText = String(raw.buttonText || '#ffffff').trim();
  const navBackground = String(raw.navBackground || 'rgba(5, 3, 10, 0.85)').trim();
  const footerBackground = String(raw.footerBackground || '#05030a').trim();

  const heroGradient = String(
    raw.heroGradient ||
    `linear-gradient(135deg, ${primaryColor}40 0%, ${secondaryColor}25 50%, transparent 100%)`
  ).trim();

  const cardGradient = raw.cardGradient ? String(raw.cardGradient).trim() : undefined;
  const borderGradient = String(
    raw.borderGradient ||
    `linear-gradient(135deg, ${accentColor}50 0%, ${primaryColor}20 100%)`
  ).trim();

  const glowIntensity = ['subtle', 'medium', 'high'].includes(raw.glowIntensity)
    ? raw.glowIntensity
    : (raw.glow ? 'medium' : 'medium');

  const glowColor = String(raw.glowColor || `${primaryColor}66`).trim();
  const glassBlur = typeof raw.glassBlur === 'number' && !isNaN(raw.glassBlur) ? raw.glassBlur : 16;
  const borderRadius = String(raw.borderRadius || '1rem').trim();
  const previewGradient = String(raw.previewGradient || buttonBg).trim();

  let swatches;
  if (Array.isArray(raw.swatches) && raw.swatches.length >= 5) {
    swatches = [
      String(raw.swatches[0]).trim(),
      String(raw.swatches[1]).trim(),
      String(raw.swatches[2]).trim(),
      String(raw.swatches[3]).trim(),
      String(raw.swatches[4]).trim(),
    ];
  } else if (Array.isArray(raw.swatches) && raw.swatches.length > 0) {
    const pool = [
      ...raw.swatches.map(s => String(s || '').trim()).filter(Boolean),
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      headingColor,
    ];
    swatches = [
      pool[0] || primaryColor,
      pool[1] || secondaryColor,
      pool[2] || accentColor,
      pool[3] || backgroundColor,
      pool[4] || headingColor,
    ];
  } else {
    swatches = [primaryColor, secondaryColor, accentColor, backgroundColor, headingColor];
  }

  return {
    id,
    name,
    category,
    description,
    previewGradient,
    swatches,
    isFeatured: Boolean(raw.isFeatured),
    primaryColor,
    primaryHover,
    secondaryColor,
    secondaryHover,
    accentColor,
    backgroundColor,
    cardBackground,
    cardBorderColor,
    textColor,
    textMutedColor,
    headingColor,
    buttonBg,
    buttonText,
    navBackground,
    footerBackground,
    heroGradient,
    cardGradient,
    borderGradient,
    glowIntensity,
    glowColor,
    glassBlur,
    borderRadius,
  };
}

async function main() {
  console.log('Migrating and normalizing custom themes in database...');
  const current = await prisma.themeSettings.findUnique({ where: { id: 'default' } });
  if (!current) {
    console.log('No default ThemeSettings found.');
    return;
  }

  let customList = [];
  if (current.customGradientsJson) {
    try {
      const parsed = JSON.parse(current.customGradientsJson);
      if (Array.isArray(parsed)) {
        customList = parsed;
      }
    } catch (e) {
      console.error('Failed to parse current customGradientsJson:', e);
    }
  }

  console.log(`Found ${customList.length} custom themes in database.`);

  const normalized = customList
    .map((item, idx) => normalizeTheme(item, `custom-${idx + 1}`))
    .filter(Boolean);

  console.log(`Normalized ${normalized.length} themes. Verifying swatches:`);
  normalized.forEach((t, i) => {
    console.log(`  ${i + 1}. [${t.id}] "${t.name}" -> swatches:`, t.swatches);
  });

  const updated = await prisma.themeSettings.update({
    where: { id: 'default' },
    data: {
      customGradientsJson: JSON.stringify(normalized),
    },
  });

  console.log('Successfully updated ThemeSettings.customGradientsJson in SQLite database!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
