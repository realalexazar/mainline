export default function LCARSLoading({ text = 'SCANNING' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-64 h-2 bg-lcars-panel rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-lcars-amber rounded-full animate-lcars-scan" />
      </div>
      <span className="font-mono text-sm uppercase tracking-widest text-lcars-amber animate-lcars-pulse">
        {text}...
      </span>
    </div>
  );
}
