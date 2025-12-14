<template>
    <div>
        <post-component
            v-for="post in posts"
            :key="post.id"
            :post="post">
        </post-component>
        <div class="reset-container">
            <button class="reset-btn" @click="resetLikes">Reset likes</button>
        </div>
    </div>
</template>

<script>
import PostComponent from '../components/PostComponent.vue'

export default {
    name: 'MainPage',
    components: {
        PostComponent
    },
    computed: {
        posts() {
            return this.$store.getters.allPosts
        }
    },
    methods: {
        resetLikes() {
            this.$store.dispatch('resetLikes')
        }
    }
}
</script>
