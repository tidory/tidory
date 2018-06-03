/** QUnit Framework */
const QUnit = require('qunit');
/** TIDORY Core API */
const { Core } = require('tidory');

let document = new Core.Document('<p>@{message}</p>');

QUnit.module('GlobalVariable');

QUnit.test('GlobalVariable', function(assert) {
  Core.GlobalVariable.translate(document);
  assert.equal(document.$('p').html(), 'Tistory Skin');
});