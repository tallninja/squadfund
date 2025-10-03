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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { chamas, members, contributions, loans } from "@/lib/mock-data";
import { getImageUrl } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function ChamaDetailPage({ params }: { params: { id: string } }) {
  const chama = chamas.find((c) => c.id === params.id);

  if (!chama) {
    notFound();
  }

  const chamaMembers = members.filter((m) => m.chamaId === chama.id);
  const chamaContributions = contributions.filter((c) => c.chamaId === chama.id);
  const chamaLoans = loans.filter((l) => l.chamaId === chama.id);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{chama.name}</CardTitle>
          <CardDescription>Created on {chama.createdAt}</CardDescription>
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
              <CardTitle>Members ({chamaMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chamaMembers.map((member) => (
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
          </Card>
        </TabsContent>
        <TabsContent value="contributions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chamaContributions.map((contribution) => {
                    const member = members.find(m => m.id === contribution.memberId);
                    return (
                      <TableRow key={contribution.id}>
                        <TableCell className="font-medium">{member?.name}</TableCell>
                        <TableCell>${contribution.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(contribution.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Loan Activity</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {chamaLoans.map((loan) => {
                    const member = members.find(m => m.id === loan.memberId);
                    return (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{member?.name}</TableCell>
                        <TableCell>${loan.amount.toLocaleString()}</TableCell>
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
