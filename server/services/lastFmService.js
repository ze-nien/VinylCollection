import axios from "axios";

//從last.fm API獲取專輯封面
export const fetchAlbumCover = async (artist, album) => {
  try {
    if (!artist || !album) return "none";
    const lastFmResponse = await axios.get(
      `http://ws.audioscrobbler.com/2.0/`,
      {
        params: {
          method: "album.getinfo",
          api_key: process.env.LASTFM_KEY,
          artist: artist.trim(),
          album: album.trim(),
          format: "json",
        },
        headers: {
          "User-Agent": "MyVinylCollectionApp/1.0.0",
        },
      },
    );
    const images = lastFmResponse.data?.album?.image;
    if (images && images.length > 0) {
      const sourceUrl = lastFmResponse.data.album.url;
      // 倒序尋找，優先拿最大的圖片，若為空字串則往小尺寸找
      for (let i = images.length - 1; i >= 0; i--) {
        const imageUrl = images[i]["#text"];
        if (imageUrl && imageUrl.trim() !== "") {
          return { imageUrl, sourceUrl };
        }
      }
    }
    // console.log(lastFmResponse);
    // if (images && images.length > 0) return images[images.length - 1]["#text"];
    return "none";
  } catch (error) {
    return "none";
  }
};

export const fetchLastFmRecommendations = async (topGenres) => {
  try {
    const results = await Promise.all(
      topGenres.map(async (genre) => {
        const lastFmResponse = await axios.get(
          `http://ws.audioscrobbler.com/2.0/`,
          {
            params: {
              method: "tag.gettopalbums",
              api_key: process.env.LASTFM_KEY,
              tag: genre,
              limit: 10,
              format: "json",
            },
            headers: {
              "User-Agent": "MyVinylCollectionApp/1.0.0",
            },
          },
        );
        const albums = (lastFmResponse.data?.albums?.album || [])
          .slice(0, 10)
          .map((a) => ({
            album: a.name,
            artist: a.artist.name,
          }));
        return { genre, albums };
      }),
    );
    return results;
  } catch (error) {
    return "none";
  }
};

export const getCleanRecommendations = async (topGenres, userVinyls) => {
  // 2. 獲取 Last.fm 的推薦
  const rawData = await fetchLastFmRecommendations(topGenres);

  // 3. 過濾衝突並回傳「乾淨」結果
  return rawData.map((group) => ({
    genre: group.genre,
    albums: group.albums
      .filter((recAlbum) => {
        // 如果資料庫中已存在，則過濾掉 (回傳 false)
        const exists = userVinyls.some(
          (v) =>
            v.album.toLowerCase() === recAlbum.album.toLowerCase() &&
            v.artist.toLowerCase() === recAlbum.artist.toLowerCase(),
        );
        return !exists;
      })
      .slice(0, 3), // 確保過濾後還是維持每種曲風三個
  }));
};
