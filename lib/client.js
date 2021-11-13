const axios = require('axios')

module.exports = class {
  /**
   * Create Instance
   *
   * @param {string} url
   * @param {string} ts_session
   */
  constructor (url, ts_session) {
    this._client = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        Referer: url,
        Cookie: 'TSSESSION=' + ts_session
      }
    })
    this._url = url
    this._ts_session = ts_session
  }
}
