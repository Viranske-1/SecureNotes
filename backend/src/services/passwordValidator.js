const validatePassword = (password) => {
    const failures = [];

    if (typeof password !== "string" || password.length < 8) {
        failures.push("at least 8 characters");
    }

    if (typeof password !== "string" || !/[A-Z]/.test(password)) {
        failures.push("an uppercase letter");
    }

    if (typeof password !== "string" || !/[a-z]/.test(password)) {
        failures.push("a lowercase letter");
    }

    if (typeof password !== "string" || !/[0-9]/.test(password)) {
        failures.push("a number");
    }

    if (typeof password !== "string" || !/[^A-Za-z0-9]/.test(password)) {
        failures.push("a special character");
    }

    if (failures.length === 0) {
        return null;
    }

    return `Password must contain ${failures.join(", ")}.`;
};

module.exports = {
    validatePassword
};
