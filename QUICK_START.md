# 🚀 Quick Start - Deploy Pokedex

## Resumen Rápido

Tu proyecto está **100% listo**. Solo tienes que:

### 1️⃣ **Base de Datos (5 min)**
- Entra a panel InfinityFree
- Crea BD MySQL (ej: `pokemons_db`)
- Anota credenciales

### 2️⃣ **Subir PHP (5 min)**
- Abre `pokemons.php` (en la carpeta del proyecto)
- Líneas 19-22: **Reemplaza con tus credenciales de BD**
- Sube a InfinityFree en `/public_html/api/pokemons.php`
- Crea carpeta `/public_html/uploads/images/` (permisos 755)

### 3️⃣ **Deploy Frontend (3 min)**
**Opción A: Netlify (Recomendado - Fácil)**
- Ve a netlify.com
- Conecta tu repo GitHub `aldo12medina/pokedexx`
- Listo - auto-despliega cada vez que subes a GitHub

**Opción B: Manual Netlify**
- Corre: `npm run build`
- Arrastra carpeta `/build` a Netlify
- Listo

### 4️⃣ **Prueba**
- Abre tu app en Netlify
- Intenta agregar un Pokémon
- Si funciona → ¡Done! 🎉

---

## 📂 Archivos que modificaste

```
pokemons.php ← EDITA LÍNEAS 19-22 CON TUS CREDENCIALES
DEPLOY_GUIDE.md ← Guía completa si necesitas ayuda
.htaccess ← Para CORS y React Router (opcional si todo está en InfinityFree)
```

---

## ⚙️ Credenciales InfinityFree (Ejemplo)

Cuando crees la BD, verás algo como:
```
Host: localhost (o db12345.hosting.com)
Usuario: root o if_xxxxx
Contraseña: (la que crees)
BD: (nombre que crees)
```

Reemplaza en `pokemons.php` líneas 19-22:
```php
$host = 'localhost';
$db_user = 'root'; ← TU USUARIO
$db_pass = 'xxxx'; ← TU CONTRASEÑA
$database = 'pokemons_db'; ← TU BD
```

---

## 🎯 URLs Finales

- **Frontend**: `https://mipokedex.netlify.app` (o tu URL de Netlify)
- **API**: `https://pokedex12.infinityfreeapp.com/api/pokemons.php` (ya actualizada en código)

---

**¿Listo? Empieza por la BD → Sube PHP → Deploy frontend.**

Si algo falla, pégame el error y lo arreglamos 👍
