const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

let httpServer = http.createServer( (req, res)=>{

    let { pathname, query } = url.parse(req.url, true);

    let arr = [];

    req.on('data', chunk=>{ //这种方法是有问题的
        arr.push(chunk)
    });

    req.on('end', ()=>{
        console.log(arr); // Buffer数据
        console.log(arr.toString()); // 只有在确认arr是文本数据的时候，才能toString()

        res.write('ok');
        res.end();
    })


});

httpServer.listen(9527, _=>{
    console.log('http server is listening at post 9527');
})