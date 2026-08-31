import Brand from "@/components/Brand";

export default function AuthShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="spatial-bg min-h-screen px-4 py-6 sm:px-6 sm:py-10">
            <div className="pointer-events-none absolute left-[7%] top-[14%] hidden size-20 rotate-12 rounded-[22px] border border-white/70 bg-white/35 shadow-xl lg:block" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-[12%] right-[7%] hidden size-14 rounded-full bg-orange-200/45 shadow-[0_18px_45px_rgba(249,115,22,.16)] lg:block" aria-hidden="true" />
            <div className="auth-frame mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl gap-5 lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr]">
                <section className="glass-panel surface-floating relative hidden overflow-hidden rounded-[26px] p-12 lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -right-16 -top-16 size-52 rounded-full border-[30px] border-orange-200/35" aria-hidden="true" />
                    <Brand />
                    <div className="relative">
                        <div className="icon-3d mb-8 flex size-20 items-center justify-center rounded-[22px]">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4.5h7.5L19 9v10.5H7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 4.5V9H19M9 13h6M9 16h4" />
                            </svg>
                        </div>
                        <h2 className="max-w-sm text-4xl font-bold leading-tight tracking-tight text-gray-800">Your ideas, protected from everyone but you.</h2>
                        <p className="mt-4 max-w-sm text-base leading-7 text-gray-600">Securely manage your encrypted notes in a private workspace designed for clarity.</p>
                        <div className="mt-8 grid grid-cols-2 gap-3">
                            <div className="glass-card rounded-xl p-3"><p className="text-xs font-bold text-gray-800">Encrypted</p><p className="mt-1 text-[11px] text-gray-500">AES-256-GCM</p></div>
                            <div className="glass-card translate-y-3 rounded-xl p-3"><p className="text-xs font-bold text-gray-800">Protected</p><p className="mt-1 text-[11px] text-gray-500">Email OTP MFA</p></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500"><span className="size-2 rounded-full bg-green-600 shadow-[0_0_0_4px_rgba(22,163,74,.1)]" /> Secure workspace ready</div>
                </section>
                <section className="glass-panel surface-floating page-stage flex flex-col justify-center rounded-[26px] p-6 sm:p-10 lg:p-14">
                    <div className="mb-10 lg:hidden"><Brand compact /></div>
                    <div className="mx-auto w-full max-w-md">{children}</div>
                </section>
            </div>
        </main>
    );
}
