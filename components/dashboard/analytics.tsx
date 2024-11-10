"use client";

import { useContentStore } from "@/stores/content-store";
import { useEffect, useState } from "react";

// Update analytics to include podcast metrics
export default function Analytics() {
  const { items } = useContentStore();
  const [watchData, setWatchData] = useState([
    { name: "Watched/Listened", value: 0 },
    { name: "Pending", value: 0 },
  ]);

  useEffect(() => {
    if (!items.length) return;

    // Calculate completion progress
    const completed = items.filter((item) => item.watched).length;
    const total = items.length;
    setWatchData([
      { name: "Completed", value: completed },
      { name: "Pending", value: total - completed },
    ]);
  }, [items]);

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold mb-4">Content Progress</h2>
      <div className="flex justify-between">
        <div>
          <p>Completed: {watchData[0].value}</p>
          <p>Pending: {watchData[1].value}</p>
        </div>
        {/* Add your preferred chart/visualization library here */}
      </div>
    </div>
  );
}
