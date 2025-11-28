import React, { useState, useEffect } from 'react';
import Lightbox from './Lightbox';
import './App.css';

function App() {
  const [theme, setTheme] = useState('default');
  const [topHidden, setTopHidden] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(()=>{
    const saved = localStorage.getItem('site-theme');
    if(saved) setTheme(saved);
  }, []);
  // hide topbar on scroll down, show on scroll up
  useEffect(()=>{
    let last = window.scrollY;
    const onScroll = () =>{
      const cur = window.scrollY;
      if(cur > last + 10) setTopHidden(true);
      else if(cur < last - 10) setTopHidden(false);
      last = cur;
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    return ()=> window.removeEventListener('scroll', onScroll);
  }, []);
  // gallery images and descriptions (copied to public/ as 1.jpg..6.jpg)
  const images = [
    { src: '/1.jpg', desc: 'Foto 1 — Kyoto, paisaje otoñal: tonos cálidos y sensación de calma, captura las hojas caídas y la arquitectura tradicional.' },
  { src: '/2.jpg', desc: 'Foto 2 — Retrato en kimono: una figura elegante en escaleras urbanas; transmite tradición, dignidad y calma.' },
    { src: '/3.jpg', desc: 'Foto 3 — Calle urbana en temporada: texturas, luces y movimiento que transmiten vida cotidiana.' },
  { src: '/4.jpg', desc: 'Foto 4 — Torii en jardín japonés: un portal rojo que enmarca la escena y evoca serenidad, tradición y conexión con la naturaleza.' },
  { src: '/5.jpg', desc: 'Foto 5 — Plato tradicional japonés: una composición culinaria que transmite equilibrio, textura y la estética del umami.' },
    { src: '/6.jpg', desc: 'Foto 6 — Emplatado de sushi: colores vivos y textura que invitan a degustar; transmite tradición culinaria y precisión estética.' }
  ];
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () => setLightboxIndex(i => (i == null ? null : (i - 1 + images.length) % images.length));
  const nextLightbox = () => setLightboxIndex(i => (i == null ? null : (i + 1) % images.length));

  useEffect(() => {
    // set data-theme attribute on root App element
    const el = document.querySelector('.App');
    if (el) el.setAttribute('data-theme', theme);
    localStorage.setItem('site-theme', theme);
  }, [theme]);

  // derive filtered images
  const filteredImages = images.filter(img => {
    if(!query) return true;
    const q = query.toLowerCase();
    return (img.desc || '').toLowerCase().includes(q);
  });

  // Keep gallery visible always. If the user types a contact-related query,
  // we can highlight or suggest the Contact section but we won't hide the gallery.
  const contactQuery = query && ['contact','aerolinea','aerolíneas','aerolineas','flight','vuelo','viaje'].some(k=> query.toLowerCase().includes(k));

  return (
    <div className="App" data-theme={theme}>
      <div className={`topbar ${topHidden? 'topbar-hidden':''}`}>
        <nav className="topbar-inner">
          <ul className="menu">
            <li className="menu-item"><button className="menu-btn" onClick={() => window.scrollTo({top:0, behavior: 'smooth'})}>Home</button></li>
            <li className="menu-item"><button className="menu-btn" onClick={() => document.getElementById('gallery').scrollIntoView({behavior: 'smooth'})}>Gallery</button></li>
            <li className="menu-item"><button className="menu-btn" onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}>Contact</button></li>
          </ul>
          <div className="top-controls">
            <input className="search-input" placeholder="Buscar gallery o contact" value={query} onChange={e=>setQuery(e.target.value)} aria-label="Buscar" />
            <button className="icon-btn" title="Clear search" onClick={()=>setQuery('')} aria-label="Limpiar búsqueda">✕</button>
            <button
              className="icon-btn"
              aria-pressed={theme === 'autumn'}
              aria-label="Cambiar tema"
              onClick={() => setTheme(t => (t === 'autumn' ? 'default' : 'autumn'))}
            >
              🍁
            </button>
          </div>
        </nav>
      </div>

      <main className="hero">
        <section id="home" className="hero-left">
          <div className="badge">Kōyō Gallery</div>
          <h1 className="hero-title">紅葉</h1>
          <p className="hero-description">Una galería de fotografía que celebra momentos, retratos y composición. Explora la cultura tradicional y descubre historias visuales.</p>
          <button className="hero-cta cta-btn" onClick={() => document.getElementById('gallery').scrollIntoView({behavior: 'smooth'})}>Learn more</button>
          <div className="hashtag">#KōyōGallery</div>
  </section>

  <section className="hero-right">
          {/* Copia la imagen a public/lado-removebg-preview.png */}
          <div className="hero-image" style={{backgroundImage: `url('/lado-removebg-preview.png')`}} aria-hidden="true"></div>
          <div className="red-ornament large" aria-hidden="true"></div>
          <div className="red-ornament small" aria-hidden="true"></div>
        </section>

      </main>

      <section id="gallery" className="gallery-section">
          <div className="gallery-inner">
            <h2>Galería</h2>
            <p>Japón ofrece una combinación única de tradición y modernidad: templos y jardines que invitan a la contemplación, celebraciones estacionales como el hanami y el kōyō, y una estética cuidada en la vida diaria —desde la arquitectura hasta la gastronomía— que celebra la simplicidad, el detalle y el respeto por la naturaleza. Explora estas imágenes para descubrir momentos y escenas que transmiten esa sensibilidad cultural.</p>
            <div className="gallery-grid">
              {filteredImages.map((img, i) => {
                // Determine the absolute index of this thumbnail within the full images array
                const absoluteIndex = images.findIndex(it => it.src === img.src && it.desc === img.desc);
                return (
                  <div key={absoluteIndex} className="thumb-wrap">
                    <button className="thumb" onClick={() => setLightboxIndex(absoluteIndex)} style={{backgroundImage: `url('${img.src}')`}} aria-label={`Abrir imagen ${absoluteIndex+1}`} />
                    <div className="thumb-caption">{img.desc}</div>
                  </div>
                );
              })}
            </div>
            {contactQuery && (
              <div className="contact-signal" role="status" aria-live="polite">
                Parece que buscas información de contacto o viajes. Puedes ir a la sección <button className="linkish" onClick={() => document.getElementById('contact').scrollIntoView({behavior:'smooth'})}>Contact</button>.
              </div>
            )}
          </div>
        </section>

      <section id="contact" className="contact-section" aria-label="contact">
        <div className="contact-inner">
          <h2>Contact / Travel</h2>
          <p>Si estás pensando en viajar a Japón, estas aerolíneas ofrecen rutas regulares y opciones de vuelo desde/ hacia distintos continentes:</p>
          <ul className="airlines-list">
            <li>
              <strong>Japan Airlines (JAL)</strong> — Aerolínea nacional de Japón. Ofrece vuelos directos desde ciudades principales (EE. UU., Europa, Asia) a Tokio (NRT/HND) y Osaka (KIX). Buena conectividad doméstica dentro de Japón.
            </li>
            <li>
              <strong>All Nippon Airways (ANA)</strong> — Otra gran aerolínea japonesa con rutas directas y convenientes conexiones domésticas. Conocida por su servicio y frecuencia de vuelos.
            </li>
            <li>
              <strong>Emirates / Qatar / Turkish</strong> — Aerolíneas de conexión que ofrecen rutas desde muchas ciudades internacionales con una sola escala hacia Japón. Ideal si buscas opciones desde Europa, Oriente Medio o África.
            </li>
            <li>
              <strong>Delta / United / American</strong> — Grandes aerolíneas estadounidenses con rutas directas y conexiones a Japón desde hubs en EE. UU.; frecuencias y servicio varían según la temporada.
            </li>
            <li>
              <strong>British Airways / Lufthansa</strong> — Opción común desde Europa con vuelos directos o con una escala según el aeropuerto de salida.
            </li>
          </ul>
          <h3>Tipos de vuelo</h3>
          <p>
            - Directo: el más rápido; disponible desde hubs grandes. <br/>
            - Con escala (1 stop): suele ser más económico o ofrecer horarios más flexibles. <br/>
            - Vuelos estacionales / chárter: durante festividades o temporadas altas puede haber rutas temporales.
          </p>
          <p>Para reservar, compara precios en buscadores y revisa duración total (incluyendo escalas), política de equipaje y conexión doméstica si planeas visitar varias ciudades en Japón.</p>
        </div>
  </section>
      <Lightbox images={images} current={lightboxIndex} onClose={closeLightbox} onPrev={prevLightbox} onNext={nextLightbox} />
    </div>
  );
}

export default App;
