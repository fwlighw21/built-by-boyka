const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetToBrandTheme() {
  await prisma.themeSettings.update({
    where: { id: 'default' },
    data: {
      activePreset: 'luminous-purple',
      primaryColor: '#7547F5',
      primaryHover: '#6532eb',
      secondaryColor: '#9B7BFF',
      secondaryHover: '#8963ff',
      accentColor: '#C9B9FF',
      backgroundColor: '#05030a',
      cardBackground: 'rgba(14, 9, 28, 0.75)',
      cardBorderColor: 'rgba(155, 123, 255, 0.22)',
      textColor: '#ffffff',
      textMutedColor: '#9d8ec2',
      headingColor: '#ffffff',
      buttonBg: 'linear-gradient(135deg, #5424D8 0%, #7547F5 50%, #9B7BFF 100%)',
      heroGradient: 'linear-gradient(135deg, rgba(84, 36, 216, 0.28) 0%, rgba(117, 71, 245, 0.18) 50%, transparent 100%)',
      borderGradient: 'linear-gradient(135deg, rgba(155, 123, 255, 0.35) 0%, rgba(117, 71, 245, 0.1) 100%)',
      glowIntensity: 'medium',
      glowColor: 'rgba(117, 71, 245, 0.45)',
    },
  });
  console.log('✓ Reset active theme to Luminous Violet (Logo Identity)');
}

resetToBrandTheme().finally(async () => {
  await prisma.$disconnect();
});
