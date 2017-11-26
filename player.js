/*exported Player */

function Player(editorControl, gameScreenControl) {
    this.gameScreenControl = gameScreenControl;
    this.editorControl = editorControl;

    this.position = {
        x: PLAYER_START_POSITION.x,
        y: PLAYER_START_POSITION.y
    };

    this.size = {
        x: PLAYER_SIZE.x,
        y: PLAYER_SIZE.y
    };

    this.playerFacingAngle = Math.PI / 2; //90 degrees

    this.turningAngle = Math.PI / 100;

    this.color = "#ff0000";
    this.movingSpeed = 2;

    this.once = true;

    this.move = function move(data) {
        let nextPos;
        switch (data.type) {
            case 'arrow':
            // 0: up, 1: right, 2: down, 3: left, 4: R - restart
                if(data.key == 0) {
                    nextPos = {
                        x: this.position.x + Math.cos(this.playerFacingAngle) * this.movingSpeed * 1,
                        y: this.position.y - Math.sin(this.playerFacingAngle) * this.movingSpeed * 1
                    };
                } else if(data.key == 2) {
                    nextPos = {
                        x: this.position.x + Math.cos(this.playerFacingAngle) * this.movingSpeed * -1,
                        y: this.position.y - Math.sin(this.playerFacingAngle) * this.movingSpeed * -1
                    };
                }
        }

        let nextPosCollisionPoints = this.returnCollisionPoints(nextPos.x, nextPos.y);

        if (editorControl.grid.returnGameObjectsWithinPoints(nextPosCollisionPoints).length > 0) {
            if (editorControl.grid.returnGameObjectsWithinPoints(this.returnCollisionPoints(nextPos.x, this.position.y)).length <= 0) {
                this.position.x = nextPos.x;
            } else if (editorControl.grid.returnGameObjectsWithinPoints(this.returnCollisionPoints(this.position.x, nextPos.y)).length <= 0) {
                this.position.y = nextPos.y;
            }
        } else {
            this.position.x = nextPos.x;
            this.position.y = nextPos.y;
        }

    };

    this.rotate = function rotate(data) {
        switch (data.type) {
            case 'arrow':
                if(data.key == 1) {
                    if (this.playerFacingAngle - this.turningAngle < 0)
                    this.playerFacingAngle = 2 * Math.PI;
                else
                    this.playerFacingAngle -= this.turningAngle;
                } else if(data.key == 3) {
                    if (this.playerFacingAngle + this.turningAngle > 2 * Math.PI)
                    this.playerFacingAngle = 0;
                else
                    this.playerFacingAngle += this.turningAngle;
                }
        }
    };

    this.returnCollisionPoints = function returnCollisionPoints(positionX, positionY) {
        let point1 = { x: positionX - this.size.x / 2, y: positionY - this.size.x / 2 };
        let point2 = { x: positionX + this.size.x / 2, y: positionY - this.size.x / 2 };
        let point3 = { x: positionX - this.size.x / 2, y: positionY + this.size.x / 2 };
        let point4 = { x: positionX + this.size.x / 2, y: positionY + this.size.x / 2 };

        return [point1, point2, point3, point4];
    };

    this.returnDrawCenter = function returnDrawCenter() {
        let drawCenter = {
            x: undefined,
            y: undefined
        };
        drawCenter.x = this.position.x - this.size.x / 2;
        drawCenter.y = this.position.y - this.size.y / 2;
        return drawCenter;
    };
}
