# QuickCalendar  
Does anyone else dread the simple tasks? 

Google Apps Script + bookmarklet allowing a user to create a calendar item in G Suite from anywhere.

How it works:

This tool will read your natural language input via regular expressions and create calendar items via Google Apps Script based on your input into a browser prompt via the use of a JavaScript bookmarklet. 

This tool requires a basic syntax, but allows for a lot of variation.

Meeting type declaration: 
The start of the string is used as the token. Always begin meetings with the meeting type. The regular expression will end the meeting type with it sees the word "with" OR " \w " OR "@" OR "on" OR "at"

Meeting party declaration:
"with" or "\w" or "email@address.net"
  Example_1: 
meeting with Jerry Bob Billbobington @ Starbucks cafe on august 12th @ 12 pm
  Example_2: meeting with Database Team rich@query.clinic data@query.clinic andre@quickli.io
  Example_3: coffee \w Raj on Friday at 1230pm @ Perimeter Point Starbucks

#usage note: one may use any number of email addresses, but a name will only be picked up for the first three words listed. 

Meeting date / time declaration: (meeting time defaults to 30 min.. will add a feature to adjust meeting time, but still considering the best approach)
"Month Date" OR "Weekday" AND "9am" OR "1030am" OR "10 AM" OR "12:30pm" OR "4:00 PM" 

  Example_1: Follow up with Ira on Wednesday at 11am
  Example_2: Meeting to discuss proposals with andre@quickli.io on July 10 at 12:30 pm @ Bagel Boys

#usage note: using a day of the week instead of a Month Date assumes you want a meeting within the next 6 days.

Meeting location declaration:
" at " or "@ " 
  Example_1: Coffee with Jerome on Friday at 9am at Starbucks
  Example_2: Coffee with Erdna erdnawahsdarb@gmail.com on Friday at 9am @ Revelator Coffee



