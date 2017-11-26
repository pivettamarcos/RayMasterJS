class ClickManager{
    constructor(updateMiliseconds){
        this.updateMiliseconds = updateMiliseconds;
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
    document.getElementById("editorDiv").addEventListener("mouseup", function(event){

    });

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