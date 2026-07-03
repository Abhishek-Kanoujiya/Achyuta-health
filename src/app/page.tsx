import Link from "next/link";
import { Stethoscope, CalendarClock, Activity, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-12 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-sm" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
                <Stethoscope className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-violet-800 tracking-tight">
                Achyuta Health
              </span>
            </Link>
          </div>
          <div className="flex flex-1 justify-end space-x-6 items-center">
            <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-105 transition-all duration-200">
              Register
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl text-left">
                <div className="mb-8 inline-flex">
                  <span className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/20 bg-indigo-50/50 backdrop-blur-sm animate-pulse">
                    Welcome to the future of healthcare
                  </span>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl mb-8 leading-[1.1]">
                  Modern Healthcare, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                    Intelligent Care.
                  </span>
                </h1>
                <p className="mt-6 text-xl leading-8 text-slate-600 font-medium">
                  A seamless booking experience for patients. AI-powered summaries for doctors. Join the platform that is revolutionizing clinic management.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link href="/register" className="group rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-2xl hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/login" className="text-sm font-bold leading-6 text-slate-900 hover:text-indigo-600 transition-colors">
                    Doctor Portal <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                {/* Decorative background glow behind image */}
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[3rem] blur-3xl opacity-30 animate-pulse"></div>
                <img 
                  src="/images/hero.png" 
                  alt="Achyuta Health Professional Doctor" 
                  className="relative rounded-3xl shadow-2xl border-4 border-white/50 w-full object-cover aspect-square md:aspect-[4/3] lg:aspect-square"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-12 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: 'Smart Booking',
                  description: 'Book your slots with confidence. Our system completely eliminates double-booking conflicts and manages doctor leaves automatically.',
                  icon: CalendarClock,
                  color: 'from-blue-500 to-cyan-400',
                  image: '/images/booking.png'
                },
                {
                  title: 'AI Symptom Analysis',
                  description: 'Share your symptoms beforehand. Our advanced AI prepares a concise clinical summary for your doctor, making your visit highly efficient.',
                  icon: Activity,
                  color: 'from-violet-500 to-purple-400',
                  image: '/images/ai.png'
                },
                {
                  title: 'Clear Summaries',
                  description: 'Receive a patient-friendly summary after your visit, explaining your medications and follow-up steps in simple terms, directly to your email.',
                  icon: Stethoscope,
                  color: 'from-emerald-500 to-teal-400',
                  image: '/images/summary.png'
                }
              ].map((feature) => (
                <div key={feature.title} className="flex flex-col bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
                  <dt className="flex items-center gap-x-4 text-xl font-bold leading-7 text-slate-900">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg text-white`}>
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  {feature.image && (
                    <img src={feature.image} alt={feature.title} className="mt-4 rounded-xl shadow-md w-full object-cover h-40 border border-slate-200" />
                  )}
                  <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-slate-600 font-medium">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
