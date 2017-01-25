'use strict';

var helpers = require('../helpers');

var traverse = function (ast, callback) {
  ast.traverseByType('color', function (node) {
    return callback(node);
  });
};


module.exports = {
  'name': 'hex-notation',
  'defaults': {
    'style': 'lowercase'
  },
  'detect': function (ast, parser) {
    var result = [];

    traverse(ast, function (value) {
      if (value.content.match(/[a-z]/i)) {
        if (parser.options.style === 'lowercase') {
          if (!helpers.isLowerCase(value.content)) {
            result = helpers.addUnique(result, {
              'ruleId': parser.rule.name,
              'line': value.start.line,
              'column': value.start.column,
              'message': 'Hex notation should all be lower case',
              'severity': parser.severity
            });
          }
        }
        else if (parser.options.style === 'uppercase') {
          if (!helpers.isUpperCase(value.content)) {
            result = helpers.addUnique(result, {
              'ruleId': parser.rule.name,
              'line': value.start.line,
              'column': value.start.column,
              'message': 'Hex notation should all be upper case',
              'severity': parser.severity
            });
          }
        }
      }
    });

    return result;
  }
};

module.exports.fix = function (ast, parser) {
  traverse(ast, function (value) {
    if (value.content.match(/[a-z]/i)) {
      if (parser.options.style === 'lowercase') {
        if (!helpers.isLowerCase(value.content)) {
          value.content = value.content.toLowerCase();
        }
      }
      else if (parser.options.style === 'uppercase') {
        if (!helpers.isUpperCase(value.content)) {
          value.content = value.content.toUpperCase();
        }
      }
    }
  });
};
