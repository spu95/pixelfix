#!/bin/bash
cd /var/www/python
#source venv/bin/activate
fastapi dev main.py --host 0.0.0.0 --port 8001
