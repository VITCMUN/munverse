exports.decode_image = (data_string) => {

    if (data_string == null || data_string == "")
        return null

    var pattern = /^data:([A-Za-z-+\/]+);base64,(.+)$/
    var matches = data_string.match(pattern)

    if (matches.length !== 3)
        return null

    response = {}
    response.type = matches[1].split("/")[0]
    response.extension = matches[1].split("/")[1]
    response.data = new Buffer(matches[2], 'base64')

    if (response.type !== 'image')
        return null
        
    if (['jpeg', 'jpg', 'png'].indexOf(response.extension) < 0)
        return null

    return response
}