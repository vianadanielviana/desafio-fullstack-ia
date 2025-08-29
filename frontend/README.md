# Frontend - Sistema de Gestão de Clientes

Frontend moderno em React + Vite + Tailwind CSS para consumir a API FastAPI.

## Funcionalidades

✅ **Gestão de Clientes**
- Formulário para cadastrar novos clientes (Nome, Email, CPF/CNPJ)
- Tabela responsiva para listar todos os clientes
- Botões para editar e excluir clientes
- Validação de formulários com feedback visual

✅ **Análise de Notas Fiscais com IA**
- Interface para inserir texto de notas fiscais
- Integração com OpenAI para análise inteligente
- Extração automática de: categoria, valor, data, CNPJ, resumo
- Visualização organizada dos resultados

✅ **Interface Moderna**
- Design responsivo com Tailwind CSS
- Loading states e feedback visual
- Formatação automática de CPF/CNPJ e valores
- Cores por categoria de nota fiscal

## Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

### 3. Acessar aplicação
- Frontend: http://localhost:5173
- API Backend: http://localhost:8000 (deve estar rodando)

## Tecnologias

- **React 18** - Biblioteca de interface
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **JavaScript ES6+** - Linguagem moderna

## Estrutura do projeto

```
src/
├── components/
│   ├── ClientForm.jsx     # Formulário de clientes
│   ├── ClientTable.jsx    # Tabela de listagem
│   └── InvoiceAnalysis.jsx # Análise de notas fiscais
├── App.jsx                # Componente principal
├── main.jsx              # Ponto de entrada
└── index.css             # Estilos Tailwind
```

## API Integration

O frontend consome a API FastAPI em `http://localhost:8000` com os seguintes endpoints:

- `GET /clientes` - Listar clientes
- `POST /clientes` - Criar cliente
- `PUT /clientes/{id}` - Atualizar cliente
- `DELETE /clientes/{id}` - Excluir cliente
- `POST /analisar-nota` - Analisar nota fiscal com IA

## Scripts disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build de produção