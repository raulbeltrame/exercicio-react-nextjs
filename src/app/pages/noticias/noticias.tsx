"use client"
import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import sweetalert from 'sweetalert2';
import './noticias.css';


const queryClient = new QueryClient();

function Noticias() {
    //Declarações de states
    const [busca, setBusca] = useState('');
    const [currentPage, setcurrentPage] = useState(1);


    const { isLoading, isError, data } = useQuery('noticias', async () => {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v3/noticias/');
        if (!response.ok) {
            sweetalert.fire({
                icon: "error",
                title: "Ocorreu um erro ao tentar excluir",
                showConfirmButton: false,
                timer: 3000
            });
        } 
        console.log(response)
        return response.json();
    });

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (isError) {
        return <div>Ocorreu um erro ao buscar as notícias</div>;
    }

    const jsonNoticias = data.items;

    // Calculo dos índices para exibir os itens da página atual
    const itemsPerPage = 30;
    let indexOfLastItem = currentPage * itemsPerPage;
    let indexOfFirstItem = indexOfLastItem - itemsPerPage;
    let currentItems = jsonNoticias.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(jsonNoticias.length / itemsPerPage);

    const changePage = (newPage:any) => {
      setcurrentPage(newPage);
    };


    return (

        <div className='container-fluid' id="container-noticias">
            <div className='mt-4 mb-4 d-flex justify-content-between' id="div-top-noticias">
                <span id='titulo-pagina'>IBGE News</span>
                <input onChange={(e)=>setBusca(e.target.value)} id='input-localizar' className='ms-auto ps-2' type="text" placeholder="Buscar"/>
            </div>
            <div className='row ms-0 me-a'>
                {jsonNoticias
                    .filter((item: any) => {
                        const searchWords = busca.toLowerCase().split(' ');
                        return searchWords.every((word: any) =>
                            item.titulo.toLowerCase().includes(word)
                        );
                    })
                    .slice(indexOfFirstItem, indexOfLastItem)
                    .map((noticia: any) => {
                        // Formata a URL da imagem
                        const imageUrl = `https://agenciadenoticias.ibge.gov.br/${JSON.parse(
                            noticia.imagens
                        ).image_intro?.replace(/\\/g, '')}`;

                        return (
                            <a key={noticia.id} href={noticia.link} className='card' id='card-noticia'>
                                <img className="img-fluid rounded" id='img-noticia' src={imageUrl} alt="Imagem da notícia" />
                                <span id='h2-noticia'>{noticia.titulo} <small id='pill-data'> {noticia.data_publicacao.split(' ')[0]} </small> </span>
                                <p id='intro-noticia'>{noticia.introducao}</p>
                            </a>
                        );
                })}

            </div>

            <div className="pagination mt-3 d-flex">
                <button className="btn btn-secondary btn-sm ms-auto" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}> Anterior</button>
                    <span className="span-pagina ms-2 me-2">Página {currentPage} / {totalPages}</span>
                <button className="btn btn-secondary btn-sm me-2" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>Próxima</button>
            </div>

        </div>

    );
}

export default function NoticiasPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <Noticias />
        </QueryClientProvider>
    );
}
