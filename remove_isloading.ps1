$files = @(
    "app\products\g2\page.tsx",
    "app\products\g3\page.tsx",
    "app\products\c2\page.tsx",
    "app\my-contents\page.tsx",
    "app\learn\first-guide\page.tsx",
    "app\learn\system-builder\page.tsx",
    "app\learn\growth-book\page.tsx",
    "app\learn\strategy-source\page.tsx",
    "app\learn\strategy-vol1\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Remove isLoading from useAuth destructuring
        $content = $content -replace ', isLoading(?=\s*\})', ''
        $content = $content -replace 'isLoading,\s*(?=\})', ''
        
        # Remove the entire if (isLoading) block
        $content = $content -replace '(?s)if \(isLoading\) \{.*?<Footer />.*?\n.*?\);.*?\n.*?\}', ''
        
        Set-Content $file $content -NoNewline
        Write-Host "Updated: $file"
    }
}
