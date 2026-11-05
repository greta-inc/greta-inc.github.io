// 개편 시안 v2: 페이지 안 탭 · 언어 버튼(한 → EN → 日, 시안에서는 메뉴만) · 휴대폰 메뉴
(function(){
  function show(k, push){
    var p = document.querySelector('.v2panel[data-panel="'+k+'"]'); if(!p) return false;
    document.querySelectorAll('.v2panel').forEach(function(x){ x.hidden = (x!==p); });
    document.querySelectorAll('.v2t').forEach(function(b){ var on=b.getAttribute('data-tab')===k; b.classList.toggle('on',on); b.setAttribute('aria-selected',on?'true':'false'); });
    if(push){ try{ history.replaceState(null,'','#'+k); }catch(e){} }
    window.dispatchEvent(new Event('resize'));  // 숨겨져 있던 그림(캔버스 등) 크기 다시 계산
    return true;
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest && e.target.closest('.v2t'); if(!t) return;
    show(t.getAttribute('data-tab'), true);
    var bar = document.querySelector('.v2tabband'); if(bar && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({block:'start'});
  });
  function fromHash(){ var k = location.hash.slice(1); if(k) show(k, false); }
  fromHash(); window.addEventListener('hashchange', fromHash);
  // 언어: 버튼 하나로 한국어 → English → 日本語 → 한국어
  var L = ['ko','en','ja'], LB = {ko:'한', en:'EN', ja:'日'}, NEXT = {ko:'영어로 보기', en:'日本語で表示', ja:'한국어로 보기'};
  var MSG = {en:'영어판은 준비 중입니다. 시안에서는 메뉴만 영어로 바뀝니다.', ja:'일본어판은 준비 중입니다. 시안에서는 메뉴만 일본어로 바뀝니다.'};
  var tt;
  function toast(s){ var t=document.getElementById('mtoast');
    if(!t){ t=document.createElement('div'); t.id='mtoast'; t.className='mtoast'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite'); document.body.appendChild(t); }
    t.textContent=s; t.classList.add('on'); clearTimeout(tt); tt=setTimeout(function(){ t.classList.remove('on'); },3200); }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.lgc'); if(!b) return;
    var cur = b.getAttribute('data-cur')||'ko', nx = L[(L.indexOf(cur)+1)%3];
    b.setAttribute('data-cur', nx); b.textContent = LB[nx]; b.setAttribute('aria-label', NEXT[nx]);
    document.querySelectorAll('[data-'+nx+']').forEach(function(a){ a.textContent = a.getAttribute('data-'+nx); });
    document.documentElement.lang = nx==='ja' ? 'ja' : nx;
    if(MSG[nx]) toast(MSG[nx]);
  });
  // 휴대폰·좁은 화면: 메뉴 버튼으로 펼치기
  document.addEventListener('click', function(e){
    var m = e.target.closest && e.target.closest('.mtg');
    var nav = document.querySelector('.v2nav'); if(!nav) return;
    if(m){ var o = !nav.classList.contains('open'); nav.classList.toggle('open', o); m.setAttribute('aria-expanded', o?'true':'false'); return; }
    if(nav.classList.contains('open') && !e.target.closest('.v2nav')){ nav.classList.remove('open'); var mm=nav.querySelector('.mtg'); if(mm) mm.setAttribute('aria-expanded','false'); }
  });
  var bd = document.createElement('div'); bd.className='v2badge'; bd.textContent='개편 시안(v2) · 확정 전'; document.body.appendChild(bd);
})();
