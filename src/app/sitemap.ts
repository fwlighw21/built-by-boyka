import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://builtbyboyka.com";

  try {
    const [services, packages, customPages] = await Promise.all([
      prisma.coachingService.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.coachingPackage.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.customPage.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const sitemapEntries: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1.0,
      },
    ];

    for (const s of services) {
      sitemapEntries.push({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const p of customPages) {
      sitemapEntries.push({
        url: `${baseUrl}/pages/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    return sitemapEntries;
  } catch {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}
