"use client";

import { useState } from "react";
import {
  Film,
  Tv,
  Video,
  Mic,
  Plus,
  Search,
  Loader2,
  MonitorPlay,
  PlayCircle,
  Tv2,
  Youtube,
  Clapperboard,
  Music,
  Theater,
  Star,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useContentStore } from "@/lib/content-store";
import { searchContent } from "@/lib/tmdb";
import { searchYouTube } from "@/lib/youtube";
import { toast } from "sonner";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface SearchResult {
  id: string;
  title: string;
  // ... add other properties based on what searchYouTube returns
}

function decodeHTMLEntities(text: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

const contentTypes = [
  {
    id: "movie",
    label: "Movie",
    icon: Film,
    description: "Feature films and movies",
  },
  {
    id: "tv",
    label: "TV Series",
    icon: Tv,
    description: "TV shows and web series",
  },
  {
    id: "documentary",
    label: "Documentary",
    icon: Video,
    description: "Documentaries and educational content",
  },
  {
    id: "podcast",
    label: "Podcast",
    icon: Mic,
    description: "Audio shows and podcasts",
  },
];

const platformConfig = {
  netflix: { name: "Netflix", icon: MonitorPlay },
  prime: { name: "Prime Video", icon: PlayCircle },
  apple: { name: "Apple TV+", icon: Tv2 },
  hbo: { name: "HBO Max", icon: Tv2 },
  disney: { name: "Disney+", icon: Clapperboard },
  youtube: { name: "YouTube", icon: Youtube },
  spotify: { name: "Spotify", icon: Music },
  theaters: { name: "In Theaters", icon: Theater },
};

const platformsByType = {
  movie: ["netflix", "prime", "apple", "hbo", "disney", "theaters"],
  tv: ["netflix", "prime", "apple", "hbo", "disney"],
  documentary: ["netflix", "prime", "apple", "hbo", "disney", "youtube"],
  podcast: ["youtube", "spotify"],
};

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "search" | "platform";

export default function AddContentDialog({
  open,
  onOpenChange,
}: AddContentDialogProps) {
  const [step, setStep] = useState<Step>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [contentType, setContentType] = useState<
    "movie" | "tv" | "documentary" | "podcast"
  >("movie");
  const { addContent } = useContentStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref: loadMoreRef, inView } = useInView();

  const handleSearch = async (resetResults = true) => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setSearching(true);
    try {
      let results: SearchResult[];
      if (contentType === "podcast") {
        results = await searchYouTube(searchQuery);
      } else {
        results = await searchContent(searchQuery, contentType);
      }

      if (resetResults) {
        setSearchResults(results);
        setPage(1);
      } else {
        setSearchResults((prev) => [...prev, ...results]);
      }

      setHasMore(results.length > 0);
    } catch (error) {
      console.error("Search error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to search content"
      );
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !searching && searchQuery) {
      setPage((prev) => prev + 1);
      handleSearch(false);
    }
  }, [inView, hasMore, searching, searchQuery]);

  const handleContentSelect = (content: any) => {
    setSelectedContent(content);
    if (content.youtubeId) {
      setSelectedPlatform("youtube");
      addContent({
        ...content,
        platform: "youtube",
      });
      toast.success("Added to your library!");
      handleClose();
    } else {
      setStep("platform");
    }
  };

  const handleAdd = () => {
    if (!selectedContent || !selectedPlatform) {
      toast.error("Please select content and platform");
      return;
    }

    addContent({
      ...selectedContent,
      platform: selectedPlatform,
    });

    toast.success("Added to your library!");
    handleClose();
  };

  const handleClose = () => {
    setStep("search");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedContent(null);
    setSelectedPlatform("");
    setPage(1);
    setHasMore(true);
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep("search");
    setSelectedPlatform("");
  };

  const handleContentTypeChange = (type: typeof contentType) => {
    setContentType(type);
    setSearchResults([]);
    setSelectedContent(null);
    setSelectedPlatform("");
    setSearchQuery("");
    setPage(1);
    setHasMore(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "platform" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -ml-2"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {step === "search" ? "Add New Content" : "Select Platform"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {step === "search" ? (
            <>
              {/* Content Type Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg border transition-colors text-left",
                        contentType === type.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      )}
                      onClick={() =>
                        handleContentTypeChange(type.id as typeof contentType)
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Section */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search for ${contentType}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={() => handleSearch()} disabled={searching}>
                  {searching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>

              {/* Search Results */}
              <div
                className={cn(
                  contentType === "podcast"
                    ? "flex flex-col gap-4"
                    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                )}
              >
                {searchResults.map((result) => (
                  <Card
                    key={result.id}
                    className={cn(
                      "cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                      selectedContent?.id === result.id &&
                        "ring-2 ring-primary",
                      result.youtubeId && "flex gap-4"
                    )}
                    onClick={() => handleContentSelect(result)}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-lg",
                        result.youtubeId ? "w-64 shrink-0" : "pt-[150%]"
                      )}
                    >
                      <div className={result.youtubeId ? "pt-[56.25%]" : ""}>
                        <Image
                          src={result.image}
                          alt={result.title}
                          fill
                          className={cn(
                            "absolute inset-0",
                            result.youtubeId ? "object-cover" : "object-cover"
                          )}
                          sizes={
                            result.youtubeId
                              ? "256px"
                              : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          }
                        />
                      </div>
                    </div>
                    <div
                      className={cn(
                        "p-3 space-y-2",
                        result.youtubeId && "flex-1"
                      )}
                    >
                      <h3
                        className={cn(
                          "font-semibold",
                          result.youtubeId ? "text-base" : "text-sm",
                          result.youtubeId ? "line-clamp-2" : "line-clamp-2"
                        )}
                      >
                        {decodeHTMLEntities(result.title)}
                      </h3>
                      {result.host && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {result.host}
                        </p>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                  </Card>
                ))}

                {searchResults.length > 0 && (
                  <div
                    ref={loadMoreRef}
                    className="col-span-full flex justify-center p-4"
                  >
                    {searching && (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Selected Content Preview */}
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="relative w-24 aspect-[2/3] rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={selectedContent.image}
                    alt={selectedContent.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {selectedContent.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedContent.overview?.slice(0, 150)}...
                  </p>
                  <Badge variant="secondary">{selectedContent.type}</Badge>
                </div>
              </div>

              {/* Platform Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {platformsByType[contentType].map((platform) => {
                  const config =
                    platformConfig[platform as keyof typeof platformConfig];
                  const PlatformIcon = config.icon;
                  return (
                    <Card
                      key={platform}
                      className={cn(
                        "cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                        selectedPlatform === platform && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedPlatform(platform)}
                    >
                      <div className="p-4 flex flex-col items-center gap-3 text-center">
                        <PlatformIcon className="h-8 w-8" />
                        <span className="font-medium">{config.name}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === "platform" && (
            <Button onClick={handleAdd} disabled={!selectedPlatform}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Library
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
