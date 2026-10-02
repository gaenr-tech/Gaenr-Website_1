# Quick public preview for Gaenr site – returns URL and exits
# Requires Python (for simple HTTP server) and ngrok.
# This script starts the server, opens ngrok, prints the public URL, then cleans up.

$Port = 8000
$SitePath = "$PSScriptRoot"

function Ensure-Ngrok {
    if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
        Write-Host "Downloading ngrok..."
        $url = "https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip"
        $zip = "$env:TEMP\ngrok.zip"
        Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
        $dest = "$env:ProgramFiles\ngrok"
        if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }
        Expand-Archive -Path $zip -DestinationPath $dest -Force
        $env:Path += ";$dest"
        Write-Host "ngrok installed to $dest"
    }
}

function Start-Server {
    Push-Location $SitePath
    if (Get-Command python -ErrorAction SilentlyContinue) {
        $proc = Start-Process -FilePath python -ArgumentList "-m","http.server","$Port" -NoNewWindow -PassThru
    } else {
        Write-Error "Python not found – cannot start HTTP server."
        exit 1
    }
    Pop-Location
    return $proc
}

function Start-Ngrok {
    $proc = Start-Process -FilePath ngrok -ArgumentList "http","$Port" -RedirectStandardOutput "$env:TEMP\ngrok_out.txt" -NoNewWindow -PassThru
    Start-Sleep -Seconds 2
    $api = Invoke-RestMethod -Uri http://127.0.0.1:4040/api/tunnels
    $url = $api.tunnels[0].public_url
    Write-Output $url
    return $proc
}

Ensure-Ngrok
$server = Start-Server
$ngrok = Start-Ngrok
# Wait a short moment to ensure the URL is reachable (optional)
Start-Sleep -Seconds 5
# Cleanup
if ($ngrok) { Stop-Process -Id $ngrok.Id -Force }
if ($server) { Stop-Process -Id $server.Id -Force }
