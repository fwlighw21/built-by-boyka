import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  FileText,
  Layers,
  Dumbbell,
  Tag,
  Trophy,
  Video,
  MessageSquareQuote,
  MessageCircle,
  TrendingUp,
  Plus,
  Palette,
  ExternalLink,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  const [
    publishedPages,
    draftPages,
    servicesCount,
    packagesCount,
    transformationsCount,
    videosCount,
    testimonialsCount,
    inquiriesCount,
    recentInquiries,
    site,
  ] = await Promise.all([
    prisma.customPage.count({ where: { isPublished: true } }),
    prisma.customPage.count({ where: { isPublished: false } }),
    prisma.coachingService.count({ where: { isPublished: true } }),
    prisma.coachingPackage.count({ where: { isPublished: true } }),
    prisma.clientTransformation.count({ where: { isPublished: true } }),
    prisma.videoItem.count({ where: { isPublished: true } }),
    prisma.testimonial.count({ where: { isPublished: true } }),
    prisma.contactInquiry.count(),
    prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const stats = [
    { label: "Active Packages", value: packagesCount, icon: Tag, href: "/admin/packages", color: "from-cyan-500 to-blue-500" },
    { label: "Coaching Services", value: servicesCount, icon: Dumbbell, href: "/admin/services", color: "from-purple-500 to-pink-500" },
    { label: "Client Results", value: transformationsCount, icon: Trophy, href: "/admin/transformations", color: "from-amber-500 to-orange-500" },
    { label: "Testimonials", value: testimonialsCount, icon: MessageSquareQuote, href: "/admin/testimonials", color: "from-emerald-500 to-teal-500" },
    { label: "Video Masterclasses", value: videosCount, icon: Video, href: "/admin/videos", color: "from-red-500 to-rose-500" },
    { label: "Published Pages", value: publishedPages, icon: Layers, href: "/admin/pages", color: "from-indigo-500 to-cyan-500" },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-8">
        
        {/* Welcome Header & Quick Action Row */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Database Active</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Welcome Back, Coach Boyka
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Your website is live at <span className="text-white font-mono">{site?.whatsappInternational || "+201140108262"}</span> with all systems operational.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/theme"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-200 glass-panel hover:text-white hover:border-primary/50 transition-colors"
            >
              <Palette className="w-4 h-4 text-primary" />
              <span>Gradient Editor</span>
            </Link>

            <Link
              href="/admin/transformations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Result</span>
            </Link>
          </div>
        </div>

        {/* Real Live Database Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link
                key={idx}
                href={s.href}
                className="glass-card p-5 rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-gray-400 group-hover:text-primary transition-colors">Manage →</span>
                </div>
                <div>
                  <p className="font-heading font-black text-3xl text-white group-hover:text-primary transition-colors">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">
                    {s.label}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Inquiries & Quick WhatsApp Actions */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-black text-xl text-white">
                Recent Inquiries & Applications ({inquiriesCount})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Prospective athletes who submitted their details on your contact form.
              </p>
            </div>

            <Link
              href="/admin/contact"
              className="text-xs font-bold text-primary hover:underline"
            >
              View Full Inbox →
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-2xl border border-white/5">
              <MessageCircle className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-medium">No inquiries received yet.</p>
              <p className="text-xs text-gray-500 mt-1">Visitors can apply directly via the website contact form or WhatsApp.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">Applicant</th>
                    <th className="pb-3 font-bold">WhatsApp / Phone</th>
                    <th className="pb-3 font-bold">Primary Goal</th>
                    <th className="pb-3 font-bold">Package</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentInquiries.map((inq) => {
                    const waUrl = buildWhatsAppUrl(
                      inq.phone,
                      `Hello ${inq.name}, Coach Boyka here! I received your inquiry about the ${inq.packageName || "coaching"} program.`
                    );

                    return (
                      <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 font-bold text-white">
                          {inq.name}
                        </td>
                        <td className="py-3.5 text-gray-300 font-mono">
                          {inq.phone}
                        </td>
                        <td className="py-3.5 text-primary font-medium">
                          {inq.goal}
                        </td>
                        <td className="py-3.5 text-gray-300">
                          {inq.packageName || "General"}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inq.status === "NEW"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>Reply WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links to Key Website Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <h4 className="font-heading font-black text-lg text-white">
              Homepage Content
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Edit the Hero title, coach bio, trust indicators, and button links.
            </p>
            <Link
              href="/admin/content"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
            >
              <span>Edit Sections Content →</span>
            </Link>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <h4 className="font-heading font-black text-lg text-white">
              Gradients & Liquid Glass
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Customize colors, presets, background blur, and angles with instant live preview.
            </p>
            <Link
              href="/admin/theme"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
            >
              <span>Launch Theme Editor →</span>
            </Link>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
            <h4 className="font-heading font-black text-lg text-white">
              WhatsApp VIP Line
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Currently configured to <strong className="text-white">+201140108262</strong>. Update numbers & templates.
            </p>
            <Link
              href="/admin/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
            >
              <span>Configure WhatsApp →</span>
            </Link>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
