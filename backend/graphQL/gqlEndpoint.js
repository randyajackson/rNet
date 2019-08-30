const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const mongoose = require("mongoose");

const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLFloat,
    GraphQLSchema
} = require("graphql");

var app = Express();

const bandcamp = mongoose.createConnection('mongodb://localhost/bc', {useNewUrlParser: true});
const crypto = mongoose.createConnection('mongodb://localhost/crypto', {useNewUrlParser: true});
const newMovies = mongoose.createConnection('mongodb://localhost/upcoming_movies', {useNewUrlParser: true});
const newOnSteam = mongoose.createConnection('mongodb://localhost/new_on_steam', {useNewUrlParser: true});
const topSearches = mongoose.createConnection('mongodb://localhost/googleSearches', {useNewUrlParser: true});

Promise.all([bandcamp, crypto, newMovies, newOnSteam, topSearches]).then(() => {

    // model and type for bandcamp data
    //----------------------------------------------------------------
    const bandcampModel = bandcamp.model("bandcamp",
    {
        url: String,
        art_url: String,
        album_title: String,
        artist_name: String,
        item_description: String,
        count: Number
    });

    const bandcampType = new GraphQLObjectType({
        name: "bandcampRecords",
        fields: {
            url: { type: GraphQLString },
            art_url: { type: GraphQLString },
            album_title: { type: GraphQLString },
            artist_name: { type: GraphQLString },
            item_description: { type: GraphQLString },
            count: { type: GraphQLInt }
        }
    });

    // model and type for crypto data
    //----------------------------------------------------------------
    
    const cryptoModel = crypto.model("crypto_data_prices",
    {
        coinName : String,
        coinSName : String,
        coinPrice : String,
        coinTotal : String,
        coin24 : String
    });

    const cryptoType = new GraphQLObjectType({
        name: "cryptoRecords",
        fields: {
            coinName : { type: GraphQLString },
            coinSName : { type: GraphQLString },
            coinPrice : { type: GraphQLString },
            coinTotal : { type: GraphQLString },
            coin24 : { type: GraphQLString }
        }
    });

    // model and type for newMovies data
    //----------------------------------------------------------------
    
    const newMoviesModel = newMovies.model("upcoming_movie",
    {
        title: String,
        releaseDate: String,
        rating: String,
        synopsis: String,
        poster: String
    });

    const newMoviesType = new GraphQLObjectType({
        name: "newMoviesRecords",
        fields: {
            title: { type: GraphQLString },
            releaseDate: { type: GraphQLString },
            rating: { type: GraphQLString },
            synopsis: { type: GraphQLString },
            poster: { type: GraphQLString }
        }
    });

    // model and type for newOnSteam data
    //----------------------------------------------------------------
    
    const newOnSteamModel = newOnSteam.model("upcoming_steam",
    {
        id: String,
        name: String,
        releaseDate: String,
        short_description: String,
        header_image: String,
        price: String,
        genres: Array
    });

    const newOnSteamType = new GraphQLObjectType({
        name: "newOnSteamRecords",
        fields: {

            id: { type: GraphQLString },
            name: { type: GraphQLString },
            releaseDate: { type: GraphQLString },
            short_description: { type: GraphQLString },
            header_image: { type: GraphQLString },
            price: { type: GraphQLString },
            genres: { type: new GraphQLList(GraphQLString) }
        }
    });

    // model and type for bandcamp data
    //----------------------------------------------------------------
    const topSearchesModel = topSearches.model("top_searches",
    {
        rank: Number,
        topic: String
    });

    const topSearchesType = new GraphQLObjectType({
        name: "topSearchesRecords",
        fields: {
            rank: { type: GraphQLInt },
            topic: { type: GraphQLString }
        }
    });

    //----------------------------------------------------------------

    //defining GraphQL queries below

    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: "Query", 
            fields: {

                bandcamp: {
                    type: GraphQLList(bandcampType),
                    resolve: (root, args, context, info) => {
                        return bandcampModel.find().sort({count: -1}).limit(10).exec();
                    }
                },

                crypto: {
                    type: GraphQLList(cryptoType),
                    resolve: (root, args, context, info) => {
                        return cryptoModel.find().sort({'id#': 1}).exec();
                    }
                },

                new_movie: {
                    type: GraphQLList(newMoviesType),
                    resolve: (root, args, context, info) => {
                        return newMoviesModel.find().exec();
                    }
                },

                new_on_steam: {
                    type: GraphQLList(newOnSteamType),
                    resolve: (root, args, context, info) => {
                        return newOnSteamModel.find().sort({_id : -1}).exec();
                    }
                },

                top_searches: {
                    type: GraphQLList(topSearchesType),
                    resolve: (root, args, context, info) => {
                        return topSearchesModel.find().sort({ rank : 1}).exec();
                    }
                }

            }
        })   
    });

    //-------------------------------------------------------------------------------------------
    app.use("/graphql", ExpressGraphQL({
        schema: schema,
        graphiql: true
    }));

    app.listen(8000, () => {
        console.log("Listening at :8000...");
    });

});