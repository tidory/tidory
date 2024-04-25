const url = require('url')
const FormData = require('form-data')
const fs = require('fs')
const walk = require('walk')
const Client = require('./client')

module.exports = class extends Client {
  /**
   * Prepare TISTORY SKIN
   */
  prepare () {
    return this.axiosInstance.get('/manage/design/skin/html.json')
  }

  /**
   * Get TISTORY SKIN settings
   */
  settings () {
    return this.axiosInstance.get('/manage/design/skin/current.json')
  }

  /**
   * Configuration
   *
   * @param {object} settings
   */
  config (settings) {
    return this.axiosInstance.post('/manage/design/skin/settings.json', settings)
  }

  /**
   * Change Tistory Skin
   *
   * @param {string} html
   * @param {string} css
   * @param {boolean} isPreview
   */
  async change (html, css, isPreview) {
    const { data } = await this.axiosInstance.post('/manage/design/skin/html.json', {
      html: html,
      css: css,
      isPreview: isPreview
    })

    return url.resolve(this.axiosInstance.defaults.baseURL, data)
  }

  /**
   * Upload a File on file storage of Current Tistory Skin
   *
   * @param {string} path
   */
  upload (path) {
    const formData = new FormData()

    formData.append('files', fs.createReadStream(path))

    return this.axiosInstance.post('/manage/design/skin/resource.json', formData, {
      headers: formData.getHeaders()
    })
  }

  /**
   * Delete a File on file storage of Current Tistory Skin
   *
   * ex) images/script.js
   *
   * @param {string} path
   */
  unlink (path) {
    return this.axiosInstance.delete('/manage/design/skin/resource.json', {
      data: {
        filename: path
      }
    })
  }

  /**
   * Delete all files on files storage of Current Tistory Skin
   */
  async clear () {
    const { data } = await this.prepare()
    const uploadedFiles = data.files.list

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
   */
  set (skinname) {
    const formData = new FormData()

    formData.append('name', skinname)

    return this.axiosInstance.post('/manage/design/skin/set.json', formData, {
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
   * @param {object} settings
   */
  async preview (settings) {
    const { data } = await this.settings()
    const formData = new FormData()

    formData.append('skin', data.skin.name)

    formData.append('mode', settings.mode)
    formData.append('homeType', settings.homeType || data.home.type)
    formData.append('coverSettings', JSON.stringify(Object.assign(data.home.cover.settings, settings.coverSettings)))
    formData.append('variableSettings', JSON.stringify(Object.assign(data.variableSettings, settings.variableSettings)))
    formData.append('skinSettings', JSON.stringify(Object.assign(data.skinSettings, settings.skinSettings)))

    return this.axiosInstance.post('/manage/previewSkin.php', formData, {
      headers: formData.getHeaders()
    })
  }
}
