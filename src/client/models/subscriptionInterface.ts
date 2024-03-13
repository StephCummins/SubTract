export default interface Subscription {
  subId: number | null;
  userId: number | null;
  name: string;
  website?: string;
  signupDate: string;
  monthlyFee: number | null;
  freeTrial: boolean;
  dateFreeTrialEnds?: string;
  totalSpent: number | null;
  autoCalc?: boolean | null;
}
