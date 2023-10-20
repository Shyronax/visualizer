import Canvas from "./components/canvas/Canvas";
import Search from "./components/search/Search";
import Picker from "./components/picker/Picker";
import Song from "./components/song/Song";
import useCustomStore from "./customStore";
import s from "./App.module.scss";

const App = () => {
  const songs = useCustomStore((state) => state.songs);

  return (
    <div className="App">
      <div className={s.songs}>
        {songs.map((song, key) => {
          return <Song key={key} data={song} />;
        })}
      </div>
      <Canvas></Canvas>
      <Search></Search>
      <Picker></Picker>
    </div>
  );
};

export default App;
