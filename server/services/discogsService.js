import axios from "axios";

export const fetchVinylVersion = async (artist, album) => {
  try {
    if (!artist || !album) return "none";
    const discogsResponse = await axios.get(
      `https://api.discogs.com/database/search`,
      {
        params: {
          artist: artist.trim(),
          release_title: album.trim(),
          type: "release",
          format: "Vinyl",
        },
        headers: {
          Authorization: `Discogs token=${process.env.DISCOGS_KEY}`,
          "User-Agent": "MyVinylCollectionApp/1.0.0",
        },
      },
    );
    if (discogsResponse.data.results) {
      discogsResponse.data.results.map((d) => {
        console.log(
          `
          type: ${d.type}
          id: ${d.id}
          catno: ${d.catno}
          country: ${d.country}
          year: ${d.year}
          brand: ${d.label[0]}
          format: ${d.format}
          discription: ${d.formats[0].text}
          cover: ${d.cover_image}
          `,
        );
      });
    }
    return "1";
  } catch (e) {
    return "none";
  }
};
