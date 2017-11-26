/*exported canvas, textureMapCanvas, ctx, playerView, GameObject, changeElementSelected, toggleRays, gameObjectMap*/

class GameManager{
	constructor(){
		this.textureMap = new Image();
		this.textureMap.src = "textures/textureMap.png";

		this.updateMiliseconds = 20;

		
		this.editorControl = new EditorControl(this, this.textureMap, this.updateMiliseconds);
		this.gameScreenControl = new GameScreenControl(this.updateMiliseconds, this.editorControl);

		this.player = new Player(this.editorControl, this.gameScreenControl);

		this.gameScreenControl.initializePlayerView(this.player);
		this.editorControl.player = this.player;

		this.selection = 0;

		this.keyboardManager = new KeyboardManager(this.updateMiliseconds);
		this.clickManager = new ClickManager(this.updateMiliseconds);	
		
		this.gameObjectMap = [
			//{ type: "object", textureLocation: [-1, 0] },
			{ name: "devilish wall", type: "wall", textureLocation: [128, 0] },
			{ name: "stone wall",type: "wall", textureLocation: [192, 0] },
			{ name: "blue wall",type: "wall", textureLocation: [256, 0] },
			{ name: "slimmy wall",type: "wall", textureLocation: [320, 0] },
			{ name: "wooden wall",type: "wall", textureLocation: [384, 0] },
			{ name: "stone wall",type: "wall", textureLocation: [448, 0] },
			{ name: "",type: "wall", textureLocation: [512, 0] }
		];

		this.setup();
	}
}

GameManager.prototype.updateAll = function(){
	this.editorControl.update();
	this.gameScreenControl.update();
};

GameManager.prototype.setup = function(){
	let self = this;
	
	this.keyboardManager.on("move", self.editorControl.player.move.bind(self.editorControl.player));	
	this.keyboardManager.on("rotate", self.editorControl.player.rotate.bind(self.editorControl.player));	
	
	this.clickManager.on("interactGrid", self.editorControl.mouseEvent.bind(self.editorControl));	

	this.updateClass = setInterval(this.updateAll.bind(self), this.updateMiliseconds);
};

class GameObject {
	constructor(gameObjectMap) {
		this.name = gameObjectMap.name;
		this.type = gameObjectMap.type;
		this.textureLocation = gameObjectMap.textureLocation;
	}
}

function changeElementSelected(newValue) {
	selection = newValue;
}

function toggleRays() {
	if (raysActivated)
		raysActivated = false;
	else
		raysActivated = true;
}
