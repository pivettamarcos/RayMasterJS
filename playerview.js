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
        this.editorControl.grid.changeGameObjectsvisiblity(false);

        let rayReturnObjects = {walls: [], sprites: []};
        for(let i = 0; i < NUM_RAYS; i++){
            let rayAngle = (playerFacingAngle + FOCAL_LENGTH/2) - i * this.angleBetweenRays;
            let currentRay = new Ray(rayAngle, this.raysOrigin, i, this.editorControl);
            let rayCast = currentRay.cast();       
            rayReturnObjects.walls.push(rayCast.nearestWall);
            rayReturnObjects.sprites.push(rayCast.spritesHit);
        }
        this.drawWorld(rayReturnObjects, playerFacingAngle);
    }

    drawWorld(rayReturnObjects, playerFacingAngle){
        let drawableObjects = [];
        for(let rayReturnObject of rayReturnObjects.walls){
            if(rayReturnObject){
                drawableObjects.push(rayReturnObject);
            }
        }
        for(let rayReturnObject of rayReturnObjects.sprites){
            for(let spriteInfo of rayReturnObject){
                if(spriteInfo)
                drawableObjects.push(spriteInfo);
            }
        }

        drawableObjects.sort(this.compare);        

        for(let drawableObject of drawableObjects){
            if(drawableObject){
                if(drawableObject.hitPoint)
                    this.drawColumn(drawableObject, playerFacingAngle);
                else
                    this.drawSprite(drawableObject, playerFacingAngle);
            }
        }
    }

    compare(a,b) {
        if (a.hitDistance > b.hitDistance)
           return -1;
        if (a.hitDistance < b.hitDistance)
          return 1;
        return 0;
      }

    drawSprite(spriteInfo, playerFacingAngle){
        var dx = spriteInfo.hitCell.position.x - this.editorControl.gameManager.player.position.x;
		var dy = spriteInfo.hitCell.position.y - this.editorControl.gameManager.player.position.y;

		var dist = spriteInfo.hitDistance;
		var spriteAngle = (Math.atan2(dy,dx)*-1) - playerFacingAngle;
        var size = ((CELL_SIZE.x  / dist) * this.distanceToProjectionPlane);

        var x = Math.tan(spriteAngle) * this.distanceToProjectionPlane;

        this.gameScreenControl.drawRectangle(true, {img: this.editorControl.gameManager.textureMap, sX: spriteInfo.hitCell.gameObjectOnCell.textureLocation[0] + 1, sY: spriteInfo.hitCell.gameObjectOnCell.textureLocation[1], 
            sWidth: 63, sHeight: 64, x: GAME_CANVAS_SIZE.x/2 - x - size/2, y: GAME_CANVAS_SIZE.y/2 - size/2, width: size, height: size});
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
        this.spriteReturnObject = [];
    }
}

Ray.prototype.cast = function(){
    let horizontalHit = this.findHorizontalHit();
    let verticalHit = this.findVerticalHit();   
    let nearestHit = this.returnNearestHit(horizontalHit,verticalHit);
    if(nearestHit !== undefined)
        if(this.editorControl.gameManager.raysActivated)
            this.drawRayOnEditor(nearestHit);
    return {nearestWall: nearestHit, spritesHit: this.spriteReturnObject};
};

Ray.prototype.drawRayOnEditor = function(nearestHit){
    this.editorControl.drawLine(RAY_DEFAULT_LINE_COLOR, RAY_LINE_WIDTH, this.rayOrigin, nearestHit.hitPoint);
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
        if(this.editorControl.gameManager.raysActivated)
            this.editorControl.drawLine(RAY_INTERCEPTED_LINE_COLOR, RAY_LINE_WIDTH, this.rayOrigin, {x: this.rayOrigin.x + Math.cos(this.rayAngle) * 1000, y: this.rayOrigin.y + Math.sin(this.rayAngle) * -1000});
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
                switch(hitCell.gameObjectOnCell.type){
                    
                    case "wall":
                        horizontalHitReturnObject = {
                            hitPoint: workingHorizontalHitPoint,
                            hitCell: hitCell,
                            hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - workingHorizontalHitPoint.x,2) + Math.pow(this.rayOrigin.y - workingHorizontalHitPoint.y,2)),
                            index: this.index,
                            rayAngle: this.rayAngle,
                            intersectionType: "horizontal"
                        };
                        break;
                    case "sprite":
                        if(!hitCell.gameObjectOnCell.isVisible){
                            let spriteInfo = {
                                hitCell: hitCell,
                                hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - hitCell.position.x,2) + Math.pow(this.rayOrigin.y - hitCell.position.y,2))                                
                            };
                            this.spriteReturnObject.push(spriteInfo);
                            hitCell.gameObjectOnCell.isVisible = true;
                        }
                }
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
                switch(hitCell.gameObjectOnCell.type){
                    case "wall":
                        horizontalHitReturnObject = {
                            hitPoint: workingHorizontalHitPoint,
                            hitCell: hitCell,
                            hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - workingHorizontalHitPoint.x,2) + Math.pow(this.rayOrigin.y - workingHorizontalHitPoint.y,2)),
                            index: this.index,
                            rayAngle: this.rayAngle,
                            intersectionType: "horizontal"
                        };
                    break;
                    case "sprite":
                        if(!hitCell.gameObjectOnCell.isVisible){
                            let spriteInfo = {
                                hitCell: hitCell,
                                hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - hitCell.position.x,2) + Math.pow(this.rayOrigin.y - hitCell.position.y,2))                                
                            };
                            this.spriteReturnObject.push(spriteInfo);
                            hitCell.gameObjectOnCell.isVisible = true;
                        }
                }
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
                switch(hitCell.gameObjectOnCell.type){
                    case "wall":
                    verticalHitReturnObject = {
                        hitPoint: workingVerticalHitPoint,
                        hitCell: hitCell,
                        hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - workingVerticalHitPoint.x,2) + Math.pow(this.rayOrigin.y - workingVerticalHitPoint.y,2)),
                        index: this.index,
                        rayAngle: this.rayAngle,
                        intersectionType: "vertical"
                    };
                    break;
                    case "sprite": 
                        if(!hitCell.gameObjectOnCell.isVisible){
                            let spriteInfo = {
                                hitCell: hitCell,
                                hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - hitCell.position.x,2) + Math.pow(this.rayOrigin.y - hitCell.position.y,2))                                
                            };
                            this.spriteReturnObject.push(spriteInfo);
                            hitCell.gameObjectOnCell.isVisible = true;
                        }
                }
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
                switch(hitCell.gameObjectOnCell.type){
                    case "wall":
                        verticalHitReturnObject = {
                            hitPoint: workingVerticalHitPoint,
                            hitCell: hitCell,
                            hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - workingVerticalHitPoint.x,2) + Math.pow(this.rayOrigin.y - workingVerticalHitPoint.y,2)),
                            index: this.index,
                            rayAngle: this.rayAngle,
                            intersectionType: "vertical"                        
                        };
                    break;
                    case "sprite":
                        if(!hitCell.gameObjectOnCell.isVisible){
                            let spriteInfo = {
                                hitCell: hitCell,
                                hitDistance: Math.sqrt(Math.pow(this.rayOrigin.x - hitCell.position.x,2) + Math.pow(this.rayOrigin.y - hitCell.position.y,2))                                
                            };
                            this.spriteReturnObject.push(spriteInfo);
                            hitCell.gameObjectOnCell.isVisible = true;
                        }
                }
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
