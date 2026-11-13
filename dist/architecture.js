import * as THREE from './vendor/three-0.160.1.min.js';
const dialog = document.querySelector("#villaTour");
const stage = document.querySelector("#tourStage");
const canvas = document.querySelector("#tourCanvas");
const fallback = document.querySelector("#tourFallback");
const tabs = document.querySelector("#tourRoomTabs");
const roomCount = document.querySelector("#tourRoomCount");
const roomKeys = ["salon", "cuisine", "chambre", "bain"];
const rooms = {
 fr: ["Salon", "Cuisine", "Chambre", "Salle de bain"],
 en: ["Living room", "Kitchen", "Bedroom", "Bathroom"],
 ar: ["غرفة الجلوس", "المطبخ", "غرفة النوم", "الحمّام"]
};
const aria = {
 fr: { close: "Fermer la visite", rooms: "Choisir une pièce", previous: "Pièce précédente", next: "Pièce suivante" },
 en: { close: "Close the tour", rooms: "Choose a room", previous: "Previous room", next: "Next room" },
 ar: { close: "إغلاق الجولة", rooms: "اختر غرفة", previous: "الغرفة السابقة", next: "الغرفة التالية" }
};
let currentRoom = 0;
let yaw = 0;
let pitch = 0;
let pointer = null;
let renderer, scene, camera, sphere, textureLoader, texture;
let frame = 0;
let dragging = false;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function lang() { return rooms[document.documentElement.lang] ? document.documentElement.lang : "fr"; }
function renderTabs() {
  const a11y = aria[lang()];
  document.querySelector("#closeVillaTour").setAttribute("aria-label", a11y.close);
  document.querySelector("#tourPrev").setAttribute("aria-label", a11y.previous);
  document.querySelector("#tourNext").setAttribute("aria-label", a11y.next);
  tabs.setAttribute("aria-label", a11y.rooms);
  tabs.replaceChildren();
  rooms[lang()].forEach((label, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(index === currentRoom));
    button.addEventListener("click", () => selectRoom(index));
    tabs.append(button);
  });
  const list = rooms[lang()];
  roomCount.textContent = `${String(currentRoom + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")} · ${list[currentRoom]}`;
  stage.setAttribute("aria-label", `${list[currentRoom]} · 360°`);
}
function initRenderer() {
  if (renderer || !THREE) return !!renderer;
  try {
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(78, 1, .1, 100);
    sphere = new THREE.Mesh(new THREE.SphereGeometry(18, 72, 48), new THREE.MeshBasicMaterial({ side: THREE.BackSide }));
    scene.add(sphere);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    textureLoader = new THREE.TextureLoader();
    resize();
    return true;
  } catch (error) {
    console.warn("Panorama WebGL unavailable; using image fallback.", error);
    canvas.hidden = true;
    fallback.hidden = false;
    return false;
  }
}
function resize() {
  if (!renderer || !camera) return;
  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}
function render() {
  frame = 0;
  if (!renderer || !dialog.open) return;
  const direction = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    -Math.cos(yaw) * Math.cos(pitch)
  );
  camera.lookAt(direction);
  renderer.render(scene, camera);
}
function queueRender() { if (!frame) frame = requestAnimationFrame(render); }
let roomRequest = 0;

async function selectRoom(index, { animate = true } = {}) {
  const request = ++roomRequest;
  currentRoom = (index + roomKeys.length) % roomKeys.length;
  yaw = 0;
  pitch = 0;
  releasePointer();
  renderTabs();

  const path = `${activeModel.rooms}/${roomKeys[currentRoom]}.webp`;
  const hasWebGL = initRenderer();
  if (hasWebGL) {
    try {
      const nextTexture = await textureLoader.loadAsync(path);
      if (request !== roomRequest || !dialog.open) {
        nextTexture.dispose();
        return;
      }
      texture?.dispose();
      texture = nextTexture;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      sphere.material.map = texture;
      sphere.material.needsUpdate = true;
      canvas.hidden = false;
      fallback.hidden = true;
      resize();
      queueRender();
    } catch {
      if (request === roomRequest && dialog.open) showFallback(path);
    }
  } else {
    showFallback(path);
  }
  if (request !== roomRequest || !dialog.open) return;
  if (animate && !reducedMotion.matches) {
    stage.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 300, easing: "ease-out" });
  }
}

function showFallback(path) {
  canvas.hidden = true;
  fallback.hidden = false;
  fallback.style.backgroundImage = `url("${path}")`;
  fallback.style.backgroundPosition = "50% 50%";
}

const tourButton = document.querySelector("#openVillaTour");
const tourModels = {
  villa: {
    exterior: "villa-cutout", entrance: "villa-entrance", rooms: "panoramas",
    labels: {
      fr: ["Villa contemporaine · démonstration", "Une villa à découvrir de l’intérieur.", "Entrer dans la villa", "La terrasse", "Le jardin"],
      en: ["Contemporary villa · demo", "Discover the villa from the inside.", "Enter the villa", "The terrace", "The garden"],
      ar: ["فيلا عصرية · جولة تجريبية", "اكتشف الفيلا من الداخل.", "ادخل الفيلا", "الشرفة", "الحديقة"]
    }
  },
  maison: {
    exterior: "maison-facade", entrance: "maison-seuil", rooms: "panoramas/maison",
    labels: {
      fr: ["Maison de ville · démonstration", "Une maison à découvrir depuis la rue.", "Entrer dans la maison", "Le balcon", "L’entrée"],
      en: ["Townhouse · demo", "Discover a family home from the street.", "Enter the house", "The balcony", "The entrance"],
      ar: ["منزل عائلي · جولة تجريبية", "اكتشف المنزل من الشارع.", "ادخل المنزل", "الشرفة", "المدخل"]
    }
  },
  appartement: {
    exterior: "appartement-facade", entrance: "appartement-seuil", rooms: "panoramas/appartement",
    labels: {
      fr: ["Appartement · démonstration", "De la rue jusqu’à la fenêtre.", "Entrer par la fenêtre", "Les balcons", "La fenêtre"],
      en: ["Apartment · demo", "From the street to the window.", "Enter through the window", "The balconies", "The window"],
      ar: ["شقة · جولة تجريبية", "من الشارع إلى النافذة.", "ادخل عبر النافذة", "الشرفات", "النافذة"]
    }
  }
};
let selectedModel = "villa";
let activeModel = tourModels.villa;
let tourSession = 0;

async function openTour() {
  if (dialog.open) return;
  const session = ++tourSession;
  activeModel = tourModels[selectedModel];
  const entrancePhoto = new Image();
  entrancePhoto.alt = "";
  entrancePhoto.src = `img/${activeModel.entrance}.webp`;
  const entrance = document.createElement("div");
  entrance.className = "tour-entrance";
  entrance.setAttribute("aria-hidden", "true");
  const withEntrance = !reducedMotion.matches;
  if (withEntrance) {
    entrance.append(entrancePhoto);
    stage.append(entrance);
    stage.classList.add("is-entering");
  }
  document.querySelector(".tour-dialog-bar .eyebrow").textContent = activeModel.labels[lang()][0];
  dialog.showModal();
  if (camera) {
    camera.fov = 78;
    camera.updateProjectionMatrix();
  }
  const roomReady = selectRoom(0, { animate: false });
  if (!withEntrance) return;

  try {
    await entrancePhoto.decode();
    if (session !== tourSession || !dialog.open) return;
    const approach = entrancePhoto.animate([
      { transform: "scale(1.02) translateY(0)" },
      { transform: "scale(1.28) translateY(-.8%)", offset: .43 },
      { transform: "scale(1.72) translateY(.5%)" }
    ], { duration: 1250, easing: "cubic-bezier(.32,.04,.58,1)", fill: "forwards" });
    await Promise.all([approach.finished, roomReady]);
    if (session !== tourSession || !dialog.open) return;
    const crossThreshold = entrancePhoto.animate([
      { transform: "scale(1.72) translateY(.5%)", opacity: 1 },
      { transform: "scale(2.3) translateY(0)", opacity: 0 }
    ], { duration: 620, easing: "cubic-bezier(.33,.1,.42,1)", fill: "forwards" });
    if (camera && !canvas.hidden) animateArrival(session);
    await crossThreshold.finished;
    approach.cancel();
    crossThreshold.cancel();
  } catch {
    // The panorama is still available if the entrance image could not load.
  } finally {
    if (session === tourSession) {
      entrance.remove();
      stage.classList.remove("is-entering");
    }
  }
}

function animateArrival(session) {
  const started = performance.now();
  const duration = 760;
  function step(now) {
    if (session !== tourSession || !dialog.open || !stage.classList.contains("is-entering")) {
      if (session === tourSession && dialog.open) {
        camera.fov = 78;
        camera.updateProjectionMatrix();
        queueRender();
      }
      return;
    }
    const progress = clamp((now - started) / duration, 0, 1);
    camera.fov = 78 - 13 * (1 - progress) ** 2;
    camera.updateProjectionMatrix();
    queueRender();
    if (progress < 1) requestAnimationFrame(step);
  }
  step(started);
}
function closeTour() { if (dialog.open) dialog.close(); }

tourButton.addEventListener("click", openTour);
document.querySelector("#closeVillaTour").addEventListener("click", closeTour);
document.querySelector("#tourPrev").addEventListener("click", () => selectRoom(currentRoom - 1));
document.querySelector("#tourNext").addEventListener("click", () => selectRoom(currentRoom + 1));
dialog.addEventListener("close", () => {
  if (dialog.open) return;
  tourSession++;
  roomRequest++;
  const entrance = stage.querySelector(".tour-entrance");
  entrance?.querySelector("img")?.getAnimations().forEach(animation => animation.cancel());
  entrance?.remove();
  stage.classList.remove("is-entering");
  releasePointer();
});

stage.addEventListener("pointerdown", event => {
  if (stage.classList.contains("is-entering") || event.target.closest("button")) return;
  pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  dragging = true;
  stage.classList.add("is-dragging");
  stage.setPointerCapture(event.pointerId);
});
stage.addEventListener("pointermove", event => {
  if (!pointer || pointer.id !== event.pointerId) return;
  const dx = event.clientX - pointer.x;
  const dy = event.clientY - pointer.y;
  yaw -= dx * .004;
  pitch = clamp(pitch + dy * .003, -1.15, 1.15);
  pointer.x = event.clientX; pointer.y = event.clientY;
  if (canvas.hidden) {
    const x = 50 + (yaw * 22.22) % 100;
    fallback.style.backgroundPosition = `${(x + 100) % 100}% 50%`;
  }
  queueRender();
});
function releasePointer() {
  pointer = null; dragging = false; stage.classList.remove("is-dragging");
}
stage.addEventListener("pointerup", releasePointer);
stage.addEventListener("pointercancel", releasePointer);
stage.addEventListener("lostpointercapture", releasePointer);
stage.addEventListener("wheel", event => {
  if (!renderer || !camera || stage.classList.contains("is-entering")) return;
  event.preventDefault();
  camera.fov = clamp(camera.fov + event.deltaY * .025, 48, 92);
  camera.updateProjectionMatrix(); queueRender();
}, { passive: false });
stage.addEventListener("keydown", event => {
  if (stage.classList.contains("is-entering") && event.key !== "Escape") return;
  if (event.key === "ArrowRight") { event.preventDefault(); selectRoom(currentRoom + 1); }
  if (event.key === "ArrowLeft") { event.preventDefault(); selectRoom(currentRoom - 1); }
  if (event.key === "Escape") closeTour();
});
window.addEventListener("resize", () => { resize(); queueRender(); });
document.querySelector("#language").addEventListener("change", renderTabs);

const wall = document.querySelector(".hero-wall");
const hero = document.querySelector("#accueil");
if (wall && !reducedMotion.matches) {
  hero.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    wall.style.setProperty("--wall-x", `${-x * 10}px`);
    wall.style.setProperty("--wall-y", `${-y * 10}px`);
    wall.querySelectorAll(".hero-tile").forEach((tile, index) => {
      const depth = 2 + index * .75;
      tile.style.setProperty("--tile-x", `${x * depth}px`);
      tile.style.setProperty("--tile-y", `${y * depth}px`);
    });
  });
  hero.addEventListener("pointerleave", () => {
    wall.style.setProperty("--wall-x", "0px"); wall.style.setProperty("--wall-y", "0px");
    wall.querySelectorAll(".hero-tile").forEach(tile => { tile.style.setProperty("--tile-x", "0px"); tile.style.setProperty("--tile-y", "0px"); });
  });
}
renderTabs();

// Two seamless horizontal image ribbons.
const wallTiles = [...wall.querySelectorAll(".hero-tile")];
wall.replaceChildren();
for(let row=0;row<2;row++) {
 const strip=document.createElement("div"); strip.className="image-ribbon";
 const track=document.createElement("div"); track.className="ribbon-track";
 for(let repeat=0;repeat<2;repeat++) wallTiles.slice(row*4,row*4+4).forEach(tile=>track.append(tile.cloneNode(true)));
 strip.append(track);wall.append(strip);
}
const villaStory = document.querySelector("#villaStory");
const villaPin = villaStory.querySelector(".villa-story-pin");
const villaHeader = document.querySelector("#header");
let storyFrame = 0;
let storyInView = false;

function updateVillaStory() {
  storyFrame = 0;
  if (!storyInView || reducedMotion.matches) return;

  const track = villaStory.getBoundingClientRect();
  const pin = villaPin.getBoundingClientRect();
  const progress = clamp((pin.top - track.top) / Math.max(1, track.height - pin.height), 0, 1);
  const phase = (start, end) => {
    const position = clamp((progress - start) / (end - start), 0, 1);
    return position * position * (3 - 2 * position);
  };
  const approach = phase(.48, .86);
  const apartment = selectedModel === "appartement";
  const house = selectedModel === "maison";
  const threshold = phase(.69, .94);
  const terrace = phase(.07, .19) * (1 - phase(.25, .34));
  const garden = phase(.34, .45) * (1 - phase(.52, .65));
  const storyStyles = {
    "--story-progress": progress,
    "--facade-scale": 1 + progress * .18 + approach * (apartment ? 3.5 : 1.9),
    "--facade-shift-x": `${-approach * (apartment || house ? 0 : 8)}%`,
    "--facade-shift-y": `${approach * (apartment ? 32 : -25)}%`,
    "--facade-opacity": 1 - threshold,
    "--door-opacity": threshold,
    "--door-scale": 1.18 - threshold * .18,
    "--terrace-opacity": terrace,
    "--terrace-shift": `${(1 - terrace) * 36}px`,
    "--garden-opacity": garden,
    "--garden-shift": `${(1 - garden) * 36}px`
  };
  for (const [name, value] of Object.entries(storyStyles)) {
    villaStory.style.setProperty(name, value);
  }
  villaStory.classList.toggle("at-door", progress >= .87);
}

function queueVillaStory() {
  if (!storyFrame && storyInView) storyFrame = requestAnimationFrame(updateVillaStory);
}

function resizeVillaStory() {
  villaStory.style.setProperty("--villa-header", `${villaHeader.offsetHeight}px`);
  queueVillaStory();
}

if ("IntersectionObserver" in window) {
  villaStory.classList.add("scroll-ready");
  const storyObserver = new IntersectionObserver(([entry]) => {
    storyInView = entry.isIntersecting;
    queueVillaStory();
  }, { rootMargin: "100px" });
  storyObserver.observe(villaStory);
  window.addEventListener("scroll", queueVillaStory, { passive: true });
  window.addEventListener("resize", resizeVillaStory);
  reducedMotion.addEventListener("change", queueVillaStory);
  resizeVillaStory();
}

// Keyboard navigation to the tour button lands at the end of the approach.
tourButton.addEventListener("focus", () => {
  if (!tourButton.matches(":focus-visible") || reducedMotion.matches ||
      !villaStory.classList.contains("scroll-ready") || villaStory.classList.contains("at-door")) return;
  window.scrollTo({
    top: window.scrollY + villaStory.getBoundingClientRect().bottom - villaPin.offsetHeight - villaHeader.offsetHeight,
    behavior: "instant"
  });
});

const modelPicker = document.querySelector(".model-picker");
const storyFacade = villaStory.querySelector(".villa-story-facade");
const storyDoor = villaStory.querySelector(".villa-story-door");
const detailPhotos = villaStory.querySelectorAll(".villa-detail img");
const modelLabels = [
  villaStory.querySelector(".villa-story-label"),
  villaStory.querySelector(".villa-story-title"),
  tourButton.querySelector("span"),
  villaStory.querySelector(".villa-detail-terrace figcaption"),
  villaStory.querySelector(".villa-detail-garden figcaption")
];

function labelModel() {
  const labels = tourModels[selectedModel].labels[lang()];
  modelLabels.forEach((element, index) => {
    element.textContent = labels[index];
  });
  modelPicker.setAttribute("aria-label", {
    fr: "Modèles de visite", en: "Tour models", ar: "نماذج الجولات"
  }[lang()]);
}

modelPicker.addEventListener("click", event => {
  const choice = event.target.closest("[data-model]");
  if (!choice) return;
  selectedModel = choice.dataset.model;
  const model = tourModels[selectedModel];
  villaStory.dataset.model = selectedModel;
  storyFacade.src = `img/${model.exterior}.webp`;
  storyDoor.src = `img/${model.entrance}.webp`;
  detailPhotos[0].src = storyFacade.src;
  detailPhotos[1].src = selectedModel === "villa" ? "panoramas/salon.webp" : storyDoor.src;
  modelPicker.querySelectorAll("[data-model]").forEach(link => {
    if (link === choice) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  labelModel();
  queueVillaStory();
});
document.querySelector("#language").addEventListener("change", labelModel);
labelModel();
