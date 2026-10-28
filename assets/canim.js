
/* C안 애니메이션 (10/27) */
(function(){
  var D=document, B=D.body, KEY='greta-anim';
  function reduce(){ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
  function animOn(){ var v=null; try{ v=localStorage.getItem(KEY); }catch(e){} return v===null ? !reduce() : v==='1'; }
  function isC(){ return B.getAttribute('data-dv')==='c'; }
  function apply(){ B.classList.toggle('c-noanim', !animOn()); }

  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(!e.isIntersecting) return; io.unobserve(e.target); show(e.target); });
  },{rootMargin:'0px 0px -10% 0px'}) : null;

  var hio = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ hio.unobserve(e.target); e.target.classList.add('go'); var t=e.target; setTimeout(function(){ q('.ca',t).forEach(show); },40); } }); },{rootMargin:'0px 0px -15% 0px'}) : null;
  function show(el){
    if(el.classList.contains('cnt')) count(el);
    if(!el.classList.contains('ca')) return;
    el.classList.add('cin');
    var d=parseFloat(el.style.transitionDelay)||0;
    setTimeout(function(){ el.classList.remove('ca','cin'); el.style.transitionDelay=''; }, d*1000+1000);
  }

  // 3. 숫자 카운트업
  function count(b){
    var fin=b.getAttribute('data-fin'); if(!fin) return;
    var m=fin.match(/^([\d,]+)(\D*)$/); if(!m || B.classList.contains('c-noanim')){ b.textContent=fin; return; }
    var n=parseInt(m[1].replace(/,/g,''),10), suf=m[2], t0=null, dur=1700;
    function f(ts){ if(!t0) t0=ts; var k=Math.min(1,(ts-t0)/dur), e=1-Math.pow(1-k,3);
      b.firstChild.nodeValue=Math.round(n*e).toLocaleString('en-US')+suf; if(k<1) requestAnimationFrame(f); }
    b.textContent=fin.replace(/\d/g,'0'); requestAnimationFrame(f);
  }

  function mark(list, base, step, noObs){
    list.forEach(function(el,i){
      if(el.closest('.note') || el.getAttribute('data-ca')) return;
      el.setAttribute('data-ca','1');
      if(B.classList.contains('c-noanim')) return;
      var d=((base||0)+i*(step||0.09)).toFixed(2)+'s';
      el.style.transition='none'; el.classList.add('ca');
      requestAnimationFrame(function(){ el.style.transition=''; el.style.transitionDelay=d;
        if(noObs) return; if(io) io.observe(el); else show(el); });
    });
  }
  function q(sel, root){ return Array.prototype.slice.call((root||D).querySelectorAll(sel)); }

  function init(){
    if(!isC()) return;
    apply();
    var R=D.querySelector('.review'); if(!R) return;
    // 1. 제목 줄 나누기
    q('.hc-h',R).forEach(function(h){
      if(h.getAttribute('data-ln')) return; h.setAttribute('data-ln','1');
      h.innerHTML=h.innerHTML.split(/<br\s*\/?>/i).map(function(x,i){ return '<span class="ln"><span style="transition-delay:'+(0.15+i*0.13).toFixed(2)+'s">'+x+'</span></span>'; }).join('');
      var hc=h.closest('.hc'); if(hio) hio.observe(hc); else hc.classList.add('go');
    });
    q('.hc',R).forEach(function(hc){
      mark(q('.eyebrow',hc),0,0,1); mark(q('.hc-p',hc),0.75,0,1);
      mark(q('.hc-main',hc),0.95,0,1); mark(q('.hc-float',hc),1.25,0,1);
    });
    // 6. 섹션별 순차 등장
    q('.band .sec',R).forEach(function(sc){
      mark(q(':scope > h3, :scope > .lead',sc),0,0.08);
      q(':scope .grid, :scope .stc-grid, :scope .news',sc).forEach(function(g){ mark(q(':scope > *',g),0.12,0.09); });
      mark(q(':scope .orc-list',sc),0.1,0);
    });
    mark(q('.band .cta',R),0,0);
    // 3. 숫자 준비
    q('.stc-grid b',R).forEach(function(b){
      if(b.getAttribute('data-fin')) return; b.setAttribute('data-fin',b.textContent.trim());
      if(/^[\d,]+\D*$/.test(b.textContent.trim()) && !B.classList.contains('c-noanim')){ b.classList.add('cnt'); b.textContent=b.textContent.replace(/\d/g,'0'); if(io) io.observe(b); else count(b); }
    });
    // 4. 기관 이름 띠
    q('.orc-list',R).forEach(function(L){
      if(L.classList.contains('mq')) return;
      var items=q(':scope > span',L); if(items.length<4) return;
      var half=Math.ceil(items.length/2), rows=[items.slice(0,half), items.slice(half)];
      L.innerHTML=''; L.classList.add('mq');
      rows.forEach(function(r,ri){
        var row=D.createElement('div'); row.className='orc-row'+(ri?' r2':'');
        [0,1].forEach(function(copy){ r.forEach(function(it){ var c=it.cloneNode(true); if(copy) c.setAttribute('aria-hidden','true'); row.appendChild(c); }); });
        L.appendChild(row);
      });
    });
    // 움직임 켜기/끄기 버튼
    var tools=D.querySelector('.bar .tools');
    if(tools && !D.getElementById('animtg')){
      var b=D.createElement('button'); b.type='button'; b.id='animtg'; b.className='btn ghost';
      b.textContent=animOn()?'움직임 끄기':'움직임 켜기';
      b.onclick=function(){ var on=!animOn(); try{localStorage.setItem(KEY,on?'1':'0');}catch(e){} location.reload(); };
      tools.insertBefore(b, tools.firstChild.nextSibling);
    }
    parallax();
  }

  // 2. 첫 화면 이미지 시차
  var ticking=false;
  function parallax(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(function(){
      ticking=false;
      if(!isC() || B.classList.contains('c-noanim') || innerWidth<761) { q('.hc-main,.hc-float').forEach(function(e){ e.style.translate=''; }); return; }
      q('.hc-stage').forEach(function(st){
        var r=st.getBoundingClientRect(), y=Math.max(-400,Math.min(900,innerHeight-r.top));
        var m=st.querySelector('.hc-main'), f=st.querySelector('.hc-float');
        if(m) m.style.translate='0 '+(-(y*0.035)).toFixed(1)+'px';
        if(f) f.style.translate='0 '+(-(y*0.08)).toFixed(1)+'px';
      });
    });
  }
  addEventListener('scroll',parallax,{passive:true}); addEventListener('resize',parallax);

  // 8. 밝게/어둡게 전환 효과
  D.addEventListener('click',function(e){
    if(!e.target.closest || !e.target.closest('.modebtn') || B.classList.contains('c-noanim')) return;
    B.classList.add('c-modefade'); clearTimeout(window.__cmf); window.__cmf=setTimeout(function(){ B.classList.remove('c-modefade'); },650);
  },true);

  var tmr=null;
  new MutationObserver(function(){ clearTimeout(tmr); tmr=setTimeout(init,30); }).observe(B,{childList:true,subtree:true,attributes:true,attributeFilter:['data-dv']});
  if(D.readyState!=='loading') init(); else D.addEventListener('DOMContentLoaded',init);
})();

// 첫 화면 제품 창: 처음에는 숨기고 페이지를 내리면 나타남 (사용자 요청 반영 11차 (10/28))
(function(){
  var B=document.body;
  function check(){
    if((window.scrollY||document.documentElement.scrollTop)<=24) return;
    document.querySelectorAll('#sc_hero_c .hc-stage:not(.hc-on)').forEach(function(e){ e.classList.add('hc-on'); });
  }
  B.classList.add('hrev');
  addEventListener('scroll',check,{passive:true});
  check();
})();
