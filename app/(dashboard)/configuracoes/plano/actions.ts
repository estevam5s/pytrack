"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requireStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RefundResult {
  error?: string;
  success?: string;
}

const REFUND_WINDOW_DAYS = 7;

export async function requestRefund(
  _prev: RefundResult,
  _formData: FormData,
): Promise<RefundResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Não autenticado." };

  try {
    const stripe = requireStripe();
    const admin = createAdminClient();

    const { data: sub } = await admin
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!sub) return { error: "Nenhuma compra encontrada para reembolsar." };

    const meta = (sub.metadata ?? {}) as Record<string, unknown>;
    // cortesia/admin (comp sem pagamento) não tem o que reembolsar
    if (meta.comp && !meta.lifetime) {
      return { error: "Este acesso é uma cortesia e não possui pagamento a reembolsar." };
    }

    // descobre o pagamento (payment_intent)
    let paymentIntentId: string | undefined;
    if (meta.lifetime && typeof meta.payment_intent === "string") {
      paymentIntentId = meta.payment_intent;
    } else if (sub.stripe_subscription_id) {
      const s = (await stripe.subscriptions.retrieve(
        sub.stripe_subscription_id,
      )) as { latest_invoice?: string | null };
      if (s.latest_invoice) {
        const inv = (await stripe.invoices.retrieve(s.latest_invoice)) as {
          payment_intent?: string | null;
        };
        if (inv.payment_intent) paymentIntentId = inv.payment_intent;
      }
    }

    if (!paymentIntentId) {
      return { error: "Não encontramos um pagamento recente para reembolsar." };
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    const ageDays = (Date.now() / 1000 - pi.created) / 86400;
    if (ageDays > REFUND_WINDOW_DAYS) {
      return {
        error: `O prazo de ${REFUND_WINDOW_DAYS} dias para reembolso já passou (compra há ${Math.floor(ageDays)} dias).`,
      };
    }

    // processa o reembolso
    await stripe.refunds.create({ payment_intent: paymentIntentId });

    // cancela a assinatura recorrente (se houver)
    if (sub.stripe_subscription_id) {
      try {
        await stripe.subscriptions.cancel(sub.stripe_subscription_id);
      } catch {
        /* já cancelada */
      }
    }

    // revoga o acesso premium
    await admin.from("subscriptions").delete().eq("user_id", user.id);

    revalidatePath("/configuracoes/plano");
    revalidatePath("/", "layout");
    return {
      success:
        "Reembolso solicitado com sucesso! O valor retorna em alguns dias úteis e seu acesso premium foi encerrado.",
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Não foi possível processar o reembolso.",
    };
  }
}
