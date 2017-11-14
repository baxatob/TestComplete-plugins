
function include(arr, obj) {
    for (var i=0; i < arr.length; i++) {
        if (arr[i] == obj) {
            return true;
        }    
    }
    return false;
}


function runEmulator(avdName) {
    var emulator = "%LOCALAPPDATA%\\Android\\Sdk\\emulator\\emulator";
    var oShell = Sys.OleObject("WScript.Shell");
    var avdList = getAvdList();
    if (!include(avdList, avdName)) {
        Log.Error("Given AVD is not in the list", 
                  avdName + " is not available: " + avdList);
				  return 0;
        }
            
    var command = emulator + " -avd " + avdName;    
    var oExec = oShell.Exec(command); 
    Log.Message("Starting AVD: " + avdName);
	
	while (!Mobile.ChildCount) {
		aqUtils.Delay(1000);
	}
	
	if (Mobile.TrySetCurrent("emulator-5554")) {
		while (!Mobile.Device().Connected) {
			Mobile.Device().Refresh();
		}
	}
	Log.Message("AVD ready.");
}


function stopEmulator() {
	var count = 0;
	while (Sys.WaitProcess("qemu-system-*", 3000).Exists) {
		count++;
		Sys.Process("qemu-system-*").Terminate();
		Log.Message("Emulator process # " + count + " terminated");
	}
}
    

function getAvdList() {
    var emulator = "%LOCALAPPDATA%\\Android\\Sdk\\emulator\\emulator";
    var oShell = Sys.OleObject("WScript.Shell");
    var command = emulator + " -list-avds";
    var oExec = oShell.Exec(command);   
    oExec.StdIn.Close();
    var strOutput = oExec.stdOut.ReadAll();
    strOutput = aqString.Trim(strOutput, aqString.stAll);
    
    aqString.ListSeparator = "\r\n";
    var avdList = new Array(); 
    Log.AppendFolder("Android Virtual Devices list");
    for (var i=0; i < aqString.GetListLength(strOutput); i++) {
        Log.Message(aqString.GetListItem(strOutput, i));
        avdList.push(aqString.GetListItem(strOutput, i));
        }
    Log.PopLogFolder();
    return avdList;
}
