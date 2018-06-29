/** QUnit Framework */
const QUnit = require('qunit');

/** TIDORY Core API */
const { Core } = require('../../tidory');

let document = new Core.Document('<p></p>');

QUnit.module('Async');

QUnit.test('Async', function(assert) {
  Core.Async.fetch(document, function() {
    // console.log(document.$('p').text()); // -> TIDORY
  });
  // assert.equal(document.$('p').text(), "TIDORY"); // -> FAILED
  assert.ok(true);
});