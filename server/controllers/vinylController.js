import axios from "axios";
import Vinyl from "../models/Vinyl.js";
import { fetchAlbumCover } from "../services/lastFmService.js";

//所有資料GET('api/vinyls')
export const getAllVinyls = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [vinyls, total] = await Promise.all([
      Vinyl.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Vinyl.countDocuments(),
    ]);
    res.status(200).json({
      data: vinyls,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
    // const vinyls = await Vinyl.find().sort({ createdAt: -1 });
    // res.status(200).json(vinyls);
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
