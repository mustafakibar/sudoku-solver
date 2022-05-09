// row:  A , B , C , D , E , F , G , H , I
// puzzle: ..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..

const CONFLICT_ROW = 'row';
const CONFLICT_COLUMN = 'column';
const CONFLICT_REGION = 'region';

class SudokuSolver {
  validate(puzzleString) {
    const result = {
      valid: false,
      error: null,
    };
    if (!puzzleString) {
      result.error = 'Required field missing';
      return result;
    }

    if (puzzleString.length != 81) {
      result.error = 'Expected puzzle to be 81 characters long';
      return result;
    }

    if (puzzleString.replace(/[1-9.]/g, '').length > 0) {
      result.error = 'Invalid characters in puzzle';
      return result;
    }

    result.valid = true;
    return result;
  }

  createIndexData(rawRow, rawColumn) {
    // If column is null, row will be used as the index
    if (!rawColumn) {
      return this.createIndexData(Math.floor(rawRow / 9) + 1, (rawRow % 9) + 1);
    }

    const row = isNaN(rawRow)
      ? rawRow.toUpperCase().charCodeAt(0) - 64
      : rawRow;
    if (row <= 0 || row > 9) {
      console.log('Row must be in A-I');
      return null;
    }

    const column = Number(rawColumn);
    if (column <= 0 || column > 9) {
      console.log('Column must be in 1-9');
      return null;
    }

    return { row, column };
  }

  checkRowPlacement(str, indexData, value) {
    for (let row = 1; row <= 9; row++) {
      if (
        row !== indexData.row &&
        this.getValue(str, row, indexData.column) === String(value)
      ) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(str, indexData, value) {
    for (let column = 1; column <= 9; column++) {
      if (
        column != indexData.column &&
        this.getValue(str, indexData.row, column) === String(value)
      ) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(str, indexData, value) {
    const BASE = 3;
    const OFFSET = {
      x: BASE * (Math.ceil(indexData.column / BASE) - 1),
      y: BASE * (Math.ceil(indexData.row / BASE) - 1),
    };

    for (let x = OFFSET.x; x < OFFSET.x + BASE; x++) {
      for (let y = OFFSET.y; y < OFFSET.y + BASE; y++) {
        if (str[x + y * 9] === String(value)) {
          return false;
        }
      }
    }

    return true;
  }

  getValue(str, row, column) {
    return str[(row - 1) * 9 + column - 1];
  }

  setValueAt(str, index, value) {
    return str.substring(0, index) + value + str.substring(index + 1);
  }

  check(puzzleString, row, column, value) {
    const indexData = this.createIndexData(row, column);
    return !indexData
      ? false
      : this.checkByIndexData(puzzleString, indexData, value);
  }

  checkByIndexData(puzzleString, indexData, value) {
    const result = {
      valid: true,
      conflict: [],
    };

    if (!this.checkRowPlacement(puzzleString, indexData, value)) {
      result.valid = false;
      result.conflict.push(CONFLICT_ROW);
    }

    if (!this.checkColPlacement(puzzleString, indexData, value)) {
      result.valid = false;
      result.conflict.push(CONFLICT_COLUMN);
    }

    if (!this.checkRegionPlacement(puzzleString, indexData, value)) {
      result.valid = false;
      result.conflict.push(CONFLICT_REGION);
    }

    return result;
  }

  solve(puzzleString) {
    const result = {
      solved: false,
      puzzle: null,
    };

    let index = 0;
    let edited = false;
    while (index < 81) {
      const value = puzzleString[index];
      if (value === '.') {
        const indexData = this.createIndexData(index);
        let guess = null;
        inner: for (let num = 1; num <= 9; num++) {
          if (this.checkByIndexData(puzzleString, indexData, num).valid) {
            // There is a more than one guess, so we need to break out of the inner loop
            if (guess) {
              guess = null;
              break inner;
            }

            guess = num;
          }
        }

        if (guess) {
          puzzleString = this.setValueAt(puzzleString, index, guess);
          edited = true;
        }
      }

      if (edited && index === 80 && puzzleString.includes('.')) {
        index = 0;
        edited = false;
      } else {
        index++;
      }
    }

    result.solved = puzzleString && puzzleString.indexOf('.') == -1;
    result.puzzle = puzzleString;
    return result;
  }
}

module.exports = SudokuSolver;
