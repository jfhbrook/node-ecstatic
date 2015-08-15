var test = require('tap').test,
    ecstatic = require('../'),
    http = require('http'),
    request = require('request'),
    eol = require('eol'),
    fs = require('fs'),
    path = require('path');

test('icon images', function (t) {
  // make sure there are no extra nor missing icons
  t.plan(2);
  // get all .png files mentioned in ecstatic-icons.css
  var css = fs.readFileSync(
    __dirname + '/../lib/_ecstatic-assets/ecstatic-icons.css',
    {encoding:'utf8'}
  );
  
  var lines = css.split('\n');
  var missingFiles = [];
  var usedFiles = [];
  for(var i = 0; i < lines.length; i ++){
    var regexResult = /url\(\'(.+?)\'\)/ig.exec(lines[i]);
    var filepath = regexResult ? regexResult[1] : false;
    if (filepath){
      // check if file exists
      var toStat = path.join(__dirname,'../lib/_ecstatic-assets',filepath);
      try{
        var fileStats = fs.statSync(toStat);
      }
      catch(err){
        missingFiles.push(filepath)
      }
      
      if( !fileStats ||  !fileStats.isFile ){
        missingFiles.push(filepath);
      }
      else{
        usedFiles.push( path.basename(filepath) );
      }
    }
  }
  
  missingFiles = uniq(missingFiles);
  usedFiles = uniq(usedFiles);
  
  t.equal(
    missingFiles.length, 0,
    'should not be missing icons',
    {'Missing These Icons' : JSON.stringify(missingFiles,null,2).replace(/[\[\]\'\"]/ig,'')}
  );
    
  var iconsInDirectory = fs.readdirSync( path.join(__dirname,'../lib/_ecstatic-assets/icons') );
  t.assert( (iconsInDirectory.length <= usedFiles.length),'should not have extra icons');
  
});

// remove non-unique array elements
function uniq(a){
  return a.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
  })
}

