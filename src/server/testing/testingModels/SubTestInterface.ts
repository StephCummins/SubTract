export default interface SubscriptionTest {
  userId?: number | string;
  subId?: number | string;
  name: string;
  website: string;
  signupDate: string;
  monthlyFee: number;
  freeTrial: boolean;
  dateFreeTrialEnds: null | string;
  totalSpent: number;
  autoCalc: boolean;
}
