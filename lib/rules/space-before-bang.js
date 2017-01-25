'use strict';

var helpers = require('../helpers.js');

module.exports = {
  'name': 'space-before-bang',
  'defaults': {
    'include': true
  },
  'detect': function (ast, parser) {
    var result = [];

    ast.traverseByTypes(['important', 'default'], function (block, i, parent) {
      var previous = parent.content[i - 1];

      if (!previous.is('space')) {
        if (parser.options.include) {
          if (Array.isArray(previous.content)) {
            previous.last().content += ' ';
          }
          else {
            previous.content += ' ';
          }
        }
      }
      else {
        if (!parser.options.include) {
          previous.content = '';
        }
      }
    });

    return result;
  }
};
