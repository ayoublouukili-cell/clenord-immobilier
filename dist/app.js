const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const translations = {
  fr: {
    navModels:"Visite immersive", modelKicker:"VISITE IMMERSIVE · TANGER", modelTitle:"Entrez, explorez, prenez votre temps.",
    modelIntro:"Faites glisser la vue pour regarder autour de vous, puis passez librement d’une pièce à l’autre.",
    modelVilla:"Villa", modelHouse:"Maison", modelApartmentChoice:"Appartement", planNav:"Projets 360\u00b0", planLabel:"PLAN D’ENSEMBLE", planTitle:"La résidence prend forme.", planIntro:"Explorez les douze immeubles et les espaces communs en 360\u00b0 : rotation, zoom et d\u00e9placement libres.", planBuildings:"Immeubles en place", planNote:"Quartier fictif en 3D procédurale — rendu architectural en cours de validation.",
    tourLabel:"VILLA CONTEMPORAINE · DÉMONSTRATION", tourVilla:"Une villa à découvrir de l’intérieur.", tourOpen:"Entrer dans la villa", villaTerrace:"La terrasse", villaGarden:"Le jardin", villaScroll:"Défilez pour vous approcher ↓", tourHint:"Glissez pour regarder autour de vous · sélectionnez une pièce pour y entrer", tourNotice:"Visuels d’ambiance générés, visite de démonstration", tourDialogKicker:"VISITE IMMERSIVE · VILLA DE DÉMONSTRATION", tourDialogTitleText:"Explorez chaque pièce", tourDrag:"Glissez pour tourner à 360°", tourDisclaimer:"Images d’ambiance générées pour cette démonstration. Demandez à l’agence une visite réelle des biens disponibles.",
    modelChoice:"Choisir une maquette", modelVilla:"Villa", modelApartment:"Appartements", modelExample:"Maquettes d’illustration",
    modelView:"VUE EXTÉRIEURE", modelVillaName:"Villa contemporaine", modelApartmentName:"Résidence d’appartements",
    modelHint:"Déplacez la souris sur la maquette ou faites-la glisser au doigt.", modelFallback:"Vue 3D indisponible dans ce navigateur. Photo d’illustration.",
    modelControls:"Commandes de rotation", modelLeft:"Tourner à gauche", modelRight:"Tourner à droite", modelReset:"Recentrer",
    skip:"Aller au contenu", navResidences:"Résidences", navProperties:"Nos biens", navAgency:"L’agence", navContact:"Contact",
    heroLabel:"TANGER, MAROC", heroOne:"Tanger,", heroTwo:"à vivre autrement.", heroText:"Achat, vente, location et gestion immobilière à Tanger.",
    heroCta:"Explorer les résidences", scroll:"DÉFILER POUR EXPLORER", illustration:"Photographie d’illustration",
    sceneKicker:"RÉSIDENCES", sceneTitle:"Trois façons de vivre à Tanger", sceneIntro:"Du calme d’une villa aux rues animées du centre, explorez trois styles de vie.",
    catalogKicker:"ACHAT & LOCATION", catalogTitle:"Trouvez votre prochain bien", catalogIntro:"Ces annonces illustrent le catalogue. Contactez l’agence pour connaître les biens disponibles.",
    transaction:"Transaction", type:"Type de bien", district:"Quartier", favorites:"Favoris", reset:"Réinitialiser",
    agencyKicker:"CLÉNORD IMMOBILIER · TANGER", agencyTitle:"Votre projet immobilier à Tanger",
    agencyText:"Vous cherchez un bien, vous envisagez de vendre ou vous souhaitez déléguer sa gestion ? Parlez de votre projet avec Adil Benjana, directeur de l’agence.",
    contactKicker:"CONTACT", contactTitle:"Parlons de votre projet.", whatsapp:"Écrire sur WhatsApp", footer:"Tanger, Maroc · Site réalisé par MAYD DIGITAL", backTop:"Retour en haut",
    language:"Langue", light:"Activer le mode clair", dark:"Activer le mode sombre", menu:"Menu", close:"Fermer", navigation:"Navigation",
    all:"Tous", sale:"À vendre", rent:"À louer", villa:"Villa", house:"Maison", penthouse:"Penthouse", apartment:"Appartement", duplex:"Duplex", studio:"Studio",
    photos:"Voir les biens", demo:"ANNONCE D’EXEMPLE", detail:"Voir la fiche", rooms:"ch.", month:"/ mois", unit:"m²", currency:"DH",
    findSimilar:"Demander un bien similaire", empty:"Aucun bien ne correspond à ces filtres.", emptySaved:"Aucun favori ne correspond à ces filtres.",
    count:n => n === 1 ? "1 bien d’exemple" : n + " biens d’exemple", save:"Ajouter aux favoris", unsave:"Retirer des favoris",
    hello:"Bonjour Clénord Immobilier, je souhaite discuter de mon projet immobilier à Tanger.",
    similar:(type,district,kind) => `Bonjour Clénord Immobilier, avez-vous un bien de type ${type.toLowerCase()} ${kind === "sale" ? "à vendre" : "à louer"} dans le secteur ${district} à Tanger ?`,
    services:["Achat","Vente","Location","Gestion immobilière"],
    serviceText:name => `Bonjour Clénord Immobilier, je souhaite des renseignements au sujet de votre service « ${name} » à Tanger.`
  },
  en: {
    navModels:"Immersive tour", modelKicker:"IMMERSIVE TOUR · TANGIER", modelTitle:"Step inside. Explore at your pace.",
    modelIntro:"Drag the view to look around, then move freely from one room to another.",
    modelVilla:"Villa", modelHouse:"House", modelApartmentChoice:"Apartment", planNav:"360\u00b0 projects", planLabel:"SITE PLAN", planTitle:"The residence takes shape.", planIntro:"Explore twelve buildings and the amenities in 360\u00b0. Drag to rotate, zoom and pan freely.", planBuildings:"Buildings in place", planNote:"Fictional procedural 3D district — architectural rendering under review.",
    tourLabel:"CONTEMPORARY VILLA · DEMO", tourVilla:"Discover a villa from the inside.", tourOpen:"Enter the villa", villaTerrace:"The terrace", villaGarden:"The garden", villaScroll:"Scroll to approach ↓", tourHint:"Drag to look around · choose a room to step inside", tourNotice:"Generated concept visuals · demonstration tour", tourDialogKicker:"IMMERSIVE TOUR · DEMONSTRATION VILLA", tourDialogTitleText:"Explore every room", tourDrag:"Drag to look around in 360°", tourDisclaimer:"Concept images generated for this demonstration. Contact the agency to arrange a real viewing of available properties.",
    modelChoice:"Choose a model", modelVilla:"Villa", modelApartment:"Apartments", modelExample:"Illustrative models",
    modelView:"EXTERIOR VIEW", modelVillaName:"Contemporary villa", modelApartmentName:"Apartment residence",
    modelHint:"Move your mouse over the model or drag it with your finger.", modelFallback:"3D view unavailable in this browser. Illustrative photograph.",
    modelControls:"Rotation controls", modelLeft:"Rotate left", modelRight:"Rotate right", modelReset:"Reset view",
    skip:"Skip to content", navResidences:"Residences", navProperties:"Properties", navAgency:"The agency", navContact:"Contact",
    heroLabel:"TANGIER, MOROCCO", heroOne:"Tangier,", heroTwo:"a new way to live.", heroText:"Buying, selling, renting and property management in Tangier.",
    heroCta:"Explore residences", scroll:"SCROLL TO EXPLORE", illustration:"Illustrative photography",
    sceneKicker:"RESIDENCES", sceneTitle:"Three ways to live in Tangier", sceneIntro:"From quiet villas to lively city streets, discover three ways to make Tangier home.",
    catalogKicker:"BUY & RENT", catalogTitle:"Find your next property", catalogIntro:"These listings show how the catalog works. Contact the agency for available properties.",
    transaction:"Transaction", type:"Property type", district:"Neighborhood", favorites:"Favorites", reset:"Reset filters",
    agencyKicker:"CLÉNORD IMMOBILIER · TANGIER", agencyTitle:"Your property plans in Tangier",
    agencyText:"Looking for a property, planning to sell or need help managing it? Discuss your plans with Adil Benjana, the agency’s director.",
    contactKicker:"CONTACT", contactTitle:"Let’s talk about your plans.", whatsapp:"Message us on WhatsApp", footer:"Tangier, Morocco · Website by MAYD DIGITAL", backTop:"Back to top",
    language:"Language", light:"Switch to light mode", dark:"Switch to dark mode", menu:"Menu", close:"Close", navigation:"Navigation",
    all:"All", sale:"For sale", rent:"For rent", villa:"Villa", house:"House", penthouse:"Penthouse", apartment:"Apartment", duplex:"Duplex", studio:"Studio",
    photos:"Explore properties", demo:"SAMPLE LISTING", detail:"View details", rooms:"beds", month:"/ month", unit:"m²", currency:"MAD",
    findSimilar:"Ask about similar properties", empty:"No properties match these filters.", emptySaved:"No favorites match these filters.",
    count:n => n === 1 ? "1 sample property" : n + " sample properties", save:"Add to favorites", unsave:"Remove from favorites",
    hello:"Hello Clénord Immobilier, I’d like to discuss my property plans in Tangier.",
    similar:(type,district,kind) => `Hello Clénord Immobilier, do you have a property of type ${type.toLowerCase()} ${kind === "sale" ? "for sale" : "for rent"} in the ${district} area of Tangier?`,
    services:["Buying","Selling","Rentals","Property management"],
    serviceText:name => `Hello Clénord Immobilier, I’d like to learn more about your ${name.toLowerCase()} service in Tangier.`
  },
  ar: {
    navModels:"جولة غامرة", modelKicker:"جولة غامرة · طنجة", modelTitle:"ادخل واستكشف على راحتك.",
    modelIntro:"اسحب المشهد للنظر حولك، ثم انتقل بحرية بين الغرف.",
    modelVilla:"فيلا", modelHouse:"منزل", modelApartmentChoice:"شقة", planNav:"\u0645\u0634\u0627\u0631\u064a\u0639 360\u00b0", planLabel:"المخطط العام", planTitle:"المجمع السكني يأخذ شكله.", planIntro:"\u0627\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u0645\u062c\u0645\u0639 \u0628\u0632\u0627\u0648\u064a\u0629 360\u00b0. \u0627\u0633\u062d\u0628 \u0644\u0644\u062f\u0648\u0631\u0627\u0646 \u0648\u0627\u0644\u062a\u0642\u0631\u064a\u0628 \u0648\u0627\u0644\u062a\u062d\u0631\u064a\u0643.", planBuildings:"المباني في مكانها", planNote:"حي افتراضي ثلاثي الأبعاد — العرض المعماري قيد المراجعة.",
    tourLabel:"فيلا عصرية · جولة تجريبية", tourVilla:"اكتشف الفيلا من الداخل.", tourOpen:"ادخل الفيلا", villaTerrace:"الشرفة", villaGarden:"الحديقة", villaScroll:"مرّر للاقتراب ↓", tourHint:"اسحب للنظر حولك · اختر غرفة للدخول إليها", tourNotice:"صور تصورية مولدة · جولة تجريبية", tourDialogKicker:"جولة غامرة · فيلا تجريبية", tourDialogTitleText:"اكتشف كل غرفة", tourDrag:"اسحب للنظر بزاوية ٣٦٠°", tourDisclaimer:"صور تصورية مولدة لهذه التجربة. تواصل مع الوكالة لتنظيم زيارة حقيقية للعقارات المتاحة.",
    modelChoice:"اختر مجسمًا", modelVilla:"فيلا", modelApartment:"شقق", modelExample:"مجسمات توضيحية",
    modelView:"منظر خارجي", modelVillaName:"فيلا عصرية", modelApartmentName:"مبنى سكني",
    modelHint:"حرّك المؤشر فوق المجسم أو اسحبه بإصبعك.", modelFallback:"العرض ثلاثي الأبعاد غير متاح في هذا المتصفح. صورة توضيحية.",
    modelControls:"أزرار التدوير", modelLeft:"تدوير إلى اليسار", modelRight:"تدوير إلى اليمين", modelReset:"إعادة ضبط العرض",
    skip:"انتقل إلى المحتوى", navResidences:"المساكن", navProperties:"العقارات", navAgency:"الوكالة", navContact:"تواصل معنا",
    heroLabel:"طنجة، المغرب", heroOne:"طنجة،", heroTwo:"بأسلوب حياة جديد.", heroText:"شراء وبيع وتأجير وإدارة العقارات في طنجة.",
    heroCta:"استكشف المساكن", scroll:"مرّر للاستكشاف", illustration:"صورة توضيحية",
    sceneKicker:"المساكن", sceneTitle:"ثلاث طرق للعيش في طنجة", sceneIntro:"من هدوء الفيلات إلى حيوية وسط المدينة، اكتشف ثلاثة أساليب للعيش في طنجة.",
    catalogKicker:"شراء وإيجار", catalogTitle:"اعثر على عقارك القادم", catalogIntro:"هذه إعلانات توضيحية للكتالوج. تواصل مع الوكالة لمعرفة العقارات المتاحة.",
    transaction:"نوع المعاملة", type:"نوع العقار", district:"الحي", favorites:"المفضلة", reset:"إعادة ضبط الفلاتر",
    agencyKicker:"كلينورد العقارية · طنجة", agencyTitle:"مشروعك العقاري في طنجة",
    agencyText:"هل تبحث عن عقار أو تفكر في البيع أو ترغب في تفويض إدارته؟ تحدث عن مشروعك مع عادل بن جانة، مدير الوكالة.",
    contactKicker:"التواصل", contactTitle:"لنتحدث عن مشروعك.", whatsapp:"راسلنا على واتساب", footer:"طنجة، المغرب · تصميم الموقع MAYD DIGITAL", backTop:"العودة إلى الأعلى",
    language:"اللغة", light:"تفعيل الوضع الفاتح", dark:"تفعيل الوضع الداكن", menu:"القائمة", close:"إغلاق", navigation:"التنقل",
    all:"الكل", sale:"للبيع", rent:"للإيجار", villa:"فيلا", house:"منزل", penthouse:"بنتهاوس", apartment:"شقة", duplex:"دوبلكس", studio:"استوديو",
    photos:"استكشف العقارات", demo:"إعلان توضيحي", detail:"عرض التفاصيل", rooms:"غرف نوم", month:"/ شهريًا", unit:"م²", currency:"درهم",
    findSimilar:"استفسر عن عقارات مشابهة", empty:"لا توجد عقارات تطابق هذه الفلاتر.", emptySaved:"لا توجد عقارات مفضلة تطابق هذه الفلاتر.",
    count:n => n === 1 ? "عقار توضيحي واحد" : n + " عقارات توضيحية", save:"أضف إلى المفضلة", unsave:"أزل من المفضلة",
    hello:"مرحبًا كلينورد العقارية، أود التحدث عن مشروعي العقاري في طنجة.",
    similar:(type,district,kind) => `مرحبًا كلينورد العقارية، هل يتوفر لديكم عقار من نوع ${type} ${kind === "sale" ? "للبيع" : "للإيجار"} في حي ${district} بطنجة؟`,
    services:["الشراء","البيع","التأجير","إدارة العقارات"],
    serviceText:name => `مرحبًا كلينورد العقارية، أود الاستفسار عن خدمة ${name} في طنجة.`
  }
};
const districts = {
  malabata:["Malabata","Malabata","مالاباطا"], vieille:["Vieille Montagne","Vieille Montagne","الجبل الكبير"],
  centre:["Centre-ville","City center","وسط المدينة"], iberia:["Iberia","Iberia","إيبيريا"], achakkar:["Achakkar","Achakkar","أشقار"]
};
const scenes = [
  {type:"apartment", image:"apartment", position:"center 57%", tab:["Le littoral","The coast","الساحل"], title:["Face à la mer","By the sea","على واجهة البحر"], copy:["Des appartements ouverts sur la lumière du littoral.","Apartments that open up to the light of the coast.","شقق مفتوحة على ضوء الساحل."]},
  {type:"villa", image:"villa", position:"center 52%", tab:["Les hauteurs","The hills","المرتفعات"], title:["Au calme, en hauteur","A quieter hillside","هدوء المرتفعات"], copy:["Des villas où les espaces de vie se prolongent à l’extérieur.","Villas with living spaces that extend outdoors.","فيلات تمتد فيها مساحات المعيشة إلى الخارج."]},
  {type:"duplex", image:"duplex", position:"center 53%", tab:["La ville","The city","المدينة"], title:["Au cœur de la ville","In the heart of town","في قلب المدينة"], copy:["Des adresses proches des commerces et de la vie de quartier.","Homes close to shops and the daily life of the city.","مساكن قريبة من المتاجر وحياة الأحياء."]}
];
const properties = [
  {id:"malabata",kind:"sale",type:"apartment",area:"malabata",image:"apartment",size:112,rooms:2,price:1950000,title:["Appartement avec terrasse","Apartment with terrace","شقة مع تراس"],copy:["Un séjour lumineux ouvert sur la terrasse et deux chambres séparées.","A bright living room opening onto the terrace and two separate bedrooms.","غرفة معيشة مشرقة تفتح على التراس وغرفتا نوم مستقلتان."]},
  {id:"montagne",kind:"sale",type:"villa",area:"vieille",image:"villa",size:345,rooms:4,price:6500000,title:["Villa contemporaine","Contemporary villa","فيلا عصرية"],copy:["Des pièces de réception ouvertes sur le jardin et quatre chambres.","Reception rooms opening onto the garden and four bedrooms.","غرف استقبال تفتح على الحديقة وأربع غرف نوم."]},
  {id:"centre",kind:"rent",type:"studio",area:"centre",image:"studio",size:54,rooms:1,price:5500,title:["Studio meublé en ville","Furnished city studio","استوديو مفروش في المدينة"],copy:["Un espace meublé avec cuisine ouverte, proche des commerces.","A furnished space with an open kitchen, near local shops.","مساحة مفروشة بمطبخ مفتوح وقريبة من المتاجر."]},
  {id:"iberia",kind:"sale",type:"duplex",area:"iberia",image:"duplex",size:178,rooms:3,price:2790000,title:["Duplex à Iberia","Duplex in Iberia","دوبلكس في إيبيريا"],copy:["Des espaces de réception et des chambres répartis sur deux niveaux.","Reception rooms and bedrooms spread across two floors.","غرف استقبال وغرف نوم موزعة على طابقين."]},
  {id:"achakkar",kind:"rent",type:"villa",area:"achakkar",image:"house",size:250,rooms:4,price:22000,title:["Villa avec jardin","Villa with garden","فيلا مع حديقة"],copy:["Un jardin attenant au séjour et quatre chambres pour la vie de famille.","A garden adjoining the living room and four bedrooms for family life.","حديقة متصلة بغرفة المعيشة وأربع غرف نوم للعائلة."]},
  {id:"penthouse",kind:"sale",type:"apartment",area:"malabata",image:"penthouse",size:205,rooms:3,price:3850000,title:["Penthouse avec terrasse","Penthouse with terrace","بنتهاوس مع تراس"],copy:["Un appartement au dernier étage avec une terrasse accessible depuis le séjour.","A top-floor apartment with a terrace accessed from the living room.","شقة في الطابق الأخير مع تراس يمكن الوصول إليه من غرفة المعيشة."]}
];
const additions = [
 ['coast-suite','apartment','malabata','penthouse',138,3,2450000,['Appartement panorama','Panorama apartment','شقة بإطلالة واسعة']],
 ['city-house','house','centre','maison-facade',165,3,2100000,['Maison de caractère','Character home','منزل بطابع أصيل']],
 ['garden-house','house','achakkar','house',220,4,3200000,['Maison côté jardin','Garden house','منزل بجانب الحديقة']],
 ['roof-suite','penthouse','malabata','penthouse',240,3,4700000,['Penthouse lumière','Light-filled penthouse','بنتهاوس مشرق']],
 ['hill-roof','penthouse','vieille','duplex',195,3,3900000,['Dernier étage sur les hauteurs','Hilltop penthouse','بنتهاوس على المرتفعات']],
 ['studio-iberia','studio','iberia','studio',48,1,4800,['Pied-à-terre à Iberia','Iberia pied-à-terre','استوديو في إيبيريا']],
 ['studio-coast','studio','malabata','apartment',62,1,6500,['Studio côté mer','Seaside studio','استوديو بجانب البحر']],
 ['duplex-coast','duplex','malabata','duplex',188,3,3150000,['Duplex ouvert sur la lumière','Light-filled duplex','دوبلكس مشرق']],
 ['villa-horizon','villa','achakkar','hero',380,5,7200000,['Villa Horizon','Horizon Villa','فيلا الأفق']],
 ['villa-patio','villa','vieille','villa-cutout',290,4,5200000,['Villa Patio','Patio Villa','فيلا الفناء']]
];
for(const [id,type,area,image,size,rooms,price,title] of additions) properties.push({id,type,area,image,size,rooms,price,title,kind:type==='studio'?'rent':'sale',copy:['Exemple de présentation : volumes, lumière et cadre de vie. Disponibilité à confirmer auprès de l’agence.','Illustrative listing: space, light and lifestyle. Confirm availability with the agency.','عرض توضيحي للمساحات والضوء ونمط العيش. يرجى تأكيد التوفر مع الوكالة.']});
properties.splice(9);
const icons = {
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon:'<path d="M20.7 14.1A9 9 0 0 1 9.9 3.3a9 9 0 1 0 10.8 10.8Z"/>',
  menu:'<path d="M4 8h16M4 16h16"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">${icons[name]}</svg>`;
const languages = ["fr", "en", "ar"];
Object.assign(translations.fr, {
  projectsPreviewLabel:"UNE VISITE INTERACTIVE", projectsPreviewTitle:"Découvrez nos projets à 360°",
  projectsPreviewText:"Immeubles, villas, jardins et espaces communs : regardez le quartier prendre forme, puis explorez-le librement en 3D.",
  projectsPreviewCta:"Entrer dans les projets 360°", projectsPreviewNote:"Concepts résidentiels illustratifs · rotation et zoom"
});
Object.assign(translations.en, {
  projectsPreviewLabel:"AN INTERACTIVE VISIT", projectsPreviewTitle:"Discover our projects in 360°",
  projectsPreviewText:"Buildings, villas, gardens and shared spaces: watch the district take shape, then explore it freely in 3D.",
  projectsPreviewCta:"Explore the 360° projects", projectsPreviewNote:"Illustrative residential concepts · rotate and zoom"
});
Object.assign(translations.ar, {
  projectsPreviewLabel:"جولة تفاعلية", projectsPreviewTitle:"اكتشف مشاريعنا بزاوية 360°",
  projectsPreviewText:"مبانٍ وفيلات وحدائق ومرافق مشتركة: شاهد المجمع يتشكّل، ثم استكشفه بحرية في عرض ثلاثي الأبعاد.",
  projectsPreviewCta:"ادخل لاستكشاف مشاريع 360°", projectsPreviewNote:"تصورات سكنية توضيحية · دوران وتقريب"
});
const read = key => { try { return localStorage.getItem("clenord." + key); } catch { return null; } };
const write = (key, value) => { try { localStorage.setItem("clenord." + key, value); } catch {} };
let lang = languages.includes(read("lang")) ? read("lang") : "fr";
let theme = read("theme") === "light" ? "light" : "dark";
let storedFavorites;
try { storedFavorites = JSON.parse(read("favorites")); } catch {}
const favorites = new Set(Array.isArray(storedFavorites) ? storedFavorites : []);
const state = {transaction:"",type:"",district:"",favorites:false};
let selected = null;
let detailTrigger = null;
let t = translations[lang];
const tr = values => values[languages.indexOf(lang)];
const whatsapp = message => "https://wa.me/212763437500?text=" + encodeURIComponent(message);
const details = $("#details");
const waAttrs = 'target="_blank" rel="noopener"';
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const journey = $("#journey");
const sceneCut = $(".scene-cut", journey);
const architecture = $(".agency-photo");
const serviceImages = $$(".agency-gallery img");
const contactMedia = $(".contact-media");
const visiblePhotos = new Set();
const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries, observer) => {
  for (const {target, isIntersecting} of entries) {
    target.classList.toggle("is-shown", isIntersecting);
  }
}, {threshold:.12}) : null;
const photoObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
  for (const {target, isIntersecting} of entries) {
    if (isIntersecting) visiblePhotos.add(target);
    else visiblePhotos.delete(target);
  }
  queueMotion();
}, {rootMargin:"80px"}) : null;
let cardElements = [];
let sceneElements = [];
let sceneButtons = [];
let animationFrame = 0;
let activeScene = -1;
const clamp = value => Math.max(0, Math.min(1, value));

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('meta[name="theme-color"]').content = theme === "dark" ? "#0b1523" : "#f7f3ea";
  const button = $("#theme");
  const label = theme === "dark" ? t.light : t.dark;
  button.innerHTML = icon(theme === "dark" ? "sun" : "moon");
  button.setAttribute("aria-label", label);
  button.title = label;
}
function showScenes() {
  $("#scenes").innerHTML = scenes.map((scene,index) => `
    <article class="scene" style="z-index:${index + 1}">
      <img class="scene-photo" src="img/${scene.image}.webp" style="object-position:${scene.position}" alt="" decoding="async">
      <div class="scene-shade"></div>
      <div class="scene-copy wrap">
        <p class="eyebrow">${tr(scene.tab)}</p><h3>${tr(scene.title)}</h3><p>${tr(scene.copy)}</p>
        <a class="button scene-link" href="#biens" data-type="${scene.type}">${t.photos} <span class="arrow arrow-down" aria-hidden="true"></span></a>
      </div>
    </article>`).join("");
  $("#sceneRail").innerHTML = scenes.map((scene,index) => `<button type="button" data-scene="${index}">${tr(scene.tab)}</button>`).join("");
  sceneElements = $$(".scene", journey);
  sceneButtons = $$("#sceneRail button");
  activeScene = -1;
  updateMotion();
}
function filterOptions() {
  const options = {
    transaction:[["sale",t.sale],["rent",t.rent]],
    type:["apartment","villa","house","duplex","studio","penthouse"].map(type => [type,t[type]]),
    district:Object.entries(districts).map(([area, labels]) => [area,tr(labels)])
  };
  for (const [key, values] of Object.entries(options)) {
    const select = $("#" + key);
    select.replaceChildren(new Option(t.all,""), ...values.map(([value,label]) => new Option(label,value)));
    select.value = state[key];
  }
}
function price(property) {
  const value = Intl.NumberFormat({fr:"fr-MA",en:"en",ar:"ar-MA"}[lang]).format(property.price);
  return `${value} ${t.currency}${property.kind === "rent" ? " " + t.month : ""}`;
}
function facts(property) {
  return `<span><bdi>${property.size} ${t.unit}</bdi></span><span><bdi>${property.rooms} ${t.rooms}</bdi></span>`;
}
function setFavoriteButton(button, saved) {
  button.setAttribute("aria-pressed", String(saved));
  button.setAttribute("aria-label", saved ? t.unsave : t.save);
  button.title = saved ? t.unsave : t.save;
  button.textContent = saved ? "♥" : "♡";
}
function renderCards() {
  const matches = properties.filter(p =>
    (!state.transaction || state.transaction === p.kind) &&
    (!state.type || state.type === p.type) &&
    (!state.district || state.district === p.area) &&
    (!state.favorites || favorites.has(p.id))
  );
  $("#resultCount").textContent = t.count(matches.length);
  $("#savedFilter").setAttribute("aria-pressed",String(state.favorites));
  $("#resetFilters").hidden = !Object.values(state).some(Boolean);
  for (const card of cardElements) {
    revealObserver?.unobserve(card);
    photoObserver?.unobserve(card);
    visiblePhotos.delete(card);
  }
  $("#cards").innerHTML = matches.length ? matches.map(p => `
    <article class="card" data-property="${p.id}">
      <div class="card-photo"><img src="img/${p.image}.webp" alt="" loading="lazy" decoding="async"></div>
      <span class="card-label">${t[p.kind]}</span><button class="card-save" type="button" data-save="${p.id}"></button>
      <div class="card-content">
        <p class="location">${tr(districts[p.area])} · ${t[p.type]}</p><h3>${tr(p.title)}</h3>
        <div class="card-meta">${facts(p)}</div>
        <div class="card-foot"><strong><bdi>${price(p)}</bdi></strong><button type="button" class="text-button" data-detail="${p.id}">${t.detail} <span class="arrow arrow-up" aria-hidden="true"></span></button></div>
      </div>
    </article>`).join("") : `<p class="empty">${state.favorites ? t.emptySaved : t.empty}</p>`;
  cardElements = $$("#cards .card");
  cardElements.forEach(card => {
    revealObserver?.observe(card);
    photoObserver?.observe(card);
    const button = $(".card-save", card);
    setFavoriteButton(button, favorites.has(button.dataset.save));
  });
}
function renderDetail(property) {
  const area = tr(districts[property.area]);
  $("#detailBody").innerHTML = `
    <div class="detail-photo"><img src="img/${property.image}.webp" alt=""></div>
    <div class="detail-copy">
      <p class="eyebrow">${t.demo}</p><h2 id="detailTitle">${tr(property.title)}</h2>
      <p class="details-meta">${area} · ${t[property.type]} · ${t[property.kind]}</p>
      <div class="card-meta">${facts(property)}</div><p>${tr(property.copy)}</p>
      <p><strong><bdi>${price(property)}</bdi></strong></p>
      <a class="button button-gold" href="${whatsapp(t.similar(t[property.type],area,property.kind))}" ${waAttrs}>${t.findSimilar} <span class="arrow arrow-up" aria-hidden="true"></span></a>
    </div>`;
}
function applyLanguage() {
  t = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = {fr:"Clénord Immobilier — Agence à Tanger",en:"Clénord Immobilier — Real estate in Tangier",ar:"كلينورد العقارية — وكالة عقارية في طنجة"}[lang];
  $$("[data-t]").forEach(node => { node.textContent = t[node.dataset.t]; });
  $("#language").value = lang;
  $("#language").setAttribute("aria-label",t.language);
  $("#menu").setAttribute("aria-label",t.menu);
  $("#closeDialog").setAttribute("aria-label",t.close);
  $("#navigation").setAttribute("aria-label",t.navigation);
  $("#filters").setAttribute("aria-label",t.catalogTitle);
  journey.setAttribute("aria-label",t.navResidences);
  $$("[data-wa]").forEach(link => { link.href = whatsapp(t.hello); });
  $("#services").innerHTML = t.services.map((name, index) => `<a href="${whatsapp(t.serviceText(name))}" ${waAttrs} data-service="${index + 1}" style="--service-delay:${index * 80}ms"><span>${name}</span><span class="arrow arrow-up" aria-hidden="true"></span></a>`).join("");
  applyTheme();
  showScenes();
  filterOptions();
  renderCards();
  if (selected) renderDetail(selected);
}

function updatePhotoDepth(enabled) {
  for (const element of visiblePhotos) {
    const rect = element.getBoundingClientRect();
    const progress = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
    const amplitude = element.classList.contains("card") ? 20 : 60;
    element.style.setProperty("--photo-shift", enabled ? (progress - .5) * amplitude + "px" : "0px");
  }
}
function showServiceImage(index) {
  serviceImages.forEach((image, current) => image.classList.toggle("is-current", current === index));
}
function updateMotion() {
  animationFrame = 0;
  const enabled = !motionPreference.matches;
  journey.classList.toggle("motion", enabled);
  const root = document.documentElement;
  const headerHeight = $("#header").offsetHeight;
  root.style.setProperty("--nav-height", headerHeight + "px");
  root.style.setProperty("--page-progress", clamp(window.scrollY / Math.max(1, root.scrollHeight - innerHeight)));
  root.style.setProperty("--hero-y", enabled ? Math.min(window.scrollY * .20, 125) + "px" : "0px");
  updatePhotoDepth(enabled);
  if (!enabled) {
    for (const element of sceneElements) {
      element.inert = false;
      element.style.removeProperty("clip-path");
    }
    activeScene = -1;
    return;
  }

  const rect = journey.getBoundingClientRect();
  const travel = Math.max(1, rect.height - $(".journey-sticky", journey).offsetHeight);
  const phase = clamp((headerHeight - rect.top) / travel) * (scenes.length - .08);
  const nextActive = Math.min(scenes.length - 1, Math.floor(phase + .16));
  const entering = Math.max(1, Math.floor(phase + .48));
  const cut = entering < scenes.length ? clamp((phase - entering + .48) / .68) : 0;
  const easedCut = cut * cut * (3 - 2 * cut);
  sceneCut.style.setProperty("--scene-cut", (1 - easedCut) * 100 + "%");
  sceneCut.style.setProperty("--scene-cut-opacity", Math.sin(Math.PI * cut) * .95);
  sceneElements.forEach((element,index) => {
    const local = phase - index;
    const opening = index === 0 ? 1 : clamp((local + .48) / .68);
    const ease = opening * opening * (3 - 2 * opening);
    const visible = opening > 0 && index >= Math.floor(phase - .42);
    element.classList.toggle("is-visible", visible);
    element.style.clipPath = index === 0 ? "none" : `inset(${(1 - ease) * 48}% ${(1 - ease) * 28}% round ${(1 - ease) * 160}px)`;
    const textProgress = index === 0 ? 1 : clamp((opening - .13) / .79);
    const sceneTravel = clamp((local + .48) / 1.75);
    element.style.setProperty("--scene-scale", 1.18 - .11 * sceneTravel);
    element.style.setProperty("--scene-pan", (24 - 52 * sceneTravel) + "px");
    element.style.setProperty("--scene-copy-y", (1 - textProgress) * 58 + "px");
    element.style.setProperty("--scene-title-y", (1 - textProgress) * 26 + "px");
    element.style.setProperty("--scene-text", textProgress);
    element.style.setProperty("--scene-frame", Math.max(0, textProgress * .8 - clamp(local - .3) * .55));
    element.style.setProperty("--scene-frame-scale", .94 + .06 * textProgress);
    if (activeScene !== nextActive) {
      element.inert = index !== nextActive;
      element.classList.toggle("is-active", index === nextActive);
      if (index === nextActive) sceneButtons[index].setAttribute("aria-current","true");
      else sceneButtons[index].removeAttribute("aria-current");
    }
  });
  activeScene = nextActive;
}
function queueMotion() {
  if (!animationFrame) animationFrame = requestAnimationFrame(updateMotion);
}
function setMenu(open) {
  $("#navigation").classList.toggle("open",open);
  $("#menu").setAttribute("aria-expanded",String(open));
}

$("#menu").innerHTML = icon("menu");
$("#menu").addEventListener("click", () => setMenu($("#menu").getAttribute("aria-expanded") === "false"));
$("#navigation").addEventListener("click", event => { if (event.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && $("#menu").getAttribute("aria-expanded") === "true") {
    setMenu(false);
    $("#menu").focus();
  }
});
$("#theme").addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  write("theme",theme);
  applyTheme();
});
$("#language").addEventListener("change", event => {
  lang = event.target.value;
  write("lang",lang);
  applyLanguage();
});
$("#filters").addEventListener("submit",event => event.preventDefault());
$("#filters").addEventListener("change", event => {
  if (event.target.matches("select")) {
    state[event.target.id] = event.target.value;
    renderCards();
  }
});
$("#savedFilter").addEventListener("click", () => { state.favorites = !state.favorites; renderCards(); });
$("#resetFilters").addEventListener("click", () => {
  Object.assign(state,{transaction:"",type:"",district:"",favorites:false});
  filterOptions();
  renderCards();
  $("#transaction").focus();
});
$("#scenes").addEventListener("click",event => {
  const link = event.target.closest("[data-type]");
  if (!link) return;
  Object.assign(state,{transaction:"",type:link.dataset.type,district:"",favorites:false});
  filterOptions();
  renderCards();
});
$("#sceneRail").addEventListener("click", event => {
  const button = event.target.closest("[data-scene]");
  if (!button) return;
  const height = $("#header").offsetHeight;
  const travel = journey.offsetHeight - $(".journey-sticky",journey).offsetHeight;
  const destination = Number(button.dataset.scene) + .24;
  const top = journey.getBoundingClientRect().top + window.scrollY - height + destination / (scenes.length - .08) * travel;
  window.scrollTo({top, behavior:"smooth"});
});
const services = $("#services");
services.addEventListener("pointerover", event => {
  if (event.pointerType === "touch") return;
  const link = event.target.closest("[data-service]");
  if (link) showServiceImage(Number(link.dataset.service));
});
services.addEventListener("pointerleave", () => showServiceImage(0));
services.addEventListener("focusin", event => {
  const link = event.target.closest("[data-service]");
  if (link) showServiceImage(Number(link.dataset.service));
});
services.addEventListener("focusout", event => {
  if (!services.contains(event.relatedTarget)) showServiceImage(0);
});
$("#cards").addEventListener("animationend", event => {
  if (event.animationName === "heart-beat") event.target.classList.remove("is-pulsing");
});
$("#cards").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.save) {
    const id = button.dataset.save;
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    write("favorites", JSON.stringify([...favorites]));
    if (state.favorites) {
      renderCards();
      ($(".card-save") ?? $("#savedFilter")).focus();
    } else {
      setFavoriteButton(button, favorites.has(id));
      if (!motionPreference.matches) button.classList.add("is-pulsing");
    }
  }
  if (button.dataset.detail) {
    selected = properties.find(property => property.id === button.dataset.detail);
    detailTrigger = button;
    renderDetail(selected);
    details.showModal();
  }
});
$("#closeDialog").addEventListener("click", () => details.close());
details.addEventListener("click", event => { if (event.target === details) details.close(); });
details.addEventListener("close", () => {
  selected = null;
  detailTrigger?.focus({preventScroll:true});
});
addEventListener("scroll",queueMotion,{passive:true});
addEventListener("resize",queueMotion);
motionPreference.addEventListener("change",queueMotion);
applyLanguage();

if (revealObserver) {
  $$(".reveal").forEach(element => revealObserver.observe(element));
  document.body.classList.add("reveal-ready");
}
photoObserver?.observe(architecture);
photoObserver?.observe(contactMedia);
