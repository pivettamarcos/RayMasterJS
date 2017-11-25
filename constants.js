/*exported RAYS_ACTIVE, GAME_CANVAS_SIZE, GRID_DIMENSIONS, CELL_SIZE, NUM_RAYS, FOCAL_LENGTH, PLAYER_START_POSITION , PLAYER_SIZE, SHADING_TRANSPARENCY*/

const EDITOR_CANVAS_SIZE = { //PIXELS
	x: 400,
	y: 300
};

const GAME_CANVAS_SIZE = {
	x: 600,
	y: 300
};

const GRID_DIMENSIONS = {
	x: 64,
	y: 32
};

const CELL_SIZE = {
	x: 16,
	y: 16
};

const NUM_RAYS = 250; //columns drawn on game canvas
const FOCAL_LENGTH = (Math.PI / 3); // 60 degrees
const SHADING_TRANSPARENCY = 0.4;

const PLAYER_START_POSITION = {
    x: EDITOR_CANVAS_SIZE.x / 2,
    y: EDITOR_CANVAS_SIZE.y / 2
};

const PLAYER_SIZE = {
    x: 10,
    y: 10
};
const RAYS_ACTIVE = true;
