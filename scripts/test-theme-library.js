const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const fileContent = fs.readFileSync('src/lib/themeLibrary.ts', 'utf8');
  // Match theme objects count
  const themeMatches = fileContent.match(/id:\s*["'][a-z0-9-]+["']/g) || [];
  console.log('✓ Found theme IDs in library:', themeMatches.length);

  const themeNames = fileContent.match(/name:\s*["'][^"']+["']/g) || [];
  console.log('✓ Found theme names:');
  themeNames.forEach((n, i) => console.log(`   ${i + 1}. ${n.replace(/name:\s*["']/, '').replace(/["']/, '')}`));

  // Check current theme in DB
  const current = await prisma.themeSettings.findUnique({ where: { id: 'default' } });
  console.log('✓ Current DB activePreset:', current?.activePreset, '| Primary:', current?.primaryColor);
}

main().finally(async () => {
  await prisma.$disconnect();
});
