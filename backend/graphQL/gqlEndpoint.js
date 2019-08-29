const express = require("express");
const expressGraphQL = require("express-graphql");
const mongoose = require("mongoose");

const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema
} = require("graphql");

const bandcamp = mongoose.createConnection();
const crypto = mongoose.createConnection();
const newMovies = mongoose.createConnection();
const newOnSteam = mongoose.createConnection();
const topSearches = mongoose.createConnection();