/** QUnit Framework */
const QUnit = require('qunit');
/** TIDORY Core API */
const { Core } = require('tidory');

let document = new Core.Document('<p></p>');

QUnit.module('Async');

QUnit.test('Async', function(assert) {
  Core.Async.fetch(document, function() {
    console.log("Async::Callback");
  });
  assert.ok(true);
});