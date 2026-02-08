"use client"

import { useState } from "react"
import { SidebarNav, type SectionId } from "@/components/dashboard/sidebar-nav"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { HealthInput } from "@/components/dashboard/health-input"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { ModelPerformance } from "@/components/dashboard/model-performance"
import { DatasetOverview } from "@/components/dashboard/dataset-overview"
import { Recommendations } from "@/components/dashboard/recommendations"

const sectionTitles: Record<SectionId, { title: string; description: string }> = {
  dashboard: {
    title: "Dashboard",
    description: "Overview of the Health & Lifestyle Prediction System",
  },
  dataset: {
    title: "Dataset Overview",
    description: "Explore the synthetic health dataset with 7,500 records",
  },
  prediction: {
    title: "Health Prediction",
    description: "Input health attributes and get ML-powered risk predictions",
  },
  models: {
    title: "Model Performance",
    description: "Compare accuracy and metrics across trained classifiers",
  },
  analytics: {
    title: "Analytics",
    description: "Visual exploration of health data patterns and correlations",
  },
  recommendations: {
    title: "Recommendations",
    description: "Evidence-based health and lifestyle recommendations",
  },
}

export default function Page() {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard")

  const { title, description } = sectionTitles[activeSection]

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          {/* Page header */}
          <header className="mb-8 ml-12 lg:ml-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </header>

          {/* Section content */}
          <div className="flex flex-col gap-8">
            {activeSection === "dashboard" && (
              <>
                <StatsCards />
                <AnalyticsCharts />
              </>
            )}

            {activeSection === "dataset" && <DatasetOverview />}

            {activeSection === "prediction" && <HealthInput />}

            {activeSection === "models" && <ModelPerformance />}

            {activeSection === "analytics" && <AnalyticsCharts />}

            {activeSection === "recommendations" && <Recommendations />}
          </div>

          {/* Footer disclaimer */}
          <footer className="mt-12 border-t border-border pt-6">
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              This dataset is fully synthetic and anonymized. No real human data was used.
              For educational and research purposes only.
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
