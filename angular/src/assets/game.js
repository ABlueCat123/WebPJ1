import("../assets/libs/FBXLoader.js")
var game=class Game {
    constructor(choice) {
        if (!Detector.webgl) Detector.addGetWebGLMessage();
        this.modes = Object.freeze({
            NONE: Symbol("none"),
            PRELOAD: Symbol("preload"),
            INITIALISING: Symbol("initialising"),
            CREATING_LEVEL: Symbol("creating_level"),
            ACTIVE: Symbol("active"),
            GAMEOVER: Symbol("gameover")
        });
        this.mode = this.modes.NONE;
        this.container;
        this.player = {move: {turn: 0, forward: 0}};
        this.camera;
        this.scene;
        this.renderer;
        this.assetsPath = './assets/';
        this.messages = {
            text: [
                "Welcome to Blockland",
                "GOOD LUCK!"
            ],
            index: 0
        }

        this.container = document.createElement('div');
        this.container.style.height = '100%';
        document.body.appendChild(this.container);

        const game = this;
        this.anims = ['Walking', 'Walking Backwards', 'Turn', 'Running', 'Pointing', 'Talking'];

        const options = {
            assets: [
                `${this.assetsPath}/images/nx.jpg`,
                `${this.assetsPath}/images/px.jpg`,
                `${this.assetsPath}/images/ny.jpg`,
                `${this.assetsPath}/images/py.jpg`,
                `${this.assetsPath}/images/nz.jpg`,
                `${this.assetsPath}/images/pz.jpg`
            ],
            oncomplete: function () {
                game.init(choice);
                game.animate();
            }
        }

        this.anims.forEach(function (anim) {
            options.assets.push(`${game.assetsPath}fbx/anims/${anim}.fbx`)
        });
        options.assets.push(`${game.assetsPath}fbx/town.fbx`);
        this.mode = this.modes.PRELOAD;
        const preloader = new Preloader(options);
        window.onError = function (error) {
            console.error(JSON.stringify(error));
        }
    }

    set activeCamera(object) {
        this.player.cameras.active = object;
    }

    init(choice) {
        this.mode = this.modes.INITIALISING;
        // scene and lighting
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 200000);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x00a0f0);
        const ambient = new THREE.AmbientLight(0xaaaaaa);
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

        // person model
        const loader = new THREE.FBXLoader();
        const game = this;
        // const people = ['BeachBabe', 'BusinessMan', 'Doctor', 'FireFighter', 'Housewife', 'Policeman', 'Prostitute', 'Punk', 'RiotCop', 'Roadworker', 'Robber', 'Sheriff', 'Streetman', 'Waitress'];
        const people = ['Policeman', 'Robber'];
        let model = people[Math.floor(Math.random() * people.length)];
        if (choice === 'police')
            model = people[0]
        else if (choice === 'thief')
            model = people[1];
        loader.load(`${this.assetsPath}fbx/people/${model}.fbx`, function (object) {
            game.player.root = object;
            object.mixer = new THREE.AnimationMixer(game.player.root);
            game.player.mixer = object.mixer;
            game.player.animations = {'Idle': object.animations[0]};
            object.name = "Person";
            object.scale.set(6, 6, 6)
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            game.player.index = (Math.random() > 0.5) ? 0 : 2;//Math.floor(Math.random() * object.children.length);
            const name = model;//object.children[game.player.index].name.substring(3);
            const colours = ['Black', 'Brown', 'White'];
            const colour = colours[Math.floor(Math.random() * colours.length)];
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(`${game.assetsPath}images/SimplePeople_${name}_${colour}.png`, function (texture) {
                object.traverse(function (child) {
                    if (child.isMesh) {
                        child.material.map = texture;
                    }
                });
            });
            game.player.object = new THREE.Object3D();
            game.player.object.position.set(-1000, 0, -1000);
            game.player.object.rotation.set(0, 1.6, 0);
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

        // window renderer
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', function () {
            game.onWindowResize();
        }, false);
    }

    loadEnvironment(loader) {
        const game = this;
        loader.load(`${this.assetsPath}fbx/town.fbx`, function (object) {
            game.environment = object;
            game.colliders = [];
            game.scene.add(object);
            object.traverse(function (child) {
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
            tloader.setPath(`${game.assetsPath}/images/`);

            var textureCube = tloader.load([
                'px.jpg', 'nx.jpg',
                'py.jpg', 'ny.jpg',
                'pz.jpg', 'nz.jpg'
            ]);

            game.scene.background = textureCube;

            game.loadNextAnim(loader);
        })
    }

    loadNextAnim(loader) {
        let anim = this.anims.pop();
        const game = this;
        loader.load(`${this.assetsPath}fbx/anims/${anim}.fbx`, function (object) {
            game.player.animations[anim] = object.animations[0];
            if (game.anims.length > 0) {
                game.loadNextAnim(loader);
            } else {
                delete game.anims;
                game.action = "Idle";
                game.mode = game.modes.ACTIVE;
                game.animate();
            }
        });
    }

    // 改为专门负责手柄控制。
    playerControl(forward, turn) {
        turn = -turn;
        this.player.move = {forward, turn};
    }

    createCameras() {
        const offset = new THREE.Vector3(0, 80, 0);
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
        game.activeCamera = this.player.cameras.back;
    }


    showMessage(msg, fontSize = 20, onOK = null) {
        const txt = document.getElementById('message_text');
        txt.innerHTML = msg;
        txt.style.fontSize = fontSize + 'px';
        const btn = document.getElementById('message_ok');
        const panel = document.getElementById('message');
        const game = this;
        if (onOK != null) {
            btn.onclick = function () {
                panel.style.display = 'none';
                onOK.call(game);
            }
        } else {
            btn.onclick = function () {
                panel.style.display = 'none';
            }
        }
        panel.style.display = 'flex';
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    set action(name) {
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
    }

    animate() {
        const game = this;
        const dt = 0.01;
        requestAnimationFrame(function () {
            game.animate();
        });
        if (this.player.mixer !== undefined && this.mode === this.modes.ACTIVE) this.player.mixer.update(dt);
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
        if (this.stats !== undefined) this.stats.update();

    }
}
