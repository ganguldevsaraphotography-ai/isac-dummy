/* Find my competition room: contestant code -> competition room + waiting room + map pins.
   A code starts with the initials of its category name (News Presenting Sinhala Junior = NPSJ...). */
(function(){
var f=document.getElementById("frf");if(!f)return;
var inp=document.getElementById("frc"),msg=document.getElementById("frm"),res=document.getElementById("frr"),map=document.getElementById("frmap"),refs=document.getElementById("refs");
/* where each numbered spot sits on site-map-single.jpg, in % of the image */
var POS={1:[39.4,31.2],2:[26.6,32.1],3:[33.2,63.9],4:[49.6,78.7],5:[85.5,78.0],6:[27.1,89.9],7:[78.1,34.7],8:[11.2,52.4]};
var SATH="Sathmahala",K="Kularathne Auditorium",ART="Art Section",BIO="Biology Section",G11="Grade 11 Section",TECH="Technology Section";
function rm(r,where,sec,tag){return{r:r,w:where,s:sec,t:tag||""}}
function s1(r,t){return rm(r,SATH+" · 1st floor",2,t)}
function s2(r,t){return rm(r,SATH+" · 2nd floor",2,t)}
function s3(r,t){return rm(r,SATH+" · 3rd floor",2,t)}
function s4(r,t){return rm(r,SATH+" · 4th floor",2,t)}
var D={
"News Presenting Sinhala Junior":{c:[s2("7^1","Competition Room 1"),s2("7^3","Competition Room 2")],w:[s2("7^2")],n:"Two competition rooms are used for this category. The coordinators will tell you which one is yours."},
"News Presenting Sinhala Intermediate":{c:[s2("7^4","Competition Room 1"),s2("7^6","Competition Room 2")],w:[s2("7^5"),s2("7^10","Int./Senior waiting room 2")],n:"Two competition rooms are used for this category. The coordinators will tell you which one is yours."},
"News Presenting Sinhala Senior":{c:[s2("7^7","Competition Room 1"),s2("7^9","Competition Room 2")],w:[s2("7^8","Waiting Room 1"),s2("7^10","Int./Senior waiting room 2")],n:"Two competition rooms are used for this category. The coordinators will tell you which one is yours."},
"News Presenting English Junior":{c:[s3("8^1")],w:[s3("8^2"),s3("8^7","Junior/Int./Senior waiting room")]},
"News Presenting English Intermediate":{c:[s3("8^3")],w:[s3("8^4"),s3("8^7","Junior/Int./Senior waiting room")]},
"News Presenting English Senior":{c:[s3("8^5")],w:[s3("8^6"),s3("8^7","Junior/Int./Senior waiting room")]},
"News Presenting Tamil Junior":{c:[s4("9^1")],w:[s4("9^2")]},
"News Presenting Tamil Intermediate":{c:[s4("9^3")],w:[s4("9^4")]},
"News Presenting Tamil Senior":{c:[s4("9^5")],w:[s4("9^6")]},
"News Editing Sinhala Junior":{c:[s1("6^1")]},
"News Editing Sinhala Intermediate":{c:[s1("6^2")]},
"News Editing Sinhala Senior":{c:[s1("6^3")]},
"News Editing English Junior":{c:[s1("6^4")]},
"News Editing English Intermediate":{c:[s1("6^5")]},
"News Editing English Senior":{c:[s1("6^6")]},
"News Editing Tamil Junior":{c:[s1("6^7")]},
"News Editing Tamil Intermediate":{c:[s1("6^8","Tamil Senior and Intermediate")]},
"News Editing Tamil Senior":{c:[s1("6^8","Tamil Senior and Intermediate")]},
"Event Announcing Sinhala Junior":{c:[rm("11^3",G11+" · 3rd floor",6)],w:[rm("11^4",G11+" · 2nd floor",6)]},
"Event Announcing Sinhala Intermediate":{c:[rm("11^1",G11+" · 3rd floor",6)],w:[rm("11^2",G11+" · 3rd floor",6)]},
"Event Announcing Sinhala Senior":{c:[rm("Moore Hall",SATH+" · 6th floor",2)],w:[s4("9^11")]},
"Event Announcing English Junior":{c:[rm("11^7",G11+" · 2nd floor",6)],w:[rm("11^8",G11+" · 1st floor",6)]},
"Event Announcing English Intermediate":{c:[rm("11^5",G11+" · 2nd floor",6)],w:[rm("11^6",G11+" · 2nd floor",6)]},
"Event Announcing English Senior":{c:[rm(K,"Main hall",1)],w:[s1("6^10","English event announcing waiting room")]},
"Event Announcing Tamil Open":{c:[rm("11^9",G11+" · 1st floor",6)],w:[rm("11^10",G11+" · 1st floor",6)]},
"Podcast Presenting Sinhala Open":{c:[rm(TECH,"Competition room",7)],w:[rm(TECH,"Waiting room",7)]},
"Podcast Presenting English Open":{c:[rm("ACRC Studios","Next to the Siyawasa building",1)],w:[s1("6^11","English podcast presenting waiting room")]},
"Sports Commentary Sinhala Open":{c:[rm("13A1",ART+" · 1st floor",4)],w:[rm("12A2",ART+" · 2nd floor",4)]},
"Sports Commentary English Open":{c:[rm("German Room",ART+" · 2nd floor",4)],w:[rm("12A1",ART+" · 2nd floor",4)]},
"Dubbing Sinhala Open":{c:[rm("13B1",BIO+" · 2nd floor",5,"Senior"),rm("13BE1",BIO+" · 2nd floor",5,"Junior / Intermediate")],w:[rm("13B3",BIO+" · 2nd floor",5,"Sinhala Junior / Int. / Senior")]},
"Dubbing English Open":{c:[rm("13B2",BIO+" · 2nd floor",5)],w:[rm("13B4",BIO+" · 2nd floor",5)]},
"Wild Card Sinhala Open":{c:[rm("12B4",BIO+" · 1st floor",5)],w:[rm("12B1",BIO+" · 1st floor",5)]},
"Wild Card English Open":{c:[rm("12B3",BIO+" · 1st floor",5)],w:[rm("12BE1",BIO+" · 1st floor",5)]},
"News Blogging Sinhala Open":{},"News Blogging English Open":{},"News Template Sinhala Open":{},"News Template English Open":{}
};
var LIST=Object.keys(D).map(function(n){return{n:n,k:n.split(/\s+/).map(function(w){return w.charAt(0)}).join("").toUpperCase()}}).sort(function(a,b){return b.k.length-a.k.length});
function sup(t){return esc(t).replace(/\^(\d+)/g,"<sup>$1</sup>")}
function rows(a,cls,label){
 if(!a||!a.length)return '<div class="rb '+cls+'"><h4><i class="d '+cls+'"></i>'+label+'</h4><p class="rn">To be announced. Please check with the coordinators on the day.</p></div>';
 return '<div class="rb '+cls+'"><h4><i class="d '+cls+'"></i>'+label+'</h4>'+a.map(function(x){return '<div class="rr"><b>'+sup(x.r)+'</b><span>'+esc(x.w)+(x.t?" · "+esc(x.t):"")+'</span></div>'}).join("")+'</div>'}
function clear(){res.hidden=true;res.innerHTML="";msg.textContent="";msg.className="frmsg";[].forEach.call(map.querySelectorAll(".pin"),function(p){p.remove()});[].forEach.call(refs.children,function(l){l.className=""})}
function pins(c,w){
 var used={};
 function put(a,cls){(a||[]).forEach(function(x){var key=x.s+cls;if(used[key])return;used[key]=1;var p=POS[x.s];if(!p)return;
  var e=document.createElement("span");e.className="pin "+cls;e.style.left=p[0]+"%";e.style.top=p[1]+"%";
  if(cls==="w"&&used[x.s+"c"])e.className+=" off";e.title=(cls==="c"?"Competition room":"Waiting room");map.appendChild(e);
  var li=refs.querySelector('[data-n="'+x.s+'"]');if(li&&li.className.indexOf(cls)<0)li.className=(li.className+" "+cls).trim()})}
 put(c,"c");put(w,"w")}
f.addEventListener("submit",function(e){e.preventDefault();clear();
 var raw=inp.value.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");
 if(!raw){msg.textContent="Enter your contestant code.";msg.className="frmsg bad";return}
 var hit=null,num=0;for(var i=0;i<LIST.length;i++){var k=LIST[i].k;if(raw.indexOf(k)===0){var rest=raw.slice(k.length);if(/^\d{1,2}$/.test(rest)&&+rest>=1&&+rest<=52){hit=LIST[i];num=+rest}break}}
 if(!hit){msg.textContent="We couldn't match that code. Codes look like NPSJ01 (category letters + number 01 to 52). Check it and try again.";msg.className="frmsg bad";return}
 var shown=hit.k+(num<10?"0":"")+num;
 var d=D[hit.n];
 res.innerHTML='<p class="rcat">'+esc(hit.n)+'</p><p class="rcode">'+esc(shown)+'</p>'+rows(d.c,"c","Competition room")+rows(d.w,"w","Waiting room")+(d.n?'<p class="rn">'+esc(d.n)+'</p>':"");
 res.hidden=false;pins(d.c,d.w);
});
inp.addEventListener("input",function(){if(!inp.value.trim())clear()});
})();
