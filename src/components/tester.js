const requester = require('graphql-request');
 
const new_moviesQuery = 
"{" +
    "new_movie" +
    "{" +
      "title," +
      "releaseDate," +
      "rating," +
      "synopsis," +
      "poster" +
    "}" +
"}";
 
requester.request('http://localhost:8000/graphql', new_moviesQuery).then(data => console.log(data));