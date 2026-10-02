# Temporary public preview script for the Gaenr static site
# Requires Python (for a simple HTTP server) and ngrok (for tunneling).
# Run this script in PowerShell. It will start the server on port 8000 and expose it via ngrok.

# ---- Configuration ----
$Port = 8000
$SitePath = "$PSScriptRoot"  # serve the current directory (where this script lives)

# ---- Helper: ensure ngrok is installed ----
function Ensure-Ngrok {
    if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
        Write-Host "ngrok not found, downloading..."
        $ngrokUrl = "https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip"
        $tempZip = "$env:TEMP\ngrok.zip"
        Invoke-WebRequest -Uri $ngrokUrl -OutFile $tempZip -UseBasicParsing
        $installDir = "$env:ProgramFiles\ngrok"
        if (-not (Test-Path $installDir)) { New-Item -ItemType Directory -Path $installDir | Out-Null }
        Expand-Archive -Path $tempZip -DestinationPath $installDir -Force
        $env:Path += ";$installDir"
        Write-Host "ngrok installed to $installDir"
    } else {
        Write-Host "ngrok is already installed"
    }
}

# ---- Start the local HTTP server ----
function Start-LocalServer {
    Write-Host "Starting local HTTP server on port $Port..."
    Push-Location $SitePath
    if (Get-Command python -ErrorAction SilentlyContinue) {
        $server = Start-Process -FilePath python -ArgumentList "-m", "http.server", "$Port" -NoNewWindow -PassThru
    } else {
        # Fallback: use .NET HttpListener via PowerShell
        $script = @"
Add-Type -AssemblyName System.Net.HttpListener
\$listener = New-Object System.Net.HttpListener
\$listener.Prefixes.Add('http://*:$Port/')
\$listener.Start()
while (\$listener.IsListening) {
    \$context = \$listener.GetContext()
    \$request = \$context.Request
    \$response = \$context.Response
    $localPath = Join-Path -Path '$SitePath' -ChildPath \$request.Url.AbsolutePath.TrimStart('/')
    if (Test-Path $localPath -PathType Leaf) {
        $bytes = [IO.File]::ReadAllBytes($localPath)
        \$response.ContentLength64 = $bytes.Length
        \$response.OutputStream.Write($bytes,0,$bytes.Length)
    } else {
        \$response.StatusCode = 404
        $msg = 'Not Found'
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
        \$response.ContentLength64 = $bytes.Length
        \$response.OutputStream.Write($bytes,0,$bytes.Length)
    }
    \$response.OutputStream.Close()
}
"@
        $server = Start-Process -FilePath "powershell" -ArgumentList "-NoProfile", "-Command", $script -WindowStyle Hidden -PassThru
    }
    return $server
}

# ---- Start ngrok tunnel ----
function Start-NgrokTunnel {
    Write-Host "Starting ngrok tunnel..."
    $ngrok = Start-Process -FilePath ngrok -ArgumentList "http", "$Port" -RedirectStandardOutput "$env:TEMP\ngrok_out.txt" -NoNewWindow -PassThru
    Start-Sleep -Seconds 2
    try {
        $api = Invoke-RestMethod -Uri http://127.0.0.1:4040/api/tunnels
        $publicUrl = $api.tunnels[0].public_url
        Write-Host "Public preview URL: $publicUrl"
    } catch {
        Write-Warning "Failed to retrieve ngrok URL – check ngrok output in $env:TEMP\ngrok_out.txt"
    }
    return $ngrok
}

# ---- Main execution ----
Ensure-Ngrok
$httpServer = Start-LocalServer
$ngrokProcess = Start-NgrokTunnel

Write-Host "\nPress ENTER to stop the preview and close all processes."
[void][System.Console]::ReadLine()

# Cleanup
Write-Host "Stopping ngrok..."
if ($ngrokProcess) { $ngrokProcess | Stop-Process -Force }
Write-Host "Stopping local server..."
if ($httpServer) { $httpServer | Stop-Process -Force }
Write-Host "Preview stopped."
