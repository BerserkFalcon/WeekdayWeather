(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const c of o)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const c={};return o.integrity&&(c.integrity=o.integrity),o.referrerPolicy&&(c.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?c.credentials="include":o.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(o){if(o.ep)return;o.ep=!0;const c=n(o);fetch(o.href,c)}})();const h=document.getElementById("search-form"),y=document.getElementById("search-input"),f=document.querySelector("#today"),d=document.querySelector("#forecast"),i=document.getElementById("history"),E=document.getElementById("search-title"),m=document.getElementById("weather-img"),g=document.getElementById("temp"),w=document.getElementById("wind"),b=document.getElementById("humidity"),L=async t=>{const n=await(await fetch("/api/weather/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({city:t})})).json(),r=new Date().toLocaleString();console.log("weatherData: ",n),T(n[0],t,r),B(n.slice(1,6))},v=async()=>(await fetch("/api/weather/history",{method:"GET",headers:{"Content-Type":"application/json"}})).json(),H=async t=>{await fetch(`/api/weather/history/${t}`,{method:"DELETE",headers:{"Content-Type":"application/json"}})},T=(t,e,n)=>{const{date:r,icon:o,description:c,temperature:s,wind:a,humidity:p}=t,l=r.split(" ")[0];E.textContent=`Weather in ${e} today (${l}) generated at ${n}`,m.setAttribute("src",`https://openweathermap.org/img/w/${o}.png`),m.setAttribute("alt",c),m.setAttribute("class","weather-img"),E.append(m),g.textContent=`Temp: ${s}°C`,w.textContent=`Wind: ${a} m/s`,b.textContent=`Humidity: ${p}%`,f&&(f.innerHTML="",f.append(E,g,w,b))},B=t=>{const e=document.createElement("div"),n=document.createElement("h4");e.setAttribute("class","col-12"),n.textContent="5-Day Forecast:",e.append(n),d&&(d.innerHTML="",d.append(e));for(let r=0;r<t.length;r++)S(t[r])},S=t=>{const{date:e,icon:n,description:r,temperature:o,wind:c,humidity:s}=t,{col:a,cardTitle:p,weatherIcon:l,tempEl:C,windEl:I,humidityEl:x}=$();p.textContent=e,l.setAttribute("src",`https://openweathermap.org/img/w/${n}.png`),l.setAttribute("alt",r),C.textContent=`Temp: ${o} °C`,I.textContent=`Wind: ${c} m/s`,x.textContent=`Humidity: ${s}%`,d&&d.append(a)},A=async t=>{const e=await t;if(i){i.innerHTML="",e.length||(i.innerHTML='<p class="text-center">No Previous Search History</p>');for(let n=e.length-1;n>=0;n--){const r=P(e[n]);i.append(r)}}},$=()=>{const t=document.createElement("div"),e=document.createElement("div"),n=document.createElement("div"),r=document.createElement("h5"),o=document.createElement("img"),c=document.createElement("p"),s=document.createElement("p"),a=document.createElement("p");return t.append(e),e.append(n),n.append(r,o,c,s,a),t.classList.add("col-auto"),e.classList.add("forecast-card","card","text-white","bg-primary","h-100"),n.classList.add("card-body","p-2"),r.classList.add("card-title"),c.classList.add("card-text"),s.classList.add("card-text"),a.classList.add("card-text"),{col:t,cardTitle:r,weatherIcon:o,tempEl:c,windEl:s,humidityEl:a}},D=t=>{const e=document.createElement("button");return e.setAttribute("type","button"),e.setAttribute("aria-controls","today forecast"),e.classList.add("history-btn","btn","btn-secondary","col-10"),e.textContent=t,e},O=()=>{const t=document.createElement("button");return t.setAttribute("type","button"),t.classList.add("fas","fa-trash-alt","delete-city","btn","btn-danger","col-2"),t.addEventListener("click",M),t},N=()=>{const t=document.createElement("div");return t.classList.add("display-flex","gap-2","col-12","m-1"),t},P=t=>{const e=D(t.name),n=O();n.dataset.city=JSON.stringify(t);const r=N();return r.append(e,n),r},F=t=>{if(t.preventDefault(),!y.value)throw new Error("City cannot be blank");const e=y.value.trim();L(e).then(()=>{u()}),y.value=""},j=t=>{if(t.target.matches(".history-btn")){const e=t.target.textContent;L(e).then(u)}},M=t=>{t.stopPropagation();const e=JSON.parse(t.target.getAttribute("data-city")).id;H(e).then(u)},u=()=>v().then(A);h==null||h.addEventListener("submit",F);i==null||i.addEventListener("click",j);u();
