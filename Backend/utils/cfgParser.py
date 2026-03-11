import os
from pathlib import Path
import re

CFG_DIR = Path(__file__).parent.parent / "cfgFiles"

def getCfgFiles():
    filesList = [x for x in os.listdir(CFG_DIR) if x.endswith(".cfg") ]  
    return filesList

def getCsvName (cfgFound):
        csvName = cfgFound.replace(".cfg" , ".csv")
        return csvName


def getTestParam(line, line_id):
    
    lineSplit = re.split(r'\s+', line.strip())

  
    while len(lineSplit) < 24:
        lineSplit.append("")

    print(line)

    CATEGORY = lineSplit[0]
    TEST_TYPE = lineSplit[1]
    FAMILY = lineSplit[2]
    FILE = lineSplit[3]
    ADDRESS = lineSplit[4]
    BIN_DIR = lineSplit[5]
    RESET = lineSplit[6]
    PORT_NAME = lineSplit[7]
    SN = lineSplit[8]
    SECTORS = lineSplit[9]
    INTERFACE = lineSplit[10]
    HSMLICENSE = lineSplit[11]
    RSSEPATH = lineSplit[12]
    INPUT = lineSplit[13]
    OUTPUT = lineSplit[14]
    ELPATH = lineSplit[15]
    SNV3 = lineSplit[16]
    SLAVEADDRESS = lineSplit[17]
    OBK_Cert_file = lineSplit[18]
    OBK_PWD_file = lineSplit[19]
    keyPATH = lineSplit[20]
    PATH_CERT  = lineSplit[21]
    PATH_PWD  = lineSplit[22]
    CONSECUTIVE  = lineSplit[23]

    paramTestList = [
        str(CATEGORY),str(TEST_TYPE), str(FAMILY), str(FILE), str(ADDRESS),
        str(BIN_DIR), str(RESET), str(PORT_NAME), str(SN), str(SECTORS),
        str(INTERFACE), str(HSMLICENSE), str(RSSEPATH), str(INPUT),
        str(OUTPUT), str(ELPATH), str(SNV3), str(SLAVEADDRESS),
        str(OBK_Cert_file), str(OBK_PWD_file), str(keyPATH),
        str(PATH_CERT), str(PATH_PWD), str(CONSECUTIVE)
    ]

  
    paramTestList.insert(0,line_id)

    return paramTestList
def checkDeviceConnexion(SN, INTERFACE, stlinkList, nbrOfStlink, USBList, nbrOfUSB, JLinkList, nbrOfJLINK):
    serialNumberList=[]
    if INTERFACE=="STLINK":
            for i in range(0,nbrOfStlink):
                  serialNumberList.append(stlinkList[i].serialNumber)
                #   print(serialNumberList)
                #   print("DEBUG SN attendu :", SN)
                #   print("DEBUG serialNumberList :", serialNumberList)
                #   print("DEBUG nbrOfStlink :", nbrOfStlink)
            if SN in serialNumberList:  
                 connected=1  
                 return connected
            else:
                 connected=0
                 return connected
    if INTERFACE == "USB":
        for i in range(0, nbrOfUSB):
            serialNumberList.append(USBList[i].serialNumber)
        if SN in serialNumberList:
            connected = 1
            return connected
        else:
            connected = 0
            return connected
    if INTERFACE == "JLINK":
        for i in range(0,nbrOfJLINK ):
            serialNumberList.append(JLinkList[i].serialNumber)
        if SN in serialNumberList:
            connected = 1
            return connected
        else:
            connected = 0
            return connected



