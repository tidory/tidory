<template lang="pug">
  nav#td-blogMenu-wrapper
    ul
      each ref in TIDORY.references
        li: a(href=ref.href)= ref.text
</template>

<style>
  #td-blogMenu-wrapper {
    margin-top: 35px;
  }
  #td-blogMenu-wrapper li {
    margin: 0 15px;
    display: inline-block;
  }
  #td-blogMenu-wrapper li a {
    font-size: 1.05em;
    color: #525252;
    font-weight: 300;
  }
</style>