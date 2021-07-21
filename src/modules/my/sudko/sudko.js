/* eslint-disable no-mixed-spaces-and-tabs */
import { LightningElement, track } from 'lwc';

export default class Sudko extends LightningElement {
    renderComplete = false;
    gameBlock;
    tempArray = [];
    totalHints = 3;
    @track gameBlockToShow = [];
    isGameCompleted = false;
	isInvalidCellValue = false;


    connectedCallback() {
    }

    renderedCallback() {
        if (!this.renderComplete) {
            this.renderComplete = true;
            this.setGameBlock();
            this.addKeyBoardEvent();
        }
    }

    addKeyBoardEvent() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            if (!isNaN(e.key)) {
                if (
                    parseInt(String(e.key), 10) >= 0 &&
                    parseInt(String(e.key), 10) <= 9
                )
                    // eslint-disable-next-line no-mixed-spaces-and-tabs
                    this.addNumberInBoard(e.key);
            }
        });
    }

    setGameBlock() {
		this.isGameCompleted = false;
		this.totalHints = 3;
        this.tempArray = new Array(9);
        for (let i = 0; i < 9; i++) this.tempArray[i] = i + 1;
        this.tempArray = this.shuffle(this.tempArray);
        this.gameBlock = new Array(9);
		this.isInvalidCellValue = false;

        for (let i = 0; i < 9; i++) {
            this.gameBlock[i] = new Array(9);
        }

        this.createSudokuBoardByArray();

        this.shuffleBoard();

        this.gameBlockToShow = new Array(9);

        for (let i = 0; i < 9; i++) {
            this.gameBlockToShow[i] = new Array(9);
        }

        this.unfillSudoku();
    }

    createSudokuBoardByArray() {
        this.gameBlock[0] = this.tempArray;

        this.gameBlock[1] = this.shiftArrayLeftByNTimes(
            [...this.gameBlock[0]],
            3
        );
        this.gameBlock[2] = this.shiftArrayLeftByNTimes(
            [...this.gameBlock[1]],
            3
        );
        this.gameBlock[3] = this.shiftArrayLeftByNTimes(
            [...this.gameBlock[2]],
            1
        );

        this.gameBlock[4] = this.shiftArrayLeftByNTimes(
            [...this.gameBlock[3]],
            3
        );
       
        this.gameBlock[5] = this.shiftArrayLeftByNTimes(
            [...this.gameBlock[4]],
            3
        );

        this.gameBlock[6] = this.shiftArrayLeftByNTimes(
            [...this.gameBlock[5]],
            1
        );
        this.gameBlock[7] = this.shiftArrayLeftByNTimes(
            [...this.gameBlock[6]],
            3
        );
       
        this.gameBlock[8] = this.shiftArrayLeftByNTimes(
            [...this.gameBlock[7]],
            3
        );
    }

    shiftArrayLeftByNTimes(tempArray, n) {
        let array1 = [];
        for (let i = 0; i < n; i++) array1.push(tempArray.shift());

        let array3 = [];
        array3 = tempArray.concat(array1);

        return array3;
    }

    shuffle(array) {
        let tmp,
            current,
            top = array.length;
        if (top)
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }

        return array;
    }

    shuffleBoard() {
        for (let i = 1; i < 4; i++) {
            let x =
                Math.floor(Math.random() * (i * 3 - (i - 1) * 3)) + (i - 1) * 3;
            let y =
                Math.floor(Math.random() * (i * 3 - (i - 1) * 3)) + (i - 1) * 3;
            while (x === y) {
                y =
                    Math.floor(Math.random() * (i * 3 - (i - 1) * 3)) +
                    (i - 1) * 3;
            }
           
            this.shuffleBoardByRow(x, y);
        }

        for (let i = 1; i < 4; i++) {
            let x =
                Math.floor(Math.random() * (i * 3 - (i - 1) * 3)) + (i - 1) * 3;
            let y =
                Math.floor(Math.random() * (i * 3 - (i - 1) * 3)) + (i - 1) * 3;
            while (x === y) {
                y =
                    Math.floor(Math.random() * (i * 3 - (i - 1) * 3)) +
                    (i - 1) * 3;
            }
            this.shuffleBoardByColumn(x, y);
        }
    }

    shuffleBoardByRow(x, y) {
        for (let i = 0; i < 9; i++) {
            let temp = this.gameBlock[x][i];
            this.gameBlock[x][i] = this.gameBlock[y][i];
            this.gameBlock[y][i] = temp;
        }
    }

    shuffleBoardByColumn(x, y) {
        for (let i = 0; i < 9; i++) {
            let temp = this.gameBlock[i][x];
            this.gameBlock[i][x] = this.gameBlock[i][y];
            this.gameBlock[i][y] = temp;
        }
    }

    unfillSudoku() {
        for (let i = 0; i < 9; i++) {
            // let obj1;
            // obj1 = {key : i};
            // this.gameBlockToShow[i] = obj1;
            for (let j = 0; j < 9; j++) {
                let obj;
                obj = {
                    class: 'non-selected',
                    cordinate: `${i}:${j}`,
                    label: '',
                    default: false
                };

                if (Math.floor(Math.random() * (2 - 0)) + 0 === 0) {
                    obj.label = this.gameBlock[i][j].toString();
                    obj.default = true;
                    obj.class = 'default';
                }

                this.gameBlockToShow[i][j] = obj;
            }
        }
    }

    numberIsOkay(x, y, randomNumber) {
        if (!this.checkHorizontal(x, y, randomNumber)) return false;
        if (!this.checkVertical(x, y, randomNumber)) return false;
        if (!this.checkQudrant(x, y, randomNumber)) return false;
        return true;
    }

    checkHorizontal(x, y, randomNumber) {
        for (let i = 0; i < 9; i++) {
            if (i !== y) {
                if (this.gameBlockToShow[x][i].label === randomNumber)
                    return false;
            }
        }
        return true;
    }

    checkVertical(x, y, randomNumber) {
        for (let i = 0; i < 9; i++) {
            if (i !== x) {
                if (this.gameBlockToShow[i][y].label === randomNumber)
                    return false;
            }
        }
        return true;
    }

    checkQudrant(x, y, randomNumber) {
        let i, j;
        if (x <= 2 && y <= 2) {
            i = 0;
            j = 0;
        } else if (x <= 2 && y >= 3 && y <= 5) {
            i = 0;
            j = 3;
        } else if (x <= 2 && y >= 6) {
            i = 0;
            j = 6;
        } else if (x <= 5 && y <= 2) {
            i = 3;
            j = 0;
        } else if (x <= 5 && y >= 3 && y <= 5) {
            i = 3;
            j = 3;
        } else if (x <= 5 && y >= 6) {
            i = 3;
            j = 6;
        } else if (x <= 8 && y <= 2) {
            i = 6;
            j = 0;
        } else if (x <= 8 && y >= 3 && y <= 5) {
            i = 6;
            j = 3;
        } else {
            i = 6;
            j = 6;
        }

        for (let a = i; a < i + 3; a++) {
            for (let b = j; b < j + 3; b++) {
                if (a !== x && b !== y) {
                    if (this.gameBlockToShow[a][b].label === randomNumber)
                        return false;
                }
            }
        }

        return true;
    }

    handleBlock(event) {
        let targetId = event.target.dataset.targetId;
        let cordinate = targetId.split(':');
        if (
            !this.gameBlockToShow[parseInt(cordinate[0], 10)][
                parseInt(cordinate[1], 10)
            ].default
        ) {
            this.gameBlockToShow.forEach((element) => {
                element.forEach((item) => {
                    if (!item.default) item.class = 'non-selected';
                });
            });
            this.gameBlockToShow[parseInt(cordinate[0], 10)][
                parseInt(cordinate[1], 10)
            ].class = 'selected';
        }
    }

    handleNumber(event) {
        let targetId = event.target.dataset.targetId;
        this.addNumberInBoard(targetId);
    }

    addNumberInBoard(selectedNumber) {
        this.gameBlockToShow.forEach((element) => {
            element.forEach((item) => {
                if (item.class === 'selected') {
                    if (selectedNumber === '0') item.label = '';
                    else item.label = selectedNumber;
                }
            });
        });
		
        this.checkGameCompleted();
    }

	checkGameCompleted(){
		let completed = true;

        this.gameBlockToShow.forEach((element) => {
            element.forEach((item) => {
                if (item.label === '') {
                    completed = false;
                }
            });
        });
        if (completed) {
            let gameCompleted = true;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (
                        !this.checkNumberIsOkay(
                            i,
                            j,
                            this.gameBlockToShow[i][j].label
                        )
                    ) {
                        gameCompleted = false;
                        break;
                    }
                }
            }

            if (gameCompleted) {
                this.isGameCompleted = true;
				this.isInvalidCellValue = false;
            }else{
				this.isInvalidCellValue = true;
			}
        }
	}

    checkNumberIsOkay(x, y, num) {
        if (!this.checkHorizontal(x, y, num)) return false;
        if (!this.checkVertical(x, y, num)) return false;
        if (!this.checkQudrant(x, y, num)) return false;
        return true;
    }

    addHints() {
        if (this.hintClicked) return false;
        if (this.totalHints > 0) {
            this.gameBlockToShow.forEach((element, indexx) => {
                element.forEach((item, indexy) => {
                    if (item.class === 'selected') {
                        if (item.label === '') {
                            item.label = this.gameBlock[indexx][indexy];
							item.class = 'default';
							item.default = true;
                            this.totalHints -= 1;
							this.checkGameCompleted();
                        }
                    }
                });
            });
        }
        return true;
    }

    get isHintsNotAvailable() {
        if (this.totalHints === 0) return true;
        return false;
    }

    resetGame() {
        this.gameBlockToShow.forEach((element) => {
            element.forEach((item) => {
                if (item.class !== 'default') {
                    item.label = '';
                }
            });
        });
    }

    playAgain() {
        this.renderComplete = false;
        this.renderedCallback();
    }
}
