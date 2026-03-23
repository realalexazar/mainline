export default function Banner() {
  return (
    <div className="max-w-content mx-auto my-16 px-6 md:px-10">
      <div className="border border-border bg-accent-dim rounded-[4px] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-[1.4rem] md:text-[1.5rem] font-medium mb-2">New stuff drops weekly.</h3>
          <p className="text-text-mid text-[0.95rem]">
            Get notified when we add inventory — no spam, just drops.
          </p>
        </div>
        <button className="font-mono text-[0.8rem] tracking-[0.1em] uppercase border border-accent text-accent px-8 py-3.5 rounded-[4px] bg-transparent hover:bg-accent hover:text-bg transition-all duration-200 whitespace-nowrap cursor-pointer">
          Join the List
        </button>
      </div>
    </div>
  );
}
