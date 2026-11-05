(function(){
function act(a){
 if(a.hasAttribute('data-sv-next')){var w=a.closest('.sv');var st=+w.getAttribute('data-step')||1;w.setAttribute('data-step',st>=3?1:st+1);return;}
 if(a.hasAttribute('data-wf')){var box=a.closest('.wf'),k=a.getAttribute('data-wf');
  box.querySelectorAll('[data-wf]').forEach(function(b){b.classList.toggle('on',b===a);});
  box.querySelectorAll('[data-wfs]').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-wfs')===k);});}}
document.addEventListener('click',function(ev){var a=ev.target.closest&&ev.target.closest('[data-sv-next],[data-wf]');if(a)act(a);});
})();