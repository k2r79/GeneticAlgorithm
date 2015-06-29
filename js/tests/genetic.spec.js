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

describe("A Genetic Code", function() {

    var geneticCode;

    before(function(done) {
        geneticCode = new GeneticCode(250000);

        done();
    });

    it("has multiple chromosomes", function(done) {
        expect(geneticCode.chromosomes.length).to.equal(250000);

        done();
    });
});