const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const CONTANTS = require('../controllers/sudoku-solver.js').CONSTANTS;
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

const PATH_SOLVE = process.env.PATH_SOLVE || '/api/solve';
const PATH_CHECK = process.env.PATH_CHECK || '/api/check';

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Solve', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
      let [puzzle, solution] = puzzlesAndSolutions[0];
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.body.solution, solution);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.body.error, CONTANTS.ERR_REQUIRED_FIELD_MISSING);
          done();
        });
    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({
          puzzle: 'mustafa@kibar.pro' + puzzlesAndSolutions[0][1].substring(17),
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.body.error, CONTANTS.ERR_INVALID_CHARACTER);
          done();
        });
    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[0][1].substring(1) })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.body.error, CONTANTS.ERR_INVALID_LENGTH);
          done();
        });
    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: `18181818${puzzlesAndSolutions[0][0].substring(8)}` })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.isFalse(res.body.solved);
          assert.equal(res.body.error, CONTANTS.ERR_PUZZLE_CANNOT_BE_SOLVED);
          done();
        });
    });
  });

  suite('Check', () => {
    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B1',
          value: 9,
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B1',
          value: 8,
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict[0], 'row');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflict: POST request to /api/check', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B3',
          value: 2,
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          done();
        });
    });

    test('Check a puzzle placement with all placement conflict: POST request to /api/check', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B1',
          value: 2,
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'region');
          done();
        });
    });

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({})
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.body.error, CONTANTS.ERR_REQUIRED_FIELD_MISSING);
          done();
        });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: `mustafa@kibar.pro${puzzlesAndSolutions[0][0].substring(17)}`,
          coordinate: 'B1',
          value: 2,
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.body.error, CONTANTS.ERR_INVALID_CHARACTER);
          done();
        });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0].substring(1),
          coordinate: 'B1',
          value: 2,
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.body.error, CONTANTS.ERR_INVALID_LENGTH);
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B10',
          value: 2,
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.body.error, CONTANTS.ERR_INVALID_COORDINATE);
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B1',
          value: 0,
        })
        .end((err, res) => {
          if (err) return console.error(err);

          assert.equal(res.body.error, CONTANTS.ERR_INVALID_VALUE);
          done();
        });
    });
  });
});
