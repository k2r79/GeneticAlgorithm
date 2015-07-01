var expect = chai.expect;

describe("A Chromosome", function() {

    var chromosome;

    before(function(done) {
        chromosome = new Chromosome();

        done();
    });

    it("has three genes", function(done) {
        expect(chromosome.genes.length).to.equal(3);

        expect(chromosome.genes[0].length).to.equal(8);
        expect(chromosome.genes[1].length).to.equal(8);
        expect(chromosome.genes[2].length).to.equal(8);

        done();
    });
});

describe("A Genetic Code", function() {

    var geneticCode;

    before(function(done) {
        geneticCode = new GeneticCode(4);

        setChromosomes();
        setIdeal();

        done();
    });

    function setChromosomes() {
        geneticCode.chromosomes[0].genes = [
            [ 0, 0, 1, 0, 1, 0, 1, 1],
            [ 1, 0, 0, 0, 1, 0, 1, 0],
            [ 1, 0, 1, 1, 0, 0, 0, 1]
        ];

        geneticCode.chromosomes[1].genes = [
            [ 1, 0, 1, 1, 1, 0, 1, 0],
            [ 0, 1, 0, 1, 1, 0, 0, 0],
            [ 0, 0, 1, 1, 0, 1, 0, 1]
        ];

        geneticCode.chromosomes[2].genes = [
            [ 1, 0, 0, 0, 1, 0, 0, 1],
            [ 0, 0, 0, 1, 1, 0, 0, 1],
            [ 1, 1, 0, 1, 1, 1, 0, 0]
        ];

        geneticCode.chromosomes[3].genes = [
            [ 1, 1, 1, 1, 0, 0, 0, 1],
            [ 0, 0, 1, 1, 0, 1, 1, 0],
            [ 0, 0, 1, 1, 1, 0, 1, 0]
        ];
    }

    function setIdeal() {
        geneticCode.ideal[0].genes = [
            [ 1, 1, 1, 0, 1, 1, 0, 1],
            [ 0, 0, 0, 1, 1, 0, 1, 0],
            [ 0, 0, 1, 1, 0, 0, 1, 1]
        ];

        geneticCode.ideal[1].genes = [
            [ 1, 0, 1, 0, 1, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 0, 0, 0],
            [ 1, 0, 1, 0, 0, 1, 1, 1]
        ];

        geneticCode.ideal[2].genes = [
            [ 0, 0, 0, 0, 1, 0, 1, 1],
            [ 1, 0, 1, 0, 1, 0, 0, 1],
            [ 1, 1, 0, 1, 1, 1, 1, 1]
        ];

        geneticCode.ideal[3].genes = [
            [ 1, 1, 1, 1, 0, 1, 0, 0],
            [ 0, 0, 0, 1, 1, 1, 1, 0],
            [ 0, 1, 1, 1, 0, 0, 1, 1]
        ];
    }

    it("has multiple chromosomes", function(done) {
        expect(geneticCode.chromosomes.length).to.equal(4);

        done();
    });

    it("has an ideal the same size as it's chromosomes", function(done) {
        expect(geneticCode.ideal.length).to.equal(geneticCode.chromosomes.length);

        done();
    });

    it("has a fitness function", function(done) {
        geneticCode.computeFitness();

        expect(geneticCode.chromosomes[0].fitness).to.equal(16);
        expect(geneticCode.chromosomes[1].fitness).to.equal(17);
        expect(geneticCode.chromosomes[2].fitness).to.equal(17);
        expect(geneticCode.chromosomes[3].fitness).to.equal(17);

        done();
    });

    it("generates a mating wheel", function(done) {
        geneticCode.generateMatingWheel();

        expect(geneticCode.chromosomes[0].matingRange[0]).to.equal(0);
        expect(geneticCode.chromosomes[0].matingRange[1]).to.equal(0.238);

        expect(geneticCode.chromosomes[1].matingRange[0]).to.equal(0.238);
        expect(geneticCode.chromosomes[1].matingRange[1]).to.equal(0.491);

        expect(geneticCode.chromosomes[2].matingRange[0]).to.equal(0.491);
        expect(geneticCode.chromosomes[2].matingRange[1]).to.equal(0.744);

        expect(geneticCode.chromosomes[3].matingRange[0]).to.equal(0.744);
        expect(geneticCode.chromosomes[3].matingRange[1]).to.equal(0.997);

        done();
    });

    it("has a selection phase", function(done) {
        var mates = [];

        geneticCode.selection(function(couple) {
            expect(couple.length).to.equal(2);

            mates.push(couple);
        }, function() {
            expect(_.difference(_.flatten(mates), geneticCode.chromosomes).length).to.equal(0);

            done();
        });
    });

    it("has a crossover phase", function(done) {
        geneticCode.crossover(
            [ geneticCode.chromosomes[0], geneticCode.chromosomes[1] ],
            [
                [ 3, 6 ],
                [ 1, 4 ],
                [ 4, 8 ]
            ], function() {
                expect(geneticCode.chromosomes[0].genes[0]).to.deep.equal([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
                expect(geneticCode.chromosomes[0].genes[1]).to.deep.equal([ 0, 0, 0, 0, 1, 0, 0, 0 ]);
                expect(geneticCode.chromosomes[0].genes[2]).to.deep.equal([ 0, 0, 1, 1, 0, 0, 0, 1 ]);

                expect(geneticCode.chromosomes[1].genes[0]).to.deep.equal([ 0, 0, 1, 1, 1, 0, 1, 1 ]);
                expect(geneticCode.chromosomes[1].genes[1]).to.deep.equal([ 1, 1, 0, 1, 1, 0, 1, 0 ]);
                expect(geneticCode.chromosomes[1].genes[2]).to.deep.equal([ 1, 0, 1, 1, 0, 1, 0, 1 ]);

                done();
            }
        );
    });

    it("has a mutation phase", function(done) {
        var geneInitialStates = _.clone(geneticCode.chromosomes[0].genes);

        geneticCode.mutate(geneticCode.chromosomes[0], function() {
            _.each(geneticCode.chromosomes[0].genes, function(gene, geneIndex) {
                expect(geneIndex).to.not.deep.equal(geneInitialStates[geneIndex]);
            });

            done();
        });
    });

    //it("can live !", function(done) {
    //    geneticCode.selection = sinon.spy();
    //    geneticCode.crossover = sinon.spy();
    //    geneticCode.mutate = sinon.spy();
    //
    //    geneticCode.live(function() {
    //        expect(geneticCode.selection.called).to.equal(true);
    //        expect(geneticCode.crossover.called).to.equal(true);
    //        expect(geneticCode.mutate.called).to.equal(true);
    //
    //        done();
    //    });
    //});
});