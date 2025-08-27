@echo off
REM Script para iniciar a API de Clientes (Windows)
echo 🚀 Iniciando API de Clientes...

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado. Por favor, instale o Python 3.8+
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
if not exist "venv" (
    echo 📦 Criando ambiente virtual...
    python -m venv venv
)

REM Ativar ambiente virtual
echo 🔧 Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Instalar dependências
echo 📥 Instalando dependências...
pip install -r requirements.txt

REM Criar banco de dados (se não existir)
echo 🗄️ Verificando banco de dados...
python -c "from main import Base, engine; Base.metadata.create_all(bind=engine); print('✅ Banco de dados configurado!')"

REM Iniciar a API
echo 🌐 Iniciando API na porta 8000...
echo 📚 Documentação disponível em: http://localhost:8000/docs
echo 🔍 ReDoc disponível em: http://localhost:8000/redoc
echo 💡 Pressione Ctrl+C para parar a API
echo.

python main.py
pause
