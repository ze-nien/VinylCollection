export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

//篩選定義
export interface Filter {
  limit?: number;
  artistSort: string; // createdAt | asc | desc
  genre?: string[];
  yearRange: string; // ~80s | 90s | 00s | 10s | 20s
  albumRating?: string; // 3,4,5 | All
}

//篩選初始值
export const initialVinylFilters: Filter = {
  limit: 12, //預設每頁12筆
  artistSort: "createdAt", // 預設排序：最新
  genre: [], // 預設不限曲風
  yearRange: "All", // 預設不限年代
  albumRating: "All", // 預設不限評分
};

export const initialWishListFilters: Filter = {
  artistSort: "createdAt", // 預設排序：最新
  yearRange: "All", // 預設不限年代
};

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
