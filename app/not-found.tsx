import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20 text-center">
      <div className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-sale mb-4">
        404
      </div>
      <h1 className="text-3xl font-light mb-3">Page not found</h1>
      <p className="text-text-mid mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block font-mono text-[0.8rem] tracking-[0.1em] uppercase bg-accent text-bg px-8 py-4 rounded-[4px] hover:bg-white transition-all duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
}
