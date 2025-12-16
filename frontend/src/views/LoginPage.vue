<template>
    <div class="login-container">
        <div class="login-card">
            <h3>Login</h3>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" v-model="email" required placeholder="Email">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" v-model="password" required placeholder="Password">
                </div>
                <button type="submit" class="btn-primary">Login</button>
            </form>
            
            <p>Don't have an account?</p>
            <button @click="$router.push('/signup')" class="btn-secondary">
                Go to Signup
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginPage',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async handleLogin() {
            try {
                await this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password
                })
                this.$router.push('/')
            } catch (err) {
                alert("Login failed. Please check credentials.")
            }
        }
    }
}
</script>