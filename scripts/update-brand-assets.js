const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating database with official brand assets...');

  // 1. SiteSettings
  const site = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      logoUrl: '/images/logo-boyka.png',
      faviconUrl: '/images/logo-boyka.png',
    },
    create: {
      id: 'default',
      brandName: 'Built By Boyka',
      siteTitle: 'Built By Boyka | Premium Coaching',
      logoText: 'BUILT BY BOYKA',
      logoUrl: '/images/logo-boyka.png',
      faviconUrl: '/images/logo-boyka.png',
    },
  });
  console.log('✓ SiteSettings updated:', site.logoUrl, site.faviconUrl);

  // 2. Hero Section
  const hero = await prisma.sectionContent.upsert({
    where: { sectionKey: 'hero' },
    update: {
      imageUrl: '/images/head-coach.jpg',
    },
    create: {
      sectionKey: 'hero',
      title: 'FORGE YOUR ULTIMATE PHYSIQUE',
      imageUrl: '/images/head-coach.jpg',
    },
  });
  console.log('✓ Hero section updated with Coach Boyka photo:', hero.imageUrl);

  // 3. About Section
  const about = await prisma.sectionContent.upsert({
    where: { sectionKey: 'about' },
    update: {
      imageUrl: '/images/head-coach.jpg',
      secondaryImageUrl: null,
    },
    create: {
      sectionKey: 'about',
      title: 'MEET COACH BOYKA',
      imageUrl: '/images/head-coach.jpg',
    },
  });
  console.log('✓ About section updated with Coach Boyka photo:', about.imageUrl);

  // 4. MediaAsset table entries
  const logoAsset = await prisma.mediaAsset.create({
    data: {
      fileName: 'Logo Boyka.png',
      url: '/images/logo-boyka.png',
      fileSize: 1248940,
      mimeType: 'image/png',
      category: 'branding',
      altText: 'Built By Boyka Official Brand Logo',
    },
  });
  console.log('✓ MediaAsset created for Logo:', logoAsset.url);

  const coachAsset = await prisma.mediaAsset.create({
    data: {
      fileName: 'Head Coach.jpg',
      url: '/images/head-coach.jpg',
      fileSize: 51247,
      mimeType: 'image/jpeg',
      category: 'coach',
      altText: 'Coach Boyka - Head Coach and Founder',
    },
  });
  console.log('✓ MediaAsset created for Head Coach:', coachAsset.url);

  console.log('🎉 Database update completed successfully.');
}

main()
  .catch((err) => {
    console.error('Error updating assets in database:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
