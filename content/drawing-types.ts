export type DrawingSpec = {
  viewBox: string; label: string;
  boxes: { x: number; y: number; w: number; text: string; dashed?: boolean }[];
  arrows: { d: string; dashed?: boolean }[];
  notes: { x: number; y: number; text: string }[];
};
