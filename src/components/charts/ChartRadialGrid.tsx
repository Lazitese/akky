"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { PolarGrid, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A radial chart with a grid"

const chartData = [
  { sector: "politics", count: 275, fill: "#22177a" },
  { sector: "organization", count: 200, fill: "#3b82f6" },
  { sector: "womenYouth", count: 187, fill: "#10b981" },
  { sector: "finance", count: 173, fill: "#f59e0b" },
  { sector: "pr", count: 90, fill: "#8b5cf6" },
]

const chartConfig = {
  count: {
    label: "የሰነዶች ብዛት",
  },
  politics: {
    label: "የፖለቲካ ዘርፍ",
    color: "#22177a",
  },
  organization: {
    label: "የአደረጃጀት ዘርፍ",
    color: "#3b82f6",
  },
  womenYouth: {
    label: "የሴቶችና ወጣቶች",
    color: "#10b981",
  },
  finance: {
    label: "የፋይናንስና ንብረት",
    color: "#f59e0b",
  },
  pr: {
    label: "የህዝብ ግንኙነት",
    color: "#8b5cf6",
  },
} satisfies ChartConfig

export function ChartRadialGrid({
  data = chartData,
  title = "የዘርፎች ሰነድ አፈጻጸም",
  description = "ከጥር እስከ ሰኔ 2016 / 2017 ዓ.ም",
  config = chartConfig,
  footerTrend = "የዘርፎች ሰነድ ዝውውር በ 5.2% ጨምሯል",
  footerSubtitle = "ያለፉት 6 ወራት አጠቃላይ የዘርፎች አፈጻጸም",
}: {
  data?: any[]
  title?: string
  description?: string
  config?: ChartConfig
  footerTrend?: string
  footerSubtitle?: string
}) {
  const activeConfig = config || chartConfig

  return (
    <Card className="flex flex-col rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)]">
      <CardHeader className="items-center pb-0 border-b border-slate-100">
        <CardTitle className="font-black text-sm text-slate-900 tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 pb-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-4">
        <ChartContainer
          config={activeConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <RadialBarChart data={data} innerRadius={28} outerRadius={105} startAngle={90} endAngle={-270}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="sector" />}
            />
            <PolarGrid gridType="circle" stroke="#e2e8f0" strokeDasharray="3 3" />
            <RadialBar dataKey="count" background={{ fill: '#f1f5f9' }} cornerRadius={6} />
          </RadialBarChart>
        </ChartContainer>

        {/* Minimal Sector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pb-2 text-[10.5px]">
          {data.map((item) => {
            const cfg = activeConfig[item.sector as keyof typeof activeConfig] as { label?: string; color?: string }
            return (
              <span
                key={item.sector}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-200 bg-white text-slate-600 font-medium"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: cfg?.color || item.fill || '#94a3b8',
                  }}
                />
                <span>{cfg?.label || item.label || item.sector}</span>
              </span>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-1.5 text-xs border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 leading-none font-bold text-slate-900">
          <span>{footerTrend}</span>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="leading-none text-slate-500 text-[11px]">
          {footerSubtitle}
        </div>
      </CardFooter>
    </Card>
  )
}
