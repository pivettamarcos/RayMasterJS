//EVENT HANDLERS
var scrollY = 0;
var mouse = new Mouse();
var keyboard = new Keyboard();

function Keyboard(){
	this.keys = {
        up: false,
        down: false,
        left: false,
        right: false
    };
}

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
    document.getElementById("editorCanvas").addEventListener("mousemove", updateMousePos);
    document.getElementById("editorCanvas").addEventListener("mousedown", mouseClicked);
    document.getElementById("editorCanvas").addEventListener("mouseup", mouseClickReleased);
})();

window.onkeydown = function(e) {
    var kc = e.keyCode;
    e.preventDefault();

    if      (kc === 37) keyboard.keys.left = true;  // only one key per event
    else if (kc === 38) keyboard.keys.up = true;    // so check exclusively
    else if (kc === 39) keyboard.keys.right = true;
    else if (kc === 40) keyboard.keys.down = true;
    else if (kc === 49) changeElementSelected(0); // WALL TYPE 1
    else if (kc === 50) changeElementSelected(1); // WALL TYPE 2
    else if (kc === 51) changeElementSelected(2); // WALL TYPE 3
    else if (kc === 52) changeElementSelected(3); // WALL TYPE 4
    else if (kc === 53) changeElementSelected(4); // WALL TYPE 5
    else if (kc === 54) changeElementSelected(5); // WALL TYPE 6
    else if (kc === 55) changeElementSelected(6); // WALL TYPE 7
    else if (kc === 56) changeElementSelected(7); // WALL TYPE 8
    else if (kc === 18) toggleRays(); // TOGGLE RAYS
};

window.onkeyup = function(e) {
    var kc = e.keyCode;
    e.preventDefault();

    if      (kc === 37) keyboard.keys.left = false;
    else if (kc === 38) keyboard.keys.up = false;
    else if (kc === 39) keyboard.keys.right = false;
    else if (kc === 40) keyboard.keys.down = false;

};

window.onscroll = function () {
    scrollY =  window.pageYOffset; // Value of scroll Y in px
};