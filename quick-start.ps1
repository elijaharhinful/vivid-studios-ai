# Vivid Studios AI - Quick Start Script

Write-Host "🚀 Vivid Studios AI - Quick Start" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Please update with your configuration." -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🐳 Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker services started successfully" -ForegroundColor Green
    Write-Host ""
    Write-Host "Services running:" -ForegroundColor Cyan
    Write-Host "  - PostgreSQL: localhost:5432" -ForegroundColor White
    Write-Host "  - Redis: localhost:6379" -ForegroundColor White
    Write-Host "  - MinIO API: localhost:9000" -ForegroundColor White
    Write-Host "  - MinIO Console: localhost:9001" -ForegroundColor White
} else {
    Write-Host "❌ Failed to start Docker services" -ForegroundColor Red
    Write-Host "Please ensure Docker is running and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run migrations: npm run migration:run" -ForegroundColor White
Write-Host "  2. Start development: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Access points:" -ForegroundColor Cyan
Write-Host "  - Web App: http://localhost:4200" -ForegroundColor White
Write-Host "  - API: http://localhost:3000" -ForegroundColor White
Write-Host "  - API Docs: http://localhost:3000/docs/api" -ForegroundColor White
Write-Host "  - MinIO Console: http://localhost:9001" -ForegroundColor White
Write-Host "    (Username: minio_admin, Password: minio_password)" -ForegroundColor Gray
Write-Host ""
