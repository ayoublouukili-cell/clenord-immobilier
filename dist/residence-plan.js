import {attachDistrictControls} from './district-controls.mjs';
import {placement} from './district-motion.mjs';
import {demos,isVilla,parcel,poolBounds} from './project-demos.mjs';
import * as THREE from './vendor/three-0.160.1.min.js';

function buildDistrict(canvas,track,pin,count,demo=demos[0]) {
const header = document.querySelector('#header');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = x => Math.min(1, Math.max(0, x));
const ease = x => { x = clamp(x); return x*x*(3-2*x); };
const mat = (color, roughness = .8, metalness = 0) => new THREE.MeshStandardMaterial({color, roughness, metalness});
const stone = mat('#dfd5c4'), stone2 = mat('#c9b79b'), glass = mat('#517f8a', .22, .24), dark = mat('#263746'), gold = mat('#bca47a', .4, .4), roof = mat('#f1e7d5'), road = mat('#46555a'), paving = mat('#9d9d91'), grass = mat('#527765'), water = mat('#4dabb7', .16, .1), trunk = mat('#685342'), leaves = mat('#477259');
stone.color.set(demo.stone);stone2.color.set(demo.accent);grass.color.set(demo.grass);water.color.set(demo.water);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#132839');
scene.fog = new THREE.Fog('#132839', 145, 260);
const camera = new THREE.PerspectiveCamera(35, 1, .1, 400);
camera.position.set(48, 53, 64);
camera.lookAt(0, 0, 0);
scene.add(new THREE.HemisphereLight('#dcecff', '#344d42', 2.3));
const sun = new THREE.DirectionalLight('#fff0d6', 3.2);
sun.position.set(-24, 55, 30); sun.castShadow = true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-50; sun.shadow.camera.right=50; sun.shadow.camera.top=50; sun.shadow.camera.bottom=-50;
sun.shadow.bias=-.00015; scene.add(sun);
let renderer;
try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'default'}); }
catch(error) {
 const message=document.createElement('p');message.setAttribute('role','status');message.style.cssText='position:absolute;inset:35% 8% auto;color:#f5ead6;text-align:center';
 const translations={fr:'La scène 3D nécessite WebGL, indisponible dans ce navigateur.',en:'This 3D scene requires WebGL, unavailable in this browser.',ar:'هذا المشهد يحتاج إلى WebGL غير المتوفر في هذا المتصفح.'};
 const translate=()=>message.textContent=translations[document.documentElement.lang]||translations.fr;
 translate();new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});pin.append(message);track.classList.remove('is-animated');return;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
const world = new THREE.Group(); scene.add(world);
// Architectural accents: layered facades, glass reflectance and warm interiors.
const bronze = mat('#8d7353', .34, .5);
const shadowReveal = mat('#5b5b55');
const interiorWarm = new THREE.MeshStandardMaterial({color:'#ffe0a2',emissive:'#d7a15d',emissiveIntensity:.38,roughness:.75});
const planters = mat('#a9a398');
const hedge = mat('#315e4c');
const asphaltMark = new THREE.MeshBasicMaterial({color:'#e6ddc9'});
const lampGlow = new THREE.MeshStandardMaterial({color:'#ffe2a0',emissive:'#ffc875',emissiveIntensity:1.6,roughness:.3});
const carPaints = [mat('#253b4c',.24,.4),mat('#e6e0d4',.26,.25),mat('#6d7d79',.26,.35)];


const animated = [];
function box(parent, w,h,d, material, x=0,y=0,z=0, cast=true) {
 const o = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
 o.position.set(x,y,z); o.castShadow=cast; o.receiveShadow=true; parent.add(o); return o;
}
function cyl(parent,r1,r2,h,material,x,y,z, sides=12) {
 const o = new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,sides),material);
 o.position.set(x,y,z); o.castShadow=true; o.receiveShadow=true; parent.add(o); return o;
}
function group(x,z,stage,offset=0) { const g=new THREE.Group(); g.position.set(x,0,z); world.add(g); animated.push({g,stage,offset}); return g; }
// A single grounded, continuous 3D site: streets, courtyard and individually placed buildings.
box(world, 91,.5,81,grass,0,-.4,0,false);
// The boulevard stays outside the central amenities; side streets serve both rows.
box(world,84,.05,6,road,0,-.1,-11,false);
for(const x of [-40,40])box(world,5,.06,62,road,x,-.07,0,false);
for(const z of [-14.3,-7.7])box(world,84,.08,1,paving,0,-.04,z,false);
for(let x=-36;x<=36;x+=8)box(world,3.4,.015,.1,asphaltMark,x,-.052,-11,false);
for(const x of [-43,43])box(world,.12,.025,62,stone2,x,-.035,0,false);
function lamp(parent,x,z) {
 const post=cyl(parent,.09,.13,4.2,dark,x,2.1,z,10);
 post.castShadow=false;
 box(parent,.85,.16,.5,bronze,x,4.28,z,false);
 box(parent,.68,.09,.38,lampGlow,x,4.16,z,false);
}
// Physical, low-poly vehicles scaled to the road, with glass cabins and wheels.
function vehicle(parent,x,z,paint,rotation=0) {
 const v=new THREE.Group();v.position.set(x,.32,z);v.rotation.y=rotation;parent.add(v);
 box(v,2.3,.55,1.1,paint,0,.27,0);
 box(v,1.1,.48,.94,glass,-.08,.75,0,false);
 for(const sx of [-.72,.72]) for(const sz of [-.57,.57]) {
  const wheel=cyl(v,.24,.24,.14,dark,sx,.1,sz,12);wheel.rotation.x=Math.PI/2;
 }
 box(v,.08,.14,.8,lampGlow,1.16,.35,0,false);
}
for(const x of [-33,-25,-17,17,25,33]) {lamp(world,x,-15);lamp(world,x,-7);}
vehicle(world,-16,-11,carPaints[0]);
vehicle(world,18,-11,carPaints[1],Math.PI);
vehicle(world,40,12,carPaints[2],Math.PI/2);
for (let i=0;i<12;i++) {
 const {x,z} = parcel(i);
 const floors = demo.floors[i] || 2;
 const g=group(x,z,.025+i*.043,i);
 g.scale.x=[1,.94,1.04][i%3];
 if(isVilla(demo,i)){
  box(g,8,.25,11,paving,0,.05,0);
  box(g,7,3.1,6.5,stone,0,1.7,0);
  box(g,4.9,2.8,5,roof,-.9,4.6,-.6);
  box(g,5.4,.22,5.5,stone2,-.9,6.13,-.6);
  box(g,7.5,.18,7.1,roof,0,3.3,0);
  for(const x of [-2.1,0,2.1]){box(g,1.8,2.4,.09,glass,x,1.55,3.28,false);box(g,.06,2.5,.16,bronze,x-.9,1.55,3.35,false)}
  for(const x of [-2.1,.2])box(g,1.9,2.1,.1,glass,x,4.6,1.96,false);
  box(g,2.2,.8,.1,glass,2.4,3.8,3.35,false);
  for(let k=0;k<7;k++)box(g,.1,.18,2.5,bronze,1+k*.4,3.6,4.1);
  box(g,7,.12,3,grass,0,.2,-5);
  box(g,3.5,.15,2.5,stone2,1.4,.25,-5.2);
  box(g,3.1,.05,2.1,water,1.4,.35,-5.2,false);
  for(const x of [-3.7,3.7])box(g,.4,.85,10,hedge,x,.5,0);
  for(const z of [-4,0,4]){cyl(g,.12,.15,1.4,trunk,-3.5,.9,z);const c=new THREE.Mesh(new THREE.SphereGeometry(.65,12,8),leaves);c.position.set(-3.5,2,z);g.add(c)}
  continue;
 }
 const height = floors*2.5;
 box(g,8,height,8,i%3===0?stone2:stone,0,height/2,0);
 box(g,8.4,.3,8.4,roof,0,height+.15,0);
 if(demo.kind==='terraces') {
   box(g,5.8,.12,5,stone2,0,height+.36,0);
   for(const xx of [-2.5,2.5])for(const zz of [-2,2])box(g,.14,2,.14,bronze,xx,height+1.4,zz);
   for(let k=0;k<9;k++)box(g,.12,.15,4.8,bronze,-2.8+k*.7,height+2.4,0);
   for(const xx of [-2,2]) {box(g,1,.5,1,planters,xx,height+.7,2.8);const shrub=new THREE.Mesh(new THREE.IcosahedronGeometry(.65,1),hedge);shrub.position.set(xx,height+1.3,2.8);g.add(shrub);}
 }
 // Recessed roof parapet, lift core and rooftop mechanical screening.
 for(const side of [-1,1]) {
   box(g,8.4,.6,.18,stone2,0,height+.48,side*4.13);
   box(g,.18,.6,8.4,stone2,side*4.13,height+.48,0);
 }
 box(g,2.7,1.7,2.3,stone2,-1.9,height+1.0,-1.2);
 box(g,2.8,.12,2.4,bronze,-1.9,height+1.92,-1.2);
 // Facade horizontal shadow bands separate the floors.
 for(let f=1;f<floors;f++) {
   box(g,8.2,.13,.35,stone2,0,f*2.5,4.12);
   box(g,8.2,.12,.32,stone2,0,f*2.5,-4.12);
 }

 box(g,1.3,height+.1,.4,dark,0,height/2,4.15);
 // Windows, frames, balcony ledges and vertical façade articulation.
 for(let f=0;f<floors;f++) for(let col=-1;col<=1;col++) {
   const y=f*2.5+1.35, x=col*2.35;
   box(g,1.72,1.9,.12,shadowReveal,x,y,4.03,false);
   box(g,1.48,1.65,.075,(f+col+i)%4===0?interiorWarm:glass,x,y,4.105,false);
   box(g,.07,1.68,.13,bronze,x,y,4.19,false);
   box(g,1.58,.065,.16,bronze,x,y+.88,4.19,false);
   box(g,1.6,.08,.2,gold,x,y+.85,4.14,false);
   box(g,1.6,.08,.2,gold,x,y-.85,4.14,false);
   box(g,1.66,.14,.85,stone2,x,y-.98,4.5);
   box(g,1.6,.58,.07,glass,x,y-.65,4.94,false);
   for(const side of [-.67,.67]) box(g,.045,.58,.1,bronze,x+side,y-.65,5.01,false);
   if((f+col+i)%3===0) {
     box(g,.72,.35,.38,planters,x,y-1.0,5.0);
     for(const dx of [-.23,0,.23]) {
       const bush=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,1),hedge);
       bush.position.set(x+dx,y-.73,5.02);g.add(bush);
     }
   }
   box(g,.055,1.7,.14,dark,x,y,4.14,false);
   box(g,1.4,1.6,.07,glass,x,y,-4.055,false);
 }
 for (const side of [-1,1]) {
   box(g,.24,height,8.3,stone2,side*3.85,height/2,0);
   for(let f=0;f<floors;f++) {
     for(const zz of [-2.45,0,2.45]) {
     box(g,.08,1.7,1.6,glass,side*4.06,f*2.5+1.4,zz,false);
     box(g,.14,1.76,.055,bronze,side*4.13,f*2.5+1.4,zz,false);
     box(g,.5,.12,1.85,stone2,side*4.2,f*2.5+.4,zz);
   }
   }
 }
 // Glazed entrance, canopy and stone arrival steps.
 box(g,2.5,2.4,.1,dark,0,1.22,4.13,false);
 box(g,2.2,2.15,.13,glass,0,1.18,4.23,false);
 box(g,.075,2.15,.15,bronze,0,1.18,4.32,false);
 box(g,3.6,.18,2.5,stone2,0,2.6,5.0);
 box(g,3,.16,2.5,gold,0,.12,5.15);
 box(g,2.7,.12,1.2,stone2,0,.04,6.7);
}
// Mosque with arched-window rhythm, a dome and a minaret.
const mosque=group(-23,1,.56);
box(mosque,11,7,10,stone,0,3.5,0);
box(mosque,12,.35,11,roof,0,7.15,0);
const dome=new THREE.Mesh(new THREE.SphereGeometry(3,24,16,0,Math.PI*2,0,Math.PI/2),roof);
dome.position.set(0,7.3,0); dome.castShadow=true; mosque.add(dome);
cyl(mosque,.16,.16,1.5,gold,0,11,0);
box(mosque,2.5,4,.12,dark,0,2.1,5.07,false);
for(const x of [-4,-2,2,4]) box(mosque,.8,2.6,.1,glass,x,3.4,5.08,false);
box(mosque,2.1,13,2.1,stone2,7,6.5,-3);
box(mosque,2.8,.35,2.8,gold,7,13.2,-3);
cyl(mosque,1.35,1.35,1.2,roof,7,14,-3);
cyl(mosque,.1,.1,2,gold,7,15.5,-3);
// Entrance colonnade, arcade rhythm and minaret accents add depth to the mosque.
for (const x of [-4.5,-2.7,2.7,4.5]) {
 cyl(mosque,.16,.19,3.6,roof,x,1.8,5.45,12);
 box(mosque,1.3,.18,.55,bronze,x,3.72,5.45);
}
for(const z of [-3.5,-1.2,1.2,3.5]) box(mosque,.12,2.3,.95,glass,-5.55,3.5,z,false);
for(const y of [4.5,8.5,12.3]) box(mosque,2.4,.2,2.4,bronze,7,y,-3);
// A recessed, clearly bounded swimming pool with a dry terrace and access ladder.
const pool=group(poolBounds.x,poolBounds.z,.63);
const poolTile=mat('#e8f1e8',.4),poolLining=mat('#27778e',.35);
box(pool,19,.18,14,paving,0,.1,0);
box(pool,15,.12,9,poolLining,0,.23,0,false);
box(pool,14.2,.035,8.2,water,0,.32,0,false);
for(const x of [-7.5,7.5])box(pool,.45,.42,9.4,poolTile,x,.34,0);
for(const z of [-4.5,4.5])box(pool,15.4,.42,.45,poolTile,0,.34,z);
// Subtle lane markers sit below the water instead of floating above it.
for(const x of [-3.5,0,3.5])box(pool,.08,.012,6.8,poolLining,x,.29,0,false);
for(const x of [-5,-1.8,1.8,5]) {
 box(pool,1.25,.28,2,roof,x,.32,5.8);
 const back=box(pool,1.25,.55,.15,stone2,x,.67,6.5);back.rotation.x=-.28;
}
for(const x of [-5,5]) {
 cyl(pool,.06,.06,2.4,bronze,x,1.4,-5.9);
 const umbrella=new THREE.Mesh(new THREE.ConeGeometry(1.35,.5,16),roof);umbrella.position.set(x,2.8,-5.9);pool.add(umbrella);
}
for(const x of [-5.8,-5.1]) {
 cyl(pool,.055,.055,1.1,bronze,x,.85,-3.9);
 box(pool,.09,.09,1,bronze,x,1.35,-4.3);
}
for(const y of [.5,.8,1.1])box(pool,.8,.06,.06,bronze,-5.45,y,-3.9);
// Gardens, trees and paths descend with the neighborhood.
const gardens=group(0,8,.70);
box(gardens,8,.13,12,grass,0,.05,0);
for(const x of [-3,0,3]) box(gardens,1.1,.14,12,paving,x,.13,0,false);
for(let i=0;i<18;i++) {
 const x=-2.7+(i%3)*2.7, z=-4.5+Math.floor(i/3)*1.8;
 cyl(gardens,.15,.21,1.8,trunk,x,1,z);
 const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.95+(i%3)*.13,1),leaves);
 crown.position.set(x,2.45,z); crown.castShadow=true; gardens.add(crown);
}
const sports=group(-16,35,.76);
box(sports,16,.13,8,mat('#577d83'),0,.12,0);
box(sports,.12,.025,8,roof,0,.21,0,false);

// Painted multisport pitch markings and goals.
for(const z of [-3.7,3.7]) box(sports,15,.018,.08,roof,0,.22,z,false);
for(const x of [-7.5,7.5]) {
 box(sports,.08,.018,7.4,roof,x,.22,0,false);
 for(const z of [-1.1,1.1])box(sports,.09,1.6,.09,roof,x,.95,z);
 box(sports,.09,.09,2.3,roof,x,1.75,0);
}
const circle=new THREE.Mesh(new THREE.RingGeometry(1.65,1.71,48),roof);
circle.rotation.x=-Math.PI/2;circle.position.y=.225;sports.add(circle);
const tennis=group(15,35,.81);
box(tennis,18,.13,9,mat('#587b69'),0,.12,0);
for(const z of [-4,4,-3,3])box(tennis,16,.025,.07,roof,0,.22,z,false);
for(const x of [-8,8,-4,4])box(tennis,.07,.025,8,roof,x,.22,0,false);
box(tennis,.07,.025,6,roof,0,.23,0,false);
for(const z of [-4.5,4.5])cyl(tennis,.06,.06,1.1,dark,0,.7,z);
for(let z=-4.5;z<=4.5;z+=.3)box(tennis,.025,.9,.025,roof,0,.65,z,false);
for(let y=.2;y<1.2;y+=.2)box(tennis,.025,.025,9,roof,0,y,0,false);
const shops=group(23,10,.85);
box(shops,12,3.4,6,stone2,0,1.7,0);
for(const x of [-3.5,0,3.5]) box(shops,2.8,2.3,.1,glass,x,1.5,3.07,false);
box(shops,13,.3,7,roof,0,3.55,0);
// Shopfront canopies, entrance signage and seating.
for(const x of [-3.5,0,3.5]) {
 box(shops,3.2,.12,1.25,bronze,x,2.8,3.65);
 box(shops,1.1,.13,.8,stone,x,.45,4.5);
}
const parking=group(-23,11,.90);
box(parking,13,.12,7,paving,0,.1,0);
for(const x of [-5,-2,1,4]) box(parking,.08,.015,6,roof,x,.18,0,false);
for(const x of [-4.1,1.9]) vehicle(parking,x,0,carPaints[(x>0)?1:0],Math.PI/2);
// Name the amenities in the visitor's language so each shape is identifiable.
const amenities = [
 [pool,3.8,{fr:'PISCINE',en:'SWIMMING POOL',ar:'المسبح'}],
 [mosque,18,{fr:'MOSQUÉE',en:'MOSQUE',ar:'المسجد'}],
 [gardens,5,{fr:'JARDINS',en:'GARDENS',ar:'الحدائق'}],
 [sports,3.5,{fr:'TERRAIN DE SPORT',en:'SPORTS COURT',ar:'الملعب الرياضي'}],
 [tennis,3.5,{fr:'TENNIS',en:'TENNIS',ar:'ملعب التنس'}],
 [shops,5.5,{fr:'COMMERCES',en:'SHOPS',ar:'المحلات'}]
];
const labels=amenities.map(([parent,y,text])=>{
 const surface=document.createElement('canvas');surface.width=640;surface.height=128;
 const texture=new THREE.CanvasTexture(surface);texture.colorSpace=THREE.SRGBColorSpace;
 const material=new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true});
 const sprite=new THREE.Sprite(material);sprite.position.set(0,y,0);sprite.scale.set(13,2.6,1);sprite.renderOrder=10;parent.add(sprite);
 return {surface,texture,text};
});
function translateLabels(){for(const {surface,texture,text} of labels){
 const context=surface.getContext('2d');context.clearRect(0,0,640,128);context.fillStyle='#0b1825e8';context.fillRect(0,0,640,128);
 context.strokeStyle='#daba7a';context.lineWidth=4;context.strokeRect(2,2,636,124);context.fillStyle='#fff1d5';context.font='bold 40px Arial';context.textAlign='center';context.textBaseline='middle';
 context.direction=document.documentElement.lang==='ar'?'rtl':'ltr';context.fillText(text[document.documentElement.lang]||text.fr,320,66,610);texture.needsUpdate=true;
}}
translateLabels();new MutationObserver(translateLabels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
for(const item of animated) {
 const root=item.g;root.updateMatrixWorld(true);const inverse=new THREE.Matrix4().copy(root.matrixWorld).invert();const batches=new Map();const old=[];
 root.traverse(o=>{if(!o.isMesh)return;const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,o.matrixWorld));const list=batches.get(o.material)||[];list.push(g);batches.set(o.material,list);old.push(o)});
 for(const o of old){o.removeFromParent();o.geometry.dispose()}
 for(const [material,list]of batches){const combined=new THREE.BufferGeometry();for(const key of ['position','normal','uv']){if(!list.every(g=>g.getAttribute(key)))continue;const size=list[0].getAttribute(key).itemSize;const total=list.reduce((n,g)=>n+g.getAttribute(key).array.length,0);const values=new Float32Array(total);let offset=0;for(const g of list){values.set(g.getAttribute(key).array,offset);offset+=g.getAttribute(key).array.length}combined.setAttribute(key,new THREE.BufferAttribute(values,size))}const mesh=new THREE.Mesh(combined,material);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);list.forEach(g=>g.dispose())}
}
let raf=0, failed=false;
function update() {
 raf=0;
 const t=track.getBoundingClientRect(), p=pin.getBoundingClientRect();
 if(t.bottom<0||t.top>innerHeight)return;
 const progress=reduced.matches||document.fullscreenElement===pin?1:clamp((p.top-t.top)/Math.max(1,t.height-p.height));
 let placed=0, complete=true;
 for(const a of animated) {
   const value=placement(progress,a.stage);
   a.g.position.y=180*(1-value);a.g.visible=true;
   if(value<1)complete=false;
   if(value===1&&a.stage<.56)placed++;
 }
 controls.setEnabled(complete);
 if(count) count.textContent=placed;
 pin.style.setProperty('--plan-progress',progress);
 const horizontal=Math.cos(view.pitch)*view.distance;
 camera.position.set(view.x+Math.sin(view.yaw)*horizontal,5+Math.sin(view.pitch)*view.distance,view.z+Math.cos(view.yaw)*horizontal);
 camera.lookAt(view.x,5,view.z);
 renderer.render(scene,camera);
}
function queue(){if(!raf&&!failed) raf=requestAnimationFrame(update);}
function resize(){
 if(failed)return;
 track.style.setProperty('--plan-header',`${header?.offsetHeight||80}px`);
 const rect=canvas.getBoundingClientRect();
 if(rect.width<2||rect.height<2)return;
 renderer.setSize(rect.width,rect.height,false);
 camera.aspect=rect.width/rect.height;
 camera.fov=rect.width<650?52:35;
 camera.updateProjectionMatrix();queue();
}
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failed=true;});
canvas.addEventListener('webglcontextrestored',()=>{failed=false;resize();});
track.classList.add('is-explorable');
track.classList.toggle('is-animated',!reduced.matches);
const controls=attachDistrictControls(canvas,pin,queue);
const view=controls.view;
reduced.addEventListener('change',()=>{track.classList.toggle('is-animated',!reduced.matches);resize();});
window.addEventListener('scroll',queue,{passive:true});
window.addEventListener('resize',resize,{passive:true});
document.addEventListener('fullscreenchange',resize);
if(typeof ResizeObserver!=='undefined') new ResizeObserver(resize).observe(pin);
resize();

}
const original=document.querySelector('#plan-residence');
const collection=document.createElement('div');collection.className='demo-collection';
const chooser=document.createElement('nav');chooser.className='demo-chooser wrap';chooser.setAttribute('aria-label','360° demos');
const catalogCopy={fr:{open:'Découvrir le projet',note:'DÉMO · CONCEPT ILLUSTRATIF',placed:'Résidences en place',hint:'Défilez pour assembler le projet, puis explorez à 360°.'},en:{open:'Explore the project',note:'DEMO · ILLUSTRATIVE CONCEPT',placed:'Residences in place',hint:'Scroll to assemble the project, then explore in 360°.'},ar:{open:'اكتشف المشروع',note:'ديمو · تصور توضيحي',placed:'المساكن في مكانها',hint:'مرّر لتجميع المشروع، ثم استكشف بزاوية 360°.'}};
const sections=demos.map((demo,i)=>{
 const card=document.createElement('a');card.href='#demo-'+demo.id;card.className='demo-choice';
 card.innerHTML=`<span class="demo-choice-number">0${i+1} / 04</span><div class="demo-miniature ${demo.kind}" aria-hidden="true">${Array.from({length:6},(_,n)=>`<i style="--floors:${isVilla(demo,n*2)?2:demo.floors[n*2]};--facade:${demo.stone};--accent:${demo.accent}"></i>`).join('')}</div><small></small><h2></h2><p></p><span class="demo-choice-action"></span>`;
 chooser.append(card);
 const section=document.createElement('section');section.className='residence-plan wrap demo-section';section.id='demo-'+demo.id;
 section.setAttribute('aria-labelledby',section.id+'-title');
 section.innerHTML=`<div class="section-intro"><div><p class="eyebrow">CLÉNORD · DEMO 0${i+1}</p><h2 id="${section.id}-title"></h2></div><p class="demo-description"></p></div><p class="demo-assembly-hint"></p><div class="plan-track"><div class="plan-pin"><canvas id="${demo.id}-canvas"></canvas><div class="plan-caption"><span class="demo-placed"></span><strong><span class="demo-count">0</span> / 12</strong></div><div class="plan-progress" aria-hidden="true"></div></div></div><p class="demo-note"></p>`;
 const track=section.querySelector('.plan-track');track.classList.add('is-explorable');track.classList.toggle('is-animated',!matchMedia('(prefers-reduced-motion: reduce)').matches);
 collection.append(section);return {demo,card,section};
});
original.replaceWith(chooser,collection);
function translateCollection(){
 const lang=document.documentElement.lang;const t=catalogCopy[lang]||catalogCopy.fr;
 for(const {demo,card,section} of sections){
  const name=demo.name[lang]||demo.name.fr,copy=demo.copy[lang]||demo.copy.fr;
  card.querySelector('h2').textContent=name;card.querySelector('p').textContent=copy;card.querySelector('small').textContent=t.note;card.querySelector('.demo-choice-action').textContent=t.open+' ↗';
  section.querySelector('h2').textContent=name;section.querySelector('.demo-description').textContent=copy;section.querySelector('.demo-note').textContent=t.note;section.querySelector('.demo-placed').textContent=t.placed;section.querySelector('.demo-assembly-hint').textContent=t.hint;
 }
}
translateCollection();new MutationObserver(translateCollection).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
// Initialise only near the viewport, so browsing the catalogue does not build four scenes at once.
function start(section){const item=sections.find(item=>item.section===section);const track=section.querySelector('.plan-track');buildDistrict(section.querySelector('canvas'),track,section.querySelector('.plan-pin'),section.querySelector('.demo-count'),item.demo);}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);start(entry.target);}},{rootMargin:'400px'});sections.forEach(({section})=>observer.observe(section));}
else sections.forEach(({section})=>start(section));
