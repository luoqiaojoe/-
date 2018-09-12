const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

let httpServer = http.createServer( (req, res)=>{

    let { pathname, query } = url.parse(req.url, true);

    let arr = [];

    req.on('data', chunk=>{
        arr.push(chunk)
    });

    req.on('end', ()=>{

        let data = Buffer.concat(arr);

        console.log(data.toString());

        res.write('ok');
        res.end();
    })


});

httpServer.listen(9527, _=>{
    console.log('http server is listening at post 9527');
})













