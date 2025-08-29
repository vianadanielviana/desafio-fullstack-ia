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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Sistema de Gestão de Clientes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Client Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <ClientForm
              onSubmit={handleClientSubmit}
              editingClient={editingClient}
              onCancel={handleCancelEdit}
            />
          </div>

          {/* Client List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Lista de Clientes
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

        {/* Invoice Analysis Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Análise de Notas Fiscais com IA
          </h2>
          <InvoiceAnalysis />
        </div>
      </div>
    </div>
  )
}

export default App