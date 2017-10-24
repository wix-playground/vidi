import { createServer } from 'http';
import { Server } from 'net';
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

interface ReadStreamOptions {
    flags?: string;
    encoding?: string;
    fd?: number;
    mode?: number;
    autoClose?: boolean;
    start?: number;
    end?: number;
}

interface RangeRequest {
    start: number;
    end: number;
}

function readRangeHeader(range: string, totalLength: number): RangeRequest | null {
    /*
     * Example of the method 'split' with regular expression.
     *
     * Input: bytes=100-200
     * Output: [null, 100, 200, null]
     *
     * Input: bytes=-200
     * Output: [null, null, 200, null]
     */

    if (range == null || range.length == 0)
        return null;

    const array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    const start: number = parseInt(array[1]);
    const end: number = parseInt(array[2]);
    const result: RangeRequest = {
        start: isNaN(start) ? 0 : start,
        end: isNaN(end) ? (totalLength - 1) : end
    };

    if (!isNaN(start) && isNaN(end)) {
        result.start = start;
        result.end = totalLength - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
        result.start = totalLength - end;
        result.end = totalLength - 1;
    }

    return result;
}

export function startHttpMediaServer(port = 3000, onListen: Function = () => { }): Server {
    return createServer((req, res) => {
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
                const fileSize = fs.statSync(fileName).size;
                const rangeRequest: RangeRequest | null = readRangeHeader(req.headers.range as string, fileSize);

                if (mimeType) {
                    const options: ReadStreamOptions = {};

                    if (rangeRequest) {
                        const { start, end } = rangeRequest;
                        if (start >= fileSize || end >= fileSize) {
                            res.writeHead(416, {
                                'Content-Range': 'bytes */' + fileSize
                            });
                        } else {
                            res.writeHead(206, {
                                'Content-Type': mimeType,
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers': 'Range',
                                'Accept-Ranges': 'bytes',
                                'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
                                'Content-Length': fileSize
                            });

                            options.start = start;
                            options.end = end;
                        }
                    } else {
                        res.writeHead(200, {
                            'Content-Type': mimeType,
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Range',
                            'Accept-Ranges': 'bytes',
                            'Content-Length': fileSize
                        });
                    }

                    const stream = fs.createReadStream(fileName, options);
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
