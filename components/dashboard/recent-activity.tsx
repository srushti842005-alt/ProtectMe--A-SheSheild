import { Shield, MapPin, Users, Video } from "lucide-react"

const activities = [
  {
    icon: Shield,
    title: "Safety check completed",
    description: "All systems operational",
    time: "2 min ago",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: MapPin,
    title: "Location updated",
    description: "Your location is being shared with 3 contacts",
    time: "5 min ago",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Users,
    title: "Contact added",
    description: "Mom was added as an emergency contact",
    time: "1 hour ago",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Video,
    title: "Evidence uploaded",
    description: "Test recording saved to vault",
    time: "2 hours ago",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
            <div className={`w-9 h-9 rounded-lg ${activity.bg} flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
