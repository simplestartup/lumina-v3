export interface Recommendation {
  content: {
    title: string;
    type: string;
    platform: string[];
    genre: string;
    releaseDate: string;
    image: string;
  };
}
