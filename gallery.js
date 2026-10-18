/* ISAC gallery
   1. Create a folder called "gallery" next to index.html in your GitHub repo and upload the photos into it.
   2. Add one line per photo below (cap is optional). Remove the "//" at the start of the line.
   While the list is empty, the Gallery section and its menu link stay hidden. */
var GALLERY=[
  // {src:"gallery/photo1.jpg",cap:"ISAC 2025 grand finals"},
  // {src:"gallery/photo2.jpg",cap:"Winners with the trophy"},
  // {src:"gallery/photo3.jpg"},
];

(function(){
var $=function(i){return document.getElementById(i)},g=$("gal"),sec=$("gallery"),nav=$("gnav"),lb=$("lb"),li=$("lbi"),lc=$("lbc"),cur=0;
if(!GALLERY.length){sec.style.display="none";if(nav)nav.style.display="none";return}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
g.innerHTML=GALLERY.map(function(p,i){return '<figure data-i="'+i+'" tabindex="0"><img loading="lazy" src="'+esc(p.src)+'" alt="'+esc(p.cap||"ISAC photo")+'">'+(p.cap?"<figcaption>"+esc(p.cap)+"</figcaption>":"")+"</figure>"}).join("");
function show(i){cur=(i+GALLERY.length)%GALLERY.length;li.src=GALLERY[cur].src;li.alt=GALLERY[cur].cap||"ISAC photo";lc.textContent=GALLERY[cur].cap||"";lb.classList.add("on")}
function hide(){lb.classList.remove("on");li.src=""}
g.onclick=function(e){var f=e.target.closest("figure");if(f)show(+f.dataset.i)};
g.onkeydown=function(e){if(e.key==="Enter"){var f=e.target.closest("figure");if(f)show(+f.dataset.i)}};
$("lbx").onclick=hide;$("lbp").onclick=function(){show(cur-1)};$("lbnx").onclick=function(){show(cur+1)};
lb.onclick=function(e){if(e.target===lb)hide()};
addEventListener("keydown",function(e){if(!lb.classList.contains("on"))return;if(e.key==="Escape")hide();if(e.key==="ArrowLeft")show(cur-1);if(e.key==="ArrowRight")show(cur+1)});
})();
