.PHONY: runserver

PYTHON := python3
PIP := $(PYTHON)

default: runserver
# Target to run production server
runserver:
	$(PYTHON) -m http.server 8080 -d frontend