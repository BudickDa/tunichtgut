import {referee} from './referee';

export class Block {
    constructor(id) {
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
                b = b && formArray[i + 3] ? 1 : 0;
            } else {
                b = b && formArray[i - 3] ? 1 : 0;
            }

        });
        this.formArray = formArray;
        this.position = [chance.integer({min: 0, max: 19}), 0];
        this.active = true;
        this.save();

    }

    move() {
        if (Referee.getBottomLine()[this.position[0]] < this.position[1]) {
            this.position[1]++;
        } else {
            this.active = false;
            Referee.next();
        }

    }

    save() {
        if (!this.id) {
            Meteor.call('add', this.formArray, this.position[0]);
        }
    }

}