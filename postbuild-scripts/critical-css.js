const path = require('path');
const penthouse = require('penthouse');
const Promise = require('bluebird');
const fs = require('fs');
const fsPromise = Promise.promisifyAll(fs);

async function replaceRegexInFile(file, search, replace){
  let contents = await fs.readFileAsync(file, 'utf8')
  let replaced_contents = contents.replace(search, () => {
    return "`<style>" + replace + "</style>`";
  });
  let tmpfile = `${file}.jstmpreplace`;
  await fs.writeFileAsync(tmpfile, replaced_contents, 'utf8')
  await fs.renameAsync(tmpfile, file)
  return true
}

const INJECT_PART = `"<style>__CRITICAL__CSS__INJECTED__</style>"`;


async function extractCriticalCss(url, cssFile, serverFile) {

  const criticalCss = await penthouse({
    //start prod server in the another process
    url,
    css: cssFile
  });

  return await replaceRegexInFile(serverFile, INJECT_PART, criticalCss);

}

const assetManifest = require(path.resolve('public', 'assets', 'asset-manifest.json'));
const cssFile = assetManifest['boot.css'];

extractCriticalCss('http://localhost:8080',
      path.resolve('public' + cssFile),
      'public/server-assets/scrape.server.js').then(() => {
          console.log('extracted and saved critical css');
}).catch(console.log);
