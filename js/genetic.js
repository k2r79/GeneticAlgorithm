var Chromosome = function() {
    this.genes = [];
    this.fitness = null;
    this.matingRange = [];

    for (var geneIndex = 0; geneIndex < 3; geneIndex++) {
        this.genes[geneIndex] = [];

        for (var bitIndex = 0; bitIndex < 8; bitIndex++) {
            this.genes[geneIndex][bitIndex] = Math.round(Math.random());
        }
    }
};

var GeneticCode = function(numberOfChromosomes) {
    this.chromosomes = [];
    this.ideal = [];

    for (var chromosomeIndex = 0; chromosomeIndex < numberOfChromosomes; chromosomeIndex++) {
        this.chromosomes[chromosomeIndex] = new Chromosome();
        this.ideal[chromosomeIndex] = new Chromosome();
    }

    this.computeFitness = function() {
        _.each(this.chromosomes, function(chromosome, chromosomeIndex) {

            var differences = 0;
            _.each(chromosome.genes, function(gene, geneIndex) {
                differences += _.reduce(gene, function(memo, value, index) {
                    return memo + Math.abs(value - this[chromosomeIndex].genes[geneIndex][index]);
                }, 0, this);
            }, this);

            chromosome.fitness = chromosome.genes.length * chromosome.genes[0].length - differences;
        }, this.ideal);
    };

    this.generateMatingWheel = function() {
        this.computeFitness();

        var totalFitness = _.reduce(this.chromosomes, function(memo, chromosome, index) {
            return memo + chromosome.fitness;
        }, 0, this);

        _.each(this.chromosomes, function(chromosome, chromosomeIndex) {
            chromosome.matingRange[0] = chromosomeIndex > 0 ? this.chromosomes[chromosomeIndex - 1].matingRange[1] : 0;
            chromosome.matingRange[1] = chromosome.matingRange[0] + Math.floor((chromosome.fitness / totalFitness) * 1000) / 1000;
        }, this);
    };

    this.selection = function(callback, finished) {
        this.generateMatingWheel();

        var matedChromosomeIndices = [];
        while (matedChromosomeIndices.length != this.chromosomes.length) {
            var couple = [];
            var randomValue = Math.random();

            var chromosomeIndex = 0;
            while (couple.length < 2 && chromosomeIndex < this.chromosomes.length) {
                if (randomValue >= this.chromosomes[chromosomeIndex].matingRange[0]
                    && randomValue < this.chromosomes[chromosomeIndex].matingRange[1]
                    && !_.contains(matedChromosomeIndices, chromosomeIndex)) {
                    couple.push(this.chromosomes[chromosomeIndex]);
                    matedChromosomeIndices.push(chromosomeIndex);
                }

                chromosomeIndex++;
            }

            callback(couple);
        }

        finished();
    };
};