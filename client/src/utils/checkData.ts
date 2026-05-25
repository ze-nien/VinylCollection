export interface ICoverableVinyl {
  _id?: string;
  album: string;
  artist: string;
  version: string;
}

export type CheckDuplicateResult =
  | { type: "SAFE" }
  | { type: "ABSOLUTE_DUPLICATE" }
  | { type: "VERSION_DIFFERENT" };

export const checkVinylDuplicate = <T extends ICoverableVinyl>(
  currentId: string | null, // 當前正在編輯的 ID（新增模式傳 null）
  data: ICoverableVinyl, // 表單填寫的最新資料
  list: T[], // Zustand 裡的全體黑膠清單
) => {
  const inputAlbum = data.album.trim().toLowerCase();
  const inputArtist = data.artist.trim().toLowerCase();
  const inputVersion = data.version?.trim().toLowerCase() || "standard";
  //名字相同 但_id不是自己的其他黑膠
  const matchedList = list.filter((item) => {
    const isNameMatch =
      item.album.trim().toLowerCase() === inputAlbum &&
      item.artist.trim().toLowerCase() === inputArtist;
    const isMyself = currentId !== null && item._id === currentId;
    return isNameMatch && !isMyself;
  });
  //沒撞名安全放行
  if (matchedList.length === 0) return { type: "SAFE" as const };

  //名字相同 比對版本
  const matchedVersionItem = matchedList.find(
    (item) =>
      (item.version?.trim().toLowerCase() || "standard") === inputVersion,
  );
  if (matchedVersionItem) {
    //歌手 + 專輯 + 版本 全相同
    return { type: "ABSOLUTE_DUPLICATE" as const };
  }
  // 名字相同 版本不同
  return { type: "VERSION_DIFFERENT" as const };
};
