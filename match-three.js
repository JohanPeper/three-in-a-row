import { Game } from "./game.js";
import { Grid } from "./grid.js";
import { MonsterOne } from "./monsterOne.js";

//логика игры, логика рисования плиточек

export class MatchThree {
    wrap = document.querySelector('.wrap');

    constructor(rowsCount, columnCount, titleCount) {
        this.game = new Game(rowsCount, columnCount, titleCount);
        this.grid = new Grid(this.wrap, this.game.matrix);
        this.wrap.addEventListener('swap', event => {
            const firstElementPosition = event.detail.firstElementPosition;
            const secondElementPosition = event.detail.secondElementPosition;
            this.swap(firstElementPosition, secondElementPosition);
            this.game.monsterOne.takeDamage(this.game.score);
            this.game.player.reloadAttackAnimation(this.game.score);
           /* if (this.game.monsterOne.healthPoint.currentHP <= 0) {
                this.nextMonster();
            }*/
        });


    }
    async swap(firstElementPosition, secondElementPosition) {
        const swapStates = this.game.swap(firstElementPosition, secondElementPosition); // массив матриц до и после сборки ряда
        await this.grid.swap(firstElementPosition, secondElementPosition, swapStates);
        this.updateScore();
    }

    updateScore() {
        document.querySelector(".score").innerHTML = this.game.score;
    }

    async nextMonster() {
        await this.sleep(2050);
        this.game.monsterOne = new MonsterOne(this.game.player);
    }

    sleep(ms) { // задержка для кода
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}