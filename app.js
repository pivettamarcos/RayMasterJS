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
        textureMap.src = DEFAULT_ASSET_TEXTURE_MAP;
    };

    loadAssets(loadGameManager);
};


