var ctxField, ctxPreview, fieldHeight, fieldWidth;

class GameClass {
    constructor(field, preview) {
        ctxField = field.getContext('2d');
        ctxPreview = preview.getContext('2d');
        fieldWidth = $(field).width();
        fieldHeight = $(field).height();
        if (!(ctxField && ctxPreview )) {
            throw new Meteor.Error(500, 'Element is not a canvas.');
        }
    }

    controls() {
        $(document).keydown(function (event) {
            if (event.which == 37) {
                //left
                Meteor.call('moveLeft');
                event.preventDefault();
            }
            if (event.which == 38) {
                //rotate
                Meteor.call('rotate');
                event.preventDefault();
            }
            if (event.which == 39) {
                Meteor.call('moveRight');
                event.preventDefault();
            }
            if (event.which == 40) {
                Meteor.call('moveDown');
                event.preventDefault();
            }
            event.stopPropagation();
        });
    }

    render(blockCursor) {
        var size = fieldWidth / config.fields;
        ctxField.clearRect(0, 0, fieldWidth, fieldHeight);
        blockCursor.forEach((block)=> {
            var x = block.x * size, y = block.y * size;
            _.forEach(block.formArray, (q, index)=> {
                if (q) {
                    ctxField.fillStyle = block.color;
                    if (index < 3) {
                        ctxField.fillRect(x + index * size, y, size, size);
                    } else if (index < 6) {
                        ctxField.fillRect(x + (index - 3) * size, y + size, size, size);
                    } else {
                        ctxField.fillRect(x + (index - 6) * size, y + size * 2, size, size);
                    }
                }
            });

        });
        //this.renderCollisionMatrix(size);
    }

    renderCollisionMatrix(size) {
        ctxField.fillStyle = 'white';
        _.forEach(collisionMatrix, function (pixel, index) {
            var position = index.split('_');
            console.log(position);
            ctxField.fillRect(position[0] * size, position[1] * size, size, size);
        });
    }
}

Game = GameClass;