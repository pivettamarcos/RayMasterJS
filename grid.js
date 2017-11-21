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
					collisionObjects.push({object: cellCollided.gameObjectOnCell, point: i});
				}
			}
		}

		return collisionObjects;
	};

	this.mouseInteraction = function mouseInteraction(button){
		switch(button){ // LEFT CLICK
			case mouse.MOUSE1:
				for(let cell of this.cells){
					if(mouse.position.x > cell.position.x - cell.size.x/2 && mouse.position.x < cell.position.x + cell.size.x/2 && 
						mouse.position.y + scrollY > cell.position.y - cell.size.y/2 && mouse.position.y + scrollY < cell.position.y + cell.size.y/2){
							if(cell.gameObjectOnCell !== undefined)
								this.removeGameObjectFromCell(cell);
							else
								this.addGameObjectToCell(cell, new GameObject(gameObjectMap[selection]));
					}
				}
		}
	};

	this.buildGrid();
}

Grid.prototype.removeGameObjectFromCell = function(cell){
	cell.gameObjectOnCell = undefined;
	this.fillCellWith(undefined);
};

Grid.prototype.addGameObjectToCell = function(cell, object){
	console.log("** ((ADDED)) game object =="+ object.name +"== to cell " + grid.convertToGridCoords(this.position).x + " " + grid.convertToGridCoords(this.position).y  +" **");
	this.gameObjectOnCell = object;
	this.fillGridCellWith(cell, cell.gameObjectOnCell.textureLocation);
};

Grid.prototype.fillGridCellWith = function(cell, texture){
	let fillAttributes = {texture: texture, posX: cell.returnDrawCenter().x, posY: cell.returnDrawCenter().y, sizeX: cell.size.x ,sizeY: cell.size.y};
	this.editorControl.fillCellGrid(fillAttributes);
};


class Cell{
	constructor(position){
		this.position = {};
		this.position.x = position.x;
		this.position.y = position.y;

		this.size = {};
		this.size.x = CELL_SIZE.x;
		this.size.y = CELL_SIZE.y;

		this.selection = undefined;

		this.gameObjectOnCell = undefined;

		this.unfilledCellColor = "#FFFFFF";
	}
}

Cell.prototype.returnDrawCenter = function(){
	let drawCenter = {};
	drawCenter.x = this.position.x - this.size.x/2;
	drawCenter.y = this.position.y - this.size.y/2;
	return drawCenter;
};

