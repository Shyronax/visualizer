import s from "./Search.module.scss";
import fetchJsonp from "fetch-jsonp";
import { useState, useEffect } from "react";
import useCustomStore from "../../customStore";
import AudioController from "../../utils/AudioController";

const Search = () => {
  const [artist, setArtist] = useState("");
  const setSongs = useCustomStore((state) => state.setSongs);

  useEffect(() => {
    AudioController.setup();
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value !== "") {
      getSongs();
    }
  };

  const getSongs = async () => {
    let response = await fetchJsonp(
      `https://api.deezer.com/search?q=${artist}&output=jsonp`
    );

    response = await response.json(response);

    console.log(response);

    setSongs(response.data.slice(0, 10));
    AudioController.ctx.resume();
  };

  return (
    <div className={s.searchWrapper}>
      <input
        type="text"
        onKeyDown={onKeyDown}
        onChange={(e) => setArtist(e.target.value)}
      />
    </div>
  );
};

export default Search;
