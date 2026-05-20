import axios from "axios";
import WishList from "../models/WishList.js";
import Vinyl from "../models/Vinyl.js";

//所有資料
export const getWishList = async (req, res, next) => {
  try {
    const wishList = await WishList.find().sort({ createdAt: -1 });
    res.status(200).json({
      data: wishList,
    });
  } catch (e) {
    next(e);
  }
};

//新增
export const createWishListData = async (req, res, next) => {
  try {
    const { album, artist, notes, isAcquired } = req.body;
    const newWishListData = await WishList.create({
      album,
      artist,
      notes,
      isAcquired,
    });
    res.status(200).json(newWishListData);
  } catch (e) {
    next(e);
  }
};

//更新狀態
export const updateWishListDataStatus = async (req, res, next) => {
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
