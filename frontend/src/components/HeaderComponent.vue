<template>
    <header id="main-header">
        <nav class="navbar">
            <div class="nav-links">
                <router-link to="/" class="nav-btn">Home</router-link>
                <router-link to="/signup" class="nav-btn">Sign up</router-link>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'HeaderComponent'
}
</script>
