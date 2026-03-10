# config/settings.py
import os
import platform
from pathlib import Path

def find_cube_programmer():
    """Détecte automatiquement où est installé STM32CubeProgrammer"""
    
    system = platform.system()
    
    # Emplacements possibles selon l'OS
    if system == "Windows":
        possible_paths = [
            r"C:\Program Files\STMicroelectronics\STM32Cube\STM32CubeProgrammer\bin",
            r"C:\Program Files (x86)\STMicroelectronics\STM32Cube\STM32CubeProgrammer\bin",
            r"C:\Git\STM32CubeProgrammer\bin",  # Ton cas particulier
        ]
        cli_name = "STM32_Programmer_CLI.exe"
        
    elif system == "Linux":
        possible_paths = [
            "/usr/local/STMicroelectronics/STM32Cube/STM32CubeProgrammer/bin",
            str(Path.home() / "STMicroelectronics/STM32Cube/STM32CubeProgrammer/bin"),
        ]
        cli_name = "STM32_Programmer_CLI.sh"
        
    else:  # macOS
        possible_paths = [
            "/Applications/STMicroelectronics/STM32Cube/STM32CubeProgrammer/bin",
        ]
        cli_name = "STM32_Programmer_CLI"
    
    # Chercher dans chaque emplacement possible
    for path in possible_paths:
        cli_path = Path(path) / cli_name
        if cli_path.exists():
           
            return str(cli_path)
    
    # Si rien trouvé
    print(" STM32CubeProgrammer non trouvé automatiquement")
    print(f"Emplacements cherchés : {possible_paths}")
    return None

# Détection au démarrage
CUBE_PROGRAMMER_CLI = find_cube_programmer()
VERSION = "v2.12.0"

def get_cli_command():
    """Retourne le chemin du CLI"""
    if CUBE_PROGRAMMER_CLI:
        return CUBE_PROGRAMMER_CLI
    else:
        raise FileNotFoundError(
            "STM32CubeProgrammer n'a pas été trouvé. "
            "Installez-le ou définissez CUBE_PROGRAMMER_PATH dans .env"
      )


