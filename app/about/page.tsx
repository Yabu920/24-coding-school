"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Rocket, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const features = [
  {
    icon: Award,
    title: "Outcome‑Driven",
    description:
      "We design curricula that lead to real, demonstrable skills — from first lines of code to portfolio‑ready projects.",
  },
  {
    icon: Users,
    title: "Learner‑First",
    description: "Supportive, inclusive learning for kids, teens, and adults with flexible pacing and live mentorship.",
  },
  {
    icon: Rocket,
    title: "Career‑Ready",
    description:
      "Practical roadmaps and hands‑on projects aligned to industry expectations to accelerate your journey.",
  },
]

const testimonials = [
  {
    quote:
      "24 Coding School helped me go from zero to building full web apps. The live sessions and projects were game‑changing.",
    name: "Sarah J.",
    role: "University Student",
  },
  {
    quote: "My son loves the Scratch classes! He’s confident and excited about coding every week.",
    name: "Bekele A.",
    role: "Parent",
  },
  {
    quote: "Clear structure, great teachers, and modern content. I landed my first internship shortly after.",
    name: "Michael C.",
    role: "High School Student",
  },
]

export default function AboutPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen">
      {/* SEO: You can add metadata in a server file next to this page (metadata.ts) */}
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40">
          <div className="container">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-3xl mx-auto text-center space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tight">About 24 Coding School</h1>
              <p className="text-lg text-muted-foreground">
                We empower learners of all ages to master programming through modern curricula, live teaching, and
                project‑based learning. Our mission is to make high‑quality tech education accessible, practical, and
                inspiring.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A foundation built on outcomes, mentorship, and real‑world skills.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                        <f.icon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials / Quotes */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold">What Learners Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Stories from our students and families.</p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Card aria-live="polite" aria-atomic="true">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
                      <Quote className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <AnimatePresence mode="wait">
                        <motion.blockquote
                          key={activeIndex}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.4 }}
                          className="text-lg leading-relaxed"
                        >
                          “{testimonials[activeIndex].quote}”
                        </motion.blockquote>
                      </AnimatePresence>
                      <div className="mt-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{testimonials[activeIndex].name}</span>
                        {" · "}
                        {testimonials[activeIndex].role}
                      </div>
                    </div>
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Show testimonial ${i + 1}`}
                        onClick={() => setActiveIndex(i)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          i === activeIndex ? "bg-blue-600" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
