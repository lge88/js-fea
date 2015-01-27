/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var Bipartite = require(SRC + '/core.bipartite.js').Bipartite;

describe('core.bipartite', function() {

  describe('basic', function() {
    var g;

    function create() {
      it('#constructor()', function() {
        g = new Bipartite([
          [ 'A', '1' ],
          [ 'A', '2' ],
          [ 'A', '3' ],
          [ 'B', '1' ],
          [ 'B', '3' ],
          [ 'C', '2' ],
          [ 'C', '3' ]
        ]);
      });
    }

    function init() {
      it('#addEdge()', function() {
        g.addEdge([ 'A', '1' ]);
        g.addEdge([ 'A', '2' ]);
        g.addEdge([ 'A', '3' ]);
        g.addEdge([ 'B', '1' ]);
        g.addEdge([ 'B', '3' ]);
        g.addEdge([ 'C', '2' ]);
        g.addEdge([ 'C', '3' ]);
      });
    }

    function run() {
      it('#getNumOfLeftNodes()', function() {
        expect(g.getNumOfLeftNodes()).to.be(3);
      });

      it('#getNumOfRightNodes()', function() {
        expect(g.getNumOfRightNodes()).to.be(3);
      });

      it('#getNumOfNodes()', function() {
        expect(g.getNumOfNodes()).to.be(6);
      });

      it('#getNumOfEdges()', function() {
        expect(g.getNumOfEdges()).to.be(7);
      });

      it('#empty()', function() {
        expect(g.empty()).to.be(false);
      });

      it('#hasNode', function() {
        expect(g.hasNode('A')).to.be(true);
        expect(g.hasNode('3')).to.be(true);
        expect(g.hasNode('d')).to.be(false);
      });


      it('#hasEdge(left, right)/#hasPair(left, right)', function() {
        expect(g.hasEdge('1', 'B')).to.be(false);
        expect(g.hasPair('1', 'B')).to.be(true);

        expect(g.hasEdge('B', '1')).to.be(true);
        expect(g.hasPair('B', '1')).to.be(true);

        expect(g.hasPair('C', '3')).to.be(true);
        expect(g.hasPair('C', '1')).to.be(false);
      });

      it('#getDegree(node)', function() {
        expect(g.getDegree('A')).to.be(3);
        expect(g.getDegree('2')).to.be(2);
      });

      it('#getNeighbors()', function() {
        expect(g.getNeighbors('1').sort()).to.eql(['A', 'B']);
        expect(g.getNeighbors('C').sort()).to.eql(['2', '3']);
      });

      it('#isAdjacent(left, right)', function() {
        expect(g.isAdjacent('1', 'B')).to.be(true);
        expect(g.isAdjacent('1', '2')).to.be(false);
      });

      it('#getGroupName()', function() {
        expect(g.getGroupName('1')).to.be('right');
        expect(g.getGroupName('A')).to.be('left');
        expect(g.getGroupName('d')).to.be('none');
      });

      it('#forEach<LeftNode|RightNode|Edge>()', function() {
        var lns = [], rns = [], es = [];
        g.forEachLeftNode(function(n) { lns.push(n + n); });
        g.forEachRightNode(function(n) { rns.push(n + n); });
        g.forEachEdge(function(l, r) { es.push(l + r); });

        expect(lns.sort()).to.eql(['AA', 'BB', 'CC']);
        expect(rns.sort()).to.eql(['11', '22', '33']);
        expect(es.sort()).to.eql(['A1', 'A2', 'A3', 'B1', 'B3', 'C2', 'C3']);
      });
    }

    function clear() {
      it('#clear()', function() {
        g.clear();
        expect(g.getNumOfLeftNodes()).to.be(0);
        expect(g.getNumOfRightNodes()).to.be(0);
        expect(g.getNumOfNodes()).to.be(0);
        expect(g.getNumOfEdges()).to.be(0);
        expect(g.empty()).to.be(true);
      });
    }

    create();
    run();
    clear();
    init();
    run();

  });

  describe('removeNode', function() {
    var g = new Bipartite([
      [ 'A', '1' ],
      [ 'A', '2' ],
      [ 'A', '3' ],
      [ 'B', '1' ],
      [ 'B', '3' ],
      [ 'C', '2' ],
      [ 'C', '3' ]
    ], null, false);

    it('#removeNodde', function() {
      g.removeNode('1');
      expect(g.hasNode('1')).to.be(true);
      expect(g.getDegree('1')).to.be(0);
      expect(g.getDegree('A')).to.be(2);
      expect(g.getDegree('B')).to.be(1);
      expect(g.isAdjacent('B', '1')).to.be(false);
      expect(g.getNeighbors('1').sort()).to.eql([]);
    });
  });

  describe('auto remove isolated nodes', function() {
     var g = new Bipartite([
      [ 'A', '1' ],
      [ 'A', '2' ],
      [ 'A', '3' ],
      [ 'B', '1' ],
      [ 'B', '3' ],
      [ 'C', '2' ],
      [ 'C', '3' ]
     ], null, true);

    it('#removeNode', function() {
      g.removeNode('1');
      expect(g.hasNode('1')).to.be(false);

      g.removeEdge('A', '2');
      g.removeEdge('A', '3');
      expect(g.hasNode('A')).to.be(false);

      g.addLeftNode('D');
      expect(g.hasNode('D')).to.be(true);
      expect(g.getDegree('D')).to.be(0);
    });

  });

});
