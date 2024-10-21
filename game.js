import { deepClone } from "./utils.js";
import { HealthPoint } from "./healthPoint.js";
import { MonsterOne } from "./monsterOne.js";

//игровая логика без отрисовки

export class Game {
    constructor(rowsCount, columnsCount, elementsCount) {
        this.rowsCount = rowsCount; // сохраняем свойства для методов класса
        this.columnsCount = columnsCount;
        this.elementsCount = elementsCount;

        this.init();

        this.healthPointPlayer = new HealthPoint ('Player');
        this.healthPointPlayer.healthPointDamage(5);
        this.MonsterOne = new MonsterOne (this.healthPointPlayer);
    }

    init() { // создание матрицы
        this.score = 0;
        this.matrix = Array(this.rowsCount).fill().map(() => new Array(this.columnsCount).fill(null));
        for (let row = 0; row < this.rowsCount; row++) { //заполняем массив слуайными значениями
            for (let column = 0; column < this.columnsCount; column++) {
                do {
                    this.matrix[row][column] = this.getRandomValue();
                } while (this.isRow(row, column)); //чтобы при создании не было больше трёх вряд 
            }
        }
    }

    getRandomValue() {
        return Math.floor(Math.random() * this.elementsCount) + 1;
    }

    isRow(row, column) {
        return this.isVerticalRow(row, column) || this.isHorizontalRow(row, column);
    }

    isVerticalRow(row, column) {
        const absValue = Math.abs(this.matrix[row][column]);
        let elementsInRow = 1;

        let currentRow = row - 1;
        while (currentRow >= 0 && Math.abs(this.matrix[currentRow][column]) === absValue) {
            elementsInRow++;
            currentRow--;
        }

        currentRow = row + 1;
        while (currentRow <= this.rowsCount - 1 && Math.abs(this.matrix[currentRow][column]) === absValue) {
            elementsInRow++;
            currentRow++;
        }

        return elementsInRow >= 3;
    }

    isHorizontalRow(row, column) {
        const absValue = Math.abs(this.matrix[row][column]);
        let elementsInRow = 1;

        let currentColumn = column - 1;
        while (currentColumn >= 0 && Math.abs(this.matrix[row][currentColumn]) === absValue) {
            elementsInRow++;
            currentColumn--;
        }

        currentColumn = column + 1;
        while (currentColumn <= this.columnsCount - 1 && Math.abs(this.matrix[row][currentColumn]) === absValue) {
            elementsInRow++;
            currentColumn++;
        }

        return elementsInRow >= 3;
    }

    swap(firstElement, secondElement) {
        this.swap2Elements(firstElement, secondElement);
        const isRowWithFirstElement = this.isRow(firstElement.row, firstElement.column);
        const isRowWithSecondElement = this.isRow(secondElement.row, secondElement.column);
        if (!isRowWithFirstElement && !isRowWithSecondElement) {
            this.swap2Elements(firstElement, secondElement);
            return null;
        }

        const swapStates = []; //массив состояния матриц
        let removedElements = 0;

        do {
            removedElements = this.removeAllRows();

            if (removedElements > 0) {
                this.score += removedElements;
                swapStates.push(deepClone(this.matrix));
                this.dropElements();
                this.fillBlanks();
                swapStates.push(deepClone(this.matrix));
            }
        } while (removedElements > 0)

        return swapStates;
    }

    swap2Elements(firstElement, secondElement) {
        const temp = this.matrix[firstElement.row][firstElement.column]; //достаём первый элемент матрицы
        this.matrix[firstElement.row][firstElement.column] = this.matrix[secondElement.row][secondElement.column]; //записываем второй элемент на место первого
        this.matrix[secondElement.row][secondElement.column] = temp;//первый на второй
    }

    removeAllRows() { // удаляет все элементы ктороые собрались больше 3 в ряд
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                this.markElementToRemoveFor(row, column);
            }
        }
        this.removeMarkedElements();
        return this.calculateRemovedElements();
    }

    markElementToRemoveFor(row, column) {//помечает отрицательными значениями собранные в ряд элементы
        if (this.isRow(row, column)) {
            this.matrix[row][column] = -1 * Math.abs(this.matrix[row][column]);
        }
    }

    removeMarkedElements() {
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                if (this.matrix[row][column] < 0) this.matrix[row][column] = null;
            }
        }
    }

    calculateRemovedElements() {
        let count = 0;
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                if (this.matrix[row][column] === null) count++;
            }
        }
        return count;
    }
    dropElements() {
        for (let column = 0; column < this.columnsCount; column++) {
            this.dropElementsInColumn(column);
        }
    }
    dropElementsInColumn(column) {
        let emptyIndex;

        for (let row = this.rowsCount - 1; row >= 0; row--) {
            if (this.matrix[row][column] === null) { //ищем пустой элемент и сохроняем где он
                emptyIndex = row;
                break;
            }
        }
        if (emptyIndex === undefined) return;

        for (let row = emptyIndex - 1; row >= 0; row--) { //меняем местами нижний пустой элемент и верхнюю плитку, типа падение
            if (this.matrix[row][column] !== null) {
                this.matrix[emptyIndex][column] = this.matrix[row][column];
                this.matrix[row][column] = null;
                emptyIndex--;
            }
        }
    }

    fillBlanks() { // заполняем пустоты случайными значениями
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                if (this.matrix[row][column] === null) this.matrix[row][column] = this.getRandomValue();
            }
        }
    }
}