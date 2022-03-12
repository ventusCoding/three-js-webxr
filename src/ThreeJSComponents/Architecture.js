import * as THREE from "three";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VRBTN } from "./VRBTN";
import Stats from "three/examples/jsm/libs/stats.module";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

class Architecture {
  constructor(app) {
    const container = document.createElement("div");
    app.appendChild(container);

    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    this.camera.position.set(0, 1.6, 5);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x505050);

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x404040));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1.6, 0);
    this.controls.update();

    this.stats = new Stats();

    this.raycaster = new THREE.Raycaster();
    this.workingMatrix = new THREE.Matrix4();
    this.workingVector = new THREE.Vector3();
    this.origin = new THREE.Vector3();

    this.loadGLTF();

    this.initScene();


    window.addEventListener("resize", this.resize.bind(this));

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  random(min, max) {
    return Math.random() * (max - min) + min;
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

  loadGLTF() {
    // const loader = new GLTFLoader().setPath("./");

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
    ); // use a full url path

    const loader = new GLTFLoader().setPath("./");
    loader.setDRACOLoader(dracoLoader);

    const self = this;

    // Load a glTF resource
    loader.load(
      // resource URL
      "house.FBX",
      // called when the resource is loaded
      function (gltf) {
        const college = gltf.scene.children[0];
        console.log(gltf);
        self.scene.add( college );
        
        college.traverse(function (child) {
            if (child.isMesh){
                if (child.name.indexOf("PROXY")!=-1){
                    child.material.visible = false;
                    self.proxy = child;
                }else if (child.material.name.indexOf('Glass')!=-1){
                    child.material.opacity = 0.1;
                    child.material.transparent = true;
                }else if (child.material.name.indexOf("SkyBox")!=-1){
                    const mat1 = child.material;
                    const mat2 = new THREE.MeshBasicMaterial({map: mat1.map});
                    child.material = mat2;
                    mat1.dispose();
                }
            }
        });

        
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log(error);
        console.log("An error happened");
      }
    );
    self.setupVR();
  }

  setupVR() {
    this.renderer.xr.enabled = true;

    const button = new VRBTN(this.renderer);

    const self = this;

    function onSelectStart() {
      this.userData.selectPressed = true;
    }

    function onSelectEnd() {
      this.userData.selectPressed = false;
    }

    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener("selectstart", onSelectStart);
    this.controller.addEventListener("selectend", onSelectEnd);
    this.controller.addEventListener("connected", function (event) {
      const mesh = self.buildController.call(self, event.data);
      mesh.scale.z = 0;
      this.add(mesh);
    });
    this.controller.addEventListener("disconnected", function () {
      this.remove(this.children[0]);
      self.controller = null;
      self.controllerGrip = null;
    });
    this.scene.add(this.controller);

    const controllerModelFactory = new XRControllerModelFactory();

    this.controllerGrip = this.renderer.xr.getControllerGrip(0);
    this.controllerGrip.add(
      controllerModelFactory.createControllerModel(this.controllerGrip)
    );
    this.scene.add(this.controllerGrip);

    this.dolly = new THREE.Object3D();
    this.dolly.position.z = 5;
    this.dolly.add(this.camera);
    this.scene.add(this.dolly);

    this.dummyCam = new THREE.Object3D();
    this.camera.add(this.dummyCam);
  }

  buildController(data) {
    let geometry, material;

    // eslint-disable-next-line default-case
    switch (data.targetRayMode) {
      case "tracked-pointer":
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
        );
        geometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3)
        );

        material = new THREE.LineBasicMaterial({
          vertexColors: true,
          blending: THREE.AdditiveBlending,
        });

        return new THREE.Line(geometry, material);

      case "gaze":
        geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(
          0,
          0,
          -1
        );
        material = new THREE.MeshBasicMaterial({
          opacity: 0.5,
          transparent: true,
        });
        return new THREE.Mesh(geometry, material);
    }
  }

  handleController(controller, dt) {

    if (controller.userData.selectPressed) {
   
        if (this.proxy === undefined) return;

      const wallLimit = 1.3;
      const speed = 2;
      let pos = this.dolly.position.clone();
      pos.y += 1;

      let dir = new THREE.Vector3();
      //Store original dolly rotation
      const quaternion = this.dolly.quaternion.clone();
      //Get rotation for movement from the headset pose

      // this.dolly.quaternion.copy(this.dummyCam.getWorldQuaternion(new THREE.Quaternion()));
      this.dummyCam.getWorldQuaternion(this.dolly.quaternion);

      this.dolly.getWorldDirection(dir);
      dir.negate();
      this.raycaster.set(pos, dir);

      let blocked = false;

      let intersect = this.raycaster.intersectObjects(this.proxy);
      if (intersect.length > 0) {
        if (intersect[0].distance < wallLimit) blocked = true;
      }

      if (!blocked) {
        this.dolly.translateZ(-dt * speed);
        pos = this.dolly.getWorldPosition(this.origin);
      }

      //cast left
      dir.set(-1, 0, 0);
      dir.applyMatrix4(this.dolly.matrix);
      dir.normalize();
      this.raycaster.set(pos, dir);

      intersect = this.raycaster.intersectObjects(this.proxy);
      if (intersect.length > 0) {
        if (intersect[0].distance < wallLimit)
          this.dolly.translateX(wallLimit - intersect[0].distance);
      }

      //cast right
      dir.set(1, 0, 0);
      dir.applyMatrix4(this.dolly.matrix);
      dir.normalize();
      this.raycaster.set(pos, dir);

      intersect = this.raycaster.intersectObjects(this.proxy);
      if (intersect.length > 0) {
        if (intersect[0].distance < wallLimit)
          this.dolly.translateX(intersect[0].distance - wallLimit);
      }

      //   this.dolly.position.y = 0;

      //Restore the original rotation
      this.dolly.quaternion.copy(quaternion);
    }
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    const dt = this.clock.getDelta();
    this.stats.update();
    if (this.controller) this.handleController(this.controller, dt);
    this.renderer.render(this.scene, this.camera);
  }
}

export { Architecture };