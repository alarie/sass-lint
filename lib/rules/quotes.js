'use strict';

var helpers = require('../helpers');

module.exports = {
  'name': 'quotes',
  'defaults': {
    'style': 'single'
  },
  'detect': function (ast, parser) {
    var result = [];

    ast.traverseByType('string', function (node) {
      var firstQuote = node.content.charAt(0),
          lastQuote = node.content.charAt(node.content.length - 1);

      if (firstQuote !== lastQuote) {
        result = helpers.addUnique(result, {
          'ruleId': parser.rule.name,
          'line': node.start.line,
          'column': node.start.column,
          'message': 'Mixed quote styles',
          'severity': parser.severity
        });
      }

      if (parser.options.style === 'single' && firstQuote !== '\'') {
        result = helpers.addUnique(result, {
          'ruleId': parser.rule.name,
          'line': node.start.line,
          'column': node.start.column,
          'message': 'Strings must use single quotes',
          'severity': parser.severity
        });
      }
      else if (parser.options.style === 'double' && firstQuote !== '"') {
        result = helpers.addUnique(result, {
          'ruleId': parser.rule.name,
          'line': node.start.line,
          'column': node.start.column,
          'message': 'Strings must use double quotes',
          'severity': parser.severity
        });
      }
    });

    return result;
  }
};

module.exports.fix = function (ast, parser) {

  ast.traverseByType('string', function (node) {
    var len = node.content.length,
        firstQuote = node.content.charAt(0),
        lastQuote = node.content.charAt(len - 1);

    if (firstQuote !== lastQuote) {
      return;
    }

    if (parser.options.style === 'single' && firstQuote !== '\'') {
      node.content = '\'' + node.content.substr(1, len - 2) + '\'';
    }
    if (parser.options.style === 'double' && firstQuote !== '"') {
      node.content = '"' + node.content.substr(1, len - 2) + '"';
    }



  });

};
