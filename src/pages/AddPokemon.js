import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// !!! AJUSTA ESTA URL a tu entorno local o hosting !!!
const API_URL = 'http://localhost/pokedexes/api/pokemons.php';

const AddPokemon = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '', tipo1: '', tipo2: '', descripcion: '', hp: 100, imagen: null 
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imagen: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imagen) {
            setMessage('Por favor, selecciona una imagen.');
            return;
        }

        setLoading(true);
        setMessage('Guardando Pokémon...');

        const dataToSend = new FormData();
        // Añadir todos los campos de texto
        Object.keys(formData).forEach(key => {
            if (key !== 'imagen') {
                dataToSend.append(key, formData[key]);
            }
        });
        // Añadir el archivo de imagen
        dataToSend.append('imagen', formData.imagen); 

        try {
            // No establecer manualmente Content-Type: dejar que el navegador ponga el boundary
            const res = await axios.post(API_URL, dataToSend);
            const created = res.data?.pokemon;
            if (created) {
                setMessage(`¡Pokémon agregado exitosamente! Redirigiendo...`);
                // navegar y dejar que Home recargue la lista; también guardamos en consola para debugging
                console.log('Pokémon creado desde AddPokemon:', created);
                setTimeout(() => navigate('/'), 800);
            } else {
                setMessage(`Respuesta inesperada del servidor.`);
            }
        } catch (error) {
            setLoading(false);
            setMessage(`Error al agregar: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="container">
            <h2 className="title is-3">Agregar Nuevo Pokémon</h2>
            <form onSubmit={handleSubmit}>
                {/* Campos del Formulario */}
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
                    <div className="control"><input className="input" type="text" name="tipo2" value={formData.tipo2} onChange={handleChange} /></div>
                </div>
                 <div className="field">
                    <label className="label">HP Base</label>
                    <div className="control"><input className="input" type="number" name="hp" value={formData.hp} onChange={handleChange} required /></div>
                </div>
                <div className="field">
                    <label className="label">Descripción</label>
                    <div className="control"><textarea className="textarea" name="descripcion" value={formData.descripcion} onChange={handleChange} required></textarea></div>
                </div>
                
                <div className="field">
                    <label className="label">Imagen (Subir Archivo)</label>
                    <div className="control"><input className="input" type="file" name="imagen" onChange={handleFileChange} accept="image/*" required /></div>
                </div>

                {formData.imagen && (
                    <div className="field mt-3">
                        <label className="label">Vista previa</label>
                        <div className="control">
                            <img src={URL.createObjectURL(formData.imagen)} alt="preview" style={{ maxWidth: 260, borderRadius: 8 }} />
                        </div>
                    </div>
                )}

                <div className="control mt-5">
                    <button type="submit" className={`button is-success ${loading ? 'is-loading' : ''}`} disabled={loading}>Guardar Pokémon</button>
                    <Link to="/" className="button is-light ml-2">Cancelar</Link>
                </div>
            </form>

            {message && <p className={`mt-3 ${message.includes('Error') ? 'has-text-danger' : 'has-text-success'}`}>{message}</p>}
        </div>
    );
};

export default AddPokemon;