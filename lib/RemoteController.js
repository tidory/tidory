const axios = require('axios')

class RemoteController {
  /**
   * Create TistorySkin Instance
   *
   * @param {string} BLOG_URL
   * @param {string} TSSESSION
   */
  constructor (BLOG_URL, TSSESSION) {
    /**
     * Your Tistory BLOG URL for testing
     *
     * ex) https://appwriter.tistory.com
     */
    this.BLOG_URL = BLOG_URL

    /**
     * WARNING: TSSESSION is Tistory Session Cookie
     */
    this.TSSESSION = TSSESSION
  }

  async request (method, url, config) {
    const axiosInstance = axios.create({
      baseURL: this.BLOG_URL,
      headers: {
        'Content-Type': 'application/json',
        Referer: this.BLOG_URL,
        Cookie: 'TSSESSION=' + this.TSSESSION
      }
    })
    const response = await axiosInstance.request(
      Object.assign({
        method,
        url
      }, config)
    ).catch(err => console.error(err))

    return response.data
  }
}

module.exports = RemoteController
