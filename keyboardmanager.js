class KeyboardManager{
    constructor(updateMiliseconds){
        this.updateMiliseconds = updateMiliseconds;
        this.events = {};
        this.lastKeyPressed = undefined;

        this.includedKeys = [38,39,40,37,49,50,51,52,53,54,82];
        this.map = {
            38: { key: 0, type: 'arrow', clicked: false, pressed: false, action: "move" }, // Up
            39: { key: 1, type: 'arrow', clicked: false, pressed: false, action: "rotate" }, // Right
            40: { key: 2, type: 'arrow', clicked: false, pressed: false, action: "move" }, // Down
            37: { key: 3, type: 'arrow', clicked: false, pressed: false, action: "rotate" }, // Left
            49: { key: 0, type: 'number', clicked: false, pressed: false, action: "changeSelected" },
            50: { key: 1, type: 'number', clicked: false, pressed: false, action: "changeSelected" },
            51: { key: 2, type: 'number', clicked: false, pressed: false, action: "changeSelected" },
            52: { key: 3, type: 'number', clicked: false, pressed: false, action: "changeSelected" },
            53: { key: 4, type: 'number', clicked: false, pressed: false, action: "changeSelected" },
            54: { key: 5, type: 'number', clicked: false, pressed: false, action: "changeSelected" },
            82: { key: 0, type: 'altKey', clicked: false, pressed: false, action: "toggleRays"}
            //55: { key: 7, type: 'number', pressed: false, action: "toggleRays"}  ,            
        };
          
        this.listen();

        this.updateClass = setInterval(this.update.bind(this), updateMiliseconds);
    }
}

KeyboardManager.prototype.update = function () {
    for(let key of this.includedKeys){
        if(this.map[key].action == "move" || this.map[key].action == "rotate"){
            if(this.map[key].pressed)
                this.emit(this.map[key].action, this.map[key]);

        }else if(this.map[key].action == "changeSelected" || this.map[key].action == "toggleRays"){
            if(this.map[key].clicked)
                this.emit(this.map[key].action, this.map[key]);
        }
    }

    for(let key of this.includedKeys){
        if(this.map[key].clicked){
            this.map[key].pressed = true;
            this.map[key].clicked = false;
        }
    }
};

KeyboardManager.prototype.listen = function () {
    var self = this;

    window.addEventListener('keydown', function (event) {
        if(event.which != this.lastKeyPressed){
            if(self.map[event.which]){
                self.map[event.which].clicked = true;
                this.lastKeyPressed = event.which;
            }
        }
    });

    window.addEventListener('keyup', function (event) {
        if(self.map[event.which]){
            self.map[event.which].pressed = false;
            if(event.which == this.lastKeyPressed)
                this.lastKeyPressed = undefined;
        }
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

