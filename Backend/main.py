from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from typing import Dict, List, Any

# ---------------------------
# Config FastAPI + CORS
# ---------------------------
app = FastAPI(title="Test Suites API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ton front
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Modèles (pour /run_test)
# ---------------------------
class TestItem(BaseModel):
    name: str
    file: str
    address: str
    mcu: str
    interface: str
    reset: bool

# ---------------------------
# Parsing des .cfg
# ---------------------------
CFG_DIR = r"C:\Users\jbenromd\Desktop\actia001-main\backend\cfgFiles"

def parse_cfg_files() -> Dict[str, List[dict]]:
    """
    Lit tous les .cfg du dossier et renvoie:
    {
      "BoardName1": [ {test_object}, ... ],
      "BoardName2": [ ... ]
    }
    """
    if not os.path.isdir(CFG_DIR):
        raise FileNotFoundError(f"Dossier introuvable: {CFG_DIR}")

    cfg_files = [f for f in os.listdir(CFG_DIR) if f.lower().endswith(".cfg")]
    boards: Dict[str, List[dict]] = {}

    for cfg_file in cfg_files:
        board_name = cfg_file.replace(".cfg", "").replace("testDescription", "")
        boards[board_name] = []

        full_path = os.path.join(CFG_DIR, cfg_file)

        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
            for raw_line in f:
                line = raw_line.strip()

                # Ignore commentaires et lignes vides
                if not line or line.startswith("#"):
                    continue

                # Découpe sur espaces/tabs
                parts = line.split()

                # Remplace '---'/'-----' par string vide pour stabiliser les index
                parts = [p if p.strip("-") else "" for p in parts]

                # Sécurité: s'assurer qu'on a assez de colonnes
                # Indices utilisés plus bas: 1,2,3,4,6,10
                if len(parts) < 11:
                    # Si une ligne est incomplète, on la saute proprement
                    # (tu peux aussi la logger)
                    continue

         

                name = parts[1]
                file_path = parts[3]
                address = parts[4]
                mcu = parts[2]
                interface = parts[10] if len(parts) > 10 else ""
                reset = (parts[6].upper() == "TRUE") if len(parts) > 6 else False

                test_object = {
                    "name": name,
                    "file": file_path,
                    "address": address,
                    "mcu": mcu,
                    "interface": interface,
                    "reset": reset,
                }

                boards[board_name].append(test_object)

    return boards

# ---------------------------
# Endpoints
# ---------------------------



@app.get("/testsuites")
def get_testsuites_grouped() -> Dict[str, List[dict]]:
   
    try:
        return parse_cfg_files()
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/testsuites_flat")
def get_testsuites_flat() -> Dict[str, List[dict]]:

    try:
        boards = parse_cfg_files()
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    flat: List[dict] = []
    for board, tests in boards.items():
        # Si tu veux inclure le nom du board dans chaque test:
        for t in tests:
            flat.append({**t, "board": board})

    return {"tests": flat}
#bech nbadel feha bech toli generique tawa juste pour creer un front statique disant 
@app.get("/overview")
def get_overview():
    return {
        "version": "2.14.0",
        "connected": True,
        "interface": "ST-LINK",
        "path": "C:/Program Files/STMicroelectronics/STM32Cube/STM32CubeProgrammer",
        "lastRuns": [
            {"name": "DNLD", "success": True, "time": 123, "date": "2026-02-28"},
            {"name": "ERASE", "success": False, "time": 98, "date": "2026-02-27"},
        ],
        "totalTests": 12,
        "successRate": 85,
        "avgTime": 105
    }
@app.get("/charts")
def display_charts():
    return(
{
  "successOverTime": [
    { "date": "2026-03-01", "success": 10, "fail": 2 },
    { "date": "2026-03-02", "success": 12, "fail": 1 }
  ],
  "avgTimeByCommand": [
    { "cmd": "DNLD", "ms": 120 },
    { "cmd": "ERASE", "ms": 85 },
    { "cmd": "WRITE", "ms": 140 },
    { "cmd": "OB", "ms": 60 }
  ],
  "passFail": { "pass": 78, "fail": 22 },
  "failByReason": [
    { "reason": "Timeout", "count": 6 },
    { "reason": "Connection", "count": 4 },
    { "reason": "File", "count": 3 }
  ],
  "execBySuite": [
    { "suite": "C031", "runs": 15 },
    { "suite": "F411", "runs": 10 },
    { "suite": "HS73", "runs": 8 }
  ]
}
)

@app.get("/reports/latest")
def get_latest_report():
    return {
        "generatedAt": "2026-03-04 15:13:00",
        "cubeVersion": "v2.22.0",
        "interface": "ST-LINK",
        "summary": {
            "totalTests": 5,
            "success": 4,
            "fail": 1,
            "successRate": 80,
            "totalTimeMs": 532
        },
        "tests": [
            { "name": "DNLD", "status": "SUCCESS", "time": 120 },
            { "name": "ERASE", "status": "SUCCESS", "time": 80 },
            { "name": "WRITE", "status": "FAIL", "time": 96 }
        ],
        "logs": [
            "11:39:11:708 CubeProgrammer v2.22.0 Started",
            "11:39:11:742 Connecting using STLINK...",
            "11:39:11:840 WRITE failed: timeout"
        ]
    }


if __name__ == "__main__":
  
    uvicorn.run(app, host="0.0.0.0", port=8000)
