
(function(){
 function rng(seed){return function(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296;};}
 function gauss(r){var u=r()||1e-9,v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
 function size(c){var d=Math.min(2,window.devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;if(!w||!h)return null;c.width=w*d;c.height=h*d;var x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return [x,w,h];}
 // 첫 화면: 합성 인구를 점으로 — 원근감 있는 물결 지형
 function field(c){var z=size(c);if(!z)return;var x=z[0],w=z[1],h=z[2],r=rng(7);x.clearRect(0,0,w,h);
  var rows=66,cols=Math.round(w/8);
  for(var i=0;i<rows;i++){var t=i/(rows-1),y0=h*0.22+Math.pow(t,1.35)*h*0.8,sc=0.4+t*0.9;
   for(var j=0;j<cols;j++){var u=j/(cols-1),
     hgt=Math.sin(u*6.2+i*0.21)*18+Math.sin(u*2.1-i*0.13)*34+Math.cos(u*11+i*0.4)*6;
     var px=u*w,py=y0-hgt*sc*(1-t*0.35);
     var a=(0.24+0.56*t)*(0.62+0.38*Math.sin(u*3.1+i*0.3+1));
     var hi=r()<0.012;x.fillStyle=hi?'rgba(62,59,214,'+(a+0.35).toFixed(2)+')':'rgba(23,23,33,'+a.toFixed(2)+')';
     var s=(hi?2.4:1.25)*sc;x.beginPath();x.arc(px,py,s,0,6.283);x.fill();}}}
 // 솔루션 오른쪽: 밸류체인 연결망 — 단계별 기업 노드와 거래 연결
 function net(c){var z=size(c);if(!z)return;var x=z[0],w=z[1],h=z[2],r=rng(21);x.clearRect(0,0,w,h);
  var L=6,nodes=[];for(var l=0;l<L;l++){var n=7+Math.round(r()*6);for(var k=0;k<n;k++)nodes.push({l:l,x:w*(0.06+0.88*l/(L-1))+gauss(r)*10,y:h*(0.08+0.84*(k+0.5)/n)+gauss(r)*8,s:1+r()*2.6});}
  x.lineWidth=0.7;nodes.forEach(function(a){nodes.forEach(function(b){if(b.l===a.l+1&&r()<0.22){x.strokeStyle='rgba(144,145,255,'+(0.08+r()*0.16).toFixed(2)+')';x.beginPath();x.moveTo(a.x,a.y);x.bezierCurveTo((a.x+b.x)/2,a.y,(a.x+b.x)/2,b.y,b.x,b.y);x.stroke();}});});
  nodes.forEach(function(a){x.fillStyle=a.s>3?'rgba(184,185,255,.9)':'rgba(237,237,243,.45)';x.beginPath();x.arc(a.x,a.y,a.s,0,6.283);x.fill();});}
 // 역량: age 분포 — 품질 보고서 분위수(10·25·50·75·90%)로 만든 막대(원본)와 선(합성)
 function dist(c){var z=size(c);if(!z)return;var x=z[0],w=z[1],h=z[2];x.clearRect(0,0,w,h);
  function cdf(q){return function(a){for(var i=1;i<q.length;i++)if(a<=q[i][0])return q[i-1][1]+(q[i][1]-q[i-1][1])*(a-q[i-1][0])/(q[i][0]-q[i-1][0]);return 1;};}
  var O=cdf([[17,0],[22,.1],[28,.25],[37,.5],[48,.75],[58,.9],[90,1]]),S=cdf([[17,0],[22,.1],[28,.25],[37,.5],[48,.75],[58,.9],[90,1]]);
  var lo=17,hi=90,bw=3,n=Math.ceil((hi-lo)/bw),bars=[],mx=0;for(var i=0;i<n;i++){var v=O(lo+(i+1)*bw)-O(lo+i*bw);bars.push(v);mx=Math.max(mx,v);}
  var pad=6,H=h-22,gw=(w-pad*2)/n;
  for(i=0;i<n;i++){var bh=bars[i]/mx*(H-10);x.fillStyle='rgba(237,237,243,.22)';x.fillRect(pad+i*gw+2,H-bh,gw-4,bh);}
  // 합성: 같은 분위수에 표준편차가 약간 작은 매끈한 곡선
  x.strokeStyle='#9091FF';x.lineWidth=2.4;x.beginPath();
  for(i=0;i<=n*4;i++){var a=lo+i*bw/4,v=(S(a+bw/2)-S(a-bw/2));var k=0,sm=0;for(var d=-2;d<=2;d++){var aa=a+d*1.2;sm+=(S(aa+bw/2)-S(aa-bw/2));k++;}v=sm/k;var px=pad+(a-lo)/(hi-lo)*(w-pad*2),py=H-v/mx*(H-10);if(i)x.lineTo(px,py);else x.moveTo(px,py);}
  x.stroke();x.fillStyle='#A9AAB9';x.font='11px Pretendard, sans-serif';[20,30,40,50,60,70,80,90].forEach(function(t){x.fillText(t,pad+(t-lo)/(hi-lo)*(w-pad*2)-6,h-4);});}
 var F={field:field,net:net,dist:dist};
 function draw(){document.querySelectorAll('canvas.dfield').forEach(function(c){var f=F[c.getAttribute('data-kind')];if(f)f(c);});}
 var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(draw,150);});
 new MutationObserver(function(){clearTimeout(t);t=setTimeout(draw,60);}).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('click',function(){setTimeout(draw,50);});
 setTimeout(draw,300);
})();
