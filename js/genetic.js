var Individual = function(numberOfChromosomes) {
    var chromosomes = [];
    var fitness;

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

    for (var individualIndex = 0; individualIndex < numberOfIndividuals; individualIndex++) {
        individuals[individualIndex] = new Individual(numberOfChromosomes);
        ideal = new Individual(numberOfChromosomes);
    }

    this.live = function(callback) {
        this.selection(function(couple) {
            var offsets = [
                [ _.random(0, 8), _.random(0, 8) ],
                [ _.random(0, 8), _.random(0, 8) ],
                [ _.random(0, 8), _.random(0, 8) ]
            ];

            self.crossover(couple, offsets, function(chromosomes) {
                _.each(chromosomes, function(chromosome, chromosomeIndex) {
                    self.mutate(chromosome, callback);
                }, this);
            });
        });
    };

    this.computeFitness = function() {
        _.each(individuals, function(individual, individualIndex) {

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

    this.selection = function(callback, finished) {
        var singleChromosomeIndices = _.range(0, this.chromosomes.length);
        while (singleChromosomeIndices.length > 0) {
            mateCouple(this.chromosomes, callback);
        }

        finished();

        function mateCouple(chromosomes, callback) {
            var couple = [];

            while (couple.length < 2) {
                var randomIndex = _.random(0, chromosomes.length - 1);

                if (isMateable()) {
                    couple.push(chromosomes[randomIndex]);
                    singleChromosomeIndices.splice(singleChromosomeIndices.indexOf(randomIndex), 1);
                }
            }

            callback(couple);

            function isMateable() {
                return _.contains(singleChromosomeIndices, randomIndex);
            }
        }
    };

    this.crossover = function(chromosomes, offsets, callback) {
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
        ]

        chromosomes[0].genes = genes[0];
        chromosomes[1].genes = genes[1];

        callback(chromosomes);

        function crossoverGenes(genes, offsets) {
            return _.flatten([
                _.first(genes[1], offsets[0]),
                _.last(_.first(genes[0], offsets[1]), offsets[1] - offsets[0]),
                _.last(genes[1], genes[0].length - offsets[1])
            ]);
        }
    };

    this.mutate = function(chromosome, callback) {
        _.each(chromosome.genes, function(gene, geneIndex) {
            var index = _.random(0, 7);

            gene[index] = gene[index] == 1 ? 0 : 1;
        });

        callback();
    };

    this.individuals = individuals;
    this.ideal = ideal;
};