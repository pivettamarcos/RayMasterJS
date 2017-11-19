/*exported Grid*/

function Grid(size){
	this.cells = [];

	this.gridCenter = {
		x: EDITOR_CANVAS_SIZE.x, 
		y: EDITOR_CANVAS_SIZE.y
	};

	this.wallCollisionDistance = 0;

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
			this.cells[i].fillCellWith(undefined);
		}
	};

	this.returnCellAtCoord = function returnCellAtCoord(worldCoord){
		return this.cells[worldCoord.x + worldCoord.y * GRID_DIMENSIONS.x];
	};

	this.convertToGridCoords = function convertToGridCoords(worldCoord){
		return {x: Math.floor(worldCoord.x/CELL_SIZE.x), y: Math.floor(worldCoord.y/CELL_SIZE.y)};
	};

	this.returnGameObjectsWithinPoints= function returnGameObjectsWithinPoints(points){
		let collisionObjects = [];

		for(let i = 0; i < points.length; i++){
			let cellCollided = this.returnCellAtCoord(player.returnCoordAtPos(points[i].x, points[i].y));
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
								cell.removeGameObject();
							else
								cell.addGameObject(new GameObject(gameObjectMap[selection]));
					}
				}
		}
	};

	this.buildGrid();
}

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

	fillCellWith(texture){
		ctxGrid.beginPath();
		ctxGrid.strokeStyle = "#000000";

		if(texture === undefined){
			ctxGrid.fillStyle = this.unfilledCellColor;
			ctxGrid.rect(this.returnDrawCenter().x, this.returnDrawCenter().y, this.size.x, this.size.y);
			ctxGrid.fill();
		}else{
			ctxGrid.rect(this.returnDrawCenter().x, this.returnDrawCenter().y, this.size.x, this.size.y);
			ctxGrid.fill();
			ctxGrid.drawImage(textureMap, texture[0], texture[1], 64, 64, this.returnDrawCenter().x,this.returnDrawCenter().y, this.size.x,this.size.y); 
		}

		ctxGrid.stroke();
		ctxGrid.closePath();
	}

	returnDrawCenter(){
		let drawCenter = {};
		drawCenter.x = this.position.x - this.size.x/2;
		drawCenter.y = this.position.y - this.size.y/2;
		return drawCenter;
	}

	removeGameObject(){
		this.gameObjectOnCell = undefined;
		this.fillCellWith(undefined);
	}

	addGameObject(object){
		console.log("** ((ADDED)) game object =="+ object.name +"== to cell " + grid.convertToGridCoords(this.position).x + " " + grid.convertToGridCoords(this.position).y  +" **");
		this.gameObjectOnCell = object;
		this.fillCellWith(this.gameObjectOnCell.textureLocation);
	}
}