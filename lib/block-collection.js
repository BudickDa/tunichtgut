Blocks = new Meteor.Collection(null);
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
                x: chance.integer({min: 0, max: 19}),
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
        if (Referee.getBottomLine()[block.x + 1] >= block.y + 1) {
            Meteor.call('next');
            Blocks.update(block._id, {
                $set: {active: false},
                $inc: {y: 1}
            })
        } else {
            Blocks.update({active: true}, {
                $inc: {y: 1}
            });
        }
    },
    moveLeft(){
        var block = Blocks.findOne({active: true});
        if (block.x - 1 >= 0) {
            Blocks.update(block._id, {
                $inc: {x: -1}
            });
        }
    },
    moveRight(blockId){
        var block = Blocks.findOne({active: true});
        if (block.x + 1 < config.fields) {
            Blocks.update(block._id, {
                $inc: {x: 1}
            });
        }
    },
    reset(){
        Blocks.remove({});
    }
})