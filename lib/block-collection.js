export var Blocks = new Mongo.Collection(null);

Meteor.methods({
    add: function (formArray, x) {
        return Blocks.insert({
            formArray: formArray,
            x: x,
            y: 0,
            active: true
        });
    },
    move(x, y, blockId){
        check(blockId, MongoID);
        check(x, Boolean);
        check(y, Boolean);

        var offsetX = x ? 1 : 0,
            offsetY = y ? 1 : 0;

        Blocks.update(blockId, {
            $inc: {x:offsetX, y: offsetY}
        })
    }
})