/**
 * WhatsApp integration utilities for Built By Boyka
 * Default International Number: +201140108262
 * Default wa.me URL format: https://wa.me/201140108262
 */

export function normalizeWhatsAppNumber(phone: string): string {
  if (!phone) return "201140108262";
  
  // Remove all non-digit characters
  let clean = phone.replace(/\D/g, "");

  // If local Egyptian number starting with 01 (e.g. 01140108262)
  if (clean.startsWith("01") && clean.length === 11) {
    clean = "2" + clean;
  }
  
  return clean || "201140108262";
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = normalizeWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function getGeneralWhatsAppUrl(
  phone: string = "+201140108262",
  customMessage?: string
): string {
  const defaultMsg = "Hello Built By Boyka, I would like to know more about your coaching services.";
  return buildWhatsAppUrl(phone, customMessage || defaultMsg);
}

export function getPackageWhatsAppUrl(
  packageName: string,
  phone: string = "+201140108262",
  template?: string
): string {
  const defaultTemplate = "Hello Built By Boyka, I'm interested in the [Package Name] package. Please send me more details.";
  const msgTemplate = template || defaultTemplate;
  const message = msgTemplate.replace("[Package Name]", packageName);
  return buildWhatsAppUrl(phone, message);
}

export function getServiceWhatsAppUrl(
  serviceName: string,
  phone: string = "+201140108262",
  template?: string
): string {
  const defaultTemplate = "Hello Built By Boyka, I'm interested in [Service Name]. Could you provide more information?";
  const msgTemplate = template || defaultTemplate;
  const message = msgTemplate.replace("[Service Name]", serviceName);
  return buildWhatsAppUrl(phone, message);
}
