const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const cors = require('cors');

require('dotenv').config();

const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

const {
    graphql,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLFloat,
    GraphQLSchema
} = require("graphql");

const app = Express();
//used for supplying components with data
const bandcamp = mongoose.createConnection('mongodb://localhost/bc', {useNewUrlParser: true});
const crypto = mongoose.createConnection('mongodb://localhost/crypto', {useNewUrlParser: true});
const newMovies = mongoose.createConnection('mongodb://localhost/upcoming_movies', {useNewUrlParser: true});
const newOnSteam = mongoose.createConnection('mongodb://localhost/new_on_steam', {useNewUrlParser: true});
const topSearches = mongoose.createConnection('mongodb://localhost/googleSearches', {useNewUrlParser: true});
const upcomingSneakers = mongoose.createConnection('mongodb://localhost/upcoming_sneakers', {useNewUrlParser: true});

//used for supplying debugging dashboard with data
const bandcamp_debug = mongoose.createConnection('mongodb://localhost/bandcampDebug', {useNewUrlParser: true});
const crypto_debug = mongoose.createConnection('mongodb://localhost/cryptoDebug', {useNewUrlParser: true});
const newMovies_debug = mongoose.createConnection('mongodb://localhost/upcoming_movies_debug', {useNewUrlParser: true});
//const newOnSteam_debug = mongoose.createConnection('mongodb://localhost/new_on_steam', {useNewUrlParser: true});
const topSearches_debug = mongoose.createConnection('mongodb://localhost/googleSearchesDebug', {useNewUrlParser: true});
const upcomingSneakers_debug = mongoose.createConnection('mongodb://localhost/upcoming_sneakers_debug', {useNewUrlParser: true});

Promise.all([bandcamp, crypto, newMovies, newOnSteam, topSearches, upcomingSneakers,
             bandcamp_debug, crypto_debug, newMovies_debug, topSearches_debug, upcomingSneakers_debug]).then(() => {
    
    //START data model and type for component data
    /********************************************/

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

    // model and type for top searches data
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

    // model and type for upcoming sneakers data
    //----------------------------------------------------------------
    const upcomingSneakersModel = upcomingSneakers.model("newSneakers",
    {
        title: String,
        style: String,
        thumbnail: String,
        day: String,
        month: String
    });

    const upcomingSneakersType = new GraphQLObjectType({
        name: "sneakerRecords",
        fields: {
            title: { type: GraphQLString },
            style: { type: GraphQLString },
            thumbnail: { type: GraphQLString },
            day: { type: GraphQLString },
            month: { type: GraphQLString }
        }
    });

    //----------------------------------------------------------------
    //START data model and type for debugging dashboard data
    /******************************************************/

    // model and type for upcoming sneakers debug data
    //----------------------------------------------------------------
    const bandcampDebugModel = bandcamp_debug.model("bandcamp_debugs",
    {
        name: String,
        dateOfIssue: String,
        error: String
    });

    const bandcampDebugType = new GraphQLObjectType({
        name: "bandcamp_debug_records",
        fields: {
            name: { type: GraphQLString },
            dateOfIssue: { type: GraphQLString },
            error: { type: GraphQLString }
        }
    });

    // model and type for crypto debug data
    //----------------------------------------------------------------

    const cryptoDebugModel = crypto_debug.model("crypto_debug",
    {
        name : String,
        dateOfIssue: String,
        error: String
    }, "crypto_debug");

    const cryptoDebugType = new GraphQLObjectType({
        name: "crypto_debug_records", 
        fields: { 
            name: { type: GraphQLString },
            dateOfIssue: { type: GraphQLString },
            error: { type: GraphQLString }
        }
    });
    //----------------------------------------------------------------

    // model and type for upcoming movies debug data
    //----------------------------------------------------------------

    const newMoviesDebugModel = newMovies_debug.model("upcoming_movies_debug",
    {
        name: String,
        dateOfIssue: String,
        error: String
    });

    const newMoviesDebugType = new GraphQLObjectType({
        name: "upcoming_movies_debug_records", 
        fields: { 
            name: { type: GraphQLString },
            dateOfIssue: { type: GraphQLString },
            error: { type: GraphQLString }
        }
    });
    //----------------------------------------------------------------

    // model and type for top searches debug data
    //----------------------------------------------------------------

    const topSearchesDebugModel = topSearches_debug.model("top_searches_debug",
    {
        name: String,
        dateOfIssue: String,
        error: String
    }, "top_searches_debug");

    const topSearchesDebugType = new GraphQLObjectType({
        name: "top_searches_debug_records", 
        fields: { 
            name: { type: GraphQLString },
            dateOfIssue: { type: GraphQLString },
            error: { type: GraphQLString }
        }
    });
    //----------------------------------------------------------------
    
    // model and type for top searches debug data
    //----------------------------------------------------------------

    const upcomingSneakersDebugModel = upcomingSneakers_debug.model("sneakers_debug",
    {
        name: String,
        dateOfIssue: String,
        error: String
    });

    const upcomingSneakersDebugType = new GraphQLObjectType({
        name: "sneakers_debug", 
        fields: { 
            name: { type: GraphQLString },
            dateOfIssue: { type: GraphQLString },
            error: { type: GraphQLString }
        }
    });
    //----------------------------------------------------------------
    

    /****************************************************************/
    //defining GraphQL queries below

    const schema = new GraphQLSchema({

        mutation: new GraphQLObjectType({
            name: 'debugDeletes',
            fields: {

                deleteBandcampDebug: {
                    type: (bandcampDebugType),
                    resolve: (root, args, context, info) => {
                        return bandcampDebugModel.deleteMany({}).exec();
                    }
                },

                deleteCryptoDebug: {
                    type: (cryptoDebugType),
                    resolve: (root, args, context, info) => {
                        return cryptoDebugModel.deleteMany({}).exec();
                    }
                },

                deleteNewMoviesDebug: {
                    type: (newMoviesDebugType),
                    resolve: (root, args, context, info) => {
                        return newMoviesDebugModel.deleteMany({}).exec();
                    }
                },

                deleteTopSearchesDebug: {
                    type: (topSearchesDebugType),
                    resolve: (root, args, context, info) => {
                        return topSearchesDebugModel.deleteMany({}).exec();
                    }
                },

                deleteUpcomingSneakersDebug: {
                    type: (upcomingSneakersDebugType),
                    resolve: (root, args, context, info) => {
                        return upcomingSneakersDebugModel.deleteMany({}).exec();
                    }
                },


            }}),

        query: new GraphQLObjectType({
            name: "Query", 
            fields: {

                //defining component fields
                //---------------------------------------------------------------
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
                },

                upcoming_sneakers: {
                    type: GraphQLList(upcomingSneakersType),
                    resolve: (root, args, context, info) => {
                        return upcomingSneakersModel.find().sort({_id : 1}).exec();
                    }
                },

                //defining debugging fields
                //-------------------------------------------------------------------
                bandcamp_debug: {
                    type: GraphQLList(bandcampDebugType),
                    resolve: (root, args, context, info) => {
                        return bandcampDebugModel.find().sort({_id : -1}).exec();
                    }
                },

                crypto_debug: {
                    type: GraphQLList(cryptoDebugType),
                    resolve: (root, args, context, info) => {
                        return cryptoDebugModel.find().sort({_id : -1}).exec();
                    }
                },

                new_movie_debug: {
                    type: GraphQLList(newMoviesDebugType),
                    resolve: (root, args, context, info) => {
                        return newMoviesDebugModel.find().sort({_id : -1}).exec();
                    }
                },

                top_searches_debug: {
                    type: GraphQLList(topSearchesDebugType),
                    resolve: (root, args, context, info) => {
                        return topSearchesDebugModel.find().sort({_id : -1}).exec();
                    }
                },

                upcoming_sneakers_debug: {
                    type: GraphQLList(upcomingSneakersDebugType),
                    resolve: (root, args, context, info) => {
                        return upcomingSneakersDebugModel.find().sort({_id : -1}).exec();
                    }
                }

            }
        })   
    });

    //-------------------------------------------------------------------------------------------

    app.use(cors());

    app.use("/graphql", ExpressGraphQL({
        schema: schema,
        graphiql: true
    }));

    app.route('/text').post(function (req, res) {
        
        client.messages
        .create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.P_PHONE_NUMBER,
            body: "Over 50 errors"
        })
        .then( (message) => { console.log(message.sid)});
            
    });

    app.listen(8000, () => {
        console.log("Listening at :8000...");
    });

});