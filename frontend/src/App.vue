<template>
    <header-component></header-component>
    <main id="main-container">
        <aside class="sidebar sidebar-left"></aside>
        <section class="feed">
            <router-view></router-view>
        </section>
        <aside class="sidebar sidebar-right"></aside>
    </main>
    <footer-component></footer-component>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
    name: 'App',
    components: {
        HeaderComponent,
        FooterComponent
    },
    mounted() {
        this.$store.dispatch('fetchPosts')
    }
}
</script>
