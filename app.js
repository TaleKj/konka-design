// app.js — samlet JavaScript for Konka Design System
// Hver blokk er en selvstendig IIFE og deler ikke scope.

// --- Blokk 1: Personlige tidsvinduer (PEOPLE) ---
        (function(){
          var PEOPLE = [
            {id:"E",name:"Emma Hansen", color:"#91BCFF", windows:[{peak:6.25,ws:5.5,we:7.5}]},
            {id:"M",name:"Mia Andersen",color:"#FFA39B", windows:[{peak:7.75,ws:7.0,we:9.0}]},
            {id:"L",name:"Lars Berg",   color:"#FAD067", windows:[{peak:12.5,ws:11.75,we:13.25},{peak:17.25,ws:16.5,we:18.0}]},
            {id:"S",name:"Sara Lund",   color:"#8FD6E7", windows:[{peak:17.5,ws:16.5,we:18.5}]},
            {id:"N",name:"Nora Viken",  color:"#B7A0EC", windows:[{peak:6.0,ws:5.25,we:7.0},{peak:22.0,ws:21.0,we:22.75}]}
          ];
          var CATS = {
            morgenfugl:  {label:"Morgenfugl",  emoji:"🌅", tint:"#FFF6DE", ink:"#B8860B"},
            formiddag:   {label:"Formiddag",   emoji:"🌤️", tint:"#EAF2FF", ink:"#2563A8"},
            lunsj:       {label:"Lunsjtimer",  emoji:"🥪", tint:"#EAF2FF", ink:"#2563A8"},
            ettermiddag: {label:"Ettermiddag", emoji:"☀️", tint:"#FFEBF6", ink:"#B03580"},
            etterjobb:   {label:"Etter jobb",  emoji:"💼", tint:"#FFEBF6", ink:"#B03580"},
            kveld:       {label:"Kveldsøkter", emoji:"🌙", tint:"#F1ECFC", ink:"#5B35A8"},
            dobbel:      {label:"Variert",     emoji:"🔄", tint:"#EAF7EF", ink:"#2E8B57"}
          };
          function catFor(ws){
            if(ws.length>1) return "dobbel";
            var pk=ws[0].peak;
            if(pk<8)  return "morgenfugl";
            if(pk<11) return "formiddag";
            if(pk<14) return "lunsj";
            if(pk<17) return "ettermiddag";
            if(pk<20) return "etterjobb";
            return "kveld";
          }
          function fmtH(h){var hh=Math.floor(h),mm=Math.round((h-hh)*60);return(hh<10?"0":"")+hh+":"+(mm<10?"0":"")+mm;}
          var revealed=null;
          var grid=document.getElementById("tid-grid");
          function buildCards(){
            grid.innerHTML="";
            PEOPLE.forEach(function(p){
              var cat=CATS[catFor(p.windows)];
              var isRev=revealed===p.id;
              var btn=document.createElement("button");
              btn.dataset.id=p.id;
              btn.style.cssText="position:relative;background:"+cat.tint+";border-radius:14px;border:none;padding:11px 4px 9px;cursor:pointer;overflow:hidden;font-family:inherit;min-height:92px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;transition:transform .15s;";
              var times=p.windows.map(function(w){return '<span style="font-size:10px;font-weight:700;color:'+cat.ink+';font-variant-numeric:tabular-nums;line-height:1.3;">'+fmtH(w.ws)+"–"+fmtH(w.we)+'</span>';}).join("");
              if(isRev){
                btn.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;gap:3px;"><span style="font-size:17px;">'+cat.emoji+'</span>'+times+'</div>';
              } else {
                btn.innerHTML='<div style="display:flex;flex-direction:column;align-items:center;gap:5px;"><div style="width:34px;height:34px;border-radius:50%;background:'+p.color+';display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.15);">'+p.id+'</div><span style="font-size:10px;font-weight:700;color:'+cat.ink+';line-height:1.15;text-align:center;">'+cat.label+'</span></div>';
              }
              btn.addEventListener("click",function(){revealed=revealed===p.id?null:p.id;buildCards();});
              grid.appendChild(btn);
            });
          }
          buildCards();
          // Back-liste
          var bl=document.getElementById("tid-back-list");
          PEOPLE.forEach(function(p){
            var cat=CATS[catFor(p.windows)];
            var times=p.windows.map(function(w){return fmtH(w.ws)+"–"+fmtH(w.we);}).join(", ");
            var row=document.createElement("div");
            row.style.cssText="display:flex;align-items:center;gap:10px;";
            row.innerHTML='<div style="width:32px;height:32px;border-radius:50%;background:'+p.color+';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;">'+p.id+'</div><div><div style="font-size:14px;color:#3A3A3C;">'+p.name+'</div><div style="font-size:11px;color:#8E8E93;">'+cat.emoji+" "+cat.label+" · "+times+'</div></div>';
            bl.appendChild(row);
          });
        })();


/* ===================================================================== */

// --- Blokk 2: Personlige profiler (kondis/styrke) ---
          (function(){
            var P = {
              mia:  {initials:"MK", color:"#91BCFF", kondis:72, styrke:28},
              sara: {initials:"SL", color:"#FFA39B", kondis:58, styrke:42},
              lars: {initials:"LA", color:"#F8C696", kondis:45, styrke:55},
              erik: {initials:"EH", color:"#8FD6E7", kondis:24, styrke:76},
              nora: {initials:"NO", color:"#B7A0EC", kondis:63, styrke:37}
            };
            var card = document.getElementById("d-forebyggern");
            var CX=180, PIVOT_Y=92, BEAM_HALF=130, ROPE_LEN=46, BOWL_R=52, BLOCK_H=18, BLOCK_MAX_W=72, BLOCK_MIN_W=18;
            function bw(a){ return BLOCK_MIN_W+(BLOCK_MAX_W-BLOCK_MIN_W)*(a/100); }
            function update(id){
              var p = P[id];
              var tilt = (p.styrke-p.kondis)/100;
              var tiltDeg = tilt*7;
              var rad = tiltDeg*Math.PI/180;
              var leftEndX = CX+Math.cos(Math.PI+rad)*BEAM_HALF;
              var leftEndY = PIVOT_Y+Math.sin(Math.PI+rad)*BEAM_HALF;
              var rightEndX = CX+Math.cos(rad)*BEAM_HALF;
              var rightEndY = PIVOT_Y+Math.sin(rad)*BEAM_HALF;
              var lpx=leftEndX, lpy=leftEndY+ROPE_LEN, rpx=rightEndX, rpy=rightEndY+ROPE_LEN;
              card.querySelector("#forb-beam").style.transform = "rotate("+tiltDeg+"deg)";
              var rl=card.querySelector("#forb-rope-l"); rl.setAttribute("x1",leftEndX); rl.setAttribute("y1",leftEndY); rl.setAttribute("x2",lpx); rl.setAttribute("y2",lpy);
              var rr=card.querySelector("#forb-rope-r"); rr.setAttribute("x1",rightEndX); rr.setAttribute("y1",rightEndY); rr.setAttribute("x2",rpx); rr.setAttribute("y2",rpy);
              var kw=bw(p.kondis), sw=bw(p.styrke);
              var bl=card.querySelector("#forb-block-l"); bl.setAttribute("x",lpx-kw/2); bl.setAttribute("y",lpy-6-BLOCK_H); bl.setAttribute("width",kw); bl.setAttribute("fill",p.color);
              var br=card.querySelector("#forb-block-r"); br.setAttribute("x",rpx-sw/2); br.setAttribute("y",rpy-6-BLOCK_H); br.setAttribute("width",sw); br.setAttribute("fill",p.color);
              card.querySelector("#forb-bowl-l").setAttribute("d","M "+(lpx-BOWL_R)+" "+lpy+" A "+BOWL_R+" "+BOWL_R+" 0 0 0 "+(lpx+BOWL_R)+" "+lpy+" Z");
              card.querySelector("#forb-bowl-r").setAttribute("d","M "+(rpx-BOWL_R)+" "+rpy+" A "+BOWL_R+" "+BOWL_R+" 0 0 0 "+(rpx+BOWL_R)+" "+rpy+" Z");
              card.querySelector("#forb-kondis-val").textContent = p.kondis+"%";
              card.querySelector("#forb-styrke-val").textContent = p.styrke+"%";
              var diff = p.kondis-p.styrke, label;
              if(Math.abs(diff)<12) label="i god balanse";
              else if(diff>0) label="trener mest kondis";
              else label="trener mest styrke";
              card.querySelector("#forb-status").textContent = p.initials+" "+label;
              card.querySelectorAll(".forb-pick").forEach(function(btn){
                var sel = btn.getAttribute("data-id")===id;
                btn.style.border = sel ? "2.5px solid #1C1C1E" : "2.5px solid transparent";
                btn.style.transform = sel ? "translateY(-3px)" : "translateY(0)";
              });
            }
            card.querySelectorAll(".forb-pick").forEach(function(btn){
              btn.addEventListener("click",function(){ update(btn.getAttribute("data-id")); });
            });
          })();


/* ===================================================================== */

// --- Blokk 3: Diagram – Wattmåleren ---
          (function(){
            var card = document.getElementById("d-wattmaleren");
            var S = function(m,s){return m*60+s;};
            var PAL = {
              kornblomst:{base:"#91BCFF",dark:"#5E96F0"},
              korall:    {base:"#FFA39B",dark:"#D95C52"},
              fersken:   {base:"#F8C696",dark:"#CC8442"},
              mint:      {base:"#8FD6E7",dark:"#3E96AC"},
              lavendel:  {base:"#B7A0EC",dark:"#7A5BC8"}
            };
            var ZONE_NAMES = ["Rolig","Moderat","Hard"];
            var ZONE_COLORS = ["#AADEEE","#FCE190","#FFBAB3"];
            // Skala/enhet/sonegrenser per sport. invert=true: rask tid -> høyre.
            var SCALES = {
              sykling: {unit:"W",        min:0,        max:350,      invert:false, pace:false, zoneStops:[150,240]},
              lop:     {unit:"min/km",   min:S(7,0),   max:S(3,0),   invert:true,  pace:true,  zoneStops:[S(5,0),S(4,0)]},
              svomming:{unit:"min/100m", min:S(2,30),  max:S(1,0),   invert:true,  pace:true,  zoneStops:[S(2,0),S(1,30)]},
              roing:   {unit:"min/500m", min:S(2,30),  max:S(1,30),  invert:true,  pace:true,  zoneStops:[S(2,10),S(1,55)]}
            };
            var SPORTS = [
              {key:"sykling", label:"Sykling", icon:"🚴",short:"sykling"},
              {key:"lop",     label:"Løping",  icon:"🏃",short:"løping"},
              {key:"svomming",label:"Svømming",icon:"🏊",short:"svømming"},
              {key:"roing",   label:"Roing",   icon:"🚣",short:"roing"}
            ];
            var METRICS = [
              {key:"snitt",label:"Snitt",    icon:"⌀",short:"Gjennomsnitt"},
              {key:"best", label:"Beste tur",icon:"★",short:"Beste enkelttur"}
            ];
            // Testdata. Watt i W, pace i sekunder. null = mangler utstyr/data.
            var MEMBERS = [
              {id:"MK",color:"kornblomst",
                snitt:{sykling:228,lop:S(4,12),svomming:S(1,38),roing:S(1,52)},
                best: {sykling:256,lop:S(3,58),svomming:S(1,31),roing:S(1,46)}},
              {id:"SL",color:"korall",
                snitt:{sykling:190,lop:S(4,28),svomming:S(1,45),roing:null},
                best: {sykling:214,lop:S(4,11),svomming:S(1,39),roing:null}},
              {id:"LA",color:"fersken",
                snitt:{sykling:166,lop:S(4,35),svomming:S(1,52),roing:S(2,1)},
                best: {sykling:188,lop:S(4,20),svomming:S(1,46),roing:S(1,54)}},
              {id:"EH",color:"mint",
                snitt:{sykling:134,lop:S(5,2), svomming:S(2,3), roing:null},
                best: {sykling:152,lop:S(4,47),svomming:S(1,55),roing:null}},
              {id:"NO",color:"lavendel",
                snitt:{sykling:null,lop:S(5,20),svomming:S(2,12),roing:S(2,9)},
                best: {sykling:null,lop:S(5,3), svomming:S(2,4), roing:S(2,2)}}
            ];
            var G = {cx:150,cy:150,r:120,rInner:88,startA:180,endA:0};
            var state = {sport:"sykling",metric:"snitt",selected:"MK",shown:0};

            function polar(cx,cy,r,deg){var a=deg*Math.PI/180;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];}
            function valToAngle(t){return G.startA+(G.endA-G.startA)*t;}
            function arcPath(r,t0,t1){
              var a0=valToAngle(t0),a1=valToAngle(t1);
              var p0=polar(G.cx,G.cy,r,a0),p1=polar(G.cx,G.cy,r,a1);
              var large=Math.abs(a1-a0)>180?1:0;
              return "M "+p0[0]+" "+p0[1]+" A "+r+" "+r+" 0 "+large+" 1 "+p1[0]+" "+p1[1];
            }
            function toT(sport,v){if(v==null)return null;var sc=SCALES[sport];var t=(v-sc.min)/(sc.max-sc.min);return Math.max(0,Math.min(1,t));}
            function fmt(sport,v){if(v==null)return "—";var sc=SCALES[sport];if(sc.pace){var m=Math.floor(v/60),s=v%60;return m+":"+(s<10?"0"+s:s);}return ""+v;}
            function zoneSegments(sport){var sc=SCALES[sport];var a=toT(sport,sc.zoneStops[0]),b=toT(sport,sc.zoneStops[1]);var arr=[a,b].sort(function(x,y){return x-y;});return [[0,arr[0]],[arr[0],arr[1]],[arr[1],1]];}
            function tickMarks(sport){var sc=SCALES[sport];if(!sc.pace)return [0,50,100,150,200,250,300,350];var lo=Math.min(sc.min,sc.max),hi=Math.max(sc.min,sc.max),step=30,out=[];for(var s=Math.ceil(lo/step)*step;s<=hi+0.5;s+=step)out.push(s);return out;}
            function svgEl(tag,attrs){var e=document.createElementNS("http://www.w3.org/2000/svg",tag);for(var k in attrs){e.setAttribute(k,attrs[k]);}return e;}

            var gauge = card.querySelector(".watt-gauge");
            var zoneLayer = svgEl("g",{}); gauge.appendChild(zoneLayer);
            var tickLayer = svgEl("g",{}); gauge.appendChild(tickLayer);
            var needle = svgEl("line",{"stroke-width":"3.5","stroke-linecap":"round"}); gauge.appendChild(needle);
            var hub = svgEl("circle",{cx:G.cx,cy:G.cy,r:18,stroke:"#fff","stroke-width":"3"}); gauge.appendChild(hub);
            var hubText = svgEl("text",{x:G.cx,y:G.cy+4,"text-anchor":"middle","font-size":"13","font-weight":"700","letter-spacing":"0.3"}); gauge.appendChild(hubText);

            function buildGaugeStatic(){
              while(zoneLayer.firstChild)zoneLayer.removeChild(zoneLayer.firstChild);
              while(tickLayer.firstChild)tickLayer.removeChild(tickLayer.firstChild);
              var mid=(G.r+G.rInner)/2, sw=G.r-G.rInner;
              var segs=zoneSegments(state.sport);
              for(var i=0;i<segs.length;i++){
                zoneLayer.appendChild(svgEl("path",{d:arcPath(mid,segs[i][0],segs[i][1]),fill:"none",stroke:ZONE_COLORS[i],"stroke-width":sw}));
              }
              var marks=tickMarks(state.sport), sc=SCALES[state.sport];
              for(var j=0;j<marks.length;j++){
                var w=marks[j], tt=toT(state.sport,w); if(tt==null)continue;
                var a=valToAngle(tt), major=sc.pace?(w%60===0):(w%100===0);
                var pi=polar(G.cx,G.cy,G.rInner-3,a), po=polar(G.cx,G.cy,G.r+2,a);
                tickLayer.appendChild(svgEl("line",{x1:pi[0],y1:pi[1],x2:po[0],y2:po[1],stroke:major?"#fff":"#ffffffcc","stroke-width":major?2:1.2}));
                if(major){var pt=polar(G.cx,G.cy,G.rInner-15,a);var t=svgEl("text",{x:pt[0],y:pt[1]+3,"text-anchor":"middle","font-size":"8.5","font-weight":"600",fill:"#9A9AA0"});t.textContent=fmt(state.sport,w);tickLayer.appendChild(t);}
              }
            }

            function curMember(){for(var i=0;i<MEMBERS.length;i++){if(MEMBERS[i].id===state.selected)return MEMBERS[i];}}
            function curValue(m){return m[state.metric][state.sport];}

            var raf=null;
            function animateNeedle(target,col){
              if(raf)cancelAnimationFrame(raf);
              var from=state.shown, start=null, dur=650;
              function tick(ts){
                if(!start)start=ts;
                var p=Math.min((ts-start)/dur,1), e=1-Math.pow(1-p,3);
                state.shown=from+(target-from)*e;
                var a=valToAngle(state.shown), tip=polar(G.cx,G.cy,G.r-16,a);
                needle.setAttribute("x1",G.cx);needle.setAttribute("y1",G.cy);
                needle.setAttribute("x2",tip[0]);needle.setAttribute("y2",tip[1]);
                needle.setAttribute("stroke",col);
                if(p<1)raf=requestAnimationFrame(tick);
              }
              raf=requestAnimationFrame(tick);
            }

            function buildZonesLegend(){
              var wrap=card.querySelector(".watt-zones"); wrap.innerHTML="";
              for(var i=0;i<ZONE_NAMES.length;i++){
                var s=document.createElement("span");
                s.style.cssText="display:flex;align-items:center;gap:5px;font-size:10px;color:#9A9AA0;font-weight:500;";
                s.innerHTML='<span style="width:9px;height:9px;border-radius:50%;background:'+ZONE_COLORS[i]+';"></span>'+ZONE_NAMES[i];
                wrap.appendChild(s);
              }
            }

            function render(){
              var m=curMember(), pal=PAL[m.color], v=curValue(m), has=(v!=null), sc=SCALES[state.sport];
              var sp=null,me=null,i;
              for(i=0;i<SPORTS.length;i++)if(SPORTS[i].key===state.sport)sp=SPORTS[i];
              for(i=0;i<METRICS.length;i++)if(METRICS[i].key===state.metric)me=METRICS[i];
              card.querySelector(".watt-sub").textContent = me.short+" · "+sp.short+" · "+sc.unit;
              card.querySelector(".watt-value").textContent = has? fmt(state.sport,v) : "—";
              card.querySelector(".watt-value").style.color = has? "#1C1C1E":"#C7C7CC";
              card.querySelector(".watt-unit").textContent = has? sc.unit:"";
              card.querySelector(".watt-value-sub").textContent = has? (sc.pace?"tempo":"effekt") : "ingen data for denne sporten";
              card.querySelector(".watt-hint").textContent = "Trykk på en deltaker for å se deres "+(sc.pace?"tempo":"watt");
              hub.setAttribute("fill", has? pal.base : "#E6E6EA");
              hubText.setAttribute("fill", has? "#fff":"#A8A8B0");
              hubText.textContent = m.id;
              needle.style.display = has? "block":"none";
              animateNeedle(has? toT(state.sport,v):0, pal.dark);
              card.querySelectorAll(".watt-pick").forEach(function(btn){
                var id=btn.getAttribute("data-id"), mm=null;
                for(var k=0;k<MEMBERS.length;k++){if(MEMBERS[k].id===id)mm=MEMBERS[k];}
                var pv=mm[state.metric][state.sport], ph=(pv!=null), pp=PAL[mm.color], sel=(id===state.selected);
                btn.style.background = ph? pp.base : "#E6E6EA";
                btn.style.color = ph? "#fff":"#A8A8B0";
                btn.style.border = sel? ("2.5px solid "+(ph?pp.dark:"#B8B8C0")) : "2.5px solid transparent";
                btn.style.boxShadow = sel? "0 0 0 2px #fff inset":"none";
                btn.style.transform = sel? "translateY(-3px)":"translateY(0)";
              });
            }

            // bygg pickers
            var pickWrap=card.querySelector(".watt-pickers");
            MEMBERS.forEach(function(m){
              var b=document.createElement("button");
              b.className="watt-pick"; b.setAttribute("data-id",m.id); b.textContent=m.id;
              b.style.cssText="width:38px;height:38px;border-radius:50%;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;letter-spacing:0.3px;transition:all .25s cubic-bezier(.34,1.2,.55,1);border:2.5px solid transparent;";
              b.addEventListener("click",function(){state.selected=m.id;render();});
              pickWrap.appendChild(b);
            });

            // bygg dropdowns
            function buildDropdown(which,options){
              var dd=card.querySelector('.watt-dropdown[data-for="'+which+'"]'); dd.innerHTML="";
              options.forEach(function(o){
                var b=document.createElement("button");
                var sel=(which==="sport"?state.sport:state.metric)===o.key;
                b.style.cssText="display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;border-radius:8px;border:none;cursor:pointer;background:"+(sel?"#F4F4F6":"transparent")+";text-align:left;font-size:12.5px;font-weight:"+(sel?700:500)+";color:#1C1C1E;";
                b.innerHTML='<span style="width:16px;text-align:center;">'+o.icon+'</span>'+o.label+(sel?'<span style="margin-left:auto;color:#E880C4;">✓</span>':'');
                b.addEventListener("click",function(ev){
                  ev.stopPropagation();
                  if(which==="sport")state.sport=o.key; else state.metric=o.key;
                  var pill=card.querySelector('.watt-pill[data-menu="'+which+'"]');
                  pill.querySelector(".watt-pill-label").textContent=o.label;
                  pill.querySelector(".watt-pill-icon").textContent=o.icon;
                  dd.style.display="none";
                  buildDropdown("sport",SPORTS); buildDropdown("metric",METRICS);
                  if(which==="sport"){buildGaugeStatic();}
                  render();
                });
                dd.appendChild(b);
              });
            }
            buildDropdown("sport",SPORTS);
            buildDropdown("metric",METRICS);

            card.querySelectorAll(".watt-pill").forEach(function(pill){
              pill.addEventListener("click",function(ev){
                ev.stopPropagation();
                var which=pill.getAttribute("data-menu");
                var dd=card.querySelector('.watt-dropdown[data-for="'+which+'"]');
                var open=dd.style.display!=="none";
                card.querySelectorAll(".watt-dropdown").forEach(function(d){d.style.display="none";});
                dd.style.display=open?"none":"block";
              });
            });
            document.addEventListener("click",function(){
              card.querySelectorAll(".watt-dropdown").forEach(function(d){d.style.display="none";});
            });

            buildZonesLegend();
            buildGaugeStatic();
            render();
          })();


/* ===================================================================== */

// --- Blokk 4: Diagram – Frekvensnerd ---
          (function(){
            var card = document.getElementById("d-frekvensnerd");
            var PALETTE = {
              korall:{bar:"#FFA39B"}, fersken:{bar:"#F8C696"}, gull:{bar:"#FAD067"},
              mint:{bar:"#8FD6E7"}, kornblomst:{bar:"#91BCFF"}, lavendel:{bar:"#B7A0EC"}, rosa:{bar:"#FFB2E3"}
            };
            var ZONE = { edge:"#E880C4", fill:"rgba(255,178,227,0.18)", text:"#C050A0" };
            var MEMBERS = [
              {id:"m1", initials:"MK", color:"kornblomst"},
              {id:"m2", initials:"SL", color:"korall"},
              {id:"m3", initials:"LA", color:"fersken"},
              {id:"m4", initials:"EH", color:"mint"},
              {id:"m5", initials:"NO", color:"lavendel"}
            ];
            var DATA = {
              lop: {
                unit:"spm", axisMin:140, axisMax:200, optimal:[170,185],
                label:"Stegfrekvens", ticks:[140,155,170,185,200],
                ranges:{ m1:[176,192], m2:[171,184], m3:[162,178], m4:[168,183], m5:[150,167] }
              },
              sykkel: {
                unit:"RPM", axisMin:55, axisMax:115, optimal:[80,100],
                label:"Tråkkfrekvens", ticks:[55,70,85,100,115],
                ranges:{ m1:[88,106], m2:[82,99], m3:[74,92], m4:[79,97], m5:[60,78] }
              }
            };
            var sport = "lop";

            function render(){
              var d = DATA[sport];
              var span = d.axisMax - d.axisMin;
              function pct(v){ return ((v - d.axisMin) / span) * 100; }
              var optA = d.optimal[0], optB = d.optimal[1];
              var optLoPct = pct(optA), optHiPct = pct(optB);

              // Tittel
              card.querySelector(".freq-title").textContent = d.label;

              // Toggle-stiler
              card.querySelectorAll(".freq-toggle").forEach(function(btn){
                var on = btn.getAttribute("data-sport") === sport;
                btn.style.background = on ? "#1C1C1E" : "#F2F2F7";
                btn.style.color = on ? "#fff" : "#888";
                btn.style.fontWeight = on ? "600" : "400";
              });

              // Akse-ticks
              var ticksEl = card.querySelector(".freq-ticks");
              ticksEl.innerHTML = "";
              d.ticks.forEach(function(t){
                var s = document.createElement("span");
                s.style.cssText = "font-size:9.5px;color:#bbb;font-weight:500;";
                s.textContent = t;
                ticksEl.appendChild(s);
              });

              // Rader
              var rowsEl = card.querySelector(".freq-rows");
              rowsEl.innerHTML = "";
              MEMBERS.forEach(function(m){
                var r = d.ranges[m.id];
                var lo = r[0], hi = r[1];
                var overlap = Math.max(0, Math.min(hi, optB) - Math.max(lo, optA));
                var inPct = Math.round((overlap / (hi - lo)) * 100);
                var loPct = pct(lo), hiPct = pct(hi);
                var c = PALETTE[m.color];
                var segLo = Math.max(loPct, optLoPct);
                var segHi = Math.min(hiPct, optHiPct);
                var hasOverlap = segHi > segLo;

                var row = document.createElement("div");
                row.style.cssText = "display:flex;align-items:center;";

                var overlapHtml = hasOverlap
                  ? '<div style="position:absolute;top:50%;transform:translateY(-50%);left:'+segLo+'%;width:'+(segHi-segLo)+'%;height:16px;background:'+c.bar+';border-radius:100px;z-index:2;box-shadow:0 1px 4px '+c.bar+'80;"></div>'
                  : '';

                row.innerHTML =
                  '<div style="width:34px;flex-shrink:0;">' +
                    '<div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:\'DM Sans\',sans-serif;font-size:11px;font-weight:600;color:#fff;background:'+c.bar+';">'+m.initials+'</div>' +
                  '</div>' +
                  '<div style="flex:1;height:24px;position:relative;">' +
                    '<div style="position:absolute;top:2px;bottom:2px;left:'+optLoPct+'%;width:'+(optHiPct-optLoPct)+'%;background:'+ZONE.fill+';border:1.5px dashed '+ZONE.edge+';border-radius:8px;z-index:0;"></div>' +
                    '<div style="position:absolute;top:50%;transform:translateY(-50%);left:'+loPct+'%;width:'+(hiPct-loPct)+'%;height:16px;background:'+c.bar+';opacity:0.4;border-radius:100px;z-index:1;"></div>' +
                    overlapHtml +
                  '</div>' +
                  '<div style="width:34px;display:flex;justify-content:flex-end;flex-shrink:0;">' +
                    '<span style="font-size:11.5px;font-weight:700;white-space:nowrap;color:'+(inPct>=50?ZONE.text:"#B0B0B6")+';">'+inPct+'%</span>' +
                  '</div>';

                rowsEl.appendChild(row);
              });

              // Forklaring
              card.querySelector(".freq-legend-opt").textContent = "Optimalt "+optA+"–"+optB+" "+d.unit;
            }

            card.querySelectorAll(".freq-toggle").forEach(function(btn){
              btn.addEventListener("click", function(){
                sport = btn.getAttribute("data-sport");
                render();
              });
            });

            render();
          })();


/* ===================================================================== */

// --- Blokk 5: Reveal-animasjon (IntersectionObserver) ---
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  })
);
