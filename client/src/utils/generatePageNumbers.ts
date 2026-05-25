export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
) => {
  const pages: (number | string)[] = [];

  // 總頁數小於等於 5 頁時，直接全部顯示
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  // 永遠顯示第一頁
  pages.push(1);

  // 計算中間頁碼的起點與終點
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  // 靠前時的補齊調整
  if (currentPage <= 3) {
    endPage = 4;
  }
  // 靠後時的補齊調整
  if (currentPage >= totalPages - 2) {
    startPage = totalPages - 3;
  }

  // 判斷前方是否需要加省略號
  if (startPage > 2) {
    pages.push("... "); // 加空格與後方的 ... 做 key 的區隔
  } else if (startPage === 2) {
    // 雖然不需要省略號，但把漏掉的第 2 頁補上
  }

  // 渲染中間的數字按鈕
  for (let i = startPage; i <= endPage; i++) {
    if (!pages.includes(i)) pages.push(i);
  }

  // 判斷後方是否需要加省略號
  if (endPage < totalPages - 1) {
    pages.push(" ...");
  }

  // 永遠顯示最後一頁
  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
};
