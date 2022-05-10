// row:  A , B , C , D , E , F , G , H , I
// puzzle: ..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..

const CONFLICT_ROW = 'row';
const CONFLICT_COLUMN = 'column';
const CONFLICT_REGION = 'region';

const ERR_REQUIRED_FIELD_MISSING = 'Required field missing';
const ERR_INVALID_LENGTH = 'Expected puzzle to be 81 characters long';
const ERR_INVALID_CHARACTER = 'Invalid characters in puzzle';
const ERR_INVALID_COORDINATE = 'Invalid coordinate';
const ERR_INVALID_VALUE = 'Invalid value';
const ERR_PUZZLE_CANNOT_BE_SOLVED = 'Puzzle cannot be solved';

class SudokuSolver {
  validate(puzzle) {
    let error;

    if (!puzzle) {
      error = ERR_REQUIRED_FIELD_MISSING;
    } else if (puzzle.length != 81) {
      error = ERR_INVALID_LENGTH;
    } else if (puzzle.replace(/[1-9.]/g, '').length > 0) {
      error = ERR_INVALID_CHARACTER;
    }

    return {
      valid: error ? false : true,
      error,
    };
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
      return { error: ERR_INVALID_COORDINATE };
    }

    const column = Number(rawColumn);
    if (column <= 0 || column > 9) {
      return { error: ERR_INVALID_COORDINATE };
    }

    return { row, column };
  }

  checkRowPlacement(puzzle, indexData, value) {
    for (let row = 1; row <= 9; row++) {
      if (
        row !== indexData.row &&
        this.getValue(puzzle, row, indexData.column) === String(value)
      ) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzle, indexData, value) {
    for (let column = 1; column <= 9; column++) {
      if (
        column != indexData.column &&
        this.getValue(puzzle, indexData.row, column) === String(value)
      ) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzle, indexData, value) {
    const BASE = 3;
    const OFFSET = {
      x: BASE * (Math.ceil(indexData.column / BASE) - 1),
      y: BASE * (Math.ceil(indexData.row / BASE) - 1),
    };

    for (let x = OFFSET.x; x < OFFSET.x + BASE; x++) {
      for (let y = OFFSET.y; y < OFFSET.y + BASE; y++) {
        if (puzzle[x + y * 9] === String(value)) {
          return false;
        }
      }
    }

    return true;
  }

  getValue(puzzle, row, column) {
    return puzzle[(row - 1) * 9 + column - 1];
  }

  setValueAt(puzzle, index, value) {
    return puzzle.substring(0, index) + value + puzzle.substring(index + 1);
  }

  check(puzzle, row, column, value) {
    const indexData = this.createIndexData(row, column);
    return !indexData ? false : this.checkByIndexData(puzzle, indexData, value);
  }

  checkByIndexData(puzzle, indexData, value) {
    if (indexData.error) {
      return indexData;
    }

    const validate = this.validate(puzzle);
    if (!validate.valid) return validate;

    if (value <= 0 || value > 9) {
      return { valid: false, error: ERR_INVALID_VALUE };
    }

    const conflict = [];

    if (!this.checkRowPlacement(puzzle, indexData, value)) {
      conflict.push(CONFLICT_ROW);
    }

    if (!this.checkColPlacement(puzzle, indexData, value)) {
      conflict.push(CONFLICT_COLUMN);
    }

    if (!this.checkRegionPlacement(puzzle, indexData, value)) {
      conflict.push(CONFLICT_REGION);
    }

    return {
      valid: conflict.length === 0,
      conflict,
    };
  }

  solve(puzzle) {
    const validate = this.validate(puzzle);
    if (!validate.valid) return validate;

    let index = 0;
    let edited = false;
    while (index < 81) {
      const value = puzzle[index];
      if (value === '.') {
        const indexData = this.createIndexData(index);
        let guess = null;
        inner: for (let num = 1; num <= 9; num++) {
          if (this.checkByIndexData(puzzle, indexData, num).valid) {
            // There is a more than one guess, so we need to break out of the inner loop
            if (guess) {
              guess = null;
              break inner;
            }

            guess = num;
          }
        }

        if (guess) {
          puzzle = this.setValueAt(puzzle, index, guess);
          edited = true;
        }
      }

      if (edited && index === 80 && puzzle.includes('.')) {
        index = 0;
        edited = false;
      } else {
        index++;
      }
    }

    const solved = puzzle && puzzle.indexOf('.') == -1;

    return {
      solved,
      solution: puzzle,
      error: solved ? null : ERR_PUZZLE_CANNOT_BE_SOLVED,
    };
  }
}

module.exports = {
  SudokuSolver,
  CONSTANTS: {
    ERR_INVALID_CHARACTER,
    ERR_INVALID_COORDINATE,
    ERR_INVALID_VALUE,
    ERR_REQUIRED_FIELD_MISSING,
    ERR_INVALID_LENGTH,
    ERR_PUZZLE_CANNOT_BE_SOLVED,
  },
};
