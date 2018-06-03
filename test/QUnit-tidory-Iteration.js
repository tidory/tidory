/** QUnit Framework */
const QUnit = require('qunit');
/** TIDORY Core API */
const { Core } = require('tidory');

let document = new Core.Document('<p t-for="item in [TIDORY, TISTORY]">@{item}</p>');

QUnit.module('Iteration');

QUnit.test('Iteration', function(assert) {
  Core.Iteration.translate(document);
  assert.ok(document.$('p').length == 2, "Length is must be 2");
});