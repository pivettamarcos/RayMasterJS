class EditorControl{
    constructor(gameManager, textureMap, updateMiliseconds){
        this.gameManager = gameManager;
        this.textureMap = textureMap;

        this.playerCanvas = document.getElementById("playerCanvas");
        this.ctxPlayer = document.getElementById("playerCanvas").getContext("2d");
    
        this.editorCanvas = document.getElementById("editorCanvas");
        this.ctxEditor = this.editorCanvas.getContext("2d");

        this.sidebar = new Sidebar(document.getElementById("sidebar"), this);

        this.grid = new Grid(this, GRID_DIMENSIONS);

        this.updateMiliseconds = updateMiliseconds;
    }
}

EditorControl.prototype.initializePlayerView = function(player) {
    this.player = player;
};

EditorControl.prototype.update = function() {
    this.clearCanvases();
    this.drawPlayerBlimp();
};

EditorControl.prototype.clearCanvases = function(){
    this.ctxPlayer.clearRect(0, 0, this.ctxPlayer.canvas.clientWidth, this.ctxPlayer.canvas.clientHeight);
    this.sidebar.ctxSidebar.clearRect(0, 0, this.sidebar.width, this.sidebar.height);
};

EditorControl.prototype.drawPlayerBlimp = function(){
    this.drawRectangle(this.player.color, this.player.returnDrawCenter(), this.player.size);
    this.drawLine(PLAYER_BLIMP_FILL_COLOR, PLAYER_DIRECTION_LINE_WIDTH, this.player.position, {x: this.player.position.x + Math.cos(this.player.playerFacingAngle) * PLAYER_DIRECTION_LINE_SIZE, y:this.player.position.y + Math.sin(this.player.playerFacingAngle) * -PLAYER_DIRECTION_LINE_SIZE});
};

EditorControl.prototype.drawLine = function(color, lineWidth, origin, destination){
    this.ctxPlayer.beginPath();
	this.ctxPlayer.strokeStyle = color;
	this.ctxPlayer.moveTo(origin.x, origin.y);
	this.ctxPlayer.lineTo(destination.x, destination.y);
	this.ctxPlayer.stroke();
	this.ctxPlayer.closePath();
};

EditorControl.prototype.drawRectangle = function(color, origin, size){
    this.ctxPlayer.beginPath();
	this.ctxPlayer.rect(origin.x, origin.y, size.x, size.y);
	this.ctxPlayer.fillStyle = color;
	this.ctxPlayer.fill();
	this.ctxPlayer.closePath();
};

EditorControl.prototype.mouseEvent = function(data) {
	switch (data.clicked) {
		case true:
			switch (data.key) {
				case 0:
					this.grid.mouseInteraction(data.key, data.position);
			}
	}
};

EditorControl.prototype.fillCellGrid = function (attributes){    
    this.ctxEditor.beginPath();

    if(attributes.texture !== undefined){
        this.ctxEditor.drawImage(this.gameManager.textureMap, attributes.texture[0], attributes.texture[1], 64, 64, attributes.posX, attributes.posY, attributes.sizeX, attributes.sizeY);         
    }else{
        this.ctxEditor.fillStyle = CELL_EMPTY_FILL_COLOR;    
        this.ctxEditor.strokeStyle = CELL_EMPTY_BORDER_COLOR;

        this.ctxEditor.rect(attributes.posX, attributes.posY, attributes.sizeX, attributes.sizeY);
        this.ctxEditor.fill();
        this.ctxEditor.stroke();
    }
	
	this.ctxEditor.closePath();
};

class GameScreenControl{
    constructor(updateMiliseconds, editorControl){
        this.editorControl = editorControl;

        this.gameScreenCanvas = document.getElementById("gameScreen");
        this.ctxGameScreen = this.gameScreenCanvas.getContext("2d");

        this.ctxGameScreen.imageSmoothingEnabled = false;

        this.updateMiliseconds = updateMiliseconds;
    }
}

GameScreenControl.prototype.initializePlayerView = function(player){
    this.player = player;
    this.playerView = new PlayerView(player.position, this.editorControl, this);
};
    
GameScreenControl.prototype.update = function(){
    this.clearCanvas();

    if(this.playerView !== undefined && this.player !== undefined)
        this.playerView.castRays(this.player.playerFacingAngle);
};

GameScreenControl.prototype.clearCanvas = function(){
    this.ctxGameScreen.clearRect(0, 0, this.ctxGameScreen.canvas.clientWidth, this.ctxGameScreen.canvas.clientHeight); 
};

GameScreenControl.prototype.drawRectangle = function(isTextured, attributes){
    if(isTextured){
        this.ctxGameScreen.beginPath();
        this.ctxGameScreen.drawImage(attributes.img, attributes.sX, attributes.sY, attributes.sWidth, attributes.sHeight, attributes.x, attributes.y, attributes.width, attributes.height);
        this.ctxGameScreen.closePath();
    }else{
        this.ctxGameScreen.beginPath();
        this.ctxGameScreen.rect(attributes.x, attributes.y,attributes.width, attributes.height);
        this.ctxGameScreen.fillStyle = attributes.fillStyle;
        this.ctxGameScreen.fill();
        this.ctxGameScreen.closePath();
    }
};

class Sidebar{
    constructor(sidebarCanvas, editorControl){
        this.editorControl = editorControl;
        this.canvas = sidebarCanvas;
        this.ctxSidebar = sidebarCanvas.getContext('2d');

        this.firstDraw();
        this.setupListeners();
    }
}

Sidebar.prototype.setupListeners = function(){
    document.getElementById('getWallMap').addEventListener('change', this.changeWallTextureMap.bind(this), true);
    
    document.getElementById("browse-click").onclick = function(){ 
        document.getElementById("getWallMap").click();
        return false;
    };
};

Sidebar.prototype.firstDraw = function(){
    this.ctxSidebar.beginPath();
    if(this.editorControl.gameManager.gameObjectMap[this.editorControl.gameManager.selection])
        this.drawRectangle(true, {img: this.editorControl.gameManager.textureMap, sX: this.editorControl.gameManager.gameObjectMap[this.editorControl.gameManager.selection].textureLocation[0], sY: this.editorControl.gameManager.gameObjectMap[this.editorControl.gameManager.selection].textureLocation[1], sWidth: 64, sHeight: 64, x: 70, y: 64, width: 64, height:64}); 

    this.ctxSidebar.font = "20px Arial";
    this.ctxSidebar.fillText("Press buttons 1-6",25,200);
};

Sidebar.prototype.refresh  = function (selectionText){
    this.clearCanvas();
    this.drawRectangle(true, {img: this.editorControl.gameManager.textureMap, sX: this.editorControl.gameManager.gameObjectMap[0].textureLocation[0], sY: this.editorControl.gameManager.gameObjectMap[0].textureLocation[1], sWidth: 64, sHeight: 64, x: 70, y: 64, width: 64, height:64});     
	this.ctxSidebar.font = selectionText.fontType;
    this.ctxSidebar.fillText(selectionText.text,selectionText.x,selectionText.y);
};

Sidebar.prototype.clearCanvas = function(){
    this.ctxSidebar.clearRect(0,0, this.ctxSidebar.canvas.clientWidth, this.ctxSidebar.canvas.clientHeight);
};

Sidebar.prototype.drawRectangle = function(isTextured, attributes){
    if(isTextured){
        this.ctxSidebar.beginPath();
        this.ctxSidebar.drawImage(attributes.img, attributes.sX, attributes.sY, attributes.sWidth, attributes.sHeight, attributes.x, attributes.y, attributes.width, attributes.height);
        this.ctxSidebar.closePath();
    }else{
        this.ctxSidebar.beginPath();
        this.ctxSidebar.rect(attributes.x, attributes.y,attributes.width, attributes.height);
        this.ctxSidebar.fillStyle = attributes.fillStyle;
        this.ctxSidebar.fill();
        this.ctxSidebar.closePath();
    }
};

Sidebar.prototype.changeWallTextureMap = function(){
    let self = this;
    let file = document.getElementById("getWallMap").files[0];
    let reader = new FileReader();
    console.log(file);
    reader.onloadend = function(event){
        console.log(event);
        let dataUrl = event.target.result;

        let newTextureMap = new Image();
        newTextureMap.onload = function(){
            self.editorControl.gameManager.changeWallTextureMap(newTextureMap);
        };
        newTextureMap.src = dataUrl;
    };

    if(file){
        reader.readAsDataURL(file);
    }else{
        //newTextureMap.src = dataUrl;
    }
};