'use strict';

const validateObject = (obj, schema) => {
    for (let field in schema) {
        if (!(field in obj)) {
            throw new Error(`Missing field: ${field}`);
        }

        const type = schema[field].type;
        if (type === 'string') {
            if (typeof obj[field] !== 'string') {
                throw new Error(`Invalid type for field ${field}. Expected string, got ${typeof obj[field]}`);
            }

            if ('minLength' in schema[field] && obj[field].length < schema[field].minLength) {
                throw new Error(`Field ${field} length is below the minimum allowed (${schema[field].minLength})`);
            }

            if ('maxLength' in schema[field] && obj[field].length > schema[field].maxLength) {
                throw new Error(`Field ${field} length is above the maximum allowed (${schema[field].maxLength})`);
            }
        } else if (type === 'number') {
            if (typeof obj[field] !== 'number') {
                throw new Error(`Invalid type for field ${field}. Expected number, got ${typeof obj[field]}`);
            }

            if ('min' in schema[field] && obj[field] < schema[field].min) {
                throw new Error(`Field ${field} value is below the minimum allowed (${schema[field].min})`);
            }

            if ('max' in schema[field] && obj[field] > schema[field].max) {
                throw new Error(`Field ${field} value is above the maximum allowed (${schema[field].max})`);
            }
        } else {
            throw new Error(`Unsupported type for field ${field}: ${type}`);
        }
    }

    return true;
};

module.exports = {
    validateObject
};
