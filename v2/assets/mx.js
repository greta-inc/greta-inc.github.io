
document.addEventListener('click',function(e){var it=e.target.closest('.mx-item');if(!it||e.target.closest('.more'))return;
var box=it.closest('.mx');box.querySelectorAll('.mx-item,.mx-shot').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-k')===it.getAttribute('data-k'));});});
