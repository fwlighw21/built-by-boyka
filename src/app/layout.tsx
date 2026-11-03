import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { ensureDatabaseSynced } from "@/lib/syncDb";
import ThemeInjector from "@/components/public/ThemeInjector";
import BackgroundOrbs from "@/components/public/BackgroundOrbs";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [site, seo] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
      prisma.seoSettings.findUnique({ where: { id: "default" } }),
    ]);

    const title = site?.siteTitle || "Built By Boyka | Premium Coaching";
    const description =
      seo?.metaDescription ||
      "Elite online fitness coaching, custom diet protocols, personalized training programs, and transformation guidance by Boyka.";

    return {
      title,
      description,
      keywords: seo?.keywords || "fitness coaching, online coach, body transformation, muscle building, fat loss, Boyka coaching",
      openGraph: {
        title,
        description,
        siteName: site?.brandName || "Built By Boyka",
        images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
      },
      icons: {
        icon: site?.faviconUrl || "/images/logo-boyka.png",
        apple: "/images/logo-boyka.png",
      },
    };
  } catch {
    return {
      title: "Built By Boyka | Premium Coaching",
      description: "Elite online fitness coaching by Coach Boyka.",
      icons: {
        icon: "/images/logo-boyka.png",
        apple: "/images/logo-boyka.png",
      },
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureDatabaseSynced();

  let theme = null;
  let animations = null;
  let site = null;

  try {
    [theme, animations, site] = await Promise.all([
      prisma.themeSettings.findUnique({ where: { id: "default" } }),
      prisma.animationSettings.findUnique({ where: { id: "default" } }),
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
    ]);
  } catch (e) {
    console.error("Layout fetch error:", e);
  }

  // Cross-environment / Serverless cookie fallback
  if (!theme) {
    try {
      const cookieTheme = cookies().get("boyka_theme_settings")?.value;
      if (cookieTheme) {
        theme = JSON.parse(cookieTheme);
      }
    } catch {
      // ignore
    }
  }

  return (
    <html lang="en" className="dark">
      <head>
        <ThemeInjector theme={theme} />
      </head>
      <body className="bg-dark-950 text-slate-100 min-h-screen relative antialiased selection:bg-cyan-500 selection:text-black">
        <BackgroundOrbs settings={animations} />
        {children}
        <FloatingWhatsApp
          phone={site?.whatsappInternational || "+201140108262"}
          defaultMessage={site?.whatsappDefaultMessage}
          enabled={site?.whatsappFloatingEnabled !== false}
          position={site?.whatsappFloatingPosition || "bottom-right"}
        />
      </body>
    </html>
  );
}
