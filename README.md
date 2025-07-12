
# ChatGPT Tarot Divination

A modern web application that combines AI-powered divination with traditional tarot reading practices. Built with FastAPI backend and Vue.js frontend.

## Features

- 🔮 **AI-Powered Tarot Readings** - ChatGPT integration for personalized divination
- 🌟 **Multiple Divination Types** - Tarot, astrology, numerology, dream interpretation
- 📚 **Extensive Blog Content** - 50+ articles about divination practices
- 🌐 **Multi-language Support** - Internationalization with Vue i18n
- 👤 **User Management** - Authentication and session handling
- 📱 **Progressive Web App** - PWA capabilities for mobile experience
- 🖥️ **Desktop App** - Tauri wrapper for native desktop experience
- ⚡ **Fast & Responsive** - Vite build system and optimized performance
- 🐳 **Docker Support** - Easy deployment with containerization

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Redis** - Caching and session storage
- **Pydantic** - Data validation

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool
- **Naive UI** - Vue component library
- **Vue Router** - Client-side routing
- **Vue i18n** - Internationalization

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- pnpm

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd chatgpt-tarot-divination
```

2. **Setup Frontend**
```bash
cd frontend
pnpm install
pnpm build --emptyOutDir
cd ..
```

3. **Setup Backend**
```bash
# Copy frontend build to dist
rm -r dist
cp -r frontend/dist/ dist

# Create virtual environment
python3 -m venv ./venv
./venv/bin/python3 -m pip install -r requirements.txt
```

4. **Run the Application**
```bash
./venv/bin/python3 main.py
```

The application will be available at `http://localhost:8000`

### Docker Deployment

```bash
docker-compose up -d
```

## Project Structure

```
├── src/                    # Backend source code
│   ├── app.py             # FastAPI application
│   ├── divination/        # Divination modules
│   ├── cache/             # Caching implementation
│   └── ...
├── frontend/              # Vue.js frontend
│   ├── src/
│   ├── public/
│   └── ...
├── dist/                  # Built frontend files
├── requirements.txt       # Python dependencies
└── docker-compose.yaml   # Docker configuration
```

## API Endpoints

- `/health` - Health check
- `/api/v1/blog` - Blog content
- `/chatgpt/*` - AI divination endpoints
- `/user/*` - User management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
