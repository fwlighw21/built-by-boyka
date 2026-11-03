const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  const site = await prisma.siteSettings.findFirst();
  const hero = await prisma.sectionContent.findUnique({ where: { sectionKey: 'hero' } });
  const about = await prisma.sectionContent.findUnique({ where: { sectionKey: 'about' } });
  const media = await prisma.mediaAsset.findMany();

  console.log('SITE:', JSON.stringify({ brandName: site?.brandName, logoUrl: site?.logoUrl, faviconUrl: site?.faviconUrl }, null, 2));
  console.log('HERO IMAGE:', hero?.imageUrl);
  console.log('ABOUT IMAGE:', about?.imageUrl, '| SECONDARY:', about?.secondaryImageUrl);
  console.log('MEDIA ASSETS (' + media.length + '):');
  media.forEach((m) => console.log('  -', m.fileName, '->', m.url, `(${m.category})`));

  await prisma.$disconnect();
}

verify();
