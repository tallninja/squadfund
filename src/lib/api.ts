
import axios from 'axios';
import { chamas, members, contributions, loans, currentUser, type Chama, type Member, type Contribution, type Loan, type User } from './mock-data';

// Mock API latency
const mockLatency = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const apiClient = axios.create({
  baseURL: '/api', // This will be the base for your actual API
});

// --- API Functions ---

// In a real app, you'd have error handling, etc.

export const getChamas = async (): Promise<Chama[]> => {
  console.log('Fetching chamas...');
  // await mockLatency(500);
  // const response = await apiClient.get('/chamas');
  // return response.data;
  return Promise.resolve(chamas);
};

export const getChamaById = async (id: string): Promise<Chama | undefined> => {
  console.log(`Fetching chama ${id}...`);
  // await mockLatency(300);
  // const response = await apiClient.get(`/chamas/${id}`);
  // return response.data;
  return Promise.resolve(chamas.find(c => c.id === id));
};

export const createChama = async (name: string): Promise<Chama> => {
    console.log(`Creating chama with name: ${name}`);
    // This is where you would make an API call to your backend
    // const response = await apiClient.post('/chamas', { name });
    // return response.data;

    // For now, we'll just add it to our mock data.
    await mockLatency(700);
    const newChama: Chama = {
      id: `chama-${chamas.length + 1}`,
      name,
      createdAt: new Date().toISOString().split("T")[0],
    };
    chamas.push(newChama);
    return Promise.resolve(newChama);
};


export const getMembers = async (chamaId?: string | null): Promise<Member[]> => {
  console.log(`Fetching members for chama: ${chamaId || 'all'}`);
  // await mockLatency(600);
  /* 
  const response = await apiClient.get('/members', { params: { chamaId } });
  return response.data;
  */
  if (chamaId) {
    return Promise.resolve(members.filter(m => m.chamaId === chamaId));
  }
  return Promise.resolve(members);
};

export const getContributions = async (chamaId?: string | null): Promise<Contribution[]> => {
    console.log(`Fetching contributions for chama: ${chamaId || 'all'}`);
    // await mockLatency(800);
    /*
    const response = await apiClient.get('/contributions', { params: { chamaId } });
    return response.data;
    */
    if (chamaId) {
        return Promise.resolve(contributions.filter(c => c.chamaId === chamaId));
    }
    return Promise.resolve(contributions);
}

export const getLoans = async (chamaId?: string | null): Promise<Loan[]> => {
    console.log(`Fetching loans for chama: ${chamaId || 'all'}`);
    // await mockLatency(400);
    /*
    const response = await apiClient.get('/loans', { params: { chamaId } });
    return response.data;
    */
    if (chamaId) {
        return Promise.resolve(loans.filter(l => l.chamaId === chamaId));
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
