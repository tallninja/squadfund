'use server';

import { generateGamificationScores } from '@/ai/flows/contribution-gamification';
import { contributions, members } from './mock-data';

export async function getGamificationData() {
  try {
    const memberContributionHistory = contributions.map(contribution => {
      const member = members.find(m => m.id === contribution.memberId);
      return {
        memberId: member?.name || contribution.memberId,
        contributionAmount: contribution.amount,
        contributionDate: contribution.date,
      };
    });

    const currentScoringRules = "Points are awarded based on contribution amount. A streak bonus is given for contributions made in consecutive weeks. Higher frequency and amounts get higher scores.";

    const result = await generateGamificationScores({
      memberContributionHistory,
      currentScoringRules,
    });
    
    return result;

  } catch (error) {
    console.error("Error generating gamification scores:", error);
    return null;
  }
}
