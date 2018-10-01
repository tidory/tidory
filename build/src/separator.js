const 
  CleanCss = require('clean-css')
  cssesc = require('cssesc')
;

const Utility = require('../../src/utility');

/**
 * Separate
 * 
 * @param $ {object} - TIDORY Document
 * @param tag {string} - target tag name
 * @param scoped {Function} - scoped
 */
function separate($, tag, scoped = new Function()) {
  let s = new String();
  Utility.ifScopedAttributeExist($, tag, function(target) {
    scoped(target);
  }, function(target) {
    s += target.html();
    target.remove();
  });
  return s;
}

let separator = {
  /**
   * Separate 'CSS'
   * 
   * @param $ {object} - TIDORY Document
   * @param options {Object} - TIDORY Webpack build options
   */
  css: function($, options) {
    let 
      cleanCss = new CleanCss(),
      css = new String()
    ;
    css = separate($, 'style', function(target) {
      /** for Build */
      if(options.build) {
        target.html(cleanCss.minify(target.html()).styles);
      }
    })
    css = cleanCss.minify(css).styles;
    /** Content escape */
    css = css.replace(/content:\'(.*?)\'/gim, 
      function(match, content, offset, string) {
        return `content:'${cssesc(content)}'`;
      }
    );
    /** for Production */
    if(!options.build) {
      /** Beautify CSS string */
      css = new CleanCss({
        format: 'beautify'
      }).minify(css).styles;
    }
    $('head').append(`<link rel="stylesheet" href="./style.css">`);

    return css;
  },

  /** 
   * Separate 'script'
   * 
   * @param $ {object} - TIDORY Document
   * @param options {Object} - TIDORY Webpack build options
   */
  script: function($, options) {
    let script = new String();
    script = separate($, 'script:not([src])', function(target) {
      /** for Build */
      if(options.build) {
        /** If keep using script tag in html, minify */
        target.html(Utility.toECMA5AndMinify(target.html()));
      }
    });
    /** for Build */
    if(options.build) {
      /** Minify javscript string */
      script = Utility.toECMA5AndMinify(script);
    }
    else {
      script = Utility.toECMA5AndMinify(script, false);
    }
    $('body').append(`<script type="text/javascript" src="./images/script.js">`);

    return script;
  }
}

/** 
 * Separator
 * 
 * @param $ {object} - TIDORY Document
 * @param options {Object} - TIDORY Webpack build options
 */
module.exports = function($, options) {
  return { 
    css: separator.css($, options), 
    script: separator.script($, options) 
  };
};

