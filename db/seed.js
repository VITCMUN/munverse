// this file contains seed data for the database
// users should not be inserted manually here because passwords aren't stored in plain-text
db.events.insertOne({id: 0, event_name: "VITCMUN", event_logo_url: "/media/event/VITCMUN.png"})
db.councils.insertOne({id: 0, council_name: "AIPPM", council_logo_url: "/media/council/AIPPM.png"})