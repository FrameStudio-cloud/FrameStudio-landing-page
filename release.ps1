param(
  [Parameter(Mandatory = $true)]
  [string]$Version,
  [string]$Notes = "",
  [string]$KeelDir = "C:\Users\Administrator\projects\keel",
  [string]$KeyPath = "$env:USERPROFILE\.tauri\keel.key",
  [string]$KeyPass = "keel-updater-key"
)

$ErrorActionPreference = "Stop"
$releaseDir = "$PSScriptRoot\public\releases"

# 1. Build the desktop app
Write-Host "=== Building Keel v$Version ===" -ForegroundColor Cyan
Push-Location $KeelDir
$msvcVer = "14.44.35207"
$sdkVer = "10.0.26100.0"
$vcDir = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2022\BuildTools"
$kitDir = "${env:ProgramFiles(x86)}\Windows Kits\10"
$env:Path = "$vcDir\VC\Tools\MSVC\$msvcVer\bin\Hostx64\x64;$env:USERPROFILE\.cargo\bin;$env:Path"
$env:LIB = "$vcDir\VC\Tools\MSVC\$msvcVer\lib\x64;$kitDir\Lib\$sdkVer\ucrt\x64;$kitDir\Lib\$sdkVer\um\x64"
$env:INCLUDE = "$vcDir\VC\Tools\MSVC\$msvcVer\include;$kitDir\Include\$sdkVer\ucrt;$kitDir\Include\$sdkVer\um;$kitDir\Include\$sdkVer\shared"
npm run tauri build
if ($LASTEXITCODE -ne 0) { throw "Tauri build failed" }
Pop-Location

# 2. Locate the installer
$installer = "Keel_${Version}_x64-setup.exe"
$builtExe = "$KeelDir\src-tauri\target\release\bundle\nsis\$installer"
if (-not (Test-Path $builtExe)) { throw "Installer not found at $builtExe" }

# 3. Copy to releases
Write-Host "=== Copying installer ===" -ForegroundColor Cyan
Copy-Item -Path $builtExe -Destination "$releaseDir\$installer" -Force

# 4. Sign it
Write-Host "=== Signing installer ===" -ForegroundColor Cyan
$env:TAURI_SIGNING_PRIVATE_KEY_PATH = $KeyPath
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = $KeyPass
$sigFile = "$releaseDir\$installer.sig"
npx tauri signer sign "$releaseDir\$installer" 2>&1
if ($LASTEXITCODE -ne 0) { throw "Signing failed" }

# 5. Read signature
$signature = Get-Content $sigFile -Raw | ForEach-Object { $_.Trim() }

# 6. Build latest.json
Write-Host "=== Updating latest.json ===" -ForegroundColor Cyan
$pubDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
$manifest = @{
  version = $Version
  notes = $Notes
  pub_date = $pubDate
  platforms = @{
    "windows-x86_64" = @{
      signature = $signature
      url = "https://framestudio.co.ke/releases/$installer"
    }
  }
}
$manifest | ConvertTo-Json | Set-Content "$releaseDir\latest.json" -Encoding Ascii

# 7. Update version in KeelDownload component
$downloadComponent = "$PSScriptRoot\src\components\KeelDownload.jsx"
(Get-Content $downloadComponent) -replace 'v[\d]+\.[\d]+\.[\d]+', "v$Version" | Set-Content $downloadComponent

Write-Host "=== Release v$Version ready ===" -ForegroundColor Green
Write-Host "Files in $releaseDir :" -ForegroundColor Yellow
Get-ChildItem $releaseDir | Select-Object Name, Length | Format-Table -AutoSize
Write-Host "Deploy framestudio-landing to make it live." -ForegroundColor Yellow
