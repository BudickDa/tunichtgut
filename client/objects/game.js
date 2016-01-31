import {Block} from './block';
export var referee;

export class Game {
    constructor(field, preview){
        var ctxField = field.getContext('2d'), ctxPreview = preview.getContext('2d');
        if(!(ctxField && ctxPreview )){
            throw new Meteor.Error(500, 'Element is not a canvas.');
        }
        referee = new Referee(field);

        new Block();





    }

    render(){

    }

}