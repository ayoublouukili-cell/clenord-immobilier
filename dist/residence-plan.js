import {attachDistrictControls} from './district-controls.mjs';
import {placement} from './district-motion.mjs';
import * as THREE from './vendor/three-0.160.1.min.js';

function buildDistrict(canvas,track,pin,count,villas=false) {
const header = document.querySelector('#header');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = x => Math.min(1, Math.max(0, x));
const ease = x => { x = clamp(x); return x*x*(3-2*x); };
const mat = (color, roughness = .8, metalness = 0) => new THREE.MeshStandardMaterial({color, roughness, metalness});
const stone = mat('#dfd5c4'), stone2 = mat('#c9b79b'), glass = mat('#517f8a', .22, .24), dark = mat('#263746'), gold = mat('#bca47a', .4, .4), roof = mat('#f1e7d5'), road = mat('#46555a'), paving = mat('#9d9d91'), grass = mat('#527765'), water = mat('#4dabb7', .16, .1), trunk = mat('#685342'), leaves = mat('#477259');
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
box(world, 72,.05,7,road,0,-.1,-2,false);
box(world, 8,.06,59,road,0,-.07,0,false);
for (const x of [-30,-21,-12,12,21,30]) {
  box(world, 7,.07,1.5,paving,x,-.05,-7,false);
  box(world, 7,.07,1.5,paving,x,-.05,3,false);
}
// Road markings and landscaped boulevard edges are fixed to the ground.
for (let x=-32;x<=32;x+=8) box(world,3.4,.015,.1,asphaltMark,x,-.052,-2,false);
for (const z of [-5.75,1.75]) box(world,72,.025,.12,stone2,0,-.045,z,false);
for (const x of [-4.2,4.2]) box(world,.12,.025,58,stone2,x,-.035,0,false);
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
for(const x of [-33,-25,-17,17,25,33]) {lamp(world,x,-6.4);lamp(world,x,5.3);}
vehicle(world,-16,-2,carPaints[0]);
vehicle(world,18,-2,carPaints[1],Math.PI);
vehicle(world,2,12,carPaints[2],Math.PI/2);
for (let i=0;i<12;i++) {
 const x = [-31,-20,-9,9,20,31][i%6];
 const z = i<6 ? -20 : 19;
 const floors = [6,7,6,8,7,6,5,6,5,6,5,5][i];
 const g=group(x,z,.025+i*.043,i);
 g.scale.x=[1,.94,1.04][i%3];
 if(villas){
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
// Pool is a physical water surface with a border and a deck.
const pool=group(22,0,.63);
box(pool,17,.18,9,stone2,0,.12,0);
box(pool,15,.09,7,water,0,.25,0,false);
for(let k=0;k<8;k++) box(pool,12-k*.55,.012,.025,roof,0,.31,-2.8+k*.78,false);
for(const x of [-7.9,7.9]) box(pool,.35,.4,9,roof,x,.32,0);
for(const z of [-4.2,4.2]) box(pool,16,.4,.35,roof,0,.32,z);
for(const x of [-5,0,5]) { box(pool,2,.14,.8,roof,x,.2,6); box(pool,.13,1.6,.13,gold,x,.9,5.7); }
// Sun loungers and planting beds frame the pool as a residential amenity.
for(const x of [-6,-2,2,6]) {
 box(pool,1.35,.13,2.3,roof,x,.28,-5.9);
 box(pool,1.35,.72,.13,stone2,x,.64,-6.9);
}
for(const x of [-8.5,8.5]) {
 for(const z of [-3,0,3]) {
  cyl(pool,.12,.15,1.3,trunk,x,.65,z);
  const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.62,1),leaves);
  crown.position.set(x,1.6,z);pool.add(crown);
 }
}
// Gardens, trees and paths descend with the neighborhood.
const gardens=group(0,11,.70);
box(gardens,17,.13,12,grass,0,.05,0);
for(const x of [-6,0,6]) box(gardens,1.1,.14,12,paving,x,.13,0,false);
for(let i=0;i<18;i++) {
 const x=-7+(i%6)*2.8, z=-4.5+Math.floor(i/6)*4.5;
 cyl(gardens,.15,.21,1.8,trunk,x,1,z);
 const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.95+(i%3)*.13,1),leaves);
 crown.position.set(x,2.45,z); crown.castShadow=true; gardens.add(crown);
}
const sports=group(-16,35,.76);
box(sports,16,.13,8,mat('#577d83'),0,.12,0);
box(sports,.12,.025,8,roof,0,.21,0,false);
for(const x of [-7.8,7.8]) box(sports,.12,2.1,4,roof,x,1.1,0);
// Painted multisport pitch markings and goals.
for(const z of [-3.7,3.7]) box(sports,15,.018,.08,roof,0,.22,z,false);
for(const x of [-7.5,7.5]) {
 box(sports,.08,.018,7.4,roof,x,.22,0,false);
 box(sports,.1,1.5,2.2,roof,x,1.0,0,false);
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
const original=document.querySelector('#residenceCanvas');
const firstTrack=original.closest('.plan-track');
const villaSection=document.createElement('section');villaSection.className='residence-plan wrap';villaSection.id='villaDistrict';
villaSection.innerHTML='<div class="section-intro"><div><p class="eyebrow">CLÉNORD · GARDEN COLLECTION</p><h2 data-villa-title></h2></div><p data-villa-copy></p></div><div class="plan-track"><div class="plan-pin"><canvas aria-label="Villa district 3D"></canvas><div class="plan-caption"><span data-villa-label></span><strong><span class="villa-count">0</span> / 12</strong></div><div class="plan-progress"></div></div></div><p data-villa-note></p>';
original.closest('section').after(villaSection);
const villaText={fr:['Les jardins de Clénord.','Douze villas, jardins privatifs, bassins et équipements de proximité. Une composition résidentielle à découvrir au fil du scroll.','Villas en place','Concept résidentiel fictif · visualisation 3D illustrative'],en:['The gardens of Clénord.','Twelve villas, private gardens, pools and shared amenities. Explore the entire district in 360?: rotate, zoom and pan freely.','Villas placed','Fictional residential concept · illustrative 3D visualization'],ar:['حدائق كلينورد.','اثنتا عشرة فيلا وحدائق خاصة ومسابح ومرافق مشتركة. اكتشف المجمع مع التمرير.','الفيلات في مكانها','تصور سكني افتراضي · عرض ثلاثي الأبعاد توضيحي']};
function translateVillas(){const t=villaText[document.documentElement.lang]||villaText.fr;['title','copy','label','note'].forEach((k,i)=>villaSection.querySelector('[data-villa-'+k+']').textContent=t[i])}
translateVillas();new MutationObserver(translateVillas).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
buildDistrict(original,firstTrack,firstTrack.querySelector('.plan-pin'),document.querySelector('#planCount'));
buildDistrict(villaSection.querySelector('canvas'),villaSection.querySelector('.plan-track'),villaSection.querySelector('.plan-pin'),villaSection.querySelector('.villa-count'),true);
