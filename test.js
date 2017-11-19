/*function Ray(rayAngle, i) {
    this.rayAngle = rayAngle;
    
    this.position = {};
    this.position.x = player.position.x;
    this.position.y = player.position.y;

    this.playerFacing = undefined;

    this.i = i;

    this.headingVector = {};
    this.headingVector.x = Math.cos(rayAngle);
    this.headingVector.y = Math.sin(rayAngle);

    this.intersections = {
        horizontalIntersection: {
            x: undefined,
            y: undefined,
            hasWall: undefined
        },

        verticalIntersection: {
            x: undefined,
            y: undefined,
            hasWall: undefined
        }
    }

    this.currentIntersectionPoint = undefined;

    this.visibleSprites = [];

    this.returnObject = {
        intersectionX: undefined,
        intersectionY: undefined,
        isWall: false
    };
    this.print = 0;

    this.castRay = function castRay() {
        this.rayDirection = this.returnRayDirection();
        this.findFirstIntersection();

        var distanceLimit = 0;

        while (!this.intersections.horizontalIntersection.hasWall) {
            if (this.rayDirection.up)
                if (distanceLimit > Math.floor(player.position.y / DEFAULT_CELL_SIZE.x) - 2)
                    break;

            if (this.rayDirection.down)
                if (distanceLimit > Math.floor((EDITOR_SIZE.y - player.position.y) / DEFAULT_CELL_SIZE.y) - 2)
                    break;

            this.moveToNextIntersectionPoint(0);

            distanceLimit++;
        }

        var distanceLimit = 0;

        while (!this.intersections.verticalIntersection.hasWall) {

            if (this.rayDirection.right)
                if (distanceLimit > Math.floor((EDITOR_SIZE.x - player.position.x) / DEFAULT_CELL_SIZE.x) - 2)
                    break;

            if (this.rayDirection.left)
                if (distanceLimit > Math.floor(player.position.x / DEFAULT_CELL_SIZE.x) - 2)
                    break;

            this.moveToNextIntersectionPoint(1);

            distanceLimit++;
        }


        var distanceHorizontal = Math.sqrt(Math.pow(player.position.x - this.intersections.horizontalIntersection.x, 2) + Math.pow(player.position.y - this.intersections.horizontalIntersection.y, 2));
        var distanceVertical = Math.sqrt(Math.pow(player.position.x - this.intersections.verticalIntersection.x, 2) + Math.pow(player.position.y - this.intersections.verticalIntersection.y, 2));

        if (distanceVertical < distanceHorizontal) {
            var coordCell = {
                x: Math.floor(this.intersections.verticalIntersection.x / DEFAULT_CELL_SIZE.x),
                y: Math.floor(this.intersections.verticalIntersection.y / DEFAULT_CELL_SIZE.y)
            };

            var cellObject = grid.returnCellAtCoord(coordCell);

            if (raysActivated) {
                this.drawRay(player.position, {x: this.intersections.verticalIntersection.x, y: this.intersections.verticalIntersection.y});
            }

            this.returnObject = {
                intersectionX: this.intersections.verticalIntersection.x,
                intersectionY: this.intersections.verticalIntersection.y,
                isHorizontalIntersection: false,
                isVerticalIntersection: true,
                gameObject: cellObject.gameObjectOnCell
            };

            return this.returnObject;

        } else {

            var coordCell = {
                x: Math.floor(this.intersections.horizontalIntersection.x / DEFAULT_CELL_SIZE.x),
                y: Math.floor(this.intersections.horizontalIntersection.y / DEFAULT_CELL_SIZE.y)
            };

            var cellObject = grid.returnCellAtCoord(coordCell);

            if (raysActivated) {
                this.drawRay(player.position, {x: this.intersections.horizontalIntersection.x, y: this.intersections.horizontalIntersection.y});
            }

            this.returnObject = {
                intersectionX: this.intersections.horizontalIntersection.x,
                intersectionY: this.intersections.horizontalIntersection.y,
                isHorizontalIntersection: true,
                isVerticalIntersection: false, 
                gameObject: cellObject.gameObjectOnCell
            };

            return this.returnObject;
        }

        //return this.returnObject;
    };

    this.drawRay = function drawRay(origin, destination){
        ctxGrid.beginPath();
        ctxGrid.rect(destination.x, destination.y, 2, 2);
        ctxGrid.fillStyle = "#FFFF00";
        ctxGrid.fill();
        ctxGrid.closePath();

        ctxGrid.beginPath();
        ctxGrid.strokeStyle = "#000000";
        ctxGrid.moveTo(origin.x, origin.y);
        ctxGrid.lineTo(destination.x, destination.y);
        ctxGrid.stroke();
        ctxGrid.closePath();
    }

    this.findFirstIntersection = function findFirstIntersection() {
        if (this.intersections.horizontalIntersection.x === undefined) {
            if (this.rayDirection.up)
                this.intersections.horizontalIntersection.y = Math.floor(player.position.y / DEFAULT_CELL_SIZE.y) * (DEFAULT_CELL_SIZE.y) - 0.1;
            else if (this.rayDirection.down)
                this.intersections.horizontalIntersection.y = Math.floor(player.position.y / DEFAULT_CELL_SIZE.y) * (DEFAULT_CELL_SIZE.y) + DEFAULT_CELL_SIZE.y;

            if (Math.tan(this.rayAngle)) {
                this.intersections.horizontalIntersection.x = (player.position.x + (player.position.y - this.intersections.horizontalIntersection.y) / Math.tan(this.rayAngle));
            }

            var coordCell = {
                x: Math.floor(this.intersections.horizontalIntersection.x / DEFAULT_CELL_SIZE.x),
                y: Math.floor(this.intersections.horizontalIntersection.y / DEFAULT_CELL_SIZE.y)
            };

            if (grid.returnCellAtCoord(coordCell) !== undefined) 
                if (grid.returnCellAtCoord(coordCell).gameObjectOnCell !== undefined) 
                    if (grid.returnCellAtCoord(coordCell).gameObjectOnCell.type == "wall")
                        this.intersections.horizontalIntersection.hasWall = true;

        }

        if (this.intersections.verticalIntersection.x === undefined) {
            if (this.rayDirection.right)
                this.intersections.verticalIntersection.x = Math.floor(player.position.x / DEFAULT_CELL_SIZE.x) * DEFAULT_CELL_SIZE.x + DEFAULT_CELL_SIZE.x;
            else if (this.rayDirection.left)
                this.intersections.verticalIntersection.x = Math.floor(player.position.x / DEFAULT_CELL_SIZE.x) * DEFAULT_CELL_SIZE.x - 0.1;

            if(Math.tan(this.rayAngle))
                this.intersections.verticalIntersection.y = (player.position.y + (player.position.x - this.intersections.verticalIntersection.x) * Math.tan(this.rayAngle));

            var coordCell = {
                x: Math.floor(this.intersections.verticalIntersection.x / DEFAULT_CELL_SIZE.x),
                y: Math.floor(this.intersections.verticalIntersection.y / DEFAULT_CELL_SIZE.y)
            };

            if (grid.returnCellAtCoord(coordCell) !== undefined) 
                if (grid.returnCellAtCoord(coordCell).gameObjectOnCell !== undefined) 
                    if (grid.returnCellAtCoord(coordCell).gameObjectOnCell.type == "wall")
                        this.intersections.verticalIntersection.hasWall = true;
        
        }
    };

    this.moveToNextIntersectionPoint = function returnNextIntersectionPoint(axis) {
        if (axis == 0) {
            if (this.rayDirection.up)
                this.intersections.horizontalIntersection.y = this.intersections.horizontalIntersection.y - DEFAULT_CELL_SIZE.y;
            else if (this.rayDirection.down)
                this.intersections.horizontalIntersection.y = this.intersections.horizontalIntersection.y + DEFAULT_CELL_SIZE.y;

            if (Math.tan(this.rayAngle)) {
                if (this.rayDirection.up)
                    this.intersections.horizontalIntersection.x = this.intersections.horizontalIntersection.x + (DEFAULT_CELL_SIZE.x / Math.tan(this.rayAngle));
                else if (this.rayDirection.down)
                    this.intersections.horizontalIntersection.x = this.intersections.horizontalIntersection.x - (DEFAULT_CELL_SIZE.x / Math.tan(this.rayAngle));
            }

            var coordCell = {
                x: Math.floor(this.intersections.horizontalIntersection.x / DEFAULT_CELL_SIZE.x),
                y: Math.floor(this.intersections.horizontalIntersection.y / DEFAULT_CELL_SIZE.y)
            };

            if (grid.returnCellAtCoord(coordCell) !== undefined) 
                if (grid.returnCellAtCoord(coordCell).gameObjectOnCell !== undefined) 
                    if (grid.returnCellAtCoord(coordCell).gameObjectOnCell.type == "wall")
                        this.intersections.horizontalIntersection.hasWall = true;

        } else if (axis == 1) {
            if (this.rayDirection.right)
                this.intersections.verticalIntersection.x += DEFAULT_CELL_SIZE.x;
            else if (this.rayDirection.left)
                this.intersections.verticalIntersection.x -= DEFAULT_CELL_SIZE.x;

            if (Math.tan(this.rayAngle)) {
                if (this.rayDirection.right)
                    this.intersections.verticalIntersection.y = this.intersections.verticalIntersection.y - (DEFAULT_CELL_SIZE.x * Math.tan(this.rayAngle));
                else if (this.rayDirection.left)
                    this.intersections.verticalIntersection.y = this.intersections.verticalIntersection.y + (DEFAULT_CELL_SIZE.x * Math.tan(this.rayAngle));
            }

            var coordCell = {
                x: Math.floor(this.intersections.verticalIntersection.x / DEFAULT_CELL_SIZE.x),
                y: Math.floor(this.intersections.verticalIntersection.y / DEFAULT_CELL_SIZE.y)
            };

            if (grid.returnCellAtCoord(coordCell) !== undefined) 
                if (grid.returnCellAtCoord(coordCell).gameObjectOnCell !== undefined) 
                    if (grid.returnCellAtCoord(coordCell).gameObjectOnCell.type == "wall")
                        this.intersections.verticalIntersection.hasWall = true;

        }

    };

    this.returnRayDirection = function returnRayDirection() { // 0 up - 1 down
        var facing = {
            up: false,
            right: false,
            down: false,
            left: false
        };

        if (this.rayAngle >= 0 && this.rayAngle < Math.PI)
            facing.up = true;
        else
            facing.down = true;

        if (this.rayAngle >= Math.PI / 2 && this.rayAngle < (3 * Math.PI) / 2)
            facing.left = true;
        else
            facing.right = true;

        return facing;
    };
}

function PlayerView() {
    this.visibleSprites = [];
    this.ray = new Ray();

    this.update = function update() {
        for (var i = 0; i < NUM_COLUMNS; i++) {
            var columnAngle = (player.playerFacing + player.fov / 2) - i * player.angleBetweenRays;

            if (columnAngle > 2 * Math.PI) {
                columnAngle = (columnAngle - Math.PI) - Math.PI;
            }

            ray = new Ray(columnAngle, i);
            var returnObject = ray.castRay();


            if(returnObject.gameObject !== undefined){
                if (returnObject.gameObject.type == "wall") {

                    var texture_strech = 8;
                    //GET TEXTURE COLUMN
                    var distanceToPoint = Math.cos((columnAngle - player.playerFacing)) * Math.sqrt(Math.pow(player.position.x - returnObject.intersectionX, 2) + Math.pow(player.position.y - returnObject.intersectionY, 2));
                    var wallSize = ((DEFAULT_CELL_SIZE.x / distanceToPoint) * player.distanceProjectionPlane);
                    var textureColumnOffset;

                    if (returnObject.isHorizontalIntersection) {
                        textureColumnOffset = returnObject.intersectionX % 16 * 4; //(Math.floor(returnObject.intersectionX) % 32) * 2  ;//Math.floor(returnObject.intersectionX % 64);
                    } else if (returnObject.isVerticalIntersection) {
                        textureColumnOffset = returnObject.intersectionY % 16 * 4;//Math.floor(returnObject.intersectionY % 64);
                    }

                    texture_strech = distanceToPoint;
                    var wallX = (DEFAULT_SCREEN_SIZE.x / NUM_COLUMNS) * i;
                    var wallY = (DEFAULT_SCREEN_SIZE.y - wallSize) / 2;
                    var wallWidth = (DEFAULT_SCREEN_SIZE.x / NUM_COLUMNS);
                    var wallHeight = wallSize;

                    ctxGame.beginPath();
                    ctxGame.drawImage(textureMap, returnObject.gameObject.textureLocation[0] + textureColumnOffset, returnObject.gameObject.textureLocation[1], 0.01, 64, wallX, wallY, wallWidth, wallHeight);
                    ctxGame.drawImage(textureMap, 0, 0, 0.01, 64, 0, 0, 1, 64);
                }
            }

        }
    };
}*/