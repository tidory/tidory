/** QUnit Framework */
const QUnit = require('qunit');
/** TIDORY Core API */
const { Core } = require('tidory');

QUnit.module('Condition');

QUnit.test('Condition::if', function(assert) {
  /**
   * <p t-if="true">
   *  it&apos;s awesome framework for Tistory Skin
   * </p>
   * <p t-else>tidory</p>
   */
  let document = new Core.Document(`<p t-if="true">it&apos;s awesome framework for Tistory Skin</p><p t-else>tidory</p>`);

  Core.Condition.translate(document);

  assert.ok(document.$('p').length == 1, "Length is must be 1");
  assert.equal(document.$('p').html(), "it&apos;s awesome framework for Tistory Skin");
});

QUnit.test('Condition::else', function(assert) {
  /**
   * <p t-if="false">
   *  it&apos;s awesome framework for Tistory Skin
   * </p>
   * <p t-else>tidory</p>
   */
  let document = new Core.Document(`<p t-if="false">it&apos;s awesome framework for Tistory Skin</p><p t-else>tidory</p>`);

  Core.Condition.translate(document);

  assert.ok(document.$('p').length == 1, "Length is must be 1");
  assert.equal(document.$('p').html(), "tidory");
});

QUnit.test('Condition::if-else-if-else::false', function(assert) {
  /**
   * <p t-if="false">
   *  it&apos;s awesome framework for Tistory Skin
   * </p>
   * <p t-else-if="true">tidory</p>
   * <p t-else>tistory</p>
   */
  let document = new Core.Document(`<p t-if="false">it&apos;s awesome framework for Tistory Skin</p><p t-else-if="true">tidory</p><p t-else>tistory</p>`);

  Core.Condition.translate(document);

  assert.ok(document.$('p').length == 1, "Length is must be 1");
  assert.equal(document.$('p').html(), "tidory");
});

QUnit.test('Condition::if-else-if-else::true', function(assert) {
  /**
   * <p t-if="true">
   *  it&apos;s awesome framework for Tistory Skin
   * </p>
   * <p t-else-if="true">tidory</p>
   * <p t-else>tistory</p>
   */
  let document = new Core.Document(`<p t-if="true">it&apos;s awesome framework for Tistory Skin</p><p t-else-if="true">tidory</p><p t-else>tistory</p>`);

  Core.Condition.translate(document);

  assert.ok(document.$('p').length == 1, "Length is must be 1");
  assert.equal(document.$('p').html(), "it&apos;s awesome framework for Tistory Skin");
});

QUnit.test('Condition::if-else-if-else-if-else-if-else::false', function(assert) {
  /**
   * <p t-if="false">
   *  it&apos;s awesome framework for Tistory Skin
   * </p>
   * <p t-else-if="false">tidory 3.x</p>
   * <p t-else-if="true">tidory 4.x</p>
   * <p t-else-if="false">tidory 5.x</p>
   * <p t-else>tistory</p>
   */
  let document = new Core.Document(`<p t-if="false">it&apos;s awesome framework for Tistory Skin</p><p t-else-if="false">tidory 3.x</p><p t-else-if="true">tidory 4.x</p><p t-else-if="false">tidory 5.x</p><p t-else>TISTORY</p>`);

  Core.Condition.translate(document);

  assert.ok(document.$('p').length == 1, "Length is must be 1");
  assert.equal(document.$('p').html(), "tidory 4.x");
});

QUnit.test('Condition::if-else-if-else-if-else-if-else::true', function(assert) {
  /**
   * <p t-if="false">
   *  it&apos;s awesome framework for Tistory Skin
   * </p>
   * <p t-else-if="false">tidory 3.x</p>
   * <p t-else-if="true">tidory 4.x</p>
   * <p t-else-if="true">tidory 5.x</p>
   * <p t-else>TISTORY</p>
   */
  let document = new Core.Document(`<p t-if="false">it&apos;s awesome framework for Tistory Skin</p><p t-else-if="false">tidory 3.x</p><p t-else-if="true">tidory 4.x</p><p t-else-if="true">tidory 5.x</p><p t-else>TISTORY</p>`);

  Core.Condition.translate(document);

  assert.ok(document.$('p').length == 1, "Length is must be 1");
  assert.equal(document.$('p').html(), "tidory 4.x");
});