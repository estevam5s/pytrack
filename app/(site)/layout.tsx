import { Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { LanguageProvider } from "@/components/site/language-provider";
import { PWAInstall } from "@/components/pwa-install";
import { CookieConsent } from "@/components/cookie-consent";
import { NewsletterPopup } from "@/components/site/newsletter-popup";
import { VisitTracker } from "@/components/site/visit-tracker";
import { AnnouncementBanner } from "@/components/site/announcement-banner";
import { getSiteSettings } from "@/lib/data/site-settings";
import { isAdmin } from "@/lib/admin";
import { OfferBanner } from "@/components/site/offer-banner";
import { getActiveOffer } from "@/lib/offers-actions";
import { AmbientBackground } from "@/components/site/ambient-background";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { FeedbackButton } from "@/components/site/feedback-button";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const settings = await getSiteSettings();
  const activeOffer = await getActiveOffer();

  // Modo manutenção: bloqueia visitantes (admins continuam navegando).
  if (settings.maintenance && !isAdmin(user?.email)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary-light">
          <Wrench className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Estamos em manutenção</h1>
        <p className="mt-2 max-w-md text-text-secondary">
          A PyTrack está passando por uma melhoria rápida. Volte em instantes — já já estamos no ar novamente. 🐍
        </p>
        <p className="mt-4 text-xs text-text-secondary">Dúvidas? {settings.primary_contact}</p>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col">
        <AmbientBackground />
        <ScrollProgress />
        {activeOffer && <OfferBanner offer={activeOffer as never} />}
        <AnnouncementBanner />
        <Navbar isLoggedIn={!!user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <FeedbackButton />
        <PWAInstall variant="banner" />
        <CookieConsent />
        <NewsletterPopup />
        <VisitTracker />
      </div>
    </LanguageProvider>
  );
}
