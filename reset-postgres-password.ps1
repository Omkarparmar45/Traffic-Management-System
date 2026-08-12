# PostgreSQL Password Reset Script
# Requires: Administrative privileges
# PostgreSQL 18 installed at C:\Program Files\PostgreSQL\18

param(
    [string]$PostgresPath = "C:\Program Files\PostgreSQL\18",
    [string]$NewPassword = "1234"
)

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Script requires administrative privileges. Restarting with UAC elevation..."
    $scriptPath = $MyInvocation.MyCommand.Definition
    Start-Process powershell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$scriptPath`" -PostgresPath `"$PostgresPath`" -NewPassword `"$NewPassword`""
    exit
}

$pgHbaPath = Join-Path $PostgresPath "data\pg_hba.conf"
$psqlPath = Join-Path $PostgresPath "bin\psql.exe"
$serviceName = "postgresql-x64-18"

Write-Host "PostgreSQL Password Reset Script"
Write-Host "================================"
Write-Host "PostgreSQL Path: $PostgresPath"
Write-Host "pg_hba.conf: $pgHbaPath"
Write-Host "PSQL: $psqlPath"
Write-Host ""

# Verify files exist
if (-NOT (Test-Path $pgHbaPath)) {
    Write-Error "pg_hba.conf not found at: $pgHbaPath"
    exit 1
}

if (-NOT (Test-Path $psqlPath)) {
    Write-Error "psql.exe not found at: $psqlPath"
    exit 1
}

try {
    # Step 1: Backup pg_hba.conf
    Write-Host "[1] Backing up pg_hba.conf..."
    $backupPath = "$pgHbaPath.backup"
    Copy-Item $pgHbaPath $backupPath -Force
    Write-Host "    Backup created at: $backupPath"

    # Step 2: Add temporary trust line
    Write-Host "[2] Adding temporary trust line to pg_hba.conf..."
    $trustLine = "host    all             all             127.0.0.1/32            trust"
    $pgHbaContent = Get-Content $pgHbaPath
    $trustLine, $pgHbaContent | Set-Content $pgHbaPath
    Write-Host "    Trust line added at top of pg_hba.conf"

    # Step 3: Restart PostgreSQL service
    Write-Host "[3] Restarting $serviceName service..."
    Restart-Service -Name $serviceName -Force
    Start-Sleep -Seconds 3
    Write-Host "    Service restarted successfully"

    # Step 4: Reset password using trusted connection
    Write-Host "[4] Resetting postgres password..."
    $passwordCommand = "ALTER USER postgres WITH PASSWORD '$NewPassword';"
    & $psqlPath -U postgres -h 127.0.0.1 -c $passwordCommand
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to reset password. Exit code: $LASTEXITCODE"
        exit 1
    }
    Write-Host "    Password reset successfully"

    # Step 5: Remove temporary trust line
    Write-Host "[5] Removing temporary trust line from pg_hba.conf..."
    $pgHbaContent | Set-Content $pgHbaPath
    Write-Host "    Trust line removed"

    # Step 6: Restart service again
    Write-Host "[6] Restarting $serviceName service (final)..."
    Restart-Service -Name $serviceName -Force
    Start-Sleep -Seconds 2
    Write-Host "    Service restarted successfully"

    Write-Host ""
    Write-Host "================================"
    Write-Host "SUCCESS! Password reset complete."
    Write-Host "Username: postgres"
    Write-Host "Password: $NewPassword"
    Write-Host "================================"

} catch {
    Write-Error "Error during password reset: $_"
    Write-Host ""
    Write-Host "Attempting to restore backup..."
    if (Test-Path $backupPath) {
        Copy-Item $backupPath $pgHbaPath -Force
        Restart-Service -Name $serviceName -Force
        Write-Host "Backup restored. Service restarted."
    }
    exit 1
}
