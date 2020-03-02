const FormData = require('form-data')
const fs = require('fs')
const walk = require('walk')

const RemoteController = require('./RemoteController')

class Storage extends RemoteController {
  /**
   * Create Storage Instance
   *
   * @param {string} BLOG_URL
   * @param {string} TSSESSION
   */
  constructor (BLOG_URL, TSSESSION) {
    super(BLOG_URL, TSSESSION)
  }

  /**
   * Upload a File on Skin Storage
   *
   * @param {string} path
   *
   * @return {object}
   */
  async upload (path) {
    const formData = new FormData()
    formData.append('files[]', fs.createReadStream(path))

    return await this.request('post', '/manage/design/skin/addFile.json', {
      data: formData,
      headers: formData.getHeaders()
    })
  }

  /**
   * Delete a File on Skin Storage
   *
   * DON'T USE FULL FILE PATH
   * ex) images/script.js => script.js
   *
   * @param {string} filename
   *
   * @return {object}
   */
  async unlink (filename) {
    return await this.request('delete', '/manage/design/skin/deleteFile.json', {
      data: {
        filename: filename
      }
    })
  }

  /**
   * Get uploaded files on Skin Storage
   */
  async uploaded () {
    return await this.request('get', '/manage/design/skin/add.json')
  }

  /**
   * Delete all files on Skin Storage
   */
  async clear () {
    const stat = await this.uploaded()
    const uploadedFiles = stat.fileList

    uploadedFiles.forEach(async fileinfo => {
      const filename = fileinfo.label.replace(
        /images\/?(.*?)/,
        '$1'
      )
      await this.unlink(filename)
    })
  }

  /**
   * Delete a Skin on Skin Storage
   *
   * @param {string} skinname
   */
  async remove (skinname) {
    const formData = new FormData()

    formData.append('name', skinname)

    return await this.request('post', '/manage/design/skin/delete.json', {
      data: formData,
      headers: formData.getHeaders()
    })
  }

  /**
   * Save a Tistory Skin on Skin Storage
   *
   * @param {string} skinname
   *
   * @return {object}
   */
  async save (skinname) {
    const formData = new FormData()
    formData.append('skinname', skinname)

    return await this.request('post', '/manage/design/skin/add.json', {
      data: formData,
      headers: formData.getHeaders()
    })
  }

  /**
   * Store a Tistory Skin on Skin Storage
   *
   * @param {string} dist
   * @param {string} skinname
   */
  async store (dist, skinname) {
    const walker = walk.walk(dist, { followLinks: false })

    walker.on('file', async (root, stat, next) => {
      await this.upload(root + '/' + stat.name)
      next()
    })

    walker.on('end', async () => {
      await this.save(skinname)
    })
  }

  /**
   * Get stored Tistory Skin on Skin Storage
   */
  async archive () {
    return await this.request('get', '/manage/design/skin/archivelist.json')
  }
}

module.exports = Storage
