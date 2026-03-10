import sys
from pathlib import Path
from datetime import datetime
import os
sys.path.append(str(Path(__file__).parent.parent))

from utils.STLINK import getStlink
from utils.JLINK import getJlink
from utils.USB import getUSB
from utils.cfgParser import getCfgFiles,getTestParam
from tests.testGeneric import ConnexionSWDwithRST,downloadTest

now=datetime.now()
date_time = now.strftime("%d-%m-%Y_%HH")
def callTests():
    stlinkList = getStlink()
    USBList = getUSB()
    JLinkList = getJlink()
    nbrOfStlink = len(stlinkList)
    nbrOfUSB = len(USBList)
    nbrOfJLINK = len(JLinkList)
    targetBoard = ""
    testIdRst = 0
    Int_Prog_Id = 0
    
    if nbrOfStlink != 0:
        targetBoard = stlinkList[0].boardName if stlinkList[0].boardName else ""
    elif nbrOfUSB != 0:
        targetBoard = USBList[0].boardName if USBList[0].boardName else ""
    elif nbrOfJLINK != 0:
        targetBoard = JLinkList[0].boardName if JLinkList[0].boardName else ""
    
    if targetBoard:
        targetBoard = targetBoard.strip()
        print(f"Detected Board: '{targetBoard}'")

    for stlink in stlinkList:
        cfgFound = None
        print(stlink)
        for cfgFile in getCfgFiles():
            print(cfgFile)
            if cfgFile.replace(".cfg","") == stlink.boardName:
                cfgFound=cfgFile
               
                break
        if cfgFound:
                print(f"Fichier cfg trouvé : {cfgFound}")
                csvName=cfgFound.replace(".cfg",".csv")
                print(csvName)
                BASE_DIR = Path(__file__).resolve().parent.parent
                CFG_DIR = BASE_DIR / "cfgFiles"
                cfg_path = CFG_DIR / cfgFound
                csv_path = BASE_DIR / "csvFiles" / f"csvFile_{date_time}" / f"_{csvName}"
                logName = str(csvName).replace(".csv", "")
              
                # Dossier LOG
                log_dir = BASE_DIR / "logFiles" / f"_{logName}"
                log_dir.mkdir(parents=True, exist_ok=True)

                # Dossier CSV
                csv_dir = BASE_DIR / "csvFiles" / f"csvFile_{date_time}"
                csv_dir.mkdir(parents=True, exist_ok=True)


                with open(cfg_path,"r",encoding="utf-8") as file_object,\
                     open(csv_path,"w") as status_file:
                    lines=file_object.readlines()
                    for line in lines:
                     print(line)
                     if not line.strip() or line.strip().startswith("#"):
                       continue
                     paramTestList = getTestParam(line) 
                     if paramTestList[0]=="FUNC":
                          if paramTestList[1] == "DNLD":
                                    testRest = ConnexionSWDwithRST (testIdRst, paramTestList, stlinkList,nbrOfStlink,USBList,nbrOfUSB, JLinkList, nbrOfJLINK, logName)
                                    testIdRst += 1  #ifhem aaleh 9a3din nzidou 
                                    testResult = downloadTest(Int_Prog_Id,paramTestList, stlinkList, nbrOfStlink, USBList, nbrOfUSB, JLinkList, nbrOfJLINK,  logName)
                                    status_file.write(str(testResult))
                                    Int_Prog_Id += 1
                         
                    
        else:
                print(f"Fichier cfg non trouvé pour : {stlink.boardName}")

       
if __name__=='__main__':
     
 callTests()