'use strict';

var helpers = require('../helpers');

module.exports = {
  'name': 'one-declaration-per-line',
  'defaults': {},
  'detect': function (ast, parser) {
    var result = [],
        lastLine = {};

    ast.traverseByType('declaration', function (declaration, i, parent) {

      if (declaration.start.line === lastLine.start || declaration.start.line === lastLine.end) {
        if (parent.type !== 'arguments') {
          result = helpers.addUnique(result, {
            'ruleId': parser.rule.name,
            'line': declaration.start.line,
            'column': declaration.start.column,
            'message': 'Only one declaration allowed per line',
            'severity': parser.severity
          });
        }
      }

      lastLine.start = declaration.start.line;
      lastLine.end = declaration.end.line;
    });

    return result;
  }
};

module.exports.fix = function (ast, parser) {
  var lastLine = {};

  ast.traverseByType('declaration', function (declaration, i, parent) {

    if (
      declaration.start.line === lastLine.start ||
      declaration.start.line === lastLine.end
    ) {
      if (parent.type !== 'arguments') {
        parent.content = parent.content.reduce(function (memo, item, j) {


          memo.push(item);
          if (item.is('declarationDelimiter')) {
            var next = parent.content[j + 1];

            if (next && !helpers.isNewLine(next)) {
              memo.push(helpers.createNode(parent, {
                type: 'space',
                content: '\n',
                start: {
                  line: item.end.line,
                  column: item.end.column + 1
                },
                end: {
                  line: next.start.line + 1,
                  column: next.start.column - 1
                }
              }));
            }
          }
          return memo;
        }, []);
      }
    }

    lastLine.start = declaration.start.line;
    lastLine.end = declaration.end.line;
  });
};
