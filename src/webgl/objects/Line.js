import * as THREE from "three";
import AudioController from "../../utils/AudioController";

export default class Line {
  constructor() {
    this.colors = [
      0xff0000, 0xffaa00, 0xffff00, 0xaaff00, 0x00ff00, 0x00ffaa, 0x00ffff,
      0x00aaff, 0x0000ff,
    ];

    this.group = new THREE.Group();

    this.geometry = new THREE.BoxGeometry(0.5, 1, 1);

    for (let i = 0; i < 256; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: this.colors[Math.floor(i / (256 / this.colors.length))],
      });
      const mesh = new THREE.Mesh(this.geometry, material);
      mesh.position.x = i * 0.5 - 128 * 0.5;
      this.group.add(mesh);
    }

    console.log(this.group);
  }

  tick() {
    this.group.children.map((cube, index) => {
      return (cube.scale.y = AudioController.fdata[index] * 0.5);
    });
  }
}
