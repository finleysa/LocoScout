'use strict';

exports.index = function(req, res){
  res.render('home/index', {title: 'Don\'t log in with facebook! Trust me!'});
};

