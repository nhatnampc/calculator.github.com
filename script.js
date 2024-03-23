		var hist = "";
		var hstTop = "";
		var parN = "";
		var par1 = "";
		var opp = "";
		var par0 = "";
		var noedit = false;
		var c_ac = false;
		var infopopup = false;
		var menuShown = false;
		var browserlocale = navigator.language;
		var localeTest = (1000.1).toLocaleString(browserlocale);
		var localeMode = 0;
		if(localeTest.charAt(5) == ",") {
			if(localeTest.charAt(1) == ".") {
				localeMode = 1;
			} else {
				localeMode = 2;
			}
		}
		
// Đường dẫn đến tệp âm thanh
var audioUrl = 'https://lake-e.github.io/iPad-Calculator/resources/keyboard-click.wav';

// Hàm phát âm thanh
function playClickSound() {
    var audio = new Audio(audioUrl);
    audio.play();
}

// Lặp qua từng phần tử <span> trong danh sách và gắn hành động phát âm thanh vào sự kiện click
var spanIds = ["b-ac", "b-sig", "b-per", "b-div", "b-7", "b-8", "b-9", "b-tim", "b-4", "b-5", "b-6", "b-min", "b-1", "b-2", "b-3", "b-plu", "b-0", "b-dec", "b-equ"];

spanIds.forEach(function(spanId) {
    var spanElement = document.getElementById(spanId);
    spanElement.addEventListener('click', function() {
        playClickSound();
    });
});

		
		var eventUsage = 0;
		document.body.addEventListener("click", function(e) {
			if(e.target.id.startsWith("b-")) {
               			eventUsage = 2;
            		}
			handleClick(e);
		});
		document.body.addEventListener("touchend", function(e) {
			if(eventUsage == 1){
				handleClick(e);
			} else {
				setTimeout(function(){
					if(eventUsage == 0) {
						if(e.target.id.startsWith("b-")) {
							eventUsage = 1;
						}
						handleClick(e);
					}
				}, 100);
			}
		});
		function handleClick(e) {
			var id = e.target.id;
			if(id.startsWith("hstItm")){
				if(noedit == 1) {
					ac();
				}
				par0 = e.target.getAttribute('data-value');
				noedit = 2;
				display_update();
				return;
			}
			if(!id.startsWith("b-")){
				return;
			}
			id = id.substring(2,id.length);
			handleButton(id);
		}
		function handleButton(id) {
			scrollHst();
			if(parseInt(id) >= 0){
				if(par0.replace('.', '').length > 9 && !noedit){return;}
				if(noedit){
					if(noedit==1) {
						ac();
					} else {
						par0 = "";
					}
					noedit = 0;
				}
				par0 += id;
				if(!c_ac){
					c_ac_set(1);
				}
			}
			if(id=="dec"||id=="."||id==","){
				if(noedit) {
					ac();
				}
				if(par0.toString().includes(".")) {return;}
				if(par0 == "") {par0 = "0"}
				par0 += ".";

				if(!c_ac){
					c_ac_set(1);
				}
			}
			if(id=="plu"||id=="+"||id=="p"){
				oppr("+");
			}
			if(id=="min"||id=="-"||id=="m"){
				oppr("-");
			}
			if(id=="tim"||id=="*"||id=="x"){
				oppr("*");
			}
			if(id=="div"||id=="/"){
				oppr("/");
			}
			if(id=="per"||id=="%"||id=="d"){
				if(par0 != ""){
					if(noedit == 1) {
						addEquHst();
					}
					if(par0 == "Error") {par0 = "0"}
					par0 = eval(par0+" / 100");
					noedit = 2;
				}
				checkOutOfBounds();
			}
			if(id=="sig"||id=="n"||id=="Tab"){
				if(noedit == 1) {
					addEquHst();
					noedit = 2;
				}
				if(par0 == "Error"||par0=="") {par0 = "0";}
				if(par0.startsWith("-")){
					par0=par0.substring(1);
				}else{
					par0 = "-"+par0;
				}
			}
			if(id=="equ"||id=="="||id=="Enter"||id=="e") {
				equ();
			}
			if(id=="ac"||id=="c"||id=="a") {
				if(c_ac && id!="a") {
					par0 = "0";
					c_ac_set();
				} else {
					if(!(par0==""&&opp==""&&par1=="")){
						ac();
					} else if(infopopup==0){
						mbutton = document.getElementById("b-ac")
						mbutton.style.backgroundColor = "rgb(254, 160, 12)";
						document.getElementById("info").style.display="block";
						document.getElementById("ac").style.display="none";
						document.getElementById("c").style.display="none";
						infopopup=1;
						setTimeout(function(){
							mbutton.style.backgroundColor = "#A0A0A0";
							//mbutton.innerHTML = "<span style='position:relative;left:3px;top:5px;'>&#x2139;&#x20DD;</span>";
							infopopup=0;
							c_ac_set(c_ac);;
                        }, 2000);
					} else {
						document.getElementById("logo").src = document.getElementById("applogo").href;
						var pop = document.getElementById("popup")
						document.getElementById("not-installed").style.display = "none";
						document.getElementById("infopane").style.display = "block";
						pop.style.display = "grid";
						pop.style.opacity = "1";
					}
				}
			}
			display_update();
		}
		function display_update() {
			par1=trimLeadingZeros(par1, 1);
			par0=trimLeadingZeros(par0, 0);

			var dispOpp = opp;
			var disppar1 = par1;
			var dispCur = par0;
			if(opp == "*"){dispOpp = "&times;"}
			if(opp == "/"){dispOpp = "&divide;"}
			if(opp == "-"){dispOpp = "&minus;"}
			disppar1 = frmtForDisplay(disppar1);
			if(noedit){
				if(dispCur!="-0"){
					dispCur = frmtForDisplay(dispCur);
				}
				console.log(dispCur);
			} else if(dispCur!="" && !dispCur.includes('e') && dispCur != "Error"){
				dispCurFormatted = parseFloat(dispCur).toLocaleString('en-US');
				if(dispCur.includes('.')){
					dispCur = dispCurFormatted.split(".")[0] + "." + dispCur.split(".")[1];
				} else {
					dispCur = dispCurFormatted;
				}
			}
			console.log(" > " + dispCur);
			if(dispOpp.length > 0){
				hstTop=parN+(parN==""?"":" ")+"<span id='cur-hst'>"+disppar1+"</span>";
			} else {
				hstTop = "";
			}
			updateHst();
			var disp = dispOpp + (dispOpp==""?"":" ") + dispCur;
			if(disp==""){disp="0";}
			if(localeMode == 1){
				disp = disp.split(',').join('$A');
				disp = disp.split('.').join(',');
				disp = disp.split('$A').join('.');
			} else if(localeMode == 2){
				disp = disp.split(',').join('$A');
				disp = disp.split('.').join(',');
				disp = disp.split('$A').join('&nbsp;');
			}
			document.getElementById("display").innerHTML =  disp;
			updateSize();
		}
		document.addEventListener('keydown', (event) => {
			if(event.key == "Backspace"){
				backspace();
				return;
			}
			if(event.key == "Escape"){
				hidePopup();
				return;
			}
			handleButton(event.key);
			
        });
		function equ() {
			noedit = true;
			if(par0 == ""){
				par0 = par1;
			}
			try {
				par1 = trimLeadingZeros (par1, 1);
				par0 = trimLeadingZeros(par0, 0);
				if(opp.length==0){
					if(par0==""){par0 = "0";}
					try {
						par0 = eval(par0);
					} catch {
						par0 = "Error"
					}
					if(!isFinite(par0)) {par0 = "Error";}
					return;
				}
				var hstEntry = "";
				if(parN!="") {
					parN.split(" ").forEach(function(i) {
						if(i != "") {
							if("*/+-".includes(i)){
								hstEntry += " " + i.replace("/","&divide;").replace("*","&times;").replace("-","&minus;") + "&nbsp;";
							} else {
								hstEntry += frmtHstEntry(i)
							}
						}
					});
				}
				hstEntry += frmtHstEntry(par1);
				hstEntry += " " + opp.replace("/","&divide;").replace("*","&times;").replace("-","&minus;") + "&nbsp;";
				hstEntry += frmtHstEntry(par0);
				addHist(hstEntry);
				par0 = eval(parN + par1 + " "  + opp + " " + par0);
				checkOutOfBounds();
			} catch (e){
				par0 = "Error";
			}
			if(!isFinite(par0)){
				par0 = "Error";
			}
			parN = "";
			par1 = "";
			opp = "";
			if(c_ac){
				c_ac_set(0);
			}
		}
		function checkOutOfBounds() {
			if((Math.abs(par0) > parseFloat("1e160") || Math.abs(par0) < parseFloat("1e-100")) && par0 != 0){
				par0 = "Error";
			}
		}
		function oppr(o) {
			if(par0 == "Error"){ac();}
			if(par1==""){par1="0";}
			if(opp == ""){
				var wasnoedit = noedit;
				equ();
				if(wasnoedit == 1){
					addEquHst();
				}
				par1 = par0;
				par0 = "";
				opp = o;
			} else if(par0 == ""){
				if (opp != o){
					opp = o;
				} else  {
					opp = "";
					par0 = par1;
					par1 = "";
				}
			} else if((opp == "+" || opp =="-" || parN != "") && (o == "*" || o == "/")) {
				parN += par1 + " " + opp + " ";
				opp = o;
				par1 = par0;
				par0 = "";
			} else {
				equ();
				oppr(o);
			}
			noedit = 0;
		}
		function trimLeadingZeros(i, m){
			try{
				i=i.toString();
				var neg = 0;
				if(i.startsWith("-")){
					i=i.substring(1);
					neg=1;
				}
				i = i.replace(/^0+([0-9])/, "$1");
				if(i.includes('.') && m && !i.includes('e')){
					i = i.replace(/0+$/, "");
				}
				if(neg){
					i="-"+i;
				}
				return i;
			}catch{return i;}
		}
		function ac() {
			addEquHst();
			noedit = 0;
			parN = "";
			par1 = "";
			opp = "";
			par0 = "";
		}
		function addEquHst() {
			if(!hist.endsWith("<hr>") && hist != "")
			addHist("=&nbsp;" + frmtHstEntry(par0) +"<hr>", 1);
		}
		function addHist(hstitm, rtn){
			hist += hstitm + (rtn==1?"":"<br>");
			updateHst();
			scrollHst();
		}
		function updateHst() {
			var dhist = hist;
			if(localeMode == 1){
				dhist = dhist.split(',').join('$A').split('.').join(',').split('$A').join('.');
				hstTop = hstTop.split(',').join('$A').split('.').join(',').split('$A').join('.');
			} else if(localeMode == 2){
				dhist = dhist.split(',').join('$A').split('.').join(',').split('$A').join('&nbsp;');
				hstTop = hstTop.split(',').join('$A').split('.').join(',').split('$A').join('&nbsp;');
			}
			document.getElementById("hst").innerHTML = dhist + hstTop;
		}
		function scrollHst(){
			document.getElementById("hst-wrapper").scrollTop = hst.scrollHeight;
		}
		function frmtHstEntry(entry) {
			
			var output = "<span id='hstItm-" + ((new Date()).getTime()) + "' data-value='";
			output += entry;
			output += "'>";
			entry = frmtForDisplay(entry);
			output += entry;
			output += "</span>";
			return output;
		}
		function frmtForDisplay(frmtInput) {
			if(frmtInput == "Error") {return frmtInput;}
			frmtInput = parseFloat(frmtInput);
			if(Math.abs(frmtInput) >= 1000000000 || Math.abs(frmtInput) <= 0.000000001 && frmtInput != 0){
				frmtInput = frmtInput.toPrecision(6);
				frmtInput = parseFloat(frmtInput).toExponential();
				frmtInput = frmtInput.replace("+","");
			} else {
				frmtInput = parseFloat(frmtInput.toFixed(10));
				frmtInput = frmtInput.toLocaleString("vi-VN", {maximumSignificantDigits: 10});
			}
			return frmtInput;
		}
		document.getElementById("hst-wrapper").onscroll = function(e){
			var scrollpast = (e.target.scrollHeight - e.target.clientHeight) - e.target.scrollTop;
			if(scrollpast < 0/*&& (par0 == "0" || par0 == "") && opp =="" && par1 == ""*/){
				var opacset = 1-((-scrollpast) / 120);
				console.log(opacset);
				if(opacset <= 0) {
					hist = "";
					ac();
					display_update();
					document.getElementById('displayContainer').style.transitionDuration = "1s";
					document.getElementById('displayContainer').style.opacity = 1;
				} else if(hist != "") {
					document.getElementById('displayContainer').style.transitionDuration = "0s";
					document.getElementById('displayContainer').style.opacity = opacset;
				}
			}

		};
		/*** BUTTON PRESS UI ***/ 
		document.body.addEventListener("touchstart", function(e) { 
			var touchColor = "";
			var className = e.target.className;
			if (className.includes("gray")){
				touchColor = "#737373";
			}
			if (className.includes("white")){
				touchColor = "#D9D9D9";
			}
			if (className.includes("orange")){
				touchColor = "#F3C895";
			}
			e.target.style.backgroundColor = touchColor;
			e.target.style.transition = "background-color 0s, opacity 0.5s, transform 0.2s";
		}, false);
		document.body.addEventListener("touchend", function(e) { 
			var className = e.target.className;
                     e.target.style.transition = "background-color 0.5s, opacity 0.5s, transform 0.2s";
                     setTimeout(function(){
                           e.target.style.backgroundColor = "";
                       }, 20);
		}, false);
		function updateSize() {
			let w = display.clientWidth / 2;
			const disp = document.getElementById("display");
			const mw = document.getElementById("displayContainer").clientWidth;

			disp.style.display = "inline-block";
			var t = 80; /* max display font size (2/2) */
			disp.style.fontSize = t + "px";
			while(disp.clientWidth >= mw - 15) {
				t -= 1;
				disp.style.fontSize = t + "px";
			}
			disp.style.display = "block";


			var hstwpr = document.getElementById("hst-wrapper");
			hstwpr.style.height = document.getElementById("buttons").getBoundingClientRect().top - 16 + "px"; //document.body.clientHeight - 550 + "px";
			scrollHst();
		}
		function c_ac_set(i){
			if(i == undefined){
				c_ac = !c_ac;
			} else {
				c_ac = i;
			}
			if(c_ac) {
				document.getElementById("ac").style.display="none";
				document.getElementById("info").style.display="none";
				document.getElementById("c").style.display="inline-block";
			} else {
				document.getElementById("ac").style.display="inline-block";
				document.getElementById("c").style.display="none";
				document.getElementById("info").style.display="none";
			}
		}
		/** Swipe listener **/
		display.addEventListener('touchstart', handleTouchStart, false);        
		display.addEventListener('touchmove', handleTouchMove, false);
		var xDown = null;                                                        
		var yDown = null;
		function getTouches(evt) {
		return evt.touches ||             // browser API
				evt.originalEvent.touches; // jQuery
		} 															
		function handleTouchStart(evt) {
			const firstTouch = getTouches(evt)[0];                                      
			xDown = firstTouch.clientX;                                      
			yDown = firstTouch.clientY;                                      
		};         																
		function handleTouchMove(evt) {
			if ( ! xDown || ! yDown ) {
				return;
			}
			var xUp = evt.touches[0].clientX;                                    
			var yUp = evt.touches[0].clientY;
			var xDiff = xDown - xUp;
			var yDiff = yDown - yUp;																
			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
				if ( xDiff > 5  || xDiff < -5 ) { /* Left swipe */
						backspace();
				}                     
			}
			xDown = null;
			yDown = null;                                             
		};
		function backspace() {
			if(!noedit){
					try {
						if(par0 == "-0"){par0 = "0"}
						par0 = par0.substring(0,par0.length-1);
						if(par0 == "-"){par0 = "-0"}
					} catch {}
					display_update();
				}
		}
		window.addEventListener("resize", updateSize);
		addEventListener("load", function() {
			const mqStandAlone = '(display-mode: standalone)';
			let url = window.location.href;
			if (!(navigator.standalone || window.matchMedia(mqStandAlone).matches) || url.includes('?install=true') || url.includes('&install=true')) {
				document.getElementById("logo").src = document.getElementById("applogo").href;
				var pop = document.getElementById("popup")
				document.getElementById("not-installed").style.display = "block";
				pop.style.display = "grid";
				pop.style.opacity = "1";
			}
			if(localeMode != 0) {
				document.getElementById('b-dec').innerHTML="<span>,</span>";
			}
			updateSize();
			
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('/iPad-Calculator/serviceworker.js').then(
					() => {
						console.error('Service Worker registered! (A)')
				    	},
					err => {
						navigator.serviceWorker.register('/serviceworker.js').then(
					    		() => {
					      			console.error('Service Worker registered! (B)')
					    		},
					   	 	err => {
					      			console.error('SW registration failed!', err)
					    		}
					  	) 
				    }
				  )
                        } else {
				console.log("Service Workers Not Supported!");
			}
		});
		function hidePopup() {
			var pop = document.getElementById("popup")
			pop.style.opacity = "0.0";
			setTimeout(function(){
				pop.style.display = "none";
			}, 500);
		}