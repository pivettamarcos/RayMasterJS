//EVENT HANDLERS
var scrollY = 0;
//var mouse = new Mouse();
//var keyboard = new Keyboard();

class KeyboardManager{
    constructor(updateMiliseconds){
        this.updateMiliseconds = updateMiliseconds;
        this.events = {};

        this.includedKeys = [38,39,40,37];
        this.map = {
            38: { key: 0, type: 'arrow', pressed: false, action: "move" }, // Up
            39: { key: 1, type: 'arrow', pressed: false, action: "rotate" }, // Right
            40: { key: 2, type: 'arrow', pressed: false, action: "move" }, // Down
            37: { key: 3, type: 'arrow', pressed: false, action: "rotate" } // Left        
        };
  
          
        this.listen();

        this.updateClass = setInterval(this.update.bind(this), updateMiliseconds);
    }
}

KeyboardManager.prototype.update = function () {
    for(let key of this.includedKeys){
        if(this.map[key].pressed)
            this.emit(this.map[key].action, this.map[key]);
    }
};

KeyboardManager.prototype.listen = function () {
    var self = this;
  
    document.addEventListener('keydown', function (event) {
        if(self.map[event.which])
            self.map[event.which].pressed = true;
    });

    document.addEventListener('keyup', function (event) {
        if(self.map[event.which])
            self.map[event.which].pressed = false;
    });
};

KeyboardManager.prototype.emit = function (event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (callback) {
            callback(data);
        });
    }
};

KeyboardManager.prototype.on = function (event, callback) {
    console.log(this);
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

function Mouse(){
    this.CLICKED = 0; this.RELEASED = 1; this.MOVED = 2;
    this.MOUSE1 = 0; this.MOUSE2 = 1; this.MOUSE3 = 2;
	this.clicked = [false,false,false];
	this.pressed = [false,false,false];
	this.released = [false,false,false];
	this.lastFrame = undefined;

	this.position = {
        x: undefined,
        y: undefined
    };


	this.update = function update(){
        if(this.lastFrame){
            for(let i = 0; i < this.lastFrame.clicked.length; i++){
                if(this.lastFrame.clicked[i]){
                    this.lastFrame.clicked[i] = false;
                }
            }
        }
        
        this.lastFrame = Object.assign({},this);
	};
}

function updateMousePos(event) {
	mouse.position.x = event.clientX;  
	mouse.position.y = event.clientY;  
}

function mouseClicked(event){
    console.log(editorControl);
    mouse.clicked[event.button] = true;
    console.log("|| ((▼)) Mouse button clicked at: x="+event.clientX +" y="+ event.clientY+" type="+ event.button +" ||");
    editorControl.mouseEvent(mouse.MOUSE1, mouse.CLICKED);
}

function mouseClickReleased(event){
    console.log("|| ((▲)) Mouse button released at: x="+event.clientX +" y="+ event.clientY+" type="+ event.button +" ||");
    mouse.released[event.button] = true;
    
    //gridInteraction();
}

(function addEventListenersEditorGrid(){
    document.getElementById("editorDiv").addEventListener("mousemove", updateMousePos);
    document.getElementById("editorDiv").addEventListener("mousedown", mouseClicked);
    document.getElementById("editorDiv").addEventListener("mouseup", mouseClickReleased);
})();
