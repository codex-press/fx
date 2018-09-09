#! /usr/local/bin/node

var fs = require('fs');
var path = require('path');

var data = {}
fs.readdirSync(__dirname).map(filename => {
  if (/\.svg$/.test(filename)) {
    console.log(filename);
    var name = filename.slice(0,-4);
    var fullPath = path.join(__dirname, filename)
    data[name] = fs.readFileSync(fullPath, { encoding: 'utf-8' });
  }
});

fs.writeFileSync(path.join(__dirname, 'index.js'), `
export default {
  ${ Object.keys(data).map(name => `
     '${ name }' : \`${ data[name] }\`,
  `).join('') }
}
`);


