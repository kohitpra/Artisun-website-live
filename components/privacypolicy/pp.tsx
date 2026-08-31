'use client';

import React from 'react';

export default function PrivacyPolicyContent() {
  return (
    <div className="relative w-full min-h-screen pt-28 sm:pt-36 md:pt-44 pb-24 px-4 md:px-8 font-suisse antialiased text-[#242623] selection:bg-[#A52A2C] selection:text-[#F3ECE0]">
      {/* Site-wide Red Eclipse Background */}
      <div className="artisun-bg" />

      <div className="relative z-10 max-w-[1040px] mx-auto">
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

            <div className="relative z-10 font-editorial font-light text-[15px] tracking-[0.5em]">
              ARTISUN
            </div>

            <div className="relative z-10 my-8 md:my-0">
              <div className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-60 mb-4">
                Policy · 01
              </div>
              <h1 className="font-editorial font-extralight text-3xl md:text-5xl leading-tight tracking-tight">
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
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">Who we are</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Artisun is a sun care brand operating in India through our website, artisunskin.com. This policy explains what personal information we collect, how we use it, and the rights you have over it. By using our website, you agree to the practices described here.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">What we collect</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  When you place an order or create an account, we collect the details we need to serve you: your name, delivery and billing address, phone number, and email. When you browse, we also collect some technical information automatically, such as your device and how you move through our site. Your payments are handled securely by trusted providers — <b className="font-semibold opacity-100">we never see or store your card details.</b>
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">How we use it</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  To process and deliver orders, send tracking updates over WhatsApp and email, answer your questions, and handle cancellations or replacements. Where you've opted in, we also use your contact details to share new launches — and you can stop these any time.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">Cookies</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Like most websites, we use cookies to remember your preferences, keep your cart working, and understand how our site is used. You can control or disable them in your browser, though some parts of the site may not work as smoothly without them.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">Who we share it with</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Only the partners who help us operate — delivery, payment, and the tools that send your updates. Each receives only what they need, and is required to protect it. <b className="font-semibold opacity-100">We never sell your personal data to anyone.</b>
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">How long we keep it</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Only as long as we need it — to fulfil orders, meet our legal and tax obligations, and support you as a customer. When it's no longer needed, we securely delete or anonymise it.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">Your rights</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  You can access the information we hold about you, ask us to correct or update it, or request that we delete it. You can withdraw consent to marketing at any time. To do any of these, write to{' '}
                  <a href="mailto:support@artisunskin.com" className="text-[#A52A2C] underline decoration-[#A52A2C]/40 hover:decoration-[#A52A2C]">
                    support@artisunskin.com
                  </a>{' '}
                  and we'll respond promptly.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">Children's privacy</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  Our products and website are intended for adults. We do not knowingly collect information from anyone under eighteen. If you believe a minor has shared information with us, contact us and we'll remove it.
                </p>
              </div>

              <div className="pb-5 border-b border-[#242623]/10">
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">Security</h4>
                <p className="text-[13.5px] leading-relaxed font-light opacity-85 max-w-[62ch]">
                  We take reasonable measures to protect your information against loss, misuse and unauthorised access. While no method of transmission over the internet is completely secure, we work to keep your data safe at every step.
                </p>
              </div>

              <div>
                <h4 className="font-editorial font-normal text-[17px] mb-2 tracking-tight">Changes to this policy</h4>
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