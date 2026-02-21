import Link from 'next/link';
import LCARSBar from '@/components/lcars/LCARSBar';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <LCARSBar color="red" className="w-full max-w-md">
        Error 404
      </LCARSBar>
      <div className="text-center space-y-3">
        <h1 className="font-mono text-4xl text-lcars-red tracking-wider">
          SECTOR NOT FOUND
        </h1>
        <p className="font-mono text-sm text-lcars-orange/60 uppercase tracking-wider">
          The requested coordinates do not match any known location
        </p>
      </div>
      <Link
        href="/"
        className="inline-block bg-lcars-amber text-lcars-bg font-mono text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:brightness-110 transition-all"
      >
        Return to Hub
      </Link>
    </div>
  );
}
