'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var oldReviewSchema = Schema( {
  userId: ObjectId,
  name: String,
  rating: Number,
  romanceandchemistry: Number,
  storyandplot: Number,
  pathosandproduction: Number,
  datestarted: String,
  datecompleted: String,
  review: String
} );

module.exports = mongoose.model('OldReview', oldReviewSchema );
