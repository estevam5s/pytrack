import "server-only";

// Re-exporta a lógica de acesso para uso em layouts/guards.
export {
  hasDashboardAccess,
  userHasAccess,
  getUserSubscription,
  getStripeCustomerId,
  type SubscriptionRow,
} from "@/lib/stripe/subscriptions";
