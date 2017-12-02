/*exported DEFAULT_ASSET_TEXTURE_MAP, CELL_EMPTY_FILL_COLOR, CELL_EMPTY_BORDER_COLOR, PLAYER_BLIMP_FILL_COLOR, RAY_DEFAULT_LINE_COLOR,
PLAYER_DIRECTION_LINE_WIDTH, RAY_INTERCEPTED_LINE_COLOR, PLAYER_DIRECTION_LINE_SIZE, RAY_LINE_WIDTH,
UPDATE_MILISECONDS, RAYS_ACTIVE, GAME_CANVAS_SIZE, GRID_DIMENSIONS, CELL_SIZE, NUM_RAYS, FOCAL_LENGTH, 
PLAYER_START_POSITION , PLAYER_SIZE, SHADING_TRANSPARENCY*/

//const UPDATE_MILISECONDS = 10;

//OTHER

class GlobalFunctions{
    constructor(){}
};

const globalFunctions = new GlobalFunctions();

GlobalFunctions.prototype.drawOn2DContext = function(context, type, attributes){
	switch(type){
		case "line":
			context.lineWidth = attributes.strokeWidth;
			context.strokeStyle = attributes.strokeColor;

			context.beginPath();
			
			context.moveTo(attributes.origin.x, attributes.origin.y);
			context.lineTo(attributes.destination.x, attributes.destination.y);
			context.stroke();
			context.closePath();
		break;
		case "rectangle":
			context.lineWidth = attributes.strokeWidth;
			context.strokeStyle = attributes.strokeColor;
			context.fillStyle = attributes.fillColor;

			context.beginPath();

			context.rect(attributes.x, attributes.y, attributes.width, attributes.height);
			if(attributes.strokeWidth != 0 && attributes.strokeWidth !== undefined)
				context.strokeRect(attributes.x, attributes.y, attributes.width, attributes.height);
			
			context.fill();
			context.closePath();
		break;

		case "image":
			context.drawImage(attributes.image, attributes.ix, attributes.iy, attributes.iwidth, attributes.iheight, attributes.x, attributes.y, attributes.width, attributes.height);         		
		break;

		case "clear":
			context.clearRect(attributes.x, attributes.y, attributes.width, attributes.height);
	}
}

const DEFAULT_ASSET_TEXTURE_MAP = "textures/textureMap.png";

const EDITOR_CANVAS_SIZE = { //PIXELS
	x: 400,
	y: 300
};

const GAME_CANVAS_SIZE = {
	x: 600,
	y: 300
};

const SHADING_TRANSPARENCY = 0.4;

//GRID
const GRID_DIMENSIONS = {
	x: 64,
	y: 32
};

const CELL_SIZE = {
	x: 16,
	y: 16
};

const CELL_EMPTY_FILL_COLOR = "#ffffff";    
const CELL_EMPTY_BORDER_COLOR = "#888888";


//PLAYER 
const PLAYER_START_POSITION = {
    x: EDITOR_CANVAS_SIZE.x / 2,
    y: EDITOR_CANVAS_SIZE.y / 2
};

const PLAYER_SIZE = {
    x: 10,
    y: 10
};

const PLAYER_BLIMP_FILL_COLOR = "#ff0000";
const PLAYER_DIRECTION_LINE_COLOR = "#0000ff";
const PLAYER_DIRECTION_LINE_WIDTH = 1;
const PLAYER_DIRECTION_LINE_SIZE = 50;

//RAYS
const NUM_RAYS = 200; //columns drawn on game canvas
const FOCAL_LENGTH = (Math.PI / 3); // 60 degrees
const RAY_DEFAULT_LINE_COLOR = "#ff0000";
const RAY_INTERCEPTED_LINE_COLOR = "#afafaf";
const RAY_LINE_WIDTH = 1;

//TEXTUREMAP
const DEFAULT_TEXTUREMAP_UNIT_HEIGHT = 64;
const DEFAULT_TEXTUREMAP_UNIT_WIDTH = 64;

const DEFAULT_WALLUNIT_WIDTH = 25;
const DEFAULT_WALLUNIT_HEIGHT = 25;