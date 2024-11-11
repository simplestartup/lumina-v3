import { useState } from "react";
import ContentCard from "./content-card";
import { LayoutToggle } from "./layout-toggle";
import { cn } from "@/lib/utils";
import type { ContentCardProps } from "./content-card";

export function ContentList({
  contents,
}: {
  contents: ContentCardProps["content"][];
}) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  return (
    <div>
      <div className="flex justify-end mb-4">
        <LayoutToggle layout={layout} onLayoutChange={setLayout} />
      </div>

      <div
        className={cn(
          "gap-4",
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col"
        )}
      >
        {contents.map((content) => (
          <ContentCard key={content.id} content={content} layout={layout} />
        ))}
      </div>
    </div>
  );
}
