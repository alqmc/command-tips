import { rollup } from 'rollup';
import json from '@rollup/plugin-json';
import ts from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import { dependencies } from '../package.json';
import commonjs from '@rollup/plugin-commonjs';
import { resolve } from 'path';
import { outputPath } from '../package/config/path';
const external = Object.keys(dependencies || '');
const globals = external.reduce((prev, current) => {
  const newPrev = prev;
  newPrev[current] = current;
  return newPrev;
}, {});

const getBundle = async () => {
  return rollup({
    input: resolve(__dirname, '../package/main.ts'),
    external,
    plugins: [
      ts({
        tsconfig: resolve(__dirname, './../tsconfig.json'),
      }),
      nodeResolve({
        extensions: ['.js', '.ts'],
      }),
      commonjs(),
      json(),
    ],
  });
};

export const buildBundle = async () => {
  const bundles = await getBundle();
  bundles.write({
    format: 'cjs',
    file: '../dist/main.js',
    banner: '#!/usr/bin/env node',
    globals,
  });
};