import axios from "axios";
import Vinyl from "../models/Vinyl.js";
import { GENRES } from "../types/constants.js";
import {
  fetchAlbumCover,
  fetchLastFmRecommendations,
  getCleanRecommendations,
} from "../services/lastFmService.js";
import { getAllVinylsSchema } from "../schemas/vinyl.js";
import { fetchVinylVersion } from "../services/discogsService.js";

//所有資料GET('api/vinyls')
export const getAllVinyls = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort,
      genre,
      yearRange,
      minAlbumRating,
    } = getAllVinylsSchema.shape.query.parse(req.query);

    const skip = (Number(page) - 1) * Number(limit); //跳過資料數
    let query = {}; //初始化查詢物件
    // $in包含(mongoDB語法)
    if (genre) {
      const genreArray = genre.split(",");
      if (genreArray.includes("uncategorized")) {
        query.$or = [
          //過濾uncategorized名稱的假類別(genre沒有此類別)
          { genre: { $in: genreArray.filter((g) => g !== "uncategorized") } },
          //加入uncategorized的類別(沒有設定genre的空字串)
          { genre: { $size: 0 } },
        ];
      } else {
        query.genre = { $in: genre.split(",") };
      }
    }
    // $gte大於等於 $lte小於等於 (mongoDB語法)
    if (yearRange && yearRange.endsWith("s") && yearRange !== "All") {
      const decade = parseInt(yearRange);
      //1950 - 2049
      const fullYear = decade >= 50 ? 1900 + decade : 2000 + decade;
      query.year = {
        $gte: fullYear,
        $lte: fullYear + 9,
      };
    }
    if (minAlbumRating && minAlbumRating !== "All")
      query.albumRating = { $gte: Number(minAlbumRating) };
    let sortOrder = { createdAt: -1 };
    if (sort === "asc") sortOrder = { artist: 1 };
    if (sort === "desc") sortOrder = { artist: -1 };

    //兩個對資料庫的請求，同時（並行）發送出去->使用 Promise.all
    const [vinyls, total] = await Promise.all([
      Vinyl.find(query).sort(sortOrder).skip(skip).limit(limit),
      Vinyl.countDocuments(query),
    ]);
    res.status(200).json({
      data: vinyls,
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

//新增資料POST('api/vinyls')
export const createVinyl = async (req, res, next) => {
  try {
    const { album, artist, genre, year, albumRating, notes, version } =
      req.body;
    const { imageUrl: fetchCoverUrl, sourceUrl: fetchCoverSource } =
      await fetchAlbumCover(artist, album);
    const coverUrl =
      fetchCoverUrl === "none" ? "/images/DEFAULT.jpg" : fetchCoverUrl;
    const coverSource = fetchCoverSource || "";
    const finalVersion = version === "" ? "Standard" : version;
    const newVinyl = await Vinyl.create({
      album,
      artist,
      genre,
      coverUrl,
      coverSource,
      year,
      albumRating,
      notes,
      version: finalVersion,
    });
    res.status(200).json(newVinyl);
  } catch (e) {
    next(e);
  }
};

//單一資料GET('api/vinyls/:id')
export const getVinyl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vinyl = await Vinyl.findById(id).exec();
    if (vinyl) {
      // const a = await fetchVinylVersion(vinyl.artist, vinyl.album);
      // console.log(a);
      // console.log(`search result: ${vinyl}`);
      res.status(200).json(vinyl);
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

//編輯單一PATCH('api/vinyls/:id')
export const editVinyl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { artist, album, version } = updateData;
    const { imageUrl: fetchCoverUrl, sourceUrl: fetchCoverSource } =
      await fetchAlbumCover(artist, album);
    const coverUrl =
      fetchCoverUrl === "none" ? "/images/DEFAULT.jpg" : fetchCoverUrl;
    const coverSource = fetchCoverSource || "";
    const finalVersion = version === "" ? "Standard" : version;
    const newData = await Vinyl.findByIdAndUpdate(
      id,
      { ...updateData, coverUrl, coverSource, version: finalVersion },
      {
        runVaildators: true,
      },
    );
    if (!newData) {
      const e = new Error("找不到該黑膠唱片的 ID，無法編輯");
      e.status = 404;
      return next(e);
    }
    res.status(200).json({ message: `updateData: ${newData}` });
  } catch (e) {
    next(e);
  }
};

//刪除單一DELETE('api/vinyls/:id')
export const deleteVinyl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteData = await Vinyl.findByIdAndDelete(id);
    if (!deleteData) {
      const e = new Error("找不到該黑膠唱片的 ID，無法刪除");
      e.status = 404;
      return next(e);
    }
    res.status(200).json({ message: `deleteData: ${id}` });
  } catch (e) {
    next(e);
  }
};

//資料統計GET('api/vinyls/stats')
export const fetchStats = async (req, res, next) => {
  try {
    const total = await Vinyl.countDocuments();
    const genreDistribution = await Vinyl.aggregate([
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

    const eraDistribution = await Vinyl.aggregate([
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
    const topGenres = genreDistribution
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((g) => g.genreName);

    const userVinyls = await Vinyl.find().select("album artist");
    const recommend = await getCleanRecommendations(topGenres, userVinyls);
    res.json({
      total,
      genreDistribution,
      eraDistribution,
      recommend,
    });
  } catch (e) {
    next(e);
  }
};
