/*exported gameManager*/
window.onload = function () {
    let gameManager;
    let loadGameManager = function (textureMap){
        gameManager = new GameManager(textureMap);
    };

    let loadAssets = function(callback){
        let textureMap = new Image();
        textureMap.onload = function(){
            callback(textureMap);
        };
        textureMap.src = "textures/textureMap.png";
    };

    loadAssets(loadGameManager);

    /*function readURL(){
        var file = document.getElementById("getWallMap").files[0];
        var reader = new FileReader();
        reader.onloadend = function(event){
            let dataUrl = event.target.result;
            let img = new Image();
            img.src = dataUrl;
    
            gameManager.textureMap = img;
            //document.getElementById('clock').style.backgroundImage = "url(" + reader.result + ")";        
        };
    
        if(file){
            reader.readAsDataURL(file);
        }else{
    
        }
    }*/
};


