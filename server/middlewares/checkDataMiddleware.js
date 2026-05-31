import Vinyl from "../models/Vinyl.js";

const escapeRegex = (string) => {
  if (!string) return ""; // 防禦性防呆
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

export const checkData =
  (model, extraModel = null) =>
  async (req, res, next) => {
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
        query.$or = [
          { version: { $regex: `^standard$`, $options: "i" } },
          { version: "" },
          { version: { $exists: false } },
        ];
      } else {
        query.version = {
          $regex: `^${escapeRegex(cleanVersion)}$`,
          $options: "i",
        };
      }

      //編輯模式(有 id)，加入 $ne 排除自己
      if (id) {
        query._id = { $ne: id };
      }

      const isDuplicate = await model.findOne(query);
      if (isDuplicate) {
        const e = new Error(
          `規格衝突！您收藏中已有《${cleanAlbum}》- ${cleanArtist} (${cleanVersion})`,
        );
        e.status = 409;
        return next(e);
      }

      if (extraModel) {
        const isFoundInExtra = await extraModel.findOne(query);
        if (isFoundInExtra) {
          const e = new Error(
            `此專輯已存在於收藏庫中《${cleanAlbum}》- ${cleanArtist} (${cleanVersion})`,
          );
          e.status = 409;
          return next(e);
        }
      }

      next();
    } catch (e) {
      next(e);
    }
  };
