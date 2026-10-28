// 실제 사이트용 동작 (build_site.py): 페이지 이동 · 문의 위치 · FAQ 분류 · 미디어 링크 · 영상 팝업
(function(){
  var MAP={"main": "/", "ceo": "/about/ceo-message/", "about": "/about/company/", "syn": "/solutions/synpersona/", "eldo": "/solutions/eldo/", "data": "/solutions/data-consulting/", "faq": "/faq/", "news": "/media/", "contact": "/#contact"};
  function go(k){
    if(k==='contact'){ var c=document.getElementById('contact');
      if(c){ c.scrollIntoView({behavior:'smooth',block:'start'}); try{history.replaceState(null,'','#contact');}catch(e){} return; }
      location.href='/#contact'; return; }
    if(MAP[k]) location.href=MAP[k];
  }
  function openVideo(title,yt){
    var m=document.getElementById('vmodal');
    if(!m){ m=document.createElement('div'); m.id='vmodal'; m.className='vmodal'; m.hidden=true;
      m.innerHTML='<div class="vbox"><div class="vbar"><span id="vtitle"></span><span class="vact"><a id="vyt" target="_blank" rel="noopener">YouTube에서 보기 ↗</a><button type="button" id="vclose" aria-label="닫기">×</button></span></div><div id="vstage"></div></div>';
      document.body.appendChild(m);
      m.addEventListener('click',function(e){ if(e.target===m) closeVideo(); });
      document.getElementById('vclose').onclick=closeVideo; }
    document.getElementById('vtitle').textContent=title;
    var a=document.getElementById('vyt'); a.href='https://www.youtube.com/watch?v='+yt;
    document.getElementById('vstage').innerHTML='<iframe class="vyt" src="https://www.youtube-nocookie.com/embed/'+yt+'?autoplay=1&rel=0&modestbranding=1" title="'+title+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    m.hidden=false;
  }
  function closeVideo(){ var m=document.getElementById('vmodal'); if(!m) return; document.getElementById('vstage').innerHTML=''; m.hidden=true; }
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape') closeVideo();
    if(e.key==='Enter'){ var g=e.target.closest&&e.target.closest('[data-go]'); if(g&&g.tagName!=='A'){ go(g.getAttribute('data-go')); }
      var n=e.target.closest&&e.target.closest('.nrow[data-url]'); if(n) window.open(n.getAttribute('data-url'),'_blank','noopener'); }
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest) return;
    var v=e.target.closest('[data-video]');
    if(v){ e.preventDefault(); e.stopPropagation(); var yt=v.getAttribute('data-yt'); if(yt) openVideo(v.getAttribute('data-vt')||'',yt); return; }
    var f=e.target.closest('[data-fc]');
    if(f){ var c=f.getAttribute('data-fc');
      document.querySelectorAll('[data-fc]').forEach(function(b){ b.setAttribute('aria-pressed',b===f?'true':'false'); });
      document.querySelectorAll('.faqgroup').forEach(function(gp){ gp.hidden=!(c==='all'||gp.getAttribute('data-cat')===c);
        var h=gp.querySelector('.faqcat'); if(h) h.style.display=(c==='all')?'':'none'; });
      return; }
    var n=e.target.closest('.nrow[data-url]');
    if(n){ var u=n.getAttribute('data-url'); if(u) window.open(u,'_blank','noopener'); return; }
    var a=e.target.closest('a'); if(a) return;
    var g=e.target.closest('[data-go]');
    if(g){ e.preventDefault(); go(g.getAttribute('data-go')); }
  });
})();
