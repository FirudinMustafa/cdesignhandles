"use server";

import { Resend } from "resend";
import { getDictionary, hasLocale } from "@/lib/i18n";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<string, string>>;
};

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const lang = String(formData.get("lang") ?? "tr");
  const f = getDictionary(hasLocale(lang) ? lang : "tr").contact.form;

  // Bot tuzağı: gerçek kullanıcılar bu alanı görmez
  if (formData.get("website")) return { status: "success" };

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const data = {
    name: get("name"),
    company: get("company"),
    email: get("email"),
    phone: get("phone"),
    subject: get("subject"),
    message: get("message"),
  };

  const errors: Record<string, string> = {};
  const required = { name: f.name, email: f.email, subject: f.subject, message: f.message } as const;
  for (const [key, label] of Object.entries(required)) {
    if (!data[key as keyof typeof data]) errors[key] = `${label} ${f.required}`;
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = f.invalidEmail;
  if (data.phone && data.phone.replace(/\D/g, "").length < 7) errors.phone = f.invalidPhone;
  if (data.subject && !f.subjects.includes(data.subject)) errors.subject = f.invalidSubject;
  if (formData.get("consent") !== "on") errors.consent = f.consentRequired;

  if (Object.keys(errors).length) return { status: "error", message: f.checkFields, errors };

  const rows = [
    ["Ad Soyad", data.name],
    ["Firma", data.company || "-"],
    ["E-posta", data.email],
    ["Telefon", data.phone || "-"],
    ["Konu", data.subject],
    ["Mesaj", data.message],
    ["Dil", lang],
  ];

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[iletisim] E-posta servisi yapılandırılmadı, talep konsola yazıldı:", Object.fromEntries(rows));
      return { status: "success" };
    }
    console.error("[iletisim] RESEND_API_KEY veya CONTACT_TO_EMAIL eksik.");
    return { status: "error", message: f.unavailable };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "C-Design Handles <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      replyTo: data.email,
      subject: `C-Design Handles · ${data.subject} – ${data.company || data.name}`,
      html: `<h2>Yeni talep (cdesignhandles.com)</h2><table cellpadding="6" style="border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><td style="border:1px solid #ddd"><b>${k}</b></td><td style="border:1px solid #ddd">${escape(v).replace(/\n/g, "<br>")}</td></tr>`)
        .join("")}</table>`,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("[iletisim] Gönderim hatası:", err);
    return { status: "error", message: f.failed };
  }

  return { status: "success" };
}
