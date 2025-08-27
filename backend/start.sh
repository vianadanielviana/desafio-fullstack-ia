#!/bin/bash

# Script para iniciar a API de Clientes
echo "🚀 Iniciando API de Clientes..."

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale o Python 3.8+"
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
echo "🔧 Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências
echo "📥 Instalando dependências..."
pip install -r requirements.txt

# Criar banco de dados (se não existir)
echo "🗄️ Verificando banco de dados..."
python3 -c "
from main import Base, engine
Base.metadata.create_all(bind=engine)
print('✅ Banco de dados configurado!')
"

# Iniciar a API
echo "🌐 Iniciando API na porta 8000..."
echo "📚 Documentação disponível em: http://localhost:8000/docs"
echo "🔍 ReDoc disponível em: http://localhost:8000/redoc"
echo "💡 Pressione Ctrl+C para parar a API"
echo ""

python3 main.py
