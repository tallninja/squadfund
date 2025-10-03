
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Loan, type Member } from "@/lib/mock-data";
import { getImageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

interface LoanApprovalDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loan: Loan;
  member: Member | undefined;
  onApprove: (loanId: string) => void;
  onReject: (loanId: string) => void;
}

export function LoanApprovalDialog({
  isOpen,
  onOpenChange,
  loan,
  member,
  onApprove,
  onReject,
}: LoanApprovalDialogProps) {
  const { toast } = useToast();

  if (!member) return null;

  const requestDate = new Date(loan.requestDate);
  const expectedPaymentDate = new Date(requestDate);
  expectedPaymentDate.setDate(requestDate.getDate() + 30); // Assuming a 30-day loan term

  const handleApprove = () => {
    onApprove(loan.id);
    toast({
      title: "Loan Approved",
      description: `The loan for ${member.name} has been approved.`,
    });
  };

  const handleReject = () => {
    onReject(loan.id);
    toast({
      title: "Loan Rejected",
      description: `The loan for ${member.name} has been rejected.`,
      variant: "destructive",
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Loan Request Details</DialogTitle>
          <DialogDescription>
            Review the details below and take an action.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={getImageUrl(member.avatarSeed, 100, 100)} data-ai-hint="person portrait" />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <p className="text-sm font-medium text-muted-foreground">Amount Requested</p>
            <p className="text-sm font-semibold text-right">Ksh {loan.amount.toLocaleString()}</p>

            <p className="text-sm font-medium text-muted-foreground">Request Date</p>
            <p className="text-sm text-right">{requestDate.toLocaleDateString()}</p>

            <p className="text-sm font-medium text-muted-foreground">Expected Payment</p>
            <p className="text-sm text-right">{expectedPaymentDate.toLocaleDateString()}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleReject}>
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button onClick={handleApprove}>
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
