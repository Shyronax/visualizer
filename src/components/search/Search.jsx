import s from "./Search.module.scss";
import fetchJsonp from "fetch-jsonp";
import { useState, useEffect } from "react";
import useCustomStore from "../../customStore";
import AudioController from "../../utils/AudioController";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

const Search = () => {
  const [artist, setArtist] = useState("");
  const setSongs = useCustomStore((state) => state.setSongs);

  const onDrop = useCallback(
    (audio) => {
      console.log("dropped", audio);
      const src = URL.createObjectURL(audio[0]);

      const audioObject = {
        title: audio[0].name,
        album: {
          cover_small: "",
        },
        preview: src,
      };

      setSongs([audioObject]);
      console.log(audioObject);
    },
    [setSongs]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      "audio/mpeg": [".mp3"],
    },
  });

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

  console.log(isDragActive);

  return (
    <div className={s.searchWrapper} {...getRootProps()}>
      <input
        type="text"
        className={s.searchInput}
        value={artist}
        onKeyDown={onKeyDown}
        onChange={(e) => setArtist(e.target.value)}
      />

      {isDragActive && <input className={s.inputDropzone} {...getInputProps} />}
    </div>
  );
};

export default Search;
