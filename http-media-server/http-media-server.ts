import http = require('http');
import fs = require('fs');
import url = require('url');
import path = require('path');

const mimeTypes: { [key: string]: string } = {
    mp4: 'video/mp4',
    m4s: 'video/mp4',
    m3u8: 'application/vnd.apple.mpegurl',
    webm: 'video/webm',
    ts: 'video/MP2T',
    mpd: 'application/dash+xml'
};

export function startHttpMediaServer(port = 3000, onListen: Function = () => { }) {
    return http.createServer((req, res) => {
        const uri = url.parse(req.url || '').pathname || '';

        function printMessage(message: string, responseCode: number) {
            res.writeHead(responseCode, { 'Content-Type': 'text/plain' });
            res.write(message);
            res.end();
        }

        if (uri === '/') {
            printMessage('HTTP Media Server!', 200);
            return;
        }

        const fileName = path.resolve(__dirname, path.join('assets', uri));
        fs.exists(fileName, (exists) => {
            if (!exists) {
                printMessage('File not found: ' + uri, 404);
            } else {
                console.log('Sending file: ' + fileName);
                const ext = path.extname(uri).slice(1);
                const mimeType = mimeTypes[ext];
                if (mimeType) {
                    res.writeHead(200, {
                        'Content-Type': mimeType,
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Range',
                        'Content-Length': fs.statSync(fileName).size
                    });
                    const stream = fs.createReadStream(fileName);
                    stream.pipe(res);
                } else {
                    printMessage('Unknown file type: ' + ext, 404)
                }
            }
        });
    }).listen(port, () => {
        console.log('Server is listening on port ' + port + '...');
        onListen();
    });
}
