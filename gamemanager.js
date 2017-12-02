/*exported canvas, textureMapCanvas, ctx, playerView, GameObject, changeElementSelected, toggleRays, gameObjectMap*/

class GameManager{
	constructor(textureMap){
		this.textureMap = textureMap;
		this.updateMiliseconds = 15;

		this.selection = 0;
		this.raysActivated = false;

		this.keyboardManager = new KeyboardManager(this.updateMiliseconds);
		this.clickManager = new ClickManager(this.updateMiliseconds);	
		
		this.globalGameObjectMap = [
			//{ type: "object", textureLocation: [-1, 0] },
			{ index:0, name: "devilish wall", type: "wall", textureLocation: [0, 0], block: true, isCollectable: false},
			{ index:1, name: "stone wall", type: "wall", textureLocation: [128, 0], block: true, isCollectable: false },
			{ index:2, name: "blue wall",type: "wall", textureLocation: [192, 0], block: true, isCollectable: false },
			{ index:3, name: "slimmy wall",type: "wall", textureLocation: [256, 0], block: true, isCollectable: false },
			{ index:4, name: "wooden wall",type: "wall", textureLocation: [320, 0], block: true, isCollectable: false },
			{ index:5, name: "stone wall",type: "wall", textureLocation: [384, 0], block: true, isCollectable: false },
			{ index:6, name: "black",type: "wall", textureLocation: [448, 0], block: true, isCollectable: false }
		];

		this.setup();
	}
}

GameManager.prototype.updateAll = function(){
	this.editorControl.update();
	this.gameScreenControl.update();
};

GameManager.prototype.setup = function(){
	this.editorControl = new EditorControl(this, this.textureMap, this.updateMiliseconds);
	this.editorControl.sidebar.firstDraw();
	this.gameScreenControl = new GameScreenControl(this.updateMiliseconds, this.editorControl);

	this.player = new Player(this.editorControl, this.gameScreenControl);

	this.gameScreenControl.initializePlayerView(this.player);
	this.editorControl.player = this.player;

	let self = this;
	
	this.keyboardManager.on("move", self.editorControl.player.move.bind(self.editorControl.player));	
	this.keyboardManager.on("rotate", self.editorControl.player.rotate.bind(self.editorControl.player));	
	this.keyboardManager.on("changeSelected", self.changeElementSelected.bind(self));	
	this.keyboardManager.on("toggleRays", self.toggleRays.bind(self));	
	
	this.clickManager.on("interactGrid", self.editorControl.mouseEvent.bind(self.editorControl));	
	

	this.updateClass = setInterval(this.updateAll.bind(self), this.updateMiliseconds);
};

class GameObject {
	constructor(gameObjectMap) {
		this.index = gameObjectMap.index;
		this.name = gameObjectMap.name;
		this.type = gameObjectMap.type;
		this.textureLocation = gameObjectMap.textureLocation;
		this.block = gameObjectMap.block;
		this.isCollectable = gameObjectMap.isCollectable;
	}
}

GameManager.prototype.changeElementSelected = function(index) {
	this.selection = index;
};

GameManager.prototype.toggleRays = function(data) {
	switch (data.type) {
		case 'altKey':
		if (this.raysActivated)
			this.raysActivated = false;
		else
			this.raysActivated = true;
	}
};

GameManager.prototype.changeWallTextureMap = function(image){
	this.textureMap = image;   
	this.globalGameObjectMap = [];
	let i = 0;
	for(i = 0; i < this.textureMap.width/64; i++){
		this.globalGameObjectMap.push({index: i, name: i, type: "wall", textureLocation: [i * 64, 0], isCollectable: false, block: true});
	}       
	this.selection = 0;
	this.editorControl.grid.refresh();
};
