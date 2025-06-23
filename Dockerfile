# Stage 1: Build the frontend
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy frontend dependency definitions
COPY frontend/package.json frontend/pnpm-lock.yaml* ./frontend/
# Set a tolerant pnpm config and install dependencies
RUN cd frontend && pnpm config set fetch-retries 5 && pnpm config set fetch-timeout 60000 && pnpm install --frozen-lockfile --strict-peer=false

# Copy the rest of the frontend source code and build
COPY frontend/ ./frontend/
# The --emptyOutDir flag is useful for local builds, but can be removed for CI
RUN cd frontend && pnpm build

# Stage 2: Build the final Python application
FROM python:3.10-slim
WORKDIR /app

# Copy the built frontend from the builder stage
COPY --from=builder /app/frontend/dist ./dist

# Copy backend files
COPY requirements.txt ./
COPY src ./src
COPY main.py .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
# Railway provides the PORT variable, but uvicorn defaults to 8000 if not set.
# The host must be 0.0.0.0 to be accessible outside the container.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
