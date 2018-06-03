/** QUnit Framework */
const QUnit = require('qunit');
/** TIDORY Core API */
const { Core } = require('tidory');

let document = new Core.Document('<p t-class={"tidory":"true"}></p>');

QUnit.module('Class');

QUnit.test('Class', function(assert) {
  Core.Class.bind(document);
  assert.ok(document.$('p').hasClass('tidory'));
});