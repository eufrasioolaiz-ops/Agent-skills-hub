$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$electronExe = Join-Path $projectRoot 'node_modules\electron\dist\electron.exe'
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutName = [string]::Concat([char]24615, [char]33021, 'BI', [char]23567, [char]28014, [char]31383, '.lnk')
$shortcutPath = Join-Path $desktop $shortcutName

if (-not (Test-Path -LiteralPath $electronExe)) {
  throw ('Electron not found: ' + $electronExe + '. Run npm install first.')
}

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $electronExe
$quote = [char]34
$shortcut.Arguments = $quote + $projectRoot + $quote
$shortcut.WorkingDirectory = $projectRoot
$shortcut.IconLocation = $electronExe + ',0'
$shortcut.Description = 'Start Floating Performance BI without a terminal window'
$shortcut.WindowStyle = 1
$shortcut.Save()

Write-Host ('Shortcut created: ' + $shortcutPath)
