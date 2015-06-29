var Chromosome = function() {
    this.genes = [];

    for (var geneIndex = 0; geneIndex < 3; geneIndex++) {
        this.genes[geneIndex] = [];

        for (var bitIndex = 0; bitIndex < 8; bitIndex++) {
            this.genes[geneIndex][bitIndex] = Math.round(Math.random());
        }
    }
};

var GeneticCode = function(numberOfChromosomes) {
    this.chromosomes = [];

    for (var chromosomeIndex = 0; chromosomeIndex < numberOfChromosomes; chromosomeIndex++) {
        this.chromosomes[chromosomeIndex] = new Chromosome();
    }
};