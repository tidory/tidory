const axios = require('axios')

module.exports = class {
  /**
   * Create Instance
   *
   * @param {string} url
   * @param {string} tsSession
   */
  constructor (url, tsSession) {
    this._client = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        Referer: url,
        Cookie: 'TSSESSION=' + tsSession
      }
    })
  }
}
