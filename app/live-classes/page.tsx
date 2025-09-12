"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Play } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"

type LiveClass = {
  id: number
  title: string
  dateISO: string
  instructor: string
  description: string
  link: string
}

const classes: LiveClass[] = [
  {
    id: 1,
    title: "Python: Functions and Parameters",
    dateISO: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(), // ~26 hours from now
    instructor: "Prof. Emma Wilson",
    description: "Deep dive into reusable functions, parameters, and return values with live coding exercises.",
    link: "#",
  },
  {
    id: 2,
    title: "Web Dev: CSS Grid & Flexbox",
    dateISO: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(), // ~3 days
    instructor: "Mr. David Rodriguez",
    description: "Master modern layout techniques and build fully responsive sections together.",
    link: "#",
  },
  {
    id: 3,
    title: "C++ Basics: Control Flow",
    dateISO: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(), // ~5 days
    instructor: "Dr. Michael Chen",
    description: "Learn conditionals, loops, and common patterns to solve problems efficiently.",
    link: "#",
  },
]

function useCountdown(targetISO?: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = targetISO ? new Date(targetISO).getTime() - now : 0
  const clamped = Math.max(0, diff)
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24))
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((clamped / (1000 * 60)) % 60)
  const seconds = Math.floor((clamped / 1000) % 60)
  return { days, hours, minutes, seconds, finished: clamped === 0 }
}

export default function LiveClassesPage() {
  const nextClass = useMemo(() => [...classes].sort((a, b) => +new Date(a.dateISO) - +new Date(b.dateISO))[0], [])
  const { days, hours, minutes, seconds, finished } = useCountdown(nextClass?.dateISO)

  return (
    <div className="min-h-screen">
      {/* SEO: Add metadata.ts alongside this page for canonical meta tags */}
      <Header />
      <main>
        {/* Countdown */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tight">Live Classes</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join interactive, instructor‑led sessions. Learn in real time, ask questions, and collaborate with
                peers.
              </p>
              {nextClass && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <span className="text-sm text-muted-foreground">Next class starts in</span>
                  <div className="flex items-center gap-3 text-2xl font-semibold">
                    <TimeBox label="Days" value={days} />
                    <span>:</span>
                    <TimeBox label="Hours" value={hours} />
                    <span>:</span>
                    <TimeBox label="Minutes" value={minutes} />
                    <span>:</span>
                    <TimeBox label="Seconds" value={seconds} />
                  </div>
                  {finished && <span className="text-green-600 font-medium">Live now</span>}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Upcoming list */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold">Upcoming Sessions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Reserve your seat and join via secure meeting links.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                >
                  <Card className="group h-full transition hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="group-hover:text-blue-600 transition">{c.title}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(c.dateISO).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(c.dateISO).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {c.instructor}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <p className="text-sm text-muted-foreground">{c.description}</p>
                      <Button asChild aria-label={`Join ${c.title} now`}>
                        <a href={c.link} className="inline-flex items-center">
                          <Play className="h-4 w-4 mr-2" />
                          Join Now
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stream placeholder */}
        <section className="pb-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Live Stream</CardTitle>
                  <CardDescription>Embed your streaming player or meeting here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative w-full overflow-hidden rounded-lg bg-slate-900 text-white"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-4 py-2 hover:bg-white/90 transition"
                        aria-label="Play stream"
                      >
                        <Play className="h-4 w-4" />
                        Play
                      </button>
                    </div>
                    <img
                      src="/placeholder-eikcb.png"
                      alt="Live stream placeholder"
                      className="absolute inset-0 h-full w-full object-cover opacity-30"
                    />
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

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center min-w-[70px]">
      <div className="rounded-md bg-white dark:bg-slate-800 border px-3 py-2 shadow-sm">
        <span className="tabular-nums">{value.toString().padStart(2, "0")}</span>
      </div>
      <div className="text-xs mt-1 text-muted-foreground">{label}</div>
    </div>
  )
}
