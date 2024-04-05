'use strict';

const { validateObject } = require('../../../utils/validate.js');

describe('validateObject', () => {
    const schema = {
        nombre: { type: 'string', minLength: 1, maxLength: 255 },
        periodo_rotacion: { type: 'number', min: 0, max: 100 },
        periodo_orbital: { type: 'number', min: 0, max: 1000 },
        diametro: { type: 'number', min: 0 },
        clima: { type: 'string' },
        gravedad: { type: 'string' },
        terreno: { type: 'string' },
        agua_superficial: { type: 'string' },
        poblacion: { type: 'number', min: 0 }
    };

    it('should throw error when field is missing', () => {
        const obj = {
            periodo_rotacion: 23,
            periodo_orbital: 304,
            diametro: 10465,
            clima: 'arid',
            gravedad: '1 standard',
            terreno: 'desert',
            agua_superficial: '1',
            poblacion: 200000
        };

        expect(() => validateObject(obj, schema)).toThrow('Missing field: nombre');
    });

    it('should throw error when type is incorrect', () => {
        const obj = {
            nombre: 123,
            periodo_rotacion: 23,
            periodo_orbital: 304,
            diametro: 10465,
            clima: 'arid',
            gravedad: '1 standard',
            terreno: 'desert',
            agua_superficial: '1',
            poblacion: 200000
        };

        expect(() => validateObject(obj, schema)).toThrow('Invalid type for field nombre. Expected string, got number');
    });

    it('should throw error when string length is below minimum', () => {
        const obj = {
            nombre: '',
            periodo_rotacion: 23,
            periodo_orbital: 304,
            diametro: 10465,
            clima: 'arid',
            gravedad: '1 standard',
            terreno: 'desert',
            agua_superficial: '1',
            poblacion: 200000
        };

        expect(() => validateObject(obj, schema)).toThrow('Field nombre length is below the minimum allowed (1)');
    });

    it('should throw error when number value is below minimum', () => {
        const obj = {
            nombre: 'Ficticius',
            periodo_rotacion: -1,
            periodo_orbital: 304,
            diametro: 10465,
            clima: 'arid',
            gravedad: '1 standard',
            terreno: 'desert',
            agua_superficial: '1',
            poblacion: 200000
        };

        expect(() => validateObject(obj, schema)).toThrow('Field periodo_rotacion value is below the minimum allowed (0)');
    });

    it('should throw error when number value is above maximum', () => {
        const obj = {
            nombre: 'Ficticius',
            periodo_rotacion: 23,
            periodo_orbital: 1001,
            diametro: 10465,
            clima: 'arid',
            gravedad: '1 standard',
            terreno: 'desert',
            agua_superficial: '1',
            poblacion: 200000
        };

        expect(() => validateObject(obj, schema)).toThrow('Field periodo_orbital value is above the maximum allowed (1000)');
    });

    it('should return true when object is valid', () => {
        const obj = {
            nombre: 'Ficticius',
            periodo_rotacion: 23,
            periodo_orbital: 304,
            diametro: 10465,
            clima: 'arid',
            gravedad: '1 standard',
            terreno: 'desert',
            agua_superficial: '1',
            poblacion: 200000
        };

        expect(validateObject(obj, schema)).toBe(true);
    });

    it('should throw error when type is not supported', () => {
        const obj = {
            nombre: 'Ficticius',
            periodo_rotacion: 23,
            periodo_orbital: 304,
            diametro: 10465,
            clima: 'arid',
            gravedad: '1 standard',
            terreno: 'desert',
            agua_superficial: '1',
            poblacion: 200000
        };

        const schemaWithUnsupportedType = { ...schema, nombre: { type: 'unsupported' } };
        expect(() => validateObject(obj, schemaWithUnsupportedType)).toThrow('Unsupported type for field nombre: unsupported');
    });

    it('should throw error when string length is above maximum', () => {
        const obj = {
            nombre: 'Ficticius'.repeat(100),
            periodo_rotacion: 23,
            periodo_orbital: 304,
            diametro: 10465,
            clima: 'arid',
            gravedad: '1 standard',
            terreno: 'desert',
            agua_superficial: '1',
            poblacion: 200000
        };

        expect(() => validateObject(obj, schema)).toThrow('Field nombre length is above the maximum allowed (255)');
    });
});
