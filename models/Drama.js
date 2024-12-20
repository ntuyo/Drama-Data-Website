'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var reviewSchema = Schema( {
  userId: ObjectId,
  dramaname: String,
  numofepisods: Number,
  rating: Number,
  review: String
} );

module.exports = mongoose.model('Drama', reviewSchema );
