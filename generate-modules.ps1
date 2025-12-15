# NestJS Module Generator Helper
# This script helps generate all required NestJS modules with controllers and services

$modules = @(
    "auth",
    "users",
    "characters",
    "reference-images",
    "character-training-images",
    "generation-sessions",
    "generation-settings",
    "generated-images",
    "refinement-jobs",
    "image-tags",
    "generated-image-tags",
    "collections",
    "collection-images",
    "subscriptions",
    "credit-transactions",
    "payment-transactions",
    "shared-images",
    "user-preferences",
    "pose-library",
    "activity-logs",
    "notification-queue"
)

Write-Host "🏗️  NestJS Module Generator" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will generate $($modules.Length) NestJS modules" -ForegroundColor Yellow
Write-Host ""

$choice = Read-Host "Do you want to generate all modules? (y/n)"

if ($choice -ne 'y') {
    Write-Host "Cancelled" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Generating modules..." -ForegroundColor Green
Write-Host ""

foreach ($module in $modules) {
    Write-Host "📦 Generating module: $module" -ForegroundColor Cyan
    
    # Generate module
    npx nx g @nx/nest:module $module --directory=apps/api/src/modules/$module --no-interactive
    
    # Generate controller
    npx nx g @nx/nest:controller $module --directory=apps/api/src/modules/$module --no-interactive
    
    # Generate service
    npx nx g @nx/nest:service $module --directory=apps/api/src/modules/$module --no-interactive
    
    # Create docs folder
    $docsPath = "apps/api/src/modules/$module/docs"
    New-Item -ItemType Directory -Force -Path $docsPath | Out-Null
    
    # Create placeholder docs file
    $docsContent = @"
# $module Module Documentation

## Overview
Documentation for the $module module.

## Endpoints

### GET /$module
Description: Get all $module

### GET /$module/:id
Description: Get $module by ID

### POST /$module
Description: Create new $module

### PATCH /$module/:id
Description: Update $module

### DELETE /$module/:id
Description: Delete $module

## Swagger Decorators
Add Swagger decorators to the controller methods.
"@
    
    Set-Content -Path "$docsPath/README.md" -Value $docsContent
    
    Write-Host "  ✅ Module created with controller, service, and docs folder" -ForegroundColor Green
    Write-Host ""
}

Write-Host "✅ All modules generated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Implement business logic in each service" -ForegroundColor White
Write-Host "  2. Add Swagger decorators to controllers" -ForegroundColor White
Write-Host "  3. Create DTOs for each module" -ForegroundColor White
Write-Host "  4. Add validation and error handling" -ForegroundColor White
Write-Host ""
