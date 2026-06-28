# Orbit Studio - Local Development Setup Script
# Run this script to set up the project for local development

Write-Host "🚀 Orbit Studio Setup" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 22+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green

$pnpmVersion = pnpm --version 2>$null
if (-not $pnpmVersion) {
    Write-Host "❌ pnpm is not installed. Installing..." -ForegroundColor Yellow
    npm install -g pnpm
}
Write-Host "✅ pnpm $pnpmVersion" -ForegroundColor Green

$dockerVersion = docker --version 2>$null
if (-not $dockerVersion) {
    Write-Host "⚠️ Docker is not installed. You'll need Docker for local infrastructure." -ForegroundColor Yellow
} else {
    Write-Host "✅ Docker $dockerVersion" -ForegroundColor Green
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Setup environment
if (-not (Test-Path ".env")) {
    Write-Host "🔧 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Edit it to add your API keys." -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Start Docker services
if ($dockerVersion) {
    Write-Host ""
    Write-Host "🐳 Starting Docker services (PostgreSQL, Redis, MinIO)..." -ForegroundColor Yellow
    docker compose -f docker/docker-compose.yml up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker services started" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Failed to start Docker services. Check Docker is running." -ForegroundColor Yellow
    }
}

# Generate Prisma client
Write-Host ""
Write-Host "🗄️ Generating Prisma client..." -ForegroundColor Yellow
pnpm db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green

# Run database migrations
Write-Host ""
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
pnpm db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Database migration failed. Make sure PostgreSQL is running." -ForegroundColor Yellow
}

# Seed database
Write-Host ""
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
pnpm db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Database seeding failed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Edit .env to add your AI provider API keys" -ForegroundColor White
Write-Host "  2. Run 'pnpm dev' to start the development server" -ForegroundColor White
Write-Host "  3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "Happy building! 🚀" -ForegroundColor Cyan
