import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getGamificationData } from "@/lib/actions";
import { Lightbulb, Trophy, Flame, TrendingUp, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { contributions, members } from "@/lib/mock-data";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
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

export default async function ContributionsPage() {
  const gamificationData = await getGamificationData();

  const sortedMembers =
    gamificationData?.memberScores.sort((a, b) => b.score - a.score) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Wallet className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Contributions Hub</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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

        {gamificationData?.suggestedRuleTweaks && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                AI-Powered Suggestions
              </CardTitle>
              <CardDescription>
                How to improve engagement based on current data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {gamificationData.suggestedRuleTweaks}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            Contribution Leaderboard
          </CardTitle>
          <CardDescription>
            Top contributors based on gamification scores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Member</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-center">Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.map((memberScore, index) => (
                <TableRow key={memberScore.memberId}>
                  <TableCell className="font-bold text-lg">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {memberScore.memberId}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {memberScore.score} pts
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {memberScore.streak}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}