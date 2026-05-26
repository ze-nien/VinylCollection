import { useState, useLayoutEffect, useRef } from "react";

export function useLineClamp(dependencies: readonly unknown[]) {
  const [isClamped, setIsClamped] = useState(false);
  const elementRef = useRef<HTMLHeadingElement>(null);

  // 在瀏覽器繪製畫面、可能破圖前就計算完畢
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 建立現代原生監聽器，只監控這個元件本身的尺寸
    const resizeObserver = new ResizeObserver(() => {
      const { scrollHeight, clientHeight } = element;
      setIsClamped(scrollHeight > clientHeight);
    });

    // 開始監聽
    resizeObserver.observe(element);

    // 清理機制 瀏覽器自動釋放
    return () => {
      resizeObserver.disconnect();
    };
  }, [dependencies]); //內容改變時重新計算

  return { elementRef, isClamped };
}
