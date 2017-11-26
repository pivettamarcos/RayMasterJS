/*exported gameManager*/
window.onload = function () {
    let loadGameManager = function (textureMap){
        let gameManager = new GameManager(textureMap);
    };

    let loadAssets = function(callback){
        let textureMap = new Image();
        textureMap.onload = function(){
            callback(textureMap);
        };
        textureMap.src = "textures/textureMap.png";
    };

    loadAssets(loadGameManager);
};

