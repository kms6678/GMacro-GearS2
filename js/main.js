/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 *        notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 *       copyright notice, this list of conditions and the following disclaimer
 *       in the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Co., Ltd. nor the names of its
 *       contributors may be used to endorse or promote products derived from
 *       this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var SAAgent = null;
var SASocket = null;
var CHANNELID = 104;
var ProviderAppName = "HelloAccessoryProvider";
var macro_id = new Array(100);
var macro_option = new Array(100);

var ss = 0;
var rot_flag1 = 0;
var rot_flag2 = 0;

function createHTML(log_string)
{
	var content = document.getElementById("toast-content");
	content.textContent = log_string;
	tau.openPopup("#toast");
}

function onerror(err) {
	console.log("err [" + err + "]");
}

var agentCallback = {
	onconnect : function(socket) {
		SASocket = socket;
		createHTML("연결이 성공적으로 완료되었습니다.");
		SASocket.setSocketStatusListener(function(reason){
			console.log("서비스 연결이 끊어졌습니다. 원인 : [" + reason + "]");
			disconnect();
		});

		SASocket.setDataReceiveListener(onreceive);
		
		sessionStorage.setItem("SASocket", SASocket); 
		sessionStorage.setItem("SAAgent", SAAgent); 
		//매크로 목록 동적추가
		//추가할 때, 명령어 별 ID값 별도 변수로 값을 가지고 있게한다.
		try {
			SASocket.sendData(CHANNELID, "START:");
			//로딩할 때 카카오메세지를 받아옴
			kakao_message_list();
			line_message_list();
			facebook_message_list();
		} catch(err) {
			console.log("exception [" + err.name + "] msg[" + err.message + "]");
		}
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
				createHTML("Not expected app!! : " + peerAgent.appName);
			}
		} catch(err) {
			console.log("exception [" + err.name + "] msg[" + err.message + "]");
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
			createHTML("Not found SAAgent!!");
		}
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function connect() {	
	console.log("connect");
	if (SASocket) {
		createHTML('이미 연결되어 있습니다.');
        return false;
    }
	try {
		webapis.sa.requestSAAgent(onsuccess, function (err) {
			console.log("err [" + err.name + "] msg[" + err.message + "]");
		});
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function disconnect() {
	console.log("disconnect");
	try {
		if (SASocket != null) {
			SASocket.close();
			SASocket = null;
			//createHTML("연결해제 완료");
		}
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}


function onreceive(channelId, data) {
	//createHTML(data);
	console.log("onreceive");
	//split
	var s = data.split('|');

	if(s[0] === 'KA')
	{
	    //which will support for every browser that will store the sessions.
	    //sessionStorage.setItem("sent", s[1]); 
		localStorage.removeItem("sent");
		
	    localStorage.setItem("sent",s[1]);
	    //alert("save local storage : " + s[1]);
	    
	    //this is to open a window in new tab
	    //window.open("MacroList.html","_blank");
	}
	else if(s[0] === 'LINE')
	{
	    //which will support for every browser that will store the sessions.
	    //sessionStorage.setItem("sent", s[1]); 
		localStorage.removeItem("sent1");
		
	    localStorage.setItem("sent1",s[1]);
	    //alert("save local storage : " + s[1]);
	    
	    //this is to open a window in new tab
	    //window.open("MacroList.html","_blank");
	}
	else if(s[0] === 'FACEBOOK')
	{
	    //which will support for every browser that will store the sessions.
	    //sessionStorage.setItem("sent", s[1]); 
		localStorage.removeItem("sent2");
		
	    localStorage.setItem("sent2",s[1]);
	    //alert("save local storage : " + s[1]);
	    
	    //this is to open a window in new tab
	    //window.open("MacroList.html","_blank");
	}
	else if(s[0] === 'COMMANDLIST')
	{
		createHTML("명령어 리스트 로딩중");
		//동적으로 리스트뷰에 추가
		var list = document.getElementById('commandlist');

		var object_list = JSON.parse(s[1]);
		
		var len = Object.keys(object_list).length;

		for(var i=0; i<len; i++) 
		{
			macro_id[i] = object_list[i].id;
			macro_option[i] = object_list[i].option;
			
			//console.log(macro_id[i]);
			//console.log(macro_option[i]);
			
			var list4 = document.createElement("li");
			var list5 = document.createElement("a");

			(function(count, id){
				list5.addEventListener("click", function() {
				   //alert(value);
					//option에 맞는 화면으로 이동 후,
					//입력 화면을 채우고, 전송버튼 누르면 데이터 전송.

					//createHTML(count + "개 입력 요청, ID :" + id);
					
					sessionStorage.setItem("count", count); 
					sessionStorage.setItem("id", id); 

					disconnect();
					window.open("input2.html","_blank");

					//value개 만큼 입렵 팝업 생성
				}, false);})(macro_option[i], macro_id[i]);
			list5.href = "#";
			
			var node = document.createTextNode(object_list[i].description);
			list5.appendChild(node);
			list4.appendChild(list5);
			
			list.appendChild(list4);
		}
	}
	else if(s[0] === 'COMMANDRESULT')
	{
		if(s[1] === '1')
			alert("성공");
		else if(s[1] === '0')
			alert("실패");
		else
			alert("오류 발생");
	}
	//받은 data가 명령어 or 카카오톡 메세지 목록인지 구분.
	//"KM : ~ " 카카오메세지
	//"FM : ~ " 페이스북메세지
	//"LM : ~ " 라인메세지'
	//list.js로 data내용 전달해서 메세지 리스트 생성
	//"COMMAND : ~ " 명령어 결과 성공 or 실패 반환.
}

function kakao_message_list() {
	try {
		SASocket.sendData(CHANNELID, "KAKAOMESSAGE:");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function line_message_list() {
	try {
		SASocket.sendData(CHANNELID, "LINEMESSAGE:");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function facebook_message_list() {
	try {
		SASocket.sendData(CHANNELID, "FACEBOOKMESSAGE:");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function fetch() {
	console.log("fetch");
	try {
		//명령어 리스트가 가지고 있는, 별도 명령어 ID를 Fetch할때 전송해서 매크로 구분한다.
		SASocket.sendData(CHANNELID, "KAKAOMESSAGE:");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function kakaoview() {
	sessionStorage.setItem("selectview", "kakao"); 
	var a = localStorage.getItem("sent");
	
	if(a)
		window.open("MacroList.html","_blank");
	else
		createHTML("연결이 필요합니다.");
}

function lineview() {
	sessionStorage.setItem("selectview", "line"); 
	var a = localStorage.getItem("sent1");
	
	if(a)
		window.open("MacroList.html","_blank");
	else
		createHTML("연결이 필요합니다.");
}

function facebookview() {
	sessionStorage.setItem("selectview", "facebook"); 
	var a = localStorage.getItem("sent2");
	
	if(a)
		window.open("MacroList.html","_blank");
	else
		createHTML("연결이 필요합니다.");
}

window.onload = function () {	
	console.log("start");
	// add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
    
    document.addEventListener("rotarydetent", function(ev) 
    		{
    		   /* Get the direction value from the event */
    		   var direction = ev.detail.direction;
    		   
    		   if (direction == "CW")
    		   {
    		      /* Add behavior for clockwise rotation */
    			  if(ss%2 == 0)
				  {
    				  rot_flag1++;
    				  
    				  if(ss != 0)
					  {
    					  rot_flag2++;
					  }
    				  
    				  if(rot_flag2 == 0 && ss != 0)
					  {
    					  //fetch();
    					  //alert(rot_flag1 + ", " + rot_flag2 + " 전송");
    					  
    					  if(SASocket)
						  {
	    					  try 
	    					  {
	    						  //명령어 리스트가 가지고 있는, 별도 명령어 ID를 Fetch할때 전송해서 매크로 구분한다.
	    						  //alert("SEND MESSAGE : COMMAND:1:9999")
	    						  createHTML("9999 명령어 실행");
	    						  SASocket.sendData(CHANNELID, "COMMAND:1:9999");
	    					  } catch(err) {
	    						  console.log("exception [" + err.name + "] msg[" + err.message + "]");
	    					  }
						  }
    					  else
    						  createHTML("9999 연결이 필요합니다.");
    					  
    					  ss = 0;
    					  rot_flag1 = 0;
    					  rot_flag2 = 0;
					  }
    				  else
					  {
    					  rot_flag2 = 0;
					  }	  
				  }
    			  else
				  {
    				  rot_flag1++;
    				  rot_flag2++;
    				  
    				  if(rot_flag1 == 0 && ss != 0)
					  {
    					  if(SASocket)
						  {
	    					  try 
	    					  {
	    						  //명령어 리스트가 가지고 있는, 별도 명령어 ID를 Fetch할때 전송해서 매크로 구분한다.
	    						  //alert("SEND MESSAGE : COMMAND:1:9999")
	    						  createHTML("9999 명령어 실행");
	    						  SASocket.sendData(CHANNELID, "COMMAND:1:9999");
	    					  } catch(err) {
	    						  console.log("exception [" + err.name + "] msg[" + err.message + "]");
	    					  }
						  }
    					  else
    						  createHTML("9999 연결이 필요합니다.");
    					  
    					  ss = 0;
    					  rot_flag1 = 0;
    					  rot_flag2 = 0;
					  }
    				  else
					  {
    					  rot_flag1 = 0;
					  }	  
				  }
    			  
    			  ss++;
    		   }
    		   else if (direction == "CCW")
    		   {
    		      /* Add behavior for counter-clockwise rotation */
     			  if(ss%2 == 0)
				  {
    				  rot_flag1--;
    				  
    				  if(ss != 0)
					  {
    					  rot_flag2--;
					  }
    				  
    				  if(rot_flag2 == 0 && ss != 0)
					  {
    					  if(SASocket)
						  {
	    					  try 
	    					  {
	    						  //명령어 리스트가 가지고 있는, 별도 명령어 ID를 Fetch할때 전송해서 매크로 구분한다.
	    						  //alert("SEND MESSAGE : COMMAND:1:9999")
	    						  createHTML("8888 명령어 실행");
	    						  SASocket.sendData(CHANNELID, "COMMAND:1:8888");
	    					  } catch(err) {
	    						  console.log("exception [" + err.name + "] msg[" + err.message + "]");
	    					  }
						  }
    					  else
    						  createHTML("8888 연결이 필요합니다.");
    					  
    					  ss = 0;
    					  rot_flag1 = 0;
    					  rot_flag2 = 0;
					  }
    				  else
					  {
    					  rot_flag2 = 0;
					  }
				  }
    			  else
				  {
    				  rot_flag1--;
    				  rot_flag2--;
    				  
    				  if(rot_flag1 == 0 && ss != 0)
					  {
    					  if(SASocket)
						  {
	    					  try 
	    					  {
	    						  //명령어 리스트가 가지고 있는, 별도 명령어 ID를 Fetch할때 전송해서 매크로 구분한다.
	    						  //alert("SEND MESSAGE : COMMAND:1:8888")
	    						  createHTML("8888 명령어 실행");
	    						  SASocket.sendData(CHANNELID, "COMMAND:1:8888");
	    					  } catch(err) {
	    						  console.log("exception [" + err.name + "] msg[" + err.message + "]");
	    					  }
						  }
    					  else
    						  createHTML("8888 연결이 필요합니다.");
    					  
    					  ss = 0;
    					  rot_flag1 = 0;
    					  rot_flag2 = 0;
					  }
    				  else
					  {
    					  rot_flag1 = 0;
					  }	  
				  }
    			  
    			  ss++;
    		   }
    		});
};

(function(tau) {
	var toastPopup = document.getElementById('toast');
	toastPopup.addEventListener('popupshow', function(ev){
		setTimeout(function(){tau.closePopup();}, 1500);
	}, false);
})(window.tau);