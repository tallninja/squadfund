
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

export default function ApprovalsPage() {
  const { activeChama } = useChama();
  const [selectedLoan, setSelectedLoan] = useState<{ loan: Loan; member: Member | undefined } | null>(null);

  const pendingLoans = loans.filter(
    (loan) =>
      loan.status === "Pending" &&
      (!activeChama || loan.chamaId === activeChama.id)
  );

  const handleApprove = (loanId: string) => {
    // Logic to approve the loan
    console.log(`Approving loan ${loanId}`);
    setSelectedLoan(null);
  };

  const handleReject = (loanId: string) => {
    // Logic to reject the loan
    console.log(`Rejecting loan ${loanId}`);
    setSelectedLoan(null);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <CheckSquare className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline">Loan Approvals</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              Review and approve or reject loan requests for{" "}
              <span className="font-semibold text-primary">{activeChama?.name ?? 'all chamas'}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                {pendingLoans.map((loan) => {
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
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedLoan({ loan, member })}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {pendingLoans.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No pending loan requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
