'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var reviewSchema = Schema( {
  userId: ObjectId,
  name: String,
  rating: Number,
  romanceandchemistry: Number,
  storyandplot: Number,
  pathosandproduction: Number,
  datestarted: Date,
  datecompleted: Date,
  review: String
} );

module.exports = mongoose.model('Review', reviewSchema );
