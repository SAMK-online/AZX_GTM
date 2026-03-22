interface PageHeroProps {
  color?: string;
  children: React.ReactNode;
}

export function PageHero({ children }: PageHeroProps) {
  return (
    <div className="relative border-b border-azx-border overflow-hidden">
      {children}
    </div>
  );
}
