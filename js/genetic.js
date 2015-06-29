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

            console.log("%d - %d", chromosome.genes.length * chromosome.genes[0].length, differences);
            chromosome.fitness = chromosome.genes.length * chromosome.genes[0].length - differences;
        }, this.ideal);
    };
};