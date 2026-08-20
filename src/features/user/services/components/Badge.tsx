export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full border bg-white text-xs">
      {children}
    </span>
  );
}
