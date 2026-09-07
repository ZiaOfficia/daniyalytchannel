const fs = require('fs');
const path = require('path');

const dir = __dirname;
const imgDir = path.join(dir, 'img');
const dataUri = f => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(imgDir, f)).toString('base64');

let html = fs.readFileSync(path.join(dir, 'index.src.html'), 'utf8');

// IMG:name.jpg  ->  data URI
html = html.replace(/IMG:([\w.\-]+\.jpg)/g, (_, f) => dataUri(f));

// __THUMBS__  ->  { videoId: dataUri } for every downloaded short frame
const thumbs = {};
for (const f of fs.readdirSync(imgDir)) {
  if (f.startsWith('s_')) thumbs[f.slice(2, -4)] = dataUri(f);
}
html = html.replace('__THUMBS__', JSON.stringify(thumbs));

const out = path.join(dir, 'daniyalkhanmedico.html');
fs.writeFileSync(out, html);
console.log('wrote', out, (fs.statSync(out).size / 1048576).toFixed(2), 'MB');
console.log('shorts inlined:', Object.keys(thumbs).length);
console.log('leftover placeholders:', (html.match(/IMG:|__THUMBS__/g) || []).length);
