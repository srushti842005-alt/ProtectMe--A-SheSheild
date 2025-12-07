"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, User, ArrowRight, Search } from "lucide-react"
import Link from "next/link"

const posts = [
  {
    id: 1,
    title: "10 Essential Safety Tips for Women Walking Alone at Night",
    excerpt:
      "Learn practical strategies to stay safe when walking alone after dark, from choosing well-lit routes to using your phone wisely.",
    image: "/woman-walking-safely-at-night-city.jpg",
    category: "Safety Tips",
    author: "Priya Sharma",
    date: "Dec 5, 2024",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "How AI is Revolutionizing Personal Safety Apps",
    excerpt:
      "Discover how artificial intelligence is making safety apps smarter, from threat detection to predictive alerts.",
    image: "/ai-technology-safety-concept.jpg",
    category: "Technology",
    author: "Rahul Verma",
    date: "Dec 3, 2024",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Self-Defense Basics: Simple Moves Everyone Should Know",
    excerpt: "Master these fundamental self-defense techniques that could save your life in an emergency situation.",
    image: "/self-defense-training-class.jpg",
    category: "Self Defense",
    author: "Anita Desai",
    date: "Nov 28, 2024",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Understanding the Psychology of Safety: Why We Freeze in Emergencies",
    excerpt:
      "Learn about the fight, flight, or freeze response and how to train yourself to react effectively in dangerous situations.",
    image: "/psychology-brain-emergency-response.jpg",
    category: "Psychology",
    author: "Dr. Kavita Rao",
    date: "Nov 25, 2024",
    readTime: "8 min read",
  },
  {
    id: 5,
    title: "ProtectMe Success Stories: How Our App Saved Lives",
    excerpt:
      "Real stories from users who used ProtectMe in emergency situations and how the app helped them get to safety.",
    image: "/happy-woman-safe-smartphone.jpg",
    category: "Stories",
    author: "ProtectMe Team",
    date: "Nov 20, 2024",
    readTime: "10 min read",
  },
  {
    id: 6,
    title: "Setting Up Your Emergency Contacts: A Complete Guide",
    excerpt: "Step-by-step instructions on configuring your emergency contacts for maximum effectiveness.",
    image: "/smartphone-contacts-emergency.jpg",
    category: "Guides",
    author: "Support Team",
    date: "Nov 15, 2024",
    readTime: "4 min read",
  },
]

const categories = ["All", "Safety Tips", "Technology", "Self Defense", "Psychology", "Stories", "Guides"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleReadMore = (postId: number) => {
    const post = posts.find((p) => p.id === postId)
    const synth = window.speechSynthesis
    synth.speak(new SpeechSynthesisUtterance(`Opening article: ${post?.title}`))
    // In a real app, this would navigate to the full article
    alert(`Full article: ${post?.title}\n\n${post?.excerpt}\n\n[Full content would be displayed here]`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emergency/10 text-emergency border-emergency/20">Blog</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Safety Resources & Insights</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert advice, safety tips, and stories to help you stay protected.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-emergency hover:bg-emergency/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:border-emergency transition-colors">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-3">
                  {post.category}
                </Badge>
                <h2 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>
                <Button variant="ghost" className="w-full justify-between" onClick={() => handleReadMore(post.id)}>
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}

        {/* Newsletter */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">Get the latest safety tips and news delivered to your inbox.</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 p-3 border border-border rounded-lg bg-background"
              />
              <Button className="bg-emergency hover:bg-emergency/90">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
