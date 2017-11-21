/*exported PlayerView*/

class PlayerView{
    constructor(raysOrigin){
        this.raysOrigin = raysOrigin;
        this.distanceToProjectionPlane = (GAME_CANVAS_SIZE.x / 2) / (Math.tan(FOCAL_LENGTH / 2));
		this.angleBetweenRays = (FOCAL_LENGTH / (NUM_RAYS));
    }

    castRays(playerFacingAngle){
        let rayReturnObjects = [];
        for(let i = 0; i < NUM_RAYS; i++){
            let rayAngle = (playerFacingAngle + FOCAL_LENGTH/2) - i * this.angleBetweenRays;
            let currentRay = new Ray(rayAngle, this.raysOrigin, i);
                        
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

        ctxGame.beginPath();
        ctxGame.drawImage(textureMap, rayReturnObject.hitCell.gameObjectOnCell.textureLocation[0] + textureColumnOffset, rayReturnObject.hitCell.gameObjectOnCell.textureLocation[1], 1, 64, wallX, wallY,wallWidth, wallHeight);
        ctxGame.closePath();

        if(isHorizontal){
            ctxGame.beginPath();
            ctxGame.rect(wallX, wallY,wallWidth, wallHeight);
            ctxGame.fillStyle = 'rgba(0, 0, 0, '+SHADING_TRANSPARENCY+')';
            ctxGame.fill();
            ctxGame.closePath();
        }
    }
}

class Ray{
    constructor(rayAngle, rayOrigin, index){
       this.rayOrigin = rayOrigin;
       this.rayAngle = rayAngle;
       this.index = index;
    }
}

Ray.prototype.cast = function(){
    let horizontalHit = this.findHorizontalHit();
    let verticalHit = this.findVerticalHit();   

    let nearestHit = this.returnNearestHit(horizontalHit,verticalHit);

    if(nearestHit !== undefined)
        if(raysActivated)
            this.drawRayOnEditor(nearestHit);
    
    return nearestHit;
};

Ray.prototype.drawRayOnEditor = function(nearestHit){
    editorControl.drawRayLineOnCanvas("#ff0000", this.rayOrigin, nearestHit.hitPoint);
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
        if(raysActivated)
            editorControl.drawRayLineOnCanvas("#afafaf", this.rayOrigin, {x: this.rayOrigin.x + Math.cos(this.rayAngle) * 1000, y: this.rayOrigin.y + Math.sin(this.rayAngle) * -1000});
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

    hitCell = grid.returnCellAtCoord(grid.convertToGridCoords({x: workingHorizontalHitPoint.x, y: workingHorizontalHitPoint.y}));
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
            if (limit > Math.floor(player.position.y / CELL_SIZE.x))
                break;
        }else{
            if (limit > Math.floor((EDITOR_CANVAS_SIZE.y - player.position.y) / CELL_SIZE.y))
                break;
        }
        limit++;

        workingHorizontalHitPoint.y += ((Math.sin(this.rayAngle) > 0) ? -CELL_SIZE.y:  CELL_SIZE.y);
        workingHorizontalHitPoint.x += ((Math.sin(this.rayAngle) > 0) ? (CELL_SIZE.x / Math.tan(this.rayAngle)): -(CELL_SIZE.x / Math.tan(this.rayAngle)));

        if(workingHorizontalHitPoint.x < 0 || workingHorizontalHitPoint.x > GRID_DIMENSIONS.x * CELL_SIZE.x)
            return;

        hitCell = grid.returnCellAtCoord(grid.convertToGridCoords({x: workingHorizontalHitPoint.x, y: workingHorizontalHitPoint.y}));
       
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

    hitCell = grid.returnCellAtCoord(grid.convertToGridCoords({x: workingVerticalHitPoint.x, y: workingVerticalHitPoint.y}));
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
            if (limit > Math.floor((EDITOR_CANVAS_SIZE.x - player.position.x) / CELL_SIZE.x))
                break;
        }else{
            if (limit > Math.floor(player.position.x / CELL_SIZE.x))
                break;
        }
        limit++;

        workingVerticalHitPoint.x += ((Math.cos(this.rayAngle) > 0) ? CELL_SIZE.x:  -CELL_SIZE.x);            
        workingVerticalHitPoint.y += ((Math.cos(this.rayAngle) > 0) ? -(CELL_SIZE.x * Math.tan(this.rayAngle)): (CELL_SIZE.x * Math.tan(this.rayAngle)));

        hitCell = grid.returnCellAtCoord(grid.convertToGridCoords({x: workingVerticalHitPoint.x, y: workingVerticalHitPoint.y}));
       
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