'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const puzzleString = req.body.puzzle;
    const row = req.body.coordinate[0];
    const column = req.body.coordinate[1];
    const value = req.body.value;

    solver.check(puzzleString, row, column, value); //ok
  });

  app.route('/api/solve').post((req, res) => {
    const puzzleString = req.body.puzzle;
    solver.solve(puzzleString);
  });
};
