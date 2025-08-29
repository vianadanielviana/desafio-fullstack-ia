import { useState } from 'react'

const API_BASE_URL = 'http://localhost:8000'

const InvoiceAnalysis = () => {
  const [invoiceText, setInvoiceText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!invoiceText.trim()) {
      setError('Por favor, insira o texto da nota fiscal')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await fetch(`${API_BASE_URL}/analisar-nota`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto: invoiceText }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erro ao analisar nota fiscal')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInvoiceText('')
    setAnalysis(null)
    setError('')
  }

  const formatCurrency = (value) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getCategoryBadgeClass = (categoria) => {
    const classes = {
      'alimentação': 'badge bg-success',
      'saúde': 'badge bg-info',
      'transporte': 'badge bg-warning text-dark',
      'educação': 'badge bg-primary',
      'vestuário': 'badge bg-danger',
      'eletrônicos': 'badge bg-dark',
      'casa': 'badge bg-warning text-dark',
      'papelaria': 'badge bg-secondary',
      'outros': 'badge bg-secondary'
    }
    return classes[categoria?.toLowerCase()] || classes['outros']
  }

  const exampleInvoice = `NOTA FISCAL ELETRONICA
Farmácia Saúde & Vida
CNPJ: 98.765.432/0001-10
Data: 20/08/2024

Medicamentos:
- Dipirona 500mg: R$ 12,90
- Vitamina C: R$ 18,50

Total: R$ 31,40`

  return (
    <div>
      {/* Input Section */}
      <div className="mb-4">
        <label htmlFor="invoice-text" className="form-label">
          Texto da Nota Fiscal
        </label>
        <textarea
          id="invoice-text"
          value={invoiceText}
          onChange={(e) => setInvoiceText(e.target.value)}
          rows={8}
          className="form-control"
          placeholder={`Cole aqui o texto da nota fiscal que deseja analisar...

Exemplo:
${exampleInvoice}`}
        />
        {error && (
          <div className="form-text text-danger">{error}</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4">
        <button
          onClick={handleAnalyze}
          disabled={loading || !invoiceText.trim()}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Analisando com IA...
            </>
          ) : (
            <>🤖 Analisar com IA</>
          )}
        </button>
        
        <button
          onClick={handleClear}
          className="btn btn-outline-secondary"
        >
          Limpar
        </button>
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="card border-success">
          <div className="card-header bg-light">
            <h5 className="card-title mb-0">
              <span className="text-success me-2">✓</span>
              Análise da IA
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Category */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <h6 className="card-subtitle mb-2 text-muted">Categoria</h6>
                    <span className={getCategoryBadgeClass(analysis.categoria)}>
                      {analysis.categoria}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Value */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <h6 className="card-subtitle mb-2 text-muted">Valor Total</h6>
                    <div className="h5 mb-0 text-success fw-bold">
                      {formatCurrency(analysis.valor_total)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Date */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <h6 className="card-subtitle mb-2 text-muted">Data de Emissão</h6>
                    <div className="text-dark">
                      {analysis.data_emissao || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* CNPJ */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <h6 className="card-subtitle mb-2 text-muted">CNPJ do Emissor</h6>
                    <code className="text-dark">
                      {analysis.cnpj_emissor || 'N/A'}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-3">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Resumo</h6>
                  <p className="card-text mb-0">
                    {analysis.resumo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Data Section */}
      <div className="mt-4 pt-4 border-top">
        <h5 className="mb-3">💡 Exemplo de Nota Fiscal</h5>
        <div className="alert alert-info">
          <p className="mb-2">
            <strong>Copie e cole este exemplo para testar a análise:</strong>
          </p>
          <div className="card">
            <div className="card-body">
              <pre className="mb-3 text-dark" style={{ fontSize: '0.9rem' }}>
                {exampleInvoice}
              </pre>
              <button
                type="button"
                onClick={() => setInvoiceText(exampleInvoice)}
                className="btn btn-sm btn-outline-primary"
              >
                📋 Usar este exemplo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceAnalysis