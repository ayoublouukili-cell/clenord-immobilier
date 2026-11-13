const projectCopy = {
  fr: {home:'Accueil',projects:'Projets 360°',title:'Explorez nos projets à 360°.',intro:'Défilez pour voir le quartier se construire. Une fois tous les éléments au sol, tournez, zoomez et explorez librement.',back:'← Retour à l’accueil',planLabel:'PLAN D’ENSEMBLE',planTitle:'La résidence prend forme.',planIntro:'Douze immeubles et leurs espaces partagés. Suivez leur arrivée au sol, puis prenez le contrôle de la visite.',planBuildings:'Immeubles en place',planNote:'Concept résidentiel fictif · visualisation 3D illustrative'},
  en: {home:'Home',projects:'360° projects',title:'Explore our projects in 360°.',intro:'Scroll to assemble the district. Once everything is on the ground, rotate, zoom and explore freely.',back:'← Back to home',planLabel:'SITE PLAN',planTitle:'The residence takes shape.',planIntro:'Twelve buildings and shared amenities. Watch them land, then take control of the view.',planBuildings:'Buildings in place',planNote:'Fictional residential concept · illustrative 3D visualization'},
  ar: {home:'الرئيسية',projects:'مشاريع 360°',title:'اكتشف مشاريعنا بزاوية 360°.',intro:'مرّر لرؤية المجمع يتشكّل. بعد نزول جميع العناصر إلى الأرض، يمكنك الدوران والتقريب والتحريك بحرية.',back:'العودة إلى الرئيسية ←',planLabel:'المخطط العام',planTitle:'المجمع السكني يأخذ شكله.',planIntro:'اثنا عشر مبنى ومرافق مشتركة. شاهد نزولها إلى الأرض ثم تحكّم في المشهد.',planBuildings:'المباني في مكانها',planNote:'تصور سكني افتراضي · عرض ثلاثي الأبعاد توضيحي'}
};
const stored = key => {try {return localStorage.getItem('clenord.'+key);} catch {return null;}};
const save = (key,value) => {try {localStorage.setItem('clenord.'+key,value);} catch {}};
const root = document.documentElement;
const language = document.querySelector('#language');
const theme = document.querySelector('#theme');
function translateProjects() {
  const lang = language.value;
  const text = projectCopy[lang] || projectCopy.fr;
  root.lang = lang;root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  save('lang',lang);
  document.title = text.projects+' — Clénord Immobilier';
  document.querySelectorAll('[data-project], [data-t]').forEach(node=>{const value=text[node.dataset.project || node.dataset.t];if(value)node.textContent=value;});
  theme.textContent = root.dataset.theme === 'light' ? '☾' : '☀';
  theme.setAttribute('aria-label',lang==='ar'?'تغيير المظهر':lang==='en'?'Change theme':'Changer le thème');
  document.querySelector('#menu').setAttribute('aria-label',lang==='ar'?'القائمة':'Menu');
}
language.value = projectCopy[stored('lang')] ? stored('lang') : 'fr';
root.dataset.theme = stored('theme') === 'light' ? 'light' : 'dark';
language.addEventListener('change',translateProjects);
theme.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';save('theme',root.dataset.theme);translateProjects();});
document.querySelector('#menu').addEventListener('click',e=>{const open=document.querySelector('#navigation').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));});
translateProjects();
