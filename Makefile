.PHONY: help install install-backend install-frontend \
        dev dev-backend dev-frontend \
        test lint clean stop

BACKEND_DIR  := backend
FRONTEND_DIR := frontend
VENV         := $(CURDIR)/$(BACKEND_DIR)/.venv
PYTHON       := $(VENV)/bin/python
PIP          := $(VENV)/bin/pip
UVICORN      := $(VENV)/bin/uvicorn

# ── Default target ────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  LinkVideo — Makefile"
	@echo ""
	@echo "  make install        Install all dependencies (backend + frontend)"
	@echo "  make install-backend  Install Python deps only"
	@echo "  make install-frontend Install npm deps only"
	@echo ""
	@echo "  make dev            Start backend + frontend together (tmux)"
	@echo "  make dev-backend    Start FastAPI backend only (port 8000)"
	@echo "  make dev-frontend   Start Vite frontend only (port 5173)"
	@echo ""
	@echo "  make test           Run all backend tests"
	@echo "  make clean          Remove venv, node_modules, outputs, temp"
	@echo ""

# ── Install ───────────────────────────────────────────────────────────
install: install-backend install-frontend
	@echo "✓ All dependencies installed."

install-backend:
	@echo "→ Setting up Python venv at $(BACKEND_DIR)/.venv ..."
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip -q
	$(PIP) install -r $(BACKEND_DIR)/requirements.txt
	@[ -f $(BACKEND_DIR)/.env ] || cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env
	@echo "✓ Backend ready."

install-frontend:
	@echo "→ Installing frontend npm deps ..."
	cd $(FRONTEND_DIR) && npm install
	@echo "✓ Frontend ready."

# ── Dev servers ───────────────────────────────────────────────────────
dev-backend:
	@echo "→ Starting FastAPI on http://localhost:8000 ..."
	cd $(BACKEND_DIR) && $(UVICORN) main:app \
		--host 0.0.0.0 --port 8000 \
		--reload \
		--reload-exclude '.venv' \
		--reload-exclude '__pycache__'

dev-frontend:
	@echo "→ Starting Vite on http://localhost:5173 ..."
	cd $(FRONTEND_DIR) && npm run dev

# Start both servers side-by-side in tmux panes (requires tmux)
dev:
	@command -v tmux >/dev/null 2>&1 || { echo "tmux not found. Run 'make dev-backend' and 'make dev-frontend' in separate terminals."; exit 1; }
	@echo "→ Launching both servers in a tmux session (Ctrl+B D to detach) ..."
	tmux new-session -d -s linkvideo -x 220 -y 50 2>/dev/null || true
	tmux send-keys -t linkvideo "make dev-backend" Enter
	tmux split-window -h -t linkvideo
	tmux send-keys -t linkvideo "make dev-frontend" Enter
	tmux select-layout -t linkvideo even-horizontal
	tmux attach-session -t linkvideo

# ── Tests ─────────────────────────────────────────────────────────────
test:
	@echo "→ Running tests ..."
	$(PYTHON) -m pytest tests/ -v

# ── Clean ─────────────────────────────────────────────────────────────
clean:
	@echo "→ Cleaning up ..."
	rm -rf $(VENV)
	rm -rf $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/dist
	rm -rf outputs/* temp/*
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	@echo "✓ Clean."

stop:
	@echo "→ Killing any processes on ports 8000 and 5173 ..."
	-fuser -k 8000/tcp 2>/dev/null || true
	-fuser -k 5173/tcp 2>/dev/null || true
	@echo "✓ Stopped."
