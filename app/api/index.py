import sys
import os

# Добавляем корень проекта в пути поиска, чтобы можно было импортировать папку app
sys.path.append(os.getcwd())

# Теперь импортируем ваше приложение из папки app
from .server import app as application

# Vercel ожидает, что переменная будет называться именно так (или перенаправляем)
app = application