import { api } from "@/lib/axios";

export type PlanTier = "FREE" | "STARTER" | "PRO";

export interface UserPlanInfo {
  plan: PlanTier;
  label: string;
  priceCents: number;
  maxSyncsPerMonth: number;
  syncsUsed: number;
  syncsRemaining: number;
  canSync: boolean;
  allowImport: boolean;
  yearMonth: string;
}

export async function getMyPlan() {
  const { data } = await api.get<UserPlanInfo>("/me/plan");
  return data;
}
