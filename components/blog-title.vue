<template lang="pug">
  section#td-blogTitle-wrapper
    case process.env.APP_MODE 
      when 'build'
        h1 [##_title_##]
      when 'development'
        h1 TIDORY #[span(style="font-size:0.5em") with Vue.js] 
</template>

<style>
  #td-blogTitle-wrapper h1 {
    color: #525252;
    margin-top: 35px;
    font-size: 2.8em;
    font-weight: 200;
  }
</style>