import { useState, useEffect } from 'react'
import ClientForm from './components/ClientForm'
import ClientTable from './components/ClientTable'
import InvoiceAnalysis from './components/InvoiceAnalysis'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [clients, setClients] = useState([])
  const [editingClient, setEditingClient] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`)
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleClientSubmit = async (clientData) => {
    try {
      let response
      if (editingClient) {
        // Update existing client
        response = await fetch(`${API_BASE_URL}/clientes/${editingClient.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientData),
        })
      } else {
        // Create new client
        response = await fetch(`${API_BASE_URL}/clientes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientData),
        })
      }

      if (response.ok) {
        fetchClients() // Refresh the list
        setEditingClient(null)
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erro ao salvar cliente')
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
      throw error
    }
  }

  const handleEditClient = (client) => {
    setEditingClient(client)
  }

  const handleDeleteClient = async (clientId) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${clientId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchClients() // Refresh the list
      } else {
        throw new Error('Erro ao excluir cliente')
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      alert('Erro ao excluir cliente')
    }
  }

  const handleCancelEdit = () => {
    setEditingClient(null)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container py-4">
        <h1 className="text-center mb-4 display-4 fw-bold text-dark">
          Sistema de Gestão de Clientes
        </h1>

        <div className="row g-4">
          {/* Client Form */}
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title h4 mb-3">
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </h2>
                <ClientForm
                  onSubmit={handleClientSubmit}
                  editingClient={editingClient}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          </div>

          {/* Client List */}
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title h4 mb-3">
                  Lista de Clientes
                </h2>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <ClientTable
                    clients={clients}
                    onEdit={handleEditClient}
                    onDelete={handleDeleteClient}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Analysis Section */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title h4 mb-3">
                  Análise de Notas Fiscais com IA
                </h2>
                <InvoiceAnalysis />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App