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

