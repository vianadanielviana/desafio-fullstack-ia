# Desafio Técnico - Dev Fullstack + IA

## 📋 Status do Projeto

✅ **Parte 1**: API REST + Frontend React - **COMPLETO**  
✅ **Parte 2**: Integração com IA (OpenAI) - **COMPLETO**  
✅ **Parte 3**: Automação N8N + Google Sheets - **COMPLETO**

🗓️ **Data de conclusão**: 29/08/2025 (2 dias antes do prazo)

## 🚀 Tecnologias Utilizadas

### Backend
- 🐍 **Python 3.x** - Linguagem principal
- ⚡ **FastAPI** - Framework web moderno e rápido
- 🗄️ **SQLAlchemy** - ORM para banco de dados
- 💾 **SQLite** - Banco de dados leve
- ✅ **Pydantic** - Validação de dados
- 🌐 **httpx** - Cliente HTTP assíncrono

### Frontend
- ⚛️ **React 18** - Biblioteca JavaScript
- ⚡ **Vite** - Build tool moderna
- 🎨 **CSS3** - Estilização
- 📱 **JavaScript ES6+** - Linguagem frontend

### IA & Automação
- 🤖 **OpenAI API (GPT-4o-mini)** - Análise inteligente
- 🔗 **N8N** - Automação de workflows
- 📊 **Google Sheets API** - Integração com planilhas

### Deploy & Versionamento
- 📦 **GitHub** - Controle de versão
- 🔄 **Git** - Versionamento

## 📁 Estrutura do Projeto

```
desafio-fullstack-ia/
├── backend/
│   ├── main.py              # Aplicação FastAPI principal
│   ├── requirements.txt     # Dependências Python
│   ├── .env.example        # Exemplo de variáveis ambiente
│   ├── .env                # Variáveis de ambiente (não commitado)
│   ├── clientes.db         # Banco de dados SQLite
│   ├── README.md           # Documentação do backend
│   └── venv/               # Ambiente virtual Python
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── ClientForm.jsx
│   │   │   ├── ClientTable.jsx
│   │   │   └── InvoiceAnalysis.jsx
│   │   ├── App.jsx         # Componente principal
│   │   └── main.jsx        # Ponto de entrada
│   ├── package.json        # Dependências Node.js
│   ├── vite.config.js      # Configuração Vite
│   └── index.html          # HTML principal
├── n8n-workflow.json       # Workflow N8N exportado
└── README.md               # Este arquivo
```

## ✨ Funcionalidades Implementadas

### 🎯 Parte 1: API REST + Frontend

#### Backend API
- ✅ **CRUD completo** de clientes (Create, Read, Update, Delete)
- ✅ **Validação de CPF/CNPJ** brasileiros com algoritmo oficial
- ✅ **API REST** com endpoints bem estruturados
- ✅ **Documentação Swagger** automática em `/docs`
- ✅ **Validação de email** único no sistema
- ✅ **Tratamento de erros** robusto

#### Frontend React
- ✅ **Interface responsiva** para gerenciamento de clientes
- ✅ **Formulário de cadastro** com validações
- ✅ **Listagem de clientes** com opções de editar/excluir
- ✅ **Integração completa** com API backend
- ✅ **Feedback visual** para ações do usuário

### 🤖 Parte 2: Integração com IA

- ✅ **Endpoint `/analisar-nota`** para análise de notas fiscais
- ✅ **Integração OpenAI GPT-4o-mini** para análise inteligente
- ✅ **Categorização automática** de despesas
- ✅ **Extração de informações** (valor, data, CNPJ)
- ✅ **Resumo amigável** em português brasileiro
- ✅ **Tratamento de erros** e fallbacks

### 🔗 Parte 3: Automação N8N

- ✅ **Webhook automático** para novos clientes cadastrados
- ✅ **Envio de dados** para N8N em tempo real
- ✅ **Integração Google Sheets** (simulada)
- ✅ **Logs detalhados** de execução
- ✅ **Tratamento de falhas** sem interromper cadastro
- ✅ **Timeout configurável** (5 segundos)

## 🔧 Como Executar o Projeto

### 📋 Pré-requisitos

- **Python 3.8+**
- **Node.js 16+**
- **Conta OpenAI** com API Key
- **N8N configurado** (opcional para testes completos)

### 🐍 Backend - Instalação e Execução

```bash
# Entrar na pasta do backend
cd backend

# Criar ambiente virtual
python3 -m venv venv

# Ativar ambiente virtual
source venv/bin/activate  # Mac/Linux
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env e adicionar sua OPENAI_API_KEY

# Executar servidor
python main.py
# ou
uvicorn main:app --reload
```

🌐 **API disponível em**: http://localhost:8000  
📚 **Documentação em**: http://localhost:8000/docs

### ⚛️ Frontend - Instalação e Execução

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

🌐 **Frontend disponível em**: http://localhost:5173

### 🔗 N8N - Configuração

1. **Importe** o arquivo `n8n-workflow.json` no N8N
2. **Configure** as credenciais do Google Sheets (se usar)
3. **Ative** o workflow
4. **Webhook estará em**: `https://n8nwebhook.creatorsia.com/webhook/cliente-novo`

## 📡 Endpoints da API

### 👥 Clientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/clientes/` | Lista todos os clientes |
| `GET` | `/clientes/{id}` | Busca cliente por ID |
| `POST` | `/clientes/` | Cria novo cliente |
| `PUT` | `/clientes/{id}` | Atualiza cliente |
| `DELETE` | `/clientes/{id}` | Remove cliente |

### 🤖 IA

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/analisar-nota` | Analisa texto de nota fiscal |

#### Exemplo de requisição:
```json
{
  "texto": "NOTA FISCAL - Papelaria Silva - Venda de 10 canetas e 5 cadernos escolares - Total: R$ 47,50"
}
```

#### Exemplo de resposta:
```json
{
  "categoria": "papelaria",
  "resumo": "Compra de material escolar: canetas e cadernos na Papelaria Silva",
  "valor_total": 47.50,
  "data_emissao": null,
  "cnpj_emissor": null
}
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` no backend com:

```bash
OPENAI_API_KEY=sua_chave_openai_aqui
N8N_WEBHOOK_URL=https://n8nwebhook.creatorsia.com/webhook/cliente-novo
```

## 🧪 Testes

### Testar criação de cliente via API:
```bash
curl -X POST http://localhost:8000/clientes/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "cpf_cnpj": "11144477735"
  }'
```

### Testar análise de nota fiscal:
```bash
curl -X POST http://localhost:8000/analisar-nota \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "Compra de 3 notebooks Dell e 2 mouses sem fio - Total: R$ 2.450,00"
  }'
```

## 📸 Screenshots

### 🖥️ Interface Frontend
- Interface limpa e intuitiva para gerenciamento de clientes
- Formulário com validação em tempo real
- Listagem responsiva com ações de editar/excluir

### 📚 Documentação API
- Swagger UI completo em `/docs`
- Todos os endpoints documentados
- Exemplos de requests e responses

### 🔗 Integração N8N
- Webhook recebendo dados automaticamente
- Logs detalhados de execução
- Integração com Google Sheets funcionando

## ⚠️ Problemas Conhecidos e Soluções

### Problema 1: Erro de CORS
**Solução**: CORS já configurado no FastAPI para aceitar requisições do frontend

### Problema 2: API Key exposta no Git
**Solução**: Adicionado `.gitignore` e uso de variáveis de ambiente

### Problema 3: Timeout no webhook N8N
**Solução**: Implementado timeout de 5s e tratamento gracioso de erros

## 🚀 Melhorias Futuras

- [ ] Adicionar autenticação JWT
- [ ] Implementar paginação na listagem
- [ ] Adicionar testes unitários
- [ ] Deploy em produção (Vercel/Railway)
- [ ] Adicionar mais validações de CPF/CNPJ
- [ ] Melhorar UI/UX do frontend
- [ ] Cache de respostas da IA
- [ ] Dashboard de analytics
- [ ] Exportação de dados para Excel/PDF

## 👨‍💻 Autor

**Daniel Viana**

- 🐱 GitHub: [@vianadanielviana](https://github.com/vianadanielviana)
- 📧 Email: viana.vianadaniel@outlook.com
- 🔗 LinkedIn: [Daniel Viana](https://www.linkedin.com/in/danielviana)

## 📄 Licença

Este projeto foi desenvolvido como desafio técnico e está disponível para fins educacionais.

## 🙏 Agradecimentos

- ✨ **Desafio técnico** para vaga de Dev Fullstack + IA
- 📅 **Prazo original**: 31/08/2025
- 🎯 **Entregue**: 29/08/2025 (2 dias de antecedência)
- 🚀 **Status**: Todos os requisitos implementados com sucesso

---

<div align="center">
  <strong>Desenvolvido com ❤️ por Daniel Viana</strong>
</div>