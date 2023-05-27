import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../game.service";
import * as THREE from "three"
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

@Component({
  selector: 'app-three-d',
  templateUrl: './three-d.component.html',
  styleUrls: ['./three-d.component.css']
})

export class ThreeDComponent implements OnInit {
  socket: any;
  player: any = {move: {turn: 0, forward: 0}};
  remotePlayer: any = {move: {turn: 0, forward: 0}};
  scene: any; // 当前场景（Three.js三要素）
  container: any; // renderer容器元素
  camera: any;
  renderer: any;
  anims: any;
  sun: any;
  directionPanel: any;
  environment: any;
  colliders: any;
  mode: string = "INITIALISING";

  // game logic
  character: any; // 用户最开始选择的角色。
  question: any;
  stages = Object.freeze({
    NONE: Symbol("最开始的阶段，尚未开始答题"),
    SHOW: Symbol("展示题目阶段，此时尚不能操作"),
    GRAB: Symbol("抢答阶段"),
    CHOOSE: Symbol("答题阶段"),
    MOVE: Symbol("移动阶段"),
  })
  stage: any; //默认为 NONE
  buttonText: any;

  // functions
  constructor(private activatedRoute: ActivatedRoute, private gameService: GameService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.character = queryParams['character'];
    });
    this.stage = this.stages.NONE
    this.socket = gameService.socket;
  }

  ngOnInit(): void {
    const game = this;
    this.anims = ['Walking', 'Walking Backwards', 'Turn', 'Running', 'Pointing', 'Talking'];
    const character = this.character;
    const assetsPath = "../assets";
    const options = {
      assets: [
        `${assetsPath}/images/nx.jpg`,
        `${assetsPath}/images/px.jpg`,
        `${assetsPath}/images/ny.jpg`,
        `${assetsPath}/images/py.jpg`,
        `${assetsPath}/images/nz.jpg`,
        `${assetsPath}/images/pz.jpg`
      ],
      oncomplete: function () {
        game.init(character);
      }
    }

    this.anims.forEach(function (anim: string) {
      options.assets.push(`${assetsPath}/fbx/anims/${anim}.fbx`)
    });
    options.assets.push(`${assetsPath}/fbx/town.fbx`);
    new Preloader(options);
    window.onerror = function (error) {
      console.error(JSON.stringify(error));
    }
  }

  set activeCamera(object: any) {
    this.player.cameras.active = object;
  }

  init(choice: string) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 200000);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x00a0f0);
    const ambient = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambient);
    const light = new THREE.DirectionalLight(0xaaaaaa);
    light.position.set(30, 100, 40);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    const lightSize = 500;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = light.shadow.camera.bottom = -lightSize;
    light.shadow.camera.right = light.shadow.camera.top = lightSize;
    light.shadow.bias = 0.0039;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.sun = light;
    this.scene.add(light);

    // person models
    const loader = new FBXLoader();
    const game = this;
    let model: string;
    let remoteModel: string;
    if (choice === 'policeman') {
      model = 'Policeman'
      remoteModel = 'Robber'
    } else { // i.e. choice === thief
      model = 'Robber'
      remoteModel = 'Policeman'
    }
    const assetsPath = "../assets";

    // local model
    loader.load(`${assetsPath}/fbx/people/${model}.fbx`, function (object: any) {
      game.player.root = object;
      object.mixer = new THREE.AnimationMixer(game.player.root);
      game.player.mixer = object.mixer;

      game.player.animations = {'Idle': object.animations[0]};
      object.name = "Person";
      object.scale.set(6, 6, 6)
      object.traverse(function (child: any) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      game.player.index = (Math.random() > 0.5) ? 0 : 2;
      const colours = ['Black', 'Brown', 'White'];
      const colour = colours[Math.floor(Math.random() * colours.length)];
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(`${assetsPath}/images/SimplePeople_${model}_${colour}.png`, function (texture) {
        object.traverse(function (child: any) {
          if (child.isMesh) {
            child.material.map = texture;
          }
        });
      });

      game.player.object = new THREE.Object3D();
      if (model === 'Policeman') {
        game.player.object.position.set(7500, 0, -8500);
        game.player.object.rotation.set(0, 0.1, 0);
      } else // 站井盖上
      {
        game.player.object.position.set(-1000, 0, -1000);
        game.player.object.rotation.set(0, 1.6, 0);
      }

      game.sun.target = game.player.object;
      game.player.object.add(object);
      game.scene.add(game.player.object);
      game.directionPanel = new Panel({
        onMove: game.playerControl,
        game: game
      })
      game.createCameras();
      game.loadEnvironment(loader);
    });

    // remote model
    loader.load(`${assetsPath}/fbx/people/${remoteModel}.fbx`, function (object: any) {
      game.remotePlayer.root = object;
      object.mixer = new THREE.AnimationMixer(game.remotePlayer.root);
      game.remotePlayer.mixer = object.mixer;

      game.remotePlayer.animations = {'Idle': object.animations[0]};
      object.name = "Person";
      object.scale.set(6, 6, 6)
      object.traverse(function (child: any) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      game.remotePlayer.index = (Math.random() > 0.5) ? 0 : 2;
      const colours = ['Black', 'Brown', 'White'];
      const colour = colours[Math.floor(Math.random() * colours.length)];
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(`${assetsPath}/images/SimplePeople_${remoteModel}_${colour}.png`, function (texture) {
        object.traverse(function (child: any) {
          if (child.isMesh) {
            child.material.map = texture;
          }
        });
      });

      game.remotePlayer.object = new THREE.Object3D();
      if (remoteModel === 'Policeman') {
        game.remotePlayer.object.position.set(7500, 0, -8500);
        game.remotePlayer.object.rotation.set(0, 0.1, 0);
      } else // 站井盖上
      {
        game.remotePlayer.object.position.set(-1000, 0, -1000);
        game.remotePlayer.object.rotation.set(0, 1.6, 0);
      }

      // game.sun.target = game.remotePlayer.object;
      game.remotePlayer.object.add(object);
      game.scene.add(game.remotePlayer.object);
      game.createCameras();
      game.loadEnvironment(loader);
    });

    // window renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
    this.renderer.shadowMap.enabled = true;
    this.container = document.querySelector('#renderer');
    let canvas = this.renderer.domElement;
    this.container.appendChild(canvas);

    window.addEventListener('resize', function () {
      game.onWindowResize();
    }, false);
  }

  loadEnvironment(loader: any) {
    const game = this;
    const assetsPath = "../assets";

    loader.load(`${assetsPath}/fbx/town.fbx`, function (object: any) {
      game.environment = object;
      game.colliders = [];
      game.scene.add(object);
      object.traverse(function (child: any) {
        if (child.isMesh) {
          if (child.name.startsWith("proxy")) {
            game.colliders.push(child);
            child.material.visible = false;
          } else {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });

      const tloader = new THREE.CubeTextureLoader();
      tloader.setPath(`${assetsPath}/images/`);

      game.scene.background = tloader.load([
        'px.jpg', 'nx.jpg',
        'py.jpg', 'ny.jpg',
        'pz.jpg', 'nz.jpg'
      ]);

      game.loadNextAnim(loader);
    })
  }

  loadNextAnim(loader: any) {
    let anim = this.anims.pop();
    const game = this;
    const assetsPath = "../assets";
    loader.load(`${assetsPath}/fbx/anims/${anim}.fbx`, function (object: any) {
      game.player.animations[anim] = object.animations[0];
      if (game.anims.length > 0) {
        game.loadNextAnim(loader);
      } else {
        delete game.anims;
        game.action = "Idle";
        game.mode = 'ACTIVE';
        game.animate();
        game.registerSockets();
      }
    });
  }

  // 改为专门负责手柄控制。
  playerControl(forward: any, turn: any) {
    turn = -turn;
    this.player.move = {forward, turn};
  }

  createCameras() {
    // const offset = new THREE.Vector3(0, 80, 0);
    const front = new THREE.Object3D();
    front.position.set(112, 100, 600);
    front.parent = this.player.object;
    const back = new THREE.Object3D();
    back.position.set(0, 15000, -7500);
    back.parent = this.player.object;
    const wide = new THREE.Object3D();
    wide.position.set(178, 139, 1665);
    wide.parent = this.player.object;
    const overhead = new THREE.Object3D();
    overhead.position.set(0, 400, 0);
    overhead.parent = this.player.object;
    const collect = new THREE.Object3D();
    collect.position.set(40, 82, 94);
    collect.parent = this.player.object;
    this.player.cameras = {front, back, wide, overhead, collect};
    this.activeCamera = this.player.cameras.back;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
  }

  set action(name: any) {
    const action = this.player.mixer.clipAction(this.player.animations[name]);
    action.time = 0;
    this.player.mixer.stopAllAction();
    this.player.action = name;
    this.player.actionTime = Date.now();

    action.fadeIn(0.5);
    action.play();
  }

  // 专门负责角色移动和动作显示控制。
  movePlayer() {
    const pos = this.player.object.position.clone();
    const turnStep = Math.PI / 4 * 0.01;
    const moveStep = 10;
    let dir = new THREE.Vector3();
    this.player.object.getWorldDirection(dir);
    if (this.player.move.forward < 0) dir.negate();
    let raycaster = new THREE.Raycaster(pos, dir);
    let blocked = false;
    const colliders = this.colliders;
    if (colliders !== undefined) {
      const intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        if (intersect[0].distance < 50) blocked = true;
      }
    }
    if (Math.abs(this.player.move.forward) > moveStep) {
      if (this.player.move.forward > 0 && !blocked) {
        if (this.player.action !== 'Walking') this.action = 'Walking';
        this.player.move.forward -= moveStep;
        this.player.object.translateZ(moveStep);
      } else if (this.player.move.forward < 0 && !blocked) {
        this.player.move.forward += moveStep;
        if (this.player.action !== 'Walking Backwards') this.action = 'Walking Backwards';
        this.player.object.translateZ(-moveStep);
      }
    } else if (Math.abs(this.player.move.turn) > turnStep) {
      if (this.player.move.turn > 0) {
        this.player.object.rotateY(turnStep);
        this.player.move.turn -= turnStep
      } else if (this.player.move.turn < 0) {
        this.player.object.rotateY(-turnStep);
        this.player.move.turn += turnStep
      }
      if (this.player.action !== 'Turn') this.action = 'Turn';
    } else {
      this.player.move = {turn: 0, forward: 0};
      if (this.player.action !== "Idle") {
        this.action = 'Idle';
      }
    }

    if (colliders !== undefined) {
      //cast left
      dir.set(-1, 0, 0);
      dir.applyMatrix4(this.player.object.matrix);
      dir.normalize();
      raycaster = new THREE.Raycaster(pos, dir);

      let intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        if (intersect[0].distance < 50) this.player.object.translateX(100 - intersect[0].distance);
      }

      //cast right
      dir.set(1, 0, 0);
      dir.applyMatrix4(this.player.object.matrix);
      dir.normalize();
      raycaster = new THREE.Raycaster(pos, dir);

      intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        if (intersect[0].distance < 50) this.player.object.translateX(intersect[0].distance - 100);
      }

      //cast down
      dir.set(0, -1, 0);
      pos.y += 200;
      raycaster = new THREE.Raycaster(pos, dir);
      const gravity = 30;

      intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        const targetY = pos.y - intersect[0].distance;
        if (targetY > this.player.object.position.y) {
          //Going up
          this.player.object.position.y = 0.8 * this.player.object.position.y + 0.2 * targetY;
          this.player.velocityY = 0;
        } else if (targetY < this.player.object.position.y) {
          //Falling
          if (this.player.velocityY === undefined) this.player.velocityY = 0;
          this.player.velocityY += 0.01 * gravity;
          this.player.object.position.y -= this.player.velocityY;
          if (this.player.object.position.y < targetY) {
            this.player.velocityY = 0;
            this.player.object.position.y = targetY;
          }
        }
      }
    }
    this.updateSocket()
  }

  animate() {
    const game = this;
    const dt = 0.01;
    requestAnimationFrame(function () {
      game.animate();
    });
    if (this.player.mixer !== undefined && this.mode === 'ACTIVE')
      this.player.mixer.update(dt);
    this.movePlayer();
    if (this.player.cameras !== undefined && this.player.cameras.active !== undefined) {
      this.camera.position.lerp(this.player.cameras.active.getWorldPosition(new THREE.Vector3()), 0.05);
      const pos = this.player.object.position.clone();
      pos.y += 300;
      this.camera.lookAt(pos);
    }
    if (this.sun !== undefined) {
      this.sun.position.copy(this.camera.position);
      this.sun.position.y += 10;
    }
    this.renderer.render(this.scene, this.camera);
  }

  updateSocket() {
    if (this.socket !== undefined) {
      this.socket.emit('update', {
        name: this.character,
        pos: {
          x: this.player.object.position.x,
          y: this.player.object.position.y,
          z: this.player.object.position.z,
          heading: this.player.object.rotation.y,
          pb: this.player.object.rotation.x,
          action: this.player.action
        }
      })
    }
  }

  registerSockets() {
    this.registerListenOnRemote();
    this.requestQuestion();
    console.log(this.player.object.position)
    console.log(this.remotePlayer.object.position)
  }

  registerListenOnRemote() {
    this.socket.on("player state", (res: any) => {
      res.forEach((player: any) => {
        if (this.character !== player.name) {
          let data = player.position
          this.remotePlayer.object.position.set(data.x, data.y, data.z);
          const euler = new THREE.Euler(data.pb, data.heading, data.pb);
          this.remotePlayer.object.quaternion.setFromEuler(euler);
          this.remotePlayer.object.action = data.action;
        }
      })
    })

  }

  requestQuestion() {

    this.socket.emit("question", (response: any) => {
      this.stage = this.stages.SHOW;
      this.question = response;
      let time = new Date().getTime()
      //countdown
      let timeLeft = response.time - time + 3000;
      const timeInterval=setInterval(() => {
        timeLeft--;
        this.buttonText = timeLeft
        if (timeLeft <= 0) {
          timeLeft = 0;
          this.stage=this.stages.GRAB
          this.buttonText = "Grab!"
          clearInterval(timeInterval)
        }
      }, 1);
    })
  }

  grabStart() {
    if(this.stage===this.stages.GRAB){
      //允许抢答的阶段。
      // 发送socket!
      this.socket.emit("grab",(got:boolean)=>{
        if(got)
          this.stage=this.stages.CHOOSE
        else
          this.stage=this.stages.SHOW
      });
    }
  }
  makeChoice(choice:string){

      // this.socket.emit("make choice",()=>{
      //
      // })
  }
}

