/**
 * accepts alphabets and whitespaces
 */
exports.valid_name = (name) => {
    var result = null
    if (name) {
        var patt = /[^a-z,A-Z, ]/g
        result = name.match(patt)
    }
    return result == null
}