"use client";

import AnnouncementList from "./AnnouncementList";

export default function AnnouncementPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Announcements</h1>
      <AnnouncementList />
    </div>
  );
}
