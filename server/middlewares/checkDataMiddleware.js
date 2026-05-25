import Vinyl from "../models/Vinyl.js";

export const checkData = async (req, res, next) => {
  try {
    const { id } = req.params; // 如果是 PATCH 會有 id，POST 則是 undefined
    const { album, artist, version } = req.body;

    if (!album || !artist) {
      const e = new Error("專輯名稱與歌手為必填欄位");
      e.status = 400;
      return next(e);
    }

    const cleanAlbum = album.trim();
    const cleanArtist = artist.trim();
    const cleanVersion =
      version && version.trim() !== "" ? version.trim() : "standard";

    // 建立查詢條件
    const query = {
      album: { $regex: `^${cleanAlbum}$`, $options: "i" },
      artist: { $regex: `^${cleanArtist}$`, $options: "i" },
    };

    if (cleanVersion === "standard") {
      // 如果這次要存入的是標準版，那只要資料庫裡是 "standard"、"" 或「根本沒存 version 欄位」的，通通視為衝突！
      query.$or = [
        { version: { $regex: `^standard$`, $options: "i" } },
        { version: "" },
        { version: { $exists: false } },
      ];
    } else {
      // 如果這次存入的是限定版（例如 deluxe），就老老實實去對比有沒有完全一模一樣的限定版
      query.version = {
        $regex: `^${escapeRegex(cleanVersion)}$`,
        $options: "i",
      };
    }

    // ✨ 關鍵：如果是編輯模式(有 id)，加入 $ne 排除自己
    if (id) {
      query._id = { $ne: id };
    }

    const isDuplicate = await Vinyl.findOne(query);

    if (isDuplicate) {
      const e = new Error(
        `規格衝突！您收藏中已有《${cleanAlbum}》- ${cleanArtist} (${cleanVersion})`,
      );
      e.status = 409;
      return next(e); // 丟給你的 errorHandler
    }

    // 沒有重複，順暢通關，前往下一個 Controller
    next();
  } catch (e) {
    next(e);
  }
};
