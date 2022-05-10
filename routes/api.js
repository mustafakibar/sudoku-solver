'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js').SudokuSolver;

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate = '', value } = req.body;

    const row =
      coordinate && coordinate.length > 0 ? req.body.coordinate[0] : null;
    const column =
      coordinate && coordinate.length > 1
        ? req.body.coordinate.substring(1)
        : null;

    res.json(solver.check(puzzle, row, column, value));
  });

  app
    .route('/api/solve')
    .post((req, res) => res.json(solver.solve(req.body.puzzle)));
};
