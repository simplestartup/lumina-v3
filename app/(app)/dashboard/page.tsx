import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DashboardHeader = dynamic(() => import("@/components/dashboard/header"), {
  ssr: false,
});

const DashboardHero = dynamic(() => import("@/components/dashboard/hero"), {
  ssr: false,
});

const WatchProgress = dynamic(
  () => import("@/components/dashboard/watch-progress"),
  {
    ssr: false,
  }
);

const QuickInsights = dynamic(
  () => import("@/components/dashboard/quick-insights"),
  {
    ssr: false,
  }
);

const TopRecommendations = dynamic(
  () => import("@/components/dashboard/top-recommendations"),
  {
    ssr: false,
  }
);

const RecentActivity = dynamic(
  () => import("@/components/dashboard/recent-activity"),
  {
    ssr: false,
  }
);

const WatchlistPreview = dynamic(
  () => import("@/components/dashboard/watchlist-preview"),
  {
    ssr: false,
  }
);

const TrendingContent = dynamic(
  () => import("@/components/dashboard/trending-content"),
  {
    ssr: false,
  }
);

const LoadingSkeleton = dynamic(
  () => import("@/components/ui/loading-skeleton"),
  {
    ssr: false,
  }
);

export const metadata: Metadata = {
  title: "Dashboard - Lumina",
  description:
    "Your personalized streaming dashboard - Track your progress, discover new content, and manage your watchlist",
  openGraph: {
    title: "Lumina Dashboard",
    description: "Your personalized streaming experience",
    type: "website",
  },
};

export default function DashboardPage() {
  return (
    <main className="container mx-auto py-6 space-y-8 min-h-screen">
      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardHeader />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardHero />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
        <Suspense fallback={<LoadingSkeleton />}>
          <WatchProgress />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <QuickInsights />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <WatchlistPreview />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] animate-fadeIn">
        <Suspense fallback={<LoadingSkeleton />}>
          <TopRecommendations />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <RecentActivity />
        </Suspense>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <TrendingContent />
      </Suspense>
    </main>
  );
}
