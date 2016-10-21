var SAAgent = null;
var SASocket = null;
var ProviderAppName = "HelloAccessoryProvider";
var CHANNELID = 104;

var object = new Array(10);

window.onload = function () {	
	// add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });

    connect();
    
	//SASocket = sessionStorage.getItem("SASocket");
	//SAAgent = sessionStorage.getItem("SAAgent");

    var count = sessionStorage.getItem("count");
    var id = sessionStorage.getItem("id");
    
    var list = document.getElementById('inputlist');
    
    //alert(count);
    
    list.innerHTML += "반복" + "<input type=\"text\" name=\"1111\" id=\"rrrr\" value=\"1\" style=\"width:50%;\"><br>"
    
    for(var i=1;i<=count;i++)
    {
        list.innerHTML += i + "번째입력 " + "<input type='text' name='BUSINESS' id='" + "input" + count + "-" + i + "' value='" + count + "-" + i + "' style=\"width:50%\"><br>";
    }

    list.innerHTML += "<input type=\"button\" id=\"button\" value=\"전송\"><br>";
    
	var button = document.getElementById("button");
	
    (function(){
		button.addEventListener("click", function() {

			//COMMAND:ID:
		    var message = String("COMMAND:");
			
			var ttt = document.getElementById("rrrr");
			var repeat = ttt.value;

			message = message + repeat + ":" + id + ":";
			
		    for(var i=1;i<=count;i++)
		    {
		       object[i-1] = document.getElementById("input" + count + "-" + i);
		       message = message + object[i-1].value + ", ";
		    }

			try {
				//alert(message);
				SASocket.sendData(CHANNELID, message);
			} catch(err) {
				alert("exception [" + err.name + "] msg[" + err.message + "]");
			}
		}, false);})();
};

//----------------------------------------------------------

function onerror(err) {
	alert("err [" + err + "]");
}

var agentCallback = {
	onconnect : function(socket) {
		SASocket = socket;
		console.log("연결이 성공적으로 완료되었습니다.");
		SASocket.setSocketStatusListener(function(reason){
			alert("서비스 연결이 끊어졌습니다. 원인 : [" + reason + "]");
			disconnect();
		});

		SASocket.setDataReceiveListener(onreceive);
	},
	onerror : onerror
};

var peerAgentFindCallback = {
	onpeeragentfound : function(peerAgent) {
		try {
			if (peerAgent.appName == ProviderAppName) {
				SAAgent.setServiceConnectionListener(agentCallback);
				SAAgent.requestServiceConnection(peerAgent);
			} else {
				alert("Not expected app!! : " + peerAgent.appName);
			}
		} catch(err) {
			alert("exception [" + err.name + "] msg[" + err.message + "]");
		}
	},
	onerror : onerror
}

function onsuccess(agents) {
	console.log("onsuccess");
	try {
		if (agents.length > 0) {
			SAAgent = agents[0];

			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
			SAAgent.findPeerAgents();
		} else {
			alert("Not found SAAgent!!");
		}
	} catch(err) {
		alert("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function connect() {	
	console.log("connect");
	if (SASocket) {
		alert('이미 연결되어 있습니다.');
        return false;
    }
	try {
			webapis.sa.requestSAAgent(onsuccess, function (err) {
			alert("err [" + err.name + "] msg[" + err.message + "]");
		});
	} catch(err) {
		alert("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function disconnect() {
	console.log("disconnect");
	try {
		if (SASocket != null) {
			SASocket.close();
			SASocket = null;
			//alert("연결해제 완료");
		}
	} catch(err) {
		alert("exception [" + err.name + "] msg[" + err.message + "]");
	}
}


function onreceive(channelId, data) {
	console.log("onreceive");
	//split
	var s = data.split('|');

	if(s[0] === 'COMMANDRESULT')
	{
		if(s[1] === '1')
			alert("성공");
		else if(s[1] === '0')
			alert("실패");
		else
			alert("오류 발생");
	}
	
	disconnect();
	window.open("index.html","_blank");
}

//-----------------------------------------------------------