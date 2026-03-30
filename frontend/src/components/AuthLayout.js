import PageFooter from "./PageFooter";

const highlights = [
  "Search professionals by industry, skill, sub county, and ward.",
  "Keep county talent records organized and easy to update.",
  "Designed for quick use on desktops, tablets, and mobile phones.",
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/gov1.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-amber-500/50" />

        <div className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-12">
          <div className="rounded-[2rem] border border-white/15 bg-emerald-950/70 p-6 text-white shadow-2xl backdrop-blur md:p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-lg">
                <img
                  src="/uasin-gishu-logo.jpg"
                  alt="County Government of Uasin Gishu logo"
                  className="h-full w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/uasin-gishu-logo.svg";
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">
                  County ICT and Innovation
                </p>
                <h1 className="text-2xl font-semibold sm:text-3xl">Uasin Gishu Skills Databank</h1>
              </div>
            </div>

            <p className="mt-8 max-w-xl text-base leading-7 text-emerald-50/90 sm:text-lg">
              A cleaner county directory for discovering skilled professionals and managing
              records with confidence.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="mb-3 h-1.5 w-12 rounded-full bg-amber-300" />
                  <p className="text-sm leading-6 text-emerald-50/90">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full rounded-[2rem] border border-white/50 bg-white/95 p-6 shadow-2xl backdrop-blur md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Secure Access
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
