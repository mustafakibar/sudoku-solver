// row:  A , B , C , D , E , F , G , H , I
// puzzle: ..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..

class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }

    if (puzzleString.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    if (puzzleString.replace(/[1-9.]/g, '').length > 0) {
      return { error: 'Invalid characters in puzzle' };
    }

    return { error: false };
  }

  createCoordinate(row, column) {
    const x = isNaN(row) ? row.toUpperCase().charCodeAt(0) - 64 : row;
    if (x <= 0 || x > 9) {
      console.log('Row must be in A-I');
      return null;
    }

    const y = Number(column);
    if (y <= 0 || y > 9) {
      console.log('Column must be in 1-9');
      return null;
    }

    return { x, y };
  }

  checkRowPlacement(puzzleString, coordinate, value) {
    for (let row = 1; row <= 9; row++) {
      if (
        row !== coordinate.x &&
        this.getValue(puzzleString, row, coordinate.y) === String(value)
      ) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, coordinate, value) {
    for (let column = 1; column <= 9; column++) {
      if (
        column != coordinate.y &&
        this.getValue(puzzleString, coordinate.x, column) === String(value)
      ) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, coordinate, value) {
    const BASE = 3;
    const OFFSET = {
      x: BASE * (Math.ceil(coordinate.y / BASE) - 1),
      y: BASE * (Math.ceil(coordinate.x / BASE) - 1),
    };

    for (let x = OFFSET.x; x < OFFSET.x + BASE; x++) {
      for (let y = OFFSET.y; y < OFFSET.y + BASE; y++) {
        if (puzzleString[x + y * 9] === String(value)) {
          return false;
        }
      }
    }

    return true;
  }

  check(puzzleString, row, column, value) {
    const coordinate = this.createCoordinate(row, column);
    if (!coordinate) {
      return false;
    }

    return this.checkByCoordinate(puzzleString, coordinate, value);
  }

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
