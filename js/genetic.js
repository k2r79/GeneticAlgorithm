var Chromosome = function() {
    var genes = [];

    for (var geneIndex = 0; geneIndex < 3; geneIndex++) {
        genes[geneIndex] = [];

        for (var bitIndex = 0; bitIndex < 8; bitIndex++) {
            genes[geneIndex][bitIndex] = Math.round(Math.random());
        }
    }

    this.genes = genes;
};

var Individual = function(numberOfChromosomes) {
    var chromosomes = [];
    var fitness = null;

    for (var chromosomeIndex = 0; chromosomeIndex < numberOfChromosomes; chromosomeIndex++) {
        chromosomes.push(new Chromosome());
    }

    this.chromosomes = chromosomes;
    this.fitness = fitness;
};

var Population = function(numberOfIndividuals, numberOfChromosomes) {
    var individuals = [];

    for (var individualIndex = 0; individualIndex < numberOfIndividuals; individualIndex++) {
        individuals.push(new Individual(numberOfChromosomes));
    }

    this.fittestIndividual = function() {
        return _.max(individuals, function(individual) {
            return individual.fitness;
        });
    };

    this.individuals = individuals;
};

var GeneticAlgorithm = function(numberOfIndividuals, numberOfChromosomes) {
    var self = this;

    this.TOURNAMENT_SIZE = Math.floor(numberOfIndividuals / 3);
    this.MUTATION_RATE = 0.01;

    var population = new Population(numberOfIndividuals, numberOfChromosomes);
    var ideal = new Individual(numberOfChromosomes);

    this.live = function() {
        var newPopulation = new Population(population.individuals.length, population.individuals[0].chromosomes.length);

        _.each(newPopulation.individuals, function(newIndividual, newIndividualIndex) {
            self.crossover(function(offspring) {
                self.mutate(offspring, function(mutatedOffspring) {
                    newPopulation.individuals[newIndividualIndex] = mutatedOffspring;
                });
            });
        });

        this.population = newPopulation;

        this.computeFitness();
    };

    this.computeFitness = function() {
        _.each(this.population.individuals, function(individual) {

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

    this.selection = function() {
        var opponents = [];

        while (opponents.length < this.TOURNAMENT_SIZE) {
            var randomIndividual = _.sample(population.individuals);

            if (!_.contains(opponents, randomIndividual)) {
                opponents.push(randomIndividual);
            }
        }

        return _.max(opponents, function(mate) {
            return mate.fitness;
        });
    };

    this.crossover = function(callback) {
        var offspring = new Individual(population.individuals[0].chromosomes.length);

        var parents = [ this.selection() ];
        findParents();

        crossoverChromosomes();

        callback(offspring, parents);

        function findParents() {
            var randomParent = self.selection();
            while (_.contains(parents, randomParent)) {
                randomParent = self.selection();
            }

            parents.push(randomParent);
        }

        function crossoverChromosomes() {
            _.each(offspring.chromosomes, function(offspringChromosome, offspringChromosomeIndex) {
                var offspringGenes = [];

                _.each(offspringChromosome.genes, function(offspringGene, offspringGeneIndex) {
                    offspringGenes.push(crossoverGenes([ parents[0].chromosomes[offspringChromosomeIndex].genes[offspringGeneIndex], parents[1].chromosomes[offspringChromosomeIndex].genes[offspringGeneIndex] ]));
                });

                offspringChromosome.genes = offspringGenes;
            });
        }

        function crossoverGenes(genes) {
            var randomOffset = _.random(1, genes[0].length - 2);

            return _.flatten([
                _.first(genes[1], randomOffset),
                _.last(genes[0], genes[0].length - randomOffset)
            ]);
        }
    };

    this.mutate = function(individual, callback) {
        _.each(individual.chromosomes, function(chromosome) {
            mutateChromosome(chromosome);
        });

        callback(individual);

        function mutateChromosome(chromosome) {
            _.each(chromosome.genes, function(gene) {
                mutateGene(gene);
            })
        }

        function mutateGene(gene) {
            _.each(gene, function(component, componentIndex) {
                if (Math.random() <= self.MUTATION_RATE) {
                    gene[componentIndex] = (component == 1 ? 0 : 1);
                }
            });
        }
    };

    this.population = population;
    this.ideal = ideal;
};