import axios from "axios";
import WishList from "../models/WishList.js";
import Vinyl from "../models/Vinyl.js";
import { GENRES } from "../types/constants.js";
import { fetchAlbumCover } from "../services/lastFmService.js";
import { getWishListSchema } from "../schemas/wishList.js";

//所有資料
export const getWishList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = getWishListSchema.shape.query.parse(
      req.query,
    );
    const skip = (Number(page) - 1) * Number(limit);
    const [wishList, total] = await Promise.all([
      WishList.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      WishList.countDocuments(),
    ]);
    res.status(200).json({
      data: wishList,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (e) {
    next(e);
  }
};

//單一資料
export const getWishListData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await WishList.findById(id).exec();
    if (data) {
      console.log(`search result: ${data}`);
      res.status(200).json(data);
    } else {
      {
        const e = new Error("找不到該黑膠唱片的 ID");
        e.status = 404;
        return next(e);
      }
    }
  } catch (e) {
    next(e);
  }
};

//新增
export const createWishListData = async (req, res, next) => {
  try {
    const { album, artist, notes, isAcquired, year, version } = req.body;
    const { imageUrl: fetchCoverUrl, sourceUrl: fetchCoverSource } =
      await fetchAlbumCover(artist, album);
    const coverUrl =
      fetchCoverUrl === "none" ? "/images/DEFAULT.jpg" : fetchCoverUrl;
    const coverSource = fetchCoverSource || "";
    const finalVersion = version === "" ? "Standard" : version;
    const newWishListData = await WishList.create({
      album,
      artist,
      notes,
      isAcquired,
      version: finalVersion,
      year,
      coverUrl,
      coverSource,
    });
    res.status(200).json(newWishListData);
  } catch (e) {
    next(e);
  }
};

//修改
export const updateWishListData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { artist, album, year, isAcquired, version, notes } = req.body;
    const { imageUrl: fetchCoverUrl, sourceUrl: fetchCoverSource } =
      await fetchAlbumCover(artist, album);
    const coverUrl =
      fetchCoverUrl === "none" ? "/images/DEFAULT.jpg" : fetchCoverUrl;
    const coverSource = fetchCoverSource || "";
    const finalVersion = version === "" ? "Standard" : version;
    const update = {
      album,
      artist,
      notes,
      isAcquired,
      version: finalVersion,
      year,
      coverUrl,
      coverSource,
    };
    console.log(update);
    const newData = await WishList.findByIdAndUpdate(id, update, {
      returnDocument: "after",
      runVaildators: true,
    });
    if (!newData) {
      const e = new Error("找不到該黑膠唱片的 ID，無法編輯");
      e.status = 404;
      return next(e);
    }
    res.status(200).json(newData);
  } catch (e) {
    next(e);
  }
};

//移動資料庫
export const moveToVinyl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const wishData = await WishList.findById(id);
    if (!wishData) {
      const e = new Error("找不到該筆願望清單資料");
      e.status = 404;
      return next(e);
    }

    const newVinyl = new Vinyl({
      album: wishData.album,
      artist: wishData.artist,
      notes: wishData.notes,
      year: wishData.year,
      version: wishData.version,
      coverUrl: wishData.coverUrl,
      albumRating: 1,
    });
    await newVinyl.save();
    await WishList.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "移動到Vinyl", data: newVinyl });
  } catch (e) {
    next(e);
  }
};

//刪除
export const deleteWishListData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteData = await WishList.findByIdAndDelete(id);
    if (!deleteData) {
      const e = new Error("找不到該願望資料的 ID，無法刪除");
      e.status = 404;
      return next(e);
    }
    res.status(200).json({ message: `deleteData: ${id}` });
  } catch (e) {
    next(e);
  }
};

//統計
export const fetchStatsWL = async (req, res, next) => {
  try {
    const total = await WishList.countDocuments();
    const genreDistribution = await WishList.aggregate([
      { $unwind: "$genre" },
      { $match: { genre: { $in: GENRES } } },
      {
        $group: {
          _id: "$genre",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          genreName: "$_id",
          count: 1,
        },
      },
    ]);

    const eraDistribution = await WishList.aggregate([
      {
        $project: {
          era: {
            $concat: [
              {
                $toString: {
                  $multiply: [
                    { $floor: { $divide: [{ $toInt: "$year" }, 10] } },
                    10,
                  ],
                },
              },
              "s",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$era",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          era: "$_id",
          count: 1,
        },
      },
      { $sort: { era: 1 } }, // 按年代順序排序 (1970s -> 1980s)
    ]);
    res.json({
      total,
      genreDistribution,
      eraDistribution,
    });
  } catch (e) {
    next(e);
  }
};
