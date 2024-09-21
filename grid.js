import { Tile } from "./tile.js";
import { delay } from "./utils.js";

//логика отрисовки плиточек по готовой матрице

export class Grid {
    tiles = [];
    selectedTile = null;
    isGameBlocked = false;

    constructor(wrap, matrix) {
        this.wrap = wrap;
        this.createTiles(matrix);
    }

    createTiles(matrix) {
        for (let row = 0; row < matrix.length; row++) {
            for (let column = 0; column < matrix[0].length; column++) {
                this.createTile(row, column, matrix[row][column]);
            }
        }
    }

    async createTile(row, column, value) {
        const tile = new Tile(this.wrap, row, column, value, this.handleTileClick);
        this.tiles.push(tile);
        await tile.waitForAnimationEnd();
    }

    handleTileClick = (row, column) => {
        if (this.isGameBlocked) return;

        if (!this.selectedTile) {
            this.selectTile(row, column);
            return;
        }

        const isSelectedNeighbors = this.isSelectedNeighborsWith(row, column);
        if (!isSelectedNeighbors) {
            this.unselectTile();
            this.selectTile(row, column);
            return;
        }

        const firstElementPosition = { row: this.selectedTile.row, column: this.selectedTile.column, };
        const secondElementPosition = { row, column };

        const event = new CustomEvent('swap', { // чтобы убрать лишнюю логику в класе грид
            detail: {
                firstElementPosition,
                secondElementPosition
            }
        });

        this.wrap.dispatchEvent(event);
    }

    selectTile(row, column) {
        this.selectedTile = this.findTileBy(row, column);
        this.selectedTile.select();
    }

    unselectTile() {
        this.selectedTile.unselect();
        this.selectedTile = null;
    }

    findTileBy(row, column) {
        return this.tiles.find(tile => tile.row === row && tile.column === column);
    }

    isSelectedNeighborsWith(row, column) {
        const isColumnNeighbors = this.selectedTile.column === column && Math.abs(this.selectedTile.row - row) === 1;
        const isRowNeighbors = this.selectedTile.row === row && Math.abs(this.selectedTile.column - column) === 1;
        return isColumnNeighbors || isRowNeighbors;
    }

    async swap(firstTilePosition, secondTilePosition, swapStates) {
        this.isGameBlocked = true;

        const firstTile = this.findTileBy(firstTilePosition.row, firstTilePosition.column);
        const secondTile = this.findTileBy(secondTilePosition.row, secondTilePosition.column);
        this.unselectTile();
        const firstTileAnimation = this.moveTileTo(firstTile, secondTilePosition);
        const secondTileAnimation = this.moveTileTo(secondTile, firstTilePosition);
        await Promise.all([firstTileAnimation, secondTileAnimation]);

        if (!swapStates) {
            const firstTileAnimation = this.moveTileTo(firstTile, firstTilePosition);
            const secondTileAnimation = this.moveTileTo(secondTile, secondTilePosition);
            await Promise.all([firstTileAnimation, secondTileAnimation]);
            this.isGameBlocked = false;
            return;
        }

        for (let i = 0; i < swapStates.length; i += 2) { // анимация удаления плиточек, у каждой пары матриц
            await this.removeTiles(swapStates[i]);
            await this.dropTiles(swapStates[i], swapStates[i + 1]);
            await delay(100);
        }

        this.isGameBlocked = false;
    }

    async moveTileTo(tile, position) {
        tile.setPositionBy(position.row, position.column);
        await tile.waitForTransitionEnd();
    }

    async removeTiles(grid) {
        const animations = []; // промисы окончаний анимации
        for (let row = 0; row < grid.length; row++) {
            for (let column = 0; column < grid[0].length; column++) {
                if (grid[row][column] === null) {
                    const tile = this.findTileBy(row, column);
                    const tileAnimation = tile.remove();
                    this.removeTileFromArrayBy(row, column);
                    animations.push(tileAnimation);
                }
            }
        }
        await Promise.all(animations);
    }

    removeTileFromArrayBy(row, column) { // новый массив без указаных строки и столбца плиточки
        this.tiles = this.tiles.filter(tile => tile.row !== row || tile.column !== column);
    }

    async dropTiles(gridBefore, gridAfter) {
        const animations = []; // масссив для промисов анимации
        for (let column = 0; column < gridBefore[0].length; column++) {
            const columnBefore = gridBefore.map(elementsInRow => elementsInRow[column]); // вытягиваем столбец которую будем заменять
            const columnAfter = gridAfter.map(elementsInRow => elementsInRow[column]); // вытягиваем новый солбец для замены
            const columnAnimation = this.dropTilesInColumn(columnBefore, columnAfter, column); // раняем эелемент в одном столбце
            animations.push(columnAnimation);
        }

        await Promise.all(animations);
    }

    async dropTilesInColumn(columnBefore, columnAfter, column) { //в цикле  опускаем все элементы в столбце вниз на один и добавляем новый сверху
        let updatedColumn = [...columnBefore]; //копия
        while (updatedColumn.includes(null)) { //есть ли в столбце пустой
            updatedColumn = await this.dropTilesInColumnOnce(updatedColumn, column);
            updatedColumn = await this.addTileInColumnOnce(updatedColumn, columnAfter, column);
        }
    }

    async dropTilesInColumnOnce(columnBefore, column) { //возвращает обновлённый столбец со смещёнными элементами
        const animations = [];// промисы
        const updatedColumn = [...columnBefore]; // копия
        for (let row = updatedColumn.length - 1; row > 0; row--) { // до предпоследнего чтобы отсавить место под пустой
            if (updatedColumn[row] === null && updatedColumn[row - 1] !== null) { // не пустой сверху на пустой снизу и промис в массив анимаций
                const tile = this.findTileBy(row - 1, column);
                const tileAnimation = this.moveTileTo(tile, { row, column });
                updatedColumn[row] = updatedColumn[row - 1];
                updatedColumn[row - 1] = null;
                animations.push(tileAnimation);
            }
        }
        await Promise.all(animations);
        return updatedColumn;
    }

    async addTileInColumnOnce(columnBefore, columnAfter, column) { // возвращает исправленный столбец
        const updatedColumn = [...columnBefore]; //копия
        if (updatedColumn[0] === null) { // если есть место сверху для новой
            const countEmpty = updatedColumn.filter(value => value === null).length; // количество пустых, нужно чтобы брать сверху элемент
            await this.createTile(0, column, columnAfter[countEmpty - 1]);// добовляем из готового столбца
            updatedColumn[0] = columnAfter[countEmpty - 1];
        }

        return updatedColumn;
    }
}
