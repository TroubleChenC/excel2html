const xlsl = require('xlsx');
const path = require('path');
const fs = require('fs');

let wb = xlsl.readFile(path.resolve(__dirname, './template.xlsx'));

let html = '';
wb.SheetNames.forEach(function(name, index) {
  let ws = wb.Sheets[name];
  let str = xlsl.utils.sheet_to_html(ws);
  
  // 只截取table的内容
  let startNo = str.indexOf(`<table>`);
  let endNo = str.indexOf(`</table>`);
  str = str.substring(startNo, endNo + `</table>`.length);
  
  str = str.replace(/(\b(?:id|t|v)=".*?")/g, '');
  
  str = str.replace(/ip_(.*?)<\/td>/g, `<input type="text" id="$1" name="$1"></td>`);
  str = str.replace(/ta_(.*?)<\/td>/g, `<textarea name="$1" id="$1"  autoheight></textarea></td>`);
  
  let next = index != 0 ? 'next' : '';
  str = str.replace('<table>', `<table class="layui-table ${next}">`);

  html += str;
})



fs.writeFile(path.resolve(__dirname, './output.html'), html, function(err) {
  if (err) {
    return console.log(err);
  }

  console.log('success!');
})