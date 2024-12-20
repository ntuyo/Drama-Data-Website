'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var userSchema = Schema( {
  username: String,
  passphrase: String,
  security1: String,
  security2: String
} );

module.exports = mongoose.model( 'User', userSchema );
