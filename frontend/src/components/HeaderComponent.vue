<template>
    <header id="main-header">
        <nav class="navbar">
            <div class="nav-links">
                <router-link to="/" class="nav-btn">Home</router-link>
                
                <router-link v-if="!isAuthenticated" to="/login" class="nav-btn">Log in</router-link>
                <router-link v-if="!isAuthenticated" to="/signup" class="nav-btn">Sign up</router-link>
                
                <a v-if="isAuthenticated" @click="logout" class="nav-btn" style="cursor: pointer;">Logout</a>
            </div>
            
            <div v-if="isAuthenticated" class="profile-pic">
                 <img src="/images/icons8-test-account-50.png" alt="Profile">
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'HeaderComponent',
    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
            this.$router.push('/login')
        }
    }
}
</script>
