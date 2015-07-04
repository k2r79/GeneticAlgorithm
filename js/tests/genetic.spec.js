var expect = chai.expect;

describe("A Chromosome", function() {

    var chromosome;

    beforeEach(function(done) {
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

    beforeEach(function(done) {
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

    beforeEach(function(done) {
        geneticCode = new GeneticCode(2, 2);

        setChromosomes();
        setIdeal();

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
        _.each(geneticCode.individuals, function(individual) {
            expect(geneticCode.ideal.chromosomes.length).to.equal(individual.chromosomes.length);
        });

        done();
    });

    it("has a fitness function", function(done) {
        geneticCode.computeFitness();

        expect(geneticCode.individuals[0].fitness).to.equal(0.6875);
        expect(geneticCode.individuals[1].fitness).to.equal(0.45833333333333337);

        done();
    });

    it("has a selection phase", function(done) {
        geneticCode.individuals.push(new Individual(2));
        geneticCode.individuals.push(new Individual(2));

        geneticCode.selection(function(matingPool) {
            expect(matingPool.length).to.equal(geneticCode.individuals.length);

            done();
        });
    });

    it("has a crossover phase", function(done) {
        geneticCode.crossover(
            [ geneticCode.individuals[0], geneticCode.individuals[1] ],
            [
                [ 3, 6 ],
                [ 1, 4 ],
                [ 4, 8 ]
            ], function() {
                expect(geneticCode.individuals[0].chromosomes[0].genes[0]).to.deep.equal([ 1, 0, 0, 0, 1, 0, 0, 1 ]);
                expect(geneticCode.individuals[0].chromosomes[0].genes[1]).to.deep.equal([ 0, 0, 0, 0, 1, 0, 0, 1 ]);
                expect(geneticCode.individuals[0].chromosomes[0].genes[2]).to.deep.equal([ 1, 1, 0, 1, 0, 0, 0, 1 ]);

                expect(geneticCode.individuals[0].chromosomes[1].genes[0]).to.deep.equal([ 1, 1, 1, 1, 1, 0, 0, 1 ]);
                expect(geneticCode.individuals[0].chromosomes[1].genes[1]).to.deep.equal([ 0, 1, 0, 1, 0, 1, 1, 0 ]);
                expect(geneticCode.individuals[0].chromosomes[1].genes[2]).to.deep.equal([ 0, 0, 1, 1, 0, 1, 0, 1 ]);

                expect(geneticCode.individuals[1].chromosomes[0].genes[0]).to.deep.equal([ 0, 0, 1, 0, 1, 0, 1, 1 ]);
                expect(geneticCode.individuals[1].chromosomes[0].genes[1]).to.deep.equal([ 1, 0, 0, 1, 1, 0, 1, 0 ]);
                expect(geneticCode.individuals[1].chromosomes[0].genes[2]).to.deep.equal([ 1, 0, 1, 1, 1, 1, 0, 0 ]);

                expect(geneticCode.individuals[1].chromosomes[1].genes[0]).to.deep.equal([ 1, 0, 1, 1, 0, 0, 1, 0 ]);
                expect(geneticCode.individuals[1].chromosomes[1].genes[1]).to.deep.equal([ 0, 0, 1, 1, 1, 0, 0, 0 ]);
                expect(geneticCode.individuals[1].chromosomes[1].genes[2]).to.deep.equal([ 0, 0, 1, 1, 1, 0, 1, 0 ]);

                done();
            }
        );
    });

    it("has a fittest individual", function(done) {
        geneticCode.computeFitness();

        expect(geneticCode.fittestIndividual()).to.equal(geneticCode.individuals[0]);

        done();
    });

    it("has a mutation phase", function(done) {
        var geneInitialStates = [
            _.map(geneticCode.individuals[0].chromosomes[0].genes, _.clone),
            _.map(geneticCode.individuals[0].chromosomes[1].genes, _.clone)
        ];

        geneticCode.mutate(geneticCode.individuals[0], function() {
            _.each(geneticCode.individuals[0].chromosomes, function(chromosome, chromosomeIndex) {
                _.each(chromosome.genes, function(gene, geneIndex) {
                    expect(gene).to.not.deep.equal(geneInitialStates[chromosomeIndex][geneIndex]);
                });
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