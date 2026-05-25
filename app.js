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
            morgenfugl:  {label:"Morgenfugl",  emoji:"🌅", tint:"#FFFBE8", ink:"#B88A18"},
            formiddag:   {label:"Formiddag",   emoji:"🌤️", tint:"#EAF2FF", ink:"#2E6CD4"},
            lunsj:       {label:"Lunsjtimer",  emoji:"🥪", tint:"#EAF2FF", ink:"#2E6CD4"},
            ettermiddag: {label:"Ettermiddag", emoji:"☀️", tint:"#FFEEF9", ink:"#C050A0"},
            etterjobb:   {label:"Etter jobb",  emoji:"💼", tint:"#FFEEF9", ink:"#C050A0"},
            kveld:       {label:"Kveldsøkter", emoji:"🌙", tint:"#F0ECFC", ink:"#6A4CB8"},
            dobbel:      {label:"Variert",     emoji:"🔄", tint:"#E8F8FC", ink:"#3090AA"}
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
            row.innerHTML='<div style="width:32px;height:32px;border-radius:50%;background:'+p.color+';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;">'+p.id+'</div><div><div style="font-size:14px;color:#070707;">'+p.name+'</div><div style="font-size:11px;color:#888888;">'+cat.emoji+" "+cat.label+" · "+times+'</div></div>';
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
              mint:      {base:"#8FD6E7",dark:"#3090AA"},
              lavendel:  {base:"#B7A0EC",dark:"#6A4CB8"}
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
                if(major){var pt=polar(G.cx,G.cy,G.rInner-15,a);var t=svgEl("text",{x:pt[0],y:pt[1]+3,"text-anchor":"middle","font-size":"8.5","font-weight":"600",fill:"#888888"});t.textContent=fmt(state.sport,w);tickLayer.appendChild(t);}
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
                s.style.cssText="display:flex;align-items:center;gap:5px;font-size:10px;color:#888888;font-weight:500;";
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
              card.querySelector(".watt-value").style.color = has? "#1C1C1E":"#D8D8D8";
              card.querySelector(".watt-unit").textContent = has? sc.unit:"";
              card.querySelector(".watt-value-sub").textContent = has? (sc.pace?"tempo":"effekt") : "ingen data for denne sporten";
              card.querySelector(".watt-hint").textContent = "Trykk på en deltaker for å se deres "+(sc.pace?"tempo":"watt");
              hub.setAttribute("fill", has? pal.base : "#EFEFEF");
              hubText.setAttribute("fill", has? "#fff":"#888888");
              hubText.textContent = m.id;
              needle.style.display = has? "block":"none";
              animateNeedle(has? toT(state.sport,v):0, pal.dark);
              card.querySelectorAll(".watt-pick").forEach(function(btn){
                var id=btn.getAttribute("data-id"), mm=null;
                for(var k=0;k<MEMBERS.length;k++){if(MEMBERS[k].id===id)mm=MEMBERS[k];}
                var pv=mm[state.metric][state.sport], ph=(pv!=null), pp=PAL[mm.color], sel=(id===state.selected);
                btn.style.background = ph? pp.base : "#EFEFEF";
                btn.style.color = ph? "#fff":"#888888";
                btn.style.border = sel? ("2.5px solid "+(ph?pp.dark:"#B0B0B0")) : "2.5px solid transparent";
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
                b.style.cssText="display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;border-radius:8px;border:none;cursor:pointer;background:"+(sel?"#F7F7F7":"transparent")+";text-align:left;font-size:12.5px;font-weight:"+(sel?700:500)+";color:#1C1C1E;";
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
                btn.style.color = on ? "#fff" : "#888888";
                btn.style.fontWeight = on ? "600" : "400";
              });

              // Akse-ticks
              var ticksEl = card.querySelector(".freq-ticks");
              ticksEl.innerHTML = "";
              d.ticks.forEach(function(t){
                var s = document.createElement("span");
                s.style.cssText = "font-size:9.5px;color:#B0B0B0;font-weight:500;";
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
                    '<span style="font-size:11.5px;font-weight:700;white-space:nowrap;color:'+(inPct>=50?ZONE.text:"#B0B0B0")+';">'+inPct+'%</span>' +
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


/* ===================================================================== */

// --- Blokk 6: Tour de Konka (uke-view + år-view) ---
// Vanilla-port av TourDeKonka.jsx (uke) og TourDeKonkaYear.jsx (år).
// Begge tegnes inn i sine egne containere i diagram-kortet.
(function(){
  var card = document.getElementById("d-tourdekonka");        // uke-kort
  var yearCard = document.getElementById("d-tourdekonka-aar"); // år-kort (eget kort)
  if (!card && !yearCard) return;

  /* ── Palett (Konka colorpalettev2) ── */
  var PAL = {
    korall:     { base:"#FFA39B", dark:"#D95C52", soft:"#FFE8E6" },
    fersken:    { base:"#F8C696", dark:"#CC8442", soft:"#FEF0E0" },
    gull:       { base:"#FAD067", dark:"#B88A18", soft:"#FFFBE8" },
    mint:       { base:"#8FD6E7", dark:"#3090AA", soft:"#E8F8FC" },
    kornblomst: { base:"#91BCFF", dark:"#2E6CD4", soft:"#EAF2FF" },
    lavendel:   { base:"#B7A0EC", dark:"#6A4CB8", soft:"#F0ECFC" },
    rosa:       { base:"#FFB2E3", dark:"#C050A0", soft:"#FFEEF9" }
  };
  var FIELD = { goldA:"#FCE190", goldB:"#FAD067", goldLite:"#FEF0C0", vine:"#B0AA3E", vine2:"#5CB8D0" };
  var NEU = { 100:"#EFEFEF", 200:"#D8D8D8", 300:"#B0B0B0", 400:"#888888", 500:"#555555" };
  var FONT = "'DM Sans', sans-serif";
  var SVGNS = "http://www.w3.org/2000/svg";

  var SPORTS = [
    { key:"alle",     label:"Alle",     icon:"🚴" },
    { key:"sykling",  label:"Sykling",  icon:"🚴" },
    { key:"lop",      label:"Løping",   icon:"🏃" },
    { key:"svomming", label:"Svømming", icon:"🏊" },
    { key:"ski",      label:"Langrenn", icon:"⛷️" }
  ];

  function fmtNb(n){ return Math.round(n).toLocaleString("nb-NO"); }

  /* Trøye-ikon (felles for begge views). */
  function jerseyIcon(type, size, ring){
    size = size || 16; if (ring === undefined) ring = true;
    var J = JERSEYS_ALL[type] || JERSEYS_ALL.gul;
    var shirt = type === "hvit" ? "#B0B0B0" : "#fff";
    return '<span style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:'+JJ(JJfill(type))+
      ';border:'+(ring?"1.5px solid #fff":"none")+';display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;'+
      'box-shadow:0 1px 3px rgba(0,0,0,.25);">'+
      '<svg width="'+(size*0.56)+'" height="'+(size*0.56)+'" viewBox="0 0 24 24" fill="'+shirt+'">'+
      '<path d="M8 3 L4 6 L6 9 L8 8 V21 H16 V8 L18 9 L20 6 L16 3 L14 4 A2 2 0 0 1 10 4 Z"/></svg></span>';
  }
  var JERSEYS_ALL = {
    gul:   { fill:"#FAD067" }, gronn:{ fill:"#D8D470" }, klatre:{ fill:"#FFB2E3" },
    tid:   { fill:"#B7A0EC" }, hvit:{ fill:"#FFFFFF" }
  };
  function JJfill(t){ return (JERSEYS_ALL[t]||JERSEYS_ALL.gul).fill; }
  function JJ(x){ return x; }

  /* =====================================================================
     UKE-VIEW
     ===================================================================== */
  var TERRAIN_D = "M507.221 237.376C483.115 236.396 459.932 246.304 451.658 271.126C446.21 287.471 450.62 325.645 429.189 330.408C391.241 338.841 385.331 300.1 367.877 278.283C350.88 257.036 320.635 254.399 295.846 259.908C241.302 272.028 257.766 363.509 206.971 376.876C171.266 386.272 145.022 336.942 124.221 317.626C100.235 295.354 47.0762 289.011 20.0019 295.908C19.0434 296.152 18.1999 296.687 17.4394 297.376L17.4394 446.867L784.721 449.996L784.721 241.095C768.991 236.901 720.088 241.479 710.127 242.033C690.347 243.132 681.374 262.965 679.502 279.814C675.97 311.602 683.5 387.554 634.033 390.158C560.851 394.009 592.653 320.006 572.221 280.845C560.767 258.893 542.012 242.513 517.564 238.439C514.123 237.865 510.664 237.516 507.221 237.376Z";
  var VBX=17, VBY=-40, VBW=768, VBH=960;
  var TERRAIN_BOTTOM_ORIG=450, FIELD_BOTTOM=920, DATA_TOP=470;
  var SURFACE=[[16,296.9],[40,293.3],[60,293.9],[80,297.0],[100,302.8],[120,312.9],[140,334.2],[160,358.0],[180,373.1],[196,377.8],[204,377.5],[220,370.7],[240,340.9],[256,298.7],[272,272.7],[288,262.3],[304,258.2],[316,257.4],[332,258.4],[348,263.1],[364,272.5],[380,294.8],[400,324.7],[416,331.2],[424,331.3],[436,326.2],[448,279.8],[464,250.4],[484,240.0],[500,237.3],[512,237.5],[532,242.3],[552,254.1],[572,277.6],[584,341.0],[600,382.2],[616,389.1],[628,390.3],[644,388.4],[660,376.3],[672,345.9],[680,268.2],[696,246.0],[712,241.8],[732,240.4],[752,239.5],[764,239.3],[784,240.5]];
  function surfaceY(x){
    var p=SURFACE;
    if(x<=p[0][0]) return p[0][1];
    if(x>=p[p.length-1][0]) return p[p.length-1][1];
    for(var i=1;i<p.length;i++){ if(x<=p[i][0]){ var a=p[i-1],b=p[i]; return a[1]+(b[1]-a[1])*((x-a[0])/(b[0]-a[0])); } }
    return p[p.length-1][1];
  }

  var W_MEMBERS=[
    { id:"MK", color:"kornblomst", prevRank:1, okter:5, hm:1200, dist:{sykling:142,lop:38,svomming:6, ski:0 } },
    { id:"SL", color:"korall",     prevRank:3, okter:7, hm:900,  dist:{sykling:96, lop:31,svomming:11,ski:6 } },
    { id:"LA", color:"fersken",    prevRank:2, okter:4, hm:2100, dist:{sykling:74, lop:22,svomming:4, ski:12} },
    { id:"EH", color:"mint",       prevRank:5, okter:6, hm:1500, dist:{sykling:58, lop:27,svomming:9, ski:0 } },
    { id:"NV", color:"lavendel",   prevRank:4, okter:3, hm:600,  dist:{sykling:41, lop:9, svomming:2, ski:0 } }
  ];
  function wTotal(m,sport){
    if(sport==="alle"){ var s=0; for(var i=1;i<SPORTS.length;i++) s+=(m.dist[SPORTS[i].key]||0); return s; }
    return m.dist[sport]||0;
  }
  var STAGE={ number:7, total:52, daysLeft:3 };
  var TRAVEL={ x0:70, x1:690 }, START_X=44, FINISH_X=760;

  var wState={ sport:"alle", menuOpen:false, selected:null, flipped:false };

  function wComputeData(){
    var rows=W_MEMBERS.map(function(m){ return Object.assign({}, m, { total:wTotal(m, wState.sport) }); })
      .sort(function(a,b){ return b.total-a.total; });
    var leader=rows[0]?rows[0].total:0;
    return rows.map(function(r,i){
      var frac=leader>0?r.total/leader:0;
      var x=TRAVEL.x0+(TRAVEL.x1-TRAVEL.x0)*frac;
      return Object.assign({}, r, { rank:i+1, x:x, gap:r.total-leader, move:r.prevRank-(i+1) });
    });
  }
  function wJerseys(){
    var withDist=W_MEMBERS.map(function(m){ return Object.assign({},m,{total:wTotal(m,"alle")}); });
    var rankNow=withDist.slice().sort(function(a,b){return b.total-a.total;}).map(function(m){return m.id;});
    var best=function(fn){ return W_MEMBERS.slice().sort(function(a,b){return fn(b)-fn(a);})[0].id; };
    var climb=function(m){ return m.prevRank-(rankNow.indexOf(m.id)+1); };
    return {
      gul:    best(function(m){return wTotal(m,"alle");}),
      gronn:  best(function(m){return m.okter;}),
      klatre: best(function(m){return m.hm;}),
      hvit:   best(climb)
    };
  }

  /* ── Terreng-bakgrunn (SVG, full-bleed) ── */
  function wavePath(baseY,amp,phase,len){
    var d="",N=26;
    for(var i=0;i<=N;i++){ var x=VBX+(VBW*i)/N; var y=baseY+Math.sin((i/N)*Math.PI*len+phase)*amp; d+=(i===0?"M ":"L ")+x.toFixed(1)+" "+y.toFixed(1)+" "; }
    return d.trim();
  }
  function buildFieldStripes(){
    var out="", top=252, bottom=FIELD_BOTTOM, band=34, amp=9, len=2.1, idx=0;
    for(var y=top;y<bottom;y+=band,idx++){
      var phase=idx*0.7, isVine=idx%2===1;
      if(!isVine){
        var topW=wavePath(y,amp,phase,len), N=26, botPts=[];
        for(var i=N;i>=0;i--){ var x=VBX+(VBW*i)/N; var yy=y+band+Math.sin((i/N)*Math.PI*len+phase+0.25)*amp; botPts.push(x.toFixed(1)+" "+yy.toFixed(1)); }
        var d=topW+" L "+botPts.join(" L ")+" Z";
        out+='<path d="'+d+'" fill="'+(idx%4===0?FIELD.goldLite:FIELD.goldA)+'" opacity="0.32"/>';
      } else {
        var Nd=22, mid=y+band/2, dots="";
        for(var j=0;j<=Nd;j++){ var xx=VBX+(VBW*j)/Nd; var yd=mid+Math.sin((j/Nd)*Math.PI*len+phase)*amp; dots+='<circle cx="'+xx.toFixed(1)+'" cy="'+yd.toFixed(1)+'" r="1.9" fill="'+(idx%3===0?FIELD.vine2:FIELD.vine)+'" opacity="0.30"/>'; }
        out+='<g>'+dots+'</g>';
      }
    }
    return out;
  }
  function buildSurfaceRoad(){
    var d="";
    for(var i=0;i<SURFACE.length;i++){ d+=(i===0?"M ":"L ")+SURFACE[i][0]+" "+(SURFACE[i][1]+3)+" "; }
    return '<path d="'+d.trim()+'" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="1 9" opacity="0.6"/>';
  }
  function buildTerrainBg(){
    var EXTRUDE_TOP=TERRAIN_BOTTOM_ORIG-3;
    var extrude="M"+VBX+" "+EXTRUDE_TOP+" L"+(VBX+VBW)+" "+EXTRUDE_TOP+" L"+(VBX+VBW)+" "+FIELD_BOTTOM+" L"+VBX+" "+FIELD_BOTTOM+" Z";
    return '<svg viewBox="'+VBX+' '+VBY+' '+VBW+' '+VBH+'" preserveAspectRatio="none" '+
      'style="position:absolute;inset:0;width:100%;height:100%;display:block;" xmlns="'+SVGNS+'">'+
      '<defs>'+
        '<clipPath id="tdk-clip"><path d="'+TERRAIN_D+'"/><path d="'+extrude+'"/></clipPath>'+
        '<linearGradient id="tdk-data" x1="0" y1="0" x2="0" y2="1">'+
          '<stop offset="0%" stop-color="'+FIELD.goldLite+'" stop-opacity="0"/>'+
          '<stop offset="22%" stop-color="'+FIELD.goldLite+'" stop-opacity="0.85"/>'+
          '<stop offset="100%" stop-color="'+FIELD.goldLite+'" stop-opacity="0.95"/>'+
        '</linearGradient>'+
      '</defs>'+
      '<path d="'+extrude+'" fill="'+FIELD.goldA+'"/>'+
      '<path d="'+TERRAIN_D+'" fill="'+FIELD.goldA+'"/>'+
      '<g clip-path="url(#tdk-clip)">'+buildFieldStripes()+'</g>'+
      '<g clip-path="url(#tdk-clip)"><rect x="'+VBX+'" y="'+DATA_TOP+'" width="'+VBW+'" height="'+(FIELD_BOTTOM-DATA_TOP)+'" fill="url(#tdk-data)"/></g>'+
      buildSurfaceRoad()+
    '</svg>';
  }

  /* ── Dekor (trær + start/slutt) i HTML-overlay ── */
  function treeSvg(s,foliage,edge){
    var Wd=30*s, Hd=34*s;
    return '<svg width="'+Wd+'" height="'+Hd+'" viewBox="0 0 30 34" style="display:block;overflow:visible;">'+
      '<rect x="13.4" y="22" width="3.2" height="12" rx="1.4" fill="#CC8442"/>'+
      '<circle cx="9" cy="18" r="7" fill="'+foliage+'"/>'+
      '<circle cx="21" cy="18" r="7" fill="'+foliage+'"/>'+
      '<circle cx="15" cy="10" r="9" fill="'+foliage+'"/>'+
      '<circle cx="15" cy="10" r="9" fill="'+edge+'" opacity="0.16"/>'+
      '<circle cx="12.5" cy="7.5" r="3.4" fill="#fff" opacity="0.20"/></svg>';
  }
  function milestoneSvg(kind){
    var col=kind==="start"?PAL.mint.base:PAL.rosa.base;
    var colDeep=kind==="start"?PAL.mint.dark:PAL.rosa.dark;
    return '<svg width="18" height="34" viewBox="0 0 18 34" style="display:block;overflow:visible;">'+
      '<ellipse cx="9" cy="33.5" rx="5" ry="1.8" fill="'+col+'" opacity="0.40"/>'+
      '<line x1="9" y1="34" x2="9" y2="7" stroke="#B0B0B0" stroke-width="1.4" stroke-linecap="round"/>'+
      '<path d="M9 6 L18 10.5 L9 15 Z" fill="'+col+'"/>'+
      '<circle cx="9" cy="6" r="2.4" fill="'+colDeep+'"/></svg>'+
      '<span style="position:absolute;top:-11px;left:9px;transform:translateX(-50%);font-size:7px;font-weight:800;letter-spacing:0.5px;color:'+colDeep+';font-family:\'Fredoka\',sans-serif;white-space:nowrap;text-shadow:0 1px 2px rgba(255,255,255,0.7);">'+(kind==="start"?"START":"MÅL")+'</span>';
  }
  function buildDecor(data){
    var toLeft=function(x){ return ((x-VBX)/VBW)*100; };
    var toTop=function(y){ return ((y-VBY)/VBH)*100; };
    var occ=data.map(function(r){return r.x;});
    var clash=function(x){ return occ.some(function(ox){return Math.abs(ox-x)<42;}); };
    var cand=[108,172,332,416,508,612,736];
    var sizes=[1.0,0.78,1.12,0.86,1.04,0.72,0.94];
    var tones=[["#D8D470","#B0AA3E"],["#F4EFA5","#D8D470"],["#B0AA3E","#B0AA3E"]];
    var html="";
    var ti=0;
    cand.filter(function(x){return !clash(x);}).forEach(function(x){
      var s=sizes[ti%sizes.length], tone=tones[ti%tones.length]; ti++;
      var y=surfaceY(x);
      html+='<div style="position:absolute;left:'+toLeft(x)+'%;top:'+toTop(y)+'%;transform:translate(-50%,-100%);width:'+(30*s)+'px;height:'+(34*s)+'px;margin-top:'+(1*s)+'px;">'+treeSvg(s,tone[0],tone[1])+'</div>';
    });
    [["start",START_X],["finish",FINISH_X]].forEach(function(pair){
      var x=pair[1];
      html+='<div style="position:absolute;left:'+toLeft(x)+'%;top:'+toTop(surfaceY(x))+'%;transform:translate(-50%,-100%);width:18px;height:34px;margin-top:1px;">'+milestoneSvg(pair[0])+'</div>';
    });
    return html;
  }

  /* ── Ryttere (navnesirkler oppå terrenget) ── */
  function buildRiders(data){
    var rows=data.map(function(r){ return Object.assign({},r,{y:surfaceY(r.x)}); });
    var byX=rows.slice().sort(function(a,b){return a.x-b.x;});
    for(var i=1;i<byX.length;i++){ byX[i].lift=(byX[i].x-byX[i-1].x<70 && (byX[i-1].lift||0)===0)?32:0; }
    var toLeft=function(x){ return ((x-VBX)/VBW)*100; };
    var toTop=function(y){ return ((y-VBY)/VBH)*100; };
    var html="";
    rows.forEach(function(r){
      var pal=PAL[r.color], isSel=wState.selected===r.id;
      var cy=r.y-19-(r.lift||0);
      var label="";
      if(isSel||r.rank===1){
        label='<div style="position:absolute;top:33px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.94);border-radius:7px;padding:1px 6px;font-size:9px;font-weight:700;color:#555555;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.16);">'+fmtNb(r.total)+' km</div>';
      }
      var leadJersey = r.rank===1 ? '<span style="position:absolute;top:-7px;right:-7px;">'+jerseyIcon("gul",16,true)+'</span>' : '';
      html+='<div data-rider="'+r.id+'" style="position:absolute;left:'+toLeft(r.x)+'%;top:'+toTop(cy)+'%;'+
        'transform:translate(-50%,-50%) '+(isSel?"scale(1.12)":"scale(1)")+';'+
        'transition:left .6s cubic-bezier(.34,1.1,.5,1),top .6s cubic-bezier(.34,1.1,.5,1),transform .2s;'+
        'cursor:pointer;pointer-events:auto;z-index:'+(isSel?6:(r.rank===1?5:4))+';">'+
        '<div style="width:30px;height:30px;border-radius:50%;background:'+pal.base+';display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:11px;'+
          'border:'+(r.rank===1?"2.5px solid #FAD067":"2.5px solid #fff")+';'+
          'box-shadow:'+(isSel?"0 0 0 2.5px "+pal.base+", 0 4px 9px rgba(0,0,0,.30)":"0 2px 6px rgba(0,0,0,.24)")+';'+
          'font-family:\'DM Sans\',sans-serif;position:relative;">'+r.id+leadJersey+'</div>'+
        label+'</div>';
    });
    return html;
  }

  /* ── Stage-bar ── */
  function buildStageBar(){
    var daysDone=7-STAGE.daysLeft, pct=(daysDone/7)*100;
    var ticks="";
    for(var i=0;i<6;i++){ ticks+='<div style="position:absolute;top:0;width:1.5px;height:100%;background:rgba(255,255,255,0.7);left:'+(((i+1)/7)*100)+'%;"></div>'; }
    return '<div style="margin-bottom:42px;">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;">'+
        '<span style="font-size:11px;font-weight:800;color:#555555;">Dag '+daysDone+' av 7</span>'+
        '<span style="font-size:10px;font-weight:700;color:#888888;">'+STAGE.daysLeft+' dager igjen av etappen</span>'+
      '</div>'+
      '<div style="position:relative;width:100%;height:7px;border-radius:100px;overflow:hidden;background:rgba(255,255,255,0.6);box-shadow:inset 0 1px 2px rgba(0,0,0,.08);">'+
        '<div style="position:absolute;left:0;top:0;height:100%;border-radius:100px;background:linear-gradient(90deg,#FAD067,#E0B034);width:'+pct+'%;"></div>'+ticks+
      '</div></div>';
  }

  function wHeadline(data){
    if(data.length<2) return "Ingen aktivitet registrert ennå";
    var climber=data.slice().sort(function(a,b){return b.move-a.move;})[0];
    var faller=data.slice().sort(function(a,b){return a.move-b.move;})[0];
    var C=function(r){ return '<b style="color:'+PAL[r.color].dark+';">'+r.id+'</b>'; };
    if(climber && climber.move>=2) return C(climber)+' har klatret '+climber.move+' plasser denne uka';
    if(climber && climber.move===1) return C(climber)+' har gått forbi '+C(faller)+' og klatret én plass';
    return STAGE.daysLeft+' dager igjen — fortsatt mulig å ta igjen '+C(data[0]);
  }

  function buildStrip(data, jerseys){
    var html='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:2px;padding-bottom:6px;">';
    data.forEach(function(r){
      var pal=PAL[r.color], isSel=wState.selected===r.id;
      var held=["gul","gronn","klatre","hvit"].filter(function(k){return jerseys[k]===r.id;});
      var hasGul=held.indexOf("gul")>-1;
      var cluster="";
      if(held.length>0){
        cluster='<span style="position:absolute;bottom:-4px;right:-4px;display:flex;flex-direction:row-reverse;align-items:center;">';
        held.forEach(function(k,idx){ cluster+='<span style="margin-right:'+(idx===0?0:-6)+'px;display:inline-flex;z-index:'+(held.length-idx)+';">'+jerseyIcon(k,18,true)+'</span>'; });
        cluster+='</span>';
      }
      var moveBadge="";
      if(r.move!==0){
        moveBadge='<span style="position:absolute;top:-5px;left:-8px;font-size:8px;font-weight:800;font-family:\'Fredoka\',sans-serif;padding:1px 4px;border-radius:100px;border:1.5px solid #fff;letter-spacing:-0.3px;line-height:1.3;box-shadow:0 1px 2px rgba(0,0,0,.12);'+
          'background:'+(r.move>0?"#E8F8FC":"#FFE8E6")+';color:'+(r.move>0?"#3090AA":"#D95C52")+';">'+(r.move>0?("▲"+r.move):("▼"+(-r.move)))+'</span>';
      }
      html+='<button data-rider="'+r.id+'" style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:7px;background:transparent;border:none;cursor:pointer;padding:0;font-family:'+FONT+';">'+
        '<span style="position:relative;display:inline-flex;">'+
          '<span style="width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;font-family:'+FONT+';background:'+pal.base+';'+
            'border:'+(hasGul?"2.5px solid #FAD067":"2.5px solid #fff")+';'+
            'box-shadow:'+(isSel?("0 0 0 2px "+pal.base+", 0 3px 7px rgba(0,0,0,.28)"):"0 2px 5px rgba(0,0,0,.18)")+';">'+r.id+'</span>'+
          cluster+moveBadge+
        '</span>'+
        '<span style="font-size:10px;font-weight:700;color:#555555;white-space:nowrap;font-variant-numeric:tabular-nums;line-height:1;">'+(r.rank===1?"leder":(fmtNb(Math.abs(r.gap))+" km bak"))+'</span>'+
      '</button>';
    });
    html+='</div>';
    return html;
  }

  function renderWeek(){
    var host=card?card.querySelector(".tdk-week"):null;
    if(!host) return;
    var data=wComputeData();
    var jerseys=wJerseys();
    var sportMeta=SPORTS.filter(function(s){return s.key===wState.sport;})[0];

    var menuHtml="";
    if(wState.menuOpen){
      menuHtml='<div class="tdk-w-menu" style="position:absolute;top:32px;right:0;z-index:20;background:#fff;border-radius:12px;padding:5px;min-width:150px;box-shadow:0 6px 24px rgba(0,0,0,.18),0 1px 4px rgba(0,0,0,.10);border:1px solid #EFEFEF;">';
      SPORTS.forEach(function(s){
        var sel=s.key===wState.sport;
        menuHtml+='<button data-sport="'+s.key+'" style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;border-radius:8px;border:none;cursor:pointer;text-align:left;font-size:12.5px;color:#070707;font-family:'+FONT+';'+
          'background:'+(sel?"#F7F7F7":"transparent")+';font-weight:'+(sel?700:500)+';">'+
          '<span style="width:16px;text-align:center;">'+s.icon+'</span>'+s.label+(sel?'<span style="margin-left:auto;color:#E880C4;">✓</span>':'')+'</button>';
      });
      menuHtml+='</div>';
    }

    var front=
      '<div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:16px 18px 0;">'+
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;position:relative;z-index:7;">'+
          '<div>'+
            '<div style="font-size:14px;font-weight:700;color:#555555;text-shadow:0 1px 2px rgba(255,255,255,0.5);">Tour de Konka</div>'+
            '<div style="font-size:10px;color:#888888;margin-top:1px;font-weight:500;">Etappe '+STAGE.number+' av '+STAGE.total+' · denne uka</div>'+
          '</div>'+
          '<div style="position:relative;">'+
            '<button class="tdk-w-pill" style="display:flex;align-items:center;gap:5px;padding:0 9px 0 6px;height:28px;border-radius:14px;border:none;cursor:pointer;background:#91BCFF;color:#fff;font-size:11px;font-weight:600;font-family:'+FONT+';box-shadow:0 2px 6px rgba(0,0,0,.18);">'+
              '<span style="width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,0.26);display:flex;align-items:center;justify-content:center;font-size:10px;">'+sportMeta.icon+'</span>'+
              sportMeta.label+'<span style="font-size:7px;opacity:0.85;margin-left:1px;">▾</span>'+
            '</button>'+menuHtml+
          '</div>'+
        '</div>'+
        '<div class="tdk-riders" style="position:absolute;inset:0;z-index:5;pointer-events:none;">'+buildRiders(data)+'</div>'+
        '<div style="margin-top:auto;position:relative;z-index:7;padding:48px 12px 16px;">'+
          buildStageBar()+
          buildStrip(data,jerseys)+
          '<div style="display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;color:#555555;line-height:1.3;margin-top:13px;background:rgba(255,255,255,0.32);border-radius:100px;padding:4px 14px 4px 5px;border:1px solid rgba(255,255,255,0.45);">'+
            '<span style="width:20px;height:20px;border-radius:50%;background:rgba(255,251,232,0.9);display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B88A18" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></svg>'+
            '</span>'+
            '<span style="flex:1;min-width:0;">'+wHeadline(data)+'</span>'+
          '</div>'+
        '</div>'+
      '</div>';

    var back=
      '<div class="tdk-w-back" style="position:absolute;inset:0;background:#070707;border-radius:16px;padding:22px 22px 20px;color:#fff;display:'+(wState.flipped?"flex":"none")+';flex-direction:column;z-index:8;">'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><span style="font-size:18px;">🚴</span><span style="font-size:16px;font-weight:700;">Tour de Konka</span></div>'+
        '<p style="font-size:12.5px;line-height:1.65;color:#D8D8D8;margin:0;">Hver uke er én <b style="color:#fff;">etappe</b> (52 i året). Deltakerne vises som navnesirkler langs løypa — posisjonen tilsvarer hvor langt de har syklet <b style="color:#fff;">denne uka</b>, i forhold til hverandre.</p>'+
        '<p style="font-size:12.5px;line-height:1.65;color:#D8D8D8;margin-top:12px;">Den som leder ved ukeslutt vinner etappen og får den <b style="color:#fff;">gule ledertrøya</b>. Veien justeres så lederen aldri står i mål før uka er omme. Velg sport med knappen for å filtrere.</p>'+
        '<button class="tdk-w-backbtn" style="margin-top:auto;align-self:flex-start;padding:8px 16px;border-radius:8px;border:1.5px solid #555555;background:transparent;color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:'+FONT+';">← Tilbake</button>'+
      '</div>';

    host.innerHTML=
      buildTerrainBg()+
      '<div style="position:absolute;inset:0;z-index:3;pointer-events:none;">'+buildDecor(data)+'</div>'+
      (wState.flipped?back:front);

    wireWeek(host);
  }

  function wireWeek(host){
    var pill=host.querySelector(".tdk-w-pill");
    if(pill) pill.addEventListener("click",function(e){ e.stopPropagation(); wState.menuOpen=!wState.menuOpen; renderWeek(); });
    host.querySelectorAll(".tdk-w-menu button").forEach(function(b){
      b.addEventListener("click",function(e){ e.stopPropagation(); wState.sport=b.getAttribute("data-sport"); wState.menuOpen=false; wState.selected=null; renderWeek(); });
    });
    host.querySelectorAll("[data-rider]").forEach(function(el){
      el.addEventListener("click",function(e){ e.stopPropagation(); var id=el.getAttribute("data-rider"); wState.selected=(wState.selected===id?null:id); renderWeek(); });
    });
    var bb=host.querySelector(".tdk-w-backbtn");
    if(bb) bb.addEventListener("click",function(){ wState.flipped=false; renderWeek(); });
  }

  /* =====================================================================
     ÅR-VIEW
     ===================================================================== */
  var Y_JERSEYS={
    gul:{label:"Gul trøye",desc:"Lengst distanse"}, gronn:{label:"Grønn trøye",desc:"Mest aktiv"},
    klatre:{label:"Klatretrøye",desc:"Mest høydemeter"}, tid:{label:"Tidstrøye",desc:"Mest treningstid"},
    hvit:{label:"Hvit trøye",desc:"Størst framgang"}
  };
  var JERSEY_ORDER=["gul","gronn","klatre","tid","hvit"];
  var TOUR={ stagesDone:26, total:52, year:2026 };
  var JERSEY_WEIGHT={ gul:3, gronn:2, klatre:2, tid:2, hvit:1.5 };

  var Y_MEMBERS=[
    { id:"MK", color:"kornblomst", strength:{gul:0.52,gronn:0.16,klatre:0.16,tid:0.12,hvit:0.08}, distPerStage:{sykling:132,lop:20,svomming:4, ski:0 }, minPerStage:320 },
    { id:"SL", color:"korall",     strength:{gul:0.16,gronn:0.48,klatre:0.08,tid:0.22,hvit:0.14}, distPerStage:{sykling:80, lop:32,svomming:10,ski:6 }, minPerStage:410 },
    { id:"LA", color:"fersken",    strength:{gul:0.14,gronn:0.10,klatre:0.56,tid:0.10,hvit:0.10}, distPerStage:{sykling:72, lop:16,svomming:3, ski:12}, minPerStage:250 },
    { id:"EH", color:"mint",       strength:{gul:0.08,gronn:0.14,klatre:0.08,tid:0.30,hvit:0.38}, distPerStage:{sykling:56, lop:28,svomming:9, ski:0 }, minPerStage:380 },
    { id:"NV", color:"lavendel",   strength:{gul:0.08,gronn:0.08,klatre:0.08,tid:0.10,hvit:0.20}, distPerStage:{sykling:42, lop:12,svomming:2, ski:0 }, minPerStage:180 },
    { id:"TB", color:"gull",       strength:{gul:0.22,gronn:0.18,klatre:0.12,tid:0.18,hvit:0.16}, distPerStage:{sykling:88, lop:24,svomming:5, ski:4 }, minPerStage:300 },
    { id:"OW", color:"rosa",       strength:{gul:0.06,gronn:0.20,klatre:0.28,tid:0.16,hvit:0.18}, distPerStage:{sykling:50, lop:14,svomming:7, ski:8 }, minPerStage:260 },
    { id:"IR", color:"mint",       strength:{gul:0.05,gronn:0.12,klatre:0.06,tid:0.50,hvit:0.26}, distPerStage:{sykling:38, lop:18,svomming:11,ski:0 }, minPerStage:450 }
  ];
  function mulberry32(seed){
    return function(){
      seed|=0; seed=(seed+0x6D2B79F5)|0;
      var t=Math.imul(seed^(seed>>>15),1|seed);
      t=(t+Math.imul(t^(t>>>7),61|t))^t;
      return ((t^(t>>>14))>>>0)/4294967296;
    };
  }
  function buildHistory(){
    var rnd=mulberry32(2026);
    var ids=Y_MEMBERS.map(function(m){return m.id;});
    var pickWeighted=function(key){
      var weights=Y_MEMBERS.map(function(m){return Math.pow(m.strength[key],1.6)+0.015;});
      var sum=weights.reduce(function(a,b){return a+b;},0);
      var r=rnd()*sum;
      for(var i=0;i<weights.length;i++){ r-=weights[i]; if(r<=0) return ids[i]; }
      return ids[ids.length-1];
    };
    var stages=[];
    for(var s=0;s<TOUR.stagesDone;s++){
      var winner={};
      JERSEY_ORDER.forEach(function(k){ winner[k]=pickWeighted(k); });
      var scored=Y_MEMBERS.map(function(m){
        var base=m.strength.gul*1.8+m.strength.gronn*1.1+m.strength.klatre*1.1+m.strength.tid*1.1+m.strength.hvit*0.9;
        return { id:m.id, score:base+(rnd()-0.5)*0.9 };
      }).sort(function(a,b){return b.score-a.score;});
      var rank={};
      scored.forEach(function(row,i){ rank[row.id]=i+1; });
      stages.push({ winner:winner, rank:rank });
    }
    return stages;
  }
  function aggregate(history,sport){
    return Y_MEMBERS.map(function(m){
      var jerseyCount={}; JERSEY_ORDER.forEach(function(k){jerseyCount[k]=0;});
      var ranks=[], cumPoints=[], runningPoints=0, podiums=0, wins=0;
      history.forEach(function(st){
        var stagePts=0;
        JERSEY_ORDER.forEach(function(k){ if(st.winner[k]===m.id){ jerseyCount[k]++; stagePts+=JERSEY_WEIGHT[k]; } });
        runningPoints+=stagePts; cumPoints.push(runningPoints);
        var r=st.rank[m.id]; ranks.push(r); if(r<=3) podiums++; if(r===1) wins++;
      });
      var totalJerseys=JERSEY_ORDER.reduce(function(a,k){return a+jerseyCount[k];},0);
      var points=JERSEY_ORDER.reduce(function(a,k){return a+jerseyCount[k]*JERSEY_WEIGHT[k];},0);
      var avgRank=ranks.reduce(function(a,b){return a+b;},0)/ranks.length;
      var dist=sport==="alle"
        ? SPORTS.slice(1).reduce(function(a,sp){return a+m.distPerStage[sp.key];},0)*history.length
        : m.distPerStage[sport]*history.length;
      var minutes=m.minPerStage*history.length;
      return Object.assign({},m,{ jerseyCount:jerseyCount, totalJerseys:totalJerseys, points:points, cumPoints:cumPoints, ranks:ranks, avgRank:avgRank, podiums:podiums, wins:wins, dist:dist, minutes:minutes });
    });
  }

  var yState={ openGraph:null, flipped:false, expanded:false };
  var Y_HISTORY=buildHistory();
  var Y_ROWS=(function(){
    var agg=aggregate(Y_HISTORY,"alle");
    return agg.slice().sort(function(a,b){
      return b.points-a.points || b.jerseyCount.gul-a.jerseyCount.gul || a.avgRank-b.avgRank;
    }).map(function(r,i){ return Object.assign({},r,{rank:i+1}); });
  })();

  /* ── Terreng-footer (lavt bånd) ── */
  var SURF_X0=16, SURF_X1=784, SURF_Y_MIN=237.3, SURF_Y_MAX=377.8;
  function buildTerrainFooter(){
    var Wf=100, Hf=30, RIDGE=13, VALLEY=23;
    var nx=function(x){ return ((x-SURF_X0)/(SURF_X1-SURF_X0))*Wf; };
    var ny=function(y){ var t=(y-SURF_Y_MIN)/(SURF_Y_MAX-SURF_Y_MIN); return RIDGE+t*(VALLEY-RIDGE); };
    var pts=SURFACE.map(function(p){ return [nx(p[0]),ny(p[1])]; });
    var surfaceD=pts.map(function(p,i){ return (i===0?"M":"L")+p[0].toFixed(2)+" "+p[1].toFixed(2); }).join(" ");
    var fillD=surfaceD+" L"+Wf+" "+Hf+" L0 "+Hf+" Z";
    var yAt=function(xPct){
      for(var i=1;i<pts.length;i++){ if(xPct<=pts[i][0]){ var a=pts[i-1],b=pts[i]; return a[1]+(b[1]-a[1])*((xPct-a[0])/((b[0]-a[0])||1)); } }
      return pts[pts.length-1][1];
    };
    var treeXs=[9,30,52,73,91];
    var treeTones=[["#D8D470","#B0AA3E"],["#F4EFA5","#D8D470"],["#B0AA3E","#B0AA3E"]];
    var treeSizes=[1.0,0.8,1.1,0.85,0.95];
    var trees="";
    treeXs.forEach(function(x,i){
      var s=treeSizes[i%treeSizes.length], tone=treeTones[i%treeTones.length];
      var Wt=26*s, Ht=30*s;
      trees+='<div style="position:absolute;left:'+x+'%;top:'+((yAt(x)/Hf)*100)+'%;transform:translate(-50%,-100%);width:'+Wt+'px;height:'+Ht+'px;">'+
        '<svg width="'+Wt+'" height="'+Ht+'" viewBox="0 0 30 34" style="display:block;overflow:visible;">'+
        '<rect x="13.4" y="22" width="3.2" height="12" rx="1.4" fill="#CC8442"/>'+
        '<circle cx="9" cy="18" r="7" fill="'+tone[0]+'"/><circle cx="21" cy="18" r="7" fill="'+tone[0]+'"/>'+
        '<circle cx="15" cy="10" r="9" fill="'+tone[0]+'"/><circle cx="15" cy="10" r="9" fill="'+tone[1]+'" opacity="0.16"/>'+
        '<circle cx="12.5" cy="7.5" r="3.4" fill="#fff" opacity="0.20"/></svg></div>';
    });
    return '<div style="position:absolute;left:0;right:0;bottom:0;height:92px;z-index:1;pointer-events:none;">'+
      '<svg width="100%" height="100%" viewBox="0 0 '+Wf+' '+Hf+'" preserveAspectRatio="none" style="position:absolute;inset:0;">'+
        '<defs><linearGradient id="ydk-field" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="'+FIELD.goldA+'"/><stop offset="100%" stop-color="'+FIELD.goldB+'"/></linearGradient>'+
        '<clipPath id="ydk-clip"><path d="'+fillD+'"/></clipPath></defs>'+
        '<path d="'+fillD+'" fill="url(#ydk-field)"/>'+
        '<g clip-path="url(#ydk-clip)" opacity="0.5"><path d="'+surfaceD+'" fill="none" stroke="'+FIELD.goldLite+'" stroke-width="2.5"/></g>'+
        '<path d="'+surfaceD+'" fill="none" stroke="#fff" stroke-width="0.5" stroke-dasharray="1.5 2" opacity="0.55"/>'+
      '</svg>'+trees+'</div>';
  }

  function buildTourBar(){
    var pct=(TOUR.stagesDone/TOUR.total)*100;
    var quarters=[13,26,39];
    var ticks="";
    quarters.forEach(function(q){ ticks+='<div style="position:absolute;top:0;width:1.5px;height:100%;background:rgba(255,255,255,0.85);left:'+((q/TOUR.total)*100)+'%;"></div>'; });
    return '<div style="margin-top:16px;position:relative;z-index:6;">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;">'+
        '<span style="font-size:11px;font-weight:800;color:#555555;">Etappe '+TOUR.stagesDone+' av '+TOUR.total+'</span>'+
        '<span style="font-size:10px;font-weight:700;color:#888888;">'+(TOUR.total-TOUR.stagesDone)+' uker igjen av touret</span>'+
      '</div>'+
      '<div style="position:relative;width:100%;height:7px;border-radius:100px;overflow:hidden;background:rgba(0,0,0,0.05);box-shadow:inset 0 1px 2px rgba(0,0,0,.06);">'+
        '<div style="position:absolute;left:0;top:0;height:100%;border-radius:100px;background:linear-gradient(90deg,#FAD067,#E0B034);width:'+pct+'%;"></div>'+ticks+
      '</div></div>';
  }

  function buildPointsGraph(cumPoints,color){
    var n=cumPoints.length, maxP=Math.max(cumPoints[n-1],1);
    var Wg=300,Hg=64,padL=22,padR=10,padT=8,padB=14;
    var px=function(i){ return padL+(n===1?(Wg-padL-padR)/2:(i/(n-1))*(Wg-padL-padR)); };
    var py=function(p){ return padT+(1-p/maxP)*(Hg-padT-padB); };
    var d=cumPoints.map(function(p,i){ return (i===0?"M":"L")+px(i).toFixed(1)+" "+py(p).toFixed(1); }).join(" ");
    var area=d+" L"+px(n-1).toFixed(1)+" "+(Hg-padB).toFixed(1)+" L"+px(0).toFixed(1)+" "+(Hg-padB).toFixed(1)+" Z";
    var lastX=px(n-1), lastY=py(cumPoints[n-1]);
    var fmtP=function(v){ return v%1===0?v:v.toFixed(1).replace(".",","); };
    return '<svg width="100%" viewBox="0 0 '+Wg+' '+Hg+'" style="display:block;" preserveAspectRatio="none">'+
      '<text x="0" y="'+(py(maxP)+3)+'" font-size="9" fill="'+NEU[300]+'" font-family="\'DM Sans\',sans-serif" font-weight="700">'+fmtP(maxP)+'</text>'+
      '<text x="0" y="'+(py(0)+3)+'" font-size="9" fill="'+NEU[300]+'" font-family="\'DM Sans\',sans-serif" font-weight="700">0</text>'+
      '<line x1="'+padL+'" y1="'+py(maxP)+'" x2="'+(Wg-padR)+'" y2="'+py(maxP)+'" stroke="'+NEU[100]+'" stroke-width="1"/>'+
      '<line x1="'+padL+'" y1="'+py(0)+'" x2="'+(Wg-padR)+'" y2="'+py(0)+'" stroke="'+NEU[100]+'" stroke-width="1"/>'+
      '<path d="'+area+'" fill="'+color+'" opacity="0.12"/>'+
      '<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<circle cx="'+lastX+'" cy="'+lastY+'" r="3.4" fill="#fff" stroke="'+color+'" stroke-width="2.4"/></svg>';
  }

  function buildMemberRow(r){
    var pal=PAL[r.color], isOpen=yState.openGraph===r.id;
    var pointsLabel=r.points%1===0?r.points:r.points.toFixed(1).replace(".",",");
    var coins="";
    JERSEY_ORDER.forEach(function(k){
      var n=r.jerseyCount[k], dim=n===0;
      coins+='<span style="display:inline-flex;align-items:center;gap:1px;opacity:'+(dim?0.32:1)+';">'+jerseyIcon(k,15,false)+
        '<span style="font-size:11.5px;font-weight:700;font-family:'+FONT+';font-variant-numeric:tabular-nums;line-height:1;min-width:10px;text-align:left;color:'+(dim?NEU[300]:NEU[500])+';">'+n+'</span></span>';
    });
    var panel="";
    if(isOpen){
      panel='<div style="margin:2px 12px 12px;padding:10px 12px 8px;border-radius:14px;background:rgba(255,255,255,0.85);display:flex;flex-direction:column;gap:4px;">'+
        '<span style="font-size:10px;font-weight:700;color:#888888;text-align:center;letter-spacing:0.2px;text-transform:uppercase;">Poeng gjennom touret</span>'+
        buildPointsGraph(r.cumPoints,pal.base)+
        '<span style="font-size:10.5px;font-weight:600;color:#555555;text-align:center;font-variant-numeric:tabular-nums;">'+
          '<b style="color:'+pal.dark+';">'+r.totalJerseys+'</b> trøyer <span style="color:#D8D8D8;"> · </span>'+
          '<b style="color:'+pal.dark+';">'+fmtNb(r.minutes/60)+'</b> t trening <span style="color:#D8D8D8;"> · </span>'+
          '<b style="color:'+pal.dark+';">'+fmtNb(r.dist)+'</b> km</span>'+
      '</div>';
    }
    return '<div style="border-radius:16px;transition:background .18s,box-shadow .18s;'+
        'background:'+(isOpen?pal.soft:"rgba(255,255,255,0.55)")+';box-shadow:'+(isOpen?("inset 0 0 0 1.5px "+pal.base):"0 1px 3px rgba(0,0,0,.05)")+';">'+
      '<div style="display:grid;grid-template-columns:13px 40px auto 1fr auto;align-items:center;column-gap:8px;width:100%;padding:9px 12px 9px 8px;font-family:'+FONT+';">'+
        '<span style="font-family:'+FONT+';font-size:13px;font-weight:700;text-align:center;line-height:1;font-variant-numeric:tabular-nums;color:'+(r.rank===1?pal.dark:NEU[300])+';">'+r.rank+'</span>'+
        '<span style="width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;font-family:'+FONT+';box-shadow:0 2px 5px rgba(0,0,0,.18);flex-shrink:0;background:'+pal.base+';border:'+(r.rank===1?"2.5px solid #FAD067":"2.5px solid #fff")+';">'+r.id+'</span>'+
        '<span style="display:flex;align-items:baseline;gap:2px;flex-shrink:0;"><span style="font-family:'+FONT+';font-size:16px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-0.2px;color:'+pal.dark+';">'+pointsLabel+'</span><span style="font-size:10px;font-weight:600;color:#888888;font-family:'+FONT+';">p</span></span>'+
        '<span style="display:flex;align-items:center;justify-content:flex-end;gap:5px;min-width:0;">'+coins+'</span>'+
        '<button data-graph="'+r.id+'" aria-label="Vis form" style="width:26px;height:26px;border-radius:8px;border:1.5px solid '+(isOpen?pal.base:NEU[100])+';background:'+(isOpen?pal.base:"#fff")+';cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;transition:background .18s,border-color .18s;">'+
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="'+(isOpen?"#fff":NEU[400])+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 16 9 10 13 14 21 6"/></svg>'+
        '</button>'+
      '</div>'+panel+'</div>';
  }

  function renderYear(){
    var host=yearCard?yearCard.querySelector(".tdk-year"):null;
    if(!host) return;
    var TOP_N=3;
    var visibleRows=yState.expanded?Y_ROWS:Y_ROWS.slice(0,TOP_N);
    var hiddenCount=Y_ROWS.length-TOP_N;

    var front=
      '<div style="position:relative;z-index:2;display:flex;flex-direction:column;padding:16px 18px 70px;">'+
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;position:relative;z-index:7;">'+
          '<div><div style="font-size:14px;font-weight:700;color:#555555;">Tour de Konka</div>'+
          '<div style="font-size:10px;color:#888888;margin-top:1px;font-weight:500;">Sammenlagt · hittil i '+TOUR.year+'</div></div>'+
        '</div>'+
        buildTourBar()+
        '<div style="margin-top:16px;display:flex;flex-direction:column;gap:7px;position:relative;z-index:6;">'+
          visibleRows.map(buildMemberRow).join("")+
        '</div>'+
        (hiddenCount>0?
          '<button class="tdk-y-expand" style="margin-top:10px;align-self:center;display:inline-flex;align-items:center;gap:5px;padding:7px 16px;border-radius:100px;border:1px solid #EFEFEF;background:rgba(255,255,255,0.75);cursor:pointer;font-family:'+FONT+';font-size:11.5px;font-weight:700;color:#555555;position:relative;z-index:6;">'+
            (yState.expanded?"Vis færre":("Vis alle "+Y_ROWS.length))+'<span style="font-size:8px;color:#888888;transition:transform .2s;transform:'+(yState.expanded?"rotate(180deg)":"none")+';">▾</span></button>'
          :'')+
      '</div>';

    var backJerseys="";
    JERSEY_ORDER.forEach(function(k){
      var w=JERSEY_WEIGHT[k];
      backJerseys+='<div style="display:flex;align-items:center;gap:9px;">'+jerseyIcon(k,18,true)+
        '<span style="font-size:12px;color:#D8D8D8;line-height:1.2;flex:1;min-width:0;"><b style="color:#fff;">'+Y_JERSEYS[k].label+'</b> · '+Y_JERSEYS[k].desc+'</span>'+
        '<span style="font-size:11px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;background:rgba(255,255,255,0.12);border-radius:100px;padding:2px 9px;flex-shrink:0;white-space:nowrap;">'+(w%1===0?w:String(w).replace(".",","))+' p</span></div>';
    });
    var back=
      '<div style="position:relative;z-index:2;background:#070707;border-radius:16px;padding:22px 22px 20px;color:#fff;display:flex;flex-direction:column;min-height:380px;">'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><span style="font-size:18px;">🚴</span><span style="font-size:16px;font-weight:700;">Tour de Konka — i år</span></div>'+
        '<p style="font-size:12.5px;line-height:1.65;color:#D8D8D8;margin:0;">Hvert år er ett <b style="color:#fff;">tour</b> på 52 ukes-etapper, og nullstilles ved nyttår. Her ser du <b style="color:#fff;">sammenlagt</b> hittil i år — rangert etter <b style="color:#fff;">poeng</b> fra de fem trøyene (gul teller mest).</p>'+
        '<div style="margin-top:14px;display:flex;flex-direction:column;gap:9px;">'+backJerseys+'</div>'+
        '<p style="font-size:12.5px;line-height:1.65;color:#D8D8D8;margin-top:12px;">Hver uke kåres én vinner av hver trøye, som gir poengene over. <b style="color:#fff;">Grønn, lilla og hvit</b> krever ingen distanse- eller høydedata — alle kan jage dem, uansett sport. Kurven viser <b style="color:#fff;">poeng gjennom touret</b>.</p>'+
        '<button class="tdk-y-backbtn" style="margin-top:auto;align-self:flex-start;padding:8px 16px;border-radius:8px;border:1.5px solid #555555;background:transparent;color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:'+FONT+';">← Tilbake</button>'+
      '</div>';

    host.innerHTML=buildTerrainFooter()+(yState.flipped?back:front);
    wireYear(host);
  }

  function wireYear(host){
    host.querySelectorAll("[data-graph]").forEach(function(b){
      b.addEventListener("click",function(){ var id=b.getAttribute("data-graph"); yState.openGraph=(yState.openGraph===id?null:id); renderYear(); });
    });
    var exp=host.querySelector(".tdk-y-expand");
    if(exp) exp.addEventListener("click",function(){ var was=yState.expanded; yState.expanded=!was; if(was) yState.openGraph=null; renderYear(); });
    var bb=host.querySelector(".tdk-y-backbtn");
    if(bb) bb.addEventListener("click",function(){ yState.flipped=false; renderYear(); });
  }

  /* ── Info-knapper (flip) for begge views ── (kan ligge i hvert sitt kort) */
  [card, yearCard].forEach(function(c){
    if(!c) return;
    c.querySelectorAll("[data-tdk-info]").forEach(function(btn){
      btn.addEventListener("click",function(){
        var which=btn.getAttribute("data-tdk-info");
        if(which==="week"){ wState.flipped=true; renderWeek(); }
        else { yState.flipped=true; renderYear(); }
      });
    });
  });

  /* Lukk uke-meny ved klikk utenfor */
  document.addEventListener("click",function(){ if(wState.menuOpen){ wState.menuOpen=false; renderWeek(); } });

  renderWeek();
  renderYear();
})();


/* ===================================================================== */

// --- Blokk 7: Personlige treningsmål + makspuls — bottom sheet (Innstillinger) ---
(function(){
  var card = document.getElementById("sk-innstillinger-pers");
  if (!card) return;
  var cfg = {
    okter: { title:"Økter per uke",    sub:"Hvor mange treninger vil du ha?", unit:"stk",
      icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l2-6 3 3 2-4 2 7"/></svg>' },
    dist:  { title:"Distanse per uke",  sub:"Antall kilometer totalt", unit:"km",
      icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 21h8"/></svg>' },
    tid:   { title:"Tid per uke",       sub:"Antall timer trening", unit:"t",
      icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>' },
    puls:  { title:"Din makspuls",      sub:"Brukes til å regne ut pulssonene dine", unit:"bpm", zones:true,
      icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 21s-7-4.6-9.3-9.1C1.3 9.1 2.5 5.5 5.8 5.1c2-.2 3.4 1 4.2 2.3.8-1.3 2.2-2.5 4.2-2.3 3.3.4 4.5 4 3.1 6.8C19 16.4 12 21 12 21z"/></svg>' }
  };

  // Pulssoner — samme farger og navn som Pulssoner-diagrammet (Z1–Z5).
  // Rene prosent av makspuls; Z0 (hvile) utelates da den ikke avledes av makspuls.
  var ZONES = [
    {name:"Z1 · Oppvarming", color:"#AADEEE", lo:0.50, hi:0.60},
    {name:"Z2 · Lett",       color:"#91BCFF", lo:0.60, hi:0.70},
    {name:"Z3 · Aerob",      color:"#FAD067", lo:0.70, hi:0.80},
    {name:"Z4 · Terskel",    color:"#FFB2E3", lo:0.80, hi:0.90},
    {name:"Z5 · Maks",       color:"#FFA39B", lo:0.90, hi:1.00}
  ];

  var scrim = card.querySelector(".pgoal-scrim");
  var input = card.querySelector(".pgoal-input");
  var zonesBox = card.querySelector(".pgoal-zones");
  var active = null;

  function renderZones(max){
    zonesBox.innerHTML = ZONES.map(function(z){
      return '<div class="zrow"><span class="zdot" style="background:'+z.color+'"></span>'+
        '<span class="zname">'+z.name+'</span>'+
        '<span class="zval">'+Math.round(z.lo*max)+'–'+Math.round(z.hi*max)+' bpm</span></div>';
    }).join("");
  }

  function open(key){
    active = key;
    var c = cfg[key];
    card.querySelector(".pgoal-sheet-ic").innerHTML = c.icon;
    card.querySelector(".pgoal-sheet-title").textContent = c.title;
    card.querySelector(".pgoal-sheet-sub").textContent = c.sub;
    card.querySelector(".pgoal-input-unit").textContent = c.unit;
    var cur = card.querySelector('[data-val="'+key+'"]').textContent.replace(/[^0-9]/g,"");
    input.value = cur;
    if (c.zones) {
      zonesBox.style.display = "flex";
      renderZones(parseInt(cur,10) || 190);
      input.oninput = function(){ renderZones(parseInt(input.value,10) || 0); };
    } else {
      zonesBox.style.display = "none";
      input.oninput = null;
    }
    scrim.classList.add("open");
    setTimeout(function(){ input.focus(); }, 260);
  }
  function close(){ scrim.classList.remove("open"); }
  function save(){
    var c = cfg[active];
    var val = input.value || "0";
    card.querySelector('[data-val="'+active+'"]').innerHTML = val + '<span class="pgoal-unit"> '+c.unit+'</span>';
    close();
  }

  // Mål-rader (okter/dist/tid) og makspuls-raden deler samme bottom sheet
  card.querySelectorAll(".pgoal-row, .pgoal-hr-row").forEach(function(row){
    row.addEventListener("click", function(){ open(row.getAttribute("data-goal")); });
  });
  scrim.addEventListener("click", function(e){ if (e.target === scrim) close(); });
  card.querySelector(".pgoal-save").addEventListener("click", save);
})();
