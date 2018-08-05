const historyRouter = require('history-router');

const Router = new historyRouter.Router();

Router.init({ 
  el: '#container' 
}, ({ done }) => {
  done(require('@views/blogMenu.pug'))
})