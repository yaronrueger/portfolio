export const accents = ['green', 'blue', 'orange', 'fuchsia', 'purple', 'yellow'] as const;

export function accentClass(index: number): string {
  return `accent-${accents[index % accents.length]}`;
}
