var express = require('express.io');
var app = express();
app.http().io();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index.ejs');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.io.route('ready', function(req) {
	req.io.join(req.data.chat_room);
	req.io.join(req.data.signal_room);
	req.io.join(req.data.files_room);
	app.io.room(req.data).broadcast('announce', {
		message: 'New client in the ' + req.data + ' room.'
	})
})

app.io.route('send', function(req) {
    app.io.room(req.data.room).broadcast('message', {
        message: req.data.message,
		author: req.data.author
    });
})

app.io.route('signal', function(req) {
	//Note the use of req here for broadcasting so only the sender doesn't receive their own messages
	req.io.room(req.data.room).broadcast('signaling_message', {
        type: req.data.type,
		message: req.data.message
    });
})

app.io.route('files', function(req) {
	req.io.room(req.data.room).broadcast('files', {
		filename: req.data.filename,
		filesize: req.data.filesize
	});
})



