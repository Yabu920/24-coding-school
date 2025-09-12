"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

type Post = {
  id: number
  title: string
  excerpt: string
  image: string
  href: string
  tags: string[]
}

const allPosts: Post[] = [
  {
    id: 1,
    title: "Getting Started with Scratch: A Parent’s Guide",
    excerpt:
      "Introduce your child to programming with Scratch — visual blocks that make learning logic fun and intuitive.",
    image: "/scratch-kids-coding.png",
    href: "#",
    tags: ["scratch", "kids"],
  },
  {
    id: 2,
    title: "Python Basics: Variables, Types, and Loops",
    excerpt: "Build a solid foundation in Python with practical examples and exercises for beginners.",
    image: "/python-tutorial.png",
    href: "#",
    tags: ["python", "beginners"],
  },
  {
    id: 3,
    title: "C++ Fundamentals for New Programmers",
    excerpt: "Understand the syntax, data types, and control flow that form the building blocks of C++.",
    image: "/c++-programming.png",
    href: "#",
    tags: ["c++", "fundamentals"],
  },
  {
    id: 4,
    title: "Web Development Roadmap: HTML, CSS, and JS",
    excerpt: "A step‑by‑step plan for learning modern web development with projects you can show employers.",
    image: "/web-development-roadmap.png",
    href: "#",
    tags: ["web", "roadmap"],
  },
  {
    id: 5,
    title: "Tips to Succeed in Live Coding Classes",
    excerpt: "Prepare your environment, ask great questions, and make the most of every session.",
    image: "/live-class-tips.png",
    href: "#",
    tags: ["live", "tips"],
  },
  {
    id: 6,
    title: "From Beginner to Project: Building Your First App",
    excerpt: "Turn fundamentals into a real project with a simple, achievable plan and milestones.",
    image: "/simple-geometric-art.png",
    href: "#",
    tags: ["project", "beginners"],
  },
]

export default function BlogPage() {
  const [query, setQuery] = useState("")
  const [visible, setVisible] = useState(6)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allPosts
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [query])

  const postsToShow = filtered.slice(0, visible)
  const canLoadMore = visible < filtered.length

  return (
    <div className="min-h-screen">
      {/* SEO: Add metadata.ts alongside this page to set page title/description */}
      <Header />
      <main>
        {/* Search */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tight">Blog & Resources</h1>
              <p className="text-lg text-muted-foreground">
                Tips, tutorials, and updates to support your coding journey.
              </p>
              <div className="max-w-xl mx-auto">
                <Input
                  aria-label="Search blog posts"
                  placeholder="Search articles by title, topic, or tag..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Posts */}
        <section className="pb-16">
          <div className="container">
            {postsToShow.length === 0 ? (
              <p className="text-center text-muted-foreground">No posts match your search.</p>
            ) : (
              <div role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsToShow.map((post, i) => (
                  <motion.div
                    role="listitem"
                    key={post.id}
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
                  >
                    <Card className="h-full group overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="group-hover:text-blue-600 transition">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild aria-label={`Read ${post.title}`}>
                          <Link href={post.href}>Read More</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {canLoadMore && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={() => setVisible((v) => v + 6)} aria-label="Load more posts">
                  Load More
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
