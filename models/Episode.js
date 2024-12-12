'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var reviewSchema = Schema( {
  userId: ObjectId,
  dramaname: String,
  episodenum: Number,
  rating: Number,
  notes: String
} );

module.exports = mongoose.model('Episode', reviewSchema );
