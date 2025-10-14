# Makefile for ORT Assignment Backend
# Similar to npm scripts but using Make

.PHONY: help install setup-venv venv dev start test lint format clean

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup-venv: ## Set up virtual environment manually (without Poetry)
	@echo "Setting up virtual environment..."
	python -m venv .venv
	@echo "✅ Virtual environment created in .venv/"
	@echo "To activate: source .venv/bin/activate (Unix) or .venv\\Scripts\\activate.bat (Windows)"

venv: ## Activate Poetry virtual environment shell
	poetry shell

install: ## Install dependencies using Poetry
	poetry install

dev: ## Run development server with auto-reload
	poetry run dev

start: ## Run production server
	poetry run start

test: ## Run tests
	poetry run test

lint: ## Run linting (black, isort, flake8)
	poetry run lint

format: ## Format code with black and isort
	poetry run format

clean: ## Clean up cache files
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +

shell: ## Start Poetry shell
	poetry shell

build: ## Build the package
	poetry build

check: ## Check dependencies and lock file
	poetry check
