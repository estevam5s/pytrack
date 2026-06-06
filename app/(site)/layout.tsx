import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={!!user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
