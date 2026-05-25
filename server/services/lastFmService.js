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
      // 倒序尋找，優先拿最大的圖片，若為空字串則往小尺寸找
      for (let i = images.length - 1; i >= 0; i--) {
        const imageUrl = images[i]["#text"];
        if (imageUrl && imageUrl.trim() !== "") {
          return imageUrl;
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
