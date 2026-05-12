const CoverReview = ({ url }: { url: string }) => {
  // const [displaySrc, setDisplaySrc] = useState(Default);
  console.log(url);
  // useEffect(() => {
  //   const getCover = async () => {
  //     const data = await fetchCover(artist, album);
  //     setDisplaySrc(data);
  //   };
  //   if (artist && album) {
  //     getCover();
  //   }
  // }, [artist, album]);

  return (
    <div className="w-36 h-36 rounded-lg p-2">
      <img
        src={url === "none" ? Default : url}
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
