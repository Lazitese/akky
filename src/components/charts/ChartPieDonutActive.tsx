"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Sector } from "recharts"

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

export const description = "A donut chart with an active sector"

const chartData = [
  { category: "report", count: 275, fill: "var(--color-report)" },
  { category: "circular", count: 200, fill: "var(--color-circular)" },
  { category: "plan", count: 187, fill: "var(--color-plan)" },
  { category: "letter", count: 173, fill: "var(--color-letter)" },
  { category: "other", count: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  count: {
    label: "የሰነዶች ብዛት",
  },
  report: {
    label: "ሪፖርት",
    color: "#22177a",
  },
  circular: {
    label: "ሰርኩላር",
    color: "#3b82f6",
  },
  plan: {
    label: "ዕቅድ",
    color: "#10b981",
  },
  letter: {
    label: "ደብዳቤ",
    color: "#f59e0b",
  },
  other: {
    label: "ሌሎች",
    color: "#8b5cf6",
  },
} satisfies ChartConfig

export function ChartPieDonutActive({
  data = chartData,
  defaultActiveIndex = 0,
}: {
  data?: typeof chartData
  defaultActiveIndex?: number
}) {
  const [activeIndex, setActiveIndex] = React.useState(defaultActiveIndex)

  return (
    <Card className="flex flex-col rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)]">
      <CardHeader className="items-center pb-0 border-b border-slate-100">
        <CardTitle className="font-black text-sm text-slate-900 tracking-tight">
          የሰነድ ምድቦች ስርጭት
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 pb-3">
          ከጥር እስከ ሰኔ 2016 / 2017 ዓ.ም
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              innerRadius={55}
              strokeWidth={3}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              shape={({
                index,
                outerRadius = 0,
                ...props
              }: any) =>
                index === activeIndex ? (
                  <Sector {...props} outerRadius={outerRadius + 8} />
                ) : (
                  <Sector {...props} outerRadius={outerRadius} />
                )
              }
            />
          </PieChart>
        </ChartContainer>

        {/* Minimal Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2 text-[10.5px]">
          {data.map((item, idx) => (
            <button
              key={item.category}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all ${
                activeIndex === idx
                  ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor:
                    (chartConfig[item.category as keyof typeof chartConfig] as { color?: string })?.color || '#94a3b8',
                }}
              />
              <span>{(chartConfig[item.category as keyof typeof chartConfig] as { label?: string })?.label || item.category}</span>
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-1.5 text-xs border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 leading-none font-bold text-slate-900">
          <span>በዚህ ወር የሰነዶች ምደባ በ 5.2% አድጓል</span>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="leading-none text-slate-500 text-[11px]">
          ያለፉት 6 ወራት አጠቃላይ የሰነዶች ስርጭት
        </div>
      </CardFooter>
    </Card>
  )
}
