/* tidory.preview.config.js
 *
 * set your blog infomation for preview tistory skin
 */

module.exports = {
  id: '__TISTORY_ID__',
  password: '__TISTORY_PASSWORD__',

  /* input your blog url without http protocol.
   *
   * ex) 'example.tistory.com'
   */
  url: '__TISTORY_BLOG_URL__',

  /*
   * > where is it?
   * > go to http://__YOUR_BLOG_URL__/manage/design/skin/edit
   * > then, open the development tools,
   * > find preview iframe in div.skin-content
   */
  previewUrl: '__TISTORY_PREVIEW_URL__',

  /* preview mode
   *
   * 'guestbook' // 방명록
   * 'media' // 미디어로그
   * 'location' // 위치로그
   * 'tag' // 태그
   * 'category' // 카테고리
   * 'entry' // 글
   * 'index' // 홈
   */ 
  mode: '__TISOTRY_PREVIEW_MODE__',

  /* skin configuration for preview
   * 
   * it's contained preview URL
   */ 
  metaUrl: '__TISTORY_BLOG_META_URL__'
}