import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { parseJsonSafe, getYouTubeEmbedUrl } from "@/lib/utils";
import { MessageCircle, Check, ArrowRight } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface PageProps {
  params: { slug: string };
}

export default async function DynamicCustomPage({ params }: PageProps) {
  const [page, site, navItems] = await Promise.all([
    prisma.customPage.findUnique({
      where: { slug: params.slug },
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.navigationItem.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
  ]);

  // Draft protection: hide drafts from public visitors
  if (!page || !page.isPublished) {
    notFound();
  }

  const blocks = parseJsonSafe<any[]>(page.blocksJson, []);
  const phone = site?.whatsappInternational || "+201140108262";

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Navbar
        brandName={site?.brandName}
        logoText={site?.logoText}
        logoUrl={site?.logoUrl}
        whatsappPhone={phone}
        navItems={navItems}
      />

      <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight">
            {page.title}
          </h1>
          {page.metaDescription && (
            <p className="text-base sm:text-lg text-gray-400 mt-4 leading-relaxed">
              {page.metaDescription}
            </p>
          )}
        </header>

        {/* Dynamic Reusable Blocks */}
        <div className="space-y-12">
          {blocks.map((block, idx) => {
            switch (block.type) {
              case "heading":
                return (
                  <div key={idx} className="my-6">
                    <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                      {block.content}
                    </h2>
                  </div>
                );

              case "rich_text":
                return (
                  <div key={idx} className="glass-card p-6 sm:p-8 rounded-2xl text-gray-300 text-base leading-relaxed space-y-4 border border-white/10">
                    {block.content?.split("\n\n").map((p: string, i: number) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                );

              case "image":
                return (
                  <div key={idx} className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-white/10">
                    <Image
                      src={block.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"}
                      alt={block.caption || page.title}
                      fill
                      className="object-cover"
                    />
                    {block.caption && (
                      <div className="absolute bottom-3 left-4 right-4 text-xs text-gray-300 glass-panel px-3 py-1.5 rounded-lg">
                        {block.caption}
                      </div>
                    )}
                  </div>
                );

              case "video":
                return (
                  <div key={idx} className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-white/10">
                    <iframe
                      src={getYouTubeEmbedUrl(block.videoUrl)}
                      title={block.title || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                );

              case "cta_banner":
                return (
                  <div key={idx} className="glass-card p-8 sm:p-12 rounded-3xl border-2 border-primary/30 text-center space-y-6 bg-gradient-to-tr from-dark-900 to-dark-850">
                    <h3 className="font-heading font-black text-2xl sm:text-4xl text-white">
                      {block.title || "Ready to Level Up?"}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
                      {block.description || "Start your transformation with Coach Boyka today."}
                    </p>
                    <a
                      href={block.buttonLink || buildWhatsAppUrl(phone, "Hello Built By Boyka, I would like to join your coaching.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
                    >
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span>{block.buttonText || "Message on WhatsApp"}</span>
                    </a>
                  </div>
                );

              case "stats":
                return (
                  <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(block.items || []).map((st: any, i: number) => (
                      <div key={i} className="glass-card p-6 rounded-2xl text-center">
                        <p className="font-heading font-black text-3xl text-primary">{st.number}</p>
                        <p className="text-xs text-gray-400 mt-1">{st.label}</p>
                      </div>
                    ))}
                  </div>
                );

              default:
                return (
                  <div key={idx} className="p-4 rounded-xl glass-panel text-gray-300">
                    {block.content}
                  </div>
                );
            }
          })}
        </div>
      </div>

      <Footer
        brandName={site?.brandName}
        logoText={site?.logoText}
        logoUrl={site?.logoUrl || "/images/logo-boyka.png"}
        whatsappPhone={phone}
        whatsappLocal={site?.whatsappLocal}
      />
    </main>
  );
}
