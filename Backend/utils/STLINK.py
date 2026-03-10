import subprocess
from pathlib import Path
from utils.CMDOs import get_cli_command

# Log folder next to the script
LOG_DIR = Path(__file__).parent / "logfiles"
LOG_DIR.mkdir(exist_ok=True)  # Creates the folder if it doesn't exist

class StLink:
    def __init__(self, serialNumber, deviceId, flashSize, connected, boardName):
        self.serialNumber = serialNumber
        self.deviceId = deviceId
        self.flashSize = flashSize
        self.connected = connected
        self.boardName = boardName

def getStlink():
    stlinkList = []
    CMD = get_cli_command()
    
    LIST_LOG = LOG_DIR / "stlink_list.log"
    
    result = subprocess.run([CMD, '--list', '-log', str(LIST_LOG)], capture_output=True, text=True)
    print(result)
    if not LIST_LOG.exists():
        print("Error: stlink_list.log was not created.")
        print("stdout:", result.stdout)
        print("stderr:", result.stderr)
        return []

    with open(LIST_LOG, "r") as f:
        lines = f.readlines()
    #print("=== CONTENU BRUT DU LOG ===")
    for i, line in enumerate(lines):
        #print(f"Ligne {i}: {repr(line)}")
       #print("=== FIN LOG ===")
        lineSplit = line.split()
        if len(lineSplit) == 5 and lineSplit[1] == "ST-LINK" and lineSplit[2] == "SN":
        
          
            serialNumber = lineSplit[4]
            boardName = None
            
            #mode = "SPI" if boardName == "STLINK-V3MODS" else "SWD"
            #on doit faire une etude sur les modes de connexions des plusieurs cartes
            CONNECT_LOG = LOG_DIR / f"stlink_connect_{serialNumber}.log"
            mode="SWD"
            result2 = subprocess.run(
                [CMD, '-c', f'port={mode}', f'sn={serialNumber}', '-log', str(CONNECT_LOG)],
                capture_output=True, text=True
            )

            if not CONNECT_LOG.exists():
                print(f"Error: connect log for {serialNumber} was not created.")
                continue

            with open(CONNECT_LOG, "r") as f2:
                lines2 = f2.readlines()

            deviceId = None
            flashSize = None

            for line2 in lines2:
                if 'Device ID' in line2:
                    deviceId = line2.split(':')[-1].strip()
                if 'Board' in line2:
                    boardName = line2.split(':')[-1].strip()
                if 'Flash size' in line2:
                    try:
                        flashSize = line2.split(':')[-1].strip()
                    except:
                        pass

            stlinkList.append(StLink(serialNumber, deviceId, flashSize, 1, boardName))

    return stlinkList
    

if __name__ == '__main__':
    stlinks = getStlink()
    print(f"\n=== Résultat ===")
    print(f"Nombre de ST-Link trouvés: {len(stlinks)}")
    for i, stlink in enumerate(stlinks):
        print(f"\nST-Link {i+1}:")
        print(f"  Serial Number: {stlink.serialNumber}")
        print(f"  Board Name:    {stlink.boardName}")
        print(f"  Device ID:     {stlink.deviceId}")
        print(f"  Flash Size:    {stlink.flashSize}")
        print(f"  Connected:     {stlink.connected}")
