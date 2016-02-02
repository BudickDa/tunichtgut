Blocks = new Meteor.Collection('blocks');
chance = new Chance();

Meteor.methods({
    add: function () {
        /**
         * check if there is already a block
         */
        if (Blocks.find({
                active: false,
                preview: true
            }, {limit: 1}).count() === 0) {


            var chance = new Chance(),
                formArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            formArray = formArray.map(()=> {
                return chance.bool() ? 1 : 0;
            });
            /**
             * 'morphological' function... at least kind of...
             */
            _.forEach(formArray, (b, i)=> {
                if (i <= 5) {
                    b *= formArray[i + 3];
                } else {
                    b *= formArray[i - 3];
                }
            });

            return Blocks.insert({
                formArray: formArray,
                x: 10,
                y: 0,
                active: false,
                preview: true,
                color: chance.color()
            });
        } else {
            throw new Meteor.Error(500, 'You already created a block...');
        }
    },
    next(){
        Blocks.update({
            active: false, preview: true
        }, {
            $set: {
                active: true,
                preview: false
            }
        });
        Meteor.call('add');
    },
    moveDown(){
        var block = Blocks.findOne({active: true});
        block.y += 1;
        if (collision(block.x, block.y, block.formArray)) {
            Meteor.call('next');
            Blocks.update(block._id, {
                $set: {active: false}
            });
            createCollisionMatrix();

        } else {
            Blocks.update({active: true}, {
                $inc: {y: 1}
            });
        }
    },
    moveLeft(){
        var block = Blocks.findOne({active: true});
        block.x -= 1;
        if (blockMin(block.x, block.formArray) >= 0 && !collision(block.x, block.y, block.formArray)) {
            Blocks.update(block._id, {
                $inc: {x: -1}
            });
        }
    },
    moveRight(){
        var block = Blocks.findOne({active: true});
        block.x += 1;
        if (blockMax(block.x, block.formArray) < config.fields && !collision(block.x, block.y, block.formArray)) {
            Blocks.update(block._id, {
                $inc: {x: 1}
            });
        }
    },
    rotate(){
        var block = Blocks.findOne({active: true});
        var rotated = [
            block.formArray[6], block.formArray[3], block.formArray[0],
            block.formArray[7], block.formArray[4], block.formArray[1],
            block.formArray[8], block.formArray[5], block.formArray[2]];

        if (blockMin(block.x, rotated) >= 0 && blockMax(block.x, rotated) < config.fields && !collision(block.x, block.y, rotated)) {
            Blocks.update(block._id, {
                $set: {
                    formArray: rotated
                }
            });
        }
    },

    reset(){
        Blocks.remove({});
        clearCollisionMatrix();
        Meteor.call('add');
        Meteor.call('next');
    }
});

function blockMin(x, formArray) {
    return x + 2 - (formArray[0] || formArray[3] || formArray[6]) - (formArray[0] || formArray[3] || formArray[6] || formArray[1] || formArray[4] || formArray[7]);
}

function blockMax(x, formArray) {
    return x + (formArray[2] || formArray[5] || formArray[8])
        + (formArray[2] || formArray[5] || formArray[8] || formArray[1] || formArray[4] || formArray[7]);
}

function collision(x, y, formArray) {
    var collides = false;
    _.forEach(formArray, (pixel, index)=> {
        if (pixel === 1) {
            if (checkCollision(getX(x, index), getY(y, index)) || y >= config.floor) {
                collides = true;
            }
        }
    });
    return collides;
}



