import React, { useEffect, useState } from 'react';
import api from "../../config/configApi.js";

export const Listar = () => {
    const [data, setData] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [filterColumn, setFilterColumn] = useState('name');
    const [filterOption, setFilterOption] = useState('asc');
    const [filteredData, setFilteredData] = useState([]);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [regionFilter, setRegionFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchColumn, setSearchColumn] = useState('name');
    const [deletePopoverOpen, setDeletePopoverOpen] = useState(false); // Estado para controlar o popover de confirmação
    const [deletingUserId, setDeletingUserId] = useState(null); // Estado para armazenar o ID do usuário sendo deletado
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    const getUsers = async () => {
        await api.get('/users')
            .then((response) => {
                setData(response.data.users);
            }).catch((err) => {
                console.log('Não foi possível recuperar os dados.');
            });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const openEditPopover = (user) => {
        const userData = filteredAndSearchedData().find(u => u.id === user.id);
        setEditingUser(userData);
        setEditedData({ ...userData });
    };

    const closeEditPopover = () => {
        setEditingUser(null);
        setEditedData({});
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

    const saveEditedData = async () => {
        await api.put(`/users/${editedData.id}`, editedData)
            .then((response) => {
                getUsers();
                closeEditPopover();
            }).catch((err) => {
                console.log('Erro ao salvar os dados.');
            });
    };

    const openDeletePopover = (userId) => {
        setDeletingUserId(userId);
        setDeletePopoverOpen(true);
    };

    const closeDeletePopover = () => {
        setDeletingUserId(null);
        setDeletePopoverOpen(false);
    };

    const deleteUser = async (id) => {
        closeDeletePopover(); // Fecha o popover de confirmação
        await api.delete(`/users/${id}`)
            .then((response) => {
                getUsers();
                setCurrentPage(1); // Voltar para a primeira página após excluir um usuário
            }).catch((err) => {
                console.log('Erro ao excluir o usuário.');
            });
    };

    const applyFilter = () => {
        let filtered = [...data];

        if (regionFilter !== 'all') {
            filtered = filtered.filter(user => {
                const region = getRegion(user.estado);
                return region === regionFilter;
            });
        }

        if (filterOption === 'asc' || filterOption === 'desc') {
            filtered.sort((a, b) => {
                if (filterOption === 'asc') {
                    return a[filterColumn].localeCompare(b[filterColumn]);
                } else {
                    return b[filterColumn].localeCompare(a[filterColumn]);
                }
            });
        } else if (filterOption === 'normal') {
            filtered.sort((a, b) => a.id - b.id);
        }

        setFilteredData(filtered);
        setIsFilterApplied(true);
    };

    const getRegion = (state) => {
        const regioes = {
            'Norte': ['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC'],
            'Nordeste': ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'],
            'Centro-Oeste': ['MT', 'MS', 'GO', 'DF'],
            'Sul': ['PR', 'RS', 'SC'],
            'Sudeste': ['SP', 'RJ', 'MG', 'ES']
        };

        for (const region in regioes) {
            if (regioes[region].includes(state)) {
                return region;
            }
        }

        return 'Outra';
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchColumnChange = (e) => {
        setSearchColumn(e.target.value);
    };

    const filteredAndSearchedData = () => {
        let filteredDataCopy = [...(isFilterApplied ? filteredData : data)];
        if (searchTerm && searchTerm.trim() !== "") {
            filteredDataCopy = filteredDataCopy.filter(item =>
                item[searchColumn].toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filteredDataCopy;
    };

    const prePage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredAndSearchedData().length / recordsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredAndSearchedData().slice(indexOfFirstRecord, indexOfLastRecord);

    return (
        <div>
            {/* Seção de Filtros e Controles */}
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Pesquisar..."
                />
                <select value={searchColumn} onChange={handleSearchColumnChange}>
                    <option value="name">Nome</option>
                    <option value="email">Email</option>
                    <option value="cpf">CPF</option>
                    <option value="estado">Estado</option>
                    <option value="cidade">Cidade</option>
                    <option value="rua">Rua</option>
                </select>
                <button className="filter-btn" onClick={applyFilter}>Filtro</button>
                <select value={filterColumn} onChange={(e) => setFilterColumn(e.target.value)}>
                    <option value="name">Nome</option>
                    <option value="email">Email</option>
                    <option value="cpf">CPF</option>
                    <option value="estado">Estado</option>
                    <option value="cidade">Cidade</option>
                    <option value="rua">Rua</option>
                </select>
                <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                    <option value="asc">A-Z</option>
                    <option value="desc">Z-A</option>
                    <option value="normal">Normal</option>
                </select>
                <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                    <option value="all">Todas as regiões</option>
                    <option value="Norte">Norte</option>
                    <option value="Nordeste">Nordeste</option>
                    <option value="Centro-Oeste">Centro-Oeste</option>
                    <option value="Sul">Sul</option>
                    <option value="Sudeste">Sudeste</option>
                </select>
            </div>
            {/* Tabela de Dados */}
            <table className="table">
                {/* Cabeçalho da Tabela */}
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>Estado</th>
                        <th>Editar</th>
                        <th>Deletar</th>
                    </tr>
                </thead>
                {/* Corpo da Tabela */}
                <tbody>
                    {currentRecords.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.cpf}</td>
                            <td>{user.estado}</td>
                            <td>
                                <button className='editar-btn' onClick={() => openEditPopover(user)}>
                                    <i className='bx bxs-pencil'></i>
                                </button>
                            </td>
                            <td>
                                <button className='delete-btn' onClick={() => openDeletePopover(user.id)}>
                                    <i className='bx bxs-trash'></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Paginação */}
            <div>
                <button onClick={prePage}>Anterior</button>
                <button onClick={nextPage}>Próxima</button>
            </div>
            {/* Popovers de Edição e Deleção */}
            {editingUser && (
                // Código do popover de edição
                <div>
                    <h2>Edit User</h2>
                    <input
                        type="text"
                        name="name"
                        value={editedData.name}
                        onChange={handleFieldChange}
                    />
                    <input
                        type="email"
                        name="email"
                        value={editedData.email}
                        onChange={handleFieldChange}
                    />
                    <input
                        type="text"
                        name="cpf"
                        value={editedData.cpf}
                        onChange={handleFieldChange}
                    />
                    <input
                        type="text"
                        name="estado"
                        value={editedData.estado}
                        onChange={handleFieldChange}
                    />
                    <button onClick={saveEditedData}>Salvar</button>
                    <button onClick={closeEditPopover}>Cancelar</button>
                </div>
            )}
            {deletePopoverOpen && (
                // Código do popover de deleção
                <div>
                    <p>Deseja realmente excluir este usuário?</p>
                    <button onClick={() => deleteUser(deletingUserId)}>Sim</button>
                    <button onClick={closeDeletePopover}>Não</button>
                </div>
            )}
        </div>
    );
};

export default Listar;
