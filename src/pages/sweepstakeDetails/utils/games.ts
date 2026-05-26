export const parseNumbers = (input: string): number[] =>
  input.split(/[,\s]+/).filter(Boolean).map(Number).filter((n) => !isNaN(n) && n > 0)