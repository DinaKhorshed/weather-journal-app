/* Express to run server and routes */
const express = require('express');

/* Start up an instance of app */
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');


/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* CORS */
const cors = require('cors');
app.use(cors());

/* Initialize the main project folder*/
app.use(express.static('website'));

// added process.env.PORT for cloud deployment
const port = process.env.PORT || 3000;

/* Spin up the server*/

listening = () => {

    console.log(server);
    console.log(`running on localhost:${port}`);
};
const server = app.listen(port, listening);

/* Empty array to hold Entered weather Data */
const weatherDetails = [];

// Add Latest entered details to weatherDetails and send latest item added
pushLatestData = (clientRequest, serverResponse) => {
    let newUserInput = {
        'date': clientRequest.body.date,
        'temp': clientRequest.body.temp,
        'content': clientRequest.body.content
    }
    weatherDetails.push(newUserInput);
    serverResponse.send(newUserInput);
}
// POST request
app.post('/add', pushLatestData);


// Send Weather details object array
getAllData = (clientRequest, serverResponse) => {
    serverResponse.send(weatherDetails);
}

// GET Request
app.get('/all', getAllData);
