"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, MessageCircle, Bookmark } from "lucide-react"
import { useState } from "react"

const blogPosts: Record<
  string,
  {
    title: string
    content: string
    author: string
    date: string
    readTime: string
    category: string
    image: string
  }
> = {
  "safety-tips-walking-alone": {
    title: "10 Essential Safety Tips When Walking Alone at Night",
    content: `
Walking alone at night can feel daunting, but with the right precautions, you can significantly improve your safety. Here are 10 essential tips to keep in mind:

## 1. Stay Alert and Aware
Always be aware of your surroundings. Avoid using headphones at high volume or being distracted by your phone. Keep your head up and scan the area around you.

## 2. Plan Your Route
Before heading out, plan your route. Stick to well-lit, busy streets and avoid shortcuts through dark alleys or deserted areas. Let someone know your planned route and expected arrival time.

## 3. Trust Your Instincts
If something doesn't feel right, trust your gut. Cross the street, enter a store, or change your route if you sense danger. Your instincts are often your best defense.

## 4. Keep Your Phone Charged
Ensure your phone is fully charged before leaving. Having a way to call for help or use safety apps like ProtectMe SOS is crucial in emergencies.

## 5. Walk Confidently
Walk with purpose and confidence. Criminals often target people who appear vulnerable or distracted. Keep your body language strong and assertive.

## 6. Carry Safety Tools
Consider carrying personal safety items like a whistle, pepper spray (where legal), or a personal alarm. These can help deter attackers and attract attention.

## 7. Stay in Groups When Possible
There's safety in numbers. If possible, walk with friends or join others heading in the same direction. Many cities have community walking groups.

## 8. Know Your Emergency Contacts
Have emergency numbers saved and easily accessible. Use apps like ProtectMe SOS that can alert your contacts and authorities with one tap.

## 9. Avoid Isolated Areas
Stay away from parks, empty parking lots, and other isolated areas after dark. Stick to populated routes even if they take longer.

## 10. Use the ProtectMe Walk With Me Feature
Our Walk With Me feature allows trusted contacts to monitor your journey in real-time. They'll be alerted if you don't reach your destination on time.

Remember, your safety is paramount. These tips can help reduce risks, but always prioritize getting home safely over convenience.
    `,
    author: "Sarah Chen",
    date: "Dec 5, 2025",
    readTime: "6 min read",
    category: "Safety Tips",
    image: "/person-walking-at-night-with-street-lights.jpg",
  },
  "self-defense-basics": {
    title: "Self-Defense Basics Everyone Should Know",
    content: `
Knowing basic self-defense can be the difference between being a victim and escaping a dangerous situation. Here are fundamental techniques everyone should learn:

## The Power of Awareness
The best self-defense is avoiding dangerous situations altogether. Stay alert, trust your instincts, and remove yourself from potentially harmful situations.

## Key Target Areas
If you must defend yourself, aim for vulnerable areas:
- **Eyes**: A poke or jab can temporarily blind an attacker
- **Nose**: An upward palm strike can cause pain and disorientation
- **Throat**: A strike here can restrict breathing
- **Groin**: Effective against male attackers
- **Knees**: A kick to the side of the knee can disable an attacker

## Basic Techniques

### Palm Strike
Use the heel of your palm to strike upward at the attacker's nose or chin. This is safer than punching and less likely to injure your hand.

### Elbow Strike
If someone grabs you from behind, use your elbow to strike backward into their ribs or face.

### Knee Strike
When in close range, drive your knee up into the attacker's groin or midsection.

### Breaking Grips
If someone grabs your wrist, rotate your arm toward their thumb (the weakest point) and pull away quickly.

## Remember: Escape is the Goal
The purpose of self-defense is not to fight but to create an opportunity to escape. Strike, create distance, and run to safety.

## Practice Makes Prepared
Consider taking a self-defense class to practice these techniques in a safe environment. Our Self-Defense Training section has video tutorials to get you started.
    `,
    author: "Mike Torres",
    date: "Dec 3, 2025",
    readTime: "8 min read",
    category: "Self-Defense",
    image: "/self-defense-training-class.jpg",
  },
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likes, setLikes] = useState(247)

  const slug = params.slug as string
  const post = blogPosts[slug]

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-4">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button className="bg-emergency hover:bg-emergency/90">Back to Blog</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: `Check out this article: ${post.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikes((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <article>
          <div className="mb-6">
            <span className="text-emergency text-sm font-medium">{post.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>
          </div>

          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          />

          <div className="prose prose-invert max-w-none">
            {post.content.split("\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-bold text-foreground mt-8 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-xl font-semibold text-foreground mt-6 mb-3">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              }
              if (paragraph.startsWith("- **")) {
                const match = paragraph.match(/- \*\*(.+?)\*\*: (.+)/)
                if (match) {
                  return (
                    <p key={i} className="text-muted-foreground mb-2 pl-4">
                      • <strong className="text-foreground">{match[1]}</strong>: {match[2]}
                    </p>
                  )
                }
              }
              if (paragraph.trim()) {
                return (
                  <p key={i} className="text-muted-foreground mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                )
              }
              return null
            })}
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={liked ? "text-emergency" : "text-muted-foreground"}
              >
                <Heart className={`w-5 h-5 mr-1 ${liked ? "fill-current" : ""}`} />
                {likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <MessageCircle className="w-5 h-5 mr-1" />
                24
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSaved(!saved)}
                className={saved ? "text-emergency" : "text-muted-foreground"}
              >
                <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </article>

        <Card className="mt-12 bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Stay Safe with ProtectMe</h3>
            <p className="text-muted-foreground mb-4">
              Download ProtectMe SOS app to access all safety features including SOS alerts, live location sharing, and
              self-defense training.
            </p>
            <Link href="/download">
              <Button className="bg-emergency hover:bg-emergency/90">Download Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
