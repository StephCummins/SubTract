export default interface DatabaseSubscription {
  subscription_id: number;
  user_id: number;
  name: string;
  website?: string;
  signup_date: string;
  monthly_fee: number;
  free_trial: boolean;
  date_free_trial_ends?: string;
  total_spent: number;
}
