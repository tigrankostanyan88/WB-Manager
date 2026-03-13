const AppError = require('./appError');

class Validator {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }

    required(field, name) {
        if (!this.data[field] || String(this.data[field]).trim() === '') {
            this.errors.push(`${name || field}-ը պարտադիր է`);
        }
        return this;
    }

    email(field) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.data[field] && !emailRegex.test(this.data[field])) {
            this.errors.push('Էլ․ հասցեի ձևաչափը սխալ է');
        }
        return this;
    }

    phone(field) {
        // Regex for Armenian phone numbers: 0 followed by 8 digits (e.g., 091234567)
        const phoneRegex = /^0\d{8}$/;
        if (this.data[field] && !phoneRegex.test(this.data[field])) {
            this.errors.push('Հեռախոսահամարը պետք է լինի 0-ով սկսվող 9 նիշ (օր․ 091234567)');
        }
        return this;
    }

    min(field, length, name) {
        if (this.data[field] && this.data[field].length < length) {
            this.errors.push(`${name || field}-ը պետք է լինի առնվազն ${length} նիշ`);
        }
        return this;
    }

    validate() {
        if (this.errors.length > 0) {
            throw new AppError(this.errors.join('. '), 400, 'VALIDATION_ERROR');
        }
    }
}

module.exports = Validator;
