import axios from "axios";
import Vinyl from "../models/Vinyl.js";
import { fetchAlbumCover } from "../services/lastFmService.js";

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
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit); //跳過資料數
    let query = {}; //初始化查詢物件
    if (genre) query.genre = { $in: genre.split(",") }; // $in包含(mongoDB語法)
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
    const { album, artist, genre, year, albumRating, notes } = req.body;
    // console.log(req.body);

    const fetchCoverUrl = await fetchAlbumCover(artist, album);
    const coverUrl =
      fetchCoverUrl === "none" ? "/images/DEFAULT.jpg" : fetchCoverUrl;
    const newVinyl = await Vinyl.create({
      album,
      artist,
      genre,
      coverUrl,
      year,
      albumRating,
      notes,
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
      console.log(`search result: ${vinyl}`);
      res.status(200).json(vinyl);
    } else {
      {
        const error = new Error("找不到該黑膠唱片的 ID");
        res.statusCode = 404;
        return next(error);
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
    const { artist, album } = updateData;
    const fetchCoverUrl = await fetchAlbumCover(artist, album);
    const coverUrl =
      fetchCoverUrl === "none" ? "/images/DEFAULT.jpg" : fetchCoverUrl;

    const newData = await Vinyl.findByIdAndUpdate(
      id,
      { ...updateData, coverUrl },
      {
        runVaildators: true,
      },
    );
    if (!newData) {
      const error = new Error("找不到該黑膠唱片的 ID，無法編輯");
      res.statusCode = 404;
      return next(error);
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
      const error = new Error("找不到該黑膠唱片的 ID，無法刪除");
      res.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ message: `deleteData: ${id}` });
  } catch (e) {
    next(e);
  }
};

//資料統計GET('api/vinyls/stats')
