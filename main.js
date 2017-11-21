/*exported canvas, textureMapCanvas, ctx, playerView, GameObject, changeElementSelected, toggleRays, gameObjectMap*/


class GameManager{
	constructor(){
		this.textureMap = new Image();
		this.textureMap.src = "textures/textureMap.png";

		this.editorControl = new EditorControl(this.textureMap, this.updateMiliseconds,this.ctxEditor, this.ctxPlayer);
		this.gameScreenControl = new GameScreenControl(this.updateMiliseconds,this.ctxGameScreen);

		this.updateMiliseconds = 20;

		this.raysActivated = true;
		this.selection = 0;

		this.keyboardManager = new KeyboardManager(this.updateMiliseconds);

		this.setup();
	}
}

GameManager.prototype.setup = function(){
	let self = this;
	
	this.keyboardManager.on("move", self.editorControl.player.move.bind(self.editorControl.player));	
	this.keyboardManager.on("rotate", self.editorControl.player.rotate.bind(self.editorControl.player));	
};


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


function changeElementSelected(newValue) {
	selection = newValue;
}

function toggleRays() {
	if (raysActivated)
		raysActivated = false;
	else
		raysActivated = true;
}
