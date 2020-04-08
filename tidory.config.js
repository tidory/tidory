const wd = process.cwd()

const randomstring = require('randomstring')
const path = require('path')

const $ = require('cheerio').load(
  require('fs').readFileSync(path.join(wd, 'docs/index.xml')), {
    normalizeWhitespace: true,
    xmlMode: true
  }
)

const tidoryConfig = require(path.resolve(wd, './tidory.config'))

module.exports = Object.freeze(Object.assign(Object.assign({
  ts_session: null,
  url: null,
  preview: {
    mode: 'index',
    variableSettings: {}
  },
  alias: null,
  build: {
    public_path: null
  }
}, tidoryConfig || {}), {
  skinname: $('skin > information > name').text(),
  path: {
    dist: './dist',
    entry: './assets/app.js',
    template: './index.pug',
    docs: './docs',
    index: './skin.html',
    stylesheet: './style.css',
    script: `./images/script.${randomstring.generate(20)}.js`,
    publicPath: './images'
  }
}))
