
var ImageLib = function() {};

ImageLib.pixelToBinary = function(pixel) {
    return _.initial(
        _.map(pixel, function(component) {
            return integerToBinary(component);
        })
    );

    function integerToBinary(integer) {
        var binaries = _.map(Number(integer).toString(2).split(""), function(bit) {
            return parseInt(bit);
        });

        while (binaries.length < 8) {
            binaries = [ 0 ].concat(binaries);
        }

        return binaries;
    }
};

ImageLib.imageDataToBinary = function(imageData) {
    var binaryData = [];

    for (var imageDataIndex = 0; imageDataIndex < imageData.length; imageDataIndex += 4) {
        binaryData = binaryData.concat(ImageLib.pixelToBinary([
            imageData[imageDataIndex],
            imageData[imageDataIndex + 1],
            imageData[imageDataIndex + 2],
            imageData[imageDataIndex + 3]
        ]));
    }

    return binaryData;
};

ImageLib.imageDataToRGBA = function(imageData) {
    var rgbaData = [];

    imageData = _.map(imageData, function(pixel) {
        return _.map(pixel, function(component) {
            return component.toString();
        }).join("");
    });

    for (var pixelIndex = 0; pixelIndex < imageData.length; pixelIndex += 3) {
        rgbaData.push(parseInt(imageData[pixelIndex], 2));
        rgbaData.push(parseInt(imageData[pixelIndex + 1], 2));
        rgbaData.push(parseInt(imageData[pixelIndex + 2], 2));

        rgbaData.push(255);
    }

    return rgbaData;
};