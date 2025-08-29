import { useState, useEffect } from 'react'

const ClientForm = ({ onSubmit, editingClient, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf_cnpj: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingClient) {
      setFormData({
        nome: editingClient.nome || '',
        email: editingClient.email || '',
        cpf_cnpj: editingClient.cpf_cnpj || ''
      })
    } else {
      setFormData({ nome: '', email: '', cpf_cnpj: '' })
    }
    setErrors({})
  }, [editingClient])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.cpf_cnpj.trim()) {
      newErrors.cpf_cnpj = 'CPF/CNPJ é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      if (!editingClient) {
        setFormData({ nome: '', email: '', cpf_cnpj: '' })
      }
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({ nome: '', email: '', cpf_cnpj: '' })
    setErrors({})
    if (onCancel) onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.submit}
        </div>
      )}

      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.nome ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o nome completo"
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="cpf_cnpj" className="block text-sm font-medium text-gray-700 mb-1">
          CPF/CNPJ *
        </label>
        <input
          type="text"
          id="cpf_cnpj"
          name="cpf_cnpj"
          value={formData.cpf_cnpj}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.cpf_cnpj ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o CPF ou CNPJ"
        />
        {errors.cpf_cnpj && (
          <p className="mt-1 text-sm text-red-600">{errors.cpf_cnpj}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
          ) : (
            editingClient ? 'Atualizar Cliente' : 'Cadastrar Cliente'
          )}
        </button>
        
        {editingClient && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default ClientForm