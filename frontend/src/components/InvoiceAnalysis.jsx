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

  const getCategoryColor = (categoria) => {
    const colors = {
      'alimentação': 'bg-green-100 text-green-800',
      'saúde': 'bg-blue-100 text-blue-800',
      'transporte': 'bg-yellow-100 text-yellow-800',
      'educação': 'bg-purple-100 text-purple-800',
      'vestuário': 'bg-pink-100 text-pink-800',
      'eletrônicos': 'bg-indigo-100 text-indigo-800',
      'casa': 'bg-orange-100 text-orange-800',
      'papelaria': 'bg-gray-100 text-gray-800',
      'outros': 'bg-red-100 text-red-800'
    }
    return colors[categoria.toLowerCase()] || colors['outros']
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label htmlFor="invoice-text" className="block text-sm font-medium text-gray-700 mb-2">
          Texto da Nota Fiscal
        </label>
        <textarea
          id="invoice-text"
          value={invoiceText}
          onChange={(e) => setInvoiceText(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Cole aqui o texto da nota fiscal que deseja analisar...&#10;&#10;Exemplo:&#10;NOTA FISCAL ELETRONICA&#10;Supermercado ABC Ltda&#10;CNPJ: 12.345.678/0001-90&#10;Data: 15/08/2024&#10;&#10;Itens:&#10;- Arroz 5kg: R$ 25,00&#10;- Feijão 1kg: R$ 8,50&#10;&#10;Total: R$ 33,50"
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAnalyze}
          disabled={loading || !invoiceText.trim()}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analisando com IA...
            </span>
          ) : (
            '🤖 Analisar com IA'
          )}
        </button>
        
        <button
          onClick={handleClear}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Limpar
        </button>
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Análise da IA
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(analysis.categoria)}`}>
                {analysis.categoria}
              </span>
            </div>

            {/* Total Value */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-600 mb-1">Valor Total</label>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(analysis.valor_total)}
              </div>
            </div>

            {/* Issue Date */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-600 mb-1">Data de Emissão</label>
              <div className="text-gray-900">
                {analysis.data_emissao || 'N/A'}
              </div>
            </div>

            {/* CNPJ */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-600 mb-1">CNPJ do Emissor</label>
              <div className="text-gray-900 font-mono text-sm">
                {analysis.cnpj_emissor || 'N/A'}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-600 mb-2">Resumo</label>
            <p className="text-gray-900 leading-relaxed">
              {analysis.resumo}
            </p>
          </div>
        </div>
      )}

      {/* Sample Data Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Exemplo de Nota Fiscal</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2">
            Copie e cole este exemplo para testar a análise:
          </p>
          <div className="bg-white p-3 rounded border text-sm font-mono text-gray-700">
            NOTA FISCAL ELETRONICA<br/>
            Farmácia Saúde & Vida<br/>
            CNPJ: 98.765.432/0001-10<br/>
            Data: 20/08/2024<br/>
            <br/>
            Medicamentos:<br/>
            - Dipirona 500mg: R$ 12,90<br/>
            - Vitamina C: R$ 18,50<br/>
            <br/>
            Total: R$ 31,40
          </div>
          <button
            onClick={() => setInvoiceText(`NOTA FISCAL ELETRONICA
Farmácia Saúde & Vida
CNPJ: 98.765.432/0001-10
Data: 20/08/2024

Medicamentos:
- Dipirona 500mg: R$ 12,90
- Vitamina C: R$ 18,50

Total: R$ 31,40`)}
            className="mt-2 text-blue-600 text-sm hover:text-blue-800"
          >
            📋 Usar este exemplo
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceAnalysis