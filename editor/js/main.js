var editor;

function augmentFeContext(fe) {
  var logger = document.getElementById('logger');
  var loggerContainer = document.getElementById('logger-container');
  function log(msg) {
    logger.textContent += msg + '\n';
    loggerContainer.scrollTop = loggerContainer.scrollHeight;
  }
  function clear() {
    logger.textContent = '';
  }

  fe.io = fe.io || {};
  fe.io.log = log;
  fe.io.clear = clear;
}

function getUrl(url, callback) {
  var xhr;

  if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
  else {
    var versions = ["MSXML2.XmlHttp.5.0",
                    "MSXML2.XmlHttp.4.0",
                    "MSXML2.XmlHttp.3.0",
                    "MSXML2.XmlHttp.2.0",
                    "Microsoft.XmlHttp"];

    for(var i = 0, len = versions.length; i < len; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      }
      catch(e){}
    } // end for
  }

  xhr.onreadystatechange = ensureReadiness;

  function ensureReadiness() {
    if(xhr.readyState < 4) {
      return;
    }

    if(xhr.status !== 200) {
      return;
    }

    // all is well
    if(xhr.readyState === 4) {
      callback(xhr);
    }
  }

  xhr.open('GET', url, true);
  xhr.send('');
}

function initEditor() {
  var ace = window.ace;
  ace.require('ace/ext/language_tools');

  editor = ace.edit("js-fea-editor");

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
  });

  editor.setTheme('ace/theme/katzenmilch');

  var session = editor.getSession();
  session.setMode('ace/mode/javascript');
  editor.$blockScrolling = Infinity;

  loadExample(0);
}

function runScript() {
  var code = editor.getValue();
  code = '(function(fe){' + code + '})(window.fe);';
  eval(code);
}

function clearLog() {
  var logger = document.getElementById('logger');
  logger.textContent = '';
}

function loadExample(idx) {
  var examples = [
    'editor/examples/ex1.js',
    'editor/examples/ex2.js'
  ];

  var url = examples[idx];
  getUrl(url, function(req) {
    var code = req.response;
    editor.setValue(code);
  });
}

initEditor();
augmentFeContext(window.fe);
clearLog();
