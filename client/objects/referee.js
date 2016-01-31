export class Referee{
    constructor(field){
        this.field = field;
    }
    getBlockWidth(){
        return this.field.offsetWidth;
    }
    getBottomLine(){
        return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    next(){

    }


}