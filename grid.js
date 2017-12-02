/*exported Grid*/

function Grid(editorControl, size){
	this.cells = [];

	this.gridCenter = {
		x: EDITOR_CANVAS_SIZE.x, 
		y: EDITOR_CANVAS_SIZE.y
	};

	this.wallCollisionDistance = 0;

	this.editorControl = editorControl;

	this.buildGrid = function buildGrid(){
		var currentCellPos = {
			x: CELL_SIZE.x/2,
			y: CELL_SIZE.y/2
		};

		for(var y = 0; y < size.y; y++){				
			for(var x = 0; x < size.x; x++){
				this.cells.push(new Cell(currentCellPos));
				currentCellPos.x += CELL_SIZE.x;
			}
			currentCellPos.y += CELL_SIZE.y;
			currentCellPos.x = CELL_SIZE.y/2;
		}

		this.firstDraw();
	};

	this.firstDraw = function firstDraw(){
		for(var i = 0; i < this.cells.length; i++){
			this.fillGridCellWith(this.cells[i], undefined);
		}
	};

	this.refresh = function refresh(){
		for(var i = 0; i < this.cells.length; i++){
			if(this.cells[i].gameObjectOnCell)
				this.fillGridCellWith(this.cells[i], this.cells[i].gameObjectOnCell.textureLocation);
			else
			this.fillGridCellWith(this.cells[i], undefined);
		}
	};

	this.returnCellAtCoord = function returnCellAtCoord(worldCoord){
		return this.cells[worldCoord.x + worldCoord.y * GRID_DIMENSIONS.x];
	};

	this.convertToGridCoords = function convertToGridCoords(worldCoord){
		return {x: Math.floor(worldCoord.x/CELL_SIZE.x), y: Math.floor(worldCoord.y/CELL_SIZE.y)};
	};

	this.returnCoordAtPos = function returnCoordAtPos(posX, posY) {
        let coord = {
            x: Math.floor(posX / CELL_SIZE.x),
            y: Math.floor(posY / CELL_SIZE.y)
        };

        return coord;
    };

	this.returnGameObjectsWithinPoints= function returnGameObjectsWithinPoints(points){
		let collisionObjects = [];

		for(let i = 0; i < points.length; i++){
			let cellCollided = this.returnCellAtCoord(this.returnCoordAtPos(points[i].x, points[i].y));
			if(cellCollided){
				if(cellCollided.gameObjectOnCell){
					collisionObjects.push({cellCollided: cellCollided, point: i});
				}
			}
		}

		return collisionObjects;
	};

	this.mouseInteraction = function mouseInteraction(button, position){
		switch(button){ // LEFT CLICK
			case 0:
				for(let cell of this.cells){
					if(position.x > cell.position.x - cell.size.x/2 && position.x < cell.position.x + cell.size.x/2 && 
						position.y + scrollY > cell.position.y - cell.size.y/2 && position.y + scrollY < cell.position.y + cell.size.y/2){
							if(cell.gameObjectOnCell !== undefined){
								this.removeGameObjectFromCell(cell);
							}else{
								console.log(editorControl.gameManager);
								if(editorControl.gameManager.globalGameObjectMap[editorControl.gameManager.selection])
									this.addGameObjectToCell(cell, new GameObject(editorControl.gameManager.globalGameObjectMap[editorControl.gameManager.selection]));
							}
					}
				}
		}
	};

	this.buildGrid();
}

Grid.prototype.removeGameObjectFromCell = function(cell){
	console.log("** ((REMOV)) gameObject =="+ cell.gameObjectOnCell.name +"== from cell " + this.convertToGridCoords(cell.position).x + " " + this.convertToGridCoords(cell.position).y  +" **");	
	cell.gameObjectOnCell = undefined;
	this.fillGridCellWith(cell, undefined);
};

Grid.prototype.addGameObjectToCell = function(cell, object){
	console.log("** ((ADD)) gameObject =="+ object.name +"== to cell " + this.convertToGridCoords(cell.position).x + " " + this.convertToGridCoords(cell.position).y  +" **");
	cell.gameObjectOnCell = object;
	console.log(object.textureLocation);
	this.fillGridCellWith(cell, object.textureLocation);
};

Grid.prototype.fillGridCellWith = function(cell, texture){
	if(texture !== undefined){
		let fillAttributes = {texture: texture, posX: cell.returnDrawCenter().x, posY: cell.returnDrawCenter().y, sizeX: cell.size.x ,sizeY: cell.size.y};
		this.editorControl.fillCellGrid(fillAttributes);
	}else{
		let fillAttributes = {posX: cell.returnDrawCenter().x, posY: cell.returnDrawCenter().y, sizeX: cell.size.x ,sizeY: cell.size.y};
		this.editorControl.fillCellGrid(fillAttributes);
	}
};

Grid.prototype.changeGameObjectsvisiblity = function(option){
	for(var i = 0; i < this.cells.length; i++){
		if(this.cells[i].gameObjectOnCell)
			this.cells[i].gameObjectOnCell.isVisible = option;
	}
}	
