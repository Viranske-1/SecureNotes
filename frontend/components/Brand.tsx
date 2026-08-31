export default function Brand({ compact = false }: { compact?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`${compact ? "size-10" : "size-11"} icon-3d flex shrink-0 items-center justify-center rounded-xl`}>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 19 6v5.2c0 4.2-2.85 7.7-7 9.3-4.15-1.6-7-5.1-7-9.3V6l7-2.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 11.5h5v4h-5zM10.5 11.5V10a1.5 1.5 0 0 1 3 0v1.5" />
                </svg>
            </div>
            <div>
                <p className="text-lg font-bold tracking-tight text-gray-800">Secure<span className="text-orange-600">Notes</span></p>
                <p className="text-xs text-gray-500">Encrypted note management</p>
            </div>
        </div>
    );
}
