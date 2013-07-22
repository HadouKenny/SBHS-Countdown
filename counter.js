//counter.js v3.1.1 release
var day;
var todayHours;
var todayMinutes;
var todayDesc;
var nextDay = false;
var weekChecked = false;

var assemblyDay = false;
var assemblyReason;
var assemblyChecked = false;
var changedBells=[];
var changedHours=[];
var changedMinutes=[];

var weekNum;
var weekLetter;
var fetchSuccess = false;
var longWeekendDude = false;
var triedNextWeek = false;
var triedLongWeek = false;
var date2Check;

var i=0;
var bellRang = false;

function getSBHS(url){
    $.ajax({
        url: url,
        dataType: "json",
        success: function(data){
            document.getElementById("week").className="animated flipOutX";

            if (data.bellsAltered==true){
                assemblyDay = true;
                assemblyReason = data.bellsAlteredReason;
                console.log("Bell is altered today!");

                var temp;
                for (var p=0; p<data.bells.length; p++){
                    temp = (data.bells[p].time);
                    changedBells[p]= temp;
                }
                console.log(changedBells);
                for (var h=0; h<changedBells.length; h++){
                    changedHours[h]=parseInt(changedBells[h].substr(0,2));
                    changedMinutes[h]=parseInt(changedBells[h].substr(3,5));
                }
            }
            else {
                console.log("Bell is not altered. (status:"+data.status+", bellsAltered:"+data.bellsAltered+")");
            }

            weekNum=data.week;
            weekLetter=data.weekType;

            fetchSuccess=true;
        },
        error: function(XHR, textStatus, errorThrown){
            document.getElementById("week").className="animated flipOutX";
            console.log("Error Status: " + textStatus);
            console.log("Error Thrown: " + errorThrown);

            document.getElementById("week").innerHTML="<a style='color: #ffbb33'>Real-time data unavailable</a>";
            document.getElementById("week").className="animated bounceIn shake"
        }
    });
}

setInterval(function doCount(){
    //normal times
    var t1Hours = [9,9,10,10,11,11,11,12,12,13,14,15];
    var t1Minutes = [0,5,5,10,10,30,50,50,55,55,15,15];
    var t1Desc = ["School Starts","Period 1","Period 1 Ends","Period 2","Lunch","Lunch 2","Period 3","Period 3 Ends","Period 4","Recess","Period 5","End of Day"];

    var t2Hours = [9,9,10,10,11,11,12,12,13,14,14,15];
    var t2Minutes = [0,5,5,10,10,30,30,50,10,10,15,15];
    var t2Desc = ["School Starts","Period 1","Period 1 Ends","Period 2","Recess","Period 3","Lunch","Lunch 2","Period 4","Period 4 Ends","Period 5","End of Day"];

    var t3Hours = [9,9,10,10,11,11,12,13,13,14,14,15];
    var t3Minutes = [25,30,25,30,25,45,5,0,5,0,20,15];
    var t3Desc = ["School Starts","Period 1","Period 1 Ends","Period 2","Lunch","Lunch 2","Period 3","Period 3 Ends","Period 4","Recess","Period 5","Weekend"];

    //begin logic
    var now = new Date();
    day = now.getDay();
    var nowHours = now.getHours();
    var nowMinutes = now.getMinutes();
    var nowSeconds = now.getSeconds();

    //weekday overnight correction
    if ((nowHours*60 + nowMinutes)>=915 && day!=6 && day!=0){
        day += 1;
        nextDay = true;
    }

    <!--BEGIN GRAB SBHS CHANGED TIMES FLAGS, thanks to SBHS IT-->
    if (assemblyChecked==false){
        if (nextDay==true){
            var url = 'http://student.sbhs.net.au/api/timetable/bells.json?date='+(now.getFullYear())+'-'+(now.getMonth()+1)+'-'+(now.getDate()+1)+'&callback=?';
        }
        else{
            var url = 'http://student.sbhs.net.au/api/timetable/bells.json?date='+(now.getFullYear())+'-'+(now.getMonth()+1)+'-'+(now.getDate())+'&callback=?';
        }
        /*var url = 'http://student.sbhs.net.au/api/timetable/bells.json?date=2013-6-26&callback=?';*/
        console.log("Getting "+url);
        setTimeout(function(){getSBHS(url)}, 300); /*waste time*/
        assemblyChecked=true;
    }
    <!--END GRAB SBHS CHANGED TIMES FLAGS-->

    //grab timetables
    if (assemblyDay==true){
        todayHours = changedHours.slice(0);
        todayMinutes = changedMinutes.slice(0);
        if (day==4 || day==3){
            todayDesc = t2Desc.slice(0);
        }
        else{
            todayDesc = t1Desc.slice(0);
        }
    }
    else{
        switch (day){
            case 3: //wed
            case 4:
                todayHours = t2Hours.slice(0);
                todayMinutes = t2Minutes.slice(0);
                todayDesc = t2Desc.slice(0);
                break;
            case 5: //fri
                todayHours = t3Hours.slice(0);
                todayMinutes = t3Minutes.slice(0);
                todayDesc = t3Desc.slice(0); break;
            default:
                todayHours = t1Hours.slice(0);
                todayMinutes = t1Minutes.slice(0);
                todayDesc = t1Desc.slice(0);
                break;
        }
    }
    i = 0;

    if (nextDay==true){
        todayHours[i] += 24;
    }

    //weekend correction
    if (day==6){
        todayHours[i] += 48;
    }else if (day==0){
        todayHours[i] += 24
    }
    if (longWeekendDude){todayHours[i] += 24};

    //next period
    var nowAbsolute = nowHours*60 + nowMinutes;
    while ((todayHours[i]*60 + todayMinutes[i] - 1) < nowAbsolute && nowAbsolute < 915){i++}
    if (i==13){i=0}

    //week display
    if (fetchSuccess && weekChecked==false){

        if (assemblyDay==false && weekLetter!=undefined){
            if ((day==5 && now.getDay()!=4 && (nowHours*60 + nowMinutes)>=915)||day==6||day==0){
                document.getElementById("week").innerHTML= "School starts on Week <b>"+weekNum+weekLetter+"</b>";}
            else{ //normal day
                document.getElementById("week").innerHTML= "Week <b>"+weekNum+weekLetter+"</b>";
            }
            document.getElementById("week").className="animated bounceIn";
            weekChecked=true;
        }
        if (assemblyDay==true && day!=6 && day!=0 && weekLetter!=undefined){
            document.getElementById("week").innerHTML="<a style='color: #ffbb33'>Changed Belltimes: "+assemblyReason+"</a>";
            document.getElementById("week").className="animated bounceIn flash";
            weekChecked=true;
        }

        if (weekNum==undefined && weekLetter==undefined){
            //now we see if it's weekend or holiday
            if (triedNextWeek==false){
                var days2Add;
                switch(day){
                    case 5: //fri
                        days2Add=3;break;
                    case 6: //sat
                        days2Add=2;break;
                    case 0: //sun
                        days2Add=1;break;
                }
                if (day==6 && nextDay==true){days2Add+=1};//actually is friday
                date2Check = new Date();
                date2Check.setDate(date2Check.getDate()+days2Add);
                var url2='http://student.sbhs.net.au/api/timetable/bells.json?date='+(date2Check.getFullYear())+'-'+(date2Check.getMonth()+1)+'-'+(date2Check.getDate())+'&callback=?'
                console.log("Weekends. Getting "+url2);
                fetchSuccess=false;
                getSBHS(url2);
                triedNextWeek = true;
                weekChecked=false;

            }
            else if (triedLongWeek==false){ //still undefined, try long weekend

                date2Check.setDate(date2Check.getDate()+1);
                url2='http://student.sbhs.net.au/api/timetable/bells.json?date='+(date2Check.getFullYear())+'-'+(date2Check.getMonth()+1)+'-'+(date2Check.getDate())+'&callback=?'
                console.log("Long Weekend. Getting "+url2);
                fetchSuccess=false;
                getSBHS(url2);
                triedLongWeek=true;
                longWeekendDude=true;
                weekChecked=false;
            }
            else{ //too many hours man cbf
                console.log("Holidays. GTFO.")
                longWeekendDude=false;
                window.location.replace("http://sbhsbelltimes.tk/holiday.html");
                weekChecked=false;
            }

        }
    }

    //put last
    var rHours = (todayHours[i]-nowHours);
    var rMinutes = (todayMinutes[i]-nowMinutes-1);
    var rSeconds = (60-nowSeconds);
    if (rSeconds == 60){
        rMinutes += 1;
        rSeconds = 0;
    }

    //negative correction
    if (todayMinutes[i]-1 < nowMinutes){
        rHours -= 1;
        rMinutes += 60;
    }

    //time display
    if (assemblyDay==true){
        document.getElementById("description").innerHTML= todayDesc[i];
        if (rHours!=0){
            document.getElementById("counter").innerHTML= "<b><a style='color: #ffbb33'>"+rHours+"</b><a style='color: #ffbb33'></a>h, <b><a style='color: #ffbb33'>"+ zeroPad(rMinutes) +"</a></b>m, <b><a style='color: #ffbb33'>"+zeroPad(rSeconds)+"</a></b>s.";
        }
        else{
            document.getElementById("counter").innerHTML= "<b><a style='color: #ffbb33'>"+zeroPad(rMinutes)+"</a></b>m, <b><a style='color: #ffbb33'>"+zeroPad(rSeconds)+"</a></b>s.";
        }
        document.getElementById("description").className="animated fadeInUp waitSmall";
        document.getElementById("counter").className="animated flash waitSmall";

    }
    else{
        document.getElementById("description").innerHTML= todayDesc[i];
        if (rHours!=0){
            document.getElementById("counter").innerHTML= "<b>"+rHours+"</b>h, <b>"+ zeroPad(rMinutes) +"</b>m, <b>"+zeroPad(rSeconds)+"</b>s.";
        }
        else{
            document.getElementById("counter").innerHTML= "<b>"+zeroPad(rMinutes)+"</b>m, <b>"+zeroPad(rSeconds)+"</b>s.";
        }
        //animation change for next period
        if (bellRang){  //second run
            setTimeout(function(){
                document.getElementById("description").className="animated bounceInLeft waitSmall";
                document.getElementById("counter").className="animated bounceInLeft";
            }, 900);
        }
        else{ //first run
            document.getElementById("description").className="animated fadeInUp";
            document.getElementById("counter").className="animated fadeInDown";
        }
    }

    //fun stuff
    if (rHours==0 && rMinutes==0 && rSeconds==1){

        //document.getElementById("counter", "description").className="";
        setTimeout(function(){
            document.getElementById("description").className="animated bounceOutRight waitSmall";
            document.getElementById("counter").className="animated bounceOutRight";
        }, 750);

        bellRang=true;
    }

}, 500);


//FAQ
setInterval(function nag(){
    document.getElementById("faq").className="";
    setTimeout(function(){document.getElementById("faq").className="animated wobble";},200);
}, 9000);

function zeroPad(num) {
    var s = "000" + num;
    return s.substr(s.length-2);
}

