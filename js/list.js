window.onload = function()
{
	console.log("list");
	
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
        	window.open("index.html","_blank");
    });
    
	//This sessionStorage.getItem(); is also a predefined function in javascript
	var list = document.getElementById('macrolist');

	//will retrieve session and get the value;
	//var a = sessionStorage.getItem("sent");
	//카카오, 라인, 페이스북 구분해서 localStorage에서 불러오기
	var a;
	var aa = sessionStorage.getItem("selectview"); 
	
	if(aa === "kakao")
		a = localStorage.getItem("sent");
	else if(aa === "line")
		a = localStorage.getItem("sent1");
	else if(aa === "facebook")
		a = localStorage.getItem("sent2");
	else
		a = "error";
	//alert("localStorage = " + a);
	
	var object_list = JSON.parse(a);
	
	var len = Object.keys(object_list).length;

	for(var i=0; i<len; i++) 
	{
		var list4 = document.createElement("li");
		var list5 = document.createElement("p");
		
		//list5.href = "#";
		list5.clas = "llist";
		list5.style.textAlign = 'left';
		//list5.style.fontSize = "30px";
		list5.innerHTML = object_list[i].name;
		//var node = document.createTextNode(object_list[i].name);
		//list5.appendChild(node);
		list4.appendChild(list5);
		
		list.appendChild(list4);
		
		var hr = document.createElement("hr");
		list.appendChild(hr);
	}
}