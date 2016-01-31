var ctxField, ctxPreview, fieldHeight, fieldWidth;

class GameClass {
    constructor(field, preview){
        ctxField = field.getContext('2d');
        ctxPreview = preview.getContext('2d');
        fieldWidth = $(field).width();
        fieldHeight = $(field).height();
        if(!(ctxField && ctxPreview )){
            throw new Meteor.Error(500, 'Element is not a canvas.');
        }
        Meteor.call('add');
        Meteor.call('next');
    }

    controls(){
        $(document).keydown(function( event ) {
            console.log(event.which);
            if ( event.which == 37 ) {
                //left
                Meteor.call('moveLeft');
                event.preventDefault();
            }
            if ( event.which == 38 ) {
                //rotate
                event.preventDefault();
            }
            if ( event.which == 39 ) {
                Meteor.call('moveRight');
                event.preventDefault();
            }
            if ( event.which == 40 ) {
                Meteor.call('moveDown');
                event.preventDefault();
            }
            event.stopPropagation();
        });


    }

    render(blockCursor){
        ctxField.clearRect(0,0,fieldWidth,fieldHeight);
        blockCursor.forEach((block)=>{
            var size = 10, x = block.x * size, y = block.y * size;
            console.log(block);
            ctxField.fillStyle = 'green';

            _.forEach(block.formArray, (q, index)=>{
                if(q) {
                    if (index > 3) {
                        ctxField.fillStyle = 'green';
                        ctxField.fillRect(x + index * size, y, size, size);
                  /*  } else if (index > 6) {
                        ctxField.fillStyle = 'red';
                        ctxField.fillRect(x + (index - 3) * size, y + size, size, size);
                    } else {
                        ctxField.fillStyle = 'blue';
                        ctxField.fillRect(x + (index - 6) * size, y + size * 2, size, size);*/
                    }
                }
            });

        });
    }
}

Game = GameClass;