import { useEffect, useState } from "react";
import Default from "../images/DEFAULT.jpg";

const CoverReview = ({ url }: { url: string }) => {
  const [displaySrc, setDisplaySrc] = useState(Default);

  useEffect(() => {
    const img = new Image();

    img.onload = () => setDisplaySrc(url);
    img.onerror = () => setDisplaySrc(Default); // 失敗時顯示預設圖
    img.src = url;
  }, [url]);

  return (
    <div className="w-36 h-36 rounded-lg p-2">
      <img
        src={displaySrc}
        alt="Vinyl Cover Preview"
        className="w-full h-full object-cover rounded"
        onError={(e) => {
          e.currentTarget.onerror = null;
          (e.currentTarget as HTMLImageElement).src = Default;
        }}
      />
    </div>
  );
};

export default CoverReview;
