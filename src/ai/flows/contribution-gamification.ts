'use server';

/**
 * @fileOverview A Genkit flow for generating gamification scores for members based on their contribution history.
 *
 * - `generateGamificationScores` - A function that generates gamification scores and suggests ruleset tweaks.
 * - `ContributionGamificationInput` - The input type for the `generateGamificationScores` function.
 * - `ContributionGamificationOutput` - The return type for the `generateGamificationScores` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContributionGamificationInputSchema = z.object({
  memberContributionHistory: z.array(
    z.object({
      memberId: z.string().describe('The unique identifier of the member.'),
      contributionAmount: z.number().describe('The amount contributed by the member.'),
      contributionDate: z.string().describe('The date of the contribution (ISO format).'),
    })
  ).describe('A list of member contribution records.'),
  currentScoringRules: z.string().describe('The current rules used for scoring contributions.'),
});
export type ContributionGamificationInput = z.infer<typeof ContributionGamificationInputSchema>;

const ContributionGamificationOutputSchema = z.object({
  memberScores: z.array(
    z.object({
      memberId: z.string().describe('The unique identifier of the member.'),
      score: z.number().describe('The gamification score of the member.'),
      streak: z.number().describe('The current streak of consecutive contributions.'),
    })
  ).describe('A list of member scores and streak information.'),
  suggestedRuleTweaks: z.string().describe('Suggestions for tweaking the scoring ruleset to improve engagement.'),
});
export type ContributionGamificationOutput = z.infer<typeof ContributionGamificationOutputSchema>;

export async function generateGamificationScores(
  input: ContributionGamificationInput
): Promise<ContributionGamificationOutput> {
  return contributionGamificationFlow(input);
}

const contributionGamificationPrompt = ai.definePrompt({
  name: 'contributionGamificationPrompt',
  input: {schema: ContributionGamificationInputSchema},
  output: {schema: ContributionGamificationOutputSchema},
  prompt: `You are an expert in gamification and behavioral economics, specializing in designing incentive systems for savings groups.

  Analyze the following member contribution history and current scoring rules to generate gamification scores and suggest ruleset tweaks.

  Member Contribution History:
  {{#each memberContributionHistory}}
  - Member ID: {{memberId}}, Amount: {{contributionAmount}}, Date: {{contributionDate}}
  {{/each}}

  Current Scoring Rules:
  {{currentScoringRules}}

  Based on this data, generate a gamification score for each member based on their contribution frequency, amount, and consistency. Also, calculate each member's current streak of consecutive contributions.

  Finally, suggest tweaks to the scoring ruleset to improve member engagement and encourage more frequent and higher contributions. Consider factors such as fairness, motivation, and potential unintended consequences.

  Ensure the output is a valid JSON matching the schema, including member scores with streak information and suggested rule tweaks to improve engagement.

  Output the data in the following JSON format:
  { 
    "memberScores": [
      { "memberId": "member1", "score": 120, "streak": 4 },
      { "memberId": "member2", "score": 95, "streak": 2 }
    ],
    "suggestedRuleTweaks": "Increase bonus for consistent weekly contributions; introduce a leaderboard to foster competition."
  }
  `,
});

const contributionGamificationFlow = ai.defineFlow(
  {
    name: 'contributionGamificationFlow',
    inputSchema: ContributionGamificationInputSchema,
    outputSchema: ContributionGamificationOutputSchema,
  },
  async input => {
    const {output} = await contributionGamificationPrompt(input);
    return output!;
  }
);
