[CmdletBinding()]
param(
    [ValidateSet('start', 'test', 'stop', 'status', 'logs')]
    [string]$Action = 'start'
)

$ErrorActionPreference = 'Stop'
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Docker Desktop is required. Ruby, Node and browser dependencies run inside Docker.'
}

Push-Location $PSScriptRoot
try {
    function Test-DockerReady {
        # Windows PowerShell can turn native stderr into terminating errors.
        $probePreference = $ErrorActionPreference
        try {
            $ErrorActionPreference = 'Continue'
            & docker info --format '{{.ServerVersion}}' *> $null
            return $LASTEXITCODE -eq 0
        } finally { $ErrorActionPreference = $probePreference }
    }

    if (-not (Test-DockerReady)) {
        $desktopExecutable = Join-Path $env:ProgramFiles 'Docker\Docker\Docker Desktop.exe'
        if (-not (Test-Path -LiteralPath $desktopExecutable)) { throw 'Docker is not running.' }
        Write-Host 'Starting Docker Desktop...'
        Start-Process -FilePath $desktopExecutable -WindowStyle Hidden
        $dockerReady = $false
        for ($attempt = 0; $attempt -lt 90; $attempt++) {
            Start-Sleep -Seconds 2
            if (Test-DockerReady) { $dockerReady = $true; break }
        }
        if (-not $dockerReady) { throw 'Docker Desktop did not become ready within three minutes.' }
    }

    switch ($Action) {
        'start' { & docker compose up --build --wait --wait-timeout 180 site }
        'test' { & docker compose --profile test run --build --rm tests }
        'stop' { & docker compose stop site }
        'status' { & docker compose ps }
        'logs' { & docker compose logs --tail 100 site }
    }
    $result = $LASTEXITCODE
    if ($result -ne 0) { exit $result }
    if ($Action -eq 'start') { Write-Host 'Website ready: http://localhost:8080' }
} finally {
    Pop-Location
}
