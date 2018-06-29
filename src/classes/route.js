const wd = process.cwd();

const fs = require('fs');
const path = require('path');
const pug = require('pug');

const config = require('../core/config');

/**
 * Route
 * @class
 */ 
class Route {
  /**
   * Adding route views
   * @private
   * 
   * @return html - HTML String
   */
  static views() {
    /** Variables */
    let
      _html = new String(),
      _routeViewPath = path.join(wd, config.routeViews)
    ;

		const api = require(path.join(process.cwd(), '/config/tidory.config'));

		/** Getting globalVariables */
    const variables = api.GlobalVariable._variables;
    
		let tidory = {
      TIDORY: new Object()
    };
		
		/** to Raw object string */
		variables.forEach(function(e, i) {
      tidory.TIDORY[e._globalVariable] = e._value;
    });
    
    /** Read directory, Save HTML Strings */
    fs.readdirSync(_routeViewPath).filter(function(_file) { 
      return _file.substr(-4) === '.pug'; 
    })
    .forEach(function(_file) {
      let 
        complie = pug.compileFile(path.join(_routeViewPath, _file), null)
      ;
      _html += complie(tidory);
    })
    return _html;
  }

  /** 
   * return Container selector
   * @private
   * 
   */
  static get container() {
    return '#__tidory'
  }
}

module.exports = Route;