"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "A multiple bar chart"

const chartData = [
  { month: "ጥር", desktop: 186, mobile: 80 },
  { month: "የካቲት", desktop: 305, mobile: 200 },
  { month: "መጋቢት", desktop: 237, mobile: 120 },
  { month: "ሚያዝያ", desktop: 173, mobile: 190 },
  { month: "ግንቦት", desktop: 209, mobile: 130 },
  { month: "ሰኔ", desktop: 264, mobile: 185 },
]

const chartConfig = {
  desktop: {
    label: "የክፍለ ከተማ ሰነዶች",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "የወረዳዎች ሰነዶች",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartBarMultiple({
  data = chartData,
  title = "የወርሃዊ ሰነዶች ንጽጽር",
  description = "ከጥር እስከ ሰኔ 2016 / 2017 ዓ.ም",
  config = chartConfig,
  footerTrend = "በዚህ ወር የሰነዶች ፍሰት በ 5.2% አድጓል",
  footerSubtitle = "ያለፉት 6 ወራት አጠቃላይ የሰነድ ዝውውር ማጠቃለያ",
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
    <Card className="rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      <CardHeader className="border-b border-slate-100 pb-3">
        <CardTitle className="font-black text-sm text-slate-900 tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={activeConfig} className="aspect-auto h-[220px] w-full">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(34, 23, 122, 0.04)' }}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-xs border-t border-slate-100 pt-3">
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
