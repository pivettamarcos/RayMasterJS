class EditorControl{
    constructor(textureMap, updateMiliseconds){
        this.textureMap = textureMap;

        this.playerCanvas = document.getElementById("playerCanvas");
        this.ctxPlayer = document.getElementById("playerCanvas").getContext("2d");
    
        this.editorCanvas = document.getElementById("editorCanvas");
        this.ctxEditor = this.editorCanvas.getContext("2d");

        this.sidebar = new Sidebar(document.getElementById("sidebar"));

        this.grid = new Grid(this, GRID_DIMENSIONS);
        this.player = new Player(this);

        this.updateMiliseconds = updateMiliseconds;

        this.updateClass = setInterval(this.update.bind(this), updateMiliseconds);
    }
}

EditorControl.prototype.update = function() {
	//ctxGrid.clearRect(0, 0, canvasGrid.width, canvasGrid.height);
	this.ctxPlayer.clearRect(0, 0, 1000, 1000);

	this.sidebar.ctxSidebar.clearRect(0, 0, this.sidebar.width, this.sidebar.height);
	this.sidebar.ctxSidebar.clearRect(0, 0, 1000, 1000);
	//ctx.drawImage(textureMap,10,10);
	//mouse.update();
    this.drawPlayer();
};

EditorControl.prototype.drawPlayer = function(){
    this.ctxPlayer.beginPath();
    this.ctxPlayer.rect(this.player.returnDrawCenter().x, this.player.returnDrawCenter().y, this.player.size.x, this.player.size.y);
    this.ctxPlayer.fillStyle = this.player.color;
    this.ctxPlayer.fill();
    this.ctxPlayer.closePath();

    this.ctxPlayer.beginPath();
    this.ctxPlayer.strokeStyle = "#0000ff";
    this.ctxPlayer.lineWidth=3;			
    this.ctxPlayer.moveTo(this.player.position.x, this.player.position.y);
    this.ctxPlayer.lineTo(this.player.position.x + Math.cos(this.player.playerFacingAngle) * 50, this.player.position.y + Math.sin(this.player.playerFacingAngle) * - 50);
    this.ctxPlayer.stroke();
};

EditorControl.prototype.drawRayLineOnCanvas = function(color, origin, destination){
	this.ctxPlayer.beginPath();
	this.ctxPlayer.rect(destination.x - 1, destination.y - 1, 4, 4);
	this.ctxPlayer.fillStyle = "#ffaa00";
	this.ctxPlayer.fill();
	this.ctxPlayer.closePath();

	this.ctxPlayer.beginPath();
	this.ctxPlayer.strokeStyle = color;
	this.ctxPlayer.moveTo(origin.x, origin.y);
	this.ctxPlayer.lineTo(destination.x, destination.y);
	this.ctxPlayer.stroke();
	this.ctxPlayer.closePath();
};

EditorControl.prototype.mouseEvent = function(button, eventType) {
	switch (eventType) {
		case mouse.CLICKED:
			switch (button) {
				case mouse.MOUSE1:
					grid.mouseInteraction(mouse.MOUSE1);
			}
	}
};

EditorControl.prototype.fillCellGrid = function (attributes){    
    this.ctxEditor.beginPath();
    this.ctxEditor.fillStyle = "#ffffff";    
	this.ctxEditor.strokeStyle = "#000000";

    if(attributes.texture !== undefined){
        this.ctxEditor.drawImage(this.textureMap, attributes.texture[0], attributes.texture[1], 64, 64, attributes.posX, attributes.posY, attributes.sizeX, attributes.sizeY);         
    }else{
        this.ctxEditor.rect(attributes.posX, attributes.posY, attributes.sizeX, attributes.sizeY);
        this.ctxEditor.fill();
        this.ctxEditor.stroke();
    
    }
	
	this.ctxEditor.closePath();
};

class GameScreenControl{
    constructor(updateMiliseconds){
        this.gameScreenCanvas = document.getElementById("gameScreen");
        this.ctxGameScreen = this.gameScreenCanvas.getContext("2d");

        this.ctxGameScreen.imageSmoothingEnabled = false;

        this.updateMiliseconds = updateMiliseconds;

        this.updateClass = setInterval(this.update.bind(this), updateMiliseconds);
    }
}

GameScreenControl.prototype.update = function(){
    this.ctxGameScreen.clearRect(0, 0, 1000, 1000);
};




class Sidebar{
    constructor(sidebarCanvas){
        this.canvas = sidebarCanvas;
        this.ctxSidebar = sidebarCanvas.getContext('2d');
    }
}

Sidebar.prototype.update = function(){
    this.ctxSidebar.beginPath();

    if(gameObjectMap[selection])
        this.ctxSidebar.drawImage(textureMap, gameObjectMap[selection].textureLocation[0], gameObjectMap[selection].textureLocation[1], 64, 64, 70, 64, 64,64); 

    this.ctxSidebar.font = "20px Arial";
    this.ctxSidebar.fillText("Press buttons 1-7",25,200);
};
