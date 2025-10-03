
'use client';

import Link from "next/link";
import {
  Card,
  CardContent,
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
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, Wallet, Landmark } from "lucide-react";
import { chamas, members, contributions } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { CreateChamaDialog } from "@/components/create-chama-dialog";


export default function DashboardPage() {
  const totalContributions = contributions.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contributions
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Ksh {totalContributions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{members.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {chamas.length} chamas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chamas</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chamas.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 active this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chama Overview</CardTitle>
          <CreateChamaDialog />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chama Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Total Contributions
                </TableHead>
                <TableHead className="hidden md:table-cell">Members</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chamas.map((chama) => {
                const chamaContributions = contributions
                  .filter((c) => c.chamaId === chama.id)
                  .reduce((acc, curr) => acc + curr.amount, 0);
                const chamaMembers = members.filter(
                  (m) => m.chamaId === chama.id
                );

                return (
                  <TableRow key={chama.id}>
                    <TableCell>
                      <div className="font-medium">{chama.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Created on {chama.createdAt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Active</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      Ksh {chamaContributions.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex -space-x-2 overflow-hidden">
                        {chamaMembers.slice(0, 4).map((member, index) => (
                           <Avatar key={member.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-background">
                              <AvatarImage src={getImageUrl(member.avatarSeed)} alt={member.name} data-ai-hint="person portrait"/>
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                        ))}
                         {chamaMembers.length > 4 && (
                           <Avatar className="inline-block h-6 w-6 rounded-full ring-2 ring-background">
                            <AvatarFallback>+{chamaMembers.length - 4}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href={`/chamas/${chama.id}`}>
                          View
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
