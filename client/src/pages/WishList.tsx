import { useAuthStore } from "../store/authStore";

const WishList = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const data = [
    { id: "data001", album: "test1", artist: "test12", notes: "notes1998 bv" },
    {
      id: "data002",
      album: "test2",
      artist: "test223",
      notes:
        "notes1978fasdfsadjfsajdfl;asdjlfasdfsafskfjasdlkjfk;dklfjsalkdfjls;akjflbverjsadlfkjsadklsadl;kjfls;adjfl;sadkj",
    },
  ];
  return (
    <div className="flex flex-col items-center">
      {/* 新增 */}
      {isAuthenticated && (
        <div className="ml-10 mr-10 mb-5 grid grid-cols-1 md:grid-cols-3 md:ml-5 md:mr-5 gap-2">
          <div className="flex flex-col">
            <label htmlFor="album">Album: </label>
            <input
              type="text"
              id="album"
              name="album"
              className="h-8 text-secondary rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="artist">Artist: </label>
            <input
              type="text"
              id="artist"
              name="artist"
              className="h-8 text-secondary rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="notes">Notes: </label>
            <input
              type="text"
              id="notes"
              name="notes"
              className="h-8 text-secondary rounded-md"
            />
          </div>
          <button
            className="text-primary bg-secondary h-full w-12  font-semibold rounded-sm 
      hover:cursor-pointer hover:bg-primary hover:text-secondary transition"
          >
            Add
          </button>
        </div>
      )}

      {/* 現有 */}
      <div className="flex flex-col px-5 w-full gap-3">
        {data &&
          data.map((d) => (
            <div
              key={d.id}
              className={`grid ${isAuthenticated ? "grid-cols-2" : "grid-cols-1"} border border-white`}
            >
              <div className="p-2 flex gap-5 items-center">
                <h4 className="text-lg">{d.album}</h4>
                <h5 className="">{d.artist}</h5>
                <h6 className="text-sm break-all">{d.notes}</h6>
              </div>
              {isAuthenticated && (
                <div className="flex gap-2 justify-end pr-2">
                  <button className="rounded-xs text-white hover:cursor-pointer hover:text-primary transition">
                    Purchased
                  </button>
                  <button className="text-red-200 hover:text-red-400 cursor-pointer transition-colors">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default WishList;
