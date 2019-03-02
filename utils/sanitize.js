/**
 * accepts alphabets and whitespaces
 */
exports.valid_name = (name) => {
    var result = null
    if (name) {
        var patt = /[^a-zA-Z0-9\' ]/g
        result = name.match(patt)
    }
    return result == null
}