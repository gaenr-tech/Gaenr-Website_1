$port = 8000
$site = $PSScriptRoot

function Install-Ngrok {
    if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
        Write-Host "Downloading ngrok..."
        $url = "https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip"
        $zip = "$env:TEMP\ngrok.zip"
        Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
        $dest = "C:\Program Files\ngrok"
        if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }
        Expand-Archive -Path $zip -DestinationPath $dest -Force
        $env:Path += ";$dest"
        Write-Host "ngrok installed to $dest"
    } else {
        Write-Host "ngrok already installed"
    }
}

function Start-Server {
    Push-Location $site
    $proc = Start-Process -FilePath python -ArgumentList "-m","http.server","$port" -NoNewWindow -PassThru
    Pop-Location
    return $proc
}

function Start-Ngrok {
    $proc = Start-Process -FilePath ngrok -ArgumentList "http",$port -NoNewWindow -PassThru
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
