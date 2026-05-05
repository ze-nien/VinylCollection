export function VinylDisc({ spinning = false }: { spinning?: boolean }) {
  return <div className={`vinyl-disc size-16 ${spinning ? "spinning" : ""}`} />;
}
