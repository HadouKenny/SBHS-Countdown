//counter.js v2.8 release
var day;
var todayHours;
var todayMinutes;
var todayDesc;
var nextDay = false;
var weekChecked = false;

var assemblyDay = false;
var assemblyReason;
var assemblyChecked = false;

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

    //assembly times
    var a1Hours = [9,9,10,10,11,11,12,13,13,13,14,15];
    var a1Minutes = [0,5,15,20,30,50,10,0,5,55,15,15];
    var a1Desc = ["School Starts","Period 1","Period 1 Ends","Period 2","Lunch","Lunch 2","Period 3","Period 3 Ends","Period 4","Recess","Period 5","End of Day"];

    var a2Hours = [9,9,10,10,11,11,12,12,13,14,15];
    var a2Minutes = [0,5,10,15,20,40,30,50,10,10,15];
    var a2Desc = ["School Starts","Period 1","Period 1 Ends","Period 2","Recess","Period 3","Lunch","Lunch 2","Period 4","Period 4 Ends","Period 5","End of Day"];

    var a3Hours = [9,9,10,10,11,12,12,13,13,14,14,15];
    var a3Minutes = [25,30,35,40,45,5,25,10,15,0,20,15];
    var a3Desc = ["School Starts","Period 1","Period 1 Ends","Period 2","Lunch","Lunch 2","Period 3","Period 3 Ends","Period 4","Recess","Period 5","Weekend"];

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

    <!--BEGIN GRAB SBHS CHANGED TIMES FLAGS-->
    if (assemblyChecked==false){
        var url = 'http://jsonp.jit.su/?callback=?&url=http://student.sbhs.net.au/api/timetable/bells.json?date=2013-'+(now.getMonth()+1)+'-'+now.getDate();
        //var url = 'http://jsonp.jit.su/?callback=?&url=http://student.sbhs.net.au/api/timetable/bells.json?date=2013-05-30';
        $.getJSON(url, function(data){
            console.log("Getting "+url);
            if (data.bellsAltered==true){
                assemblyDay = true;
                assemblyReason = data.bellsAlteredReason;
                console.log("Bell is altered today!")
            }
            else{
                console.log("Bell is not altered. (status:"+data.status+", bellsAltered:"+data.bellsAltered+")");
            }
        });
        assemblyChecked=true;
    }
    <!--END GRAB SBHS CHANGED TIMES FLAGS-->

    //grab timetables
    if (assemblyDay==true){
        switch (day){
            case 3: //wed
            case 4:
                todayHours = a2Hours.slice(0);
                todayMinutes = a2Minutes.slice(0);
                todayDesc = a2Desc.slice(0);
                break;
            case 5: //fri
                todayHours = a3Hours.slice(0);
                todayMinutes = a3Minutes.slice(0);
                todayDesc = a3Desc.slice(0);
                break;
            default:
                todayHours = a1Hours.slice(0);
                todayMinutes = a1Minutes.slice(0);
                todayDesc = a1Desc.slice(0);
                break;
        }
    }else
    {
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
                todayDesc = t3Desc.slice(0);
                break;
            default:
                todayHours = t1Hours.slice(0);
                todayMinutes = t1Minutes.slice(0);
                todayDesc = t1Desc.slice(0);
                break;
        }
    }
    var i = 0;

    if (nextDay==true){
        todayHours[i] += 24;
    }

    //weekend correction
    if (day==6){
        todayHours[i] += 48;
    }else if (day==0){
        todayHours[i] += 24
    }

    //next period
    var nowAbsolute = nowHours*60 + nowMinutes;
    while ((todayHours[i]*60 + todayMinutes[i] - 1) < nowAbsolute && nowAbsolute < 915){i++}
    if (i==12){i=0}


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

    //display
    document.getElementById("description").innerHTML= todayDesc[i];
    if (rHours!=0){
        document.getElementById("counter").innerHTML= "<b>"+rHours+"</b>h, <b>"+ zeroPad(rMinutes) +"</b>m, <b>"+zeroPad(rSeconds)+"</b>s.";
    }
    else{
        document.getElementById("counter").innerHTML= "<b>"+zeroPad(rMinutes)+"</b>m, <b>"+zeroPad(rSeconds)+"</b>s.";
    }

    //week
    if (weekChecked==false && assemblyDay==false){
        var weekNum = getWeekNumber(now) - 17;
        var weekLetter;
        var weekLetterI;
        var weekLetterArr=["A","B","C"];
        //weekend correction
        if ((day==5 && now.getDay()!=4 && (nowHours*60 + nowMinutes)>=915)||day==6||day==0){weekNum+=1}
        switch (weekNum){
            case 5:
            case 8:
                weekLetterI=0;
                break;
            case 6:
            case 9:
                weekLetterI=1;
                break;
            case 4:
            case 7:
                weekLetterI=2;
                break;
        }
        weekLetter=weekLetterArr[weekLetterI];
        if ((day==5 && now.getDay()!=4 && (nowHours*60 + nowMinutes)>=915)||day==6||day==0){

            document.getElementById("week").innerHTML= "School starts on Week <b>"+weekNum+weekLetter+"</b>";
        }
        else{
            document.getElementById("week").innerHTML= "Week <b>"+weekNum+weekLetter+"</b>";
        }
        weekChecked=true;
    }

    if (assemblyDay==true && day!=6 && day!=0){
        document.getElementById("week").innerHTML="Changed Belltimes: "+assemblyReason;
        weekChecked=true;
    }
}, 500);

function zeroPad(num) {
    var s = "000" + num;
    return s.substr(s.length-2);
}

function getWeekNumber(d) {
    d = new Date(d);
    d.setHours(0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    var yearStart = new Date(d.getFullYear(),0,1);
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    return [weekNo];
}
