import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

// !!! AJUSTA ESTA URL a tu entorno local o hosting !!!
const API_URL = 'https://cors-anywhere.herokuapp.com/https://pokedex12.infinityfreeapp.com/api/pokemons.php';


const EditPokemon = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [formData, setFormData] = useState({
        id: id, nombre: '', tipo1: '', tipo2: '', descripcion: '', hp: 0
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Cargar datos existentes del Pokémon
    useEffect(() => {
        const fetchPokemonData = async () => {
            try {
                // Hacemos un GET a la lista y encontramos el Pokémon por ID
                const response = await axios.get(API_URL);
                const pokemon = response.data.find(p => p.id.toString() === id);

                if (pokemon) {
                    setFormData({ ...pokemon, id: id }); 
                } else {
                    setMessage("Pokémon no encontrado.");
                }
            } catch (error) {
                setMessage(`Error al cargar datos: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchPokemonData();
    }, [id]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('Actualizando datos...');

        try {
            // Envía la petición PUT con los datos de texto (el manejo de la imagen es separado para simplificar)
            await axios.put(API_URL, formData);
            setMessage('¡Pokémon actualizado exitosamente! Redirigiendo...');
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            setLoading(false);
            setMessage(`Error al actualizar: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) return <div>Cargando datos del Pokémon...</div>;

    return (
        <div className="container">
            <h2 className="title is-3">Editar Pokémon #{id} - {formData.nombre}</h2>
            <form onSubmit={handleSubmit}>
                {/* Campos del Formulario (similares a AddPokemon) */}
                <div className="field">
                    <label className="label">Nombre</label>
                    <div className="control"><input className="input" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></div>
                </div>
                <div className="field">
                    <label className="label">Tipo Primario</label>
                    <div className="control"><input className="input" type="text" name="tipo1" value={formData.tipo1} onChange={handleChange} required /></div>
                </div>
                <div className="field">
                    <label className="label">Tipo Secundario</label>
                    <div className="control"><input className="input" type="text" name="tipo2" value={formData.tipo2 || ''} onChange={handleChange} /></div>
                </div>
                 <div className="field">
                    <label className="label">HP Base</label>
                    <div className="control"><input className="input" type="number" name="hp" value={formData.hp} onChange={handleChange} required /></div>
                </div>
                <div className="field">
                    <label className="label">Descripción</label>
                    <div className="control"><textarea className="textarea" name="descripcion" value={formData.descripcion} onChange={handleChange} required></textarea></div>
                </div>
                
                <div className="control mt-5">
                    <button type="submit" className={`button is-info ${loading ? 'is-loading' : ''}`} disabled={loading}>Actualizar Pokémon</button>
                    <Link to="/" className="button is-light ml-2">Cancelar</Link>
                </div>
            </form>
            {message && <p className={`mt-3 ${message.includes('Error') ? 'has-text-danger' : 'has-text-success'}`}>{message}</p>}
        </div>
    );
};

export default EditPokemon;