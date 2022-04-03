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
import {
  Constants as MotionControllerConstants,
  fetchProfile,
  MotionController,
} from "@webxr-input-profiles/motion-controllers";

import * as dat from "three/examples/jsm/libs/dat.gui.module";

const DEFAULT_PROFILES_PATH =
  "https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles";
const DEFAULT_PROFILE = "generic-trigger";

const array = [
  {
    name: "Architecture",
    childs: [
      {
        name: "Architecture Child 1",
      },
      {
        name: "Architecture Child 2",
      },
      {
        name: "Architecture Child 3",
      },
      {
        name: "Architecture Child 4",
      },
      {
        name: "Architecture Child 5",
      },
      {
        name: "Architecture Child 6",
      },
      {
        name: "Architecture Child 7",
      },
      // {
      //   name: "Architecture Child 8",
      // },
      // {
      //   name: "Architecture Child 9",
      // },
      // {
      //   name: "Architecture Child 10",
      // },
      // {
      //   name: "Architecture Child 11",
      // },
      // {
      //   name: "Architecture Child 12",
      // },
      // {
      //   name: "Architecture Child 13",
      // },
      // {
      //   name: "Architecture Child 14",
      // },
      // {
      //   name: "Architecture Child 15",
      // },
      // {
      //   name: "Architecture Child 16",
      // },
      // {
      //   name: "Architecture Child 17",
      // },
      // {
      //   name: "Architecture Child 18",
      // },
      // {
      //   name: "Architecture Child 19",
      // },
      // {
      //   name: "Architecture Child 20",
      // },
      // {
      //   name: "Architecture Child 21",
      // },
      // {
      //   name: "Architecture Child 22",
      // },
      // {
      //   name: "Architecture Child 23",
      // },
      // {
      //   name: "Architecture Child 24",
      // },
      // {
      //   name: "Architecture Child 25",
      // },
      // {
      //   name: "Architecture Child 26",
      // },
      // {
      //   name: "Architecture Child 27",
      // },
      // {
      //   name: "Architecture Child 28",
      // },
      // {
      //   name: "Architecture Child 29",
      // },
      // {
      //   name: "Architecture Child 30",
      // },
      // {
      //   name: "Architecture Child 31",
      // },
      // {
      //   name: "Architecture Child 32",
      // },
      // {
      //   name: "Architecture Child 33",
      // },
      // {
      //   name: "Architecture Child 34",
      // },
      // {
      //   name: "Architecture Child 35",
      // },
      // {
      //   name: "Architecture Child 36",
      // },
      // {
      //   name: "Architecture Child 37",
      // },
      // {
      //   name: "Architecture Child 38",
      // },
      // {
      //   name: "Architecture Child 39",
      // },
      // {
      //   name: "Architecture Child 40",
      // },
    ],
  },
  {
    name: "Structure",
    childs: [
      {
        name: "Structure Child 1",
      },
      {
        name: "Structure Child 2",
      },
      {
        name: "Structure Child 3",
      },
    ],
  },
  {
    name: "Fluide",
    childs: [
      {
        name: "Fluide Child 1",
      },
      {
        name: "Fluide Child 2",
      },
      {
        name: "Fluide Child 3",
      },
    ],
  },
  {
    name: "A1",
    childs: [
      {
        name: "A1 Child 1",
      },
      {
        name: "A1 Child 2",
      },
      {
        name: "A1 Child 3",
      },
    ],
  },
  {
    name: "A2",
    childs: [
      {
        name: "A2 Child 1",
      },
      {
        name: "A2 Child 2",
      },
      {
        name: "A2 Child 3",
      },
    ],
  },
  {
    name: "A3",
    childs: [
      {
        name: "A3 Child 1",
      },
      {
        name: "A3 Child 2",
      },
      {
        name: "A3 Child 3",
      },
    ],
  },
  {
    name: "A4",
    childs: [
      {
        name: "A4 Child 1",
      },
      {
        name: "A4 Child 2",
      },
      {
        name: "A4 Child 3",
      },
    ],
  },
  {
    name: "A5",
    childs: [
      {
        name: "A5 Child 1",
      },
      {
        name: "A5 Child 2",
      },
      {
        name: "A5 Child 3",
      },
    ],
  },
  {
    name: "A6",
    childs: [
      {
        name: "A6 Child 1",
      },
      {
        name: "A6 Child 2",
      },
      {
        name: "A6 Child 3",
      },
    ],
  },
  {
    name: "A7",
    childs: [
      {
        name: "A7 Child 1",
      },
      {
        name: "A7 Child 2",
      },
      {
        name: "A7 Child 3",
      },
    ],
  },
  {
    name: "A8",
    childs: [
      {
        name: "A8 Child 1",
      },
      {
        name: "A8 Child 2",
      },
      {
        name: "A8 Child 3",
      },
    ],
  },
  {
    name: "A9",
    childs: [
      {
        name: "A9 Child 1",
      },
      {
        name: "A9 Child 2",
      },
      {
        name: "A9 Child 3",
      },
    ],
  },
  {
    name: "A10",
    childs: [
      {
        name: "A10 Child 1",
      },
      {
        name: "A10 Child 2",
      },
      {
        name: "A10 Child 3",
      },
    ],
  },
  {
    name: "A11",
    childs: [
      {
        name: "A11 Child 1",
      },
      {
        name: "A11 Child 2",
      },
      {
        name: "A11 Child 3",
      },
    ],
  },
  {
    name: "A12",
    childs: [
      {
        name: "A12 Child 1",
      },
      {
        name: "A12 Child 2",
      },
      {
        name: "A12 Child 3",
      },
    ],
  },
  {
    name: "A13",
    childs: [
      {
        name: "A13 Child 1",
      },
      {
        name: "A13 Child 2",
      },
      {
        name: "A13 Child 3",
      },
    ],
  },
  {
    name: "A14",
    childs: [
      {
        name: "A14 Child 1",
      },
      {
        name: "A14 Child 2",
      },
      {
        name: "A14 Child 3",
      },
    ],
  },
  {
    name: "A15",
    childs: [
      {
        name: "A15 Child 1",
      },
      {
        name: "A15 Child 2",
      },
      {
        name: "A15 Child 3",
      },
    ],
  },
  {
    name: "A16",
    childs: [
      {
        name: "A16 Child 1",
      },
      {
        name: "A16 Child 2",
      },
      {
        name: "A16 Child 3",
      },
    ],
  },
  {
    name: "A17",
    childs: [
      {
        name: "A17 Child 1",
      },
      {
        name: "A17 Child 2",
      },
      {
        name: "A17 Child 3",
      },
    ],
  },
  {
    name: "A18",
    childs: [
      {
        name: "A18 Child 1",
      },
      {
        name: "A18 Child 2",
      },
      {
        name: "A18 Child 3",
      },
    ],
  },
  {
    name: "A19",
    childs: [
      {
        name: "A19 Child 1",
      },
      {
        name: "A19 Child 2",
      },
      {
        name: "A19 Child 3",
      },
    ],
  },
  {
    name: "A20",
    childs: [
      {
        name: "A20 Child 1",
      },
      {
        name: "A20 Child 2",
      },
      {
        name: "A20 Child 3",
      },
    ],
  },
  {
    name: "A21",
    childs: [
      {
        name: "A21 Child 1",
      },
      {
        name: "A21 Child 2",
      },
      {
        name: "A21 Child 3",
      },
    ],
  },
  {
    name: "A22",
    childs: [
      {
        name: "A22 Child 1",
      },
      {
        name: "A22 Child 2",
      },
      {
        name: "A22 Child 3",
      },
    ],
  },
  {
    name: "A23",
    childs: [
      {
        name: "A23 Child 1",
      },
      {
        name: "A23 Child 2",
      },
      {
        name: "A23 Child 3",
      },
    ],
  },
  {
    name: "A24",
    childs: [
      {
        name: "A24 Child 1",
      },
      {
        name: "A24 Child 2",
      },
      {
        name: "A24 Child 3",
      },
    ],
  },
];

class Thumb {
  constructor(app) {
    const container = document.createElement("a-scene");
    // container.setAttribute('vr-mode-ui',"enabled: false")
    app.appendChild(container);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      500
    );
    this.camera.position.set(0, 1.6, 0);

    this.dolly = new THREE.Object3D();

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
    // this.createDebugUI();
    this.createTestUI();

    const self = this;
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  //*********************** TODO: START ***********************/
  /* 
    1) create n elements in right and left ✅
    2) update the left (parent) elements with array values ✅
    3) change the right (child) elements with array values depends on the left (parent) elements ✅
    4) create pagination in the right and left elements ❌
  */

  createContentUI() {
    let name = "parent";
    let counter = 1;

    const self = this;

    const content = {};

    content.line = "";

    for (let i = 0; i < 14; i++) {
      content[`${name}${counter}Btn`] = "";
      content[`${name}${counter}Txt`] = ``;

      counter++;

      if (i === 6) {
        name = "child";
        counter = 1;
      }
    }

    return content;
  }

  createConfigUI() {
    const renderer = this.renderer;

    const config = {
      panelSize: {
        width: 1,
        height: 1,
      },
      width: 512,
      height: 512,
      opacity: 0.7,
    };

    config.line = {
      position: { top: 20, left: config.width / 2 },
      width: 1,
      height: config.height - 40,
      backgroundColor: "#fff",
    };

    let positionObj = { top: 10, left: 0 };
    let positionTxt = { top: positionObj.top + 9, left: 40 };

    let name = "parent";
    let counter = 1;

    for (let i = 0; i < 14; i++) {
      config[`${name}${counter}Btn`] = {
        type: "button",
        position: { ...positionObj },
        width: 64,
        height: 64,
        fontColor: "#46ff37",
        hover: "#b3d9b0",
        current: "",
        selected:false,
        objects: {},
        onSelect: () => {},
      };

      config[`${name}${counter}Txt`] = {
        type: "text",
        position: { ...positionTxt },
        width: 200,
        fontSize: 20,
        height: 64,
        hover: "#fff",
        fontColor: "#fff",
      };

      positionObj.top += 64;
      positionTxt.top = positionObj.top + 9;

      counter++;

      if (i === 6) {
        name = "child";
        counter = 1;
        positionObj = { top: 10, left: config.width / 2 + 20 };
        positionTxt = {
          top: positionObj.top + 9,
          left: config.width / 2 + 60,
        };
      }
    }

    config["renderer"] = renderer;

    return config;
  }

  updateChildToggleBtn(conf, childTxt, parentTxt) {
    let obj = this.testUI.config[conf].objects;
    const checked = this.testUI.config[conf].objects[childTxt];

    if (checked) {
      this.testUI.updateConfig(conf, "fontColor", "#46ff37");
      this.testUI.updateConfig(conf, "hover", "#b3d9b0");
      console.log(childTxt, "disable filter");
    } else {
      this.testUI.updateConfig(conf, "fontColor", "#ff3737fc");
      this.testUI.updateConfig(conf, "hover", "#ff3737a6");

      console.log(childTxt, "enable filter");

      // this.testUI.updateConfig(parentTxt,"fontColor", "#000000"); //TODO:HERE
    }

    let checkAll = true;

    for (var property in this.testUI.config) {
      if (property.substring(0, 5).localeCompare("child") === 0) {
        if (this.testUI.config[property].fontColor === "#ff3737fc") {
          checkAll = false;
          break;
        }
      }
    }

    console.log(checkAll);

    if (!checkAll) {
      this.testUI.updateConfig(parentTxt, "selected", true);
      this.testUI.updateConfig(parentTxt, "fontColor", "#f09724");
      this.testUI.updateConfig(parentTxt, "hover", "#ffc478");
    } else {
      this.testUI.updateConfig(parentTxt, "selected", false);
      this.testUI.updateConfig(parentTxt, "fontColor", "#ff3737fc");
      this.testUI.updateConfig(parentTxt, "hover", "#ff3737a6");
    }

    obj[childTxt] = !obj[childTxt];
    this.testUI.updateConfig(conf, "objects", obj);
  }

  updateParentToggleBtn(conf, array) {
    let obj = this.testUI.config[conf].objects;
    const current = this.testUI.config[conf].current;

    const checked = obj[current];

    obj[current] = !checked;

    console.log(conf);

    this.testUI.updateConfig(conf, "objects", obj);

    let childsSize = 8;

    if (array.length < 8) {
      childsSize = array.length;
    }

    if (checked) {
      this.testUI.updateConfig(conf, "fontColor", "#46ff37");
      this.testUI.updateConfig(conf, "hover", "#b3d9b0");

      for (let i = 0; i < childsSize; i++) {
        this.testUI.updateElement(`child${i + 1}Btn`, "");
        this.testUI.updateElement(`child${i + 1}Txt`, "");
      }
    } else {
      for (let i = 0; i < 6; i++) {
        // console.log(conf);
        if (this.testUI.config[`parent${i + 1}Btn`].selected === false) {
          this.testUI.updateConfig(`parent${i + 1}Btn`, "fontColor", "#46ff37");
          this.testUI.updateConfig(`parent${i + 1}Btn`, "hover", "#b3d9b0");
        }

        let newObj = this.testUI.config[`parent${i + 1}Btn`].objects;

        for (const property in newObj) {
          if (property.localeCompare(current)) {
            newObj[property] = false;
          }
        }

        this.testUI.updateConfig(`parent${i + 1}Btn`, "objects", newObj);
      }

      this.testUI.updateConfig(conf, "objects", obj);

      this.testUI.updateConfig(conf, "fontColor", "#ff3737fc");
      this.testUI.updateConfig(conf, "hover", "#ff3737a6");

      let childObj = {};
      let refObj = {};

      for (let i = 0; i < childsSize; i++) {
        this.testUI.updateElement(
          `child${i + 1}Btn`,
          "<path>M 50 15 Z M 31 49 A 1 1 0 0 0 31 17 A 1 1 0 0 0 31 49</path>"
        );
        this.testUI.updateElement(`child${i + 1}Txt`, array[i].name);
        this.testUI.updateConfig(`child${i + 1}Btn`, "onSelect", () =>
          this.updateChildToggleBtn(`child${i + 1}Btn`, array[i].name, conf)
        );
        childObj = this.testUI.config[`child${i + 1}Btn`].objects;

        if (!childObj[array[i].name]) {
          refObj[array[i].name] = false;

          Object.assign(childObj, refObj);

          this.testUI.updateConfig(`child${i + 1}Btn`, "objects", childObj);
        }

        let checked =
          this.testUI.config[`child${i + 1}Btn`].objects[array[i].name];
        if (!checked) {
          this.testUI.updateConfig(`child${i + 1}Btn`, "fontColor", "#46ff37");
          this.testUI.updateConfig(`child${i + 1}Btn`, "hover", "#b3d9b0");
        } else {
          this.testUI.updateConfig(
            `child${i + 1}Btn`,
            "fontColor",
            "#ff3737fc"
          );
          this.testUI.updateConfig(`child${i + 1}Btn`, "hover", "#ff3737a6");
        }
      }
    }

    if(this.testUI.config[conf].selected === true) {
      console.log(this.testUI.config[conf].selected);
      this.testUI.updateConfig(conf, "fontColor", "#f09724");
      this.testUI.updateConfig(conf, "hover", "#ffc478");
    }
  }

  updateParentUI(array) {
    let size = 6;

    for (let i = 0; i < size; i++) {
      let obj = this.testUI.config[`parent${i + 1}Btn`].objects;

      if (!obj[array[i].name]) {
        obj[array[i].name] = false;

        this.testUI.updateConfig(`parent${i + 1}Btn`, "objects", obj);
      }

      let checked =
        this.testUI.config[`parent${i + 1}Btn`].objects[array[i].name];

      if (!checked) {
        this.testUI.updateConfig(`parent${i + 1}Btn`, "fontColor", "#46ff37");
        this.testUI.updateConfig(`parent${i + 1}Btn`, "hover", "#b3d9b0");
      } else {
        this.testUI.updateConfig(`parent${i + 1}Btn`, "fontColor", "#ff3737fc");
        this.testUI.updateConfig(`parent${i + 1}Btn`, "hover", "#ff3737a6");
      }

      this.testUI.updateConfig(`parent${i + 1}Btn`, "current", array[i].name);

      this.testUI.updateConfig(`parent${i + 1}Btn`, "onSelect", () =>
        this.updateParentToggleBtn(`parent${i + 1}Btn`, array[i].childs)
      );
      this.testUI.updateElement(
        `parent${i + 1}Btn`,
        "<path>M 50 15 Z M 31 49 A 1 1 0 0 0 31 17 A 1 1 0 0 0 31 49</path>"
      );
      this.testUI.updateElement(`parent${i + 1}Txt`, array[i].name);
    }

    if (array.length < 6) {
      for (let i = array.length; i < 8; i++) {
        this.testUI.updateElement(`parent${i + 1}Btn`, "");
        this.testUI.updateElement(`parent${i + 1}Txt`, "");
      }
    }
  }

  createTestUI() {
    const config = this.createConfigUI();
    const content = this.createContentUI();

    this.testUI = new CanvasUI(content, config);

    console.log(this.testUI.config);

    this.updateParentUI(array);

    this.testUI.mesh.position.set(0, 1.5, -1.5);

    this.dolly.add(this.testUI.mesh);
  }

  //*********************** TODO: END ***********************/

  createDebugUI() {
    this.debugui = new CanvasUI();
    this.debugui.updateElement("body", "Hello World");
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

  // loadGLTF() {
  //   // const loader = new GLTFLoader().setPath("./");

  //   const dracoLoader = new DRACOLoader();
  //   dracoLoader.setDecoderPath(
  //     "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
  //   ); // use a full url path

  //   const loader = new GLTFLoader().setPath("./");
  //   loader.setDRACOLoader(dracoLoader);

  //   const self = this;

  //   // Load a glTF resource
  //   loader.load(
  //     // resource URL
  //     "house.FBX",
  //     // called when the resource is loaded
  //     function (gltf) {
  //       const college = gltf.scene.children[0];
  //       console.log(gltf);
  //       self.scene.add( college );

  //       college.traverse(function (child) {
  //           if (child.isMesh){
  //               if (child.name.indexOf("PROXY")!=-1){
  //                   child.material.visible = false;
  //                   self.proxy = child;
  //               }else if (child.material.name.indexOf('Glass')!=-1){
  //                   child.material.opacity = 0.1;
  //                   child.material.transparent = true;
  //               }else if (child.material.name.indexOf("SkyBox")!=-1){
  //                   const mat1 = child.material;
  //                   const mat2 = new THREE.MeshBasicMaterial({map: mat1.map});
  //                   child.material = mat2;
  //                   mat1.dispose();
  //               }
  //           }
  //       });

  //     },
  //     // called while loading is progressing
  //     function (xhr) {
  //       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  //     },
  //     // called when loading has errors
  //     function (error) {
  //       console.log(error);
  //       console.log("An error happened");
  //     }
  //   );
  //   self.setupVR();
  // }

  loadModel() {
    const loader = new FBXLoader().setPath("./");

    const self = this;

    loader.load(
      // resource URL
      "model1.fbx",
      // called when the resource is loaded
      function (fbx) {
        fbx.traverse((child) => {
          if (child.isMesh) {
            const string = child.name.toLowerCase();
            const substring = "floor";

            if (string.includes(substring.toLowerCase())) {
              child.visible = false;
              console.log(string);
            }
          }
        });
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
    if (this.dolly) {
      try {
        this.dolly.userData.forward = forward;
        this.dolly.userData.turn = -turn;
      } catch (e) {
        // this.debugui.updateElement("body", `error: ${e}`);
      }
    }
  }

  createButtonStates(components) {
    const buttonStates = {};
    this.gamepadIndices = components;

    Object.keys(components).forEach((key) => {
      if (key.indexOf("touchpad") != -1 || key.indexOf("thumbstick") != -1) {
        buttonStates[key] = { button: 0, xAxis: 0, yAxis: 0 };
      } else {
        buttonStates[key] = 0;
      }
    });

    this.buttonStates = buttonStates;
  }

  updateGamepadState() {
    const session = this.renderer.xr.getSession();

    const inputSource = session.inputSources[0];

    if (
      inputSource &&
      inputSource.gamepad &&
      this.gamepadIndices &&
      this.buttonStates
    ) {
      const gamepad = inputSource.gamepad;
      try {
        Object.entries(this.buttonStates).forEach(([key, value]) => {
          const buttonIndex = this.gamepadIndices[key].button;
          if (
            key.indexOf("touchpad") != -1 ||
            key.indexOf("thumbstick") != -1
          ) {
            const xAxisIndex = this.gamepadIndices[key].xAxis;
            const yAxisIndex = this.gamepadIndices[key].yAxis;
            this.buttonStates[key].button = gamepad.buttons[buttonIndex].value;
            this.buttonStates[key].xAxis = gamepad.axes[xAxisIndex].toFixed(2);
            this.buttonStates[key].yAxis = gamepad.axes[yAxisIndex].toFixed(2);
            this.onMove(
              -this.buttonStates[key].yAxis,
              this.buttonStates[key].xAxis
            );
            // this.debugui.updateElement(
            //   "body",
            //   `x: ${gamepad.axes[xAxisIndex].toFixed(2)} \n y: ${gamepad.axes[
            //     yAxisIndex
            //   ].toFixed(2)}`
            // );
          } else {
            this.buttonStates[key] = gamepad.buttons[buttonIndex].value;
          }
        });
      } catch (e) {
        console.warn(e);
      }
    }
  }

  setupXR() {
    this.renderer.xr.enabled = true;

    const self = this;

    function vrStatus(available) {
      if (available) {
        function onConnected(event) {
          const info = {};

          fetchProfile(event.data, DEFAULT_PROFILES_PATH, DEFAULT_PROFILE).then(
            ({ profile, assetPath }) => {
              info.name = profile.profileId;
              info.targetRayMode = event.data.targetRayMode;

              Object.entries(profile.layouts).forEach(([key, layout]) => {
                const components = {};
                Object.values(layout.components).forEach((component) => {
                  components[component.rootNodeName] = component.gamepadIndices;
                });
                info[key] = components;
              });

              self.createButtonStates(info.right);
            }
          );
        }

        function onSelectStart(event) {
          this.userData.selectPressed = true;
        }

        function onSelectEnd(event) {
          this.userData.selectPressed = false;
        }

        const controller = self.renderer.xr.getController(0);

        controller.addEventListener("connected", onConnected);
        controller.addEventListener("selectstart", onSelectStart);
        controller.addEventListener("selectend", onSelectEnd);

        const controller2 = self.renderer.xr.getController(1);

        controller2.addEventListener("connected", onConnected);
        controller2.addEventListener("selectstart", onSelectStart);
        controller2.addEventListener("selectend", onSelectEnd);

        const modelFactory = new XRControllerModelFactory();

        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, -1),
        ]);

        const line = new THREE.Line(geometry);
        // line.scale.z = 10;

        self.controllers = {};
        self.controllers.right = self.buildController(0, line, modelFactory);
        self.controllers.left = self.buildController(1, line, modelFactory);
      } else {
        self.joystick = new JoyStick({
          onMove: self.onMove.bind(self),
        });
      }
    }

    function onSessionStart() {
      // self.debugui.mesh.position.set(0, 1.5, 9);
      // self.camera.attach(self.debugui.mesh);
    }

    function onSessionEnd() {
      // self.camera.remove(self.debugui.mesh);
    }

    const btn = new VRBTN(this.renderer, {
      vrStatus,
      onSessionStart,
      onSessionEnd,
    });

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  buildController(index, line, modelFactory) {
    const controller = this.renderer.xr.getController(index);

    controller.userData.selectPressed = false;
    controller.userData.index = index;

    if (line) controller.add(line.clone());

    this.dolly.add(controller);

    let grip;

    if (modelFactory) {
      grip = this.renderer.xr.getControllerGrip(index);
      grip.add(modelFactory.createControllerModel(grip));
      this.dolly.add(grip);
    }

    return { controller, grip };
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
      if (this.dolly.userData.forward > 0) {
        dir.negate();
      } else {
        dt = -dt;
      }
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
      (this.renderer.xr.getController(0).userData.selectPressed ||
        this.renderer.xr.getController(1).userData.selectPressed)
    );
  }

  render(timestamp, frame) {
    const dt = this.clock.getDelta();

    let moved = false;

    if (this.renderer.xr.isPresenting) {
      this.testUI.update();
      // this.debugui.update();

      if (this.selectPressed) {
        // this.moveDolly(-dt);
      }

      if (this.elapsedTime === undefined) this.elapsedTime = 0;
      this.elapsedTime += dt;
      if (this.elapsedTime > 0.3) {
        this.updateGamepadState();
        this.elapsedTime = 0;
      }

      if (this.dolly.userData.forward !== undefined) {
        if (this.dolly.userData.forward != 0) {
          this.moveDolly(dt);
          moved = true;
        }
        this.dolly.translateX(this.dolly.userData.turn * -dt);
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

export { Thumb };
