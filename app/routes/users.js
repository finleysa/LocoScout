/* expr: true */
'use strict';

var User = require('../models/user');
var Listing = require('../models/listing');
//var gravatar  = require('gravatar');


exports.create = function(req, res){
  console.log('req.user.facebookId>>>>>', req.user.facebookId);
  User.update(req.user.facebookId, req.body.email, req.body.role, function(count){
    res.redirect('/users/'+req.session.userId);
  });
};

exports.update = function(req, res){
  console.log('req.user>>>>>', req.user);
  res.render('users/updateInfo', {title: 'Complete Account Registration', user:req.user});
};

exports.show = function(req, res){

  User.findById(req.params.id, function(record){

    if(record.role === 'artist'){
      Listing.findReservationsByArtistId(record._id.toString(), function(reservations){
        Listing.findByArtistId(record._id.toString(), function(listings){
          //var url = gravatar.url(record.email, {s: '200', r: 'pg'});

          res.render('users/artistShow', {reservations:reservations, listings:listings, user:record});
        });
      });
    }else{
      console.log('record._id.toString()', record._id.toString());
      Listing.findByOwnerId('53270d6ed78df6fa10536e44', function(listings){
        console.log('listings>>>>>>', listings);
        res.render('users/ownerShow', {listings:listings, owner:record});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.login = function(req, res){
  User.findByFacebookId(req.user.facebookId.toString(), function(user){
    console.log(req.user.facebookId);
    req.session.userId = user._id.toString();
    req.session.save(function(){
      console.log('req.session>>>>>>>', req.session);
      res.redirect('users/' + req.session.userId);
    });
  });
};
