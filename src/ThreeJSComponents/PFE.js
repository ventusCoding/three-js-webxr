import * as THREE from "three";
import { VRBTN } from "./VRBTN";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { LoadingBar } from "./LoadingBar.js";
// import CANNON from "cannon";
import { threeToCannon, ShapeType } from "three-to-cannon";
import { JoyStick } from "./Toon3D.js";
import { CanvasUI } from "./CanvasUI.js";

class PFE {
  constructor(app) {
    const container = document.createElement("div");
    app.appendChild(container);

    // this.world = new CANNON.World({
    //   gravity: new CANNON.Vec3(0, 0, -9.82), // m/s²
    // });

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      500
    );
    this.camera.position.set(0, 1.6, 0);

    this.dolly = new THREE.Object3D();

    // this.dolly = new CANNON.Body({
    //   mass: 5, // kg
    //   position: new CANNON.Vec3(0, 0, 10), // m
    //   shape: new CANNON.Sphere(1),
    // });
    // this.world.addBody(this.dolly);

    this.dolly.position.set(0, 0, 10);
    this.dolly.add(this.camera);
    this.dummyCam = new THREE.Object3D();
    this.camera.add(this.dummyCam);

    this.scene = new THREE.Scene();
    this.scene.add(this.dolly);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.8);
    this.scene.add(ambient);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);
    this.setEnvironment();

    this.clock = new THREE.Clock();
    this.up = new THREE.Vector3(0, 1, 0);
    this.origin = new THREE.Vector3();
    this.workingVec3 = new THREE.Vector3();
    this.workingQuaternion = new THREE.Quaternion();
    this.raycaster = new THREE.Raycaster();

    //TODO: RAJA3 HEDHOM
    // this.loadingBar = new LoadingBar();
    // this.loadModel();

    this.setupXR();
    //TODO: RAJA3 HEDHOM
    this.initScene();
    this.createUI();

    const self = this;
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setEnvironment() {
    const loader = new RGBELoader().setDataType(THREE.UnsignedByteType);
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const self = this;

    // loader.load( './venice_sunset_1k.hdr', ( texture ) => {
    // //   const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
    // //   pmremGenerator.dispose();

    // //   self.scene.environment = envMap;
    // console.log('pass');

    // }, undefined, (err)=>{
    //     console.log(err);
    //     console.error( 'An error occurred setting the environment');
    // } );
  }

  createUI() {
    this.ui = new CanvasUI();
    this.ui.updateElement("body", "Hello World");
  }

  initScene() {
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 50, 100);

    // ground
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(200, 200),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);

    var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);

    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshPhongMaterial({ color: "#008B8B" });
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
    );

    this.colliders = [];
  }

  loadModel() {
    const loader = new FBXLoader().setPath("./");

    const self = this;

    loader.load(
      // resource URL
      "model1.fbx",
      // called when the resource is loaded
      function (fbx) {
        // fbx.scale.set(self.dolly.scale.x * 0.1,self.dolly.scale.y * 0.1,self.dolly.scale.z * 0.1);

        // const result = threeToCannon(fbx, { type: ShapeType.MESH });

        // var sphereBody = new CANNON.Body({
        //   mass: 5, // kg
        //   position: new CANNON.Vec3(0, 0, 10), // m
        //   shape: result.shape,
        // });
        // self.world.addBody(sphereBody);

        // console.log(fbx.scale);

        fbx.rotation.z = (90 * Math.PI) / 180;
        fbx.rotation.x = (-90 * Math.PI) / 180;
        self.scene.add(fbx);

        // const light = new THREE.PointLight("#fff", 1, 100);
        // light.position.set(fbx.position.x, fbx.position.y + 2, fbx.position.z);
        // self.scene.add(light);

        self.loadingBar.visible = false;
        self.setupXR();
      },
      // called while loading is progressing
      function (xhr) {
        self.loadingBar.progress = xhr.loaded / xhr.total;
        console.log(xhr.loaded / xhr.total);
      },
      // called when loading has errors
      function (error) {
        console.log(error);
        console.log("An error happened");
      }
    );
  }

  onMove(forward, turn) {
    console.log(forward, turn);
    if (this.dolly) {
      this.dolly.userData.forward = forward;
      this.dolly.userData.turn = -turn;
    }
  }

  setupXR() {
    this.renderer.xr.enabled = true;

    const self = this;
    console.log("TESTaaa");
    function vrStatus(available) {
      console.log("TEST");
      if (available) {
        console.log("VR is available");
        function onSelectStart(event) {
          this.userData.selectPressed = true;
        }

        function onSelectEnd(event) {
          this.userData.selectPressed = false;
        }

        self.controllers = self.buildControllers(self.dolly);

        self.controllers.forEach((controller) => {
          controller.addEventListener("selectstart", onSelectStart);
          controller.addEventListener("selectend", onSelectEnd);
          

        });
      } else {
        console.log("VR not available");
        self.joystick = new JoyStick({
          onMove: self.onMove.bind(self),
        });
      }
    }

    function onSessionStart() {
      self.ui.mesh.position.set(0, 1.5, 9);
      self.camera.attach(self.ui.mesh);
    }

    function onSessionEnd() {
      self.camera.remove(self.ui.mesh);
    }

    const btn = new VRBTN(
      this.renderer,
      { vrStatus,onSessionStart, onSessionEnd },
    );

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  buildControllers(parent = this.scene) {
    const controllerModelFactory = new XRControllerModelFactory();

    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]);

    const line = new THREE.Line(geometry);
    line.scale.z = 0;

    const controllers = [];

    for (let i = 0; i <= 1; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.add(line.clone());
      controller.userData.selectPressed = false;
      parent.add(controller);
      controllers.push(controller);

      const grip = this.renderer.xr.getControllerGrip(i);
      grip.add(controllerModelFactory.createControllerModel(grip));
      parent.add(grip);
    }

    return controllers;
  }

  moveDolly(dt) {
    const speed = 2;
    let pos = this.dolly.position.clone();
    pos.y += 1;

    let dir = new THREE.Vector3();

    //Store original dolly rotation
    const quaternion = this.dolly.quaternion.clone();

    if (this.joystick === undefined) {
      //Get rotation for movement from the headset pose
      this.dolly.quaternion.copy(
        this.dummyCam.getWorldQuaternion(this.workingQuaternion)
      );
      this.dolly.getWorldDirection(dir);
      dir.negate();
    } else {
      this.dolly.getWorldDirection(dir);
      if (this.dolly.userData.forward > 0) {
        dir.negate();
      } else {
        dt = -dt;
      }
    }

    this.dolly.translateZ(-dt * speed);
    pos = this.dolly.getWorldPosition(this.origin);

    //Restore the original rotation
    this.dolly.quaternion.copy(quaternion);
  }

  get selectPressed() {
    return (
      this.controllers !== undefined &&
      (this.controllers[0].userData.selectPressed ||
        this.controllers[1].userData.selectPressed)
    );
  }

  render(timestamp, frame) {
    const dt = this.clock.getDelta();

    // this.world.fixedStep();

    let moved = false;

    if (this.renderer.xr.isPresenting) {
      this.ui.update();
      // this.ui.updateElement("body", String(JSON.stringify(this.dolly.position)) );
      console.log(this.dolly.position);
      if (this.selectPressed) {
        this.moveDolly(dt);
      }
    }

    if (this.joystick !== undefined) {
      if (this.dolly.userData.forward !== undefined) {
        if (this.dolly.userData.forward != 0) {
          this.moveDolly(dt);
          moved = true;
        }
        this.dolly.rotateY(this.dolly.userData.turn * dt);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

export { PFE };
