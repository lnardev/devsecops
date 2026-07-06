# 🛡️ Konecta DevSecOps Hub

Plataforma unificada de estudio técnico sobre las políticas, herramientas y procedimientos de DevSecOps de **Konecta Cloud**. Construida como SPA estática con React + TypeScript + Vite.

---

## 📋 Módulos de Contenido

| Módulo | Descripción |
|--------|-------------|
| 📘 **A: DevSecOps Handbook** | Políticas corporativas, Quality Gates, SLAs de remediación y gobernanza global |
| 🚀 **B: Developer Onboarding** | Configuración local del IDE, pre-commit hooks, proxy Artifactory y semantic commits |
| ⚙️ **C: IT Team Onboarding** | Gobernanza cloud, AWS Organizations, SCPs, Golden Images, redes VPC y Disaster Recovery |

---

## 🧩 Funcionalidades

### 1. Presentación (Slider)
Navega por los 8 pasos de cada módulo en formato de slides interactivos.
- Navegación por teclado (`←` / `→`) y gestos táctiles (swipe)
- Índice de saltos rápidos entre pasos
- Destacado de la política mandatoria de cada slide

### 2. Flashcards
24 tarjetas de memorización activa (8 por módulo) con efecto flip 3D.
- Cara frontal: término + pista mnemotécnica
- Cara trasera: definición técnica completa

### 3. Simulador de Pipeline
Simula los tres controles de seguridad de Konecta Cloud:

| Modo | Descripción |
|------|-------------|
| ☁️ **Pipeline Nube** | Simula el CI/CD con vulnerabilidades SAST/SCA, fugas de secretos y errores de IaC |
| 💻 **pre-commit Local** | Emula Husky + Gitleaks en la máquina del desarrollador |
| ⚙️ **Auditoría TI Cloud** | Verifica MFA, puertos SSH expuestos, logs de CloudTrail y regiones aprobadas |

Genera un resultado con estado (`SUCCESS` / `WARNING` / `FAILED` / `BYPASS_ALERT`) y las razones técnicas basadas en las políticas reales de Konecta.

### 4. Cuestionario (Quiz)
15 preguntas de evaluación distribuidas entre los tres módulos.
- Respuesta seleccionable por opción múltiple
- Calificación automática con puntaje final
- Retroalimentación técnica explicada por pregunta

### 5. Cheat Sheets
Resúmenes en formato Markdown listos para copiar al portapapeles.
- **Cheat Sheet A:** Quality Gates, herramientas del pipeline, proceso de excepción
- **Cheat Sheet B:** Comandos de Artifactory, Gitleaks, formato de ramas y commits
- **Cheat Sheet C:** SCPs, hardening de VMs, conectividad de base de datos

---

## 🛠️ Stack Tecnológico

| Herramienta | Versión | Uso |
|-------------|---------|-----|
| React | 19.x | UI y gestión de estado |
| TypeScript | 6.x | Tipado estático |
| Vite | 8.x | Bundler y servidor de desarrollo |
| Tailwind CSS | (vía `@tailwindcss/vite`) | Estilos utilitarios |
| OXLint | 1.x | Linting |
| Babel + React Compiler | 1.x | Optimización de renders |

---

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (hot reload)
npm run dev

# Build de producción
npm run build

# Previsualizar el build (requerido — ver nota abajo)
npm run preview

# Linting
npm run lint
```

> ⚠️ **IMPORTANTE:** No abras el `dist/index.html` directamente con doble clic desde el explorador de archivos. Chrome bloquea ES modules desde el protocolo `file://`. Usa siempre `npm run preview` o un servidor HTTP local para servir los archivos estáticos.

---

## 📁 Estructura del Proyecto

```
devsecops/
├── src/
│   ├── App.tsx          # Componente principal — toda la lógica y UI
│   ├── main.tsx         # Entry point de React
│   ├── index.css        # Estilos globales
│   └── assets/          # Recursos estáticos
├── public/              # Archivos públicos copiados al build
├── index.html           # HTML raíz
├── vite.config.ts       # Configuración de Vite
├── tsconfig.json        # TypeScript (raíz)
├── tsconfig.app.json    # TypeScript (aplicación)
├── tsconfig.node.json   # TypeScript (herramientas Node)
└── package.json
```

---

## ⚙️ Configuración de Vite

```ts
// vite.config.ts
export default defineConfig({
  base: './',   // Rutas relativas — necesario para servir desde subdirectorios o archivos estáticos
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
```

---

## 🔒 Políticas DevSecOps Cubiertas

- **Shift-Left** — integración temprana de seguridad en el SDLC
- **SAST / SCA** — análisis estático de código propio y dependencias de terceros
- **Secret Detection** — detección de credenciales expuestas en repositorios
- **IaC Scanning** — validación de plantillas Terraform/CloudFormation
- **Quality Gates** — umbrales bloqueantes de despliegue por severidad
- **SLAs de Remediación** — Crítica: 24h · Alta: 7d · Media: 30d · Baja: 90d
- **Security Champion** — rol federado de enlace de seguridad por escuadrón
- **Gestión de Excepciones** — flujo formal de riesgo aceptado con fecha de caducidad
- **AWS Organizations / SCPs** — guardarraíles de cuentas cloud
- **Break-Glass Protocol** — acceso administrativo de emergencia supervisado
- **Golden Images** — plantillas de SO endurecidas con CIS Benchmarks
- **Backup & DR** — RTO/RPO y réplicas multirregión cifradas con KMS

---

## 📄 Licencia

Material interno de entrenamiento — © 2026 Konecta Cloud. Todos los derechos reservados.
