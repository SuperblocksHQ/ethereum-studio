const fs = require('fs');
const paths = require('../config/paths');

function buildWeb3Provider() {
    let fileContent = fs.readFileSync(paths.appSrc + '/components/superprovider/web3provider.js', { encoding: 'utf-8' });
    fileContent = fileContent.replace(/ORIGIN/g, "'" + process.env.ORIGIN + "'");
    let distPath = paths.appSrc + '/components/superprovider/dist';
    if(!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
    }
    fs.writeFileSync(distPath + '/web3provider.js', fileContent, { encoding: 'utf-8' });
}

module.exports = {
    buildWeb3Provider: buildWeb3Provider
};
