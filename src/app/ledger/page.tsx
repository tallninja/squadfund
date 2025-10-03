
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSquads, getMembers, getContributions, getLoans } from "@/lib/api";
import { type Squad, type Member, type Contribution, type Loan } from "@/lib/mock-data";
import { BookText, Search } from "lucide-react";
import { useSquad } from "@/context/squad-context";
import { useEffect, useState, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

export default function LedgerPage() {
  const { activeSquad } = useSquad();
  const [allTransactions, setAllTransactions] = useState<(Contribution | Loan)[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [contributionsData, loansData, membersData, squadsData] = await Promise.all([
                getContributions(activeSquad?.id ?? null),
                getLoans(activeSquad?.id ?? null),
                getMembers(),
                getSquads(),
            ]);

            const transactions = [
                ...contributionsData.map((c) => ({ ...c, type: "Contribution" as const })),
                ...loansData.map((l) => ({ ...l, type: "Loan" as const })),
            ].sort(
                (a, b) => new Date(b.date || b.requestDate).getTime() - new Date(a.date || a.requestDate).getTime()
            );

            setAllTransactions(transactions);
            setMembers(membersData);
            setSquads(squadsData);

        } catch(error) {
            console.error("Failed to fetch ledger data:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [activeSquad]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
        const member = members.find(m => m.id === tx.memberId);
        const memberNameMatch = member?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = typeFilter === 'all' || tx.type.toLowerCase() === typeFilter;
        return memberNameMatch && typeMatch;
    });
  }, [allTransactions, members, searchTerm, typeFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, typeFilter, activeSquad]);


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
            A complete record of all financial activities for{" "}
            <span className="font-semibold text-primary">{activeSquad?.name ?? 'all squads'}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4 mb-4 px-6 pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by member..."
                className="pl-8 sm:w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contribution">Contribution</SelectItem>
                <SelectItem value="loan">Loan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Squad</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={5} className="text-center">Loading transactions...</TableCell></TableRow> :
              paginatedTransactions.map((tx: any) => {
                const member = members.find((m) => m.id === tx.memberId);
                const squad = squads.find((c) => c.id === tx.squadId);
                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.date || tx.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{member?.name}</TableCell>
                    <TableCell>{squad?.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.type === "Contribution" ? "default" : "secondary"
                        }
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      Ksh {tx.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
               {paginatedTransactions.length === 0 && !loading && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No transactions found.
                    </TableCell>
                </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
            <CardFooter className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
