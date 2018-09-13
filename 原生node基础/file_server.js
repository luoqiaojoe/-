const http = require('http');
const fs = require('fs');
const uuid = require('uuid/v4');

const common = require('./libs/common.js');

const { parseEncodedStr } = require('./libs/utils.js');

let httpServer = http.createServer( (req, res)=>{

    let arr = [];

    req.on('data', chunk=>{
        arr.push(chunk)
    });

    req.on('end', ()=>{

        let data = Buffer.concat(arr);
        let files = {};
        let post = {};

        if(req.headers['content-type']){ // 排除favicon的请求

            // 1. 利用`<分隔符>`将数据切割，得到一个数组：
            let boundary = req.headers['content-type'].split('; ')[1].split('=')[1];

            if(boundary){

                boundary = '--' + boundary;

                let arr = data.split(boundary); // Buffer的split方法需要自己封装

                // 2. 然后将数组并掐头去尾，剔除不需要的数据
                arr.shift();
                arr.pop();

                // 3. 去掉数组每一项头尾的的`\r\n`
                arr = arr.map( buffer=>buffer.slice(2, buffer.length-2));

                // 4. 利用第一次出现的`\r\n\r\n`分割数组中的每一项
                arr.forEach( buffer=>{
                    let n = buffer.indexOf('\r\n\r\n');

                    let disposition = buffer.slice(0, n);   // 描述部分
                    let content = buffer.slice(n+4);        // 内容部分

                    // 5. 判断`<数据描述>`里是否存在`\r\n`，有，则为文件数据

                    disposition=disposition.toString();     // 描述部分肯定文本数据，可以直接toString()

                    if(disposition.indexOf('\r\n') == -1){
                        // 普通数据
                        // Content-Disposition: form-data; name="user"

                        let name = disposition.split('; ')[1];
                        name = parseEncodedStr(name);    // 去掉"user"的双引号

                        content = content.toString();   //  普通数据可以直接toString()

                        post[name] = content;

                    } else {

                        // 文件数据
                        /*Content-Disposition: form-data; name="file"; filename="test.txt"\r\n
                        Content-Type: text/plain*/

                        let [line1, line2] = disposition.split('\r\n');
                        let [, name, filename] = line1.split('; ');
                        let type = line2.split(': ')[1];

                        name = parseEncodedStr(name);
                        filename = parseEncodedStr(filename);

                        let path = `upload/${uuid()}`;

                        fs.writeFile(path, content, (err)=>{
                            if(err){
                                console.log('文件写入失败', err)
                            } else {
                                files[name]={filename, path, type};
                                console.log(files);
                            }
                        })
                    }
                })

                console.log(post);
            }

        }

        res.write('ok');
        res.end();
    })


});

httpServer.listen(9527, _=>{
    console.log('http server is listening at post 9527');
})













