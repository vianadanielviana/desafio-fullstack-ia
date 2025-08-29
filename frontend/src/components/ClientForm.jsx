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
    <form onSubmit={handleSubmit}>
      {errors.submit && (
        <div className="alert alert-danger" role="alert">
          {errors.submit}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="nome" className="form-label">
          Nome *
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
          placeholder="Digite o nome completo"
        />
        {errors.nome && (
          <div className="invalid-feedback">{errors.nome}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder="Digite o email"
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="cpf_cnpj" className="form-label">
          CPF/CNPJ *
        </label>
        <input
          type="text"
          id="cpf_cnpj"
          name="cpf_cnpj"
          value={formData.cpf_cnpj}
          onChange={handleChange}
          className={`form-control ${errors.cpf_cnpj ? 'is-invalid' : ''}`}
          placeholder="Digite o CPF ou CNPJ"
        />
        {errors.cpf_cnpj && (
          <div className="invalid-feedback">{errors.cpf_cnpj}</div>
        )}
      </div>

      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        {editingClient && (
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-outline-secondary me-md-2"
          >
            Cancelar
          </button>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Salvando...
            </>
          ) : (
            editingClient ? 'Atualizar Cliente' : 'Cadastrar Cliente'
          )}
        </button>
      </div>
    </form>
  )
}

export default ClientForm