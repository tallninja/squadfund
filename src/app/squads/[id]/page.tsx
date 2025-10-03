
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSquadById, getMembers, getContributions, getLoans } from "@/lib/api";
import { type Squad, type Member, type Contribution, type Loan } from "@/lib/mock-data";
import { getImageUrl } from "@/lib/utils";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5;

export default function SquadDetailPage({ params }: { params: { id: string } }) {
  const [squad, setSquad] = useState<Squad | undefined>(undefined);
  const [squadMembers, setSquadMembers] = useState<Member[]>([]);
  const [squadContributions, setSquadContributions] = useState<Contribution[]>([]);
  const [squadLoans, setSquadLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const [membersPage, setMembersPage] = useState(1);
  const [contributionsPage, setContributionsPage] = useState(1);
  const [loansPage, setLoansPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const squadData = await getSquadById(params.id);
        if (!squadData) {
          notFound();
          return;
        }

        const [membersData, contributionsData, loansData] = await Promise.all([
          getMembers(params.id),
          getContributions(params.id),
          getLoans(params.id),
        ]);

        setSquad(squadData);
        setSquadMembers(membersData);
        setSquadContributions(contributionsData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setSquadLoans(loansData.sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));

      } catch (error) {
        console.error("Failed to fetch squad details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const membersTotalPages = Math.ceil(squadMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = squadMembers.slice(
    (membersPage - 1) * ITEMS_PER_PAGE,
    membersPage * ITEMS_PER_PAGE
  );

  const contributionsTotalPages = Math.ceil(squadContributions.length / ITEMS_PER_PAGE);
  const paginatedContributions = squadContributions.slice(
    (contributionsPage - 1) * ITEMS_PER_PAGE,
    contributionsPage * ITEMS_PER_PAGE
  );

  const loansTotalPages = Math.ceil(squadLoans.length / ITEMS_PER_PAGE);
  const paginatedLoans = squadLoans.slice(
    (loansPage - 1) * ITEMS_PER_PAGE,
    loansPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading skeleton
  }

  if (!squad) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{squad.name}</CardTitle>
          <CardDescription>Created on {squad.createdAt}</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="members">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Members ({squadMembers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={getImageUrl(member.avatarSeed)} data-ai-hint="person portrait" />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.joinedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            {membersTotalPages > 1 && (
                <CardFooter className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => setMembersPage(membersPage - 1)} disabled={membersPage === 1}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setMembersPage(membersPage + 1)} disabled={membersPage === membersTotalPages}>
                        Next
                    </Button>
                </CardFooter>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="contributions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contributions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContributions.map((contribution) => {
                    const member = squadMembers.find(m => m.id === contribution.memberId);
                    return (
                      <TableRow key={contribution.id}>
                        <TableCell className="font-medium">{member?.name}</TableCell>
                        <TableCell>Ksh {contribution.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(contribution.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
            {contributionsTotalPages > 1 && (
                <CardFooter className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => setContributionsPage(contributionsPage - 1)} disabled={contributionsPage === 1}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setContributionsPage(contributionsPage + 1)} disabled={contributionsPage === contributionsTotalPages}>
                        Next
                    </Button>
                </CardFooter>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Loan Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLoans.map((loan) => {
                    const member = squadMembers.find(m => m.id === loan.memberId);
                    return (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{member?.name}</TableCell>
                        <TableCell>Ksh {loan.amount.toLocaleString()}</TableCell>
                        <TableCell>{loan.requestDate}</TableCell>
                        <TableCell>
                          <Badge variant={
                            loan.status === 'Approved' ? 'default' 
                            : loan.status === 'Pending' ? 'secondary'
                            : loan.status === 'Repaid' ? 'outline'
                            : 'destructive'
                          }>{loan.status}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            {loansTotalPages > 1 && (
                <CardFooter className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => setLoansPage(loansPage - 1)} disabled={loansPage === 1}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setLoansPage(loansPage + 1)} disabled={loansPage === loansTotalPages}>
                        Next
                    </Button>
                </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
