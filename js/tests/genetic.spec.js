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

describe("A Population", function() {

    var population;

    beforeEach(function(done) {
        population = new Population(2);

        done();
    });

    it("has Individuals", function(done) {
        expect(population.individuals.length).to.equal(2);

        done();
    });

    it("has a fittest Individual", function(done) {
        population.individuals[0].fitness = 0.6875;
        population.individuals[1].fitness = 0.45833333333333337;

        expect(population.fittestIndividual()).to.equal(population.individuals[0]);

        done();
    });
});

describe("A Genetic Algorithm", function() {

    var geneticAlgorithm;

    beforeEach(function(done) {
        geneticAlgorithm = new GeneticAlgorithm(2, 2);

        setChromosomes();
        setIdeal();

        done();
    });

    function setChromosomes() {
        geneticAlgorithm.population.individuals[0].chromosomes[0].genes = [
            [ 0, 0, 1, 0, 1, 0, 1, 1],
            [ 1, 0, 0, 0, 1, 0, 1, 0],
            [ 1, 0, 1, 1, 0, 0, 0, 1]
        ];

        geneticAlgorithm.population.individuals[0].chromosomes[1].genes = [
            [ 1, 0, 1, 1, 1, 0, 1, 0],
            [ 0, 1, 0, 1, 1, 0, 0, 0],
            [ 0, 0, 1, 1, 0, 1, 0, 1]
        ];

        geneticAlgorithm.population.individuals[1].chromosomes[0].genes = [
            [ 1, 0, 0, 0, 1, 0, 0, 1],
            [ 0, 0, 0, 1, 1, 0, 0, 1],
            [ 1, 1, 0, 1, 1, 1, 0, 0]
        ];

        geneticAlgorithm.population.individuals[1].chromosomes[1].genes = [
            [ 1, 1, 1, 1, 0, 0, 0, 1],
            [ 0, 0, 1, 1, 0, 1, 1, 0],
            [ 0, 0, 1, 1, 1, 0, 1, 0]
        ];
    }

    function setIdeal() {
        geneticAlgorithm.ideal.chromosomes[0].genes = [
            [ 1, 1, 1, 0, 1, 1, 0, 1],
            [ 0, 0, 0, 1, 1, 0, 1, 0],
            [ 0, 0, 1, 1, 0, 0, 1, 1]
        ];

        geneticAlgorithm.ideal.chromosomes[1].genes = [
            [ 1, 0, 1, 0, 1, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 0, 0, 0],
            [ 1, 0, 1, 0, 0, 1, 1, 1]
        ];
    }

    it("has a population", function(done) {
        expect(geneticAlgorithm.population.individuals.length).to.equal(2);

        done();
    });

    it("has an ideal", function(done) {
        _.each(geneticAlgorithm.population.individuals, function(individual) {
            expect(geneticAlgorithm.ideal.chromosomes.length).to.equal(individual.chromosomes.length);
        });

        done();
    });

    it("has a selection phase", function(done) {
        geneticAlgorithm.TOURNAMENT_SIZE = 4;

        geneticAlgorithm.population.individuals.push(new Individual(2));
        geneticAlgorithm.population.individuals[2].fitness = 0.80;

        geneticAlgorithm.population.individuals.push(new Individual(2));
        geneticAlgorithm.population.individuals[3].fitness = 0.10;

        expect(geneticAlgorithm.selection().fitness).to.equal(geneticAlgorithm.population.individuals[2].fitness);

        done();
    });

    it("has a crossover phase", function(done) {
        geneticAlgorithm.crossover(function(offspring, parents) {
            _.each(parents, function(parent, parentIndex) {
                _.each(offspring.chromosomes, function(offspringChromosome, offspringChromosomeIndex) {
                    var differences = _.reduce(offspringChromosome.genes, function(memo, gene, geneIndex) {
                        return memo + differences(gene, parent.chromosomes[offspringChromosomeIndex].genes[geneIndex]);
                    }, 0);

                    expect(differences > 0).to.equal(true);

                    function differences(offspringGene, parentGene) {
                        return _.reduce(offspringGene, function(memo, offspringComponent, offspringComponentIndex) {
                            return memo + ((offspringComponent != parentGene[offspringComponentIndex]) ? 1 : 0);
                        }, 0);
                    }
                });
            });

            done();
        });
    });

    it("has a mutation phase", function(done) {
        geneticAlgorithm.MUTATION_AMOUNT = 3;

        var geneInitialStates = [
            _.map(geneticAlgorithm.population.individuals[0].chromosomes[0].genes, _.clone),
            _.map(geneticAlgorithm.population.individuals[0].chromosomes[1].genes, _.clone)
        ];

        geneticAlgorithm.mutate(geneticAlgorithm.population.individuals[0], function() {
            _.each(geneticAlgorithm.population.individuals[0].chromosomes, function(chromosome, chromosomeIndex) {

                _.each(chromosome.genes, function(gene, geneIndex) {
                    var differences = _.reduce(gene, function(memo, value, index) {
                        return memo + ((value == geneInitialStates[chromosomeIndex][geneIndex][index]) ? 0 : 1);
                    }, 0);

                    expect(differences).to.equal(geneticAlgorithm.MUTATION_AMOUNT);
                });
            });

            done();
        });
    });

    //it("can live !", function(done) {
    //    geneticAlgorithm.selection = sinon.spy();
    //    geneticAlgorithm.crossover = sinon.spy();
    //    geneticAlgorithm.mutate = sinon.spy();
    //
    //    geneticAlgorithm.live(function() {
    //        expect(geneticAlgorithm.selection.called).to.equal(true);
    //        expect(geneticAlgorithm.crossover.called).to.equal(true);
    //        expect(geneticAlgorithm.mutate.called).to.equal(true);
    //
    //        done();
    //    });
    //});
});