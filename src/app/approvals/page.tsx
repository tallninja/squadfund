
'use client';

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { type Loan, type Member, type Chama } from "@/lib/mock-data";
import { getLoans, getMembers, getChamas, updateLoanStatus } from "@/lib/api";
import { Eye, CheckSquare } from "lucide-react";
import { useChama } from "@/context/chama-context";
import { LoanApprovalDialog } from "@/components/loan-approval-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ApprovalsPage() {
  const { activeChama } = useChama();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [chamas, setChamas] = useState<Chama[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<{ loan: Loan; member: Member | undefined } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loansData, membersData, chamasData] = await Promise.all([
        getLoans(activeChama?.id ?? null),
        getMembers(), // Fetch all members to map names
        getChamas(), // Fetch all chamas to map names
      ]);
      setLoans(loansData);
      setMembers(membersData);
      setChamas(chamasData);
    } catch (error) {
      console.error("Failed to fetch approvals data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeChama]);

  const getFilteredLoans = (status: "Pending" | "Approved" | "Rejected") => {
    return loans.filter((loan) => loan.status === status);
  };

  const pendingLoans = getFilteredLoans("Pending");
  const approvedLoans = getFilteredLoans("Approved");
  const rejectedLoans = getFilteredLoans("Rejected");

  const handleStatusUpdate = async (loanId: string, status: 'Approved' | 'Rejected') => {
    try {
        await updateLoanStatus(loanId, status);
        // Refetch data to show the change
        fetchData();
    } catch (error) {
        console.error(`Failed to ${status.toLowerCase()} loan:`, error);
        // Optionally show a toast notification for the error
    }
    setSelectedLoan(null);
  };


  const renderLoanTable = (loanList: Loan[], status: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Chama</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
            <TableRow>
                <TableCell colSpan={5} className="text-center">Loading loans...</TableCell>
            </TableRow>
        ) : loanList.length > 0 ? (
          loanList.map((loan) => {
            const member = members.find((m) => m.id === loan.memberId);
            const chama = chamas.find((c) => c.id === loan.chamaId);
            return (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">
                  {member?.name}
                </TableCell>
                <TableCell>{chama?.name}</TableCell>
                <TableCell>Ksh {loan.amount.toLocaleString()}</TableCell>
                <TableCell>{loan.requestDate}</TableCell>
                <TableCell className="text-right">
                  {loan.status === "Pending" ? (
                      <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedLoan({ loan, member })}
                      >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                      </Button>
                  ) : (
                      <Badge variant={loan.status === 'Approved' ? 'default' : 'destructive'}>
                          {loan.status}
                      </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground"
            >
              No {status.toLowerCase()} loan requests.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <CheckSquare className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline">Loan Approvals</h1>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  Review and approve or reject loan requests for{" "}
                  <span className="font-semibold text-primary">{activeChama?.name ?? 'all chamas'}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderLoanTable(pendingLoans, "Pending")}
              </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Loans</CardTitle>
                <CardDescription>
                  A list of all approved loans for{" "}
                  <span className="font-semibold text-primary">{activeChama?.name ?? 'all chamas'}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderLoanTable(approvedLoans, "Approved")}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rejected">
             <Card>
              <CardHeader>
                <CardTitle>Rejected Loans</CardTitle>
                <CardDescription>
                  A list of all rejected loans for{" "}
                  <span className="font-semibold text-primary">{activeChama?.name ?? 'all chamas'}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderLoanTable(rejectedLoans, "Rejected")}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>

      {selectedLoan && (
        <LoanApprovalDialog
          isOpen={!!selectedLoan}
          onOpenChange={() => setSelectedLoan(null)}
          loan={selectedLoan.loan}
          member={selectedLoan.member}
          onApprove={() => handleStatusUpdate(selectedLoan.loan.id, 'Approved')}
          onReject={() => handleStatusUpdate(selectedLoan.loan.id, 'Rejected')}
        />
      )}
    </>
  );
}
