import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Sign In — CodeCraft",
  description: "Sign in to your CodeCraft workspace.",
};


function HeroLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 760 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Primary arc */}
      <path d="M -60 420 C 80 350, 220 180, 400 260 C 540 320, 660 360, 840 240"
            stroke="rgba(96,165,250,0.22)" strokeWidth="1.3" fill="none" />
      <path d="M -60 455 C 100 390, 240 230, 420 295 C 570 350, 690 385, 840 275"
            stroke="rgba(96,165,250,0.13)" strokeWidth="0.9" fill="none" />
      <path d="M -60 490 C 120 440, 280 310, 470 345 C 620 375, 730 400, 840 320"
            stroke="rgba(96,165,250,0.07)" strokeWidth="0.7" fill="none" />
      <path d="M -60 240 C 100 190, 280 120, 480 200 C 640 265, 740 290, 840 180"
            stroke="rgba(96,165,250,0.12)" strokeWidth="0.8" fill="none" />
      <path d="M -60 560 C 140 510, 310 470, 520 500 C 680 525, 770 540, 840 460"
            stroke="rgba(59,130,246,0.10)" strokeWidth="0.7" fill="none" />
      {/* Node 1 */}
      <circle cx="240" cy="385" r="4" fill="rgba(96,165,250,0.55)" />
      <circle cx="240" cy="385" r="8" fill="none" stroke="rgba(96,165,250,0.2)" strokeWidth="1" />
      <circle cx="240" cy="385" r="13" fill="none" stroke="rgba(96,165,250,0.07)" strokeWidth="1" />
      {/* Node 2 */}
      <circle cx="520" cy="295" r="4" fill="rgba(96,165,250,0.4)" />
      <circle cx="520" cy="295" r="8" fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="1" />
      {/* Tick marks */}
      <line x1="240" y1="365" x2="240" y2="403" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
      <line x1="520" y1="276" x2="520" y2="313" stroke="rgba(96,165,250,0.22)" strokeWidth="1" />
      {/* Micro dots */}
      <circle cx="360" cy="355" r="1.5" fill="rgba(96,165,250,0.3)" />
      <circle cx="630" cy="375" r="1.5" fill="rgba(96,165,250,0.2)" />
      <circle cx="155" cy="460" r="1.5" fill="rgba(96,165,250,0.25)" />
    </svg>
  );
}

// function Logo() {
//   return (
//     <Link href="/" aria-label="CodeCraft home"
//       className="inline-flex items-center gap-[9px] mb-12 group"
//     >
//       <span className="font-bold font-mono text-[1.25rem] text-blue-400 leading-none tracking-tight">
//         &lt;/&gt;
//       </span>
//       <span className="font-bold text-[1.2rem] text-[#e8eeff] tracking-tight leading-none">
//         CodeCraft
//       </span>
//     </Link>
//   );
// }


export default function LoginPage() {
  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: "1fr 460px" }}>
        <Navbar/>
      
      <section
        className="relative hidden lg:flex flex-col justify-center px-20 py-16 overflow-hidden bg-[#0c1221]"
        aria-label="CodeCraft platform"
      >
        {/* Radial glow */}
        <div className="absolute -left-[15%] top-[25%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 68%)" }}
          aria-hidden="true"
        />

        <HeroLines />

        <div className="relative z-10 max-w-[580px]">
      

          <h1 className="text-[clamp(2.4rem,3.8vw,3.6rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-white mb-6">
            The cloud IDE<br />for modern<br />developers
          </h1>

          <p className="font-mono text-[0.875rem] text-[#8fa3c0] leading-[1.85] mb-14">
            Write, run, and ship your code.<br />
            Build full-stack apps without local setup.
          </p>

       
        </div>
      </section>

      <section
        className="flex items-center justify-center px-8 py-8 bg-[rgba(10,16,30,0.55)] border-l border-white/[0.04] relative"
        aria-label="Sign in to CodeCraft"
        style={{ background: "rgba(10,16,30,0.55)" }}
      >
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.07) 0%, transparent 65%)" }}
          aria-hidden="true"
        />

        {/* Card */}
        <div className="relative w-full max-w-[400px] bg-[#131f35] border border-white/[0.07] rounded-xl p-[1.875rem]"
          style={{
            boxShadow: "0 0 0 1px rgba(255,255,255,0.02), 0 30px 70px rgba(0,0,0,0.55), 0 0 60px rgba(37,99,235,0.06)"
          }}
        >
          {/* Top shimmer line */}
          <div className="absolute top-0 left-[15%] right-[15%] h-px rounded-t-xl pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.18) 40%, rgba(96,165,250,0.18) 60%, transparent)" }}
            aria-hidden="true"
          />

          <LoginForm />
        </div>
      </section>
    </div>
  );
}
