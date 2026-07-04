
import sys
import os

# Добавляем путь к папке backend, чтобы Python нашел server.py
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from server import app
app = app