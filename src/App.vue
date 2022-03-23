<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name:"App",
  data(){
    return{};
  },
  created() {
    if(sessionStorage.getItem('state')){
      this.$store.replaceState(Object.assign({},             
      this.$store.state,JSON.parse(sessionStorage.getItem("state"))))
    }
    window.addEventListener('beforeunload',()=>{
      sessionStorage.setItem("state",JSON.stringify(this.$store.state))
    })
  },
}
</script>

<style>
</style>
