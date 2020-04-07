const FormData = require('form-data')
const fs = require('fs')
const walk = require('walk')

const RemoteController = require('./RemoteController')

class Storage extends RemoteController {
  /**
   * Upload a File on Skin Storage
   *
   * @param {string} path
   *
   * @return {object}
   */
  upload (path) {
    const formData = new FormData()
    formData.append('files[]', fs.createReadStream(path))

    return this.request('post', '/manage/design/skin/addFile.json', {
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
  unlink (filename) {
    return this.request('delete', '/manage/design/skin/deleteFile.json', {
      data: {
        filename: filename
      }
    })
  }

  /**
   * Get uploaded files on Skin Storage
   */
  uploaded () {
    return this.request('get', '/manage/design/skin/add.json')
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

    return this.request('post', '/manage/design/skin/delete.json', {
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

    return this.request('post', '/manage/design/skin/add.json', {
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
  store (dist, skinname) {
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
    return this.request('get', '/manage/design/skin/archivelist.json')
  }
}

module.exports = Storage
