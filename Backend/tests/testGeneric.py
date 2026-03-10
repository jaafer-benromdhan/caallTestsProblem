import sys
from pathlib import Path
from datetime import datetime
import subprocess
import time
sys.path.append(str(Path(__file__).parent.parent))

from utils.cfgParser import checkDeviceConnexion

def ConnexionSWDwithRST (testIdRst, paramTestList, stlinkList,nbrOfStlink,USBList,nbrOfUSB, JLinkList, nbrOfJLINK, logName):
       
 CATEGORY = paramTestList[0]
 TEST_TYPE = paramTestList[1]
 FAMILY = paramTestList[2]
 FILE = paramTestList[3]
 ADDRESS = paramTestList[4]
 BIN_DIR = paramTestList[5]
 RESET = paramTestList[6]
 PORT_NAME = paramTestList[7]
 SN = paramTestList[8]
 SECTORS = paramTestList[9]
 INTERFACE = paramTestList[10]
 isConnected=checkDeviceConnexion(SN, INTERFACE, stlinkList, nbrOfStlink, USBList, nbrOfUSB, JLinkList, nbrOfJLINK)
 print(isConnected)
 if isConnected!=1:
  return 0
 
 CMD = "STM32_Programmer_CLI" 
 reset_cmd = [
        CMD,
        "-c", f"port={PORT_NAME}", f"sn={SN}", "reset=HWrst"
    ]

 try:
        subprocess.run(reset_cmd, check=True)
        time.sleep(1)
 except Exception:
        return 0 
 
 BASE_DIR = Path(__file__).resolve().parent.parent
 log_dir = BASE_DIR / "logFiles" / f"_{logName}"
 log_dir.mkdir(parents=True, exist_ok=True)

 log_file = log_dir / f"logRST{testIdRst}.log"

 reset_cmd_with_log = [
        CMD,
        "-c", f"port={PORT_NAME}", f"sn={SN}", "reset=HWrst",
        "-log", str(log_file)
    ]

 try:
        subprocess.run(reset_cmd_with_log, check=True)
 except Exception:
        return 0
 
 if FAMILY == "MCU":
        if log_file.exists():
            with open(log_file, "r", encoding="utf-8") as f:
                for line in f:
                    if "Error" in line:
                        return 0
        else:
            return 0
        

def checkFileType(FILE):
    if str(FILE).endswith('.bin'):
        getAdd = 1
    else:
        getAdd = 0
    return getAdd

def downloadTest (Int_Prog_Id, paramTestList, stlinkList, nbrOfStlink, USBList, nbrOfUSB, JLinkList, nbrOfJLINK,logName):

    CATEGORY = paramTestList[0]
    TEST_TYPE = paramTestList[1]
    FAMILY = paramTestList[2]
    FILE = paramTestList[3]
    ADDRESS = paramTestList[4]
    BIN_DIR = paramTestList[5]
    RESET = paramTestList[6]
    PORT_NAME = paramTestList[7]
    SN = paramTestList[8]
    SECTORS = paramTestList[9]
    INTERFACE = paramTestList[10]
    SNV3 = paramTestList[16]
    SLAVEADDRESS = paramTestList[17]

    testStatus = 0
    execution_time = 0 

    isconnected = checkDeviceConnexion(
        SN, INTERFACE,
        stlinkList, nbrOfStlink,
        USBList, nbrOfUSB,
        JLinkList, nbrOfJLINK
    )

    if isconnected != 1:
        return 0

    CMD = "STM32_Programmer_CLI"

    # ----- reset -----
    reset_cmd = [
        CMD,
        "-c", f"port={PORT_NAME}",
        f"SN={SN}",
        "reset=HWrst"
    ]

    try:
        subprocess.run(reset_cmd, check=True)
        time.sleep(1)
    except Exception:
        return 0

    # ----- gestion des logs -----
    BASE_DIR = Path(__file__).resolve().parent.parent
    log_dir = BASE_DIR / "logFiles" / f"_{logName}"
    log_dir.mkdir(parents=True, exist_ok=True)

    # ⚠️ CHANGEMENT OBLIGATOIRE : testIdRst n’existe pas → Int_Prog_Id
    log_file = log_dir / f"logDownload{Int_Prog_Id}.log"

    # ----- commande download -----
    download_cmd = [
        CMD,
        "-c", f"port={PORT_NAME}",
        f"sn={SN}",
        "-d", FILE
    ]

    if checkFileType(FILE) == 1:
        download_cmd.append(ADDRESS)

    download_cmd.append("-v")
    download_cmd += ["-log", str(log_file)]

    # ----- lancement -----
    try:
        subprocess.run(download_cmd, check=True)
    except Exception:
        return 0

    # ----- analyse log -----
    if FAMILY == "MCU":
        if log_file.exists():
            with open(log_file, "r", encoding="utf-8") as f:
                for line in f:
                    if "Download verified successfully" in line:
                        return 1
        else:
            return 0

    return 1