import s from "./Picker.module.scss";
import Scene from "../../webgl/Scene";

const Picker = () => {
  const pickVisualizer = (index) => {
    Scene.changeVisualizer(index);
  };

  return (
    <div className={s.picker}>
      <div
        onClick={() => {
          pickVisualizer("cube");
        }}
      >
        Cube
      </div>
      <div
        onClick={() => {
          pickVisualizer("line");
        }}
      >
        Line
      </div>
      <div
        onClick={() => {
          pickVisualizer("logo");
        }}
      >
        Logo IUT
      </div>
    </div>
  );
};

export default Picker;
