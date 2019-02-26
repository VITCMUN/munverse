const Event = require('../../models/event.model')
const logger = require('../../utils/logger')
const random = require('randomstring')
const base64 = require('../../utils/base64')
const sanitize = require('../../utils/sanitize')
const fs = require('fs')

exports.get_event = (req, res) => {
    /** Get the event details */
    Event.findOne({ id: 0 }, (err, event) => {
        if (err) {
            logger.error(err)
            res.status(500).send({ "message": err })
        } else {
            res.status(200).send(event)
        }
    })
}

exports.add_or_update_event = (req, res) => {
    /** Add an event if no event exists
     *  Or update the current event if it exists
     *  Optional: event_name, event_logo
     */
    if (req.body.event_name) {
        if (!sanitize.valid_name(req.body.event_name)) {
            res.status(400).send({ "message": "invalid event name" })
            return
        }
    }
    var event_logo_url = null
    if (req.body.event_logo) {
        var image_data = base64.decode_image(req.body.event_logo)
        if (!image_data) {
            res.status(400).send({ "message": "invalid image type" })
            return
        }
        var filename = random.generate()
        var event_logo_path = `../media/event_logos/${filename}.${image_data.extension}`
        event_logo_url = `/event_logos/${filename}.${image_data.extension}`
        fs.writeFile(event_logo_path, image_data.data, (err) => {
            if (err)
                logger.error(err)
        })
    }

    Event.findOneAndUpdate({ id: 0 },
        {
            $set: {
                event_name: req.body.event_name,
                event_logo_url: event_logo_url
            }
        },
        { upsert: true }, (err, updated) => {
            if (err) {
                logger.error(err)
                res.status(500).send({ "message": err })
            } else {
                res.status(200).send(updated)
            }
        })
}