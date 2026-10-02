# Quick preview script that works without needing ngrok in PATH
# Saves ngrok to a temporary folder, runs it directly, and prints the public URL.

$Port = 8000
$SitePath = $PSScriptRoot   # folder containing this script
$NgrokDir = "$env:TEMP\ngrok_tmp"
$NgrokExe = "$NgrokDir\ngrok.exe"

function Install-Ngrok {
    if (-Not (Test-Path $NgrokExe)) {
        Write-Host "Downloading ngrok to $NgrokDir..."
        New-Item -ItemType Directory -Path $NgrokDir -Force | Out-Null
        $url = "https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip"
        $zipPath = "$env:TEMP\ngrok.zip"
        Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
        Expand-Archive -Path $zipPath -DestinationPath $NgrokDir -Force
        Write-Host "ngrok downloaded."
    } else {
        Write-Host "ngrok already present at $NgrokExe"
    }
}

function Start-Server {
    Push-Location $SitePath
    $proc = Start-Process -FilePath python -ArgumentList @("-m","http.server",$Port) -NoNewWindow -PassThru
    Pop-Location
    return $proc
}

function Start-Ngrok {
    $proc = Start-Process -FilePath $NgrokExe -ArgumentList @("http",$Port) -NoNewWindow -PassThru
    Start-Sleep -Seconds 2
    $api = Invoke-RestMethod -Uri http://127.0.0.1:4040/api/tunnels
    $public = $api.tunnels[0].public_url
    Write-Output $public
    return $proc
}

# -------------------
Install-Ngrok
$server = Start-Server
$ngrok = Start-Ngrok
# Keep the tunnel alive for a short while so you can copy the URL
Start-Sleep -Seconds 6
# Cleanup
if ($ngrok) { Stop-Process -Id $ngrok.Id -Force }
if ($server) { Stop-Process -Id $server.Id -Force }
