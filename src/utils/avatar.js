/**
 * Build avatar URL from user file data
 * @param {Object} userData - User object with files array
 * @returns {string} Avatar URL or empty string
 */
function buildAvatarUrl(userData) {
    if (!userData || !userData.files || !Array.isArray(userData.files) || userData.files.length === 0) {
        return '';
    }
    
    const avatarFile = userData.files.find((f) => f.name_used === 'user_img') || userData.files[0];
    
    if (avatarFile?.name && avatarFile?.ext) {
        const table = avatarFile.table_name || 'users';
        // ext already includes the leading dot from backend (e.g., '.jpg')
        const extWithDot = avatarFile.ext.startsWith('.') ? avatarFile.ext : `.${avatarFile.ext}`;
        return `/images/${table}/large/${avatarFile.name}${extWithDot}`;
    }
    
    return '';
}

/**
 * Add avatar URL to user data object (mutates the object)
 * @param {Object} userData - User object to mutate
 * @returns {Object} User object with avatar property added
 */
function addAvatarToUser(userData) {
    if (!userData) return userData;
    
    const avatarUrl = buildAvatarUrl(userData);
    if (avatarUrl) {
        userData.avatar = avatarUrl;
    }
    
    return userData;
}

/**
 * Sanitize user data by removing sensitive fields and adding avatar
 * @param {Object} user - Raw user object
 * @returns {Object} Sanitized user object
 */
function sanitizeUser(user) {
    if (!user) return null;
    
    const userData = user.toJSON ? user.toJSON() : { ...user };
    
    // Include files from the original user object if not in toJSON result
    if (user.files && !userData.files) {
        userData.files = Array.isArray(user.files) 
            ? user.files.map(f => f.toJSON ? f.toJSON() : f)
            : user.files;
    }
    
    // Remove sensitive fields
    delete userData.password;
    delete userData.passwordConfirm;
    delete userData.passwordResetToken;
    delete userData.passwordResetExpires;
    delete userData.login_token;
    
    // Add avatar
    addAvatarToUser(userData);
    
    return userData;
}

module.exports = {
    buildAvatarUrl,
    addAvatarToUser,
    sanitizeUser
};
