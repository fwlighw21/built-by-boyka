const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDb() {
  // 1. Featured video
  await prisma.featuredVideoSettings.update({
    where: { id: 'default' },
    data: { thumbnailUrl: '/images/cached/video-feature.jpg' }
  });
  console.log('Updated featured video thumbnail');

  // 2. Transformations
  const trans4 = await prisma.clientTransformation.findFirst({
    where: { clientName: 'Youssef F.' }
  });
  if (trans4) {
    await prisma.clientTransformation.update({
      where: { id: trans4.id },
      data: {
        beforeImage: '/images/cached/trans-before-4.jpg',
        afterImage: '/images/cached/trans-after-4.jpg'
      }
    });
    console.log('Updated Youssef F. transformation images');
  }

  // 3. Testimonials
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  const avatarPaths = [
    '/images/cached/avatar-1.jpg',
    '/images/cached/avatar-2.jpg',
    '/images/cached/avatar-3.jpg',
    '/images/cached/avatar-4.jpg'
  ];
  for (let i = 0; i < testimonials.length; i++) {
    await prisma.testimonial.update({
      where: { id: testimonials[i].id },
      data: { avatarUrl: avatarPaths[i % avatarPaths.length] }
    });
  }
  console.log(`Updated ${testimonials.length} testimonials avatars`);

  // 4. Video items
  const videos = await prisma.videoItem.findMany({ orderBy: { order: 'asc' } });
  const videoThumbs = [
    '/images/cached/video-thumb-1.jpg',
    '/images/cached/video-thumb-2.jpg',
    '/images/cached/video-thumb-3.jpg'
  ];
  for (let i = 0; i < videos.length; i++) {
    await prisma.videoItem.update({
      where: { id: videos[i].id },
      data: { thumbnailUrl: videoThumbs[i % videoThumbs.length] }
    });
  }
  console.log(`Updated ${videos.length} videos thumbnails`);

  await prisma.$disconnect();
}

updateDb().catch(console.error);
