const Council = require('../../models/council.model')
const logger = require('../../utils/logger')
const random = require('randomstring')
const base64 = require('../../utils/base64')
const sanitize = require('../../utils/sanitize')
const fs = require('fs')

exports.get_council = (req, res) => {
    /** Get the council details */
    Council.findOne({ id: 0 }, (err, council) => {
        if (err) {
            logger.error(err)
            res.status(403).send({ "message": err })
        } else {
            res.status(200).send(council)
        }
    })
}

exports.add_or_update_council = (req, res) => {
    /** Add a council if no council exists
     *  Or update the current council if it exists
     *  Optional: council_name, council_logo
     */
    if (req.body.council_name) {
        if (!sanitize.valid_name(req.body.council_name)) {
            res.status(400).send({ "message": "invalid council name" })
            return
        }
    }
    var council_logo_url = null
    if (req.body.council_logo) {
        var image_data = base64.decode_image(req.body.council_logo)
        if (!image_data) {
            res.status(400).send({ "message": "invalid image type" })
            return
        }
        var filename = random.generate()
        var council_logo_path = `${__dirname}/../../media/council_logos/${filename}.${image_data.extension}`
        council_logo_url = `/council_logos/${filename}.${image_data.extension}`
        fs.writeFile(council_logo_path, image_data.data, (err) => {
            if (err)
                logger.error(err)
        })
    }

    Council.findOne({}, (err, council) => {
        if (err) {
            logger.error(err)
            res.status(403).send(err)
        } else if (council) {
            if (req.body.council_name) council.council_name = req.body.council_name
            if (council_logo_url) council.council_logo_url = council_logo_url
            council.save((err, new_council) => {
                if (err) {
                    logger.error(err)
                    res.status(403).send({ "message": err })
                } else {
                    res.status(200).send(new_council)
                }
            })
        } else {
            var council = new Council({ id: 0, council_name: req.body.council_name, council_logo_url: council_logo_url })
            council.save((err, new_council) => {
                if (err) {
                    logger.error(err)
                    res.status(403).send({ "message": err })
                } else {
                    res.status(200).send(new_council)
                }
            })
        }
    })
}