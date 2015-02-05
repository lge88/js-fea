var ace = window.ace;
ace.require('ace/ext/language_tools');

var editor = ace.edit("js-fea-editor");
editor.setTheme('ace/theme/solarized_dark');
editor.setOptions({
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true
});

var session = editor.getSession();
session.setMode('ace/mode/javascript');
