export interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  color: string;
  audioUrl: string;
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'GAMEOVER';

export interface Point {
  x: number;
  y: number;
}
