import assert from 'node:assert/strict';
import {demos, isVilla, parcel, poolBounds, boulevardBounds, overlaps} from '../dist/project-demos.mjs';

assert.equal(new Set(demos.map(demo=>demo.id)).size,4);
assert.equal(overlaps(poolBounds,boulevardBounds),false,'The pool deck must stay clear of the boulevard');
for(const demo of demos){
  let villas=0;
  for(let i=0;i<12;i++){
    const plot={...parcel(i),width:8.8,depth:14};
    assert.equal(overlaps(plot,boulevardBounds),false,'Buildings and private gardens stay off the road');
    assert.equal(overlaps(plot,poolBounds),false,'The shared pool stays separate from homes');
    for(let j=0;j<i;j++)assert.equal(overlaps(plot,{...parcel(j),width:8.8,depth:14}),false,'Home parcels must not overlap');
    if(isVilla(demo,i))villas++;
    else assert.ok(demo.floors[i]>=3);
  }
  assert.equal(villas,demo.kind==='villas'?12:demo.kind==='mixed'?6:0);
  for(const lang of ['fr','en','ar'])assert.ok(demo.name[lang]&&demo.copy[lang]);
}
assert.ok(Math.max(...demos.find(d=>d.kind==='terraces').floors)<Math.min(...demos.find(d=>d.kind==='apartments').floors),'Terrace buildings must have a distinct low-rise profile');
console.log('Four demo layouts: distinct building types, translated copy, clear roads and non-overlapping pool/home parcels OK');
