const TistorySkin = require('tistory-skin')

/**
 * Get asserts public path
 *
 * @param {object} tidoryConfig
 */
module.exports = async tidoryConfig => {
  if (tidoryConfig.ts_session) {
    const skin = new TistorySkin(tidoryConfig.url, tidoryConfig.ts_session)

    /** Prepare twice for getting skin number */
    await skin.prepare()
    const { skinname } = await skin.prepare()

    return `https://tistory1.daumcdn.net/tistory/${skinname.split('/')[1]}/skin/images`
  }

  return '/'
}
