<template>
    <div id="signup-page-container">
        <div class="signup-card">
            <h3>Create an Account</h3>
            <form @submit.prevent="validateAndSubmit" class="signup-form">
                <div class="signup-form-group">
                    <label for="email">Email</label>
                    <div class="signup-input-container">
                        <input type="email" id="email" v-model="email" placeholder="Email" required>
                    </div>
                </div>

                <div class="signup-form-group">
                    <label for="password">Password</label>
                    <div class="signup-input-container">
                        <input type="password" id="password" v-model="password" placeholder="Password" required>
                    </div>
                </div>

                <button type="submit" class="signup-submit-btn">Signup</button>

                <div v-if="errors.length" class="validation-errors">
                    <p>The password is not valid:</p>
                    <ul>
                        <li v-for="(error, index) in errors" :key="index">
                            - {{ error }}
                        </li>
                    </ul>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SignupPage',
    data() {
        return {
            email: '',
            password: '',
            errors: []
        }
    },
    methods: {
        validateAndSubmit() {
            this.errors = [];
            const p = this.password;

            if (p.length < 8 || p.length >= 15) {
                this.errors.push("Password must be at least 8 characters and less than 15 characters.");
            }

            if (!/[A-Z]/.test(p)) {
                this.errors.push("Includes at least one uppercase alphabet character.");
            }

            const lowercaseMatches = p.match(/[a-z]/g) || [];
            if (lowercaseMatches.length < 2) {
                this.errors.push("Includes at least two lowercase alphabet characters.");
            }

            if (!/[0-9]/.test(p)) {
                this.errors.push("Includes at least one numeric value.");
            }

            if (!/^[A-Z]/.test(p)) {
                this.errors.push("It should start with an uppercase alphabet character.");
            }

            if (!/_/.test(p)) {
                this.errors.push("It should include the character \"_\".");
            }

            if (this.errors.length === 0) {
                alert("Signup successful!");
                this.$router.push('/');
            }
        }
    }
}
</script>
