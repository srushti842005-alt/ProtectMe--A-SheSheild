"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Play,
  Clock,
  ChevronRight,
  Search,
  BookOpen,
  Dumbbell,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Heart,
  Share2,
  Download,
} from "lucide-react"

const categories = [
  { id: "basics", name: "Basic Techniques", icon: Shield, count: 8 },
  { id: "escapes", name: "Escape Moves", icon: AlertTriangle, count: 6 },
  { id: "awareness", name: "Situational Awareness", icon: BookOpen, count: 5 },
  { id: "fitness", name: "Fitness Training", icon: Dumbbell, count: 7 },
]

const techniques = [
  {
    id: 1,
    category: "basics",
    title: "Palm Strike",
    description: "A powerful strike using the heel of your palm to target soft areas like the nose or chin.",
    duration: "3:45",
    difficulty: "Beginner",
    image: "/palm-strike-self-defense-technique-demonstration.jpg",
    videoUrl: "https://www.youtube.com/embed/T7aNSRoDCmg",
    steps: [
      "Stand with feet shoulder-width apart in a defensive stance",
      "Keep your fingers together and bend them slightly back",
      "Strike forward with the heel of your palm",
      "Aim for the nose, chin, or throat area",
      "Follow through and immediately return to defensive position",
    ],
    tips: [
      "Keep your wrist straight to avoid injury",
      "Generate power from your hips",
      "Practice on a padded surface first",
    ],
  },
  {
    id: 2,
    category: "basics",
    title: "Knee Strike",
    description: "Use your knee to deliver a powerful blow to an attacker's groin or midsection.",
    duration: "4:20",
    difficulty: "Beginner",
    image: "/knee-strike-self-defense-training.jpg",
    videoUrl: "https://www.youtube.com/embed/KVpxP3ZZtAc",
    steps: [
      "Grab the attacker's shoulders or neck for stability",
      "Pull them towards you as you drive your knee up",
      "Target the groin, stomach, or thigh",
      "Use your full body weight behind the strike",
      "Be ready to follow up or escape",
    ],
    tips: [
      "Pull the attacker into your knee for maximum impact",
      "Keep your standing leg slightly bent",
      "Practice balance exercises",
    ],
  },
  {
    id: 3,
    category: "basics",
    title: "Elbow Strike",
    description: "Close-range powerful strike using the point of your elbow.",
    duration: "3:30",
    difficulty: "Beginner",
    image: "/elbow-strike-self-defense-move.jpg",
    videoUrl: "https://www.youtube.com/embed/cLJmpdGN5qQ",
    steps: [
      "Keep your arm bent at a 90-degree angle",
      "Rotate your body to generate power",
      "Strike with the point of your elbow",
      "Target the face, temple, or ribs",
      "Can be delivered horizontally, upward, or downward",
    ],
    tips: ["Rotate your hips for more power", "Keep your fist tight", "Practice in front of a mirror"],
  },
  {
    id: 4,
    category: "escapes",
    title: "Wrist Grab Escape",
    description: "How to break free when someone grabs your wrist.",
    duration: "5:15",
    difficulty: "Beginner",
    image: "/wrist-grab-escape-technique.jpg",
    videoUrl: "https://www.youtube.com/embed/HnPzNHZfvKs",
    steps: [
      "Rotate your wrist toward the attacker's thumb",
      "The thumb is the weakest part of their grip",
      "Pull sharply in the direction of their thumb",
      "Step back as you pull to add momentum",
      "Immediately create distance and prepare to run or defend",
    ],
    tips: [
      "Speed is more important than strength",
      "Practice both left and right hands",
      "Yell loudly to startle the attacker",
    ],
  },
  {
    id: 5,
    category: "escapes",
    title: "Bear Hug Escape (Front)",
    description: "Escape when grabbed from the front with arms pinned.",
    duration: "6:00",
    difficulty: "Intermediate",
    image: "/bear-hug-escape-self-defense.jpg",
    videoUrl: "https://www.youtube.com/embed/D6JuFxRd3TE",
    steps: [
      "Drop your weight by bending your knees",
      "Create space by widening your stance",
      "Deliver a knee strike to the groin",
      "Push against their chin or eyes",
      "Break free and run to safety",
    ],
    tips: [
      "Lower your center of gravity immediately",
      "Bite if necessary - this is survival",
      "Make noise to attract attention",
    ],
  },
  {
    id: 6,
    category: "escapes",
    title: "Choke Defense (Front)",
    description: "How to escape when being choked from the front.",
    duration: "5:45",
    difficulty: "Intermediate",
    image: "/choke-defense-escape-technique.jpg",
    videoUrl: "https://www.youtube.com/embed/8pBHT7O2Ppo",
    steps: [
      "Tuck your chin to protect your airway",
      "Step to the side while turning",
      "Grab their arm and rotate your body",
      "Deliver a strike to vulnerable areas",
      "Push away and escape immediately",
    ],
    tips: [
      "Stay calm - panic uses more oxygen",
      "Move quickly before grip tightens",
      "Practice regularly to build muscle memory",
    ],
  },
  {
    id: 7,
    category: "awareness",
    title: "Reading Body Language",
    description: "Learn to identify potential threats before they happen.",
    duration: "8:30",
    difficulty: "Beginner",
    image: "/body-language-awareness-safety.jpg",
    videoUrl: "https://www.youtube.com/embed/YgF7X_ELmF4",
    steps: [
      "Watch for clenched fists or tense posture",
      "Notice if someone is watching you repeatedly",
      "Be aware of people hiding their hands",
      "Trust your gut feeling about someone",
      "Maintain distance from suspicious individuals",
    ],
    tips: [
      "Make brief eye contact to show awareness",
      "Walk confidently with purpose",
      "Avoid distractions like phones in risky areas",
    ],
  },
  {
    id: 8,
    category: "awareness",
    title: "Safe Walking Practices",
    description: "How to stay safe while walking alone.",
    duration: "6:15",
    difficulty: "Beginner",
    image: "/safe-walking-practices-night-safety.jpg",
    videoUrl: "https://www.youtube.com/embed/AYQxRmlxXhI",
    steps: [
      "Stay in well-lit, populated areas",
      "Keep your phone accessible but not out",
      "Share your location with trusted contacts",
      "Vary your routes regularly",
      "Have keys ready before reaching your door",
    ],
    tips: [
      "Walk against traffic to see approaching vehicles",
      "Keep one earbud out to hear surroundings",
      "Trust your instincts - cross the street if needed",
    ],
  },
  {
    id: 9,
    category: "fitness",
    title: "Core Strength Workout",
    description: "Build the core strength needed for self-defense moves.",
    duration: "15:00",
    difficulty: "All Levels",
    image: "/core-strength-workout-fitness-training.jpg",
    videoUrl: "https://www.youtube.com/embed/AnYl6Nk9GOA",
    steps: [
      "Plank hold - 30 seconds x 3",
      "Russian twists - 15 reps each side",
      "Leg raises - 12 reps x 3",
      "Mountain climbers - 20 reps x 3",
      "Dead bug exercise - 10 reps each side",
    ],
    tips: ["Focus on form over speed", "Breathe steadily throughout", "Increase difficulty gradually"],
  },
  {
    id: 10,
    category: "fitness",
    title: "Quick Cardio for Escape",
    description: "Build stamina to run away from danger.",
    duration: "12:00",
    difficulty: "Intermediate",
    image: "/cardio-workout-running-exercise.jpg",
    videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI",
    steps: [
      "High knees - 30 seconds",
      "Burpees - 10 reps",
      "Sprint in place - 20 seconds",
      "Jump squats - 15 reps",
      "Rest 30 seconds, repeat 3 times",
    ],
    tips: ["Warm up before starting", "Stay hydrated", "This mimics escape scenarios"],
  },
]

const emergencyTips = [
  "Always trust your instincts - if something feels wrong, leave",
  "Your safety is more valuable than any possession",
  "Make noise and attract attention when in danger",
  "Run if you can - fighting is the last resort",
  "Practice techniques regularly to build muscle memory",
  "Tell someone where you're going and when you'll return",
]

export default function SelfDefensePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTechnique, setSelectedTechnique] = useState<(typeof techniques)[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [savedTechniques, setSavedTechniques] = useState<number[]>([])

  const filteredTechniques = techniques.filter((t) => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleSaved = (id: number) => {
    setSavedTechniques((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  if (selectedTechnique) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => setSelectedTechnique(null)} className="mb-4 text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Training
            </Button>

            <div className="space-y-6">
              {/* Video Section */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-card border border-border">
                <iframe
                  src={selectedTechnique.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedTechnique.title}
                />
              </div>

              {/* Title & Actions */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{selectedTechnique.title}</h1>
                  <p className="text-muted-foreground mt-1">{selectedTechnique.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {selectedTechnique.duration}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        selectedTechnique.difficulty === "Beginner"
                          ? "bg-success/20 text-success"
                          : selectedTechnique.difficulty === "Intermediate"
                            ? "bg-warning/20 text-warning"
                            : "bg-emergency/20 text-emergency"
                      }`}
                    >
                      {selectedTechnique.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleSaved(selectedTechnique.id)}
                    className={savedTechniques.includes(selectedTechnique.id) ? "text-emergency" : ""}
                  >
                    <Heart
                      className={`w-4 h-4 ${savedTechniques.includes(selectedTechnique.id) ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Steps */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Step-by-Step Guide</h2>
                <div className="space-y-3">
                  {selectedTechnique.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emergency/20 text-emergency flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Pro Tips</h2>
                <div className="space-y-2">
                  {selectedTechnique.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference Image */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Reference Image</h2>
                <img
                  src={selectedTechnique.image || "/placeholder.svg"}
                  alt={selectedTechnique.title}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Self-Defense Training</h1>
            <p className="text-muted-foreground">
              Learn essential techniques to protect yourself in dangerous situations
            </p>
          </div>

          {/* Emergency Tips Banner */}
          <div className="p-4 rounded-2xl bg-emergency/10 border border-emergency/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-emergency" />
              <h3 className="font-semibold text-emergency">Remember These Golden Rules</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {emergencyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emergency mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "bg-emergency hover:bg-emergency/90" : ""}
            >
              All Techniques
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? "bg-emergency hover:bg-emergency/90" : ""}
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.name}
                <span className="ml-2 text-xs opacity-70">({cat.count})</span>
              </Button>
            ))}
          </div>

          {/* Techniques Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechniques.map((technique) => (
              <div
                key={technique.id}
                className="rounded-2xl bg-card border border-border overflow-hidden hover:border-emergency/50 transition-colors cursor-pointer group"
                onClick={() => setSelectedTechnique(technique)}
              >
                <div className="relative aspect-video">
                  <img
                    src={technique.image || "/placeholder.svg"}
                    alt={technique.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-emergency flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSaved(technique.id)
                      }}
                      className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                    >
                      <Heart
                        className={`w-4 h-4 ${savedTechniques.includes(technique.id) ? "text-emergency fill-emergency" : "text-white"}`}
                      />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {technique.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        technique.difficulty === "Beginner"
                          ? "bg-success/20 text-success"
                          : technique.difficulty === "Intermediate"
                            ? "bg-warning/20 text-warning"
                            : "bg-emergency/20 text-emergency"
                      }`}
                    >
                      {technique.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{technique.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{technique.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-emergency text-sm font-medium">
                    Watch Tutorial
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTechniques.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No techniques found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
