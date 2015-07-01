var expect = chai.expect;

describe("The Image Lib", function() {

    it("can convert an RGBA pixel to binary", function(done) {
        var rgbaPixel = [ 135, 22, 100, 255];
        var binaryPixel = ImageLib.pixelToBinary(rgbaPixel);

        expect(binaryPixel.length).to.equal(3);

        expect(binaryPixel[0]).to.deep.equal([ 1, 0, 0, 0, 0, 1, 1, 1 ]);
        expect(binaryPixel[1]).to.deep.equal([ 0, 0, 0, 1, 0, 1, 1, 0 ]);
        expect(binaryPixel[2]).to.deep.equal([ 0, 1, 1, 0, 0, 1, 0, 0 ]);

        done();
    });
});
