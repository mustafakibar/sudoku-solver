const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js').SudokuSolver;
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

const solver = new Solver();

suite('UnitTests', () => {
  suite('Validate Puzzle', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
      const { valid } = solver.validate(puzzlesAndSolutions[0][0]);
      assert.isTrue(valid);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
      const { valid } = solver.validate(
        'A-' + puzzlesAndSolutions[0][0].substring(2)
      );
      assert.isFalse(valid);
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
      const { valid } = solver.validate(puzzlesAndSolutions[0][0].substring(2));
      assert.isFalse(valid);
    });
  });

  suite('Check Placement', () => {
    test('Logic handles a valid row placement', () => {
      assert.isTrue(
        solver.checkRowPlacement(
          puzzlesAndSolutions[0][0],
          solver.createIndexData(2, 1),
          9
        )
      );
    });

    test('Logic handles a invalid row placement', () => {
      assert.isFalse(
        solver.checkRowPlacement(
          puzzlesAndSolutions[0][0],
          solver.createIndexData(2, 1),
          8
        )
      );
    });

    test('Logic handles a valid column placement', () => {
      assert.isTrue(
        solver.checkColPlacement(
          puzzlesAndSolutions[0][0],
          solver.createIndexData(2, 1),
          9
        )
      );
    });

    test('Logic handles a invalid column placement', () => {
      assert.isFalse(
        solver.checkColPlacement(
          puzzlesAndSolutions[0][0],
          solver.createIndexData(2, 1),
          6
        )
      );
    });

    test('Logic handles a valid region (3x3 grid) placement', () => {
      assert.isTrue(
        solver.checkRegionPlacement(
          puzzlesAndSolutions[0][0],
          solver.createIndexData(2, 1),
          9
        )
      );
    });

    test('Logic handles an invalid region (3x3 grid) placement', () => {
      assert.isFalse(
        solver.checkRegionPlacement(
          puzzlesAndSolutions[0][0],
          solver.createIndexData(2, 1),
          1
        )
      );
    });
  });

  suite('Solve Puzzle', () => {
    test('Valid puzzle strings pass the solver', () => {
      puzzlesAndSolutions.forEach(([solve, _]) => {
        const { solved } = solver.solve(solve);
        assert.isTrue(solved);
      });
    });

    test('Invalid puzzle strings fail the solver', () => {
      puzzlesAndSolutions.forEach(([solve, _]) => {
        const { solved } = solver.solve(`18181818${solve.substring(8)}`);
        assert.isFalse(solved);
      });
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
      puzzlesAndSolutions.forEach(([solve, orgSolution]) => {
        const { solved, solution } = solver.solve(solve);
        assert.isTrue(solved);
        assert.equal(solution, orgSolution);
      });
    });
  });
});
