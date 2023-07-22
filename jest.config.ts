import type {Config} from 'jest';

const config: Config = {
    testMatch: [
        '**/*.test.ts',
    ],
    preset: 'ts-jest',
    reporters: [
        'default',
    ],
    modulePathIgnorePatterns: [
        './dist'
    ]
}

export default config;