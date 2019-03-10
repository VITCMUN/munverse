const Event = require('../../models/event.model')
const logger = require('../../utils/logger')
const random = require('randomstring')
const base64 = require('../../utils/base64')
const sanitize = require('../../utils/sanitize')
const fs = require('fs')


function redirect_with_error(res, error){
    error.replace(" ", "%20")
    res.redirect(`/?error_event=${error}`)
}

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
            redirect_with_error(res, "invalid event name")
            return
        }
    }
    var event_logo_url = null
    if (req.body.event_logo) {
        var image_data = base64.decode_image(req.body.event_logo)
        if (!image_data) {
            redirect_with_error(res, "invalid image type")
            return
        }
        var filename = random.generate()
        var event_logo_path = `${__dirname}/../../media/event_logos/${filename}.${image_data.extension}`
        event_logo_url = `/event_logos/${filename}.${image_data.extension}`
        fs.writeFile(event_logo_path, image_data.data, (err) => {
            if (err)
                logger.error(err)
        })
    }

    Event.findOne({}, (err, event) => {
        if (err) {
            logger.error(err)
            redirect_with_error(res, err.message)
        } else if (event) {
            if (req.body.event_name) event.event_name = req.body.event_name
            if (event_logo_url) event.event_logo_url = event_logo_url
            event.save((err, new_event) => {
                if (err) {
                    logger.error(err)
                    redirect_with_error(res, err.message)
                } else {
                    res.redirect("/")
                }
            })
        } else {
            var event = new Event({ id: 0, event_name: req.body.event_name, event_logo_url: event_logo_url })
            event.save((err, new_event) => {
                if (err) {
                    logger.error(err)
                    redirect_with_error(res, err.message)
                } else {
                    res.redirect("/")
                }
            })
        }
    })
}