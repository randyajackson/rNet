const { exec } = require('child_process');

//the scripts in this scheduler drop their database on a single run

setInterval(function () {

    //runs 'node sneakers'
    exec('node sneakers', (err, stdout, stderr) => {
        if(err) {
            console.log('Error running sneakers');
        }
        if(err === null){
            console.log('sneakers run completed: ' + Date.now());
        }
    }); 

    //runs 'node newMovies'
    
    exec('node newMovies', (err, stdout, stderr) => {
        if(err) {
            console.log('Error running newMovies');
        }
        if(err === null){
            console.log('newMovies run completed: ' + Date.now());
        }
    }); 

    //runs 'python topSearches.py'
    exec('python3 topSearches.py', (err, stdout, stderr) => {
        if(err) {
            console.log('Error running topSearches');
        }
        if(err === null){
            console.log('topSearches run completed: ' + Date.now());
        }
    }); 



 }, 1 * 60 * 60 * 1000);