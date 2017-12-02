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
    globalFunctions.drawOn2DContext(this.ctxPlayer, "clear", {x: 0, y: 0, width: this.ctxPlayer.canvas.clientWidth, height: this.ctxPlayer.canvas.clientHeight});
};

EditorControl.prototype.drawPlayerBlimp = function(){
    globalFunctions.drawOn2DContext(this.ctxPlayer, "rectangle", {strokeWidth: 0, fillColor: PLAYER_BLIMP_FILL_COLOR, strokeColor: undefined, x: this.player.returnDrawCenter().x, y: this.player.returnDrawCenter().y, width: this.player.size.x, height: this.player.size.y});
    globalFunctions.drawOn2DContext(this.ctxPlayer, "line", {strokeWidth: PLAYER_DIRECTION_LINE_WIDTH, strokeColor: PLAYER_DIRECTION_LINE_COLOR, origin: {x: this.player.position.x, y:this.player.position.y}, 
        destination: {x: this.player.position.x + Math.cos(this.player.playerFacingAngle) * PLAYER_DIRECTION_LINE_SIZE,y: this.player.position.y + Math.sin(this.player.playerFacingAngle) * -PLAYER_DIRECTION_LINE_SIZE}});
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
        globalFunctions.drawOn2DContext(this.ctxEditor, "image", {image: this.gameManager.textureMap, ix: attributes.texture[0], iy: attributes.texture[1], iwidth: DEFAULT_TEXTUREMAP_UNIT_WIDTH, iheight: DEFAULT_TEXTUREMAP_UNIT_HEIGHT, 
            x: attributes.posX, y: attributes.posY, width: attributes.sizeX, height: attributes.sizeY});        
        //this.ctxEditor.drawImage(this.gameManager.textureMap, attributes.texture[0], attributes.texture[1], 64, 64, attributes.posX, attributes.posY, attributes.sizeX, attributes.sizeY);         
    }else{
        globalFunctions.drawOn2DContext(this.ctxEditor, "rectangle", {strokeWidth: 1, strokeColor: CELL_EMPTY_BORDER_COLOR, fillColor: CELL_EMPTY_FILL_COLOR,
            x: attributes.posX, y: attributes.posY, width: attributes.sizeX-1, height: attributes.sizeY-1});
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
    globalFunctions.drawOn2DContext(this.ctxGameScreen, "clear", {x: 0,y: 0,width: this.ctxGameScreen.canvas.clientWidth, height: this.ctxGameScreen.canvas.clientHeight});
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
    this.populateWallUnits(this.editorControl.gameManager.globalGameObjectMap);
    this.selectCurrentWorkingGameObject(0);
};

Sidebar.prototype.populateWallUnits = function(wallMap){
    let self = this;
    let wallUnitsDiv =  document.getElementById("wallUnits");
    wallUnitsDiv.innerHTML = "";
    let finalWidth = 4;

    for(let wallUnit of wallMap){
        let wallUnitCanvas = document.createElement("canvas");
        wallUnitCanvas.data = wallUnit;
        wallUnitsDiv.appendChild(wallUnitCanvas);

        wallUnitCanvas.width = DEFAULT_WALLUNIT_WIDTH;
        wallUnitCanvas.height = DEFAULT_WALLUNIT_HEIGHT;
        wallUnitCanvas.addEventListener("click", function(e){
            e.toElement.style.border = "1px solid red";
            self.selectCurrentWorkingGameObject(this.data.index);
        });
        finalWidth += DEFAULT_WALLUNIT_WIDTH;

        globalFunctions.drawOn2DContext(wallUnitCanvas.getContext("2d"), "image", {image: this.editorControl.gameManager.textureMap, ix: wallUnit.textureLocation[0], iy: wallUnit.textureLocation[1], iwidth: DEFAULT_TEXTUREMAP_UNIT_WIDTH, iheight: DEFAULT_TEXTUREMAP_UNIT_HEIGHT, 
            x: 0, y: 0, width: DEFAULT_WALLUNIT_WIDTH, height: DEFAULT_WALLUNIT_HEIGHT});  

        wallUnitCanvas.getContext("2d").drawImage(this.editorControl.gameManager.textureMap, wallUnit.textureLocation[0], wallUnit.textureLocation[1], 64, 64, 0, 0, 25,25);        
    }

   wallUnitsDiv.style.width = finalWidth + "px";
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
            option1 = document.createElement("option");
            option2 = document.createElement("option");
            if(document.getElementById("wallUnits").children[x].data.type == "wall"){
                this.showSpriteOptions(document.getElementById("wallUnits").children[x].data, false);
                this.showWallOptions(document.getElementById("wallUnits").children[x].data,true);
                option1.text = "wall";
                option2.text = "sprite";
            }else if("sprite"){
                this.showSpriteOptions(document.getElementById("wallUnits").children[x].data, true);
                option1.text = "sprite";
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
        let gameObjectSelected = this.editorControl.gameManager.globalGameObjectMap[this.editorControl.gameManager.selection];

        if(attribute == "type"){
            let selectedType = document.getElementById("gameObjectType").options[document.getElementById("gameObjectType").selectedIndex].value;
            if(selectedType == "wall"){
                this.showSpriteOptions(gameObjectSelected, false);
                this.showWallOptions(gameObjectSelected,true);
                gameObjectSelected.type = selectedType;
            }else if(selectedType == "sprite"){
                this.showSpriteOptions(gameObjectSelected, true);
                gameObjectSelected.type = selectedType;        
            }
        }else if(attribute == "collectability"){
            let selectedType = document.getElementById("isCollectableSpriteSelect").options[document.getElementById("isCollectableSpriteSelect").selectedIndex].value;
            let booleanAnswer = (selectedType == "yes" ? true : false);
            gameObjectSelected.isCollectable = booleanAnswer;        
        }else if(attribute == "blockabillity"){
            let selectedType = document.getElementById("isBlockSpriteSelect").options[document.getElementById("isBlockSpriteSelect").selectedIndex].value;

            let booleanAnswer = (selectedType == "yes" ? true : false) ;           
            gameObjectSelected.block = booleanAnswer;                        
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

Sidebar.prototype.showSpriteOptions = function(gameObjectSelected, show){
    let collectableDiv = document.getElementById("isCollectableSpriteDiv");
    let blockableDiv = document.getElementById("isBlockSpriteDiv");
    
    let collectableSelect = document.getElementById("isCollectableSpriteSelect");
    let blockableSelect = document.getElementById("isBlockSpriteSelect");
    if(show){
        collectableDiv.style.display = 'block';
        collectableSelect.innerHTML = "";

        let option1,option2;
        option1 = document.createElement("option");
        option2 = document.createElement("option");
        console.log(gameObjectSelected.isCollectable);
        if(gameObjectSelected.isCollectable){
            option1.text = "yes";
            option2.text = "no";
        }else{
            option1.text = "no";
            option2.text = "yes";
        }
        collectableSelect.add(option1);
        collectableSelect.add(option2);
        console.log(collectableSelect);

        blockableDiv.style.display = 'block';
        blockableSelect.innerHTML = "";
        
        option1 = document.createElement("option");
        option2 = document.createElement("option");
        if(gameObjectSelected.block){
            option1.text = "yes";
            option2.text = "no";
        }else{
            option1.text = "no";
            option2.text = "yes";
        }
        blockableSelect.add(option1);
        blockableSelect.add(option2);
    }else{
        collectableDiv.style.display = 'none';
        blockableDiv.style.display = 'none';
    }
}

Sidebar.prototype.showWallOptions = function(gameObjectSelected, show){
    let blockableDiv = document.getElementById("isBlockSpriteDiv");
    
    let blockableSelect = document.getElementById("isBlockSpriteSelect");
    if(show){
        let option1, option2;
        blockableDiv.style.display = 'block';
        blockableSelect.innerHTML = "";
        
        option1 = document.createElement("option");
        option2 = document.createElement("option");
        if(gameObjectSelected.block){
            option1.text = "yes";
            option2.text = "no";
        }else{
            option1.text = "no";
            option2.text = "yes";
        }
        blockableSelect.add(option1);
        blockableSelect.add(option2);
        console.log(blockableSelect);
    }else{
        blockableDiv.style.display = 'none';
    }
};