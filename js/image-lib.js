
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