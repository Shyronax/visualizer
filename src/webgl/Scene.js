import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import pane from "../utils/Pane";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as THREE from "three";
import { gsap } from "gsap";
import Line from "./objects/Line";
import Cube from "./objects/Cube";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Logo from "./objects/LogoIut";

class SCENE {
  setup(canvas) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = canvas;

    this.setupScene();
    this.setupCamera();
    this.setupControls();
    this.setupStats();
    this.setupRenderer();
    this.setupPostProcessing();
    this.setupGLTFLoader();

    this.addObjects();
    this.addEvents();
  }

  setupGLTFLoader() {
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.load("/logo-iut.glb", (logo) => {});
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      28,
      this.width / this.height,
      0.1,
      10000
    );
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: false,
      // alpha: true
    });

    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer.setClearColor(0x000000);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setupPostProcessing() {
    this.BLOOM_PARAMS = {
      strength: 1,
      radius: 0,
      threshold: 0,
    };
    this.composer = new EffectComposer(this.renderer);
    this.scenePass = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width / this.height),
      this.BLOOM_PARAMS.strength,
      this.BLOOM_PARAMS.radius,
      this.BLOOM_PARAMS.threshold
    );

    this.composer.addPass(this.scenePass);

    this.composer.addPass(this.bloomPass);

    this.postProcessFolder = pane.addFolder({
      title: "Post Process",
    });

    this.postProcessFolder
      .addBinding(this.BLOOM_PARAMS, "strength", {
        min: 0,
        max: 10,
        step: 0.1,
      })
      .on("change", (e) => {
        this.bloomPass.strength = e.value;
      });

    this.postProcessFolder
      .addBinding(this.BLOOM_PARAMS, "radius", {
        min: 0,
        max: 10,
        step: 0.1,
      })
      .on("change", (e) => {
        this.bloomPass.radius = e.value;
      });

    this.postProcessFolder
      .addBinding(this.BLOOM_PARAMS, "threshold", {
        min: 0,
        max: 10,
        step: 0.1,
      })
      .on("change", (e) => {
        this.bloomPass.threshold = e.value;
      });
  }

  addEvents() {
    gsap.ticker.add(this.tick);
    window.addEventListener("resize", () => {
      this.resize();
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  addObjects() {
    this.cube = new Cube();
    this.line = new Line();
    this.logoIut = new Logo();

    this.selectedObject = this.cube;
    this.scene.add(this.selectedObject.group);
  }

  changeVisualizer(index) {
    this.scene.remove(this.selectedObject.group);
    switch (index) {
      case "cube":
        this.selectedObject = this.cube;
        this.camera.position.z = 1000;
        break;

      case "line":
        this.selectedObject = this.line;
        this.camera.position.z = 450;
        break;

      case "logo":
        this.selectedObject = this.logoIut;
        this.camera.position.z = 20;
        break;

      default:
        break;
    }
    this.scene.add(this.selectedObject.group);
    console.log(index);
  }

  tick = (time, deltaTime, frame) => {
    this.stats.begin();
    this.selectedObject.tick(deltaTime);
    this.composer.render();
    this.stats.end();
  };
}

const Scene = new SCENE();
export default Scene;
