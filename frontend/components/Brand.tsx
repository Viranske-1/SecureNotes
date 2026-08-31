export default function Brand({ compact = false }: { compact?: boolean }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className={`${compact ? "size-9" : "size-10"} brand-mark shrink-0`}>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 19 6v5.2c0 4.2-2.85 7.7-7 9.3-4.15-1.6-7-5.1-7-9.3V6l7-2.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 11.5h5v4h-5zM10.5 11.5V10a1.5 1.5 0 0 1 3 0v1.5" />
                </svg>
            </div>
            <div>
                <p className="text-[17px] font-bold tracking-tight text-[#1A1A1A]">Secure<span className="text-orange-600">Notes</span></p>
                <p className="text-[11px] text-[#6B6B6B]">Encrypted note management</p>
            </div>
        </div>
    );
}
