const url = require('url')
const FormData = require('form-data')
const fs = require('fs')
const walk = require('walk')
const path = require('path')

const Storage = require('./Storage')
const RemoteController = require('./RemoteController')

/**
 * Q. How to Check Response properties?
 * A. Reference Your skin edit page with developer tools
 */
class TistorySkin extends RemoteController {
  /**
   * Create TistorySkin Instance
   *
   * @param {string} BLOG_URL
   * @param {string} TSSESSION
   */
  constructor (BLOG_URL, TSSESSION) {
    super(BLOG_URL, TSSESSION)

    /**
     * Tistory Skin Storage
     */
    this.storage = new Storage(BLOG_URL, TSSESSION)
  }

  /**
   * Prepare TISTORY SKIN
   *
   * @return {object}
   */
  prepare () {
    return this.request('get', '/manage/design/skin/html.json')
  }

  /**
   * Get TISTORY SKIN settings
   *
   * @return {object}
   */
  settings () {
    return this.request('get', '/manage/design/skin/current.json')
  }

  /**
   * Configuration
   *
   * skinSettings, variableSettings, homeType, coverSettings ...
   *
   * @param {object} settings
   */
  config (settings) {
    return this.request('post', '/manage/design/skin/settings.json', {
      data: settings
    })
  }

  /**
   * Change Tistory Skin
   *
   * @param {string} html
   * @param {string} css
   * @param {boolean} isPreview
   *
   * @return {string} Preview URL
   */
  async change (html, css, isPreview) {
    const response = await this.request('post', '/manage/design/skin/html.json', {
      data: {
        html: html,
        css: css,
        isPreview: isPreview
      }
    })
    return url.resolve(this.BLOG_URL, response)
  }

  /**
   * Upload a File on file storage of Current Tistory Skin
   *
   * @param {string} path
   */
  upload (path) {
    const formData = new FormData()
    formData.append('files', fs.createReadStream(path))

    return this.request('post', '/manage/design/skin/resource.json', {
      data: formData,
      headers: formData.getHeaders()
    })
  }

  /**
   * Delete a File on file storage of Current Tistory Skin
   *
   * ex) images/script.js
   *
   * @param {string} path
   *
   * @return {object}
   */
  unlink (path) {
    return this.request('delete', '/manage/design/skin/resource.json', {
      data: {
        filename: path
      }
    })
  }

  /**
   * Delete all files on files storage of Current Tistory Skin
   */
  async clear () {
    const stat = await this.prepare()
    const uploadedFiles = stat.files.list

    uploadedFiles.forEach(async fileinfo => {
      const filename = fileinfo.url.replace(
        /https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(.*?)/,
        '$1'
      )
      await this.unlink(filename)
    })
  }

  /**
   * set Tistory Skin
   *
   * @param {string} skinname
   *
   * @return {object}
   */
  set (skinname) {
    const formData = new FormData()

    formData.append('name', skinname)

    return this.request('post', '/manage/design/skin/set.json', {
      data: formData,
      headers: formData.getHeaders()
    })
  }

  /**
   * Deploy Tistory Skin
   *
   * @param {string} dist
   */
  async deploy (dist) {
    const guards = { skin: 'skin.html', css: 'style.css' }

    Object.keys(guards).forEach(key => {
      const content = fs.readFileSync(path.join(dist, guards[key]), 'utf8')
      guards[key] = content
    })

    await this.prepare()
    await this.change(guards.skin, guards.css, false)

    const walker = walk.walk(dist, { followLinks: false })

    walker.on('file', async (root, stat, next) => {
      if (!Object.values(guards).includes(stat.name)) {
        await this.upload(root + '/' + stat.name)
      }
      next()
    })
  }

  /**
   * Get preview
   *
   * **mode** is able to be \
   * 'index', 'entry', 'category', 'tag', 'location', 'media', 'guestbook'
   *
   * @param {string} mode
   *
   * @return {string} HTML
   */
  async preview (settings) {
    const stat = await this.settings()
    const formData = new FormData()

    formData.append('skin', stat.skin.name)

    formData.append('mode', settings.mode)
    formData.append('homeType', settings.homeType || stat.home.type)
    formData.append('coverSettings', JSON.stringify(Object.assign(stat.home.cover.settings, settings.coverSettings)))
    formData.append('variableSettings', JSON.stringify(Object.assign(stat.variableSettings, settings.variableSettings)))
    formData.append('skinSettings', JSON.stringify(Object.assign(stat.skinSettings, settings.skinSettings)))

    return this.request('post', '/manage/previewSkin.php', {
      data: formData,
      headers: formData.getHeaders()
    })
  }
}

module.exports = TistorySkin
