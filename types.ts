export enum Tool {
  BRUSH = 'BRUSH',
  ERASER = 'ERASER',
}

export type CanvasSize = { width: number; height: number } | 'FIT_SCREEN';

export type UserProfile = {
  name: string;
  email: string;
  picture: string;
};