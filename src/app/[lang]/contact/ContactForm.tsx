"use client";

import { startTransition, useActionState, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { submitContact, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-stone">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-red-700">{error}</span>}
    </label>
  );
}

export function ContactForm({ locale, t }: { locale: Locale; t: Dictionary["contact"]["form"] }) {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  // "Yeni talep" denince o başarı sonucu kapatılır; her gönderim yeni bir sonuç nesnesi döndürür
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const e = state.errors ?? {};

  if (state.status === "success" && state !== dismissed) {
    return (
      <div className="flex flex-col items-start py-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold-dark">
          <Check className="h-6 w-6" strokeWidth={1.4} />
        </span>
        <h3 className="display mt-8 text-4xl">{t.successTitle}</h3>
        <p className="mt-4 text-stone">{t.successText}</p>
        <button type="button" onClick={() => setDismissed(state)} className="link-line mt-10 text-umber">
          {t.again}
        </button>
      </div>
    );
  }

  // action prop'u yerine onSubmit: hata durumunda React girilen değerleri sıfırlamasın
  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    startTransition(() => formAction(fd));
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-8 sm:grid-cols-2" noValidate>
      <input type="hidden" name="lang" value={locale} />
      {/* Bot tuzağı */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <Field label={`${t.name} *`} error={e.name}>
        <input name="name" required autoComplete="name" className="field" />
      </Field>
      <Field label={t.company}>
        <input name="company" autoComplete="organization" className="field" />
      </Field>
      <Field label={`${t.email} *`} error={e.email}>
        <input name="email" type="email" required autoComplete="email" className="field" />
      </Field>
      <Field label={t.phone} error={e.phone}>
        <input name="phone" type="tel" autoComplete="tel" className="field" />
      </Field>
      <div className="sm:col-span-2">
        <Field label={`${t.subject} *`} error={e.subject}>
          <select name="subject" required defaultValue="" className="field cursor-pointer">
            <option value="" disabled>
              —
            </option>
            {t.subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label={`${t.message} *`} error={e.message}>
          <textarea name="message" required rows={5} className="field resize-none" />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-stone">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-gold-dark" />
          <span>{t.consent}</span>
        </label>
        {e.consent && <span className="mt-1.5 block text-xs text-red-700">{e.consent}</span>}
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        {state.status === "error" && state.message ? <p className="text-sm text-red-700">{state.message}</p> : <span />}
        <button type="submit" disabled={pending} className="btn btn-gold disabled:opacity-60">
          {pending ? t.sending : t.submit} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </form>
  );
}
