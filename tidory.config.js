const wd = process.cwd()

const randomstring = require('randomstring')
const path = require('path')
const fs = require('fs')

const $ = require('cheerio').load(
  fs.readFileSync(path.join(wd, 'docs/index.xml')), {
    normalizeWhitespace: true,
    xmlMode: true
  }
)

const config = path.resolve(wd, './tidory.config.js')

const tidoryConfig = require(fs.existsSync(config)
  ? config
  : path.resolve(wd, './tidory.config.example.js'))

module.exports = Object.freeze(Object.assign(Object.assign({
  ts_session: null,
  url: null,
  preview: {
    mode: 'index',
    variableSettings: {},
    homeType: 'NONE',
    coverSettings: []
  },
  alias: {},
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
