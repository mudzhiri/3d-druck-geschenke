import Link from "next/link";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  const { order } = await searchParams;
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="display text-5xl font-extrabold">Got it.</h1>
      <p className="mt-4 text-muted">Order {order ?? "—"} is in the system.</p>
      <p className="mt-2 text-sm text-muted">
        If it was print-on-demand, a production job is queued in Admin.
      </p>
      <Link href={`/${locale}/shop`} className="btn-feast mt-8 inline-block px-5 py-3 text-sm">
        Keep shopping
      </Link>
    </main>
  );
}
