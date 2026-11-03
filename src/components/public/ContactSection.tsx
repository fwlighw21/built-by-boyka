"use client";

import React, { useState } from "react";
import { MessageCircle, Send, CheckCircle2, Phone, Mail, MapPin, Clock, AlertCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface ContactProps {
  title?: string;
  subtitle?: string;
  badge?: string | null;
  whatsappPhone?: string;
  whatsappLocal?: string;
  contactEmail?: string;
  location?: string;
  workingHours?: string;
}

export default function ContactSection({
  title = "READY TO BUILD YOUR BEST SELF?",
  subtitle = "Connect directly with Coach Boyka on WhatsApp for instant evaluation and enrollment.",
  badge = "DIRECT ACCESS",
  whatsappPhone = "+201140108262",
  whatsappLocal = "01140108262",
  contactEmail = "contact@builtbyboyka.com",
  location = "Cairo, Egypt / Worldwide Online Coaching",
  workingHours = "Daily: 9:00 AM - 11:00 PM (GMT+2)",
}: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    goal: "Fat Loss & Shred",
    packageName: "Gold Dominance (3 Months)",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const directWhatsAppUrl = buildWhatsAppUrl(
    whatsappPhone,
    "Hello Built By Boyka, I would like to know more about your coaching services."
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please message directly on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && (
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 mb-3">
              {badge}
            </span>
          )}
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-gray-400 mt-4 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Direct WhatsApp VIP Card & Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* VIP WhatsApp Card */}
            <div className="glass-card rounded-3xl p-8 border-2 border-primary/40 relative overflow-hidden bg-dark-850/90 shadow-2xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl gradient-btn bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-accent">FASTEST RESPONSE</span>
                  <h3 className="font-heading font-black text-xl text-white">Direct WhatsApp VIP Line</h3>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                Skip the waiting time. Send Coach Boyka a direct WhatsApp message right now to discuss your goals, check available slots, and start within 48 hours.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 block">International / wa.me</span>
                    <span className="font-bold text-white">{whatsappPhone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 block">Local Egypt Direct</span>
                    <span className="font-bold text-white">{whatsappLocal}</span>
                  </div>
                </div>
              </div>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-extrabold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Open WhatsApp Chat (+201140108262)</span>
              </a>
            </div>

            {/* Operating Details Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>{workingHours}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>{contactEmail}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10">
              <h3 className="font-heading font-black text-2xl text-white mb-2">
                Send an Application
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Fill in your details below and our team will get in touch via WhatsApp or email.
              </p>

              {success ? (
                <div className="p-8 rounded-2xl glass-panel border border-primary/30 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-primary/20 text-accent flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-black text-2xl text-white">Application Received!</h4>
                  <p className="text-sm text-gray-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your inquiry has been saved to our coaching queue.
                  </p>
                  <div className="pt-2">
                    <a
                      href={buildWhatsAppUrl(
                        whatsappPhone,
                        `Hello Built By Boyka, I just submitted an inquiry on your website! My name is ${formData.name}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-lg hover:scale-105 transition-transform"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Speed up review on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ahmed Samir"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-dark-950/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +20 114 010 8262"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-dark-950/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="ahmed@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-dark-950/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                        Primary Fitness Target
                      </label>
                      <select
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-dark-950/70 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="Fat Loss & Shred">Fat Loss & Shred</option>
                        <option value="Muscle Hypertrophy">Muscle Hypertrophy</option>
                        <option value="Total Body Recomposition">Total Body Recomposition</option>
                        <option value="Competition & Stage Prep">Competition & Stage Prep</option>
                        <option value="General Health & Posture">General Health & Posture</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Desired Package
                    </label>
                    <select
                      value={formData.packageName}
                      onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-950/70 border border-white/10 text-white text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="Silver Transformation (1 Month)">Silver Transformation (1 Month)</option>
                      <option value="Gold Dominance (3 Months)">Gold Dominance (3 Months - Most Popular)</option>
                      <option value="VIP Elite Inner Circle (6 Months)">VIP Elite Inner Circle (6 Months)</option>
                      <option value="VIP 1-on-1 Transformation Program">VIP 1-on-1 Transformation Program</option>
                      <option value="Other / Undecided">Other / Need Recommendation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Tell Coach Boyka About Your Background & Goals
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your current height, weight, how long you've been training, and what challenges you're facing..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-950/70 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-extrabold text-white gradient-btn bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? "Submitting Application..." : "Submit Coaching Application"}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
