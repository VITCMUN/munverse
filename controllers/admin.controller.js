//Requirements
const Event = require('../models/event.model')
const User = require('../models/user.model')
const council = require('../models/council.model')

//EVENTS
//Display event
exports.get_events = (req,res) => {
    Event.find({},(err, events)=> {
        console.log(events)
        if (err) res.status(500).send({"message": err.message})
        else if (events) {
            res.status(200).send(events)
        }
        else {
            res.status(200).send(events)
        }
    });
}

//Adds event
exports.post_events = (req,res) => {
    var add_new_event = new Event()
    console.log(req.body)
    add_new_event.event_name = req.body.event_name
    add_new_event.event_logo_path = req.body.event_logo_path

    add_new_event.save((err, new_event)=> {
      if(err) {
        res.status(200).send('error saving book')
      } else {
        console.log(new_event)
        res.status(200).send(new_event)
      }
    })
}

//Change event details
exports.change_events = (req,res) => {
    Event.findOneAndUpdate({},
        { $set: { event_name: req.body.event_name ,
             event_logo_path:req.body.event_logo_path} },
        {upsert: false}, (err, updated)=> {
        if (err) {
          res.status(200).send('error updating ')
        } else {
          console.log('updated with '+updated)
          res.status(200).send(updated)
        }
      });
}

//Delete event
exports.delete_events = (req,res) => {
    Event.findOneAndRemove({}, (err, deleted)=> {
       if(err) {
         res.status(200).send('error removing')
       } else {
         console.log(deleted);
         res.status(200).send('deleted '+ deleted)
       }
     })
}

//USERS:
//Display users
exports.get_users = (req,res) => {
  User.find({},(err, users)=> {
    console.log(users)
    if (err) res.status(500).send({"message": err.message})
    else if (users) {
        res.status(200).send(users)
    }
    else {
        res.status(200).send(users)
    }
  });
}

//Add user
exports.post_users = (req,res) => {
  var add_new_user = new User()
  console.log(req.body)
  add_new_user.user_type = req.body.user_type
  add_new_user.username = req.body.username
  add_new_user.password = req.body.password
  add_new_user.profile_picture_path = req.body.profile_picture_path

  add_new_user.save((err, new_user)=> {
    if(err) {
      res.status(200).send('error saving book')
    } else {
      console.log(new_user)
      res.status(200).send(new_user)
    }
  })
}

//Change user details except type by username
exports.change_users = (req,res) => {
  User.findOneAndUpdate({
      username:req.body.username
  },
      { $set: { username: req.body.username ,
          password: req.body.password,
          profile_picture_path:req.body.profile_picture_path} },
      {upsert: false}, (err, updated)=> {
      if (err) {
        res.status(200).send('error updating ')
      } else {
        console.log('updated with '+updated)
        res.status(200).send(updated)
      }
    });
}

//Delete users
exports.delete_users = (req,res) => {
  User.findOneAndRemove({}, (err, deleted)=> {
      if(err) {
        res.status(200).send('error removing')
      } else {
       console.log(deleted);
       res.status(200).send('deleted '+ deleted)
      }
   })
}

//Display council data
exports.get_council = (req,res)=>{
    council.find({}, (err, councils)=>{
        if (err){
            res.status(500).send("Error has occured,cannot display data")
        }
        else{
            console.log(councils)
            res.status(200).json(councils)
        }
    })
}

//Add new council
exports.add_council = (req,res)=>{
      var add_new_council = new council()
      add_new_council.council_name = req.body.council_name
      add_new_council.council_banner_path = req.body.council_banner_path

      add_new_council.save((err, new_council)=> {
        if(err) {
          res.status(500).send('Error saving data')
        } else {
          console.log(new_council)
          res.status(200).json(new_council)
        }
      });
}

//Change council data
exports.change_council = (req,res)=>{
    council.findOneAndUpdate({},
      { $set: { council_name: req.body.council_name , council_banner_path:req.body.council_banner_path} },
      {upsert: false}, (err, updated)=>{
      if (err) {
        res.status(500).send('Error in updating council name and path ');
      } else {
        //console.log('updated with '+updated);
        res.status(200).json(updated);
      }
    });
}

//Delete council data
exports.delete_council = (req,res)=>{
    council.findOneAndRemove({}, (err, deleted)=> {
      if(err) {
        res.status(500).send('Error removing entry')
      } else {
        console.log('deleted '+deleted);
        res.status(200).json(deleted)
      }
    })
}
