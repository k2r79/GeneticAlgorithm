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
        geneticAlgorithm.TOURNAMENT_SIZE = 2;
        geneticAlgorithm.MUTATION_RATE = 1.00;

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

    it("can compute the population\'s fitness", function(done) {
        geneticAlgorithm.computeFitness();

        expect(geneticAlgorithm.population.individuals[0].fitness).to.equal(0.6875);
        expect(geneticAlgorithm.population.individuals[1].fitness).to.equal(0.45833333333333337);

        done();
    });

    it("has a selection phase", function(done) {
        geneticAlgorithm.TOURNAMENT_SIZE = 4;

        addChallengers();

        expect(geneticAlgorithm.selection().fitness).to.equal(geneticAlgorithm.population.individuals[2].fitness);

        done();
    });

    function addChallengers() {
        geneticAlgorithm.population.individuals.push(new Individual(2));
        geneticAlgorithm.population.individuals[2].fitness = 0.80;

        geneticAlgorithm.population.individuals.push(new Individual(2));
        geneticAlgorithm.population.individuals[3].fitness = 0.10;
    }

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
        var geneInitialStates = [
            _.map(geneticAlgorithm.population.individuals[0].chromosomes[0].genes, _.clone),
            _.map(geneticAlgorithm.population.individuals[0].chromosomes[1].genes, _.clone)
        ];

        geneticAlgorithm.mutate(geneticAlgorithm.population.individuals[0], function() {
            _.each(geneticAlgorithm.population.individuals[0].chromosomes, function(chromosome, chromosomeIndex) {

                _.each(chromosome.genes, function(gene, geneIndex) {
                    expect(gene).to.not.deep.equal(geneInitialStates[geneIndex]);
                });
            });

            done();
        });
    });

    it("can live !", function(done) {
        var initialPopulation = _.map(geneticAlgorithm.population.individuals, _.clone);

        geneticAlgorithm.live();

        _.each(geneticAlgorithm.population.individuals, function(individual, individualIndex) {
            _.each(individual.chromosomes, function(chromosome, chromosomeIndex) {
                _.each(chromosome.genes, function(gene, geneIndex) {
                    expect(gene).to.not.deep.equal(initialPopulation[individualIndex].chromosomes[chromosomeIndex].genes[geneIndex]);
                });
            });

            expect(individual.fitness).to.not.equal(null);
        });

        done();
    });
});