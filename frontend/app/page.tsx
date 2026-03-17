import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1 text-sm text-zinc-300">
          Local-first AI analyst
        </div>

        <h1 className="mt-6 text-5xl font-bold md:text-7xl">
          InsightForge
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Subí archivos CSV, Excel y PDF para obtener análisis automáticos,
          visualizaciones e insights claros.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/upload"
            className="rounded-2xl bg-white px-6 py-3 font-semibold text-zinc-950"
          >
            Empezar ahora
          </Link>

          <button className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-white">
            Ver demo
          </button>
        </div>
      </section>
    </main>
  );
}
