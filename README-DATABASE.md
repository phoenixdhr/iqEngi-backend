# Configuración de Base de Datos Local

## Resumen

Este proyecto ahora cuenta con una base de datos MongoDB local clonada desde Railway, lista para desarrollo.

## Información de Conexión

### Base de datos local (Docker)
```
URI: mongodb://root:example@localhost:27017
Host: localhost
Port: 27017
Usuario: root
Password: example
Base de datos: idEngi-DB
```

### Base de datos original (Railway)
```
URI: mongodb://mongo:RNOOkZJeETpDGJWgKgXMpjBRbamtJtnZ@viaduct.proxy.rlwy.net:30779
```

## Uso

### Iniciar MongoDB local
```bash
docker-compose up -d mongo
```

### Detener MongoDB local
```bash
docker-compose down
```

### Ver logs de MongoDB
```bash
docker-compose logs -f mongo
```

## Datos Clonados

La base de datos `idEngi-DB` contiene:
- **71 usuarios**
- **8 cursos**
- 17 colecciones en total

### Colecciones disponibles:
- usuarios
- cursos
- modulos
- unidads
- materials
- cuestionarios
- preguntas
- opcions
- respuestacuestionarios
- respuestapreguntas
- categorias
- comentarios
- calificacions
- cursocomprados
- instructors
- ordens
- perfils

## Re-clonar la Base de Datos

Si necesitas actualizar la base de datos local con los datos más recientes de Railway:

```bash
./clone-database.sh
```

Este script:
1. Exporta todos los datos desde Railway
2. Levanta el contenedor Docker si no está corriendo
3. Restaura los datos en MongoDB local
4. Mantiene todos los índices y metadatos

## Limpieza

Para eliminar los archivos temporales del dump:
```bash
rm -rf ./dump
```

Para eliminar completamente los datos de MongoDB:
```bash
docker-compose down -v
rm -rf ./mongo_data
```

## Notas

- Los datos se persisten en `./mongo_data/` (ignorado por git)
- El script de clonación sobrescribe datos existentes (`--drop` flag)
- Todos los índices y constraints son restaurados automáticamente
