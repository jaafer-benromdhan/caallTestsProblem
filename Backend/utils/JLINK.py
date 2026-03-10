import os
import subprocess
from pathlib import Path
from utils.CMDOs import get_cli_command

class JLink:
    def __init__(self, serialNumber, deviceId, flashSize, connected, boardName):
        self.serialNumber = serialNumber
        self.deviceId = deviceId
        self.flashSize = flashSize
        self.connected = connected
        self.boardName = boardName

def getJlink():
    CMD = get_cli_command()
    LOG_FILE = Path(__file__).parent / "logListDevices.log"
    
    print("\nListing available boards connected to JLINK Interface !\n")
    
    # subprocess handles paths with spaces and arguments correctly
    result = subprocess.run(
        [CMD, "--list", "-log", str(LOG_FILE)],
        capture_output=True,
        text=True
    )
    
    if not LOG_FILE.exists():
        print("Error: log file was not created.")
        print("stdout:", result.stdout)
        print("stderr:", result.stderr)
        return []
    
    with open(LOG_FILE, "r") as f:
        lines = f.readlines()
    
    jlinkList = []
    for i, line in enumerate(lines):
        if line.strip().startswith("J-Link Probe"):
            for j in range(i+1, min(i+5, len(lines))):
                if "J-Link SN" in lines[j]:
                    serialNumber = lines[j].split(":")[-1].strip()
                    jlinkList.append(JLink(serialNumber, None, None, 1, None))
                    break
    return jlinkList

def getnbJlink():
    return len(getJlink())

if __name__ == "__main__":
    boards = getJlink()
    print(f"Found {len(boards)} board(s)")
    for b in boards:
        print(f"  SN: {b.serialNumber}")