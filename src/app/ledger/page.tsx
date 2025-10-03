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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chamas, members, contributions, loans } from "@/lib/mock-data";
import { BookText, Search } from "lucide-react";

export default function LedgerPage() {
  const allTransactions = [
    ...contributions.map((c) => ({ ...c, type: "Contribution" })),
    ...loans.map((l) => ({ ...l, type: "Loan" })),
  ].sort(
    (a, b) => new Date(b.date || b.requestDate).getTime() - new Date(a.date || a.requestDate).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center gap-4">
        <BookText className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">General Ledger</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            A complete record of all financial activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by member..."
                className="pl-8 sm:w-full"
              />
            </div>
            <Select>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Filter by Chama" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chamas</SelectItem>
                {chamas.map((chama) => (
                  <SelectItem key={chama.id} value={chama.id}>
                    {chama.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contribution">Contribution</SelectItem>
                <SelectItem value="loan">Loan</SelectItem>
                <SelectItem value="repayment">Repayment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Chama</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((tx) => {
                const member = members.find((m) => m.id === tx.memberId);
                const chama = chamas.find((c) => c.id === tx.chamaId);
                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.date || tx.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{member?.name}</TableCell>
                    <TableCell>{chama?.name}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === 'Contribution' ? 'default' : 'secondary'}>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${tx.amount.toLocaleString()}
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
