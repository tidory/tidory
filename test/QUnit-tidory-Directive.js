/** QUnit Framework */
const QUnit = require('qunit');
/** TIDORY Core API */
const { Core } = require('tidory');

let document = new Core.Document('<p t-test="TIDORY"></p>');

QUnit.module('Directive');

QUnit.test('Directive::before', function(assert) {
  Core.Directive.before(document);
  assert.ok(true);
});
QUnit.test('Directive::after', function(assert) {
  Core.Directive.after(document);
  assert.ok(true);
});