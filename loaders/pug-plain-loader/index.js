const pug = require('pug')
const loaderUtils = require('loader-utils')

const { Core } = require('../../lib/api');

module.exports = function (source) {
  const options = Object.assign({
    filename: this.resourcePath,
    doctype: 'html',
    compileDebug: this.debug || false
  }, loaderUtils.getOptions(this))
  
  const template = pug.compile(source, options)
  template.dependencies.forEach(this.addDependency)

  let 
    html = template(options.data || {}),
    document = new Core.Document(html)
  ;
  Core.Directive.bind(document);

  return html
}
