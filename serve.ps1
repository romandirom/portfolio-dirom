$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "------------------------------------------------"
    Write-Host " SERVER LOCALE DI ROM ATTIVO " -ForegroundColor Green
    Write-Host "------------------------------------------------"
    Write-Host "Indirizzo: http://localhost:$port"
    Write-Host "Premi CTRL+C per fermare il server."
    Write-Host ""
    
    # Apre automaticamente nel browser
    Start-Process "http://localhost:$port"

    while($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $response = $context.Response
            $relPath = $context.Request.Url.LocalPath.TrimStart('/')
            if ($relPath -eq "") { $relPath = "index.html" }
            $path = Join-Path $PWD $relPath

            if (Test-Path $path -PathType Leaf) {
                # Determina il tipo di file (MIME type basico)
                $ext = [System.IO.Path]::GetExtension($path).ToLower()
                switch ($ext) {
                    ".html" { $response.ContentType = "text/html" }
                    ".css"  { $response.ContentType = "text/css" }
                    ".js"   { $response.ContentType = "application/javascript" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".svg"  { $response.ContentType = "image/svg+xml" }
                    default { $response.ContentType = "application/octet-stream" }
                }

                $content = [System.IO.File]::ReadAllBytes($path)
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                $response.StatusCode = 404
                Write-Host "404 - Non trovato: $relPath" -ForegroundColor Red
            }
            $response.Close()
        } catch {
            Write-Host "Errore durante la richiesta: $_" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "Impossibile avviare il server: $_" -ForegroundColor Red
} finally {
    if ($null -ne $listener) { $listener.Stop() }
}
