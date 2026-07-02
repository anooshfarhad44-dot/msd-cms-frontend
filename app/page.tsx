import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  MailCheck,
  Scale,
} from "lucide-react";

const features = [
  { label: "Case content", value: "Services, fees and process steps" },
  { label: "Client enquiries", value: "Review and manage submissions" },
  { label: "Site control", value: "Branding, contact and hero settings" },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8f8] text-[#062f36]">
      <section className="relative min-h-screen px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#0f6b72] via-[#f4c400] to-[#062f36]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,107,114,0.12),transparent_42%),radial-gradient(circle_at_80%_12%,rgba(244,196,0,0.18),transparent_28%),linear-gradient(180deg,transparent,rgba(6,47,54,0.08))]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-7xl flex-col">
          <header className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#062f36] shadow-[0_12px_30px_rgba(6,47,54,0.18)]">
                <span className="text-lg font-black text-white">MSD</span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0f6b72]">
                  MSD Solicitord CMS
                </p>
                <p className="text-xs font-bold text-[#62777d]">
                  Solicitor website management
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="hidden h-11 items-center gap-2 rounded-xl border border-[#0f6b72]/25 bg-white/80 px-4 text-sm font-black text-[#0f6b72] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0f6b72] hover:bg-white sm:flex"
            >
              <LockKeyhole size={16} />
              Admin sign in
            </Link>
          </header>

          <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-12">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0f6b72]/15 bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0f6b72] shadow-sm">
                <BadgeCheck size={15} />
                Private admin portal
              </div>

              <h1 className="text-4xl font-black leading-[1.04] text-[#062f36] sm:text-5xl lg:text-6xl">
                Welcome to MSD Solicitord CMS
              </h1>
              <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-[#4d676d] sm:text-lg">
                A focused control room for MSD Solicitors content, enquiries, team profiles,
                fees, reviews and website settings.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0f6b72] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(15,107,114,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#062f36]"
                >
                  Enter CMS
                  <ArrowRight size={17} />
                </Link>
                <Link
                  href="https://www.msdsolicitors.co.uk/"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#d7e5e7] bg-white px-6 text-sm font-black text-[#062f36] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0f6b72]/40"
                >
                  View live site
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {features.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-[#dbe7e9] bg-white/82 p-4 shadow-[0_10px_30px_rgba(6,47,54,0.06)]"
                  >
                    <p className="text-sm font-black text-[#062f36]">{item.label}</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-[#62777d]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="rounded-[28px] border border-white/70 bg-white/82 p-4 shadow-[0_28px_70px_rgba(6,47,54,0.16)] backdrop-blur">
                <div className="rounded-[22px] bg-[#062f36] p-5 text-white">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f4c400]">
                        Dashboard preview
                      </p>
                      <p className="mt-1 text-xl font-black">MSD Solicitord CMS</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4c400] text-[#062f36]">
                      <LayoutDashboard size={21} />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-white p-4 text-[#062f36]">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f6b72]/10 text-[#0f6b72]">
                        <MailCheck size={20} />
                      </div>
                      <p className="text-2xl font-black">24</p>
                      <p className="text-xs font-black uppercase tracking-wider text-[#62777d]">
                        New enquiries
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#f4c400] p-4 text-[#062f36]">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/55">
                        <Scale size={20} />
                      </div>
                      <p className="text-2xl font-black">9</p>
                      <p className="text-xs font-black uppercase tracking-wider">
                        Legal sections
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg bg-white/8 p-4">
                    {[
                      "Homepage hero updated",
                      "Spouse visa fee schedule ready",
                      "Trustpilot reviews synced",
                    ].map((label) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 border-b border-white/10 py-3 last:border-b-0"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#f4c400]">
                          <FileText size={15} />
                        </span>
                        <span className="text-sm font-bold text-white/82">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
