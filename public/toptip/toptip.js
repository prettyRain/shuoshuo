/**
 * Created by prettyRain on 2018/12/11.
 */


function tipAlert(){
    var timer;
    return function(content){
        window.clearTimeout(timer);
        timer = window.setTimeout(function(){
            var eleP = document.createElement("p");
            eleP.className = "ptip";
            eleP.innerHTML = content;
            window.document.body.appendChild(eleP);
            var ptip = document.querySelector(".ptip");
            ptip.style.marginLeft = "-"+ptip.offsetWidth/2+"px";
            ptip.className = "ptip animate";
           window.setTimeout(function(){
               window.document.body.removeChild(ptip);
           },2500)
        },1000)
    }
}