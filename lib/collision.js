collisionMatrix = {};
createCollisionMatrix = function () {
    collisionMatrix = {};
    Blocks.find({active: false, preview: false}, {fields: {x: 1, y: 1, formArray: 1}}).forEach((block)=> {
        var x = block.x, y = block.y;
        _.forEach(block.formArray, (pixel, index)=> {
            if (pixel === 1) {
                collisionMatrix[posToIndex(getX(x, index), getY(y, index))] = block._id;
            }
        });
    });
    checkLine();
};
checkCollision = function (x, y) {
    return !!collisionMatrix[posToIndex(x, y)];
}

clearCollisionMatrix = function () {
    collisionMatrix = {};
}


posToIndex = function (x, y) {
    return x + '_' + y;
}
getX = function (x, index) {
    return x + index % 3;
}
getY = function (y, index) {
    return y + Math.floor(index / 3);
}
checkLine = function(){
    var lines = {};
    _.forEach(collisionMatrix, (pixelId, positionString)=>{
        var y = positionString.split('_')[1];
        if(lines[y]){
            lines[y].push(pixelId);
        }else{
            lines[y] = [pixelId];
        }
    });

    _.forEach(lines, (line, y)=>{
        if(line.length>=config.width){
            Blocks.remove({$in: {_id: line}});
        }
    });
}


