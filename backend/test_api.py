#!/usr/bin/env python3
"""
Script de teste para a API de Clientes
Execute este script para testar todos os endpoints da API
"""

import requests
import json
import time

# Configuração da API
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/clientes"

def print_separator(title):
    print(f"\n{'='*50}")
    print(f" {title}")
    print(f"{'='*50}")

def print_response(response, title):
    print(f"\n--- {title} ---")
    print(f"Status: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except:
        print(f"Response: {response.text}")

def test_health_check():
    """Testa o endpoint de health check"""
    print_separator("HEALTH CHECK")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print_response(response, "Health Check")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Erro: Não foi possível conectar à API. Certifique-se de que ela está rodando.")
        return False

def test_create_cliente():
    """Testa a criação de clientes"""
    print_separator("CRIAR CLIENTES")
    
    clientes_teste = [
        {
            "nome": "João Silva Santos",
            "email": "joao.silva@email.com",
            "cpf_cnpj": "12345678901"
        },
        {
            "nome": "Maria Oliveira",
            "email": "maria.oliveira@email.com",
            "cpf_cnpj": "98765432100"
        },
        {
            "nome": "Empresa ABC Ltda",
            "email": "contato@empresaabc.com",
            "cpf_cnpj": "12345678000199"
        }
    ]
    
    clientes_criados = []
    
    for i, cliente in enumerate(clientes_teste, 1):
        print(f"\nCriando cliente {i}: {cliente['nome']}")
        
        try:
            response = requests.post(API_URL, json=cliente)
            print_response(response, f"Cliente {i} criado")
            
            if response.status_code == 201:
                clientes_criados.append(response.json())
                print(f"✅ Cliente {i} criado com sucesso!")
            else:
                print(f"❌ Falha ao criar cliente {i}")
                
        except Exception as e:
            print(f"❌ Erro ao criar cliente {i}: {e}")
    
    return clientes_criados

def test_list_clientes():
    """Testa a listagem de clientes"""
    print_separator("LISTAR CLIENTES")
    
    try:
        response = requests.get(API_URL)
        print_response(response, "Listar Clientes")
        
        if response.status_code == 200:
            clientes = response.json()
            print(f"✅ Total de clientes: {len(clientes)}")
            return clientes
        else:
            print("❌ Falha ao listar clientes")
            return []
            
    except Exception as e:
        print(f"❌ Erro ao listar clientes: {e}")
        return []

def test_get_cliente_by_id(cliente_id):
    """Testa a obtenção de um cliente específico"""
    print_separator(f"OBTER CLIENTE ID {cliente_id}")
    
    try:
        response = requests.get(f"{API_URL}/{cliente_id}")
        print_response(response, f"Cliente ID {cliente_id}")
        
        if response.status_code == 200:
            print(f"✅ Cliente ID {cliente_id} obtido com sucesso!")
            return response.json()
        else:
            print(f"❌ Falha ao obter cliente ID {cliente_id}")
            return None
            
    except Exception as e:
        print(f"❌ Erro ao obter cliente ID {cliente_id}: {e}")
        return None

def test_update_cliente(cliente_id, dados_atualizacao):
    """Testa a atualização de um cliente"""
    print_separator(f"ATUALIZAR CLIENTE ID {cliente_id}")
    
    try:
        response = requests.put(f"{API_URL}/{cliente_id}", json=dados_atualizacao)
        print_response(response, f"Cliente ID {cliente_id} atualizado")
        
        if response.status_code == 200:
            print(f"✅ Cliente ID {cliente_id} atualizado com sucesso!")
            return response.json()
        else:
            print(f"❌ Falha ao atualizar cliente ID {cliente_id}")
            return None
            
    except Exception as e:
        print(f"❌ Erro ao atualizar cliente ID {cliente_id}: {e}")
        return None

def test_delete_cliente(cliente_id):
    """Testa a exclusão de um cliente"""
    print_separator(f"DELETAR CLIENTE ID {cliente_id}")
    
    try:
        response = requests.delete(f"{API_URL}/{cliente_id}")
        print_response(response, f"Cliente ID {cliente_id} deletado")
        
        if response.status_code == 204:
            print(f"✅ Cliente ID {cliente_id} deletado com sucesso!")
            return True
        else:
            print(f"❌ Falha ao deletar cliente ID {cliente_id}")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao deletar cliente ID {cliente_id}: {e}")
        return False

def test_validation_errors():
    """Testa cenários de validação de erro"""
    print_separator("TESTES DE VALIDAÇÃO")
    
    # Teste 1: CPF inválido
    print("\n--- Teste: CPF inválido ---")
    try:
        response = requests.post(API_URL, json={
            "nome": "Teste CPF",
            "email": "teste@email.com",
            "cpf_cnpj": "12345678900"  # CPF inválido
        })
        print_response(response, "CPF inválido")
        
        if response.status_code == 422:
            print("✅ Validação de CPF funcionando corretamente!")
        else:
            print("❌ Validação de CPF não funcionou como esperado")
            
    except Exception as e:
        print(f"❌ Erro no teste de CPF: {e}")
    
    # Teste 2: Email duplicado
    print("\n--- Teste: Email duplicado ---")
    try:
        response = requests.post(API_URL, json={
            "nome": "Teste Duplicado",
            "email": "joao.silva@email.com",  # Email já existente
            "cpf_cnpj": "11122233344"
        })
        print_response(response, "Email duplicado")
        
        if response.status_code == 400:
            print("✅ Validação de email duplicado funcionando!")
        else:
            print("❌ Validação de email duplicado não funcionou como esperado")
            
    except Exception as e:
        print(f"❌ Erro no teste de email duplicado: {e}")
    
    # Teste 3: Nome muito curto
    print("\n--- Teste: Nome muito curto ---")
    try:
        response = requests.post(API_URL, json={
            "nome": "A",  # Nome muito curto
            "email": "teste@email.com",
            "cpf_cnpj": "11122233344"
        })
        print_response(response, "Nome muito curto")
        
        if response.status_code == 422:
            print("✅ Validação de nome funcionando!")
        else:
            print("❌ Validação de nome não funcionou como esperado")
            
    except Exception as e:
        print(f"❌ Erro no teste de nome: {e}")

def main():
    """Função principal que executa todos os testes"""
    print("🚀 INICIANDO TESTES DA API DE CLIENTES")
    print(f"🌐 URL da API: {BASE_URL}")
    
    # Teste 1: Health Check
    if not test_health_check():
        print("\n❌ API não está disponível. Encerrando testes.")
        return
    
    # Teste 2: Criar clientes
    clientes_criados = test_create_cliente()
    
    if not clientes_criados:
        print("\n❌ Nenhum cliente foi criado. Encerrando testes.")
        return
    
    # Teste 3: Listar clientes
    clientes_listados = test_list_clientes()
    
    # Teste 4: Obter cliente específico
    if clientes_criados:
        primeiro_cliente = clientes_criados[0]
        cliente_obtido = test_get_cliente_by_id(primeiro_cliente['id'])
    
    # Teste 5: Atualizar cliente
    if clientes_criados:
        primeiro_cliente = clientes_criados[0]
        cliente_atualizado = test_update_cliente(
            primeiro_cliente['id'],
            {"nome": f"{primeiro_cliente['nome']} - ATUALIZADO"}
        )
    
    # Teste 6: Testes de validação
    test_validation_errors()
    
    # Teste 7: Deletar cliente
    if clientes_criados:
        primeiro_cliente = clientes_criados[0]
        sucesso_delete = test_delete_cliente(primeiro_cliente['id'])
    
    # Verificação final
    print_separator("VERIFICAÇÃO FINAL")
    clientes_finais = test_list_clientes()
    
    print(f"\n🎯 RESUMO DOS TESTES:")
    print(f"✅ Clientes criados: {len(clientes_criados)}")
    print(f"✅ Clientes finais: {len(clientes_finais)}")
    
    if len(clientes_finais) == len(clientes_criados) - 1:
        print("✅ Teste de exclusão funcionou corretamente!")
    else:
        print("❌ Teste de exclusão não funcionou como esperado!")
    
    print("\n🎉 Testes concluídos!")

if __name__ == "__main__":
    main()
