import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/sdk.js',
        format: 'iife',
        name: 'AntarioPay'
    },
    plugins: [resolve(), typescript()]
};
