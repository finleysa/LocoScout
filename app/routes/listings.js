'use strict';

var globalPage = 1;
var globalLimit = 10;
var defaultLimit = 10;

var Listing = require('../models/listing');
//var User = require('../models/user');
//var request = require('request');
//var fs = require('fs');
//var Mongo = require('mongodb');
//var _ = require('lodash');

exports.new = function(req, res){
  res.render('listings/new');
};

exports.index = function(req, res){
  //possibly this function should do a findByGeo right away, dont know
  //Also probably need paging, joy... I can import last projects paging into this
  //one pretty easily, as long as we arent also doing find by geo and paging at same time,
  //that might be a little tricky, but maybe un neccesary since our find by
  //geo distance is limiting our results anyway
  /*
  if(req.query.move === 'next'){
    globalPage ++;
  }else if(req.query.move === 'prev'){
    globalPage --;
  }else{
    globalPage = 1;
  }
  globalLimit = req.query.limit || defaultLimit;

  req.query.page = req.query.page || globalPage;
  //req.query.limit = req.query.limit || globalLimit;

  Listing.findByFilter(req.query, function(items){
  });
  */ 
  Listing.findAll(function(listings){
    res.render('listings/index', {title:'Listings Index Page', listings:listings});
  });
};

exports.query = function(req, res){
  console.log(req.query);
  Listing.findByGeo(req.query, function(listings){
    console.log(listings);
    res.send({listings:listings});
  });
};

exports.show = function(req, res){
  Listing.findById(req.params.id, function(listing){
    res.render('listings/show', {listing:listing});
  });
};

exports.create = function(req, res){
  var listing = new Listing(req.body);
  listing.addCover(req.files.cover.path);
  listing.insert(function(data){
    console.log(data);
    res.redirect('/listings');
  });
  //res.redirect('users/' + req.session.userId, {title:'Random title'});
  
};

exports.reserve = function(req, res){
  //listing id, date, artist name
  Listing.findById(req.body.listingId, function(listing){
    listing.reserveListing(req.body.artistName, req.body.arrtistId , req.body.reservedDate, function(){
      res.redirect('/');
    });
  });
};

exports.destroy = function(req, res){
  Listing.deleteById(req.params.id, function(count){
    res.redirect('users/' + req.session.userId);
  });
};

