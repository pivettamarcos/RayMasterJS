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

        //this.firstDraw();
        this.setupListeners();
    }
}

Sidebar.prototype.setupListeners = function(){
    let self = this;
    document.getElementById('getWallMap').addEventListener('change', this.changeWallTextureMap.bind(this), true);
    
    document.getElementById("browse-click").onclick = function(){ 
        document.getElementById("getWallMap").click();
        return false;
    };


    document.getElementById('gameObjectType').addEventListener('change', function(){
        let changeGameObjectAttributeBinded = self.changeGameObjectAttribute.bind(self);
        changeGameObjectAttributeBinded("type");
    }, true);

    document.getElementById('isCollectableSpriteSelect').addEventListener('change', function(){
        let changeGameObjectAttributeBinded = self.changeGameObjectAttribute.bind(self);
        changeGameObjectAttributeBinded("collectability");
    }, true);

    document.getElementById('isBlockSpriteSelect').addEventListener('change', function(){
        let changeGameObjectAttributeBinded = self.changeGameObjectAttribute.bind(self);
        changeGameObjectAttributeBinded("blockabillity");
    }, true);
    //document.getElementById('gameObjectType').addEventListener('change', changeGameObjectAttributeBinded("type"), true);  
    //document.getElementById('isCollectableSpriteSelect').addEventListener('change', changeGameObjectAttributeBinded("collectability"), true);        
};

Sidebar.prototype.firstDraw = function(){
    this.ctxSidebar.beginPath();
    if(this.editorControl.gameManager.globalGameObjectMap[this.editorControl.gameManager.selection])
        this.drawRectangle(true, {img: this.editorControl.gameManager.textureMap, sX: this.editorControl.gameManager.globalGameObjectMap[this.editorControl.gameManager.selection].textureLocation[0], sY: this.editorControl.gameManager.globalGameObjectMap[this.editorControl.gameManager.selection].textureLocation[1], sWidth: 64, sHeight: 64, x: 70, y: 64, width: 64, height:64}); 

    this.ctxSidebar.font = "20px Arial";
    this.ctxSidebar.fillText("Press buttons 1-6",25,200);
    this.populateWallUnits(this.editorControl.gameManager.globalGameObjectMap);
    this.selectCurrentWorkingGameObject(0);
};

Sidebar.prototype.refreshAll  = function (selectionText){
    this.clearCanvas(0,0, this.ctxSidebar.canvas.clientWidth, this.ctxSidebar.canvas.clientHeight);
    this.drawRectangle(true, {img: this.editorControl.gameManager.textureMap, sX: this.editorControl.gameManager.globalGameObjectMap[0].textureLocation[0], sY: this.editorControl.gameManager.globalGameObjectMap[0].textureLocation[1], sWidth: 64, sHeight: 64, x: 70, y: 64, width: 64, height:64});     
	this.ctxSidebar.font = selectionText.fontType;
    this.ctxSidebar.fillText(selectionText.text,selectionText.x,selectionText.y);
};

Sidebar.prototype.refreshTexture = function(){
    this.clearCanvas(70,64,64,64);
};

Sidebar.prototype.clearCanvas = function(x,y,w,h){
    this.ctxSidebar.clearRect(x,y, w,h);
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

Sidebar.prototype.populateWallUnits = function(wallMap){
    let self = this;
    document.getElementById("wallUnits").innerHTML = "";
    let finalWidth = 4;
    for(let wallUnit of wallMap){
        let wallUnitCanvas = document.createElement("canvas");
        wallUnitCanvas.data = wallUnit;
        document.getElementById("wallUnits").appendChild(wallUnitCanvas);

        wallUnitCanvas.width = 25;
        wallUnitCanvas.height = 25;
        wallUnitCanvas.addEventListener("click", function(e){
            e.toElement.style.border = "1px solid red";
            self.selectCurrentWorkingGameObject(this.data.index);
        });
        finalWidth += 25;
        wallUnitCanvas.getContext("2d").drawImage(this.editorControl.gameManager.textureMap, wallUnit.textureLocation[0], wallUnit.textureLocation[1], 64, 64, 0, 0, 25,25);        
    }
    console.log(document.getElementById("wallUnits").style.width = finalWidth + "px");
};

Sidebar.prototype.selectCurrentWorkingGameObject = function(selection){
    this.editorControl.gameManager.changeElementSelected(selection);

    document.getElementById("isCollectableSpriteDiv").style.display = 'none';     
    document.getElementById("isBlockSpriteDiv").style.display = 'none';     

    document.getElementById("gameObjectType").innerHTML = "";
    for(let x = 0; x < document.getElementById("wallUnits").children.length; x++){
        document.getElementById("wallUnits").children[x].style.border = "0px";
        if(x == selection){
            let option1,option2;
            if(document.getElementById("wallUnits").children[x].data.type == "wall"){
                option1 = document.createElement("option");
                option1.text = "wall";
    
                option2 = document.createElement("option");
                option2.text = "sprite";
            }else if("sprite"){
                option1 = document.createElement("option");
                option1.text = "sprite";
    
                option2 = document.createElement("option");
                option2.text = "wall";
            }

            document.getElementById("wallUnits").children[x].style.border = "2px solid #0000ff";

            let select = document.getElementById("gameObjectType");
            select.add(option1);
            select.add(option2);
        }
    }
};

Sidebar.prototype.changeGameObjectAttribute = function(attribute){
    if(document.getElementById("gameObjectType").options[document.getElementById("gameObjectType").selectedIndex]){
        console.log(attribute);
        if(attribute == "type"){
            let selectedType = document.getElementById("gameObjectType").options[document.getElementById("gameObjectType").selectedIndex].value;
            if(selectedType == "wall"){
                document.getElementById("isCollectableSpriteDiv").style.display = 'none';     
                document.getElementById("isBlockSpriteDiv").style.display = 'none';     
                this.editorControl.gameManager.globalGameObjectMap[this.editorControl.gameManager.selection].type = selectedType;
            }else if(selectedType == "sprite"){
                let collectableSelect = document.getElementById("isCollectableSpriteDiv");
                let blockableSelect = document.getElementById("isBlockSpriteDiv");
                
                collectableSelect.style.display = 'block';
                blockableSelect.style.display = 'block';

                this.editorControl.gameManager.globalGameObjectMap[this.editorControl.gameManager.selection].type = selectedType;        
            }
        }else if(attribute == "collectability"){
            let selectedType = document.getElementById("isCollectableSpriteSelect").options[document.getElementById("isCollectableSpriteSelect").selectedIndex].value;
            let booleanAnswer = (selectedType == "yes" ? true : false)
            this.editorControl.gameManager.globalGameObjectMap[this.editorControl.gameManager.selection].isCollectable = booleanAnswer;        
        }else if(attribute == "blockabillity"){
            let selectedType = document.getElementById("isBlockSpriteSelect").options[document.getElementById("isBlockSpriteSelect").selectedIndex].value;
            console.log(selectedType);
            
            let booleanAnswer = (selectedType == "yes" ? true : false) ;           
            this.editorControl.gameManager.globalGameObjectMap[this.editorControl.gameManager.selection].block = booleanAnswer;                        
        }
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
            self.populateWallUnits(self.editorControl.gameManager.globalGameObjectMap);
            self.selectCurrentWorkingGameObject(0);            
        };
        newTextureMap.src = dataUrl;
    };

    if(file){
        reader.readAsDataURL(file);
    }else{
        //newTextureMap.src = dataUrl;
    }
};