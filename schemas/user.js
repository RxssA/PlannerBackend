const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log('Comparing passwords...');
        console.log('Stored password hash:', this.password);
        console.log('Candidate password:', candidatePassword);
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password match:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};

module.exports = mongoose.model("User", UserSchema);
