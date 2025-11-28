import React, { useEffect, useRef } from 'react';

export default function Lightbox({ images, current, onClose, onPrev, onNext }){
  const dialogRef = useRef(null);
  const [loaded, setLoaded] = React.useState(false);

  useEffect(()=>{
    if(current == null) return;
    const onKey = (e)=>{
      if(e.key === 'Escape') onClose();
      if(e.key === 'ArrowLeft') onPrev();
      if(e.key === 'ArrowRight') onNext();
      if(e.key === 'Tab'){
        // simple focus trap
        const focusable = dialogRef.current?.querySelectorAll('button,a,[tabindex]');
        if(!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length-1];
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    // focus
    const prevActive = document.activeElement;
    setLoaded(false);
    setTimeout(()=> dialogRef.current?.focus(), 0);
    return ()=>{
      document.removeEventListener('keydown', onKey);
      prevActive?.focus();
    };
  }, [current, onClose, onPrev, onNext]);

  if(current == null) return null;
  const item = images[current];
  const src = item?.src || item;
  const desc = item?.desc || '';
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Imagen ${current+1} de ${images.length}`} aria-describedby={`lb-desc-${current}`} onClick={onClose}>
      <button className="lightbox-close" onClick={(e)=>{e.stopPropagation(); onClose();}} aria-label="Cerrar">✕</button>
      <button className="lightbox-prev" onClick={(e)=>{e.stopPropagation(); onPrev();}} aria-label="Anterior">‹</button>
      <div className={`lightbox-inner ${loaded? 'loaded':''}`} onClick={(e)=>e.stopPropagation()} tabIndex={-1} ref={dialogRef}>
        {!loaded && <div className="lb-spinner" aria-hidden="true"/>}
        <img src={src} alt={`Galería ${current+1}`} loading="lazy" onLoad={()=>setLoaded(true)} style={{display: loaded? 'block':'none'}} />
        <div className="lb-counter" aria-hidden="true">{current+1} / {images.length}</div>
        <div id={`lb-desc-${current}`} className="lb-desc">{desc}</div>
      </div>
      <button className="lightbox-next" onClick={(e)=>{e.stopPropagation(); onNext();}} aria-label="Siguiente">›</button>
    </div>
  );
}
