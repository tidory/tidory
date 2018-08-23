/**
 * @author Mansu Jeong
 * @description 
 * Copyright (c) Mansu Jeong. All rights reserved.
 * 
 * Ref. http://docs.casperjs.org/en/latest/
 * casperjs. http://casperjs.org/
 * 
 * Author. Mansu Jeong
 * Homepage. http://www.tidory.com
 * Github. https://github.com/pronist/
 */

 var Preview = require('./classes/preview');

 /** initialize casper module */ 
 var casper = require('casper').create({
  verbose: false,
  logLevel: 'info',
});
var userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36';
casper.userAgent(userAgent);

/** phantomjs file system module */
var fs = require('fs');
var wd = fs.workingDirectory;

/** preview config */
var baseConfig = require(wd+'/config/tidory.preview.conf');

/** open tistory login page */
casper.start('https://www.tistory.com/auth/login', function() {
  /** try to login */ 
  Preview.login(this, baseConfig);
  /** preview */ 
  function _preview() {
    // open tistory skin editor
    casper.open(baseConfig.BLOG_URL+'/manage/design/skin/edit').then(function() {
      this.waitForSelector('#skin-editor', function() {
        Preview.switch(this, baseConfig, userAgent).then(function() {
          casper.echo('\t[info] preview: '+ baseConfig.BLOG_URL+baseConfig.PREVIEW_URL, 'INFO');
          this.thenOpen(baseConfig.BLOG_URL+baseConfig.PREVIEW_URL, function() {
            casper.echo('\t[info] create: index.html', 'INFO');
            var __preview = Preview.transform(this);
            fs.write(wd+'/index.html', __preview);
          })
        });
      })
    }).then(function() {
      casper.echo('\t[info] finished!\n', 'INFO');
    });
  }
  // is it password page?
  this.waitForSelector('#passwordChangeForm', function() {
    this.thenClick('a.link_cancel', function() {
      _preview();
    });
  }, function() {
    _preview();
  });
}).run();