import React, { useEffect, useState } from "react";
import api from "../../config/configApi";
import axios from 'axios';
export const Listar = () => {

    // Variavel para receber os registros pegos pela Api
    const [data, setData] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const  recordsPerPage = 5;

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;

    const records = data.slice(firstIndex, lastIndex);
    const npage = Math.ceil(data.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys( )].slice(1)


    // Api recuperar Usuarios
    const getUsers = async () => {

        // requisição da Api com os Usuarios
        await api.get('/users')
            .then((response) => {
                // console.log(response.data.users)
                setData(response.data.users)


            }).catch((err) => {

                console.log('não chegou.....')

            })
    }

    // Lidar com efeitos colaterais do componente ex: atualizar o estados e fazer chamadas a Api
    useEffect(() => {
        // Chamar a função com requisição para API
        getUsers();
      }, []);


    return (
        <body>
            {/* <!-- header --> */}
            <nav className="navbar navbar-expand-lg bg-body-tertiary header ">

                {/* <!-- div da logo --> */}
                <div className="container-fluid logo">
                    <nav className="navbar bg-body-tertiary">
                        <div className="container">
                            <a className="navbar-brand" href="#">
                                <img src="/img/logo.png" alt="Bootstrap" width="40" height="34" />
                            </a>
                        </div>
                    </nav>


                    <button className="navbar-toggler offbar" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>


                    <div className="collapse navbar-collapse botoes" id="navbarNav offbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <i className="bi bi-speedometer2 Dashboard"></i>
                                <a className="nav-link active main" aria-current="page" href="/Dashboard">Dashboard</a>
                            </li>

                        </ul>
                        <ul className="nav justify-content-end ">
                            <li className="nav-item ">
                                <div className="selecionado">
                                    <i className="bi bi-card-list Listar"></i>
                                    <a className="nav-link" href="/listar">Listar</a>
                                </div>
                            </li>
                            <li className="nav-item">
                                <i className="bi bi-ui-checks-grid Formulario"></i>
                                <a className="nav-link" href="/formulario">Formulario</a>
                            </li>
                            <li className="nav-item">
                                <i className="bi bi-eye-fill Visualizar"></i>
                                <a className="nav-link" href="/visualizar">Visualizar</a>
                            </li>
                            <li className="nav-item">
                                <i className="bi bi-slash-circle Alerta"></i>
                                <a className="nav-link" href="/alert">Alerta</a>
                            </li>
                            <li className="nav-item">
                                <i className="bi bi-people-fill Usuario"></i>
                                <div className="dropdown">
                                    <button className="btn Usuario" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Usúarios
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-dark">
                                        <li><a className="dropdown-item active" href="/cadastrar">Cadastrar-se</a></li>
                                        <li><a className="dropdown-item" href="/">Login</a></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/*  Navbar content  */}
            {/* <! fim do header */}

            {/* <!-- começo pagina --> */}
            <div className="conteudo">
                <div className="flex listar">
                    <div className="modal-dialog modal-dialog-centered titulo">
                        <h5>Listar</h5>
                    </div>


                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable botao">
                        <button type="button" className="btn btn-success letras">Cadastrar</button>
                    </div>
                </div>

                {/* <!-- tabelas --> */}

                <table className="table ">
                    <thead>
                        <tr className="table-secondary ">
                            <th scope="col">ID</th>
                            <th scope="col">Nome</th>
                            <th scope="col">E-mail</th>
                            <th scope="col" className="d-none d-sm-table-cell">Coluna 4</th>
                            <th scope="col" className="d-none d-sm-table-cell">Coluna 5 </th>
                            <th scope="col" className="d-none d-sm-table-cell">Coluna 6 </th>
                            <th scope="col">Ações </th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* // <!-- page nation --> */}
                <nav aria-label="Page navigation example paginas">
                    <ul className="pagination  justify-content-center">
                       
                        <li className="page-item"><a className="page-link" onClick={prePage} href="#">Prev</a></li>
                        {
                            numbers.map((n,i) =>{
                                <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                                    <a className="page-link" onClick={()=> changeCPage(n)} href="#">{n}</a>
                                </li>
                            })
                        }
                         <li className="page-item"><a className="page-link"onClick={nextPage} href="#">next</a></li>
                       
                    </ul>
                </nav>
            </div>
        </body>

    )
    function prePage() {
if (currentPage !== firstIndex) {
    setCurrentPage(currentPage - 1)
}
                
    }
    function changeCPage(id) {
                setCurrentPage(id)
    }
    function nextPage() {
        if (currentPage !== lastIndex) {
            setCurrentPage(currentPage + 1)
        }
    }
}

export default Listar