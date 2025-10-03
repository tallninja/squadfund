export type User = {
  id: string;
  name: string;
  email: string;
  avatarSeed: number;
  role: "Admin" | "Treasurer" | "Member";
};

export type Squad = {
  id: string;
  name: string;
  createdAt: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  squadId: string;
  joinedAt: string;
  avatarSeed: number;
};

export type Contribution = {
  id: string;
  memberId: string;
  squadId: string;
  amount: number;
  date: string;
};

export type Loan = {
  id: string;
  memberId: string;
  squadId: string;
  amount: number;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Repaid";
  repaymentDate?: string;
};

export const currentUser: User = {
  id: "user-1",
  name: "Alex Doe",
  email: "alex.doe@example.com",
  avatarSeed: 1,
  role: "Admin",
};

export const squads: Squad[] = [
  { id: "squad-1", name: "Uhuru Savings", createdAt: "2023-01-15" },
  { id: "squad-2", name: "Maendeleo Women Group", createdAt: "2023-03-20" },
  { id: "squad-3", name: "Future Investors", createdAt: "2023-05-10" },
];

export const members: Member[] = [
  { id: "member-1", name: "Alice Wanjiru", email: "alice@example.com", squadId: "squad-1", joinedAt: "2023-01-15", avatarSeed: 1 },
  { id: "member-2", name: "Bob Otieno", email: "bob@example.com", squadId: "squad-1", joinedAt: "2023-01-20", avatarSeed: 2 },
  { id: "member-3", name: "Charlie Kamau", email: "charlie@example.com", squadId: "squad-1", joinedAt: "2023-02-01", avatarSeed: 3 },
  { id: "member-4", name: "Diana Achieng", email: "diana@example.com", squadId: "squad-2", joinedAt: "2023-03-20", avatarSeed: 4 },
  { id: "member-5", name: "Eve Njeri", email: "eve@example.com", squadId: "squad-2", joinedAt: "2023-03-25", avatarSeed: 5 },
  { id: "member-6", name: "Frank Musyoka", email: "frank@example.com", squadId: "squad-3", joinedAt: "2023-05-10", avatarSeed: 6 },
  { id: "member-7", name: "Grace Akinyi", email: "grace@example.com", squadId: "squad-3", joinedAt: "2023-05-15", avatarSeed: 7 },
  { id: "member-8", name: "Henry Mwangi", email: "henry@example.com", squadId: "squad-2", joinedAt: "2023-04-05", avatarSeed: 8 },
];

export const contributions: Contribution[] = [
  // squad-1 contributions
  { id: "c-1", memberId: "member-1", squadId: "squad-1", amount: 100, date: "2024-05-01T10:00:00Z" },
  { id: "c-2", memberId: "member-2", squadId: "squad-1", amount: 150, date: "2024-05-01T10:05:00Z" },
  { id: "c-3", memberId: "member-1", squadId: "squad-1", amount: 100, date: "2024-05-08T10:00:00Z" },
  { id: "c-4", memberId: "member-3", squadId: "squad-1", amount: 120, date: "2024-05-08T10:10:00Z" },
  { id: "c-5", memberId: "member-2", squadId: "squad-1", amount: 150, date: "2024-05-15T10:05:00Z" },
  { id: "c-6", memberId: "member-1", squadId: "squad-1", amount: 100, date: "2024-05-15T10:00:00Z" },
  { id: "c-15", memberId: "member-1", squadId: "squad-1", amount: 100, date: "2024-05-22T10:00:00Z" },

  // squad-2 contributions
  { id: "c-7", memberId: "member-4", squadId: "squad-2", amount: 200, date: "2024-05-05T14:00:00Z" },
  { id: "c-8", memberId: "member-5", squadId: "squad-2", amount: 250, date: "2024-05-05T14:05:00Z" },
  { id: "c-9", memberId: "member-4", squadId: "squad-2", amount: 200, date: "2024-05-12T14:00:00Z" },
  { id: "c-16", memberId: "member-8", squadId: "squad-2", amount: 180, date: "2024-05-12T14:10:00Z" },


  // squad-3 contributions
  { id: "c-10", memberId: "member-6", squadId: "squad-3", amount: 500, date: "2024-05-10T09:00:00Z" },
  { id: "c-11", memberId: "member-7", squadId: "squad-3", amount: 500, date: "2024-05-10T09:05:00Z" },
  { id: "c-12", memberId: "member-6", squadId: "squad-3", amount: 500, date: "2024-05-24T09:00:00Z" },
];

export const loans: Loan[] = [
  { id: "loan-1", memberId: "member-2", squadId: "squad-1", amount: 500, requestDate: "2024-05-16", status: "Pending" },
  { id: "loan-2", memberId: "member-5", squadId: "squad-2", amount: 1000, requestDate: "2024-05-13", status: "Approved" },
  { id: "loan-3", memberId: "member-7", squadId: "squad-3", amount: 2000, requestDate: "2024-05-11", status: "Repaid", repaymentDate: "2024-06-11" },
  { id: "loan-4", memberId: "member-3", squadId: "squad-1", amount: 300, requestDate: "2024-05-18", status: "Rejected" },
  { id: "loan-5", memberId: "member-8", squadId: "squad-2", amount: 750, requestDate: "2024-05-20", status: "Pending" },
];
