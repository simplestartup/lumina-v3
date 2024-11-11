"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Info, Calendar, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContentStore } from "@/lib/content-store";
import { AIRecommendation } from "@/lib/ai-features";
import { toast } from "sonner";

interface RecommendationCardProps {
  recommendation: AIRecommendation;
}

export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const { addContent } = useContentStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    try {
      addContent({
        title: recommendation.title,
        type: recommendation.mediaType,
        platform: "tmdb",
        genre: [],
        releaseDate: recommendation.releaseDate,
        image: recommendation.posterPath,
      });
      toast.success("Added to your library");
    } catch (error) {
      toast.error("Failed to add content");
    }
    setIsAdding(false);
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-[2/3] relative">
        <img
          src={recommendation.posterPath}
          alt={recommendation.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-semibold text-white line-clamp-1 mb-2">
            {recommendation.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="capitalize">
              {recommendation.mediaType}
            </Badge>
            {recommendation.rating && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {recommendation.rating}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-white/10 text-white border-white/20"
            >
              <Calendar className="h-3 w-3" />
              {new Date(recommendation.releaseDate).getFullYear()}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recommendation.overview}
          </p>
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={isAdding}
              className="w-full sm:w-auto"
            >
              {isAdding ? (
                <>
                  <span className="animate-spin mr-2">●</span>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Library
                </>
              )}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{recommendation.overview}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
