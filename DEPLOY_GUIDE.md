# Guía de Deploy - Pokedex a InfinityFree

## 📋 Lo que necesitas

1. **Cuenta en InfinityFree** (https://www.infinityfree.net) — gratis
2. **Acceso FTP** o **File Manager** en el panel de InfinityFree
3. **Los archivos del proyecto** (ya están listos)

---

## 🔧 PASO 1: Configurar Base de Datos en InfinityFree

1. Entra a tu panel de InfinityFree → **Bases de datos MySQL**
2. Crea una nueva BD (ej: `pokemons_db`)
3. Anota los datos:
   - **Host**: `localhost`
   - **Usuario**: `root` (o el que asigne)
   - **Contraseña**: (la que crees)
   - **Base de datos**: `pokemons_db`

---

## 📁 PASO 2: Subir Archivos PHP al Servidor

### Opción A: Usando File Manager (más fácil)

1. Ve a **File Manager** en el panel de InfinityFree
2. Navega a `/public_html/`
3. Crea una carpeta llamada `api` (si no existe)
4. **Edita/reemplaza el archivo `pokemons.php`**:
   - Abre `pokemons.php` en File Manager
   - Reemplaza las líneas 19-22 con tus credenciales de BD:
     ```php
     $host = 'localhost';
     $db_user = 'root'; 
     $db_pass = 'TU_CONTRASEÑA_AQUI';
     $database = 'pokemons_db';
     ```
   - Guarda

5. Crea una carpeta `/public_html/uploads/images/` (para guardar imágenes)
   - Dale permisos de lectura/escritura (775)

### Opción B: Usando FTP

1. Descarga un cliente FTP (Filezilla gratis)
2. Conéctate con los datos FTP de InfinityFree
3. Sube `pokemons.php` a `/public_html/api/`
4. Crea carpeta `/public_html/uploads/images/` con permisos 775

---

## 🌐 PASO 3: Verificar que el API funciona

1. Abre en el navegador:
   ```
   https://tudominio.infinityfreeapp.com/api/pokemons.php
   ```
   Deberías ver: `[]` (array vacío) o un JSON con datos

2. Si ves un error HTML, revisa:
   - ¿Las credenciales de BD son correctas?
   - ¿La carpeta `/api/` existe?
   - ¿Tiene permisos de ejecución (.php)?

---

## 🚀 PASO 4: Deploy del Frontend (React)

### Opción Recomendada: Netlify (Gratis)

1. Ve a https://netlify.com y crea cuenta
2. Conecta tu repositorio GitHub (`pokedexx`)
3. En **Build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `build/`
4. Click en **Deploy** — Listo en segundos

**O manualmente:**
1. Genera build: `npm run build`
2. Comprime la carpeta `/build`
3. En Netlify → **Drag and drop** la carpeta

---

## ✅ VERIFICACIÓN FINAL

1. Abre tu app en Netlify (ej: `https://mipokedex.netlify.app`)
2. Intenta:
   - ✅ Ver la lista de Pokémons
   - ✅ Agregar un Pokémon con imagen
   - ✅ Editar un Pokémon
   - ✅ Eliminar un Pokémon
   - ✅ El carrusel cambia de imagen

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| "Network Error" en la app | Verifica CORS: ¿el API devuelve JSON? |
| Error 404 en API | Revisa ruta: `/api/pokemons.php` existe? |
| Imágenes no suben | Crea `/uploads/images/` con permisos 755+ |
| BD error | Verifica credenciales en `pokemons.php` líneas 19-22 |
| CORS bloqueado | Ya está en el PHP — debe funcionar |

---

## 📝 Archivos que subir

| Archivo | Destino | Notas |
|---------|---------|-------|
| `pokemons.php` | `/public_html/api/` | Edita credenciales BD |
| (todo en `/build/`) | Netlify | O `/public_html/` si lo subes a InfinityFree |

---

**¿Dudas? Pégame el error que ves en consola (DevTools → Console) y lo depuramos.**
