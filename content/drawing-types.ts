export type DrawingSpec = {
  viewBox: string; label: string;
  frames?: { x: number; y: number; w: number; h: number; text: string }[];
  boxes: { x: number; y: number; w: number; text: string; sub?: string; dashed?: boolean }[];
  arrows: { d: string; dashed?: boolean; label?: [number, number, string]; anchor?: 'start' | 'middle' | 'end' }[];
  notes: { x: number; y: number; text: string }[];
};
