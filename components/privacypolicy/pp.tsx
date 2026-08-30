import React from 'react';

export default function PrivacyPolicyContent() {
  return (
    <div className="relative w-full min-h-screen pt-28 sm:pt-36 md:pt-44 pb-24 px-4 md:px-8 font-sans antialiased text-[#242623] selection:bg-[#A52A2C] selection:text-[#F3ECE0]">
      {/* ── Exact About Page Molten Core Ambient Setup ── */}
      {/* Layer 1: Molten Core Gradient (Deep Crimson Red to Glowing Ember Base) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(130% 95% at 50% 75%, #D4481E 0%, #B0281F 30%, #7A1416 65%, #420608 100%)',
        }}
      />

      {/* Layer 2: Top Ambient Vignette (Matches AboutHero Stage Glow) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(245, 130, 45, 0.28) 0%, rgba(20, 3, 2, 0.45) 70%, rgba(20, 3, 2, 0.75) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Layer 3: Film Grain Overlay for Luxury Velvet Feel */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-25 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Container holding all sections */}
      <div className="relative z-10 max-w-[1040px] mx-auto space-y-12">

        {/* ================= SECTION 1: SHIPPING & RETURNS ================= */}
        <section className="w-full rounded-[18px] overflow-hidden relative shadow-[0_40px_80px_rgba(80,20,15,0.22)] grid grid-cols-1 md:grid-cols-[340px_1fr]">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#242623] text-[#F3ECE0] text-[8px] tracking-[0.16em] uppercase px-3 py-1 rounded-full font-semibold z-20 opacity-70">
            Shipping &amp; Returns
          </div>

          {/* Left Rail (Red Gradient) */}
          <div className="relative overflow-hidden p-10 md:p-12 flex flex-col justify-between text-[#F3ECE0] min-h-[260px] md:min-h-full bg-gradient-to-br from-[#b83232] to-[#7E1D1E]">
            {/* Background Glows & Patterns */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_9px)]" />
            <div className="absolute w-[340px] height-[340px] rounded-full bg-[radial-gradient(circle,rgba(255,165,85,0.45),transparent_66%)] -bottom-[120px] -left-[80px] blur-[30px] pointer-events-none" />
            <div className="absolute w-[180px] height-[180px] rounded-full bg-[radial-gradient(circle,rgba(255,200,140,0.3),transparent_66%)] -top-[40px] -right-[30px] blur-[24px] pointer-events-none" />

            {/* Silhouette Icon */}
            <div className="absolute right-6 top-[46%] -translate-y-1/2 z-[1] opacity-15 pointer-events-none">
              <svg viewBox="0 0 60 120" className="w-[132px] stroke-[#F3ECE0] fill-none stroke-[1.3]">
                <rect x="20" y="4" width="20" height="14" rx="3" />
                <rect x="16" y="20" width="28" height="12" rx="3" />
                <rect x="12" y="34" width="36" height="82" rx="8" />
              </svg>
            </div>

            <div className="relative z-10 font-serif font-light text-[15px] tracking-[0.5em]">
              ARTISUN
            </div>

            <div className="relative z-10 my-8 md:my-0">
              <div className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-60 mb-4">
                Policy · 01
              </div>
              <h1 className="font-serif font-extralight text-3xl md:text-5xl leading-tight tracking-tight">
                Getting it to you, <em className="italic font-light">safely.</em>
              </h1>
            </div>

            <p className="relative z-10 text-[13px] leading-relaxed font-light opacity-85 max-w-[34ch]">
              Everything about how your order reaches you, and how we look after you if anything isn't quite right.
            </p>
          </div>

          {/* Right Body */}
          <div className="relative p-8 md:p-14 bg-[radial-gradient(120%_60%_at_84%_0%,#F3ECE0,#EDE3D3_86%,#e4d4bd)]">
            <div className="relative z-10">
              <div className="text-[10px] tracking-[0.24em] uppercase font-semibold text-[#A52A2C] mb-4 flex items-center gap-2.5 before:content-[''] before:w-[22px] before:h-[1px] before:bg-current before:opacity-50">
                Shipping
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="relative bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-[#A52A2C] before:to-[#FF9B45]">
                  <div className="font-serif text-xl font-normal text-[#7E1D1E] mb-2 leading-none">All of India</div>
                  <div className="text-xs opacity-75 leading-snug">Kashmir to the Northeast, metros to the smallest towns.</div>
                </div>

                <div className="relative bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-[#A52A2C] before:to-[#FF9B45]">
                  <div className="font-serif text-xl font-normal text-[#7E1D1E] mb-2 leading-none">₹80 flat</div>
                  <div className="text-xs opacity-75 leading-snug">On every order — first order ships free.</div>
                </div>

                <div className="relative bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-[#A52A2C] before:to-[#FF9B45]">
                  <div className="font-serif text-xl font-normal text-[#7E1D1E] mb-2 leading-none">3–5 days</div>
                  <div className="text-xs opacity-75 leading-snug">A little longer for far corners, always tracked.</div>
                </div>
              </div>

              {/* Points */}
              <div className="divide-y divide-[#242623]/10">
                <div className="grid grid-cols-[28px_1fr] gap-4 py-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#A52A2C]/10 text-[#A52A2C] flex items-center justify-center font-serif text-[13px] italic flex-none">1</div>
                  <div className="text-[13.5px] leading-relaxed opacity-85">
                    <b className="font-semibold opacity-100">We ship right across India.</b> From Kashmir to the Northeast, from the big metros to the smallest towns — if you're in the country, we'll find our way to you.
                  </div>
                </div>

                <div className="grid grid-cols-[28px_1fr] gap-4 py-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#A52A2C]/10 text-[#A52A2C] flex items-center justify-center font-serif text-[13px] italic flex-none">2</div>
                  <div className="text-[13.5px] leading-relaxed opacity-85">
                    <b className="font-semibold opacity-100">Shipping is a flat ₹80 on every order, and your first order is on us.</b> Free shipping the first time, as a small welcome for choosing Artisun.
                  </div>
                </div>

                <div className="grid grid-cols-[28px_1fr] gap-4 py-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#A52A2C]/10 text-[#A52A2C] flex items-center justify-center font-serif text-[13px] italic flex-none">3</div>
                  <div className="text-[13.5px] leading-relaxed opacity-85">
                    <b className="font-semibold opacity-100">Most orders arrive within three to five business days.</b> It can take a little longer to reach the farther corners of the country, but you'll always know exactly where your order is.
                  </div>
                </div>

                <div className="grid grid-cols-[28px_1fr] gap-4 py-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#A52A2C]/10 text-[#A52A2C] flex items-center justify-center font-serif text-[13px] italic flex-none">4</div>
                  <div className="text-[13.5px] leading-relaxed opacity-85">
                    <b className="font-semibold opacity-100">You'll be able to track it the whole way.</b> The moment your order ships, your tracking link comes to you on both WhatsApp and email, so you can follow it all the way to your door.
                  </div>
                </div>
              </div>

              {/* Cancellations */}
              <div className="text-[10px] tracking-[0.24em] uppercase font-semibold text-[#A52A2C] mt-9 mb-4 flex items-center gap-2.5 before:content-[''] before:w-[22px] before:h-[1px] before:bg-current before:opacity-50">
                Cancellations
              </div>
              <div className="divide-y divide-[#242623]/10">
                <div className="grid grid-cols-[28px_1fr] gap-4 py-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#A52A2C]/10 text-[#A52A2C] flex items-center justify-center font-serif text-[13px] italic flex-none">✓</div>
                  <div className="text-[13.5px] leading-relaxed opacity-85">
                    <b className="font-semibold opacity-100">Changed your mind? That's completely fine.</b> You can cancel within 24 hours of placing your order, or any time before it ships, whichever comes first. Just message us with your order number, no questions asked.
                  </div>
                </div>
                <div className="grid grid-cols-[28px_1fr] gap-4 py-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#A52A2C]/10 text-[#A52A2C] flex items-center justify-center font-serif text-[13px] italic flex-none">·</div>
                  <div className="text-[13.5px] leading-relaxed opacity-85">
                    Once an order is on its way to you, we're no longer able to pull it back — but our replacement promise looks after you from there.
                  </div>
                </div>
              </div>

              {/* Returns & Replacements */}
              <div className="text-[10px] tracking-[0.24em] uppercase font-semibold text-[#A52A2C] mt-9 mb-4 flex items-center gap-2.5 before:content-[''] before:w-[22px] before:h-[1px] before:bg-current before:opacity-50">
                Returns &amp; replacements
              </div>
              <div className="divide-y divide-[#242623]/10">
                <div className="grid grid-cols-[28px_1fr] gap-4 py-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#A52A2C]/10 text-[#A52A2C] flex items-center justify-center font-serif text-[13px] italic flex-none">1</div>
                  <div className="text-[13.5px] leading-relaxed opacity-85">
                    <b className="font-semibold opacity-100">If your order arrives damaged, faulty, or wrong, we'll replace it, on us.</b> Just raise it within 48 hours of delivery, with your order number and a quick photo of the issue.
                  </div>
                </div>
                <div className="grid grid-cols-[28px_1fr] gap-4 py-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#A52A2C]/10 text-[#A52A2C] flex items-center justify-center font-serif text-[13px] italic flex-none">2</div>
                  <div className="text-[13.5px] leading-relaxed opacity-85">
                    <b className="font-semibold opacity-100">The resolution is your choice.</b> A fresh replacement, or store credit to use whenever it suits you — whichever you'd prefer.
                  </div>
                </div>
                <div className="grid grid-cols-[28px_1fr] gap-4 py-3.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#A52A2C]/10 text-[#A52A2C] flex items-center justify-center font-serif text-[13px] italic flex-none">3</div>
                  <div className="text-[13.5px] leading-relaxed opacity-85">
                    <b className="font-semibold opacity-100">On opened products:</b> for the safety and hygiene of everyone we ship to, sunscreen that's been opened or used can't be sent back — the same standard you'd expect from any skincare you put on your face.
                  </div>
                </div>
              </div>

              {/* Contact Banner */}
              <div className="mt-6 bg-[#A52A2C]/5 border border-[#A52A2C]/20 rounded-xl p-4 md:p-5 text-[13px] leading-relaxed">
                To raise a cancellation or replacement, message us on Instagram at{' '}
                <a href="https://instagram.com/artisunskinwear" target="_blank" rel="noreferrer" className="text-[#A52A2C] underline decoration-[#A52A2C]/40 hover:decoration-[#A52A2C]">
                  @artisunskinwear
                </a>{' '}
                or write to{' '}
                <a href="mailto:support@artisunskin.com" className="text-[#A52A2C] underline decoration-[#A52A2C]/40 hover:decoration-[#A52A2C]">
                  support@artisunskin.com
                </a>{' '}
                — we reply within one working day.
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: CONTACT ================= */}
        <section className="w-full rounded-[18px] overflow-hidden relative shadow-[0_40px_80px_rgba(80,20,15,0.22)] grid grid-cols-1 md:grid-cols-[340px_1fr]">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#242623] text-[#F3ECE0] text-[8px] tracking-[0.16em] uppercase px-3 py-1 rounded-full font-semibold z-20 opacity-70">
            Contact
          </div>

          {/* Left Rail (Ink Gradient) */}
          <div className="relative overflow-hidden p-10 md:p-12 flex flex-col justify-between text-[#F3ECE0] min-h-[260px] md:min-h-full bg-gradient-to-br from-[#3a2a23] to-[#160f0d]">
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_9px)]" />
            <div className="absolute w-[340px] height-[340px] rounded-full bg-[radial-gradient(circle,rgba(255,165,85,0.45),transparent_66%)] -bottom-[120px] -left-[80px] blur-[30px] pointer-events-none" />
            <div className="absolute w-[180px] height-[180px] rounded-full bg-[radial-gradient(circle,rgba(255,200,140,0.3),transparent_66%)] -top-[40px] -right-[30px] blur-[24px] pointer-events-none" />

            <div className="absolute right-6 top-[46%] -translate-y-1/2 z-[1] opacity-15 pointer-events-none">
              <svg viewBox="0 0 70 70" className="w-[132px] stroke-[#F3ECE0] fill-none stroke-[1.3]">
                <rect x="10" y="6" width="50" height="10" rx="3" />
                <rect x="6" y="18" width="58" height="46" rx="8" />
              </svg>
            </div>

            <div className="relative z-10 font-serif font-light text-[15px] tracking-[0.5em]">
              ARTISUN
            </div>

            <div className="relative z-10 my-8 md:my-0">
              <div className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-60 mb-4">
                Contact · 02
              </div>
              <h1 className="font-serif font-extralight text-3xl md:text-5xl leading-tight tracking-tight">
                We're right <em className="italic font-light">here.</em>
              </h1>
            </div>

            <div className="relative z-10">
              <p className="text-[13px] leading-relaxed font-light opacity-85 max-w-[34ch]">
                A question about your order, your skin, or which one is right for you — we'd genuinely love to hear from you.
              </p>
              <p className="font-serif italic text-[13px] opacity-50 mt-5">
                What's your skin wearing today?
              </p>
            </div>
          </div>

          {/* Right Body */}
          <div className="relative p-8 md:p-14 bg-[radial-gradient(120%_60%_at_84%_0%,#F3ECE0,#EDE3D3_86%,#e4d4bd)]">
            <div className="relative z-10">
              <div className="text-[10px] tracking-[0.24em] uppercase font-semibold text-[#A52A2C] mb-4 flex items-center gap-2.5 before:content-[''] before:w-[22px] before:h-[1px] before:bg-current before:opacity-50">
                Reach us
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="group relative bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A52A2C]/40">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#A52A2C] to-[#FF9B45] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#A52A2C] mb-2">Instagram</div>
                  <div className="font-serif text-base font-normal">
                    <a href="https://instagram.com/artisunskinwear" target="_blank" rel="noreferrer" className="text-[#242623] hover:text-[#A52A2C]">@artisunskinwear</a>
                  </div>
                  <div className="text-[11.5px] opacity-60 mt-1.5 leading-snug">Message us here for the fastest reply, and for everything new.</div>
                </div>

                <div className="group relative bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A52A2C]/40">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#A52A2C] to-[#FF9B45] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#A52A2C] mb-2">Email</div>
                  <div className="font-serif text-base font-normal">
                    <a href="mailto:support@artisunskin.com" className="text-[#242623] hover:text-[#A52A2C]">support@artisunskin.com</a>
                  </div>
                  <div className="text-[11.5px] opacity-60 mt-1.5 leading-snug">For orders, questions and anything else. We reply within a working day.</div>
                </div>

                <div className="group relative bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A52A2C]/40">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#A52A2C] to-[#FF9B45] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#A52A2C] mb-2">WhatsApp</div>
                  <div className="font-serif text-base font-normal">Coming soon</div>
                  <div className="text-[11.5px] opacity-60 mt-1.5 leading-snug">Our line opens shortly — Monday to Saturday, 10am to 7pm.</div>
                </div>

                <div className="group relative bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A52A2C]/40">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#A52A2C] to-[#FF9B45] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#A52A2C] mb-2">Order help</div>
                  <div className="font-serif text-base font-normal">
                    <a href="mailto:support@artisunskin.com" className="text-[#242623] hover:text-[#A52A2C]">support@artisunskin.com</a>
                  </div>
                  <div className="text-[11.5px] opacity-60 mt-1.5 leading-snug">Tracking, cancellations and replacements, all handled here.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: PRIVACY ================= */}
        <section className="w-full rounded-[18px] overflow-hidden relative shadow-[0_40px_80px_rgba(80,20,15,0.22)] grid grid-cols-1 md:grid-cols-[340px_1fr]">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#242623] text-[#F3ECE0] text-[8px] tracking-[0.16em] uppercase px-3 py-1 rounded-full font-semibold z-20 opacity-70">
            Privacy
          </div>

          {/* Left Rail (Red Gradient) */}
          <div className="relative overflow-hidden p-10 md:p-12 flex flex-col justify-between text-[#F3ECE0] min-h-[260px] md:min-h-full bg-gradient-to-br from-[#b83232] to-[#7E1D1E]">
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_9px)]" />
            <div className="absolute w-[340px] height-[340px] rounded-full bg-[radial-gradient(circle,rgba(255,165,85,0.45),transparent_66%)] -bottom-[120px] -left-[80px] blur-[30px] pointer-events-none" />
            <div className="absolute w-[180px] height-[180px] rounded-full bg-[radial-gradient(circle,rgba(255,200,140,0.3),transparent_66%)] -top-[40px] -right-[30px] blur-[24px] pointer-events-none" />

            <div className="absolute right-6 top-[46%] -translate-y-1/2 z-[1] opacity-15 pointer-events-none">
              <svg viewBox="0 0 60 120" className="w-[132px] stroke-[#F3ECE0] fill-none stroke-[1.3]">
                <rect x="20" y="4" width="20" height="14" rx="3" />
                <rect x="16" y="20" width="28" height="12" rx="3" />
                <rect x="12" y="34" width="36" height="82" rx="8" />
              </svg>
            </div>

            <div className="relative z-10 font-serif font-light text-[15px] tracking-[0.5em]">
              ARTISUN
            </div>

            <div className="relative z-10 my-8 md:my-0">
              <div className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-60 mb-4">
                Policy · 03
              </div>
              <h1 className="font-serif font-extralight text-3xl md:text-5xl leading-tight tracking-tight">
                Your data, <em className="italic font-light">respected.</em>
              </h1>
            </div>

            <p className="relative z-10 text-[13px] leading-relaxed font-light opacity-85 max-w-[34ch]">
              In short: we collect only what we need to serve you well, we keep it secure, and we never sell it. The full detail is here.
            </p>
          </div>

          {/* Right Body */}
          <div className="relative p-8 md:p-14 bg-[radial-gradient(120%_60%_at_84%_0%,#F3ECE0,#EDE3D3_86%,#e4d4bd)]">
            <div className="relative z-10 space-y-6">
              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">Who we are</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Artisun is a sun care brand operating in India through our website, artisunskin.com. This policy explains what personal information we collect, how we use it, and the rights you have over it. By using our website, you agree to the practices described here.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">What we collect</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  When you place an order or create an account, we collect the details we need to serve you: your name, delivery and billing address, phone number, and email. When you browse, we also collect some technical information automatically, such as your device and how you move through our site. Your payments are handled securely by trusted providers — <b className="font-semibold opacity-100">we never see or store your card details.</b>
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">How we use it</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  To process and deliver orders, send tracking updates over WhatsApp and email, answer your questions, and handle cancellations or replacements. Where you've opted in, we also use your contact details to share new launches — and you can stop these any time.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">Cookies</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Like most websites, we use cookies to remember your preferences, keep your cart working, and understand how our site is used. You can control or disable them in your browser, though some parts of the site may not work as smoothly without them.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">Who we share it with</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Only the partners who help us operate — delivery, payment, and the tools that send your updates. Each receives only what they need, and is required to protect it. <b className="font-semibold opacity-100">We never sell your personal data to anyone.</b>
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">How long we keep it</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Only as long as we need it — to fulfil orders, meet our legal and tax obligations, and support you as a customer. When it's no longer needed, we securely delete or anonymise it.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">Your rights</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  You can access the information we hold about you, ask us to correct or update it, or request that we delete it. You can withdraw consent to marketing at any time. To do any of these, write to{' '}
                  <a href="mailto:support@artisunskin.com" className="text-[#A52A2C] underline decoration-[#A52A2C]/40 hover:decoration-[#A52A2C]">
                    support@artisunskin.com
                  </a>{' '}
                  and we'll respond promptly.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">Children's privacy</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Our products and website are intended for adults. We do not knowingly collect information from anyone under eighteen. If you believe a minor has shared information with us, contact us and we'll remove it.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">Security</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  We take reasonable measures to protect your information against loss, misuse and unauthorised access. While no method of transmission over the internet is completely secure, we work to keep your data safe at every step.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-normal text-[17px] mb-2 tracking-tight">Changes to this policy</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  We may update this policy from time to time as our business or the law evolves. When we do, we'll post the revised version here with a new date. Any privacy question, write to{' '}
                  <a href="mailto:support@artisunskin.com" className="text-[#A52A2C] underline decoration-[#A52A2C]/40 hover:decoration-[#A52A2C]">
                    support@artisunskin.com
                  </a>.
                </p>
                <p className="text-[11px] opacity-50 mt-2 italic">Last updated: August 2026</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}