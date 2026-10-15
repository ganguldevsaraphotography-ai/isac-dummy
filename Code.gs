// ISAC backend — paste into Extensions > Apps Script of your Google Sheet (replace the old code), then Deploy > Manage deployments > New version.
var ADMIN_PASSWORD = "change-me";   // <-- set your admin password
var DEF = {cats:[
"Programme Presenting English Junior","Programme Presenting English Intermediate","Programme Presenting English Senior",
"Programme Presenting Sinhala Junior","Programme Presenting Sinhala Intermediate","Programme Presenting Sinhala Senior",
"Programme Presenting Tamil Junior","Programme Presenting Tamil Intermediate","Programme Presenting Tamil Senior",
"News Reading English Junior","News Reading English Intermediate","News Reading English Senior",
"News Reading Sinhala Junior","News Reading Sinhala Intermediate","News Reading Sinhala Senior",
"News Reading Tamil Junior","News Reading Tamil Intermediate","News Reading Tamil Senior",
"News Editing English Junior","News Editing English Intermediate","News Editing English Senior",
"News Editing Sinhala Junior","News Editing Sinhala Intermediate","News Editing Sinhala Senior",
"News Editing Tamil Junior","News Editing Tamil Intermediate","News Editing Tamil Senior",
"Podcast Presentation English Open","Podcast Presentation Sinhala Open",
"Dubbing English Open","Dubbing Sinhala Open",
"Sports Commentary English Open","Sports Commentary Sinhala Open",
"News Blogging Open","News & Template Round Open","Wild Card - Best Announcer Selection Round Open"]};
var SLOTS = 2;  // contestants per competition category
var SH = ["School code","School","Teacher in charge","Teacher email","Phone","President","President email","President phone","Registered"];
var CH = ["Contestant code","Name","School code","School","Category","Slot"];
var ABB = {Programme:"Prog",Presenting:"Pres",Presentation:"Pres",Commentary:"Comm",Template:"Tmpl",English:"Eng",Sinhala:"Sin",Tamil:"Tam",Intermediate:"Inter"};

function ss_(){return SpreadsheetApp.getActiveSpreadsheet();}
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function cfg_(){var s=ss_().getSheetByName("Settings"),c={};if(s){try{c=JSON.parse(s.getRange("B1").getValue())}catch(e){}}return c;}
function cats_(){var c=cfg_();return (c.cats&&c.cats.length)?c.cats:DEF.cats;}
function sheet_(n,h){var s=ss_().getSheetByName(n);if(!s){s=ss_().insertSheet(n);s.appendRow(h);s.setFrozenRows(1);s.getRange(1,1,1,h.length).setFontWeight("bold");}return s;}
// one tab per competition category; short, unique tab names (Sheets limit is 31 characters)
function tabs_(cats){var used={},map={};cats.forEach(function(c){
  var n=c.replace(/[\[\]:*?\/\\]/g,"").split(/\s+/).map(function(w){return ABB[w]||w;}).join(" ").replace(/\s+/g," ").trim().slice(0,31),b=n,i=2;
  while(used[n.toLowerCase()]){var t=" "+i++;n=b.slice(0,31-t.length)+t;}
  used[n.toLowerCase()]=1;map[c]=n;});return map;}
function clean_(s){s=String(s==null?"":s).trim().slice(0,200);return /^[=+\-@]/.test(s)?"'"+s:s;}
function norm_(s){return String(s).toLowerCase().replace(/[^a-z0-9]/g,"");}
function rnd_(){var A="ABCDEFGHJKMNPQRSTUVWXYZ23456789",s="";for(var i=0;i<6;i++)s+=A.charAt(Math.floor(Math.random()*A.length));return "ISAC-C-"+s;}

function doGet(){var c=cfg_();return out_({headline:c.headline,sub:c.sub,about:c.about,contact:c.contact,rules:c.rules,logo:c.logo,hero:c.hero,cats:cats_()});}

function doPost(e){
  var lock=LockService.getScriptLock();lock.waitLock(25000);
  try{
    var r=JSON.parse(e.postData.contents),a=r.action;
    if(a==="registerSchool")return out_(register_(r.p));
    if(a==="schoolLogin")return out_(login_(r.code,r.email));
    if(a==="saveContestants")return out_(saveC_(r.code,r.email,r.updates));
    if(r.password!==ADMIN_PASSWORD)return out_({ok:false,error:"Wrong password"});
    if(a==="login"){var sc=sheet_("Schools",SH).getLastRow()-1,n=0,tm=tabs_(cats_());
      cats_().forEach(function(c){var s=ss_().getSheetByName(tm[c]);if(s)n+=Math.max(0,s.getLastRow()-1);});
      return out_({ok:true,url:ss_().getUrl(),schools:Math.max(0,sc),places:n});}
    if(a==="save"){var s=sheet_("Settings",["key","value"]);s.getRange("A1").setValue("config");s.getRange("B1").setValue(JSON.stringify(r.settings));
      var tm2=tabs_(cats_());cats_().forEach(function(c){sheet_(tm2[c],CH);});return out_({ok:true});}
    if(a==="upload"){var f=DriveApp.createFile(Utilities.newBlob(Utilities.base64Decode(r.data),r.type,r.name));
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);return out_({ok:true,url:"https://drive.google.com/thumbnail?id="+f.getId()+"&sz=w1600"});}
    return out_({ok:false,error:"Unknown action"});
  }catch(err){return out_({ok:false,error:String(err)});}
  finally{lock.releaseLock();}
}

// make sure every category tab has the school's contestant slots (rows are created once; codes never change)
function ensure_(code,name,fresh){
  var cats=cats_(),tm=tabs_(cats),list=[];
  cats.forEach(function(c){
    var sn=tm[c],s=sheet_(sn,CH),d=fresh?[]:s.getDataRange().getValues(),add=[];
    for(var n=1;n<=SLOTS;n++){
      var row=d.filter(function(x,i){return i>0&&x[2]===code&&x[4]===c&&Number(x[5])===n;})[0];
      if(!row){row=[rnd_(),"",code,name,c,n];add.push(row);}
      list.push({sheet:sn,code:row[0],name:row[1],cat:c,n:n});
    }
    if(add.length)s.getRange(s.getLastRow()+1,1,add.length,CH.length).setValues(add);
  });
  return list;
}

function register_(p){
  var s=sheet_("Schools",SH),d=s.getDataRange().getValues(),nm=clean_(p.name),max=0;
  if(!nm||!clean_(p.teacher)||!clean_(p.presName)||!/^\S+@\S+\.\S+$/.test(String(p.email)))return {ok:false,error:"Missing details"};
  for(var i=1;i<d.length;i++){if(norm_(d[i][1])===norm_(nm))return {ok:false,dup:true};max=Math.max(max,parseInt(String(d[i][0]).slice(1),10)||0);}
  var code="S"+("00"+(max+1)).slice(-3);
  s.appendRow([code,nm,clean_(p.teacher),String(p.email).trim().toLowerCase(),clean_(p.phone),clean_(p.presName),String(p.presEmail||"").trim().toLowerCase(),clean_(p.presPhone),new Date()]);
  ensure_(code,nm,true);
  return {ok:true,code:code,name:nm};
}

function find_(code,email){
  var d=sheet_("Schools",SH).getDataRange().getValues(),em=String(email||"").trim().toLowerCase();
  for(var i=1;i<d.length;i++)if(d[i][0]===String(code||"").trim().toUpperCase()&&em&&(d[i][3]===em||d[i][6]===em))return {code:d[i][0],name:d[i][1]};
  return null;
}
function login_(code,email){var s=find_(code,email);if(!s)return {ok:false};return {ok:true,school:s,list:ensure_(s.code,s.name)};}

// saves only the names sent (the site sends one category at a time); only touches that category's own tab
function saveC_(code,email,ups){
  var s=find_(code,email);if(!s)return {ok:false};
  var tm=tabs_(cats_()),valid={};Object.keys(tm).forEach(function(c){valid[tm[c]]=1;});var cache={};
  (ups||[]).forEach(function(u){
    if(!valid[u.sheet])return;var sh=ss_().getSheetByName(u.sheet);if(!sh)return;
    var d=cache[u.sheet]||(cache[u.sheet]=sh.getDataRange().getValues());
    for(var i=1;i<d.length;i++)if(d[i][0]===u.code&&d[i][2]===s.code){sh.getRange(i+1,2).setValue(clean_(u.name));break;}
  });
  return {ok:true};
}
