function doGet(e) {
  var rawdat = e.parameter.output;//input string from bookmarklet
  var nowis = new Date();
  var nowDay = nowis.getDay();
  var nowYear = nowis.getFullYear();
  
  var monthArray = ["jan","january","feb","february","mar","march","apr","april","may","jun","june","jul","july","oct","october","aug","august","sep","september","nov","november","dec","december"];
  var wkdayArr = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  var regX_month_date_day = /jan[a-z]*\s\d+|feb[a-z]*\s\d+|mar[a-z]*\s\d+|arp[a-z]*\s\d+|may|jun[a-z]*\s\d+|jul[a-z]*\s\d+|aug[a-z]*\s\d+|sep[a-z]*\s\d+|oct[a-z]*\s\d+|nov[a-z]*\s\d+|dec[a-z]*\s\d+|monday|tuesday|wednesday|thursday|friday|saturday|sunday/i; //returns a MONTH DATE || a Weekday
  var regX_withNamedParty = /with\s[a-zA-Z]*'[a-zA-Z]+\b\s|with\s[a-zA-Z]+\b\s[a-zA-Z]{3,15}\b\s[a-zA-Z]{3,15}\b(?=\s)|with\s[a-zA-Z]+\b\s[a-zA-Z]{3,15}\b(?=\s)|with\s[a-zA-Z]+\b(?=\s)|\\w\s[a-zA-Z]*'[a-zA-Z]+\b\s|\\w\s[a-zA-Z]+\b\s[a-zA-Z]{3,15}\b\s[a-zA-Z]{3,15}\b(?=\s)|\\w\s[a-zA-Z]+\b\s[a-zA-Z]{3,15}\b(?=\s)|\\w\s[a-zA-Z]+\b(?=\s)/i; //Returns up to three names using "with" or "\\w" as a starting token
  var regX_location = /@\s(?!\d+\s*[apAP]M|\d+:\d+\s*[apAP]).+?(?=\son|\swith|\s\\w|$)|\bat\b\s(?!\d+\s*[apAP]M|\d+:\d+\s*[apAP]).+?(?=\son|\swith|\s\\w|$)/i; //returns the location using "@" or " at " as a starting token
  var regX_meetingInfo = /^[a-zA-Z|\s]+(?=\swith|\s\\w)|^[a-zA-Z|\s]+(?=\s@|\sat)|^[a-zA-Z|\s]+(?=\son\b)/i; //returns the meeting type information using the start of the string as the starting token
  var regX_meetingLength = /^\d+\sminute|^\d+\shour|^\d+\sday/i;//returns meeting duration
  var regX_meetingType_2 = /minute\w*\s[a-zA-Z|\s]+(?=\swith|\s\\w|\s@|\sat|\son\b)|hour\w*\s[a-zA-Z|\s]+(?=\swith|\s\\w|\s@|\sat|\son\b)|\bday\w*\s[a-zA-Z|\s]+(?=\swith|\s\\w|\s@|\sat|\son\b)/i;
 

  function grouped(e, n){
      if(e != null){
        return e[n];
      }else{
        return '';
      }
    }
  function regXtru_or_emptystr(rgx, str, toke){
    if(rgx.test(str) === true){
      var rgxToke = new RegExp(toke, 'i');
      return rgx.exec(str).toString().replace(rgxToke, '')//replace used to remove captured token from orginal RegExp
    }else{
      return '';
    }
  } 
   
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
    var regX_9_AM = /\b\d\s*[ap]m\b/i;
    var regX_930_AM = /\b\d{3}\s*[ap]m\b/i;
    var regX_9c00AM = /\b\d:\d+\s*[ap]m/i;
    var regX_10_AM = /\s\b\d\d\s*[ap]m\b/i;
    var regX_1030_AM = /\s\b\d\d\d\d\s*[ap]m\b/i;
    var regX_10c00_AM = /\s\b\d\d:\d\d\s*[ap]m\b/i;
    if(regX_10_AM.test(input) === true){
      var rawtime = regX_10_AM.exec(input).toString().replace(/^\s/, '');
      var ampm = /[ap]m/i.exec(rawtime).toString().toUpperCase();
      var timeFormatted = rawtime[0]+rawtime[1]+':00 '+ampm;
    }
    if(regX_1030_AM.test(input) === true){
      var rawtime = regX_1030_AM.exec(input).toString().replace(/^\s/, '');
      var ampm = /[ap]m/i.exec(rawtime).toString().toUpperCase();
      var timeFormatted = rawtime[0]+rawtime[1]+':'+rawtime[2]+rawtime[3]+ampm;
    }
    if(regX_10c00_AM.test(input) === true){
      var rawtime = regX_10c00_AM.exec(input).toString().replace(/^\s/, '');
      var ampm = /[ap]m/i.exec(rawtime).toString().toUpperCase();
      var timeFormatted = rawtime[0]+rawtime[1]+rawtime[2]+rawtime[3]+rawtime[4]+' '+ampm;
    }
    if(regX_9_AM.test(input) === true){
      var rawtime = regX_9_AM.exec(input);
      var rawhour = /\d/.exec(rawtime);
      var ampm = /[ap]m/i.exec(rawtime).toString().toUpperCase();
      var timeFormatted = rawhour+':00 '+ampm;
    }
    if(regX_930_AM.test(input) === true){
      var rawtime = regX_930_AM.exec(input);
      var rawhourmin = /\d+/.exec(rawtime).toString();
      var ampm = /[ap]m/i.exec(rawtime).toString().toUpperCase();
      var timeFormatted = rawhourmin[0]+':'+rawhourmin[1]+rawhourmin[2]+' '+ampm;
    }
    if(regX_9c00AM.test(input) === true){
      var rawtime = regX_9c00AM.exec(input).toString();
      var ampm = /[ap]m/i.exec(rawtime).toString().toUpperCase();
      var timeFormatted = rawtime[0]+rawtime[1]+rawtime[2]+rawtime[3]+' '+ampm;
    }
    return timeFormatted;
  }
  
  var meet_location = regXtru_or_emptystr(regX_location, rawdat, "@\\s*|\\bat\\b\\s");
  var meet_party = regXtru_or_emptystr(regX_withNamedParty, rawdat, "with\\s*");
  var meet_dateTime = regXtru_or_emptystr(regX_month_date_day, rawdat, "");
  
  var meet_type = regXtru_or_emptystr(regX_meetingInfo, rawdat, "");

  if(regX_meetingType_2.test(rawdat) === true){
    var meet_type = regXtru_or_emptystr(regX_meetingType_2, rawdat, "\\bday\\w*|minute\\w*|hour\\w*");
  }
  
  if(/\Bday\b/.test(meet_dateTime) === true){ 
    var inviteTime = returnFormttedTime(rawdat);  
	var scheduleRequestDayIndex = wkdayArr.indexOf(meet_dateTime.toLowerCase());
	if(scheduleRequestDayIndex < nowDay){
	  var daysLeftInWeek = (6-nowDay)+1;	
  	  var days_ahead =  daysLeftInWeek + scheduleRequestDayIndex;	
	}else{
      var days_ahead = (wkdayArr.indexOf(meet_dateTime.toLowerCase()) - nowDay);	
	}
    var date_notTime = new Date(nowis.getTime() + (86400000 * days_ahead));
    var inviteDate = /(.+?)\s\d\d:\d\d:/.exec(date_notTime.toString())[1];   
    var meetingDateTime = new Date(inviteDate+' '+inviteTime);
  }//if day of week, not Month Date, get the Month Date in the next 6 days which is corresponding to the requested day of week, combine with the listed time, and return string as a formatted date.
  
  if(/jan[a-z]*\s\d+|feb[a-z]*\s\d+|mar[a-z]*\s\d+|arp[a-z]*\s\d+|may|jun[a-z]*\s\d+|jul[a-z]*\s\d+|aug[a-z]*\s\d+|sep[a-z]*\s\d+|oct[a-z]*\s\d+|nov[a-z]*\s\d+|dec[a-z]*\s\d+/i.test(meet_dateTime) === true){
    var inputDay = meet_dateTime+' '+nowYear;
    var inviteTime = returnFormttedTime(rawdat);
    var meetingDateTime = new Date(inputDay+' '+inviteTime);
  }//if meeting is set as Month Date format

var meetingDuration = 1800000;

if(regX_meetingLength.test(rawdat) === true){
	var meetingLengthInfo = regX_meetingLength.exec(rawdat).toString();
 	var regX_meetingDuration = /(\d+)\s+([a-zA-Z]+)/i.exec(meetingLengthInfo);

	if(/hour/i.test(regX_meetingDuration[2]) === true){
		var meetingDuration = parseInt(regX_meetingDuration[1]) * 3600000;
	}
	if(/minute/i.test(regX_meetingDuration[2]) === true){
		var meetingDuration = parseInt(regX_meetingDuration[1]) * 60000;
	}
	if(/\bday/i.test(regX_meetingDuration[2]) === true){
		var meetingDuration = parseInt(regX_meetingDuration[1]) * 86400000;
	}

}

  var evnt = meetingDateTime;
  var endt = new Date(meetingDateTime.getTime()+meetingDuration); //end time stops after 30 mintues (18000000 mil secs).
  var events = CalendarApp.getDefaultCalendar().getEvents(evnt, endt);

  if(events.length <1){//if no other calendar item exists within the given time frame (30 minutes from start)

    if(returnEmailPartyIfThere(rawdat).length >0){
      var guestEmailArr = returnEmailPartyIfThere(rawdat);
      var cal = CalendarApp.getDefaultCalendar();
      cal.createEvent(meet_type+' with '+guestEmailArr, new Date(meetingDateTime.getTime()),new Date(meetingDateTime.getTime()+meetingDuration), {guests: guestEmailArr, location: meet_location, description: rawdat, sendInvites:true});
      return ContentService.createTextOutput("set calendar item for "+meet_type+' with '+guestEmailArr+' on '+meetingDateTime+' @ '+meet_location);
      } else {
      var cal = CalendarApp.getDefaultCalendar();
      cal.createEvent(meet_type+' with '+meet_party, new Date(meetingDateTime.getTime()),new Date(meetingDateTime.getTime()+meetingDuration), {location: meet_location, description: rawdat, sendInvites:true});
      return ContentService.createTextOutput("set calendar item for "+meet_type+' with '+meet_party+' on '+meetingDateTime+' @ '+meet_location);
    }
  } else {
      return ContentService.createTextOutput("That time is already booked.\nThis is what you asked for:\n"+rawdat);

  }
  
}
