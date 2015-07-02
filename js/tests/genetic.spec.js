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

describe("An Individual", function() {

    var individual;

    before(function(done) {
        individual = new Individual(4);

        done();
    });

    it("has chromosomes", function(done) {
        expect(individual.chromosomes.length).to.equal(4);

        done();
    });
});

describe("A Genetic Code", function() {

    var geneticCode;

    before(function(done) {
        geneticCode = new GeneticCode(2, 2);

        done();
    });

    function setChromosomes() {
        geneticCode.individuals[0].chromosomes[0].genes = [
            [ 0, 0, 1, 0, 1, 0, 1, 1],
            [ 1, 0, 0, 0, 1, 0, 1, 0],
            [ 1, 0, 1, 1, 0, 0, 0, 1]
        ];

        geneticCode.individuals[0].chromosomes[1].genes = [
            [ 1, 0, 1, 1, 1, 0, 1, 0],
            [ 0, 1, 0, 1, 1, 0, 0, 0],
            [ 0, 0, 1, 1, 0, 1, 0, 1]
        ];

        geneticCode.individuals[1].chromosomes[0].genes = [
            [ 1, 0, 0, 0, 1, 0, 0, 1],
            [ 0, 0, 0, 1, 1, 0, 0, 1],
            [ 1, 1, 0, 1, 1, 1, 0, 0]
        ];

        geneticCode.individuals[1].chromosomes[1].genes = [
            [ 1, 1, 1, 1, 0, 0, 0, 1],
            [ 0, 0, 1, 1, 0, 1, 1, 0],
            [ 0, 0, 1, 1, 1, 0, 1, 0]
        ];
    }

    function setIdeal() {
        geneticCode.ideal.chromosomes[0].genes = [
            [ 1, 1, 1, 0, 1, 1, 0, 1],
            [ 0, 0, 0, 1, 1, 0, 1, 0],
            [ 0, 0, 1, 1, 0, 0, 1, 1]
        ];

        geneticCode.ideal.chromosomes[1].genes = [
            [ 1, 0, 1, 0, 1, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 0, 0, 0],
            [ 1, 0, 1, 0, 0, 1, 1, 1]
        ];
    }

    it("has multiple individuals", function(done) {
        expect(geneticCode.individuals.length).to.equal(2);

        done();
    });

    it("has an ideal", function(done) {
        _.each(geneticCode.individuals, function(individual, individualIndex) {
            expect(geneticCode.ideal.chromosomes.length).to.equal(individual.chromosomes.length);
        });

        done();
    });

    it("has a fitness function", function(done) {
        setChromosomes();
        setIdeal();

        geneticCode.computeFitness();

        expect(geneticCode.individuals[0].fitness).to.equal(0.6875);
        expect(geneticCode.individuals[1].fitness).to.equal(0.45833333333333337);

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