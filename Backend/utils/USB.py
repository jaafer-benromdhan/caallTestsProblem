
import sys
import os
import time
import subprocess
from utils.CMDOs import get_cli_command


class USB:
    def __init__(self, serialNumber, deviceId, flashSize, connected, boardName=None):
        self.serialNumber = serialNumber
        self.deviceId = deviceId
        self.flashSize = flashSize
        self.connected = connected
        self.boardName = boardName


def getUSB():
    usbList = []
    nbrOfUSB = 0
    print("Scanning for USB devices...")
    CMD = get_cli_command()
    
    try:
        # Liste les devices en mode USB DFU
        result = subprocess.run([CMD, '--list'], capture_output=True, text=True)
        output = result.stdout
        print(output)
        
        lines = output.split('\n')
        for line in lines:
            lineSplit = line.split(' ')
            # Recherche des connexions USB (DFU mode)
            if (len(lineSplit) >= 9):
                if "USB" in line and "DFU" in line:
                    # Extraire le numéro de série si disponible
                    serialNumber = None
                    for i, part in enumerate(lineSplit):
                        if part == "SN" and i + 3 < len(lineSplit):
                            serialNumber = lineSplit[i + 3]
                            break
                    
                    if serialNumber:
                        # Connexion au device pour récupérer les infos
                        result2 = subprocess.run([CMD, '-c', 'port=usb1', 'sn=' + serialNumber], 
                                                capture_output=True, text=True)
                        output2 = result2.stdout
                        lines2 = output2.split('\n')

                        deviceId = None
                        flashSize = None
                        boardName = None

                        for line2 in lines2:
                            if 'Device ID' in line2:
                                deviceId = line2.split(':')[-1].strip()
                            if 'Board' in line2 and 'Name' not in line2:
                                boardName = line2.split(':')[-1].strip()
                            if 'Flash size' in line2:
                                try:
                                    flashSize = line2.split(':')[-1].strip()
                                except:
                                    pass

                        usbList.append(USB(serialNumber, deviceId, flashSize, 1, boardName))
    except Exception as e:
        print(f"Erreur lors de la détection USB: {e}")
    
    return usbList


if __name__ == '__main__':
    usb_devices = getUSB()
    print(f"\n=== Résultat ===")
    print(f"Nombre de périphériques USB trouvés: {len(usb_devices)}")
    for i, usb in enumerate(usb_devices):
        print(f"\nUSB {i+1}:")
        print(f"  Serial Number: {usb.serialNumber}")
        print(f"  Board Name: {usb.boardName}")
        print(f"  Device ID: {usb.deviceId}")
        print(f"  Flash Size: {usb.flashSize}")
        print(f"  Connected: {usb.connected}")
