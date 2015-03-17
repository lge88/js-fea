/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var _ = require(SRC + '/core.utils.js');
var dataDriven = require('data-driven');

describe('core.utils', function() {
  describe('array1d()', function() {
    it('array1d(size, value) should work with constant', function() {
      expect(_.array1d(3, 0)).to.eql([0, 0, 0]);
    });

    it('array1d(size, fn) should work with generator function', function() {
      expect(_.array1d(3, function(x) { return x*2; })).to.eql([0, 2, 4]);
    });
  });

  describe('array2d()', function() {
    it('#array2d(m, n, fn)', function() {
      var mat = _.array2d(3, 2, function(i, j) { return i + j; });
      var expectedMat = [
        [0.0, 1.0],
        [1.0, 2.0],
        [2.0, 3.0]
      ];
      expect(mat).to.eql(expectedMat);
    });

    it('#array2d(m, n, val)', function() {
      var mat = _.array2d(3, 2, 1.0);
      var expectedMat = [
        [1.0, 1.0],
        [1.0, 1.0],
        [1.0, 1.0]
      ];
      expect(mat).to.eql(expectedMat);
    });
  });

  describe('embed()', function() {
    it('embed(notAnArray, ..) should throw', function() {
      expect(_.embed.bind(null, {})).to.throwException();
    });

    it('embed(vec, dim) should work with lower dimension', function() {
      var vec = [1, 2, 3];
      expect(_.embed(vec, 2)).to.eql([1, 2]);
    });

    it('embed(vec, dim) should work with higher dimension', function() {
      var vec = [1, 2, 3];
      expect(_.embed(vec, 5)).to.eql([1, 2, 3, 0, 0]);
    });
  });

  describe('_.byLexical', function() {
    it('should sort list of arrays by lexical', function() {
      var arr = [
        [3, 2, 1],
        [5, 4, 3],
        [0, 1, 2],
        [3, 1, 2],
        [5, 4, 0]
      ];

      expect(arr.sort(_.byLexical)).to.eql([
        [0, 1, 2],
        [3, 1, 2],
        [3, 2, 1],
        [5, 4, 0],
        [5, 4, 3]
      ]);
    });

    it('should sort list of typed arrays by lexical', function() {
      var arr = [
        new Uint32Array([3, 2, 1]),
        new Uint32Array([5, 4, 3]),
        new Uint32Array([0, 1, 2]),
        new Uint32Array([3, 1, 2]),
        new Uint32Array([5, 4, 0])
      ];

      expect(arr.sort(_.byLexical).map(function(a) {
        return Array.prototype.slice.call(a);
      })).to.eql([
        [0, 1, 2],
        [3, 1, 2],
        [3, 2, 1],
        [5, 4, 0],
        [5, 4, 3]
      ]);
    });
  });

  describe('rotateRight(arr, offset)', function() {

    var arr = [1, 2, 3, 4, 5];
    it('should work with 0', function() {
      expect(_.rotateRight(arr, 0)).to.eql(arr);
    });

    it('should work with positive integer', function() {
      expect(_.rotateLeft(arr, 1)).to.eql([2, 3, 4, 5, 1]);
      expect(_.rotateLeft(arr, 2)).to.eql([3, 4, 5, 1, 2]);
      expect(_.rotateLeft(arr, 5)).to.eql([1, 2, 3, 4, 5]);
      expect(_.rotateLeft(arr, 6)).to.eql([2, 3, 4, 5, 1]);
      expect(_.rotateLeft(arr, 8)).to.eql([4, 5, 1, 2, 3]);

      expect(_.rotateRight(arr, 1)).to.eql([5, 1, 2, 3, 4]);
      expect(_.rotateRight(arr, 2)).to.eql([4, 5, 1, 2, 3]);
      expect(_.rotateRight(arr, 5)).to.eql([1, 2, 3, 4, 5]);
      expect(_.rotateRight(arr, 6)).to.eql([5, 1, 2, 3, 4]);
      expect(_.rotateRight(arr, 8)).to.eql([3, 4, 5, 1, 2]);
    });

    it('should work with negative integer', function() {
      expect(_.rotateLeft(arr, -1)).to.eql([5, 1, 2, 3, 4]);
      expect(_.rotateLeft(arr, -2)).to.eql([4, 5, 1, 2, 3]);
      expect(_.rotateLeft(arr, -5)).to.eql([1, 2, 3, 4, 5]);
      expect(_.rotateLeft(arr, -6)).to.eql([5, 1, 2, 3, 4]);
      expect(_.rotateLeft(arr, -8)).to.eql([3, 4, 5, 1, 2]);

      expect(_.rotateRight(arr, -1)).to.eql([2, 3, 4, 5, 1]);
      expect(_.rotateRight(arr, -2)).to.eql([3, 4, 5, 1, 2]);
      expect(_.rotateRight(arr, -5)).to.eql([1, 2, 3, 4, 5]);
      expect(_.rotateRight(arr, -6)).to.eql([2, 3, 4, 5, 1]);
      expect(_.rotateRight(arr, -8)).to.eql([4, 5, 1, 2, 3]);
    });
  });


  describe('minIndex(vec)', function() {
    it('should work with []', function() {
      expect(_.minIndex([])).to.be(-1);
    });

    it('should work with [1]', function() {
      expect(_.minIndex([1])).to.be(0);
    });

    it('should work with [3, 1, 2]', function() {
      expect(_.minIndex([3, 1, 2])).to.be(1);
    });
  });

  describe('isIterator(iter)/noopIterator/listFromIterator(iter)/iteratorFromList(lst)', function() {
    it('isIterator', function() {
      var iter0 = _.iteratorFromList([]);
      var iter1 = _.noopIterator;
      var iter2 = { hasNext: false, next: function(){} };
      expect(_.isIterator(iter0)).to.be(true);
      expect(_.isIterator(iter1)).to.be(true);
      expect(_.isIterator(iter2)).to.be(false);
    });

    it('empty list', function() {
      var iter = _.iteratorFromList([]);
      expect(_.listFromIterator(iter)).to.eql([]);
    });

    it('non empty', function() {
      var lst = [3,4,3,3,2,1];
      var iter = _.iteratorFromList(lst);
      expect(_.listFromIterator(iter)).to.eql(lst);
    });
  });

  describe('uuid()', function() {
    it('should return a string', function() {
      var id, i = 10;
      while (i-- > 0) {
        id = _.uuid();
        expect(id).to.be.a('string');
        expect(id.length).to.be(36);
      }
    });
  });

  describe('normalizedCell()', function() {
    var fixtures = [
      {
        cell: [ 3, 2, 1 ],
        normalized: [1, 3, 2]
      },
      {
        cell: [ 3 ],
        normalized: [ 3 ]
      },
      {
        cell: [ 3, 4, 7, 1 ],
        normalized: [ 1, 3, 4, 7 ]
      }
    ];

    dataDriven(fixtures, function() {
      it('should return normalized cell', function(ctx) {
        expect(_.normalizedCell(ctx.cell)).to.eql(ctx.normalized);
      });
    });

  });

  describe('contracts', function() {
    var aString = _.defineContract(_.assert.string);

    it('should be able to be turn on/off', function() {
      var alwaysWrong = function() {
        throw new Error('always wrong!');
      };

      var inDevEnv = _.defineContract(alwaysWrong);
      expect(inDevEnv.bind(null, 1)).to.throwException();

      _._env = 'prod';
      var inProdEnv = _.defineContract(alwaysWrong);
      expect(inProdEnv.bind(null, 1)).not.to.throwException();

      _._env = 'dev';
    });

    it('should report error message correctly.', function() {
      var allNumbers = _.defineContract(function(a, b, c) {
        _.assert.number(a, 'a is not a number.');
        _.assert.number(b, 'b is not a number.');
        _.assert.number(c, 'c is not a number.');
      });

      expect(allNumbers.bind(null, 1, 2, 3)).not.to.throwException();
      expect(allNumbers.bind(null, '1', '2', 3)).to.throwException(/a is not a number/);
      expect(allNumbers.bind(null, 1, '2', 3)).to.throwException(/b is not a number/);


      var numWithStringMessage = _.defineContract(function(n) {
        if (!_.check.number(n)) throw new Error();
      }, 'input is not a number :(');

      expect(numWithStringMessage.bind(null, 1)).not.to.throwException();
      expect(numWithStringMessage.bind(null, '2')).to.throwException(/input is not a number/);

    });

    it('should error message be concated', function() {
      var point3d = _.defineContract(function(p) {
        _.assert.number(p.x, 'p.x: ' + p.x + ' is not a number.');
        _.assert.number(p.y, 'p.y: ' + p.y + ' is not a number.');
        _.assert.number(p.z, 'p.z: ' + p.z + ' is not a number.');
      }, 'p is not a valid 3d point.');

      var p = { x: 2, y: 3, z: NaN };

      expect(point3d.bind(null, p)).to.throwException(function(e) {
        expect(e.message).to.match(/p.z: (.+) is not a number/);
        expect(e.message).to.match(/p is not a valid 3d point/);
      });

    });

    it('should support custom function to report error message', function() {
      var vecOfLenWithMoreMessage = _.defineContract(function(vec, n) {
        if (!_.check.array(vec)) throw new Error('vec is not an array.');
        if (vec.length !== n) throw new Error('vec is not of length ' + n);
      }, function(vec, n) {
        return 'vec is not a vector of length ' + n;
      });

      var vec = [1, 2, 3, 4];

      expect(vecOfLenWithMoreMessage.bind(null, 1, 1)).to.throwException(/vec is not an array/);
      expect(vecOfLenWithMoreMessage.bind(null, vec, 5)).to.throwException(function(e) {
        expect(e.message).to.match(/vec is not of length 5/);
        expect(e.message).to.match(/vec is not a vector of length 5/);
      });
    });

    it('should support vanilla assert.', function() {
      var intFromZeroToTen = _.defineContract(function(i) {
        _.assert.integer(i);
        _.assert(i >= 0, 'i < 0');
        _.assert(i <= 10, 'i > 10');
      }, 'input is not an integer in \[0, 10\]');

      expect(intFromZeroToTen.bind(null, 0)).not.to.throwException();
      expect(intFromZeroToTen.bind(null, -1)).to.throwException(function(e) {
        expect(e.message).to.match(/i < 0/);
        expect(e.message).to.match(/input is not an integer in \[0, 10\]/);
      });

      expect(intFromZeroToTen.bind(null, 11)).to.throwException(function(e) {
        expect(e.message).to.match(/i > 10/);
        expect(e.message).to.match(/input is not an integer in \[0, 10\]/);
      });

    });

  });

  describe('matrixOfDimension(m, n, msg)', function() {
    var matrixOfDimension = _.assert.ensureMatrixOfDimension;

    var casesShouldWork = [
      {
        mat: [ [1, 2] ],
        m: 1,
        n: 2,
        desc: '1x2 matrix'
      },
      {
        mat: [ [1], [2] ],
        m: 2,
        n: 1,
        desc: '2x1 matrix'
      },
      {
        mat: [ [1, 2], [2, 3] ],
        m: 2,
        n: 2,
        desc: '2x2 matrix'
      },
      {
        mat: [ [1, 2, 4, 5], [2, 4, 5, 3] ],
        m: 2,
        n: '*',
        desc: '2 x * matrix'
      },
      {
        mat: [ [1, 2, 4 ], [2, 4, 5 ] ],
        m: 2,
        n: '*',
        desc: '2 x * matrix'
      },
      {
        mat: [ [1, 2, 4, 5], [2, 4, 5, 3] ],
        m: '*',
        n: 4,
        desc: '* x 4 matrix'
      },
      {
        mat: [ [2, 4, 5, 3] ],
        m: '*',
        n: 4,
        desc: '* x 4 matrix'
      },
      {
        mat: [ [2, 4], [3, 4] ],
        m: '*',
        n: '*',
        desc: '* x * matrix'
      },
      {
        mat: [ [2, 4] ],
        m: '*',
        n: '*',
        desc: '* x * matrix'
      },
      {
        mat: [ [2], [4] ],
        m: '*',
        n: '*',
        desc: '* x * matrix'
      }
    ];


    it('should not define a matrix of 0 dimension', function() {
      expect(matrixOfDimension.bind(null, 0, 2)).to.throwException();
      expect(matrixOfDimension.bind(null, 2, 0)).to.throwException();
    });

    dataDriven(casesShouldWork, function() {
      it('should work {desc}', function(ctx) {
        var contract = matrixOfDimension(ctx.m, ctx.n);
        expect(contract.bind(null, ctx.mat)).not.to.throwException();
        expect(_.isMatrixOfDimension(ctx.mat, ctx.m, ctx.n)).to.be(true);
      });
    });

    var casesShouldNotWork = [
      {
        mat: 1,
        m: 1,
        n: 1,
        desc: '1x1 matrix'
      },
      {
        mat: [1, 2],
        m: 1,
        n: 2,
        desc: '1x2 matrix'
      },
      {
        mat: [ [1, 2] ],
        m: 1,
        n: 1,
        desc: '1x2 matrix'
      },
      {
        mat: [ [1, 2], [1] ],
        m: 2,
        n: 1,
        desc: 'not even a valid matrix'
      },
      {
        mat: [ [1, 2], [1, NaN] ],
        m: 2,
        n: 2,
        desc: 'has invalid element'
      },
      {
        mat: [ [1, 2], [1, '1'] ],
        m: 2,
        n: 2,
        desc: 'has invalid element'
      },
      {
        mat: [ [2, 4, 5 ] ],
        m: '*',
        n: 4,
        desc: '* x 4 matrix'
      },
      {
        mat: [ [2, 4, 5 ], [2, 1] ],
        m: 2,
        n: '*',
        desc: '2 x * matrix'
      },
      {
        mat: [ [2, 4, 5 ], [2, 1] ],
        m: '*',
        n: '*',
        desc: '* x * matrix'
      },
      {
        mat: [ [2], [2, 1] ],
        m: '*',
        n: '*',
        desc: '* x * matrix'
      }

    ];

    dataDriven(casesShouldNotWork, function() {
      it('should not work {desc}', function(ctx) {
        var contract = matrixOfDimension(ctx.m, ctx.n);
        expect(contract.bind(null, ctx.mat)).to.throwException(function(e) {
          // console.log(e.message);
        });
        expect(_.isMatrixOfDimension(ctx.mat, ctx.m, ctx.n)).to.be(false);
      });
    });
  });

  describe('vectorOfDimension(n, msg)', function() {
    var vectorOfDimension = _.assert.ensureVectorOfDimension;

    var casesShouldWork = [
      {
        vec: [ 1, 2 ],
        n: 2,
        desc: '2D vector'
      },
      {
        vec: [ 1 ],
        n: 1,
        desc: '1D vector'
      },
      {
        vec: [ 1 ],
        n: '*',
        desc: '*D vector'
      },
      {
        vec: [ 1, 2 ],
        n: '*',
        desc: '*D vector'
      },

    ];

    it('should not define a vector of 0 dimension', function() {
      expect(vectorOfDimension.bind(null, 0)).to.throwException();
    });

    dataDriven(casesShouldWork, function() {
      it('should work {desc}', function(ctx) {
        var contract = vectorOfDimension(ctx.n);
        expect(contract.bind(null, ctx.vec)).not.to.throwException();
        expect(_.isVectorOfDimension(ctx.vec, ctx.n)).to.be(true);
      });
    });

    var casesShouldNotWork = [
      {
        vec: 1,
        n: 1,
        desc: 'single number is not a vector'
      },
      {
        vec: [1, 2],
        n: 1,
        desc: 'vector length is not expected'
      },
      {
        vec: [1, NaN],
        n: 2,
        desc: 'has invalid element'
      },
      {
        vec: [1, '2'],
        n: 2,
        desc: 'has invalid element'
      },
      {
        vec: [1, '2'],
        n: '*',
        desc: 'has invalid element'
      }
    ];

    dataDriven(casesShouldNotWork, function() {
      it('should not work {desc}', function(ctx) {
        var contract = vectorOfDimension(ctx.n);
        expect(contract.bind(null, ctx.vec)).to.throwException(function(e) {
          // console.log(e.message);
        });
        expect(_.isVectorOfDimension(ctx.vec, ctx.n)).to.be(false);
      });
    });
  });


});
