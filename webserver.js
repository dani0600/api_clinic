const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// Run the app by serving the static files in the dist directory
app.use(express.static(__dirname + '/dist/aratm-web'));

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, '/dist/aratm-web', 'index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(port);
