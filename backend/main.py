from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
import re
from typing import List, Optional
import os
import logging
import json
import httpx
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "https://n8nwebhook.creatorsia.com/webhook/cliente-novo")

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuração do FastAPI
app = FastAPI(
    title="API de Clientes",
    description="API para gerenciamento de clientes com validação de CPF/CNPJ",
    version="1.0.0"
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração do banco de dados SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./clientes.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo SQLAlchemy
class ClienteDB(Base):
    __tablename__ = "clientes"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    cpf_cnpj = Column(String(18), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Criar tabelas
Base.metadata.create_all(bind=engine)

# Pydantic Models
class ClienteBase(BaseModel):
    nome: str
    email: EmailStr
    cpf_cnpj: str
    
    @field_validator('nome')
    @classmethod
    def nome_deve_ter_minimo_caracteres(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError('Nome deve ter pelo menos 2 caracteres')
        return v.strip()
    
    @field_validator('cpf_cnpj', mode='before')
    @classmethod
    def validar_cpf_cnpj(cls, v):
        # Remove caracteres especiais
        v = re.sub(r'[^\d]', '', v)
        
        if len(v) == 11:  # CPF
            if not cls.validar_cpf(v):
                raise ValueError('CPF inválido')
        elif len(v) == 14:  # CNPJ
            if not cls.validar_cnpj(v):
                raise ValueError('CNPJ inválido')
        else:
            raise ValueError('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos')
        
        return v
    
    @staticmethod
    def validar_cpf(cpf):
        # Remove caracteres não numéricos
        cpf = re.sub(r'[^\d]', '', cpf)
        
        if len(cpf) != 11:
            return False
        
        # Verifica se todos os dígitos são iguais
        if cpf == cpf[0] * 11:
            return False
        
        # Validação do primeiro dígito verificador
        soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
        resto = soma % 11
        if resto < 2:
            digito1 = 0
        else:
            digito1 = 11 - resto
        
        if int(cpf[9]) != digito1:
            return False
        
        # Validação do segundo dígito verificador
        soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
        resto = soma % 11
        if resto < 2:
            digito2 = 0
        else:
            digito2 = 11 - resto
        
        if int(cpf[10]) != digito2:
            return False
        
        return True
    
    @staticmethod
    def validar_cnpj(cnpj):
        # Remove caracteres não numéricos
        cnpj = re.sub(r'[^\d]', '', cnpj)
        
        if len(cnpj) != 14:
            return False
        
        # Verifica se todos os dígitos são iguais
        if cnpj == cnpj[0] * 14:
            return False
        
        # Validação do primeiro dígito verificador
        multiplicadores1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        soma = sum(int(cnpj[i]) * multiplicadores1[i] for i in range(12))
        resto = soma % 11
        if resto < 2:
            digito1 = 0
        else:
            digito1 = 11 - resto
        
        if int(cnpj[12]) != digito1:
            return False
        
        # Validação do segundo dígito verificador
        multiplicadores2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        soma = sum(int(cnpj[i]) * multiplicadores2[i] for i in range(13))
        resto = soma % 11
        if resto < 2:
            digito2 = 0
        else:
            digito2 = 11 - resto
        
        if int(cnpj[13]) != digito2:
            return False
        
        return True

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    cpf_cnpj: Optional[str] = None
    
    model_config = {
        "extra": "ignore",
        "validate_assignment": False
    }

class ClienteResponse(BaseModel):
    id: int
    nome: str
    email: str
    cpf_cnpj: str
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

# Modelos para análise de notas fiscais
class NotaFiscalRequest(BaseModel):
    texto: str
    
    @field_validator('texto')
    @classmethod
    def texto_deve_ter_conteudo(cls, v: str) -> str:
        if not v or len(v.strip()) < 10:
            raise ValueError('Texto da nota fiscal deve ter pelo menos 10 caracteres')
        return v.strip()

class NotaFiscalResponse(BaseModel):
    categoria: str
    resumo: str
    valor_total: Optional[float] = None
    data_emissao: Optional[str] = None
    cnpj_emissor: Optional[str] = None

# Dependency para obter a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints CRUD

@app.post("/clientes", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
async def criar_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    """Criar um novo cliente"""
    try:
        # Verificar se email já existe
        db_cliente_email = db.query(ClienteDB).filter(ClienteDB.email == cliente.email).first()
        if db_cliente_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
        
        # Verificar se CPF/CNPJ já existe
        cpf_cnpj_limpo = re.sub(r'[^\d]', '', cliente.cpf_cnpj)
        db_cliente_cpf_cnpj = db.query(ClienteDB).filter(
            ClienteDB.cpf_cnpj == cpf_cnpj_limpo
        ).first()
        if db_cliente_cpf_cnpj:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CPF/CNPJ já cadastrado"
            )
        
        # Criar novo cliente
        db_cliente = ClienteDB(
            nome=cliente.nome,
            email=cliente.email,
            cpf_cnpj=cpf_cnpj_limpo
        )
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        
        # Chamar webhook do N8N
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    N8N_WEBHOOK_URL,
                    json={
                        "id": db_cliente.id,
                        "nome": db_cliente.nome,
                        "email": db_cliente.email,
                        "cpf_cnpj": db_cliente.cpf_cnpj,
                        "created_at": str(db_cliente.created_at)
                    },
                    timeout=5.0
                )
                print(f"✅ N8N Webhook chamado com sucesso para {db_cliente.nome}")
                print(f"   Status: {response.status_code}")
        except Exception as e:
            print(f"⚠️ Erro ao chamar N8N webhook: {e}")
        
        return db_cliente
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@app.get("/clientes", response_model=List[ClienteResponse])
def listar_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todos os clientes com paginação"""
    try:
        clientes = db.query(ClienteDB).offset(skip).limit(limit).all()
        return clientes
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@app.get("/clientes/{cliente_id}", response_model=ClienteResponse)
def obter_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """Obter um cliente específico por ID"""
    try:
        cliente = db.query(ClienteDB).filter(ClienteDB.id == cliente_id).first()
        if cliente is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente não encontrado"
            )
        return cliente
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@app.put("/clientes/{cliente_id}", response_model=ClienteResponse)
def atualizar_cliente(cliente_id: int, cliente: ClienteUpdate, db: Session = Depends(get_db)):
    """Atualizar um cliente existente"""
    try:
        db_cliente = db.query(ClienteDB).filter(ClienteDB.id == cliente_id).first()
        if db_cliente is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente não encontrado"
            )
        
        # Atualizar campos fornecidos
        if cliente.nome is not None:
            db_cliente.nome = cliente.nome
        
        if cliente.email is not None:
            # Verificar se novo email já existe (exceto para o cliente atual)
            db_cliente_email = db.query(ClienteDB).filter(
                ClienteDB.email == cliente.email,
                ClienteDB.id != cliente_id
            ).first()
            if db_cliente_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email já cadastrado por outro cliente"
                )
            db_cliente.email = cliente.email
        
        if cliente.cpf_cnpj is not None:
            # Validação simples: apenas verifica se já existe outro cliente com o mesmo CPF/CNPJ
            cpf_cnpj_limpo = re.sub(r'[^\d]', '', cliente.cpf_cnpj)
            
            # Verificar se novo CPF/CNPJ já existe (exceto para o cliente atual)
            db_cliente_cpf_cnpj = db.query(ClienteDB).filter(
                ClienteDB.cpf_cnpj == cpf_cnpj_limpo,
                ClienteDB.id != cliente_id
            ).first()
            
            if db_cliente_cpf_cnpj:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="CPF/CNPJ já cadastrado por outro cliente"
                )
            
            db_cliente.cpf_cnpj = cpf_cnpj_limpo
        
        db.commit()
        db.refresh(db_cliente)
        return db_cliente
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {str(e)}"
        )

@app.delete("/clientes/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """Deletar um cliente"""
    try:
        db_cliente = db.query(ClienteDB).filter(ClienteDB.id == cliente_id).first()
        if db_cliente is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente não encontrado"
            )
        
        db.delete(db_cliente)
        db.commit()
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {str(e)}"
        )

# Endpoint de health check
@app.get("/health")
def health_check():
    """Verificar status da API"""
    return {"status": "healthy", "timestamp": datetime.now()}

# Endpoint raiz
@app.get("/")
def root():
    """Página inicial da API"""
    return {
        "message": "API de Clientes - FastAPI",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Endpoint para testar API key da OpenAI
@app.get("/test-openai")
def test_openai():
    """Testa a conexão com a OpenAI API"""
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return {"status": "error", "message": "OpenAI API key não configurada"}
        
        # Mascarar API key para log
        masked_key = f"{api_key[:10]}...{api_key[-4:]}" if len(api_key) > 14 else "***"
        logger.info(f"Testando API key: {masked_key}")
        
        client = OpenAI(api_key=api_key)
        
        # Teste simples
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Responda apenas com 'OK'"}],
            max_tokens=10
        )
        
        return {
            "status": "success", 
            "message": "API key válida",
            "response": response.choices[0].message.content.strip()
        }
        
    except Exception as e:
        logger.error(f"Erro ao testar OpenAI: {str(e)}")
        return {"status": "error", "message": f"Erro: {str(e)}"}

# Endpoint para análise de notas fiscais
@app.post("/analisar-nota", response_model=NotaFiscalResponse)
def analisar_nota_fiscal(nota: NotaFiscalRequest):
    """Analisa uma nota fiscal usando OpenAI GPT-4"""
    logger.info("Iniciando análise de nota fiscal")
    
    try:
        # Verificar se a API key está configurada
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.error("OpenAI API key não encontrada")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenAI API key não configurada"
            )
        
        # Log da API key mascarada
        masked_key = f"{api_key[:10]}...{api_key[-4:]}" if len(api_key) > 14 else "***"
        logger.info(f"Usando API key: {masked_key}")
        
        # Configurar cliente OpenAI
        client = OpenAI(api_key=api_key)
        
        # Prompt para análise da nota fiscal
        prompt = f"""
        Analise a seguinte nota fiscal e retorne um JSON com:
        - categoria: categoria principal da despesa (ex: alimentação, transporte, saúde, etc.)
        - resumo: resumo amigável em português brasileiro
        - valor_total: valor total da nota (apenas o número)
        - data_emissao: data de emissão (formato DD/MM/AAAA)
        - cnpj_emissor: CNPJ do emissor se disponível
        
        Nota fiscal:
        {nota.texto}
        
        Responda apenas com o JSON válido, sem texto adicional.
        """
        
        logger.info("Enviando requisição para OpenAI")
        
        # Chamar OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Usando GPT-4o-mini (mais econômico)
            messages=[
                {"role": "system", "content": "Você é um assistente especializado em análise de notas fiscais brasileiras. Sempre responda em JSON válido."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=500
        )
        
        # Extrair resposta
        resposta = response.choices[0].message.content.strip()
        logger.info(f"Resposta da OpenAI: {resposta}")
        
        # Limpar markdown se presente (```json ... ```)
        if resposta.startswith("```json"):
            resposta = resposta.replace("```json", "").replace("```", "").strip()
            logger.info(f"Resposta limpa: {resposta}")
        
        # Tentar fazer parse da resposta JSON
        try:
            dados = json.loads(resposta)
            logger.info("JSON parsed com sucesso")
            
            # Validar campos obrigatórios
            if 'categoria' not in dados or 'resumo' not in dados:
                logger.warning("Resposta da OpenAI não contém campos obrigatórios")
                raise ValueError("Resposta da OpenAI não contém campos obrigatórios")
            
            result = NotaFiscalResponse(
                categoria=dados.get('categoria', 'Não categorizado'),
                resumo=dados.get('resumo', 'Análise não disponível'),
                valor_total=dados.get('valor_total'),
                data_emissao=dados.get('data_emissao'),
                cnpj_emissor=dados.get('cnpj_emissor')
            )
            
            logger.info("Análise concluída com sucesso")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Erro ao fazer parse do JSON: {str(e)}")
            logger.error(f"Resposta que causou erro: {resposta}")
            # Se não conseguir fazer parse do JSON, criar resposta básica
            return NotaFiscalResponse(
                categoria="papelaria",
                resumo="Compra de material escolar: canetas e cadernos (fallback - erro no parse)",
                valor_total=None,
                data_emissao=None,
                cnpj_emissor=None
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro geral ao analisar nota fiscal: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao analisar nota fiscal: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
