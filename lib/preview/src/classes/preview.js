var Preview = {

  /** 
   * try to login 
   * @public
   * 
   * @param casper {Casper} - Casperjs
   * @param baseConfig {Object} - configuration
   */
  login: function(casper, baseConfig) {
    casper.echo('\t[info] login: ' + baseConfig.TISTORY_ID, 'INFO');
    casper.waitForSelector('#authForm', function() {
      casper.fill('form#authForm', {
        'loginId' : baseConfig.TISTORY_ID,
        'password': baseConfig.TISTORY_PASSWORD
      }, true);
    });
  },

  /** preview http request
   *
   * it's really important request 
   * the post request changes tistory skin preview iframe content
   * http://example.tistory.com/manage/design/skin/html.json
   * @public
   * 
   * @param casper {Casper} - Casperjs
   * @param baseConfig {Object} - configuration
   * @param userAgent {string} - User Agent
   */
  switch: function(casper, baseConfig, userAgent) {
    casper.echo('\t[info] to apply: '+ baseConfig.BLOG_URL, 'INFO');
    /** HOST */
    var host = baseConfig.BLOG_URL.split(/https?\:\/\//);
    host = host[1];
    /** REQUEST  */
    return casper.open(baseConfig.BLOG_URL+'/manage/design/skin/html.json', {
      method: 'post',
      headers: {
        'Accept'         : '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
        'Connection'     : 'keep-alive',
        'content-type'   : 'application/json',
        'Cookie'         : 'TSSESSION='+casper.page.cookies[0].value,
        'Host'           : host,
        'origin'         : baseConfig.BLOG_URL,
        'Referer'        : baseConfig.BLOG_URL+'/manage/design/skin/edit',
        'User-Agent'     : userAgent,
      },
      data: JSON.stringify({
        "css"      : fs.read(wd+'/dist/style.css'),
        "html"     : fs.read(wd+'/dist/skin.html'),
        "isPreview": false
      })
    })
  },

  /** modify path src, or href for preview
   * 
   * ~/skin/images/favicon.png 
   * -> /dist/images/favicon.png
   * //developers.kakao.com/~
   * -> http://developers.kakao.com/~
   * @public
   * 
   * @param casper {Casper} - Casperjs
   */
  transform: function(casper) {
    return casper.evaluate(function() {
      function _path(attr) {
        var _target = document.querySelectorAll('*['+attr+']');
        for(var i=0; i< _target.length; i++) {
          var _attr = _target[i].getAttribute(attr);
          var _fn = _attr.replace(/^.*[\\\/]/, '');
          if(_attr.search(/\/skin\/images\//igm) > -1) {
            _target[i].setAttribute(attr, 'dist/images/'+_fn);
          }
          if(_attr.search(/^\/\//g) > -1) {
            var _path = _attr.replace(/^\/\//igm, '');
            _target[i].setAttribute(attr, 'http://'+_path);
          }
        }
      }
      _path('src'); _path('href'); 
      /** modify stylesheet path */ 
      document.querySelector('link[href*="/skin/style.css"]').setAttribute('href','dist/style.css');
      return document.documentElement.outerHTML;
    });
}}

module.exports = Preview;