export const demos = [
  {id:'urban',kind:'apartments',floors:[6,7,6,8,7,6,5,6,5,6,5,5],stone:'#dfd5c4',accent:'#c9b79b',grass:'#527765',water:'#159eb9',name:{fr:'01 · Résidence urbaine',en:'01 · Urban residence',ar:'01 · إقامة حضرية'},copy:{fr:'12 immeubles, piscine collective, commerces et jardins. Un quartier résidentiel structuré autour de ses espaces partagés.',en:'12 apartment buildings, a shared pool, shops and gardens around a landscaped neighbourhood.',ar:'12 عمارة ومسبح مشترك ومحلات وحدائق، موزعة داخل مجمع سكني منظم.'}},
  {id:'gardens',kind:'villas',floors:[],stone:'#f1e7d5',accent:'#b99c7c',grass:'#598461',water:'#139fb6',name:{fr:'02 · Villas & jardins',en:'02 · Villas & gardens',ar:'02 · فيلات وحدائق'},copy:{fr:'12 villas à deux niveaux avec jardins privés et petits bassins. Une piscine commune et des loisirs complètent le domaine.',en:'12 two-storey villas with private gardens and plunge pools, plus a shared pool and leisure facilities.',ar:'12 فيلا من طابقين بحدائق وأحواض خاصة، مع مسبح جماعي ومرافق للترفيه.'}},
  {id:'terraces',kind:'terraces',floors:[3,4,3,4,3,4,3,3,4,3,4,3],stone:'#eee5da',accent:'#ba7656',grass:'#78856a',water:'#208ca5',name:{fr:'03 · Les terrasses',en:'03 · The terraces',ar:'03 · إقامة الشرفات'},copy:{fr:'12 petits immeubles de 3 à 4 niveaux, toitures aménagées et pergolas. Une architecture basse aux accents de terre cuite.',en:'12 low-rise buildings of 3–4 storeys, rooftop terraces and pergolas with terracotta accents.',ar:'12 بناية منخفضة من 3 إلى 4 طوابق، بشرفات فوق السطح ومظلات وألوان ترابية.'}},
  {id:'mixed',kind:'mixed',floors:[8,7,8,7,8,7,2,2,2,2,2,2],stone:'#d9e3df',accent:'#637f7b',grass:'#4f7862',water:'#159fb8',name:{fr:'04 · Le domaine mixte',en:'04 · The mixed estate',ar:'04 · المجمع المتنوع'},copy:{fr:'6 immeubles en fond de parcelle et 6 villas au premier plan, avec piscine et équipements communs.',en:'6 apartment buildings at the rear and 6 villas in front, with a pool and shared amenities.',ar:'6 عمارات في الخلف و6 فيلات في الواجهة، مع مسبح ومرافق مشتركة.'}}
];

export const isVilla = (demo,index) => demo.kind === 'villas' || (demo.kind === 'mixed' && index >= 6);
export const parcel = index => ({x:[-31,-20,-9,9,20,31][index%6],z:index<6?-23:22});
export const poolBounds = {x:24,z:0,width:19,depth:14};
export const boulevardBounds = {x:0,z:-11,width:84,depth:6};
export function overlaps(a,b) {
  return Math.abs(a.x-b.x)<(a.width+b.width)/2 && Math.abs(a.z-b.z)<(a.depth+b.depth)/2;
}
