const ClientTable = ({ clients, onEdit, onDelete }) => {
  const formatCpfCnpj = (cpfCnpj) => {
    if (!cpfCnpj) return ''
    
    const digits = cpfCnpj.replace(/\D/g, '')
    
    if (digits.length === 11) {
      // CPF format: XXX.XXX.XXX-XX
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else if (digits.length === 14) {
      // CNPJ format: XX.XXX.XXX/XXXX-XX
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    
    return cpfCnpj
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <h5>Nenhum cliente cadastrado</h5>
          <p className="mb-0">Cadastre o primeiro cliente usando o formulário ao lado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Email</th>
            <th scope="col">CPF/CNPJ</th>
            <th scope="col">Cadastrado em</th>
            <th scope="col" className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>
                <strong>{client.nome}</strong>
              </td>
              <td className="text-muted">{client.email}</td>
              <td>
                <code className="text-dark">{formatCpfCnpj(client.cpf_cnpj)}</code>
              </td>
              <td className="text-muted small">
                {formatDate(client.created_at)}
              </td>
              <td className="text-end">
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    onClick={() => onEdit(client)}
                    className="btn btn-outline-primary"
                    title="Editar cliente"
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L3.5 10.707v3h3L11.207 9z"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(client.id)}
                    className="btn btn-outline-danger"
                    title="Excluir cliente"
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ClientTable