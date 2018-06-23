function returnEmailPartyIfThere(stringParty){
  var regX_email = /(\w+\.\w+\.\w+|\w+\.\w+|\w+)@\w+\.[a-zA-Z]{2,9}/g;
  var emailArr = [];
  if(regX_email.test(stringParty) === true){
    var emailMatches = stringParty.match(regX_email);
    for(m=0; m<emailMatches.length; m++){
      emailArr.push(emailMatches[m])
      }
    }
	if(emailArr.length >0){
      return emailArr.toString().replace(/,/g, ', ');	
	}else{
      return '';
    }
}

function returnFormttedTime(str){
  var input = str;
  var regX_9_AM = /\b\d\s*[a-pA-P][m|M]\b/;
  var regX_930_AM = /\b\d{3}\s*[a-pA-P][m|M]\b/;
  var regX_9c00AM = /\b\d:\d+\s*[a-pA-P][m|M]/;

  var regX_10_AM = /\s\b\d\d\s*[a-pA-P][m|M]\b/;
  var regX_1030_AM = /\s\b\d\d\d\d\s*[a-pA-P][m|M]\b/;
  var regX_10c00_AM = /\s\b\d\d:\d\d\s*[a-pA-P][m|M]\b/;
  if(regX_10_AM.test(input) === true){
	var rawtime = regX_10_AM.exec(input).toString().replace(/^\s/, '');
	var ampm = /[a-pA-P][m|M]/.exec(rawtime).toString().toUpperCase();
	var timeFormatted = rawtime[0]+rawtime[1]+':00 '+ampm;
  }
  if(regX_1030_AM.test(input) === true){
	var rawtime = regX_1030_AM.exec(input).toString().replace(/^\s/, '');
	var ampm = /[a-pA-P][m|M]/.exec(rawtime).toString().toUpperCase();
	var timeFormatted = rawtime[0]+rawtime[1]+':'+rawtime[2]+rawtime[3]+ampm;
  }
  if(regX_10c00_AM.test(input) === true){
	var rawtime = regX_10c00_AM.exec(input).toString().replace(/^\s/, '');
	var ampm = /[a-pA-P][m|M]/.exec(rawtime).toString().toUpperCase();
	var timeFormatted = rawtime[0]+rawtime[1]+rawtime[2]+rawtime[3]+rawtime[4]+' '+ampm;
  }
  if(regX_9_AM.test(input) === true){
      var rawtime = regX_9_AM.exec(input);
      var rawhour = /\d/.exec(rawtime);
      var ampm = /[a-pA-P][m|M]/.exec(rawtime).toString().toUpperCase();
      var timeFormatted = rawhour+':00 '+ampm;
  }
  if(regX_930_AM.test(input) === true){
      var rawtime = regX_930_AM.exec(input);
      var rawhourmin = /\d+/.exec(rawtime).toString();
      var ampm = /[a-pA-P][m|M]/.exec(rawtime).toString().toUpperCase();
      var timeFormatted = rawhourmin[0]+':'+rawhourmin[1]+rawhourmin[2]+' '+ampm;
  }
  if(regX_9c00AM.test(input) === true){
      var rawtime = regX_9c00AM.exec(input).toString();
      var ampm = /[a-pA-P][m|M]/.exec(rawtime).toString().toUpperCase();
      var timeFormatted = rawtime[0]+rawtime[1]+rawtime[2]+rawtime[3]+' '+ampm;
  }
  return timeFormatted;
}
  
function doGet(e) {

  function grouped(e, n){
    if(e != null){
      return e[n];
    }else{
      return '';
    }
  }
  var nowis = new Date();
  var nowDay = nowis.getDay();
  var nowYear = nowis.getFullYear();
  
  var wkdayArr = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  
  var rawdat = e.parameter.output;
  
  
  var meet_location = grouped(/\s\@\s*(.+?$)/.exec(rawdat), 1);
  var meet_party = grouped(/with\s+(.+?)\son/.exec(rawdat), 1);
  var meet_dateTime = grouped(/\s+(on\s.*?)\s+\@/.exec(rawdat), 1);
  var meet_type = grouped(/^(.+?)\s+with/.exec(rawdat), 1);
  
  if(/([a-zA-Z]+)\sat\s(\d)/.test(meet_dateTime) === true){
    var inputDay = grouped(/([a-zA-Z]+)\sat\s\d/.exec(meet_dateTime), 1).toLowerCase();
    var inviteTime = returnFormttedTime(meet_dateTime);
  
    var days_ahead = (wkdayArr.indexOf(inputDay) + (Math.abs(nowDay-7)));	
    
    var date_notTime = new Date(new Date().getTime() + (86400000 * days_ahead))
    var inviteDate = /(.+?)\s\d\d:\d\d:/.exec(date_notTime)[1];
    
    var meetingDateTime = new Date(inviteDate+' '+inviteTime);
  }//if meeting is set within the next 7 days
  
  if(/on\s+([a-zA-Z]+\s\d+)\sat\s(\d)/.test(meet_dateTime) === true){
    var inputDay = grouped(/on\s+([a-zA-Z]+\s\d+\s)at\s(\d)/.exec(meet_dateTime), 1) + nowYear;
    var inviteTime = returnFormttedTime(meet_dateTime);
    var meetingDateTime = new Date(inputDay+' '+inviteTime);
  
  }//if meeting is set with standard date format
  
  
  var evnt = meetingDateTime;
  var endt = new Date(meetingDateTime.getTime()+1800000);
  var events = CalendarApp.getDefaultCalendar().getEvents(evnt, endt);
  if(events.length <1){
    if(/(\w+\.\w+\.\w+|\w+\.\w+|\w+)@\w+\.[a-zA-Z]{2,9}/.test(meet_party) === true){
      var guestEmailArr = returnEmailPartyIfThere(meet_party);
      var cal = CalendarApp.getDefaultCalendar();
      cal.createEvent(meet_type+' '+meetingDateTime, new Date(meetingDateTime.getTime()),new Date(meetingDateTime.getTime()+1800000), {guests: guestEmailArr, location: meet_location, description: rawdat, sendInvites:true});
      return ContentService.createTextOutput("set calendar item for "+meet_type+' with '+meet_party+' '+meetingDateTime);
      } else {
      var cal = CalendarApp.getDefaultCalendar();
      cal.createEvent(meet_type+' with '+meet_party+' '+meetingDateTime, new Date(meetingDateTime.getTime()),new Date(meetingDateTime.getTime()+1800000), {location: meet_location, description: rawdat, sendInvites:true});
      return ContentService.createTextOutput("set calendar item for "+meet_type+' with '+meet_party+' '+meetingDateTime);
    }
  } else {
      return ContentService.createTextOutput("Sorry bro, that time is already booked.\nThis is what you asked for:\n"+rawdat);

  }
}
