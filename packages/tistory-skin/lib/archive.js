const FormData = require('form-data')
const fs = require('fs')
const walk = require('walk')
const Client = require('./client')

module.exports = class extends Client {
  /**
   * Upload a File on Skin Storage
   *
   * @param {string} path
   */
  upload (path) {
    const formData = new FormData()

    formData.append('files[]', fs.createReadStream(path))

    return this.axiosInstance.post('/manage/design/skin/addFile.json', formData, {
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
   */
  unlink (filename) {
    return this.axiosInstance.delete('/manage/design/skin/deleteFile.json', {
      data: {
        filename: filename
      }
    })
  }

  /**
   * Get uploaded files on Skin Storage
   */
  uploaded () {
    return this.axiosInstance.get('/manage/design/skin/add.json')
  }

  /**
   * Delete all files on Skin Storage
   */
  async clear () {
    const { data } = await this.uploaded()
    const uploadedFiles = data.fileList

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
  remove (skinname) {
    const formData = new FormData()

    formData.append('name', skinname)

    return this.axiosInstance.post('/manage/design/skin/delete.json', formData, {
      headers: formData.getHeaders()
    })
  }

  /**
   * Save a Tistory Skin on Skin Storage
   *
   * @param {string} skinname
   */
  save (skinname) {
    const formData = new FormData()

    formData.append('skinname', skinname)

    return this.axiosInstance.post('/manage/design/skin/add.json', formData, {
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
  archive () {
    return this.axiosInstance.get('/manage/design/skin/archivelist.json')
  }
}
