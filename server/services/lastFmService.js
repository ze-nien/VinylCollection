import axios from "axios";

//從last.fm API獲取專輯封面
export const fetchAlbumCover = async (artist, album) => {
  try {
    const lastFmResponse = await axios.get(
      `http://ws.audioscrobbler.com/2.0/`,
      {
        params: {
          method: "album.getinfo",
          api_key: process.env.LASTFM_KEY,
          artist,
          album,
          format: "json",
        },
      },
    );
    const images = lastFmResponse.data?.album?.image;
    if (images && images.length > 0) return images[images.length - 1]["#text"];
    return "none";
  } catch (error) {
    return "none";
  }
};
