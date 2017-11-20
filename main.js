/*exported canvas, textureMapCanvas, ctx, playerView, GameObject, changeElementSelected, toggleRays*/

let updateMiliseconds = 20;
let playerCanvas, canvasGrid, canvasGameScreen, textureMapCanvas, ctxPlayer, ctxGrid, ctxGame;
let textureMap;
let cell, grid, player, editorControl, sidebar, playerView;
let raysActivated = true;
let selection = 0;

let gameObjectMap = [
	//{ type: "object", textureLocation: [-1, 0] },
	{ name: "devilish wall", type: "wall", textureLocation: [128, 0] },
	{ name: "stone wall",type: "wall", textureLocation: [192, 0] },
	{ name: "blue wall",type: "wall", textureLocation: [256, 0] },
	{ name: "slimmy wall",type: "wall", textureLocation: [320, 0] },
	{ name: "wooden wall",type: "wall", textureLocation: [384, 0] },
	{ name: "stone wall",type: "wall", textureLocation: [448, 0] },
	{ name: "",type: "wall", textureLocation: [512, 0] }
];

class GameObject {
	constructor(gameObjectMap) {
		this.name = gameObjectMap.name;
		this.type = gameObjectMap.type;
		this.textureLocation = gameObjectMap.textureLocation;
	}
}

window.onload = function () {
	setup();

	cell = new Cell({
		x: 0,
		y: 0
	});
	grid = new Grid(GRID_DIMENSIONS);
	player = new Player();
	editorControl = new EditorControl();
	sidebar = new Sidebar(document.getElementById("sidebar"));


	function setup() {
		textureMap = new Image();
		textureMap.src = "textures/textureMap.png";
		playerCanvas = document.getElementById("playerCanvas");
		canvasGrid = document.getElementById("editorGrid");
		canvasGameScreen = document.getElementById("gameScreen");
		ctxPlayer = playerCanvas.getContext("2d");
		ctxGrid = canvasGrid.getContext("2d");
		ctxGame = canvasGameScreen.getContext("2d");
		ctxGame.imageSmoothingEnabled = false;
	}

	function EditorControl() {
		this.update = function update() {
			//ctxGrid.clearRect(0, 0, canvasGrid.width, canvasGrid.height);
			ctxPlayer.clearRect(0, 0, 1000, 1000);
			ctxGame.clearRect(0, 0, 1000, 1000);

			sidebar.ctx.clearRect(0, 0, sidebar.width, sidebar.height);
			sidebar.ctx.clearRect(0, 0, 1000, 1000);
			//ctx.drawImage(textureMap,10,10);
			mouse.update();
			player.update();
			sidebar.update();
		};
		setInterval(this.update, updateMiliseconds);

		this.drawRayLineOnCanvas = function drawRayLineOnCanvas(color, origin, destination){
			ctxPlayer.beginPath();
			ctxPlayer.rect(destination.x - 2, destination.y - 2, 4, 4);
			ctxPlayer.fillStyle = "#ff0022";
			ctxPlayer.fill();
			ctxPlayer.closePath();

			ctxPlayer.beginPath();
			ctxPlayer.strokeStyle = color;
			ctxPlayer.moveTo(origin.x, origin.y);
			ctxPlayer.lineTo(destination.x, destination.y);
			ctxPlayer.stroke();
			ctxPlayer.closePath();
		};

		this.mouseEvent = function mouseEvent(button, eventType) {
			switch (eventType) {
				case mouse.CLICKED:
					switch (button) {
						case mouse.MOUSE1:
							grid.mouseInteraction(mouse.MOUSE1);
					}
			}
		};
	}

	function Sidebar(sidebarCanvas){
		this.canvas = sidebarCanvas;
		this.ctx = sidebarCanvas.getContext('2d');
		

		this.update = function update(){
			this.ctx.beginPath();

			if(gameObjectMap[selection])
				this.ctx.drawImage(textureMap, gameObjectMap[selection].textureLocation[0], gameObjectMap[selection].textureLocation[1], 64, 64, 70, 64, 64,64); 
		
			this.ctx.font = "20px Arial";
			this.ctx.fillText("Press buttons 1-7",25,200);
		};
	}

	function Player() {
		this.position = {
			x: PLAYER_START_POSITION.x,
			y: PLAYER_START_POSITION.y
		};

		this.size = {
			x: PLAYER_SIZE.x,
			y: PLAYER_SIZE.y
		};

		this.playerFacingAngle = Math.PI / 2; //90 degrees
		this.playerView = new PlayerView(this.position);

		this.turningAngle = Math.PI / 100;

		this.color = "#ff0000";
		this.movingSpeed = 2;

		this.once = true;

		this.update = function update() {
			this.draw();
			//if(this.once){
				this.playerView.castRays(this.playerFacingAngle);
				//this.once = false;
			//}
			this.interact();
		};

		this.draw = function draw() {
			ctxPlayer.beginPath();
			ctxPlayer.rect(this.returnDrawCenter().x, this.returnDrawCenter().y, this.size.x, this.size.y);
			ctxPlayer.fillStyle = this.color;
			ctxPlayer.fill();
			ctxPlayer.closePath();

			ctxPlayer.beginPath();
			ctxPlayer.moveTo(this.position.x, this.position.y);
			ctxPlayer.lineTo(this.position.x + Math.cos(this.playerFacingAngle) * 200, this.position.y + Math.sin(this.playerFacingAngle) * - 200);
			ctxPlayer.stroke();
		};

		this.interact = function interact() {
			if (keyboard.keys.up) {
				this.move(1);
			}

			if (keyboard.keys.down) {
				this.move(-1);
			}

			if (keyboard.keys.right) {
				this.rotate(0);
			}

			if (keyboard.keys.left) {
				this.rotate(1);
			}
		};

		this.move = function move(dir) {
			let nextPos = {
				x: this.position.x + Math.cos(this.playerFacingAngle) * this.movingSpeed * dir,
				y: this.position.y - Math.sin(this.playerFacingAngle) * this.movingSpeed * dir
			};

			let nextPosCollisionPoints = this.returnCollisionPoints(nextPos.x, nextPos.y);

			if (grid.returnGameObjectsWithinPoints(nextPosCollisionPoints).length > 0) {
				if (grid.returnGameObjectsWithinPoints(this.returnCollisionPoints(nextPos.x, this.position.y)).length <= 0) {
					this.position.x = nextPos.x;
				} else if (grid.returnGameObjectsWithinPoints(this.returnCollisionPoints(this.position.x, nextPos.y)).length <= 0) {
					this.position.y = nextPos.y;
				}
			} else {
				this.position.x = nextPos.x;
				this.position.y = nextPos.y;
			}

		};

		this.rotate = function rotate(dir) {
			if (dir == 0) {
				if (this.playerFacingAngle - this.turningAngle < 0)
					this.playerFacingAngle = 2 * Math.PI;
				else
					this.playerFacingAngle -= this.turningAngle;
			} else if (dir == 1) {
				if (this.playerFacingAngle + this.turningAngle > 2 * Math.PI)
					this.playerFacingAngle = 0;
				else
					this.playerFacingAngle += this.turningAngle;
			}
		};

		this.returnCollisionPoints = function returnCollisionPoints(positionX, positionY) {
			let point1 = { x: positionX - this.size.x / 2, y: positionY - this.size.x / 2 };
			let point2 = { x: positionX + this.size.x / 2, y: positionY - this.size.x / 2 };
			let point3 = { x: positionX - this.size.x / 2, y: positionY + this.size.x / 2 };
			let point4 = { x: positionX + this.size.x / 2, y: positionY + this.size.x / 2 };

			return [point1, point2, point3, point4];
		};

		this.returnCoordAtPos = function returnCoordAtPos(posX, posY) {
			let coord = {
				x: Math.floor(posX / CELL_SIZE.x),
				y: Math.floor(posY / CELL_SIZE.y)
			};

			return coord;
		};

		this.returnDrawCenter = function returnDrawCenter() {
			let drawCenter = {
				x: undefined,
				y: undefined
			};
			drawCenter.x = this.position.x - this.size.x / 2;
			drawCenter.y = this.position.y - this.size.y / 2;
			return drawCenter;
		};
	}

	/*function defineVector(originPos, targetPos) {
		vector = [];
		randomNum = Math.floor((Math.random() * 10) - 10); // 1 - 10
		vector.x = targetPos.x - originPos.x + randomNum;
		vector.y = targetPos.y - originPos.y + randomNum;

		temp = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
		if (temp != 0) {
			vector.x = vector.x / temp;
			vector.y = vector.y / temp;
		}
		return vector;
	}*/


	editorControl.update();
};

function changeElementSelected(newValue) {
	selection = newValue;
}

function toggleRays() {
	if (raysActivated)
		raysActivated = false;
	else
		raysActivated = true;
}
