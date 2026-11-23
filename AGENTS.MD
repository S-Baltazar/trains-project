# AGENTS.MD

## Reglas del Repositorio

1. **Repositorio oficial del proyecto:**
   - URL: https://github.com/S-Baltazar/trains-project
   - El proyecto local debe estar siempre vinculado a este repositorio remoto (`origin`).

2. **Flujo obligatorio ante cualquier modificación:**
   - Cada vez que se realice una modificación en el proyecto (código, configuración, assets, documentación, etc.), se debe:
     1. Verificar los cambios (`git status`).
     2. Agregar los archivos modificados (`git add .`).
     3. Crear un commit descriptivo (`git commit -m "..."`).
     4. Subir los cambios al repositorio remoto (`git push origin <rama>`).

3. **Integridad:**
   - No subir archivos sensibles (`.env`, credenciales) ni carpetas generadas/pesadas excluidas en `.gitignore` (`node_modules`, `dist`, etc.).
