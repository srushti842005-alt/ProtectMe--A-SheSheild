"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Contact } from "@/lib/contacts-context"
import { useContacts } from "@/lib/contacts-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

interface AddContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editContact?: Contact | null
}

const relationships = ["Parent", "Spouse", "Sibling", "Friend", "Colleague", "Neighbor", "Other"]

export function AddContactDialog({ open, onOpenChange, editContact }: AddContactDialogProps) {
  const { addContact, updateContact } = useContacts()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "Friend",
    notifyOnSOS: true,
    shareLocation: true,
    isPrimary: false,
  })

  useEffect(() => {
    if (editContact) {
      setFormData({
        name: editContact.name,
        phone: editContact.phone,
        email: editContact.email || "",
        relationship: editContact.relationship,
        notifyOnSOS: editContact.notifyOnSOS,
        shareLocation: editContact.shareLocation,
        isPrimary: editContact.isPrimary,
      })
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        relationship: "Friend",
        notifyOnSOS: true,
        shareLocation: true,
        isPrimary: false,
      })
    }
  }, [editContact, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (editContact) {
      updateContact(editContact.id, formData)
    } else {
      addContact(formData)
    }

    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editContact ? "Edit Contact" : "Add Emergency Contact"}
          </DialogTitle>
          <DialogDescription>
            {editContact
              ? "Update the contact information below."
              : "Add someone who will be notified during emergencies."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Phone Number</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              type="tel"
              required
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Email (Optional)</Label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              type="email"
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Relationship</Label>
            <Select
              value={formData.relationship}
              onValueChange={(value) => setFormData({ ...formData, relationship: value })}
            >
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {relationships.map((rel) => (
                  <SelectItem key={rel} value={rel}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Notify on SOS</Label>
                <p className="text-xs text-muted-foreground">Alert this contact during emergencies</p>
              </div>
              <Switch
                checked={formData.notifyOnSOS}
                onCheckedChange={(checked) => setFormData({ ...formData, notifyOnSOS: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Share Location</Label>
                <p className="text-xs text-muted-foreground">Let them see your real-time location</p>
              </div>
              <Switch
                checked={formData.shareLocation}
                onCheckedChange={(checked) => setFormData({ ...formData, shareLocation: checked })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border text-foreground bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editContact ? (
                "Update Contact"
              ) : (
                "Add Contact"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
