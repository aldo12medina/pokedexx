import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';

// !!! AJUSTA ESTA URL a tu entorno local o hosting !!!
const API_URL = 'https://cors-anywhere.herokuapp.com/https://pokedex12.infinityfreeapp.com/api/pokemons.php';


const Home = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const fetchPokemons = async () => {
        try {
            const response = await axios.get(API_URL, { responseType: 'text', timeout: 8000 });
            try {
                const data = JSON.parse(response.data);
                setPokemons(data || []);
                setError(null);
                if ((data || []).length > 0) setActiveIndex(0);
            } catch (parseErr) {
                console.error('Respuesta no JSON desde la API:', response.data);
                setError('La API respondió con datos inválidos. Revisa la consola o el log del servidor.');
                setPokemons([]);
            }
        } catch (err) {
            console.error('Error al solicitar la API:', err);
            const status = err.response?.status;
            const body = err.response?.data || err.message;
            if (status === 404) {
                setPokemons([]);
                setError(null);
            } else {
                setError(`Error al cargar los Pokémon. Estado: ${status || 'no response'}. Detalle: ${typeof body === 'string' ? body.substring(0,200) : JSON.stringify(body)}`);
            }
            setPokemons([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemons();
    }, []);

    const handleDelete = async (pokemonId) => {
        if (!window.confirm(`¿Estás seguro de eliminar el Pokémon #${pokemonId}? Esta acción es irreversible.`)) return;
        try {
            await axios.delete(`${API_URL}?id=${pokemonId}`);
            setPokemons(prev => prev.filter(p => p.id !== pokemonId));
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Error al eliminar el Pokémon. Revisa el log de la API.');
        }
    };

    if (loading) return <div className="has-text-centered">Cargando Pokédex...</div>;
    if (error) return <div className="notification is-danger">{error}</div>;
    if (pokemons.length === 0) return (
        <div className="has-text-centered">
            <p>No hay Pokémon en la Pokédex.</p>
            <Link to="/add" className="button is-primary is-large mt-4">+ Agregar Primero Pokémon</Link>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <Link to="/add" className="button is-primary">+ Agregar Nuevo Pokémon</Link>
                <button className="button is-light" onClick={() => fetchPokemons()}>Refrescar</button>
            </div>

            {/* Carrusel */}
            <Carousel items={pokemons} interval={3500} onChange={(i) => setActiveIndex(i)} />

            {/* Mostrar tarjeta de información solo para el Pokémon activo del carrusel */}
            {activeIndex !== null && pokemons[activeIndex] && (
                <div className="card active-card" style={{ maxWidth: 860, margin: '18px auto' }}>
                    <div className="card-image">
                        <figure className="image is-4by3">
                            <img src={pokemons[activeIndex].imagen_url} alt={pokemons[activeIndex].nombre} />
                        </figure>
                    </div>
                    <div className="card-content">
                        <p className="title is-4">{pokemons[activeIndex].nombre} - #{pokemons[activeIndex].id}</p>
                        <p className="subtitle is-6">Tipo: {pokemons[activeIndex].tipo1} {pokemons[activeIndex].tipo2 ? ` / ${pokemons[activeIndex].tipo2}` : ''}</p>
                        <p className="is-size-7">{pokemons[activeIndex].descripcion}</p>
                        <div className="buttons mt-3">
                            <Link to={`/edit/${pokemons[activeIndex].id}`} className="button is-info is-small">Editar</Link>
                            <button className="button is-danger is-small" onClick={() => handleDelete(pokemons[activeIndex].id)}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid con todos (opcional) */}
            <div className="pokemon-grid" style={{ marginTop: 12 }}>
                {pokemons.map(pokemon => (
                    <div key={pokemon.id} className="card" style={{ width: '300px' }}>
                        <div className="card-image">
                            <figure className="image is-4by3">
                                <img src={pokemon.imagen_url} alt={pokemon.nombre} style={{ objectFit: 'cover' }} />
                            </figure>
                        </div>
                        <div className="card-content">
                            <p className="title is-4">{pokemon.nombre} - #{pokemon.id}</p>
                            <p className="subtitle is-6">Tipo: {pokemon.tipo1} {pokemon.tipo2 ? ` / ${pokemon.tipo2}` : ''}</p>
                            <p className="is-size-7">{pokemon.descripcion.substring(0, 70)}...</p>
                            <div className="buttons mt-3">
                                <Link to={`/edit/${pokemon.id}`} className="button is-info is-small">Editar</Link>
                                <button className="button is-danger is-small" onClick={() => handleDelete(pokemon.id)}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;