# API de Clientes - FastAPI

Uma API completa para gerenciamento de clientes com validação de CPF/CNPJ brasileiros, construída com FastAPI, SQLAlchemy e SQLite.

## 🚀 Funcionalidades

- ✅ CRUD completo de clientes
- ✅ Validação automática de CPF e CNPJ brasileiros
- ✅ Validação de email único
- ✅ Banco de dados SQLite
- ✅ Configuração CORS para frontend
- ✅ Documentação automática (Swagger/ReDoc)
- ✅ Tratamento de erros robusto
- ✅ Validação de dados com Pydantic

## 📋 Pré-requisitos

- Python 3.8+
- pip (gerenciador de pacotes Python)

## 🛠️ Instalação

1. Clone o repositório ou navegue até a pasta do projeto
2. Instale as dependências:

```bash
pip install -r requirements.txt
```

## 🚀 Executando a API

### Opção 1: Executar diretamente
```bash
python main.py
```

### Opção 2: Usar uvicorn
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

A API estará disponível em: `http://localhost:8000`

## 📚 Documentação da API

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🗄️ Endpoints

### Clientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/clientes` | Criar novo cliente |
| `GET` | `/clientes` | Listar todos os clientes |
| `GET` | `/clientes/{id}` | Obter cliente por ID |
| `PUT` | `/clientes/{id}` | Atualizar cliente |
| `DELETE` | `/clientes/{id}` | Deletar cliente |

### Utilitários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Página inicial |
| `GET` | `/health` | Status da API |
| `POST` | `/analisar-nota` | Analisar nota fiscal com IA |

## 📝 Modelo de Dados

### Cliente

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf_cnpj": "12345678901",
  "created_at": "2024-01-01T10:00:00"
}
```

### Campos

- **id**: Identificador único (auto-incremento)
- **nome**: Nome do cliente (mínimo 2 caracteres)
- **email**: Email único do cliente
- **cpf_cnpj**: CPF (11 dígitos) ou CNPJ (14 dígitos) único
- **created_at**: Data/hora de criação (automático)

## 🔍 Validações

### CPF
- Deve ter exatamente 11 dígitos
- Validação dos dígitos verificadores
- Não pode ter todos os dígitos iguais

### CNPJ
- Deve ter exatamente 14 dígitos
- Validação dos dígitos verificadores
- Não pode ter todos os dígitos iguais

### Email
- Formato válido de email
- Deve ser único no sistema

### Nome
- Mínimo de 2 caracteres
- Remove espaços em branco extras

## 📊 Exemplos de Uso

### Criar Cliente

```bash
curl -X POST "http://localhost:8000/clientes" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "cpf_cnpj": "98765432100"
  }'
```

### Listar Clientes

```bash
curl "http://localhost:8000/clientes"
```

### Obter Cliente por ID

```bash
curl "http://localhost:8000/clientes/1"
```

### Atualizar Cliente

```bash
curl -X PUT "http://localhost:8000/clientes/1" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva Santos"
  }'
```

### Deletar Cliente

```bash
curl -X DELETE "http://localhost:8000/clientes/1"
```

### Analisar Nota Fiscal

```bash
curl -X POST "http://localhost:8000/analisar-nota" \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "NOTA FISCAL ELETRÔNICA - Nº 001 - Data: 15/08/2024 - Supermercado ABC - CNPJ: 12.345.678/0001-90 - Itens: Arroz 5kg R$ 25,00, Feijão 1kg R$ 8,50, Total: R$ 33,50"
  }'
```

## 🗃️ Banco de Dados

- **Tipo**: SQLite
- **Arquivo**: `clientes.db` (criado automaticamente)
- **Localização**: Pasta raiz do projeto

## 🤖 Análise de Notas Fiscais com IA

### Endpoint: `POST /analisar-nota`

Analisa notas fiscais usando OpenAI GPT-4o-mini para extrair informações estruturadas.

#### Request:
```json
{
  "texto": "Texto da nota fiscal para análise"
}
```

#### Response:
```json
{
  "categoria": "alimentação",
  "resumo": "Compra de produtos alimentícios no supermercado",
  "valor_total": 45.67,
  "data_emissao": "15/08/2024",
  "cnpj_emissor": "12.345.678/0001-90"
}
```

#### Configuração:
- Configure a variável de ambiente `OPENAI_API_KEY` com sua chave da OpenAI
- O modelo usado é GPT-4o-mini para economia de custos
- Análise automática de categorias, valores e datas

## 🔧 Configurações

### CORS
- Configurado para permitir requisições de qualquer origem
- Em produção, especifique os domínios permitidos

### Paginação
- Endpoint de listagem suporta paginação
- Parâmetros: `skip` (pular) e `limit` (limite)
- Padrão: `skip=0`, `limit=100`

## 🚨 Tratamento de Erros

A API retorna códigos de status HTTP apropriados:

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## 🧪 Testando a API

### 1. Inicie a API
```bash
python main.py
```

### 2. Acesse a documentação
- Abra http://localhost:8000/docs no navegador
- Use o Swagger UI para testar os endpoints

### 3. Teste com curl ou Postman
- Use os exemplos acima para testar cada endpoint

## 🔒 Segurança

- Validação rigorosa de entrada
- Sanitização de dados
- Verificação de unicidade
- Tratamento de exceções

## 🚀 Deploy

### Desenvolvimento
```bash
uvicorn main:app --reload
```

### Produção
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.
