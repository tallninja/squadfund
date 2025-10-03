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
import { ContributionsChart } from "@/components/contributions-chart";

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
        <ContributionsChart />

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
               {sortedMembers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No leaderboard data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
