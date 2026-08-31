import Brand from "@/components/Brand";

export default function AuthShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="page-shell">
            <nav className="content-container flex h-20 items-center justify-between" aria-label="Authentication navigation">
                <Brand compact />
                <span className="hidden text-sm text-[#6B6B6B] sm:block">Private notes. Thoughtfully protected.</span>
            </nav>
            <div className="content-container grid min-h-[calc(100vh-5rem)] items-center gap-12 py-10 lg:grid-cols-[1.08fr_.92fr] lg:py-16">
                <section className="max-w-xl">
                    <span className="eyebrow">SecureNotes</span>
                    <h2 className="mt-5 text-5xl font-bold leading-[.98] tracking-[-.045em] text-[#1A1A1A] sm:text-6xl">Your ideas,<br />protected.</h2>
                    <p className="mt-6 max-w-lg text-base leading-7 text-[#6B6B6B]">Securely manage encrypted notes in one private workspace.</p>
                    <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
                        <article className="editorial-card pastel-green p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#53534f]">Encryption</p><p className="mt-8 text-xl font-bold text-[#1A1A1A]">AES-256-GCM</p></article>
                        <article className="editorial-card pastel-blue p-5 sm:translate-y-7"><p className="text-xs font-bold uppercase tracking-wider text-[#53534f]">Access</p><p className="mt-8 text-xl font-bold text-[#1A1A1A]">Email OTP MFA</p></article>
                    </div>
                </section>
                <section className="page-stage mx-auto w-full max-w-md rounded-[20px] border border-[#DEDDD8] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,.04)] sm:p-9">
                    <div className="mb-9 lg:hidden"><Brand compact /></div>
                    {children}
                </section>
            </div>
        </main>
    );
}
