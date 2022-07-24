const http = require('http')
const fs = require('fs')
const host = 'localhost'
const port = 8000
const requestListener = function(req, res) {
	res.writeHead(200, { 'Content-Type':'text/html' })
	console.log(req.url);
	if (req.url == '/'){
		req.url = '/index.html';
	}
	fs.readFile(req.url.substring(1), function(error,  data){
		if (error){
			res.writeHead(404)
			res.write('File nout found')
		}
		else{
			res.write(data)
		}
		res.end()
	})
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`)
})
