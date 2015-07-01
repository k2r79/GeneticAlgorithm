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

    it("can convert an RGBA image data to binary", function(done) {
        var rgbaImageData = [ 135, 22, 100, 255, 143, 49, 25, 255, 250, 89, 199, 255];
        var binaryImageData = ImageLib.imageDataToBinary(rgbaImageData);

        expect(binaryImageData.length).to.equal(9);

        expect(binaryImageData[0]).to.deep.equal([ 1, 0, 0, 0, 0, 1, 1, 1 ]);
        expect(binaryImageData[1]).to.deep.equal([ 0, 0, 0, 1, 0, 1, 1, 0 ]);
        expect(binaryImageData[2]).to.deep.equal([ 0, 1, 1, 0, 0, 1, 0, 0 ]);

        expect(binaryImageData[3]).to.deep.equal([ 1, 0, 0, 0, 1, 1, 1, 1 ]);
        expect(binaryImageData[4]).to.deep.equal([ 0, 0, 1, 1, 0, 0, 0, 1 ]);
        expect(binaryImageData[5]).to.deep.equal([ 0, 0, 0, 1, 1, 0, 0, 1 ]);

        expect(binaryImageData[6]).to.deep.equal([ 1, 1, 1, 1, 1, 0, 1, 0 ]);
        expect(binaryImageData[7]).to.deep.equal([ 0, 1, 0, 1, 1, 0, 0, 1 ]);
        expect(binaryImageData[8]).to.deep.equal([ 1, 1, 0, 0, 0, 1, 1, 1 ]);

        done();
    });
});
