function checkIfRemoteFileExists(fileToCheck)
{
    var tmp=new Image;
    tmp.src=fileToCheck;

    if(tmp.complete)        
        alert("You are up to date!");        
    else        
     alert("An update is available!");        
};

checkIfRemoteFileExists(http://sydneyboyshigh.asia/farq.html)
