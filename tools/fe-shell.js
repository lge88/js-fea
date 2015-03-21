#! /usr/bin/env node
var myrepl = require('repl').start({});
var fe = require('../src');
myrepl.context['fe'] = fe;
myrepl.context['H8Block'] = fe.mesh.H8Block;
