/** QUnit Framework */
const QUnit = require('qunit');

/** TIDORY Core API */
const { Core } = require('tidory');

let document = new Core.Document('<p t-test="TIDORY"></p>');

QUnit.module('Directive');

QUnit.test('Directive', function(assert) {
  Core.Directive.bind(document);
  assert.equal(document.$('p').text(), "TIDORY");
});