/* Index values for day and month*/
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March','April','May','June','July','August',
    'September','October','Novenber','December'];


/* Global Variales */
var alarmtime;
var is_alarm_rining;
var timeformat;


/* Night Mode theme for main screen */	
function night_mode()
{
	document.body.style.backgroundColor = "black";
	document.getElementById('clock_text').style.color = 
	document.getElementById('ampm_text').style.color = 
	document.getElementById('date_text').style.color = 
	document.getElementById('alarmsetshow').style.color = "yellow";
}	

/* Day Mode theme for main screen */	
function day_mode()
{
	document.body.style.backgroundColor = "#615f59";
	document.getElementById('clock_text').style.color = 
	document.getElementById('ampm_text').style.color = 	
	document.getElementById('date_text').style.color = 
	document.getElementById('alarmsetshow').style.color = "Yellow";
}	


/*Functions shows time in main screen */	
function showTime()
{
	var date_time = new Date();

	var hour = date_time.getHours();
	var minute = date_time.getMinutes();
	var seconds = date_time.getSeconds();

	hour = add_zero(hour);
	minute = add_zero(minute);
	seconds = add_zero(seconds);

	if(hour >= 20 || hour < 06)
		night_mode();
	else
		day_mode();

	var curr_time = hour + ":" + minute;	
	if(alarmtime == curr_time)
		startAlarming();

	if( timeformat == "12Hr")
	{
		var am_pm = is_am_pm(hour); 
		hour = getHourin12Hrformat(hour);
		document.getElementById('clock_text').innerHTML = hour +":"+ minute;
		document.getElementById('ampm_text').innerHTML = ":"+seconds+" "+am_pm;
	}
	else
	{
		document.getElementById('clock_text').innerHTML = hour +":"+ minute;
		document.getElementById('ampm_text').innerHTML = ":"+seconds;
	}

	document.getElementById('date_text').innerHTML = days[date_time.getDay()] + " " + date_time.getDate() + " "+
		months[date_time.getMonth()] + " " + date_time.getFullYear() ;


	var timeout = setTimeout(showTime, 500);
}


/* To check hour is AM or PM */	
function is_am_pm(x)
{
	if(x >= 12)
		return "PM";
	else 
		return "AM";
}


/* Convert hour to 12 Hr format */	
function getHourin12Hrformat(x)
{
	if(x > 12)
		return (x-12);
	else if( x == 0)
		return 12;
	else
		return x;
}	


/* Add zero befor nuber if it is single digit */	
function add_zero(x)
{
	if(x < 10)
		x = "0" + x;
	return x;
}


/* User input in alarm setting taken in this function */
function getAlarmTime()
{
	var lalarmtime_hour = add_zero(Number(document.getElementById('alarmtime_hour').value));
	var lalarmtime_minute = add_zero(Number(document.getElementById('alarmtime_minute').value));


	if((lalarmtime_hour > 12 && timeformat == "12Hr"))
	{
		alert("Invalid Hour");
		return;
	}
	else if(lalarmtime_hour > 23 )
	{
		alert("Invalid Hour");
		return;
	}

	if(lalarmtime_minute > 59 )
	{
		alert("invalid minute");
		return;
	}

	if(timeformat == "12Hr")
	{
		lalarm_am_pm = document.getElementById('alarm_am_pm').value;
		if(lalarm_am_pm == "pm")
			if(lalarmtime_hour != 12)
				lalarmtime_hour = Number(lalarmtime_hour) + 12;
		if(lalarm_am_pm == "am")
			if(lalarmtime_hour == 12)
				lalarmtime_hour = "00";


	}	
	alarmtime = lalarmtime_hour+":"+lalarmtime_minute;			
	setCookie();
	document.getElementById('alarm_settings').style.display = "none";
	alarmsetshow_parser(alarmtime);
	getCookie();
	setFullScreen(document.documentElement);

}	


/* show next alarm time*/	
function alarmsetshow_parser(x)
{
	var setTimeSting = x;
	if(timeformat == "12Hr")
	{
		var hour = x.split(":");
		setTimeSting = getHourin12Hrformat(hour[0]);
		setTimeSting = setTimeSting + ":" + hour[1] + is_am_pm(hour[0]);
	}

	document.getElementById('alarmsetshow').innerHTML = "@" + setTimeSting;	

}


/* show alarm setting menu */	
function showAlarmSettings()
{
	exitFullScreen();
	if( timeformat == "12Hr")
		document.getElementById('alarm_am_pm').style.display = "block";
	else
		document.getElementById('alarm_am_pm').style.display = "none";

	document.getElementById('alarm_settings').style.display = "block";
}


/* on alarm setting cancel hide setting */
function CancelAlarmTime()
{
	document.getElementById('alarm_settings').style.display = "none";
	setFullScreen(document.documentElement);
}


/* on OFF button press, clear alarm */	
function OffAlarmTime()
{
	document.getElementById('alarmsetshow').innerHTML = " ";
	document.getElementById('alarm_settings').style.display = "none";
	alarmtime = null;
	localStorage.setItem("alarmoff", "1");
	setFullScreen(document.documentElement);
}


/* Alarm sound played here */
function startAlarming()
{
	if(is_alarm_rining == 1)
		return;
	else
		is_alarm_rining = 1;	

	//play alrm audio
	var x = document.getElementById("alarmsong");
	x.loop = true;
	x.play();
	document.getElementById('startAlarm').style.display = "block";	
	console.log("alarming audio\n");
}


/* on User input to stop alarm this function */	
function CloseAlarm()
{

	//pause audio
	var x = document.getElementById("alarmsong");
	x.pause();

	console.log("audio stopped\n");
	//close div
	document.getElementById('startAlarm').style.display = "none";	

	var date_time = new Date();
	var hour = date_time.getHours();
	var minute = date_time.getMinutes();

	hour = add_zero(hour);
	minute = add_zero(minute);

	var current_time = hour+":"+minute;
	if(alarmtime != current_time)
	{
		console.log("Poperly stoping alrm function");
		is_alarm_rining = 0;
		return;
	}
	else
	{
		is_alarm_rining = 1;
	}

	var timeout = setTimeout(CloseAlarm, 5000);			
}


/* enable Main setting display */	
function ShowMainSettings()
{
	exitFullScreen();
	document.getElementById('Mainsettings').style.display = "block";

}


/* take time format from user and set in web storage */	
function SetTimeFormat()
{
	document.getElementById('Mainsettings').style.display = "none";
	timeformat = document.getElementById('time_format_select').value;
	localStorage.setItem("timeformat", timeformat);
	setFullScreen(document.documentElement);

}


/* on user cancel main setting hide it */
function CancelMainSettings()
{
	document.getElementById('Mainsettings').style.display = "none";
	setFullScreen(document.documentElement);

}


/* set current page to full screen */
function setFullScreen(el) {

	if (el.requestFullscreen) {
		el.requestFullscreen();
	} else if (el.msRequestFullscreen) {
		el.msRequestFullscreen();
	}else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	}else if (el.webkitRequestFullscreen) {
		el.webkitRequestFullscreen();
	}
}


/* exit from fullscreen */
function exitFullScreen(){
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	}else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	}
}


/* check whether already in full screen */
function EnterFullScreen()
{
	if(!document.fullscreenElement && !document.msFullscreenElement && 
			!document.mozFullScreenElement && !document.webkitFullscreenElement)
	{
		setFullScreen(document.documentElement);
	}

}


/* sore alarm time in web storage */
function setCookie()
{
	localStorage.setItem("alarmTime", alarmtime);
	localStorage.setItem("alarmoff", "0");
}


/* get stored data from web storage */
function getCookie()
{
	timeformat = localStorage.getItem("timeformat");
	if(timeformat == null)
		timeformat = "24Hr";

	alarmstate = localStorage.getItem("alarmoff");
	if( alarmstate == 0 )	
	{	
		alarmtime = localStorage.getItem("alarmTime");
		if(alarmtime != null)
			alarmsetshow_parser(alarmtime);
	}

}
