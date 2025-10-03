
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
import { getContributions } from "@/lib/api";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { useSquad } from "@/context/squad-context";
import { type Contribution } from "@/lib/mock-data";


const chartConfig = {
  total: {
    label: "Total Contributions",
    color: "hsl(var(--primary))",
  },
};

export function ContributionsChart() {
  const { activeSquad } = useSquad();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChartData = async (squadId: string | null) => {
        setLoading(true);
        const filteredContributions = await getContributions(squadId);

        const monthlyTotals: { [key: string]: number } = {
            January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
        };

        filteredContributions.forEach((c: Contribution) => {
            const month = new Date(c.date).toLocaleString("default", { month: "long" });
            if (monthlyTotals[month] !== undefined) {
            monthlyTotals[month] += c.amount;
            }
        });

        // Add random data for past months for visual effect if no real data exists
        const months = ["January", "February", "March", "April", "May", "June"];
        const finalData = months.map((month) => {
            if (monthlyTotals[month] > 0) {
                return { month, total: monthlyTotals[month] };
            }
            if (month !== "June") { // Don't generate random for current/future month
                return { month: month, total: Math.floor(Math.random() * (2000 - 500 + 1) + 500) }
            }
            return { month, total: 0 };
        });
        setChartData(finalData);
        setLoading(false);
    };

    getChartData(activeSquad?.id ?? null);
  }, [activeSquad]);

  if (loading) {
    return <Card className="lg:col-span-2"><CardHeader><CardTitle>Contribution Trends</CardTitle></CardHeader><CardContent><p>Loading chart data...</p></CardContent></Card>;
  }

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
        <CardDescription>
          Monthly contribution overview for{" "}
          <span className="font-semibold text-primary">{activeSquad?.name ?? 'all squads'}</span>.
        </CardDescription>
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
                tickFormatter={(value) => `Ksh ${value / 1000}k`}
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
