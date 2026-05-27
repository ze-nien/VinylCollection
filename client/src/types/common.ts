export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface Stats {
  total: number;
  genreDistribution?: {
    genreName: string;
    count: number;
  }[];
  eraDistribution: {
    era: string;
    count: number;
  }[];
}

interface Album {
  album: string;
  artist: string;
}
export interface VinylStats extends Stats {
  recommend?: {
    genre: string;
    albums: Album[];
  }[];
}
