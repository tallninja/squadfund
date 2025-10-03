
import axios from 'axios';
import { squads, members, contributions, loans, currentUser, type Squad, type Member, type Contribution, type Loan, type User } from './mock-data';

// Mock API latency
const mockLatency = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const apiClient = axios.create({
  baseURL: '/api', // This will be the base for your actual API
});

// --- API Functions ---

// In a real app, you'd have error handling, etc.

export const getSquads = async (): Promise<Squad[]> => {
  console.log('Fetching squads...');
  // await mockLatency(500);
  // const response = await apiClient.get('/squads');
  // return response.data;
  return Promise.resolve(squads);
};

export const getSquadById = async (id: string): Promise<Squad | undefined> => {
  console.log(`Fetching squad ${id}...`);
  // await mockLatency(300);
  // const response = await apiClient.get(`/squads/${id}`);
  // return response.data;
  return Promise.resolve(squads.find(c => c.id === id));
};

export const createSquad = async (name: string): Promise<Squad> => {
    console.log(`Creating squad with name: ${name}`);
    // This is where you would make an API call to your backend
    // const response = await apiClient.post('/squads', { name });
    // return response.data;

    // For now, we'll just add it to our mock data.
    await mockLatency(700);
    const newSquad: Squad = {
      id: `squad-${squads.length + 1}`,
      name,
      createdAt: new Date().toISOString().split("T")[0],
    };
    squads.push(newSquad);
    return Promise.resolve(newSquad);
};


export const getMembers = async (squadId?: string | null): Promise<Member[]> => {
  console.log(`Fetching members for squad: ${squadId || 'all'}`);
  // await mockLatency(600);
  /* 
  const response = await apiClient.get('/members', { params: { squadId } });
  return response.data;
  */
  if (squadId) {
    return Promise.resolve(members.filter(m => m.squadId === squadId));
  }
  return Promise.resolve(members);
};

export const getContributions = async (squadId?: string | null): Promise<Contribution[]> => {
    console.log(`Fetching contributions for squad: ${squadId || 'all'}`);
    // await mockLatency(800);
    /*
    const response = await apiClient.get('/contributions', { params: { squadId } });
    return response.data;
    */
    if (squadId) {
        return Promise.resolve(contributions.filter(c => c.squadId === squadId));
    }
    return Promise.resolve(contributions);
}

export const getLoans = async (squadId?: string | null): Promise<Loan[]> => {
    console.log(`Fetching loans for squad: ${squadId || 'all'}`);
    // await mockLatency(400);
    /*
    const response = await apiClient.get('/loans', { params: { squadId } });
    return response.data;
    */
    if (squadId) {
        return Promise.resolve(loans.filter(l => l.squadId === squadId));
    }
    return Promise.resolve(loans);
}

export const updateLoanStatus = async (loanId: string, status: 'Approved' | 'Rejected'): Promise<Loan | undefined> => {
    console.log(`Updating loan ${loanId} to ${status}`);
    // const response = await apiClient.patch(`/loans/${loanId}`, { status });
    // return response.data;
    await mockLatency(500);
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
        loan.status = status;
        return Promise.resolve(loan);
    }
    return Promise.reject(new Error('Loan not found'));
}


export const getCurrentUser = async (): Promise<User> => {
    console.log('Fetching current user...');
    // await mockLatency(100);
    // const response = await apiClient.get('/users/me');
    // return response.data;
    return Promise.resolve(currentUser);
}
