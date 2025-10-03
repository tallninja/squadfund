"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { contributions } from "@/lib/mock-data";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";

const getChartData = () => [
  { month: "January", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "February", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "March", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "April", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", total: contributions.reduce((acc, c) => acc + c.amount, 0) },
  { month: "June", total: 0 },
];

const chartConfig = {
  total: {
    label: "Total Contributions",
    color: "hsl(var(--primary))",
  },
};

export function ContributionsChart() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setChartData(getChartData());
  }, []);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Contribution Trends
        </CardTitle>
        <CardDescription>Monthly contribution overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
