"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { MessageCircle, Save, Check, Phone, Mail, MapPin, Clock, ExternalLink, Trash2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  goal?: string | null;
  packageName?: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export default function ContactSettingsPage() {
  const [settings, setSettings] = useState({
    whatsappLocal: "01140108262",
    whatsappInternational: "+201140108262",
    whatsappDefaultMessage: "Hello Built By Boyka, I would like to know more about your coaching services.",
    whatsappPackageTemplate: "Hello Built By Boyka, I'm interested in the [Package Name] package. Please send me more details.",
    whatsappServiceTemplate: "Hello Built By Boyka, I'm interested in [Service Name]. Could you provide more information?",
    whatsappFloatingEnabled: true,
    whatsappFloatingPosition: "bottom-right",
    contactEmail: "contact@builtbyboyka.com",
    contactPhone: "+201140108262",
    location: "Cairo, Egypt / Worldwide Online Coaching",
    workingHours: "Daily: 9:00 AM - 11:00 PM (GMT+2)",
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const fetchData = async () => {
    try {
      const [settingsRes, inquiriesRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/inquiries"),
      ]);

      if (settingsRes.ok) {
        const s = await settingsRes.json();
        setSettings((prev) => ({ ...prev, ...s }));
      }
      if (inquiriesRes.ok) {
        const inq = await inquiriesRes.json();
        setInquiries(inq);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setSavedMessage("WhatsApp & Contact configurations saved!");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
      }
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry record?")) return;
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      }
    } catch (e) {
      alert("Failed to delete inquiry");
    }
  };

  const testWhatsAppUrl = buildWhatsAppUrl(settings.whatsappInternational, settings.whatsappDefaultMessage);

  return (
    <AdminLayout title="WhatsApp & Contact Configurations">
      <div className="space-y-10">
        
        {/* Settings Form */}
        <form onSubmit={handleSaveSettings} className="space-y-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-black text-xl text-white">
                Official WhatsApp & Business Contact
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Configure primary WhatsApp numbers, automated templates, and floating CTA widget.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {savedMessage && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>{savedMessage}</span>
                </span>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Settings"}</span>
              </button>
            </div>
          </div>

          {/* Numbers & Live Link Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <h3 className="font-heading font-black text-base uppercase tracking-wider text-gray-300">
              WhatsApp Contact Numbers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  International Number (Used for wa.me links) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.whatsappInternational}
                  onChange={(e) => setSettings({ ...settings, whatsappInternational: e.target.value })}
                  placeholder="+201140108262"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs font-bold focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Local Egyptian Number (Displayed in text)
                </label>
                <input
                  type="text"
                  value={settings.whatsappLocal}
                  onChange={(e) => setSettings({ ...settings, whatsappLocal: e.target.value })}
                  placeholder="01140108262"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Test Link Action */}
            <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white">Generated wa.me URL Test</p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">{testWhatsAppUrl}</p>
              </div>
              <a
                href={testWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shrink-0 shadow-md"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Message Templates */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <h3 className="font-heading font-black text-base uppercase tracking-wider text-gray-300">
              WhatsApp Message Templates
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Default General Inquiry Message
              </label>
              <textarea
                rows={2}
                value={settings.whatsappDefaultMessage}
                onChange={(e) => setSettings({ ...settings, whatsappDefaultMessage: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Package Inquiry Template (Uses [Package Name] placeholder)
              </label>
              <textarea
                rows={2}
                value={settings.whatsappPackageTemplate}
                onChange={(e) => setSettings({ ...settings, whatsappPackageTemplate: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Service Inquiry Template (Uses [Service Name] placeholder)
              </label>
              <textarea
                rows={2}
                value={settings.whatsappServiceTemplate}
                onChange={(e) => setSettings({ ...settings, whatsappServiceTemplate: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Floating Widget & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h4 className="font-heading font-black text-base text-white">
                Floating Button Settings
              </h4>

              <label className="flex items-center justify-between p-3 rounded-xl glass-panel border border-white/5 cursor-pointer">
                <span className="text-xs font-bold text-white">Enable Floating WhatsApp Button</span>
                <input
                  type="checkbox"
                  checked={settings.whatsappFloatingEnabled}
                  onChange={(e) => setSettings({ ...settings, whatsappFloatingEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Screen Position
                </label>
                <select
                  value={settings.whatsappFloatingPosition}
                  onChange={(e) => setSettings({ ...settings, whatsappFloatingPosition: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                >
                  <option value="bottom-right">Bottom Right (Standard)</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h4 className="font-heading font-black text-base text-white">
                Business & Working Hours
              </h4>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={settings.workingHours}
                  onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Coaching Headquarters / Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-white text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Incoming Inquiries Inbox */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-xl text-white">
                Coaching Inquiries Inbox ({inquiries.length})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                All client submissions from the website contact application form.
              </p>
            </div>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-8 text-center glass-panel rounded-2xl border border-white/5 text-gray-400 text-xs font-medium">
              No inquiries yet. Submissions from the public contact form appear here.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => {
                const replyUrl = buildWhatsAppUrl(
                  inq.phone,
                  `Hello ${inq.name}, Coach Boyka here! I reviewed your application regarding ${inq.goal || "coaching"}.`
                );

                return (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-heading font-black text-base text-white">
                          {inq.name}
                        </h4>
                        <span className="text-xs text-primary font-mono">{inq.phone}</span>
                        {inq.email && <span className="text-xs text-gray-400">({inq.email})</span>}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-dark-900 border border-white/10 text-xs font-bold text-gray-200 focus:outline-none"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>

                        <a
                          href={replyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1 text-gray-500 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span><strong>Target:</strong> {inq.goal}</span>
                      {inq.packageName && <span><strong>Package:</strong> {inq.packageName}</span>}
                      <span><strong>Date:</strong> {new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed bg-dark-900/40 p-3 rounded-xl border border-white/5">
                      &ldquo;{inq.message}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
