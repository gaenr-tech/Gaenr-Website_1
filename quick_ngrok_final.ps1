# Quick public preview for Gaenr site – prints a shareable ngrok URL and cleans up
$Port = 8000
$SitePath = $PSScriptRoot

function Install-Ngrok {
    $dest = "$env:LOCALAPPDATA\ngrok"
    if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
        Write-Host "Downloading ngrok..."
        $url = "https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip"
        $zip = "$env:TEMP\ngrok.zip"
        Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
        if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }
        Expand-Archive -Path $zip -DestinationPath $dest -Force
        $env:Path += ";$dest"
        Write-Host "ngrok installed to $dest"
    } else {
        Write-Host "ngrok already available"
    }
}

function Start-Server {
    Push-Location $SitePath
    if (Get-Command python -ErrorAction SilentlyContinue) {
        $proc = Start-Process -FilePath python -ArgumentList @("-m","http.server",$Port) -NoNewWindow -PassThru
    } else {
        Write-Error "Python not found – cannot start HTTP server."
        exit 1
    }
    Pop-Location
    return $proc
}

function Start-Ngrok {
    $proc = Start-Process -FilePath ngrok -ArgumentList @("http",$Port) -NoNewWindow -PassThru
    Start-Sleep -Seconds 2
    $api = Invoke-RestMethod -Uri http://127.0.0.1:4040/api/tunnels
    $url = $api.tunnels[0].public_url
    Write-Output $url
    return $proc
}

Install-Ngrok
$server = Start-Server
$ngrok = Start-Ngrok
Start-Sleep -Seconds 5
if ($ngrok) { Stop-Process -Id $ngrok.Id -Force }
if ($server) { Stop-Process -Id $server.Id -Force }
