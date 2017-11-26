//EVENT HANDLERS
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
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

function ClickManager(updateMiliseconds){
	this.updateMiliseconds = updateMiliseconds;
    this.CLICKED = 0; this.RELEASED = 1; this.MOVED = 2;
    this.MOUSE1 = 0; this.MOUSE2 = 1; this.MOUSE3 = 2;
	this.clicked = [false,false,false];
	this.pressed = [false,false,false];
	this.released = [false,false,false];
    this.lastFrame = undefined;
    
	this.events = {};
    this.includedKeys = [0,1,2];

    this.position = {
        x: undefined,
        y: undefined
    };
    
    this.map = {
	    0: { key: 0, position: this.position, type: 'mouseClick', clicked: false, pressed: false, action: "interactGrid" }, // Up
        1: { key: 1, position: this.position, type: 'mouseClick', clicked: false, pressed: false, action: "rotate" }, // Right
        2: { key: 2, position: this.position, type: 'mouseClick', clicked: false, pressed: false, action: "move" }, // Down
    };

    this.listen();
	
        this.updateClass = setInterval(this.update.bind(this), updateMiliseconds);
}
ClickManager.prototype.listen = function(){
	var self = this;
    document.getElementById("editorDiv").addEventListener("mousedown", function(event){
        self.map[event.button].clicked = true;
    });
    document.getElementById("editorDiv").addEventListener("mousemove", function(event){
	    self.position.x = event.clientX;
	    self.position.y = event.clientY;
    });
    /*document.getElementById("editorDiv").addEventListener("mouseup", function(event){

    });*/

};

ClickManager.prototype.update = function (){
	for(let key of this.includedKeys){
        if(this.map[key].clicked)
            this.emit(this.map[key].action, this.map[key]);
    }
    if(this.lastFrame){
        for(let key of this.includedKeys){
            if(this.lastFrame.map[key].clicked){
                this.map[key].clicked = false;
            }
        }
    }
    
    this.lastFrame = Object.assign({},this);
};
ClickManager.prototype.emit = function (event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (callback) {
            callback(data);
        });
    }
};

ClickManager.prototype.on = function (event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};