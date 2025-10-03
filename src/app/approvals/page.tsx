
'use client';

import { useState } from "react";
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
import { chamas, members, loans, type Loan, type Member } from "@/lib/mock-data";
import { Eye, CheckSquare } from "lucide-react";
import { useChama } from "@/context/chama-context";
import { LoanApprovalDialog } from "@/components/loan-approval-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ApprovalsPage() {
  const { activeChama } = useChama();
  const [selectedLoan, setSelectedLoan] = useState<{ loan: Loan; member: Member | undefined } | null>(null);

  const getFilteredLoans = (status: "Pending" | "Approved" | "Rejected") => {
    return loans.filter(
      (loan) =>
        loan.status === status &&
        (!activeChama || loan.chamaId === activeChama.id)
    );
  };

  const pendingLoans = getFilteredLoans("Pending");
  const approvedLoans = getFilteredLoans("Approved");
  const rejectedLoans = getFilteredLoans("Rejected");

  const handleApprove = (loanId: string) => {
    // This would typically be an API call
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      loan.status = 'Approved';
    }
    console.log(`Approving loan ${loanId}`);
    setSelectedLoan(null);
  };

  const handleReject = (loanId: string) => {
    // This would typically be an API call
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      loan.status = 'Rejected';
    }
    console.log(`Rejecting loan ${loanId}`);
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
        {loanList.map((loan) => {
          const member = members.find((m) => m.id === loan.memberId);
          const chama = chamas.find((c) => c.id === loan.chamaId);
          return (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">
                {member?.name}
              </TableCell>
              <TableCell>{chama?.name}</TableCell>
              <TableCell>${loan.amount.toLocaleString()}</TableCell>
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
        })}
        {loanList.length === 0 && (
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
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
}
