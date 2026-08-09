"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AnnouncementRow {
  id: string;
  message: string;
  link: string | null;
  linkText: string | null;
  active: boolean;
  sortOrder: number;
}

export function AnnouncementManager({
  announcements: initial,
}: {
  announcements: AnnouncementRow[];
}) {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState(initial);
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [linkText, setLinkText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          link: link.trim() || null,
          linkText: linkText.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create");
      setMessage("");
      setLink("");
      setLinkText("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update");
      }
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active: !active } : a))
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete");
      }
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-navy-deep">Add Announcement</h2>
        <Textarea
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Link URL (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />
          <Input
            label="Link text (optional)"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Learn more"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding…" : "Add Announcement"}
        </Button>
        {error && <p className="text-sm text-error">{error}</p>}
      </form>

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="space-y-1">
                <p className="font-medium">{announcement.message}</p>
                {announcement.link && (
                  <p className="text-sm text-muted-foreground">
                    {announcement.linkText ?? "Link"}: {announcement.link}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {announcement.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActive(announcement.id, announcement.active)}
                >
                  {announcement.active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(announcement.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
