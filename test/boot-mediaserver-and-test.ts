import {startHttpMediaServer} from '../http-media-server';
const KarmaServer = require('karma').Server;

startHttpMediaServer(3000, startKarma);

function startKarma() {
    const karmaOptions = {
        port: 9876,
        configFile: process.cwd() + '/karma.conf.js',
        singleRun: true
    };
    const karmaServer = new KarmaServer(karmaOptions, cleanup);

    karmaServer.start();
}

function cleanup(exitCode) {
    process.exit(exitCode);
}