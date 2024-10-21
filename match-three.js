import { Game } from "./game.js";
import { Grid } from "./grid.js";

//логика игры, логика рисования плиточек и здоровья

export class MatchThree {
    wrap = document.querySelector('.wrap');

    constructor(rowsCount, columnCount, titleCount) {
        this.game = new Game(rowsCount, columnCount, titleCount);
        this.grid = new Grid(this.wrap, this.game.matrix);
        this.wrap.addEventListener('swap', event => {
            const firstElementPosition = event.detail.firstElementPosition;
            const secondElementPosition = event.detail.secondElementPosition;
            this.swap(firstElementPosition, secondElementPosition);
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


}