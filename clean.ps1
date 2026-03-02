# PowerShell script to remove comments from files

$extensions = @("*.js", "*.jsx")
$directories = @("backend", "frontend/src")

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        $files = Get-ChildItem -Path $dir -Recurse -Include $extensions
        foreach ($file in $files) {
            $content = Get-Content $file.FullName
            # Use regex to strip // comments
            # Warning: A simple regex might catch URLs. Using a basic regex for this task.
            $newContent = $content -replace '(?m)^\s*//.*$', ''
            $newContent | Set-Content $file.FullName
            Write-Host "Cleaned: $($file.FullName)"
        }
    }
}
