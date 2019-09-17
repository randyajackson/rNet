const { exec } = require('child_process');

setInterval(function () {

    exec('node sneakers', (err, stdout, stderr) => {
        if(err) {
            console.log('Error running sneaker');
        }
        if(err === null){
            console.log('Sneaker run completed: ' + Date.now());
        }
    }); 

    

 }, 1 * 60 * 60 * 1000)