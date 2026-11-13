import assert from 'node:assert/strict';import {placement,reveal} from '../dist/district-motion.mjs';
for(let cycle=0;cycle<5;cycle++)for(let stage=0;stage<=.87;stage+=.01){assert.equal(placement(0,stage),0);assert.equal(placement(1,stage),1);let prev=0;for(let i=0;i<=1000;i++){let x=placement(i/1000,stage);assert.ok(x>=prev);prev=x;assert.equal(x,placement(i/1000,stage))}for(let i=1000;i>=0;i--){const x=placement(i/1000,stage);assert.ok(x<=prev);prev=x}}
assert.equal(reveal(.89),0);assert.equal(reveal(1),1);console.log('5 cycles, placements monotones réversibles et révélation finale : OK');
