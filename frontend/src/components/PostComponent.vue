<template>
    <article class="post" @click="openPost">
        <div class="post-header">
            <img src="/images/icons8-test-account-50.png" :alt="post.author" class="post-avatar">
            <span class="post-author">{{ post.author }}</span>
            <span class="post-date">{{ formatDate(post.date) }}</span>
        </div>
        <div class="post-content">
            <img v-if="post.image" :src="getImageUrl(post.image)" :alt="post.title" class="post-image">
            <p>{{ post.description || post.title }}</p>
        </div>
        <div class="post-footer">
            <button class="like-btn" @click.stop="likePost"> 
                <i class="fa-regular fa-thumbs-up"></i> Like
            </button>
            <span class="like-count">{{ post.likes }} likes</span>
        </div>
    </article>
</template>

<script>
export default {
    name: 'PostComponent',
    props: ['post'],
    methods: {
        formatDate(dateString) {
            if (!dateString) return 'N/A'
            return new Date(dateString).toLocaleDateString('en-GB', {
                year: 'numeric', month: 'long', day: 'numeric'
            })
        },
        likePost() {
            this.$store.dispatch('likePost', this.post.id)
        },
        getImageUrl(image) {
            if (image.startsWith('http')) {
                return image
            }
            return '/' + image
        },
        openPost() {
            this.$router.push(`/posts/${this.post.id}`)
        }
    }
}
</script> 