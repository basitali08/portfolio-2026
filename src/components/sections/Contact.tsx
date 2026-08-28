"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Copy, Check, Mail, Github, Linkedin, Twitter, AlertCircle } from "lucide-react";
import { profile } from "@/lib/data";
import { copyToClipboard } from "@/lib/utils";
import { Parallax } from "@/components/ui/Parallax";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: Linkedin,
  Github: Github,
  Twitter: Twitter,
};

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onCopy = async () => {
    if (await copyToClipboard(profile.email)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 2400);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact" className="section-pad relative">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Parallax speed={0.35} axis="both" offset={80}>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
              >
                <span className="text-neon-cyan">07</span> · Contact
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className="h-display mt-4 text-4xl font-light tracking-tighter md:text-6xl"
              >
                Let's make{" "}
                <span className="gradient-text">something weird</span>.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 max-w-md text-pretty text-white/70"
              >
                Have a product idea, a hard problem, or a beautifully stupid
                concept? Send the gist. I read every line and reply within a
                working day.
              </motion.p>

              <div className="mt-8 space-y-3">
                <button
                  onClick={onCopy}
                  data-cursor="hover"
                  className="glass group flex w-full max-w-md items-center justify-between rounded-xl p-4 text-left transition hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.04] text-neon-cyan">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40">
                        Direct
                      </div>
                      <div className="font-mono text-sm text-white/90">
                        {profile.email}
                      </div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-neon-lime" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {profile.socials
                    .filter((s) => s.label !== "Email")
                    .map((s) => {
                      const Icon = socialIcons[s.label] ?? Mail;
                      return (
                        <a
                          key={s.href}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="hover"
                          className="glass flex items-center gap-3 rounded-xl p-4 transition hover:border-white/20"
                        >
                          <Icon className="h-4 w-4 text-white/70" />
                          <span className="text-sm text-white/80">
                            {s.label}
                          </span>
                        </a>
                      );
                    })}
                </div>
              </div>
            </div>
          </Parallax>

          <Parallax speed={0.25} axis="y" offset={60}>
            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="glass-strong space-y-4 rounded-3xl p-6 md:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  placeholder="Ada Lovelace"
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  placeholder="ada@you.dev"
                  required
                />
              </div>
              <Field
                label="Message"
                value={form.message}
                onChange={(v) => setForm({ ...form, message: v })}
                placeholder="Tell me the shape of the thing…"
                textarea
                required
              />
              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-xs text-white/40">
                  {form.message.length} chars · replies in &lt;24h
                </span>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  data-cursor="hover"
                  className="btn-primary disabled:opacity-50"
                  aria-live="polite"
                >
                  {status === "idle" && (
                    <>
                      Send <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                  {status === "sending" && "Sending…"}
                  {status === "sent" && (
                    <>
                      Sent <Check className="h-3.5 w-3.5" />
                    </>
                  )}
                  {status === "error" && (
                    <>
                      Error <AlertCircle className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </Parallax>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={5}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-neon-cyan/30"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-neon-cyan/30"
        />
      )}
    </label>
  );
}
