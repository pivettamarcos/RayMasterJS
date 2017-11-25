/*exported PlayerView*/

class PlayerView{
    constructor(raysOrigin, editorControl, gameScreenControl){
        this.gameScreenControl = gameScreenControl;
        this.raysOrigin = raysOrigin;
        this.distanceToProjectionPlane = (GAME_CANVAS_SIZE.x / 2) / (Math.tan(FOCAL_LENGTH / 2));
		this.angleBetweenRays = (FOCAL_LENGTH / (NUM_RAYS));
	    this.editorControl = editorControl;
    }

    castRays(playerFacingAngle){
        let rayReturnObjects = [];
        for(let i = 0; i < NUM_RAYS; i++){
            let rayAngle = (playerFacingAngle + FOCAL_LENGTH/2) - i * this.angleBetweenRays;
            let currentRay = new Ray(rayAngle, this.raysOrigin, i, this.editorControl);
                        
            rayReturnObjects.push(currentRay.cast());
        }

        this.drawWorld(rayReturnObjects, playerFacingAngle);
    }

    drawWorld(rayReturnObjects, playerFacingAngle){
        for(let rayReturnObject of rayReturnObjects){
            if(rayReturnObject)
                this.drawColumn(rayReturnObject, playerFacingAngle);
        }
    }

    drawColumn(rayReturnObject, playerFacingAngle){
        let correctedDistanceToPoint = Math.cos(rayReturnObject.rayAngle - playerFacingAngle) * rayReturnObject.hitDistance;
        let wallSize = ((CELL_SIZE.x  / correctedDistanceToPoint) * this.distanceToProjectionPlane);

        let wallX = (GAME_CANVAS_SIZE.x / NUM_RAYS) * rayReturnObject.index;
        let wallY = (GAME_CANVAS_SIZE.y - wallSize) / 2;
        let wallWidth = (GAME_CANVAS_SIZE.x / NUM_RAYS);
        let wallHeight = wallSize;
        let textureColumnOffset;
        let isHorizontal = false;

        if (rayReturnObject.intersectionType == "horizontal") {
            isHorizontal = true;
            textureColumnOffset = Math.floor((rayReturnObject.hitPoint.x % CELL_SIZE.x) * 4);
        }else{
            textureColumnOffset = Math.floor((rayReturnObject.hitPoint.y % CELL_SIZE.x) * 4);
        }

        this.gameScreenControl.drawRectangle(true, {img: this.editorControl.gameManager.textureMap, sX: rayReturnObject.hitCell.gameObjectOnCell.textureLocation[0] + textureColumnOffset, sY: rayReturnObject.hitCell.gameObjectOnCell.textureLocation[1], 
            sWidth: 1, sHeight: 64, x: wallX, y: wallY, width: wallWidth, height: wallHeight});

        if(isHorizontal){
            this.gameScreenControl.drawRectangle(false, {fillStyle: 'rgba(0, 0, 0, '+SHADING_TRANSPARENCY+')', x: wallX, y: wallY, width: wallWidth, height: wallHeight});
        }
    }
}

class Ray{
    constructor(rayAngle, rayOrigin, index, editorControl){
        this.rayOrigin = rayOrigin;
        this.rayAngle = rayAngle;
        this.index = index;
        this.editorControl = editorControl;
    }
}

Ray.prototype.cast = function(){
    let horizontalHit = this.findHorizontalHit();
    let verticalHit = this.findVerticalHit();   

    let nearestHit = this.returnNearestHit(horizontalHit,verticalHit);

    if(nearestHit !== undefined)
        if(this.editorControl.gameManager.raysActivated)
            this.drawRayOnEditor(nearestHit);
    
    return nearestHit;
};

Ray.prototype.drawRayOnEditor = function(nearestHit){
    this.editorControl.drawRayLineOnCanvas("#ff0000", this.rayOrigin, nearestHit.hitPoint);
};

Ray.prototype.returnNearestHit = function(hitA,hitB){
    if(hitA !== undefined && hitB !== undefined){
        if(hitA.hitDistance < hitB.hitDistance){
            return hitA;
        }
        return hitB;

    }else if(hitA !== undefined){
        return hitA;
    }else if(hitB !== undefined){
        return hitB;
    }else{
        if(RAYS_ACTIVE)
            this.editorControl.drawRayLineOnCanvas("#afafaf", this.rayOrigin, {x: this.rayOrigin.x + Math.cos(this.rayAngle) * 1000, y: this.rayOrigin.y + Math.sin(this.rayAngle) * -1000});
        return undefined;
    }
};

Ray.prototype.findHorizontalHit = function(){
    let workingHorizontalHitPoint = {
        x: undefined,
        y: undefined
    };

    let horizontalHitReturnObject;
    let hitCell;

    //FINDS THE FIRST HORIZONTAL HIT POINT 
    workingHorizontalHitPoint.y =  Math.floor(this.rayOrigin.y/CELL_SIZE.y) * CELL_SIZE.y + ((Math.sin(this.rayAngle) > 0) ? -0.001 : CELL_SIZE.y);
    workingHorizontalHitPoint.x = (this.rayOrigin.x + (this.rayOrigin.y-workingHorizontalHitPoint.y)/Math.tan(this.rayAngle));
    if(workingHorizontalHitPoint.x < 0 || workingHorizontalHitPoint.x > GRID_DIMENSIONS.x * CELL_SIZE.x)
        return;

    hitCell = this.editorControl.grid.returnCellAtCoord(this.editorControl.grid.convertToGridCoords({x: workingHorizontalHitPoint.x, y: workingHorizontalHitPoint.y}));
    if(hitCell){
            if(hitCell.gameObjectOnCell){
                horizontalHitReturnObject = {
                    hitPoint: workingHorizontalHitPoint,
                    hitCell: hitCell,
                    hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - workingHorizontalHitPoint.x,2) + Math.pow(this.rayOrigin.y - workingHorizontalHitPoint.y,2)),
                    index: this.index,
                    rayAngle: this.rayAngle,
                    intersectionType: "horizontal"
                };
            }
    }

    let limit = 0;
    
    //IF NOT HIT IN FIRST, SEARCH OTHER INTERSECTIONS
    while(horizontalHitReturnObject === undefined){
        if(Math.sin(this.rayAngle) > 0){
            if (limit > Math.floor(this.rayOrigin.y / CELL_SIZE.x))
                break;
        }else{
            if (limit > Math.floor((EDITOR_CANVAS_SIZE.y - this.rayOrigin.y) / CELL_SIZE.y))
                break;
        }
        limit++;

        workingHorizontalHitPoint.y += ((Math.sin(this.rayAngle) > 0) ? -CELL_SIZE.y:  CELL_SIZE.y);
        workingHorizontalHitPoint.x += ((Math.sin(this.rayAngle) > 0) ? (CELL_SIZE.x / Math.tan(this.rayAngle)): -(CELL_SIZE.x / Math.tan(this.rayAngle)));

        if(workingHorizontalHitPoint.x < 0 || workingHorizontalHitPoint.x > GRID_DIMENSIONS.x * CELL_SIZE.x)
            return;

        hitCell = this.editorControl.grid.returnCellAtCoord(this.editorControl.grid.convertToGridCoords({x: workingHorizontalHitPoint.x, y: workingHorizontalHitPoint.y}));
       
        if(hitCell){
            if(hitCell.gameObjectOnCell){
                horizontalHitReturnObject = {
                    hitPoint: workingHorizontalHitPoint,
                    hitCell: hitCell,
                    hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - workingHorizontalHitPoint.x,2) + Math.pow(this.rayOrigin.y - workingHorizontalHitPoint.y,2)),
                    index: this.index,
                    rayAngle: this.rayAngle,
                    intersectionType: "horizontal"
                };
            }
        }
    }

    return horizontalHitReturnObject;
};

Ray.prototype.findVerticalHit = function(){
    let workingVerticalHitPoint = {
        x: undefined,
        y: undefined
    };

    let verticalHitReturnObject;
    let hitCell;

    //FINDS THE FIRST VERTICAL HIT POINT        
    workingVerticalHitPoint.x = Math.floor(this.rayOrigin.x/CELL_SIZE.x) * CELL_SIZE.x + ((Math.cos(this.rayAngle) > 0) ? CELL_SIZE.x : -0.001);
    workingVerticalHitPoint.y = (this.rayOrigin.y + (this.rayOrigin.x - workingVerticalHitPoint.x)*Math.tan(this.rayAngle));

    hitCell = this.editorControl.grid.returnCellAtCoord(this.editorControl.grid.convertToGridCoords({x: workingVerticalHitPoint.x, y: workingVerticalHitPoint.y}));
    if(hitCell){
            if(hitCell.gameObjectOnCell){
                verticalHitReturnObject = {
                    hitPoint: workingVerticalHitPoint,
                    hitCell: hitCell,
                    hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - workingVerticalHitPoint.x,2) + Math.pow(this.rayOrigin.y - workingVerticalHitPoint.y,2)),
                    index: this.index,
                    rayAngle: this.rayAngle,
                    intersectionType: "vertical"
                };
            }
    }

    let limit = 0;
    
    //IF NOT HIT IN FIRST, SEARCH OTHER INTERSECTIONS
    while(verticalHitReturnObject === undefined){
        if (Math.cos(this.rayAngle) > 0){
            if (limit > Math.floor((EDITOR_CANVAS_SIZE.x - this.rayOrigin.x) / CELL_SIZE.x))
                break;
        }else{
            if (limit > Math.floor(this.rayOrigin.x / CELL_SIZE.x))
                break;
        }
        limit++;

        workingVerticalHitPoint.x += ((Math.cos(this.rayAngle) > 0) ? CELL_SIZE.x:  -CELL_SIZE.x);            
        workingVerticalHitPoint.y += ((Math.cos(this.rayAngle) > 0) ? -(CELL_SIZE.x * Math.tan(this.rayAngle)): (CELL_SIZE.x * Math.tan(this.rayAngle)));

        hitCell = this.editorControl.grid.returnCellAtCoord(this.editorControl.grid.convertToGridCoords({x: workingVerticalHitPoint.x, y: workingVerticalHitPoint.y}));
       
        if(hitCell){
            if(hitCell.gameObjectOnCell){
                verticalHitReturnObject = {
                    hitPoint: workingVerticalHitPoint,
                    hitCell: hitCell,
                    hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - workingVerticalHitPoint.x,2) + Math.pow(this.rayOrigin.y - workingVerticalHitPoint.y,2)),
                    index: this.index,
                    rayAngle: this.rayAngle,
                    intersectionType: "vertical"                        
                };
            }
        }
    }
    return verticalHitReturnObject;
};

Ray.prototype.isAGreaterThanB = function(a,b){
    if(a !== undefined && b !== undefined){
        console.log(a +" > "+ b);
        if(a > b)
            return true;
    }
    return false;

};
