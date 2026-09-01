'use client';

import React from 'react';

export default function ContactContent() {
  return (
    <div className="relative w-full min-h-screen pt-28 sm:pt-36 md:pt-44 pb-24 px-4 md:px-8 font-suisse antialiased text-[#242623] selection:bg-[#A52A2C] selection:text-[#F3ECE0]">
      {/* Site-wide Red Eclipse Background */}
      <div className="artisun-bg" />

      <div className="relative z-10 max-w-[1040px] mx-auto">
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

            <div className="relative z-10 font-editorial font-light text-[15px] tracking-[0.5em]">
              ARTISUN
            </div>

            <div className="relative z-10 my-8 md:my-0">
              <div className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-60 mb-4">
                Contact · 02
              </div>
              <h1 className="font-editorial font-extralight text-3xl md:text-5xl leading-tight tracking-tight">
                We're right <em className="italic font-light">here.</em>
              </h1>
            </div>

            <div className="relative z-10">
              <p className="text-[13px] leading-relaxed font-light opacity-85 max-w-[34ch]">
                A question about your order, your skin, or which one is right for you — we'd genuinely love to hear from you.
              </p>
              <p className="font-editorial italic text-[13px] opacity-50 mt-5">
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
                {/* Instagram Card */}
                <a
                  href="https://instagram.com/artisunskinwear"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A52A2C]/40 cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#A52A2C] to-[#FF9B45] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#A52A2C] mb-2">Instagram</div>
                  <div className="font-editorial text-base font-normal text-[#242623] group-hover:text-[#A52A2C] transition-colors">
                    @artisunskinwear
                  </div>
                  <div className="text-[11.5px] opacity-60 mt-1.5 leading-snug">Message us here for the fastest reply, and for everything new.</div>
                </a>

                {/* Email Card */}
                <a
                  href="mailto:support@artisunskin.com"
                  className="group relative block bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A52A2C]/40 cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#A52A2C] to-[#FF9B45] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#A52A2C] mb-2">Email</div>
                  <div className="font-editorial text-base font-normal text-[#242623] group-hover:text-[#A52A2C] transition-colors">
                    support@artisunskin.com
                  </div>
                  <div className="text-[11.5px] opacity-60 mt-1.5 leading-snug">For orders, questions and anything else. We reply within a working day.</div>
                </a>

{/* contact page done */}

                {/* WhatsApp Card */}
                <a
                  href="https://wa.me/917982605517"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A52A2C]/40 cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#A52A2C] to-[#FF9B45] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#A52A2C] mb-2">WhatsApp</div>
                  <div className="font-editorial text-base font-normal text-[#242623] group-hover:text-[#A52A2C] transition-colors">
                    +91 7982605517
                  </div>
                  <div className="text-[11.5px] opacity-60 mt-1.5 leading-snug">Our line opens shortly — Monday to Saturday, 10am to 7pm.</div>
                </a>

                {/* Order Help Card */}
                <a
                  href="mailto:support@artisunskin.com?subject=Order%20Help%20Request"
                  className="group relative block bg-gradient-to-br from-white/75 to-[#FFF8EE]/50 border border-[#242623]/10 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A52A2C]/40 cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#A52A2C] to-[#FF9B45] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#A52A2C] mb-2">Order help</div>
                  <div className="font-editorial text-base font-normal text-[#242623] group-hover:text-[#A52A2C] transition-colors">
                    support@artisunskin.com
                  </div>
                  <div className="text-[11.5px] opacity-60 mt-1.5 leading-snug">Tracking, cancellations and replacements, all handled here.</div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}