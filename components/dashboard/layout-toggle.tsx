import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface LayoutToggleProps {
  layout: "grid" | "list";
  onLayoutChange: (layout: "grid" | "list") => void;
}

export function LayoutToggle({ layout, onLayoutChange }: LayoutToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={layout}
      onValueChange={(value) =>
        value && onLayoutChange(value as "grid" | "list")
      }
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
