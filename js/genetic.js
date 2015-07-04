var Individual = function(numberOfChromosomes) {
    var chromosomes = [];
    var fitness = null;

    for (var chromosomeIndex = 0; chromosomeIndex < numberOfChromosomes; chromosomeIndex++) {
        chromosomes.push(new Chromosome());
    }

    this.chromosomes = chromosomes;
    this.fitness = fitness;
};

var Chromosome = function() {
    this.genes = [];
    this.fitness = null;

    for (var geneIndex = 0; geneIndex < 3; geneIndex++) {
        this.genes[geneIndex] = [];

        for (var bitIndex = 0; bitIndex < 8; bitIndex++) {
            this.genes[geneIndex][bitIndex] = Math.round(Math.random());
        }
    }
};

var GeneticCode = function(numberOfIndividuals, numberOfChromosomes) {
    var self = this;

    var individuals = [];
    var ideal;
    var matingPool;

    for (var individualIndex = 0; individualIndex < numberOfIndividuals; individualIndex++) {
        individuals[individualIndex] = new Individual(numberOfChromosomes);
        ideal = new Individual(numberOfChromosomes);
    }

    this.live = function(callback) {
        this.selection(function(matingPool) {
            var offsets = [
                [ _.random(0, 3), _.random(4, 8) ],
                [ _.random(0, 3), _.random(4, 8) ],
                [ _.random(0, 3), _.random(4, 8) ]
            ];

            for (var individualIndex = 0; individualIndex < matingPool.length; individualIndex++) {
                self.crossover([ matingPool[individualIndex], matingPool[individualIndex++] ], offsets, function() {
                    _.each(individuals, function(individual) {
                        self.mutate(individual, function() {
                            callback();
                        });
                    });
                });
            }
        });
    };

    this.computeFitness = function() {
        _.each(individuals, function(individual) {

            var differences = computeIndividualDifferences(individual, ideal);

            individual.fitness = 1 - (differences / (individual.chromosomes.length * individual.chromosomes[0].genes.length * individual.chromosomes[0].genes[0].length));
        });

        function computeIndividualDifferences(individual, idealIndividual) {
            return _.reduce(individual.chromosomes, function(memo, chromosome, index) {
                return memo + computeChromosomeDifferences(chromosome, idealIndividual.chromosomes[index]);
            }, 0);
        }

        function computeChromosomeDifferences(chromosome, idealChromosome) {
            return _.reduce(chromosome.genes, function(memo, gene, index) {
                return memo + computeGeneDifference(gene, idealChromosome.genes[index]);
            }, 0);
        }

        function computeGeneDifference(gene, idealGene) {
            return _.reduce(gene, function(memo, component, index) {
                return memo + Math.abs(component - idealGene[index]);
            }, 0);
        }
    };

    this.selection = function(callback) {
        this.computeFitness();

        matingPool = [];

        var individualIndex = 0;
        while(matingPool.length < individuals.length - 1) {

            var individual = individuals[individualIndex];
            var randomIndividual = _.sample(individuals);

            if (randomIndividual !== individual) {
                var winner = _.max([ individual, randomIndividual ], function(mate) {
                    return mate.fitness;
                });

                if (!_.contains(matingPool, winner)) {
                    matingPool.push(winner);
                }
            }

            if (++individualIndex >= individuals.length) {
                individualIndex = 0;
            }
        }

        matingPool.push(_.difference(matingPool, individuals));

        callback(matingPool);
    };

    this.crossover = function(individuals, offsets, callback) {
        _.each(individuals[0].chromosomes, function(chromosome, chromosomeIndex) {
            crossoverChromosomes([ chromosome, individuals[1].chromosomes[chromosomeIndex] ]);
        });

        callback();

        function crossoverChromosomes(chromosomes) {
            var genes = [
                [
                    crossoverGenes([ chromosomes[0].genes[0], chromosomes[1].genes[0] ], offsets[0]),
                    crossoverGenes([ chromosomes[0].genes[1], chromosomes[1].genes[1] ], offsets[1]),
                    crossoverGenes([ chromosomes[0].genes[2], chromosomes[1].genes[2] ], offsets[2])
                ],
                [
                    crossoverGenes([ chromosomes[1].genes[0], chromosomes[0].genes[0] ], offsets[0]),
                    crossoverGenes([ chromosomes[1].genes[1], chromosomes[0].genes[1] ], offsets[1]),
                    crossoverGenes([ chromosomes[1].genes[2], chromosomes[0].genes[2] ], offsets[2])
                ]
            ];

            chromosomes[0].genes = genes[0];
            chromosomes[1].genes = genes[1];
        }

        function crossoverGenes(genes, offsets) {
            return _.flatten([
                _.first(genes[1], offsets[0]),
                _.last(_.first(genes[0], offsets[1]), offsets[1] - offsets[0]),
                _.last(genes[1], genes[0].length - offsets[1])
            ]);
        }
    };

    this.mutate = function(individual, callback) {
        _.each(individual.chromosomes, function(chromosome) {
            mutateChromosome(chromosome);
        });

        callback();

        function mutateChromosome(chromosome) {
            _.each(chromosome.genes, function(gene) {
                mutateGene(gene);
            })
        }

        function mutateGene(gene) {
            var mutatedIndices = [];

            do {
                var randomComponentIndex = _.random(0, gene.length - 1);

                if (!_.contains(mutatedIndices, randomComponentIndex)) {
                    gene[randomComponentIndex] = gene[randomComponentIndex] == 1 ? 0 : 1;

                    mutatedIndices.push(randomComponentIndex);
                }
            } while (mutatedIndices.length < 3);
        }
    };

    this.fittestIndividual = function() {
        return _.max(individuals, function(individual) {
            return individual.fitness;
        });
    };

    this.individuals = individuals;
    this.ideal = ideal;
};