"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" })
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const errors = {
    name: form.name.trim().length < 2 ? "Please enter your full name." : "",
    email: !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(form.email) ? "Enter a valid email address." : "",
    subject: form.subject.trim().length < 3 ? "Subject must be at least 3 characters." : "",
    message: form.message.trim().length < 10 ? "Message should be at least 10 characters." : "",
  }

  const hasErrors = Object.values(errors).some(Boolean)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, subject: true, message: true })
    if (hasErrors) return
    setSubmitting(true)
    // Placeholder submit — integrate a server action or API route here.
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setSent(true)
    setForm({ name: "", email: "", subject: "", message: "" })
    setTouched({ name: false, email: false, subject: false, message: false })
  }

  return (
    <div className="min-h-screen">
      {/* SEO: Add metadata.ts alongside this page for real meta tags */}
      <Header />
      <main>
        <section className="py-16">
          <div className="container grid grid-cols-1 lg:grid-cols-5 gap-8">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Contact form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          aria-invalid={touched.name && !!errors.name}
                          aria-describedby="name-error"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        />
                        {touched.name && errors.name && (
                          <p id="name-error" className="mt-1 text-sm text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          aria-invalid={touched.email && !!errors.email}
                          aria-describedby="email-error"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                        />
                        {touched.email && errors.email && (
                          <p id="email-error" className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        aria-invalid={touched.subject && !!errors.subject}
                        aria-describedby="subject-error"
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
                      />
                      {touched.subject && errors.subject && (
                        <p id="subject-error" className="mt-1 text-sm text-red-600">
                          {errors.subject}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Share a few details about your question..."
                        rows={5}
                        aria-invalid={touched.message && !!errors.message}
                        aria-describedby="message-error"
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                      />
                      {touched.message && errors.message && (
                        <p id="message-error" className="mt-1 text-sm text-red-600">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">We typically reply within 24 hours.</p>
                      <Button type="submit" aria-label="Send message" disabled={submitting}>
                        {submitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                    {sent && (
                      <p role="status" className="text-sm text-green-600">
                        Thank you! Your message has been sent.
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <h2 className="text-2xl font-semibold">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Reach us via email, phone, or visit our campus. Follow us for updates and resources.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>info@24codingschool.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span>+251 911 123 456</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Addis Ababa, Ethiopia</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                className="overflow-hidden rounded-lg border"
              >
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    title="24 Coding School Location"
                    src="https://www.google.com/maps?q=Addis%20Ababa&output=embed"
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    aria-label="Map location of 24 Coding School"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
