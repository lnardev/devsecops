import { useState, useEffect } from 'react';

// === CONSTANTES DE CONTENIDO DE ESTUDIO ===

// 1. MÓDULO A: HANDBOOK DEVSECOPS (POLÍTICAS GLOBALES)
const SLIDES_HANDBOOK = [
  {
    id: 1,
    title: "Introducción & Cultura Shift-Left",
    subtitle: "La Filosofía DevSecOps en Konecta Cloud",
    icon: (
      <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    concept: "Shift-Left (Desplazar a la Izquierda)",
    description: "Mover la seguridad hacia las fases más tempranas del desarrollo. En lugar de verificar la seguridad justo antes del despliegue o después de un incidente, se integra desde la planeación y el diseño del software.",
    bullets: [
      "Responsabilidad compartida: La seguridad no es exclusiva del equipo de Sec, pertenece a todo el equipo de producto (Dev + Sec + Ops).",
      "Reducción exponencial de costes: Reparar un fallo de seguridad en diseño o desarrollo cuesta hasta 100 veces menos que hacerlo en producción.",
      "Automatización continua: Integración de análisis de seguridad automáticos dentro de los repositorios sin ralentizar el flujo de despliegue."
    ],
    policyHighlight: "Política de Konecta: Todo proyecto de desarrollo iniciado en Konecta Cloud debe definir un modelo de amenazas y un plan de seguridad antes de escribir la primera línea de código."
  },
  {
    id: 2,
    title: "El Ciclo de Vida de Desarrollo Seguro (S-SDLC)",
    subtitle: "Fases y Puertos de Control Obligatorios",
    icon: (
      <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
      </svg>
    ),
    concept: "Integración de Seguridad por Etapa",
    description: "Cada etapa del pipeline de desarrollo cuenta con herramientas de control automatizadas que actúan como compuertas de calidad de código.",
    bullets: [
      "Fase PLAN & CODE: Plugins en IDE (linters) para evitar malas prácticas de código y modelado de riesgos inicial.",
      "Fase BUILD & INTEGRATION: Análisis estático de código (SAST), detección de secretos (Credential Scanning) y análisis de librerías de terceros (SCA).",
      "Fase TEST & RELEASE: Pruebas dinámicas (DAST) y pruebas interactivas (IAST) sobre entornos de pre-producción.",
      "Fase OPERATE & MONITOR: Escaneos continuos sobre infraestructura en nube, análisis de contenedores (Container Scanning) y observabilidad de alertas de intrusión."
    ],
    policyHighlight: "Política de Konecta: Ningún artefacto de software puede ser desplegado a entornos productivos sin haber pasado por el escaneo de seguridad automatizado en la rama de despliegue principal."
  },
  {
    id: 3,
    title: "Análisis Estático (SAST) y Dependencias (SCA)",
    subtitle: "Protegiendo el Código Propio y de Terceros",
    icon: (
      <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    concept: "SAST vs SCA",
    description: "Dos frentes críticos para evitar que código con vulnerabilidades conocidas y fallos lógicos se despliegue en entornos de nube.",
    bullets: [
      "SAST (Static Application Security Testing): Escanea el código fuente propio desarrollado internamente. Busca fallos lógicos, inyecciones de código (SQLi, XSS) y debilidades OWASP Top 10.",
      "SCA (Software Composition Analysis): Inspecciona los paquetes y librerías importadas de terceros (npm, pip, maven, nuget, etc.). Identifica dependencias con vulnerabilidades públicas registradas (CVE) e incompatibilidades de licencia.",
      "Calidad en Acción: Herramientas del pipeline bloquean la compilación si detectan vulnerabilidades no mitigadas o desactualizaciones de librerías críticas."
    ],
    policyHighlight: "Política de Konecta: Se prohíbe el uso de librerías que contengan vulnerabilidades con severidad Crítica o Alta conocidas si existe una versión parcheada disponible en el mercado."
  },
  {
    id: 4,
    title: "Fuga de Secretos en Repositorios (Secret Detection)",
    subtitle: "Evitando el Compromiso de Credenciales y Llaves",
    icon: (
      <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    concept: "Cero Tolerancia a Secretos Hardcodeados",
    description: "La exposición accidental de contraseñas, llaves de API, tokens de nube, llaves privadas SSH o certificados es uno de los mayores vectores de ataque en entornos Cloud.",
    bullets: [
      "Escaneo continuo pre-commit y pre-push: Analizadores automáticos bloquean commits que contengan patrones que asemejen API keys o credenciales.",
      "Gestión de Secretos: Toda credencial o configuración sensible debe almacenarse en bóvedas seguras aprobadas (ej. AWS Secrets Manager, HashiCorp Vault) y consumirse en tiempo de ejecución de manera segura.",
      "Plan de Respuesta: Al detectarse un secreto expuesto, la política exige rotar (invalidar) el secreto de inmediato de manera obligatoria. Eliminar el archivo del historial de Git no es suficiente."
    ],
    policyHighlight: "Política de Konecta: La detección de un secreto o credencial expuesta en un repositorio detiene de manera inmediata el pipeline CI/CD y suspende temporalmente las credenciales del usuario responsable hasta su rotación."
  },
  {
    id: 5,
    title: "Seguridad de Infraestructura y Contenedores (IaC & Containers)",
    subtitle: "Protegiendo el Entorno Cloud de Konecta",
    icon: (
      <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 114 0v2m-4 0h4m-4 0H3m12 0h3M12 3v1m0 16v1m-9-9h1m12 0h1" />
      </svg>
    ),
    concept: "Defensa de la Nube Configurable",
    description: "No solo el código de la aplicación debe ser seguro; la infraestructura que la aloja debe estar debidamente configurada y endurecida (Hardening).",
    bullets: [
      "IaC Scanning (Infraestructura como Código): Análisis estático de código de aprovisionamiento (Terraform, Ansible, CloudFormation). Detecta puertos expuestos (ej. SSH abierto a internet), falta de cifrado de discos o configuraciones de red vulnerables.",
      "Container Image Scanning: Análisis de imágenes de contenedores (Docker) antes de su publicación. Inspecciona parches faltantes en el sistema operativo base del contenedor.",
      "Hardening de Contenedores: Evitar ejecutar contenedores como usuario 'root' y limitar el uso de privilegios innecesarios en clústeres de Kubernetes."
    ],
    policyHighlight: "Política de Konecta: Las plantillas de infraestructura de Terraform deben ser escaneadas de forma automática en cada Pull Request. Configuraciones de riesgo alto bloquearán el aprovisionamiento de recursos."
  },
  {
    id: 6,
    title: "Umbrales de Calidad (Quality Gates) y SLAs de Remediación",
    subtitle: "Tiempos Máximos para Solucionar Vulnerabilidades",
    icon: (
      <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    concept: "Niveles de Severidad y Bloqueos de Despliegue",
    description: "Konecta establece reglas estrictas de cuándo un error bloquea el pase a producción y cuánto tiempo tiene el equipo para solucionar fallos remanentes.",
    bullets: [
      "Severidad CRÍTICA (Bloqueante): Cero vulnerabilidades permitidas en producción. Si se descubren en producción, el SLA de remediación urgente es de máximo 24 horas.",
      "Severidad ALTA (Bloqueante): Cero vulnerabilidades permitidas en producción. SLA de remediación en producción de máximo 7 días.",
      "Severidad MEDIA (Permitida transitoriamente): No bloquea el despliegue de emergencia, pero tiene un SLA de remediación obligatorio de máximo 30 días.",
      "Severidad BAJA (Aceptable bajo monitoreo): No bloquea el pipeline. El SLA de remediación en producción es de hasta 90 días."
    ],
    policyHighlight: "Política de Konecta: El incumplimiento de los SLAs de remediación estipulados resultará en la desactivación del despliegue en entornos productivos hasta que se aplique la remediación correspondiente."
  },
  {
    id: 7,
    title: "Gestión de Excepciones y Riesgo Aceptado",
    subtitle: "Flujo de Aprobación ante Bloqueos Técnicos",
    icon: (
      <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    concept: "Excepciones Formales de Seguridad",
    description: "Si el negocio requiere urgentemente desplegar un producto y existe un fallo bloqueante imposible de parchar de inmediato por motivos técnicos, se debe solicitar una Excepción de Riesgo Aceptado.",
    bullets: [
      "Documentación Exhaustiva: El equipo del proyecto debe redactar una justificación técnica detallando por qué no se puede aplicar la solución en este momento.",
      "Controles Compensatorios: Establecer mecanismos de mitigación alternos (ej. añadir una regla WAF específica, aislar la subred, limitar accesos IP).",
      "Aprobación de Negocio y Ciberseguridad: Firma formal del Product Owner del negocio aceptando el riesgo comercial, y visto bueno definitivo del equipo de Ciberseguridad.",
      "Fecha de Caducidad Estricta: Todas las excepciones se conceden de forma temporal (máximo 30 días). Cumplida la fecha, se bloquea el acceso si no se ha solucionado."
    ],
    policyHighlight: "Política de Konecta: Las excepciones no son permanentes. Al expirar la fecha aprobada, las Quality Gates volverán a bloquear el pipeline de manera automatizada."
  },
  {
    id: 8,
    title: "El Rol del 'Security Champion'",
    subtitle: "El Enlace de Seguridad en los Equipos Ágiles",
    icon: (
      <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    concept: "Embajador de Seguridad en el Escuadrón",
    description: "Para evitar cuellos de botella con un equipo centralizado de seguridad, Konecta adopta el modelo federado de 'Security Champions'.",
    bullets: [
      "Perfil del Champion: Es un miembro activo del equipo de desarrollo, ingeniería de DevOps o QA que se capacita con regularidad en prácticas de ciberseguridad.",
      "Facilitador: Ayuda a sus compañeros en la interpretación de los reportes SAST, SCA, IaC y resolución ágil de alertas de seguridad.",
      "Primer Punto de Contacto: Canaliza de manera expedita las dudas de ciberseguridad hacia el equipo centralizado y gestiona las solicitudes de excepciones de su escuadrón."
    ],
    policyHighlight: "Política de Konecta: Todo escuadrón de desarrollo de software en Konecta Cloud debe designar al menos a un Security Champion certificado como enlace técnico."
  }
];

// 2. MÓDULO B: DEVELOPER ONBOARDING (HERRAMIENTAS Y CÓDIGO)
const SLIDES_ONBOARDING = [
  {
    id: 1,
    title: "1. Identidad, Roles y Solicitud de Accesos",
    subtitle: "Guía de Inicio del Desarrollador (Onboarding)",
    icon: (
      <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    concept: "Principio de Privilegio Mínimo (IAM)",
    description: "Antes de codificar, todo desarrollador debe contar con accesos seguros y controlados mediante credenciales federadas para la consola AWS/Azure, GitLab y SonarQube.",
    bullets: [
      "Autenticación MFA (Multi-Factor): Obligatoria para cada cuenta de acceso corporativa y herramienta técnica.",
      "Privilegios mínimos: Los accesos a las cuentas cloud se otorgan únicamente para el alcance específico de tu escuadrón técnico.",
      "Acceso de invitado/lectura: Durante tu primera semana, tus accesos en producción serán de solo lectura con fines de auditoría previa."
    ],
    policyHighlight: "Regla de Oro: Las llaves estáticas (Access Keys de AWS) nunca deben guardarse localmente sin cifrar ni subirse bajo ninguna circunstancia a los repositorios de Git."
  },
  {
    id: 2,
    title: "2. Configuración del IDE (Hadolint & SonarLint)",
    subtitle: "Trayendo la Seguridad al Editor Local",
    icon: (
      <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    concept: "Plugins obligatorios de análisis local",
    description: "La mejor vulnerabilidad es la que no se escribe. Tu entorno de desarrollo (VS Code / IntelliJ) debe contar con herramientas de retroalimentación inmediata.",
    bullets: [
      "SonarLint Extension: Escanea tu código fuente de manera interactiva mientras escribes, alertando sobre inyecciones de dependencias o variables no seguras.",
      "Hadolint (Dockerfile Linter): Analiza la estructura de tus archivos Dockerfile locales previniendo el uso de comandos inseguros o excesivamente amplios.",
      "Snyk IDE Plugin: Facilita la pre-validación de vulnerabilidades de dependencias directamente antes de realizar el compilado en la terminal."
    ],
    policyHighlight: "Regla de Oro: Todo desarrollador tiene la obligación de resolver todas las advertencias críticas/altas reportadas por SonarLint antes de crear un PR."
  },
  {
    id: 3,
    title: "3. Implementación de Pre-commit Hooks",
    subtitle: "Blindando tu Repositorio Local de Git",
    icon: (
      <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    concept: "Intercepción de commits automáticos con Husky",
    description: "Evita que un descuido envíe credenciales o tokens a GitLab configurando un guardián robótico local que examine tus archivos antes del commit.",
    bullets: [
      "Gitleaks local: Analiza las diferencias del código que estás por confirmar, validando patrones que asemejen llaves privadas SSH, tokens de API o passwords.",
      "Husky Integration: Configura hooks de Git pre-commit que corran análisis estáticos automáticos y pruebas unitarias rápidas de manera obligatoria.",
      "Evitar el Bypass: El Hook detiene el flujo si detecta un secreto. El desarrollador debe removerlo y reiniciar el ciclo para poder continuar."
    ],
    policyHighlight: "Regla de Oro: Está estrictamente prohibido usar el flag '--no-verify' para evadir los controles locales pre-commit definidos en el proyecto."
  },
  {
    id: 4,
    title: "4. Estándar de Ramas & Semantic Commits",
    subtitle: "Gobernanza del Control de Versiones",
    icon: (
      <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    concept: "Git Flow Seguro y Mensajes Auditable",
    description: "El historial de control de cambios debe mantener un formato consistente y trazable de cara a las normativas de auditoría de Konecta Cloud.",
    bullets: [
      "Nomenclatura de ramas: Uso del prefijo de tipo de tarea según corresponda (ej. 'feature/HU-101-auth', 'bugfix/patch-error-log').",
      "Semantic Commits: Mensajes legibles por máquinas y humanos para categorizar el cambio de código (ej. 'feat:', 'fix:', 'test:', 'chore:', 'docs:').",
      "Fusión (PR): Las ramas de producción están completamente bloqueadas para empujes directos. Requieren revisión de pares de manera mandatoria."
    ],
    policyHighlight: "Regla de Oro: Todo pull request (PR) requiere la validación aprobatoria de al menos un revisor técnico calificado y del Security Champion del escuadrón."
  },
  {
    id: 5,
    title: "5. Uso del Proxy Corporativo de Librerías (Artifactory)",
    subtitle: "Seguridad en la Cadena de Suministro de Software",
    icon: (
      <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    concept: "Registro centralizado de artefactos seguros",
    description: "Para mitigar ataques de inyección en librerías de terceros (typosquatting), Konecta Cloud canaliza y bloquea paquetes a través de proxies seguros.",
    bullets: [
      "Conexión a Artifactory: Tu gestor local de librerías (NPM rc, Pip conf, Maven settings) debe apuntar al endpoint privado centralizado de Konecta Cloud.",
      "Análisis en tránsito: Las dependencias que descargas son analizadas dinámicamente por la herramienta SCA en búsqueda de malware y vulnerabilidades críticas.",
      "Bloqueo Preventivo: Las librerías de paquetes huérfanos o comprometidas públicamente se marcan como prohibidas de forma automática."
    ],
    policyHighlight: "Regla de Oro: Queda terminantemente prohibido instalar dependencias de terceros directamente desde repositorios públicos de internet sin pasar por el proxy corporativo."
  },
  {
    id: 6,
    title: "6. Primer Despliegue de Prueba & Reportes CI/CD",
    subtitle: "Puesta en Marcha del Pipeline Completo",
    icon: (
      <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 114 0v2m-4 0h4m-4 0H3m12 0h3M12 3v1m0 16v1m-9-9h1m12 0h1" />
      </svg>
    ),
    concept: "Verificación de las Compuertas de Calidad en la Nube",
    description: "Una vez que haces 'git push' de tu rama de onboarding, se desencadenará de forma automatizada tu primer pipeline de validaciones de nube.",
    bullets: [
      "Trigger automático: El pipeline ejecuta de manera asíncrona análisis estáticos de SAST, SCA, IaC y Secretos en la infraestructura integrada.",
      "Consulta de Dashboard: El desarrollador debe revisar el reporte de SonarQube para entender el estado de su deuda técnica y pruebas de calidad.",
      "Fallas Comunes: Si el pipeline falla, analiza la sección de logs de compilación. No reintentes despliegues sin corregir el error primero."
    ],
    policyHighlight: "Regla de Oro: Ningún pipeline fallido debe ser omitido o bypasseado mediante scripts. Las vulnerabilidades deben resolverse antes de forzar un reintento."
  },
  {
    id: 7,
    title: "7. Gestión de Excepciones y Falsos Positivos",
    subtitle: "Alineando el Contexto de Desarrollo con el Negocio",
    icon: (
      <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    concept: "Declaración e identificación técnica de falsos positivos",
    description: "A veces, las herramientas automáticas de escaneo pueden marcar código correcto como si fuera de alto riesgo. Aprende cómo gestionar estas excepciones.",
    bullets: [
      "Falso positivo: Un bloque de código seguro detectado como anomalía por coincidencia de patrones (ej. un string de pruebas que parece un token).",
      "Documentación: El programador debe redactar una breve justificación en la herramienta de análisis (SonarQube o Snyk) justificando el control técnico.",
      "Aprobación del Champion: El Security Champion del escuadrón validará la justificación técnica antes de autorizar la excepción definitiva."
    ],
    policyHighlight: "Regla de Oro: Se prohíbe el marcado unilateral de vulnerabilidades como 'Falso Positivo' sin la supervisión técnica directa del Security Champion."
  },
  {
    id: 8,
    title: "8. Soporte, Wiki y Comunidad de Ingeniería",
    subtitle: "Tu Red de Apoyo de Ciberseguridad",
    icon: (
      <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    concept: "La comunidad corporativa a tu servicio",
    description: "Nunca estás solo en el camino de la seguridad. Konecta dispone de canales y bases de conocimiento dedicadas para resolver dudas ágilmente.",
    bullets: [
      "Slack / Teams: Canales oficiales '#devsecops-soporte' para asistencia directa con bloqueos de pipeline y configuraciones locales.",
      "DevSecOps Wiki: Documentación técnica exhaustiva de configuración para múltiples lenguajes (Node, Java, Python, .NET).",
      "Sesiones semanales: Talleres formativos y demostraciones prácticas de vulnerabilidades comunes y formas ágiles de remediación."
    ],
    policyHighlight: "Regla de Oro: Se espera de cada nuevo desarrollador la culminación del curso de concientización en desarrollo seguro antes de cerrar sus primeros 30 días."
  }
];

// 3. MÓDULO C: IT TEAM ONBOARDING (INFRAESTRUCTURA Y SISTEMAS)
const SLIDES_IT_ONBOARDING = [
  {
    id: 1,
    title: "1. Gobernanza de Cuentas & AWS Organizations",
    subtitle: "Onboarding para el Equipo de TI (Sistemas)",
    icon: (
      <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    concept: "Service Control Policies (SCPs) y Landing Zones",
    description: "La estructura multicuenta corporativa se rige mediante AWS Organizations, permitiendo aislar de forma segura las cargas de trabajo de desarrollo, pre-producción y producción.",
    bullets: [
      "Estructura de OUs (Organizational Units): Separación lógica estricta para heredar políticas de seguridad automáticas.",
      "Guardarraíles SCP: Políticas raíz que impiden, por ejemplo, que cualquier cuenta desactive el registro de CloudTrail o use regiones no aprobadas de la nube.",
      "AWS Control Tower: Despliegue automatizado de cuentas federadas con configuraciones base de seguridad (Landing Zones)."
    ],
    policyHighlight: "Regla Fundamental: Ninguna cuenta de AWS o recurso cloud puede operar fuera de la estructura auditada de AWS Organizations de Konecta."
  },
  {
    id: 2,
    title: "2. Accesos Privilegiados & Protocolo 'Break-Glass'",
    subtitle: "Gobernanza de Cuentas Administrativas",
    icon: (
      <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    concept: "Acceso Seguro mediante AWS IAM Identity Center (SSO)",
    description: "Los administradores de TI nunca deben acceder con credenciales permanentes o cuentas 'Root'. El acceso se gestiona mediante identidades federadas temporales.",
    bullets: [
      "Federación corporativa: Autenticación única ligada al directorio activo de la empresa con MFA obligatorio (FIDO2 / TOTP).",
      "Break-Glass Protocol: Procedimiento documentado para situaciones excepcionales de caída, otorgando privilegios persistentes durante máximo 4 horas con logs inmediatos al SOC.",
      "Auditoría activa: Monitoreo en tiempo real de actividades inusuales en roles privilegiados o cambios de políticas IAM."
    ],
    policyHighlight: "Regla Fundamental: El uso de las cuentas Root de AWS/Azure está estrictamente prohibido para tareas operativas cotidianas y requiere aprobación del CISO."
  },
  {
    id: 3,
    title: "3. Aprovisionamiento Seguro con Terraform (IaC)",
    subtitle: "Infraestructura Segura como Código",
    icon: (
      <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10l8 4m0-10L4 7m8 4v10M4 7v10l8 4m0-10l8-4m0 10v10l-8 4" />
      </svg>
    ),
    concept: "Gobernanza del Estado de Terraform y Módulos Corporativos",
    description: "Toda infraestructura de Konecta Cloud debe ser reproducible, inmutable y documentada a través de código versionado en GitLab.",
    bullets: [
      "Backend de Estado Cifrado: Almacenamiento remoto seguro de archivos .tfstate en bucket S3 cifrado en reposo y con bloqueo concurrente vía DynamoDB.",
      "Módulos Aprobados: Prohibido redactar recursos en bruto; se deben consumir los módulos certificados del catálogo de infraestructura de Konecta.",
      "Análisis de calidad de IaC: Integración obligatoria de Checkov o KICS en el pipeline para detectar puertos abiertos o discos sin cifrar antes del despliegue."
    ],
    policyHighlight: "Regla Fundamental: Se prohíbe taxativamente realizar modificaciones de recursos de red o cómputo directamente a través de las consolas web de AWS/Azure en producción."
  },
  {
    id: 4,
    title: "4. Seguridad de Redes & Conectividad Perimetral",
    subtitle: "Aislamiento de Recursos e Interconectividad",
    icon: (
      <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V5a2 2 0 00-2-2H4a2 2 0 00-2 2v6c0 4.387 1.221 8.487 3.328 11.965m11.996-4.49a13.916 13.916 0 001.328-11.965V5a2 2 0 00-2-2h-3a2 2 0 00-2 2v6c0 2.923-1.002 5.61-2.673 7.771M12 11a9 9 0 011 5.913" />
      </svg>
    ),
    concept: "Microsegmentación y Golden Routes de Tráfico",
    description: "Las redes virtuales de Konecta Cloud deben mantener perímetros estancos donde el tráfico de entrada y salida esté rigurosamente limitado y registrado.",
    bullets: [
      "Prohibición de IPs Públicas: Bases de datos y microservicios internos deben estar alojados únicamente en subredes privadas aisladas.",
      "Transit Gateway (TGW): Canalización centralizada de redes mediante routers virtuales cifrados con inspección obligatoria en cortafuegos (Firewalls).",
      "Flow Logs: Registro y auditoría obligatoria de todos los metadatos de conexiones IP entrantes y salientes de las interfaces de red de producción."
    ],
    policyHighlight: "Regla Fundamental: Ningún puerto administrativo o base de datos de producción puede exponerse de forma abierta o pública a internet (direccionamiento 0.0.0.0/0)."
  },
  {
    id: 5,
    title: "5. Parches & Hardening (Golden Images)",
    subtitle: "Endurecimiento de Sistemas Operativos",
    icon: (
      <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    concept: "Ciclo de Vida de Imágenes de Cómputo Seguro",
    description: "Los servidores (máquinas virtuales) no deben ser configurados de forma manual o artesanal. Se construyen de forma automatizada con plantillas seguras.",
    bullets: [
      "Golden Images (AMIs/VHDs): Construcción automatizada de plantillas del sistema operativo mediante HashiCorp Packer, aplicando guías de CIS Benchmarks.",
      "AWS Systems Manager Patch Manager: Escaneo periódico y aplicación automatizada de parches de seguridad faltantes en ventanas de mantenimiento aprobadas.",
      "Análisis continuo de vulnerabilidades: Uso de herramientas de evaluación constante en el host como AWS Inspector o Nessus Agents."
    ],
    policyHighlight: "Regla Fundamental: Toda máquina virtual desplegada en Konecta Cloud debe provenir de una de las Golden Images oficiales vigentes y actualizadas mensualmente."
  },
  {
    id: 6,
    title: "6. Centralización de Logs & Observabilidad",
    subtitle: "Monitoreo, Trazabilidad y Análisis Forense",
    icon: (
      <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    concept: "Logs Inmutables para Cumplimiento Normativo",
    description: "Los registros de actividad y logs técnicos son críticos para entender incidentes de seguridad y cumplir con normativas como PCI-DSS o ISO 27001.",
    bullets: [
      "Trazabilidad de Auditoría (CloudTrail): Envío inmediato y sin interrupciones de todas las llamadas API de la infraestructura a un bucket seguro S3 con bloqueo WORM.",
      "SIEM Integration: Canalización en tiempo real de logs de red, sistemas operativos e infraestructura de Kubernetes hacia la plataforma de logs del SOC.",
      "Alertas de Seguridad: Configuración de alarmas de comportamiento sospechoso (múltiples intentos fallidos de login a consolas o creación de recursos anómalos)."
    ],
    policyHighlight: "Regla Fundamental: Está terminantemente prohibido modificar, truncar o eliminar logs de auditoría o eventos de seguridad en cualquier entorno productivo."
  },
  {
    id: 7,
    title: "7. Respaldo (Backup) & Disaster Recovery (DR)",
    subtitle: "Garantizando la Continuidad del Negocio (BCP)",
    icon: (
      <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
    concept: "Cifrado Obligatorio y Réplicas Multirregión",
    description: "Frente a posibles fallas físicas o incidentes graves de seguridad como ataques de ransomware, la estrategia de respaldos es la última línea de defensa.",
    bullets: [
      "Cifrado con Llaves Corporativas: Toda copia de seguridad (backups de discos, bases de datos o archivos S3) debe cifrarse obligatoriamente mediante KMS.",
      "Reglas RTO / RPO: Cada servicio debe estar tipificado según su criticidad de negocio, definiendo su objetivo de tiempo y punto de recuperación.",
      "Drills de Recuperación: Realización de simulacros semestrales obligatorios de restauración total de bases de datos para garantizar la validez de los backups."
    ],
    policyHighlight: "Regla Fundamental: Los backups críticos de producción deben replicarse de manera automatizada a una cuenta de AWS secundaria totalmente aislada (Vault Account)."
  },
  {
    id: 8,
    title: "8. Respuesta a Incidentes de Infraestructura",
    subtitle: "Protocolo de Defensa Activa del SOC",
    icon: (
      <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    concept: "Incident Response en Nube",
    description: "Cuando se reporta una intrusión o comportamiento anómalo en infraestructura, el equipo de TI debe actuar coordinadamente con el SOC corporativo.",
    bullets: [
      "Aislamiento de Instancias: Automatización de aislamiento de cómputo en cuarentena mediante grupos de seguridad bloqueados en red ante incidentes.",
      "Preservación de Evidencias: Creación inmediata de snapshots de memoria RAM y almacenamiento disco para realizar análisis forense posterior.",
      "Remediación de Emergencia: Rutas rápidas de restablecimiento y parches prioritarios para detener ataques activos de exfiltración o intrusiones."
    ],
    policyHighlight: "Regla Fundamental: Todo incidente de seguridad detectado o sospechado en infraestructura debe ser reportado al SOC en un plazo inferior a 15 minutos."
  }
];

// FLASHCARDS MÓDULO A: HANDBOOK DEVSECOPS
const FLASHCARDS_HANDBOOK = [
  {
    term: "Shift-Left",
    definition: "Mover las pruebas de seguridad a la izquierda del SDLC, es decir, integrarlas en la planificación, diseño y fases iniciales de desarrollo para resolver fallos de manera económica.",
    hint: "Filosofía cultural de prevención temprana."
  },
  {
    term: "SAST",
    definition: "Static Application Security Testing. Herramienta de escaneo estático de código fuente sin ejecutar para hallar vulnerabilidades lógicas e inyecciones comunes.",
    hint: "Análisis de código 'desde adentro' y en reposo."
  },
  {
    term: "SCA",
    definition: "Software Composition Analysis. Escaneo automatizado de librerías, dependencias y frameworks de terceros para mapear vulnerabilidades conocidas (CVEs) y revisar licencias.",
    hint: "Gestión de riesgos en paquetes de código abierto."
  },
  {
    term: "Secret Detection",
    definition: "Escaneo estricto que busca contraseñas, tokens de APIs, llaves criptográficas u otros datos confidenciales embebidos accidentalmente en el código del repositorio Git.",
    hint: "Bloqueador absoluto de pipeline ante fugas de credenciales."
  },
  {
    term: "Quality Gates",
    definition: "Compuertas automatizadas en el pipeline CI/CD que evalúan si la calidad y seguridad del software cumplen con los umbrales mínimos obligatorios para permitir avanzar de etapa.",
    hint: "El portero automatizado antes de producción."
  },
  {
    term: "SLA de Remediación",
    definition: "Service Level Agreement. Plazo máximo regulatorio para corregir fallas detectadas según su impacto. En Konecta: Crítica = 24h, Alta = 7 días, Media = 30 días, Baja = 90 días.",
    hint: "Tiempos máximos de reacción ante incidentes."
  },
  {
    term: "Controles Compensatorios",
    definition: "Mecanismos de seguridad alternativos que reducen el riesgo cuando no es viable arreglar una vulnerabilidad directamente en el código fuente de inmediato.",
    hint: "Se requieren para aprobar una Excepción temporal."
  },
  {
    term: "Security Champion",
    definition: "Desarrollador que sirve de puente entre su equipo de ingeniería y el departamento de Ciberseguridad, ayudando a resolver problemas del día a día de forma ágil.",
    hint: "Rol de enlace técnico y cultura de seguridad."
  }
];

// FLASHCARDS MÓDULO B: DEVELOPER ONBOARDING
const FLASHCARDS_ONBOARDING = [
  {
    term: "MFA (Multi-Factor)",
    definition: "Método de autenticación de seguridad de doble capa obligatorio para el acceso a cualquier herramienta de Konecta (GitLab, AWS, SonarQube).",
    hint: "Protección elemental frente al robo de claves."
  },
  {
    term: "Hadolint",
    definition: "Analizador estático de Dockerfiles (linter) que audita que no usemos contenedores como usuario 'root' y que configuremos imágenes base de manera segura.",
    hint: "Herramienta recomendada para auditar tus contenedores locales."
  },
  {
    term: "Husky",
    definition: "Herramienta que ayuda a configurar 'Git hooks' locales en el repositorio para obligar a ejecutar linters o pruebas unitarias antes de confirmar un 'git commit'.",
    hint: "Punto de control inicial antes de enviar tu código a la nube."
  },
  {
    term: "Gitleaks local",
    definition: "Herramienta que analiza el historial de cambios en busca de patrones sensibles (keys, passwords, tokens) en tu terminal antes de que se confirme el commit.",
    hint: "Su misión es evitar la fuga de secretos local."
  },
  {
    term: "Semantic Commits",
    definition: "Estándar de nomenclatura para mensajes de commit que describe semánticamente la intención de tu cambio (ej. 'feat(api): agregar login' o 'fix(db): parchear pool').",
    hint: "Asegura la trazabilidad y auditoría de la base de código."
  },
  {
    term: "Artifactory Proxy",
    definition: "Servidor privado intermedio donde Konecta cachea, analiza y aprueba paquetes y dependencias (npm, pip, maven) de forma segura antes de usarlos.",
    hint: "Previene la inyección de código malicioso de internet."
  },
  {
    term: "SonarLint",
    definition: "Extensión para IDEs (VS Code, IntelliJ) que funciona como corrector ortográfico, detectando fallos de calidad y seguridad mientras digitas tu código localmente.",
    hint: "Tu copiloto silencioso de análisis estático en tiempo real."
  },
  {
    term: "Falso Positivo",
    definition: "Alerta reportada por herramientas automáticas de ciberseguridad que en realidad no representa peligro debido al contexto controlado del código, requiriendo revisión humana.",
    hint: "Exige justificación de desarrollo y aprobación de tu Security Champion."
  }
];

// FLASHCARDS MÓDULO C: IT TEAM ONBOARDING
const FLASHCARDS_IT_ONBOARDING = [
  {
    term: "SCP (Service Control Policy)",
    definition: "Directivas de nivel organizativo para restringir los servicios y acciones máximas permitidas en cuentas miembros administradas por AWS Organizations.",
    hint: "Guardarraíl ineludible en la raíz de la cuenta corporativa."
  },
  {
    term: "Break-Glass Protocol",
    definition: "Protocolo de acceso de emergencia supervisado que otorga de forma justificada credenciales temporales altamente privilegiadas ante crisis de producción.",
    hint: "Uso excepcional con bitácora directa y alerta inmediata al SOC."
  },
  {
    term: "DynamoDB State Lock",
    definition: "Mecanismo que bloquea concurrentemente el estado de Terraform en ejecución, evitando colisiones, colas de commits corruptas y sobrescrituras de código.",
    hint: "Asegura la integridad del archivo .tfstate remoto."
  },
  {
    term: "Golden Route de Red",
    definition: "Diseño perimetral de enrutamiento que asegura que todo el tráfico de datos viaje por túneles VPN o Transit Gateways privados, impidiendo tocar el internet público.",
    hint: "La única ruta autorizada para bases de datos de Konecta Cloud."
  },
  {
    term: "Golden Image",
    definition: "Plantillas preconfiguradas, auditadas y endurecidas de sistema operativo bajo pautas de CIS Benchmarks que garantizan que todo cómputo nace de forma segura.",
    hint: "AMIs / VHDs base obligatorias reconstruidas mensualmente."
  },
  {
    term: "SIEM",
    definition: "Security Information and Event Management. Herramienta centralizada que agrega, correlaciona y analiza eventos técnicos e infraestructura para detectar amenazas.",
    hint: "El cerebro detector de intrusiones operado por el SOC."
  },
  {
    term: "KMS Cifrado",
    definition: "Key Management Service. Servicio administrado de Konecta que cifra mediante llaves criptográficas los backups, buckets S3 y bases de datos corporativas en reposo.",
    hint: "Garantía de cifrado e inmutabilidad de copias."
  },
  {
    term: "RTO / RPO",
    definition: "Métricas de continuidad de negocio: Recovery Time Objective (Tiempo máximo de restablecimiento) y Recovery Point Objective (Pérdida de datos máxima tolerada).",
    hint: "Parámetros obligatorios que dictan la resiliencia técnica de un servicio."
  }
];

// COMPILADO DE CUESTIONARIOS (QUIZ) - 15 PREGUNTAS EN TOTAL
const QUIZ_QUESTIONS_ALL = [
  // --- Preguntas de MÓDULO A: Handbook (1-5) ---
  {
    id: 1,
    question: "El pipeline CI/CD de tu proyecto ha detectado una vulnerabilidad clasificada como 'Crítica' en una biblioteca externa de NPM. El negocio requiere desplegar hoy mismo. ¿Qué acción es la correcta bajo la política del Handbook?",
    options: [
      { text: "Desplegar el software ignorando la alerta y planificar la actualización para el próximo mes de mantenimiento.", isCorrect: false },
      { text: "El pipeline bloquea automáticamente el despliegue. Debes actualizar la dependencia o solicitar una Excepción de Seguridad formal con controles compensatorios y aprobación de Ciberseguridad.", isCorrect: true },
      { text: "Desactivar de forma temporal el escáner de SCA en los scripts del pipeline de Jenkins/GitLab para poder realizar la entrega.", isCorrect: false }
    ],
    explanation: "Las vulnerabilidades Críticas y Altas son estrictamente bloqueantes de producción en Konecta. Si es un despliegue de fuerza mayor que no se puede parchear de inmediato por incompatibilidad, se debe seguir formalmente el flujo de Excepción de Seguridad y nunca bypassear las herramientas de escaneo."
  },
  {
    id: 2,
    question: "Un desarrollador sube un commit a Git que expone un token de API de producción. Al percatarse, realiza un nuevo commit eliminando el token del archivo. ¿Cumple esto con la política de seguridad?",
    options: [
      { text: "Sí, ya que el token ya no se encuentra en la versión final activa del código del repositorio.", isCorrect: false },
      { text: "Sí, siempre y cuando el repositorio sea privado y el acceso esté limitado solo a miembros confiables de Konecta.", isCorrect: false },
      { text: "No. El token sigue existiendo en el historial histórico de commits de Git y podría ser extraído por un atacante. Se requiere invalidar y rotar el token inmediatamente de forma obligatoria.", isCorrect: true }
    ],
    explanation: "En Git, el historial se preserva. Un secreto filtrado se considera comprometido de forma permanente hasta que sea revocado, rotado o reemplazado en el sistema destino, independientemente de que se borre en un commit posterior."
  },
  {
    id: 3,
    question: "Durante un análisis de vulnerabilidades SAST se detectan 4 vulnerabilidades de severidad 'Media' y 3 de severidad 'Baja'. ¿Qué ocurre con tu despliegue?",
    options: [
      { text: "El pipeline aprueba el paso de etapa de forma normal, pero inicia de inmediato el cronómetro de los SLAs de remediación obligatorios: 30 días para Medias y 90 días para Bajas.", isCorrect: true },
      { text: "El pipeline queda bloqueado inmediatamente, ya que no se permite ninguna vulnerabilidad bajo ninguna circunstancia.", isCorrect: false },
      { text: "Las vulnerabilidades medias y bajas se archivan automáticamente como falsos positivos y no requieren de ninguna intervención futura.", isCorrect: false }
    ],
    explanation: "Las vulnerabilidades Medias y Bajas no son bloqueantes inmediatas de producción en Konecta, facilitando la agilidad de los equipos, pero conllevan una obligación regulatoria (SLA) de ser mitigadas en plazos establecidos de 30 y 90 días respectivamente."
  },
  {
    id: 4,
    question: "¿Qué es y qué hace un 'Security Champion' dentro del esquema organizativo del DevSecOps en Konecta Cloud?",
    options: [
      { text: "Es un hacker ético con rango directivo contratado externamente por Konecta para hackear las aplicaciones de forma aleatoria.", isCorrect: false },
      { text: "Es un desarrollador, DevOps o QA del propio equipo, capacitado en seguridad, que promueve buenas prácticas, asiste al equipo en la interpretación de reportes y canaliza excepciones de forma ágil.", isCorrect: true },
      { text: "Es el gerente general del departamento de seguridad informática encargado de sancionar a los desarrolladores que cometen errores.", isCorrect: false }
    ],
    explanation: "El Security Champion es un rol descentralizado dentro del propio equipo ágil, sirviendo de puente para que las políticas de seguridad se adopten sin ralentizar el desarrollo ni generar cuellos de botella burocráticos."
  },
  {
    id: 5,
    question: "Al realizar una auditoría de infraestructura, se detecta que una plantilla de Terraform expone públicamente el puerto de administración de base de datos (puerto 5432 PostgreSQL) a Internet. ¿Qué control detecta esto?",
    options: [
      { text: "La herramienta SCA (Software Composition Analysis) al auditar las licencias de código abierto.", isCorrect: false },
      { text: "El escaneo automatizado de Infraestructura como Código (IaC Scanning) integrado en los Pull Requests.", isCorrect: true },
      { text: "El linteo local de JavaScript en el entorno del editor del desarrollador.", isCorrect: false }
    ],
    explanation: "Las herramientas de IaC Scanning analizan archivos descriptivos de configuración cloud como Terraform, CloudFormation, Ansible o Dockerfiles para buscar configuraciones de red inseguras o privilegios excesivos antes de aprovisionar infraestructura."
  },
  // --- Preguntas de MÓDULO B: Developer Onboarding (6-10) ---
  {
    id: 6,
    question: "Te estás incorporando como desarrollador a un proyecto y necesitas agregar una librería de código abierto externa al package.json/requirements.txt. ¿Cómo debes instalarla bajo la directriz de Onboarding?",
    options: [
      { text: "Descargándola directamente de repositorios públicos o foros de internet sin verificar para optimizar el tiempo.", isCorrect: false },
      { text: "Configurar tus gestores de paquetes para que apunten al proxy privado de Artifactory de Konecta, el cual analiza, cachea y aprueba el componente de forma centralizada.", isCorrect: true },
      { text: "Copiar el código de la librería directamente a tu archivo local para no usar dependencias configurables.", isCorrect: false }
    ],
    explanation: "El uso del proxy corporativo (Artifactory) es mandatorio en Konecta Cloud para proteger la cadena de suministro, analizando las librerías frente a typosquatting, malware e inyecciones maliciosas antes de que ingresen a la infraestructura local del programador."
  },
  {
    id: 7,
    question: "Estás configurando tu entorno de trabajo y el terminal te indica que la ejecución del pre-commit hook (Husky + Gitleaks) bloquea tu confirmación debido a la detección de una cadena sospechosa de ser una clave de API. ¿Qué deberías hacer?",
    options: [
      { text: "Utilizar el flag '--no-verify' para forzar el commit de Git y continuar con el despliegue a producción.", isCorrect: false },
      { text: "Ignorar el pre-commit hook y crear la rama de GitLab usando un terminal alternativo sin git-hooks.", isCorrect: false },
      { text: "Detenerte, extraer el token/clave expuesta del archivo de código, guardarlo en un administrador de configuraciones seguro (.env o AWS Secrets Manager) y repetir el commit de manera limpia.", isCorrect: true }
    ],
    explanation: "El uso de flags de escape como '--no-verify' para bypassear hooks locales está estrictamente prohibido. La única acción correcta es mitigar la alerta abstrayendo el secreto del código fuente del repositorio Git."
  },
  {
    id: 8,
    question: "¿Cuál es la función del plugin 'SonarLint' en el IDE del desarrollador según la guía de Onboarding?",
    options: [
      { text: "Funciona como un corrector de seguridad y calidad en tiempo real, advirtiendo sobre vulnerabilidades críticas y deuda técnica mientras digitas.", isCorrect: true },
      { text: "Sirve para realizar despliegues automáticos directos a la nube con un solo clic omitiendo pruebas unitarias.", isCorrect: false },
      { text: "Es una herramienta de videoconferencia utilizada para agendar revisiones de código de forma remota.", isCorrect: false }
    ],
    explanation: "SonarLint es la primera barrera de Shift-Left en el IDE. Analiza estáticamente el código línea por línea según escribes, ayudando al desarrollador a autocorregirse antes de enviar cambios al repositorio central."
  },
  {
    id: 9,
    question: "Has encontrado una alerta SAST en tu desarrollo local que ha sido clasificada como vulnerabilidad crítica por la herramienta de escaneo, pero tu lógica técnica indica que el contexto de la aplicación impide que esta vulnerabilidad sea explotada bajo ningún escenario real (es un Falso Positivo). ¿Cuál es el proceso formal para proceder?",
    options: [
      { text: "Desmarcar la alerta en el panel de SonarQube como falso positivo y forzar la aprobación del merge.", isCorrect: false },
      { text: "Escribir un comentario de justificación técnica y revisarla conjuntamente con el Security Champion asignado de tu equipo, quien validará y autorizará formalmente la exclusión del escaneo.", isCorrect: true },
      { text: "Cambiar temporalmente el lenguaje del archivo para engañar al motor de escaneo de vulnerabilidades automáticas.", isCorrect: false }
    ],
    explanation: "El Handbook y Onboarding prohíben la desestimación unilateral de vulnerabilidades por parte del programador. Todo falso positivo o riesgo aceptado debe ser sustentado y contar con la validación de un Security Champion certificado del escuadrón."
  },
  {
    id: 10,
    question: "¿Cuál es el estándar obligatorio para estructurar los mensajes de commit de Git al trabajar en los proyectos de Konecta Cloud?",
    options: [
      { text: "No existe estándar, se puede detallar con cualquier descripción corta improvisada.", isCorrect: false },
      { text: "Semantic Commits (mensajes estructurados con prefijos indicando el propósito, ej. 'feat:', 'fix:', 'docs:', 'chore:').", isCorrect: true },
      { text: "Incluir únicamente un número secuencial correlativo de commit sin agregar texto explicativo de cambios.", isCorrect: false }
    ],
    explanation: "Alinear los mensajes usando Semantic Commits permite mantener un historial estructurado y trazable de la base de código. Esto facilita la generación automática de changelogs y apoya las auditorías de cumplimiento (GRC) de la compañía."
  },
  // --- Preguntas de MÓDULO C: IT Team Onboarding (11-15) ---
  {
    id: 11,
    question: "Un administrador de TI necesita realizar un cambio de infraestructura urgente en el entorno productivo un sábado por la tarde. ¿Cuál es el procedimiento conforme bajo el manual de Onboarding de TI?",
    options: [
      { text: "Entrar directamente mediante la cuenta 'Root' para ahorrar tiempo y solucionar el problema de manera ágil.", isCorrect: false },
      { text: "Invocar formalmente el protocolo temporal 'Break-Glass' para obtener credenciales administrativas temporales y con logs monitoreados por el SOC.", isCorrect: true },
      { text: "Compartir la credencial personal con otro compañero del equipo para que realice el cambio de forma conjunta sin bitácora.", isCorrect: false }
    ],
    explanation: "El acceso administrativo cotidiano se realiza mediante identidades federadas temporales. Frente a incidentes graves de caída, el protocolo de 'Break-Glass' es el único mecanismo aprobado que expide credenciales temporales con alerta y supervisión inmediata de bitácora en el SOC."
  },
  {
    id: 12,
    question: "En el flujo de aprovisionamiento de infraestructura mediante Terraform, ¿dónde y de qué forma debe almacenarse y gestionarse el estado de configuración (.tfstate)?",
    options: [
      { text: "De forma local en la máquina del ingeniero que ejecuta los comandos para evitar dependencias de la nube.", isCorrect: false },
      { text: "En un bucket S3 remoto con cifrado obligatorio de KMS y bloqueo de concurrencia activo mediante DynamoDB (State Locking).", isCorrect: true },
      { text: "Enviado al repositorio Git del proyecto en un archivo JSON sin cifrar para asegurar accesibilidad pública de los desarrolladores.", isCorrect: false }
    ],
    explanation: "El estado de Terraform (.tfstate) es altamente sensible y contiene metadatos de configuración claves. La política de Konecta exige su almacenamiento remoto en buckets S3 cifrados y resguardados, controlados por DynamoDB para evitar corrupciones y sobreescrituras en paralelo."
  },
  {
    id: 13,
    question: "Durante un análisis de red de un entorno productivo, se detecta que una base de datos de producción y el puerto SSH de administración (22) están abiertos de forma pública a cualquier origen de internet (0.0.0.0/0). ¿Qué acción debe tomarse?",
    options: [
      { text: "Mantenerlo así ya que permite un soporte ágil desde cualquier parte del mundo sin conectarse a redes secundarias.", isCorrect: false },
      { text: "Es una infracción grave e inaceptable. Se debe eliminar el acceso público de inmediato y canalizar la conectividad administrativa exclusivamente a través de VPN corporativa, Bastion Host o AWS SSM.", isCorrect: true },
      { text: "Cambiar el puerto del SSH a un puerto aleatorio para que los escáneres públicos no puedan ubicarlo fácilmente.", isCorrect: false }
    ],
    explanation: "La política perimetral e infraestructura de Konecta prohíbe la exposición pública directa de bases de datos o servicios de administración. Toda conectividad de TI debe ser segmentada de forma interna utilizando túneles cifrados y controlados."
  },
  {
    id: 14,
    question: "¿Cuál es el propósito central de configurar Service Control Policies (SCPs) en la jerarquía organizativa de las cuentas de Konecta?",
    options: [
      { text: "Cobrar cargos automáticos a las subcuentas según el tráfico y volumen de datos transferidos.", isCorrect: false },
      { text: "Establecer barreras y controles máximos ineludibles que definen qué servicios y regiones están permitidos en cada cuenta de la nube, limitando acciones incluso a administradores locales.", isCorrect: true },
      { text: "Servir como corrector ortográfico de las plantillas Terraform escritas por los desarrolladores.", isCorrect: false }
    ],
    explanation: "Las SCPs son guardarraíles administrados centralmente. Actúan como el control de cumplimiento supremo de la nube, asegurando que ninguna subcuenta, ni siquiera sus perfiles locales de administrador, pueda desviarse de estándares como desactivar CloudTrail o aprovisionar servicios prohibidos."
  },
  {
    id: 15,
    question: "La estrategia BCP de Konecta Cloud requiere que un servicio crítico cuente con un RTO de 2 horas y un RPO de 15 minutos. ¿Cómo se interpreta técnicamente esto?",
    options: [
      { text: "El sistema puede estar caído hasta 15 minutos y se toleran hasta 2 horas de pérdida de datos.", isCorrect: false },
      { text: "El equipo tiene máximo 2 horas para restaurar el servicio tras un desastre, y la pérdida de datos en la restauración no debe superar las transacciones de los últimos 15 minutos.", isCorrect: true },
      { text: "El sistema debe respaldarse de forma manual cada 2 horas por un operador asignado y revisarse en 15 minutos de forma asíncrona.", isCorrect: false }
    ],
    explanation: "RTO (Recovery Time Objective) es el tiempo objetivo máximo permitido para recuperar la operatividad (2h). RPO (Recovery Point Objective) define la brecha máxima permisible de pérdida de información histórica ante un siniestro (15 min), exigiendo respaldos continuos o replicación activa."
  }
];

// CHEAT SHEETS EN MARKDOWN
const CHEAT_SHEET_HANDBOOK_MD = `## POLÍTICAS DEVSECOPS - KONECTA CLOUD (Handbook)

### 1. COMPUERTAS DE CALIDAD (QUALITY GATES)
* **Vulnerabilidades Críticas:** Bloqueante. SLA Remediación: 24h.
* **Vulnerabilidades Altas:** Bloqueante. SLA Remediación: 7 días.
* **Vulnerabilidades Medias:** Despliegue permitido. SLA Remediación: 30 días.
* **Vulnerabilidades Bajas:** Despliegue permitido. SLA Remediación: 90 días.
* **Detección de Secretos:** Bloqueo Inmediato. Requiere Rotación Obligatoria de Credencial.

### 2. HERRAMIENTAS REQUERIDAS EN EL PIPELINE
* **SAST:** SonarQube / Checkmarx (Análisis del código de la casa).
* **SCA:** Snyk / Trivy (Análisis de dependencias open source).
* **Secretos:** Gitleaks / Trufflehog (Evitar llaves expuestas).
* **IaC Scan:** Checkov / KICS (Análisis de plantillas Terraform/K8s).

### 3. PROCESO DE EXCEPCIÓN
1. Documentar caso técnico detallado.
2. Definir Controles Compensatorios (Reglas WAF, Firewall, etc.).
3. Obtener aprobación de Ciberseguridad y el Product Owner.
4. Expiración estricta de máximo 30 días.`;

const CHEAT_SHEET_ONBOARDING_MD = `## GUÍA DE ONBOARDING - COMANDOS Y PASOS RÁPIDOS (Developer)

### 1. CONFIGURACIÓN DEL PROXY CORPORATIVO (Artifactory)
* **NPM (Node.js):** Configura tu archivo privado local \`.npmrc\` para descargar de forma segura:
  \`\`\`bash
  registry=https://artifactory.konecta.cloud/api/npm/npm-group/
  always-auth=true
  \`\`\`
* **Pip (Python):** En tu archivo \`pip.conf\` o \`pip.ini\`:
  \`\`\`ini
  [global]
  index-url = https://artifactory.konecta.cloud/api/pip/pip-group/simple
  \`\`\`

### 2. INSTALACIÓN DE GITLEAKS LOCAL (Prevenir Fuga de Secretos)
Evita multas corporativas por credenciales expuestas en la terminal:
\`\`\`bash
# MacOS (Homebrew)
brew install gitleaks

# Windows (Scoop)
scoop install gitleaks

# Activar en Husky
npx husky add .husky/pre-commit "gitleaks protect --verbose --staged"
\`\`\`

### 3. FORMATO DE RAMAS Y COMMITS (Semantic)
* **Ramas:** \`feature/HU-<ID>-<breve-descripcion>\` | \`bugfix/<incidente>-descripcion\`
* **Commits:**
  * \`feat(auth): implementar inicio de sesion con MFA\`
  * \`fix(db): solucionar fuga de conexion en pool PostgreSQL\`
  * \`docs(readme): actualizar guia de configuracion de Artifactory\``;

const CHEAT_SHEET_IT_ONBOARDING_MD = `## GUÍA DE OPERACIONES CLOUD Y TI - KONECTA CLOUD (IT Onboarding)

### 1. GUARDARRAÍLES CONCENTRADOS (SCPs)
* **Regiones Permitidas:** Únicamente desplegar recursos en regiones cloud explícitamente autorizadas (ej. \`us-east-1\` / \`eu-west-1\`).
* **Seguridad Obligatoria:** Bloqueada la desactivación de CloudTrail, AWS Config y las herramientas de monitoreo de seguridad.
* **Cuentas Root:** Completamente restringida la ejecución de API llamadas o accesos productivos directos con cuentas root.

### 2. GESTIÓN DE SEGURIDAD EN MAQUINAS VIRTUALES (Hardening)
* **Imágenes Base:** Obligatorio consumir únicamente AMIs / VHDs procedentes del repositorio privado de "Golden Images" de Konecta.
* **Escaneo de Agente:** Toda instancia EC2/VM debe albergar de manera permanente el agente de escaneo de vulnerabilidades y telemetría de monitoreo activo.
* **Mantenimiento:** Parcheo automatizado mensual gestionado de forma unificada mediante AWS Systems Manager (SSM) Patch Manager.

### 3. PROTOCOLO DE CONECTIVIDAD DE BASE DE DATOS
* **Subredes Privadas:** Ninguna base de datos relacional (ej. RDS PostgreSQL, Oracle) o NoSQL puede portar interfaces direccionables públicamente.
* **Conexión Privada:** La transferencia interna de datos corporativos e interconexion multicuenta debe fluir únicamente a través de enlaces cifrados de tránsito (Transit Gateway) o VPC Peerings privados.`;

// === COMPONENTE PRINCIPAL APP ===
export default function App() {
  const [currentTab, setCurrentTab] = useState('slider');

  // Gestión de Modulos: 'handbook', 'onboarding' o 'it-onboarding'
  const [currentModule, setCurrentModule] = useState('handbook');

  const [slideIndex, setSlideIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState(Array(24).fill(false));
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [copiedOnboardingStatus, setCopiedOnboardingStatus] = useState(false);
  const [copiedITStatus, setCopiedITStatus] = useState(false);

  // Soporte para Modo Claro (Light Mode) / Modo Oscuro
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Estados del Simulador de Pipeline
  const [simMode, setSimMode] = useState('cloud'); // 'cloud' (CI/CD Nube), 'local' (Pre-commit Local) o 'ops' (Auditoría TI Cloud)
  const [simCrit, setSimCrit] = useState(0);
  const [simHigh, setSimHigh] = useState(0);
  const [simMed, setSimMed] = useState(0);
  const [simSecrets, setSimSecrets] = useState(false);
  const [simIacIssues, setSimIacIssues] = useState(false);

  // Variables específicas del Simulador Pre-commit (Local)
  const [simLocalSecrets, setSimLocalSecrets] = useState(false);
  const [simLocalSonarLintWarning, setSimLocalSonarLintWarning] = useState(false);
  const [simLocalBypass, setSimLocalBypass] = useState(false);

  // Variables específicas del Simulador de Auditoría TI (Ops)
  const [simOpsMfaOff, setSimOpsMfaOff] = useState(false);
  const [simOpsSshPublic, setSimOpsSshPublic] = useState(false);
  const [simOpsLogsOff, setSimOpsLogsOff] = useState(false);
  const [simOpsNonApprovedRegion, setSimOpsNonApprovedRegion] = useState(false);

  const [simState, setSimState] = useState('idle'); // idle | running | finished
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simProgress, setSimProgress] = useState(0);

  // Estados del Cuestionario (Quiz)
  const [quizAnswers, setQuizAnswers] = useState<any>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Soporte para gestos táctiles (Swipe) en Slider
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const slides =
    currentModule === 'handbook' ? SLIDES_HANDBOOK :
      currentModule === 'onboarding' ? SLIDES_ONBOARDING :
        SLIDES_IT_ONBOARDING;

  const flashcards =
    currentModule === 'handbook' ? FLASHCARDS_HANDBOOK :
      currentModule === 'onboarding' ? FLASHCARDS_ONBOARDING :
        FLASHCARDS_IT_ONBOARDING;

  // Resetear índice de slide al cambiar de módulo
  const handleModuleChange = (module:string) => {
    setCurrentModule(module);
    setSlideIndex(0);
  };

  const handleTouchStart = (e:any) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: any) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Navegación del Slider
  const nextSlide = () => {
    setSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Teclado para Slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentTab !== 'slider') return;
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideIndex, currentTab, currentModule]);

  // Rotar tarjeta de memoria
  const toggleCard = (index:number) => {
    const newFlipped = [...flippedCards];
    newFlipped[index] = !newFlipped[index];
    setFlippedCards(newFlipped);
  };

  // Copiadores de textos al portapapeles
  const handleCopyCheatSheet = () => {
    const textArea = document.createElement("textarea");
    textArea.value = CHEAT_SHEET_HANDBOOK_MD;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 3000);
    } catch (err) {
      console.error("Fallo al copiar", err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopyOnboardingCheatSheet = () => {
    const textArea = document.createElement("textarea");
    textArea.value = CHEAT_SHEET_ONBOARDING_MD;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedOnboardingStatus(true);
      setTimeout(() => setCopiedOnboardingStatus(false), 3000);
    } catch (err) {
      console.error("Fallo al copiar", err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopyITCheatSheet = () => {
    const textArea = document.createElement("textarea");
    textArea.value = CHEAT_SHEET_IT_ONBOARDING_MD;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedITStatus(true);
      setTimeout(() => setCopiedITStatus(false), 3000);
    } catch (err) {
      console.error("Fallo al copiar", err);
    }
    document.body.removeChild(textArea);
  };

  // Ejecución de simulación según el modo seleccionado
  const runSimulation = () => {
    setSimState('running');
    setSimProgress(0);
    setSimLogs([]);

    if (simMode === 'cloud') {
      const steps = [
        { text: "🚀 Iniciando Pipeline CI/CD Seguro en Entorno de Pruebas...", delay: 500, pct: 10 },
        { text: "📥 [Fase Build] Descargando dependencias de Node.js y compilando artefacto...", delay: 1000, pct: 25 },
        { text: "🔒 [Fase Secretos] Escaneando commits en búsqueda de credenciales expuestas...", delay: 1800, pct: 45 },
        { text: "🔍 [Fase SAST] Corriendo análisis estático de código mediante SonarQube...", delay: 2600, pct: 65 },
        { text: "📦 [Fase SCA] Verificando catálogo de dependencias e indexación de CVEs de terceros...", delay: 3400, pct: 80 },
        { text: "🌐 [Fase IaC Scan] Validando cumplimiento de plantillas Terraform con políticas Cloud...", delay: 4100, pct: 95 },
        { text: "📊 Compilando reporte final de calidad e integridad del despliegue...", delay: 4800, pct: 100 }
      ];

      steps.forEach((step) => {
        setTimeout(() => {
          setSimLogs((prev) => [...prev, step.text]);
          setSimProgress(step.pct);
        }, step.delay);
      });

      setTimeout(() => {
        setSimState('finished');
      }, 5200);

    } else if (simMode === 'local') {
      // Simulación de Consola Pre-commit local
      const steps = [
        { text: "💻 Ejecutando: git commit -m 'feat(auth): agregar autenticacion mfa'", delay: 400, pct: 15 },
        { text: "📦 Activando pre-commit hooks locales de Husky...", delay: 900, pct: 30 },
        { text: "🛡️ [Gitleaks Local] Escaneando código modificado en búsqueda de secretos...", delay: 1600, pct: 55 },
        { text: "🔍 [SonarLint Linter] Evaluando reglas estáticas sobre archivos modificados...", delay: 2400, pct: 75 },
        { text: "⏳ Evaluando políticas corporativas del Onboarding de Konecta...", delay: 3200, pct: 100 }
      ];

      steps.forEach((step) => {
        setTimeout(() => {
          setSimLogs((prev) => [...prev, step.text]);
          setSimProgress(step.pct);
        }, step.delay);
      });

      setTimeout(() => {
        setSimState('finished');
      }, 3600);
    } else {
      // MODO 'ops': Simulación de Auditoría de Cuentas Cloud e Infraestructura
      const steps = [
        { text: "🔍 [AWS Config] Iniciando escaneo de cumplimiento en la cuenta de producción...", delay: 500, pct: 15 },
        { text: "🔒 [IAM Audit] Auditando configuración de MFA en usuarios administradores...", delay: 1100, pct: 35 },
        { text: "🌐 [Security Groups] Evaluando exposición de puertos de administración SSH/RDP/PostgreSQL...", delay: 1800, pct: 60 },
        { text: "🛡️ [Governance] Verificando inmutabilidad de logs en CloudTrail y auditoría activa...", delay: 2600, pct: 80 },
        { text: "🛰️ [Landing Zone] Validando regiones de Terraform aprovisionadas y guardarraíles SCP...", delay: 3300, pct: 100 }
      ];

      steps.forEach((step) => {
        setTimeout(() => {
          setSimLogs((prev) => [...prev, step.text]);
          setSimProgress(step.pct);
        }, step.delay);
      });

      setTimeout(() => {
        setSimState('finished');
      }, 3800);
    }
  };

  // Reiniciar simulador
  const resetSimulator = () => {
    setSimCrit(0);
    setSimHigh(0);
    setSimMed(0);
    setSimSecrets(false);
    setSimIacIssues(false);
    setSimLocalSecrets(false);
    setSimLocalSonarLintWarning(false);
    setSimLocalBypass(false);
    setSimOpsMfaOff(false);
    setSimOpsSshPublic(false);
    setSimOpsLogsOff(false);
    setSimOpsNonApprovedRegion(false);
    setSimState('idle');
    setSimLogs([]);
    setSimProgress(0);
  };

  // Evaluar aprobación en base a políticas
  const evaluatePipelineApproval = () => {
    if (simMode === 'cloud') {
      const hasBlocker = simCrit > 0 || simHigh > 0 || simSecrets || simIacIssues;
      const warningsOnly = simMed > 0;

      if (hasBlocker) {
        return {
          status: "FAILED",
          color: isDarkMode ? "text-rose-400 border-rose-800 bg-rose-950/20" : "text-rose-800 border-rose-200 bg-rose-50",
          summary: "❌ PIPELINE RECHAZADO (Quality Gates fallaron)",
          reasons: [
            simCrit > 0 ? `Se detectaron ${simCrit} vulnerabilidades CRÍTICAS. Deben ser solucionadas en menos de 24h para permitir despliegue.` : null,
            simHigh > 0 ? `Se detectaron ${simHigh} vulnerabilidades ALTAS. Deben remediarse en menos de 7 días antes de enviar a producción.` : null,
            simSecrets ? "¡URGENTE! Se detectaron secretos o claves de API expuestas en el repositorio. Se requiere invalidar y rotar las credenciales inmediatamente." : null,
            simIacIssues ? "Se encontraron fallas de red severas en la configuración de la infraestructura (IaC Scanning bloqueante)." : null
          ].filter(Boolean)
        };
      } else if (warningsOnly) {
        return {
          status: "WARNING",
          color: isDarkMode ? "text-amber-400 border-amber-800 bg-amber-950/20" : "text-amber-800 border-amber-200 bg-amber-50/70",
          summary: "⚠️ DESPLIEGUE APROBADO CON ADVERTENCIA (SLA Activo)",
          reasons: [
            `El despliegue fue exitoso pero contiene ${simMed} vulnerabilidades MEDIAS. Tienes un SLA estricto de un máximo de 30 días para resolverlas.`
          ]
        };
      } else {
        return {
          status: "SUCCESS",
          color: isDarkMode ? "text-emerald-400 border-emerald-800 bg-emerald-950/20" : "text-emerald-800 border-emerald-200 bg-emerald-50",
          summary: "✅ DESPLIEGUE SEGURO AUTORIZADO",
          reasons: [
            "Cumplimiento perfecto de todas las políticas del DevSecOps Handbook de Konecta. ¡Excelente trabajo!"
          ]
        };
      }
    } else if (simMode === 'local') {
      // Resultados de terminal local pre-commit
      const hasBlocker = (simLocalSecrets || simLocalSonarLintWarning) && !simLocalBypass;
      const bypassDetected = simLocalBypass && (simLocalSecrets || simLocalSonarLintWarning);

      if (bypassDetected) {
        return {
          status: "BYPASS_ALERT",
          color: "text-rose-400 border-rose-800 bg-rose-950/30",
          summary: "🚨 ALERTA DE INCUMPLIMIENTO DE SEGURIDAD",
          reasons: [
            "El commit se completó mediante el flag '--no-verify' evadiendo las políticas locales de Onboarding.",
            "¡PELIGRO! Se subirá código con secretos o fallas estáticas críticas a GitLab sin auditar.",
            "La elusión de controles locales se audita en GitLab y suspende la integridad de tus credenciales corporativas de forma temporal."
          ]
        };
      } else if (hasBlocker) {
        return {
          status: "FAILED",
          color: "text-rose-600 border-rose-300 bg-rose-50",
          summary: "🚫 COMMIT BLOQUEADO EN TU MÁQUINA LOCAL",
          reasons: [
            simLocalSecrets ? "Gitleaks interceptó un patrón coincidente con Token expuesto de API. Operación cancelada." : null,
            simLocalSonarLintWarning ? "SonarLint detectó vulnerabilidades de código estático (SAST) locales no remediadas." : null,
            "Husky ha detenido el commit de Git de manera automática para prevenir incidentes en la nube."
          ].filter(Boolean)
        };
      } else {
        return {
          status: "SUCCESS",
          color: "text-emerald-700 border-emerald-200 bg-emerald-50",
          summary: "🎉 COMMIT DE GIT COMPLETADO CON ÉXITO",
          reasons: [
            "Análisis estático limpio en tu máquina local. Tu commit fue creado de manera conforme y está listo para ser subido al pipeline."
          ]
        };
      }
    } else {
      // Resultados de auditoría de TI (MÓDULO C - Ops)
      const isCompliant = !simOpsMfaOff && !simOpsSshPublic && !simOpsLogsOff && !simOpsNonApprovedRegion;

      if (isCompliant) {
        return {
          status: "SUCCESS",
          color: "text-emerald-700 border-emerald-200 bg-emerald-50",
          summary: "✅ AUDITORÍA DE INFRAESTRUCTURA CUMPLIDA",
          reasons: [
            "Todas las cuentas de producción auditadas se encuentran bajo total cumplimiento.",
            "MFA activo en todas las cuentas privileged, logs de CloudTrail inmutables habilitados, y sin puertos expuestos directamente a internet."
          ]
        };
      } else {
        return {
          status: "FAILED",
          color: "text-rose-600 border-rose-300 bg-rose-50",
          summary: "❌ ERROR DE CUMPLIMIENTO EN LA NUBE DE PRODUCCIÓN",
          reasons: [
            simOpsMfaOff ? "Peligro: Cuentas privilegiadas con rol administrativo sin MFA configurado. Violación extrema de seguridad." : null,
            simOpsSshPublic ? "Peligro: Puerto SSH (22) expuesto abiertamente a internet (0.0.0.0/0). Amenaza crítica de intrusión perimetral." : null,
            simOpsLogsOff ? "Peligro: Logs de auditoría CloudTrail o registros de flujo VPC inactivos en producción. Falta de trazabilidad forense." : null,
            simOpsNonApprovedRegion ? "Alerta: Intento de aprovisionamiento de cómputo/redes de Terraform en regiones geográficas no permitidas por SCPs." : null
          ].filter(Boolean)
        };
      }
    }
  };

  const simulationResult = simState === 'finished' ? evaluatePipelineApproval() : null;

  // Manejo del Quiz
  const handleSelectQuizOption = (qId:any, oIdx:any) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev:any) => ({ ...prev, [qId]: oIdx }));
  }; 

  const submitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS_ALL.forEach((q) => {
      const selectedOptIdx = quizAnswers[q.id];
      if (selectedOptIdx !== undefined && q.options[selectedOptIdx].isCorrect) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>

      {/* HEADER DE LA COMPAÑÍA */}
      <header className={`border-b sticky top-0 z-40 px-4 py-4 md:px-8 backdrop-blur transition-all duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white/80 shadow-sm'
        }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-white via-slate-200 to-slate-400' : 'from-slate-950 via-slate-800 to-slate-700'
                }`}>
                Konecta DevSecOps Hub
              </h1>
              <p className="text-xs text-indigo-500 font-medium tracking-wider uppercase">Plataforma Unificada de Estudio Técnico</p>
            </div>
          </div>

          {/* NAVEGACIÓN PRINCIPAL Y CONTROLES */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <nav className={`flex flex-wrap gap-1 p-1 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
              {[
                { id: 'slider', label: 'Presentación' },
                { id: 'flashcards', label: 'Flashcards' },
                { id: 'simulator', label: 'Simulador' },
                { id: 'quiz', label: 'Cuestionario (Quiz)' },
                { id: 'cheatsheet', label: 'Cheat Sheets' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-3 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${currentTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : isDarkMode
                        ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* BOTÓN MODO LIGHT / OSCURO */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${isDarkMode
                  ? 'border-slate-800 bg-slate-950 text-amber-400 hover:bg-slate-900'
                  : 'border-slate-200 bg-white text-indigo-600 hover:bg-slate-100 shadow-sm'
                }`}
              title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              aria-label="Alternar modo de color"
            >
              {isDarkMode ? (
                // Sol
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) : (
                // Luna
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      <title>Konecta Plataforma Unificada de Estudio Técnico</title>

      {/* CUERPO CENTRAL */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-4 py-6 md:px-8">

        {/* NAVEGACIÓN DE MÓDULO (Handbook vs Developer Onboarding vs IT Team Onboarding) */}
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Módulos del Centro de Conocimiento</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <button
                onClick={() => handleModuleChange('handbook')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${currentModule === 'handbook'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                📘 Módulo A: DevSecOps Handbook
              </button>
              <button
                onClick={() => handleModuleChange('onboarding')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${currentModule === 'onboarding'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                🚀 Módulo B: Developer Onboarding
              </button>
              <button
                onClick={() => handleModuleChange('it-onboarding')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${currentModule === 'it-onboarding'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                ⚙️ Módulo C: IT Team Onboarding
              </button>
            </div>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} italic max-w-md`}>
            {currentModule === 'handbook' && 'Políticas corporativas de calidad, SLAs de remediación y gobernanza global.'}
            {currentModule === 'onboarding' && 'Espacio de trabajo local, linters en IDE, pre-commits y proxy de paquetes.'}
            {currentModule === 'it-onboarding' && 'Gobernanza cloud, redes VPC, Golden Images, SCPs, inmutabilidad y DR.'}
          </p>
        </div>

        {/* CONTENIDO DE PESTAÑAS */}

        {/* TAB 1: SLIDER DE PRESENTACIÓN */}
        {currentTab === 'slider' && (
          <div className="space-y-6">
            {/* Tarjeta contenedora del slider */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`border rounded-3xl p-6 md:p-8 relative min-h-[460px] flex flex-col justify-between shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                }`}
            >
              {/* Indicador de progreso superior */}
              <div className={`flex justify-between items-center pb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'
                }`}>
                <span className={`text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-655'
                  }`}>
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {currentModule === 'handbook' && 'MÓDULO A: MANUAL DEVSECOPS'}
                  {currentModule === 'onboarding' && 'MÓDULO B: DEVELOPER ONBOARDING'}
                  {currentModule === 'it-onboarding' && 'MÓDULO C: IT TEAM ONBOARDING'} - Paso {slides[slideIndex].id} de {slides.length}
                </span>
                <div className="flex gap-1">
                  {slides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => setSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === slideIndex
                          ? 'w-8 bg-indigo-500'
                          : isDarkMode
                            ? 'w-2 bg-slate-700 hover:bg-slate-600'
                            : 'w-2 bg-slate-200 hover:bg-slate-300'
                        }`}
                      aria-label={`Ir al paso ${slide.id}`}
                    />
                  ))}
                </div>
              </div>

              {/* Contenido dinámico del slide */}
              <div className="my-6 md:my-8 flex flex-col lg:flex-row gap-6 items-start">
                <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                  <div className={`p-4 rounded-2xl border shadow-inner ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                    {slides[slideIndex].icon}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                      {slides[slideIndex].title}
                    </h3>
                    <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                      }`}>
                      {slides[slideIndex].subtitle}
                    </p>
                  </div>
                </div>

                <div className="lg:w-2/3 space-y-4">
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
                    }`}>
                    <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                      Concepto Clave
                    </span>
                    <h4 className={`text-lg font-bold mt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                      {slides[slideIndex].concept}
                    </h4>
                    <p className={`text-sm mt-2 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                      {slides[slideIndex].description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                      Pautas y Acciones Técnicas
                    </span>
                    <ul className="grid grid-cols-1 gap-2">
                      {slides[slideIndex].bullets.map((bullet, i) => (
                        <li key={i} className={`flex gap-2 text-xs md:text-sm p-2.5 rounded-lg border ${isDarkMode
                            ? 'text-slate-400 bg-slate-950/30 border-slate-800/50'
                            : 'text-slate-700 bg-slate-50 border-slate-150'
                          }`}>
                          <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Caja de política obligatoria destacada */}
              <div className={`border p-4 rounded-2xl text-xs md:text-sm flex gap-3 items-center ${isDarkMode
                  ? 'from-indigo-950/40 to-slate-900 border-indigo-900/50 text-slate-300 bg-gradient-to-r'
                  : 'from-indigo-50/50 to-slate-50 border-indigo-100 text-slate-800 bg-gradient-to-r'
                }`}>
                <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-100 text-indigo-750'
                  }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <span className={`font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>REGLA MANDATORIA:</span> {slides[slideIndex].policyHighlight}
                </div>
              </div>

              {/* Botones de Control de Navegación */}
              <div className={`flex justify-between items-center pt-6 mt-6 border-t gap-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'
                }`}>
                <button
                  onClick={prevSlide}
                  disabled={slideIndex === 0}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 select-none transition-all ${slideIndex === 0
                      ? 'text-slate-400 border-transparent cursor-not-allowed bg-transparent opacity-40'
                      : isDarkMode
                        ? 'text-slate-300 hover:bg-slate-800 hover:text-white bg-slate-950 border-slate-800'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 bg-white border-slate-200 shadow-sm'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Anterior
                </button>

                <div className={`hidden sm:flex text-xs font-medium select-none items-center gap-1.5 px-3 py-1.5 rounded-full border ${isDarkMode
                    ? 'text-slate-500 bg-slate-950 border-slate-800'
                    : 'text-slate-500 bg-slate-100 border-slate-200'
                  }`}>
                  <span>Tip:</span>
                  <span className={`px-1 py-0.5 rounded text-[10px] ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>←</span>
                  <span>/</span>
                  <span className={`px-1 py-0.5 rounded text-[10px] ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>→</span>
                  <span>navegación con teclado o deslizamientos</span>
                </div>

                <button
                  onClick={nextSlide}
                  disabled={slideIndex === slides.length - 1}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 select-none transition-all ${slideIndex === slides.length - 1
                      ? 'text-slate-400 border-transparent cursor-not-allowed bg-transparent opacity-40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    }`}
                >
                  Siguiente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Índice rápido en grilla */}
            <div className={`border rounded-3xl p-6 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
              <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Contenido del Módulo Seleccionado: Saltos Rápidos
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setSlideIndex(idx)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${idx === slideIndex
                        ? isDarkMode
                          ? 'bg-indigo-950/80 border-indigo-500/50 text-white'
                          : 'bg-indigo-50 border-indigo-500/50 text-indigo-900 font-bold shadow-sm'
                        : isDarkMode
                          ? 'bg-slate-950 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
                      }`}
                  >
                    <div className="font-bold text-indigo-500">Paso {slide.id}</div>
                    <div className="truncate mt-0.5 font-medium">{slide.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TARJETAS DE MEMORIA (FLASHCARDS) */}
        {currentTab === 'flashcards' && (
          <div className="space-y-6">
            <div className={`border rounded-3xl p-6 md:p-8 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
              <div className="max-w-2xl mx-auto text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold">Tarjetas de Memorización Activa</h3>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
                  Estudia los conceptos prioritarios de forma activa. Haz clic en las tarjetas para girarlas y revelar las respuestas ligadas al módulo (<span className="font-bold text-indigo-500">{currentModule === 'handbook' ? 'Handbook' : currentModule === 'onboarding' ? 'Developer Onboarding' : 'IT Team Onboarding'}</span>).
                </p>
              </div>

              {/* Grilla de Flashcards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {flashcards.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleCard(idx)}
                    className="h-64 cursor-pointer select-none"
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className="relative w-full h-full duration-500 rounded-2xl"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: flippedCards[idx] ? 'rotateY(180deg)' : 'none',
                        transition: 'transform 0.5s ease'
                      }}
                    >
                      {/* Lado Frontal */}
                      <div
                        className={`absolute inset-0 border rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded ${isDarkMode
                              ? 'text-indigo-400 bg-indigo-950/80 border border-indigo-800/30'
                              : 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                            }`}>
                            Concepto
                          </span>
                          <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>❓ Pregunta</span>
                        </div>
                        <div className="text-center my-auto">
                          <h4 className={`text-lg font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-950'
                            }`}>{card.term}</h4>
                          <p className={`text-[11px] mt-2 italic ${isDarkMode ? 'text-slate-500' : 'text-slate-650'
                            }`}>Pista: {card.hint}</p>
                        </div>
                        <span className={`text-[10px] text-center font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-450'
                          }`}>Haga clic para ver respuesta</span>
                      </div>

                      {/* Lado Trasero */}
                      <div
                        className={`absolute inset-0 border rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-colors duration-300 ${isDarkMode
                            ? 'bg-gradient-to-br from-slate-900 to-indigo-950/90 border-indigo-500/30'
                            : 'bg-gradient-to-br from-indigo-50 to-slate-100 border-indigo-200'
                          }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded ${isDarkMode
                              ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800/30'
                              : 'text-emerald-700 bg-emerald-100 border border-emerald-300'
                            }`}>
                            Significado
                          </span>
                          <span className={`text-xs font-semibold ${isDarkMode ? 'text-emerald-500' : 'text-emerald-600'
                            }`}>💡 Definición</span>
                        </div>
                        <p className={`text-xs md:text-sm text-center my-auto leading-relaxed p-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800 font-medium'
                          }`}>
                          {card.definition}
                        </p>
                        <span className={`text-[10px] text-center font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                          }`}>Haga clic para volver</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de reinicio */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setFlippedCards(Array(24).fill(false))}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${isDarkMode
                      ? 'border-slate-800 bg-slate-950 text-indigo-400 hover:text-white hover:bg-slate-900'
                      : 'border-slate-200 bg-slate-100 text-indigo-600 hover:text-indigo-800 hover:bg-slate-200 shadow-sm'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                  </svg>
                  Restablecer Giros de Tarjetas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SIMULADOR DE PIPELINE */}
        {currentTab === 'simulator' && (
          <div className="space-y-6">
            {/* Cabecera del Simulador */}
            <div className={`p-4 border rounded-2xl flex flex-col lg:flex-row justify-between items-center gap-4 transition-all duration-300 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-600 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold">Simulación de Control y Auditorías</h4>
                  <p className="text-[11px] text-slate-500">Prueba los controles automáticos de seguridad en sus tres vertientes: Código local, Pipelines CI/CD y Cuentas Cloud.</p>
                </div>
              </div>

              <div className="flex gap-1 w-full lg:w-auto flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => { setSimMode('cloud'); resetSimulator(); }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold border transition-all ${simMode === 'cloud'
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                      : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                >
                  ☁️ Pipeline Nube
                </button>
                <button
                  onClick={() => { setSimMode('local'); resetSimulator(); }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold border transition-all ${simMode === 'local'
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                      : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                >
                  💻 pre-commit Local
                </button>
                <button
                  onClick={() => { setSimMode('ops'); resetSimulator(); }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold border transition-all ${simMode === 'ops'
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                      : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                >
                  ⚙️ Infraestructura TI
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Panel de Configuración de Pruebas */}
              <div className={`lg:col-span-5 border rounded-3xl p-6 flex flex-col justify-between space-y-6 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>

                {simMode === 'cloud' && (
                  /* CONFIGURACIÓN MODO CLOUD */
                  <div>
                    <div className={`border-b pb-4 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <h3 className="text-sm font-bold">Reportes en Pipeline CI/CD</h3>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>Establece las vulnerabilidades detectadas en los repositorios tras el push.</p>
                    </div>

                    <div className="space-y-5">
                      {/* Vulnerabilidades Críticas */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-rose-500 flex items-center gap-1">
                            <span className="inline-block w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                            Severidad Crítica: {simCrit}
                          </label>
                          <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-bold">Bloqueante</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          value={simCrit}
                          onChange={(e) => setSimCrit(parseInt(e.target.value))}
                          disabled={simState === 'running'}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                      </div>

                      {/* Vulnerabilidades Altas */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                            Severidad Alta: {simHigh}
                          </label>
                          <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold">Bloqueante</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={simHigh}
                          onChange={(e) => setSimHigh(parseInt(e.target.value))}
                          disabled={simState === 'running'}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      {/* Vulnerabilidades Medias */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-blue-500 flex items-center gap-1">
                            <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                            Severidad Media: {simMed}
                          </label>
                          <span className="text-[10px] bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold">SLA 30 días</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={simMed}
                          onChange={(e) => setSimMed(parseInt(e.target.value))}
                          disabled={simState === 'running'}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>

                      {/* Secretos Detectados (Toggle) */}
                      <div className={`flex items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Fuga de Secretos en Nube</span>
                          <span className="text-[10px] text-slate-500">¿Llaves de API persistentes expuestas?</span>
                        </div>
                        <button
                          onClick={() => setSimSecrets(!simSecrets)}
                          disabled={simState === 'running'}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${simSecrets ? 'bg-rose-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-250'
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${simSecrets ? 'transform translate-x-6' : ''
                              }`}
                          />
                        </button>
                      </div>

                      {/* Errores de IaC (Toggle) */}
                      <div className={`flex items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Alertas Graves de IaC</span>
                          <span className="text-[10px] text-slate-500">Fallos críticos en Terraform.</span>
                        </div>
                        <button
                          onClick={() => setSimIacIssues(!simIacIssues)}
                          disabled={simState === 'running'}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${simIacIssues ? 'bg-rose-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-250'
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${simIacIssues ? 'transform translate-x-6' : ''
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {simMode === 'local' && (
                  /* CONFIGURACIÓN MODO LOCAL (PRE-COMMIT) */
                  <div>
                    <div className={`border-b pb-4 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <h3 className="text-sm font-bold">Configuración de pre-commit</h3>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-655'}`}>Emula qué archivos o reglas locales tienes vigentes en tu máquina local antes del commit.</p>
                    </div>

                    <div className="space-y-5">
                      {/* Token Expuesto Local */}
                      <div className={`flex items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Secreto hardcodeado en cambios (.env)</span>
                          <span className="text-[10px] text-slate-500">Credenciales sin abstraer o cifrar.</span>
                        </div>
                        <button
                          onClick={() => setSimLocalSecrets(!simLocalSecrets)}
                          disabled={simState === 'running'}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${simLocalSecrets ? 'bg-rose-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-250'
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${simLocalSecrets ? 'transform translate-x-6' : ''
                              }`}
                          />
                        </button>
                      </div>

                      {/* Advertencias de SonarLint */}
                      <div className={`flex items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800/85' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Malas prácticas SonarLint locales</span>
                          <span className="text-[10px] text-slate-500">Variables declaradas inseguras.</span>
                        </div>
                        <button
                          onClick={() => setSimLocalSonarLintWarning(!simLocalSonarLintWarning)}
                          disabled={simState === 'running'}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${simLocalSonarLintWarning ? 'bg-rose-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-250'
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${simLocalSonarLintWarning ? 'transform translate-x-6' : ''
                              }`}
                          />
                        </button>
                      </div>

                      {/* Forzar Bypass con --no-verify */}
                      <div className={`flex items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Evadir githooks (--no-verify)
                          </span>
                          <span className="text-[10px] text-slate-500">Fuerza el commit saltando Husky.</span>
                        </div>
                        <button
                          onClick={() => setSimLocalBypass(!simLocalBypass)}
                          disabled={simState === 'running'}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${simLocalBypass ? 'bg-amber-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-250'
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${simLocalBypass ? 'transform translate-x-6' : ''
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {simMode === 'ops' && (
                  /* CONFIGURACIÓN MODO INFRAESTRUCTURA TI (OPS) */
                  <div>
                    <div className={`border-b pb-4 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <h3 className="text-sm font-bold">Auditoría Cloud (Ops)</h3>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>Simula configuraciones o malas prácticas en las Landing Zones y cuentas de AWS/Azure.</p>
                    </div>

                    <div className="space-y-5">
                      {/* Cuentas Admin sin MFA */}
                      <div className={`flex items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Administradores sin MFA</span>
                          <span className="text-[10px] text-slate-500">Cuentas con privilegios desprotegidos.</span>
                        </div>
                        <button
                          onClick={() => setSimOpsMfaOff(!simOpsMfaOff)}
                          disabled={simState === 'running'}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${simOpsMfaOff ? 'bg-rose-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-250'
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1.5 w-4 h-4 bg-white rounded-full transition-all ${simOpsMfaOff ? 'transform translate-x-6' : ''
                              }`}
                          />
                        </button>
                      </div>

                      {/* Puerto SSH 22 Expuesto Abiertamente */}
                      <div className={`flex items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Puerto SSH expuesto (0.0.0.0/0)</span>
                          <span className="text-[10px] text-slate-500">Vulnerabilidad de acceso perimetral.</span>
                        </div>
                        <button
                          onClick={() => setSimOpsSshPublic(!simOpsSshPublic)}
                          disabled={simState === 'running'}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${simOpsSshPublic ? 'bg-rose-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-250'
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1.5 w-4 h-4 bg-white rounded-full transition-all ${simOpsSshPublic ? 'transform translate-x-6' : ''
                              }`}
                          />
                        </button>
                      </div>

                      {/* CloudTrail / Logs de Auditoria desactivados */}
                      <div className={`flex items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Auditoría Apagada (No Logs)</span>
                          <span className="text-[10px] text-slate-500">CloudTrail inactivo en subcuentas.</span>
                        </div>
                        <button
                          onClick={() => setSimOpsLogsOff(!simOpsLogsOff)}
                          disabled={simState === 'running'}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${simOpsLogsOff ? 'bg-rose-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-250'
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1.5 w-4 h-4 bg-white rounded-full transition-all ${simOpsLogsOff ? 'transform translate-x-6' : ''
                              }`}
                          />
                        </button>
                      </div>

                      {/* Regiones prohibidas */}
                      <div className={`flex items-center justify-between p-3 border rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Región no Aprobada en Terraform</span>
                          <span className="text-[10px] text-slate-500">Despliegue fuera del alcance de la SCP.</span>
                        </div>
                        <button
                          onClick={() => setSimOpsNonApprovedRegion(!simOpsNonApprovedRegion)}
                          disabled={simState === 'running'}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${simOpsNonApprovedRegion ? 'bg-rose-600' : isDarkMode ? 'bg-slate-800' : 'bg-slate-250'
                            }`}
                        >
                          <span
                            className={`absolute top-1 left-1.5 w-4 h-4 bg-white rounded-full transition-all ${simOpsNonApprovedRegion ? 'transform translate-x-6' : ''
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones del simulador */}
                <div className={`flex gap-2 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button
                    onClick={resetSimulator}
                    disabled={simState === 'running'}
                    className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${isDarkMode
                        ? 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                  >
                    Reset Parámetros
                  </button>
                  <button
                    onClick={runSimulation}
                    disabled={simState === 'running'}
                    className="flex-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:from-indigo-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
                  >
                    {simState === 'running'
                      ? "Evaluando..."
                      : simMode === 'cloud' ? "Lanzar Pipeline" : simMode === 'local' ? "Lanzar Commit" : "Auditar Cuenta"}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Consola del Pipeline e Informes */}
              <div className={`lg:col-span-7 border rounded-3xl p-6 flex flex-col justify-between min-h-[450px] ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                <div>
                  <div className={`flex justify-between items-center border-b pb-4 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-150'
                    }`}>
                    <h3 className="text-lg font-bold">
                      {simMode === 'cloud' && 'Consola de Pipeline CI/CD'}
                      {simMode === 'local' && 'Consola de Terminal Local'}
                      {simMode === 'ops' && 'Consola de Auditoría Cloud (Konecta Compliance)'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${simState === 'running' ? 'bg-indigo-400' : 'bg-emerald-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${simState === 'running' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{simState === 'running' ? "Inspeccionando" : "En Espera"}</span>
                    </div>
                  </div>

                  {/* Registro visual de logs (Terminal style) */}
                  <div className="bg-slate-950 font-mono text-[11px] p-4 rounded-2xl border border-slate-900/80 min-h-[180px] max-h-[220px] overflow-y-auto space-y-1.5 scrollbar-thin">
                    {simLogs.length === 0 && (
                      <div className="text-slate-600 italic text-center py-10">
                        {simMode === 'cloud' && 'Consola de nube vacía. Ajuste los controles y ejecute el pipeline para simular las Quality Gates.'}
                        {simMode === 'local' && 'Consola de Git vacía. Configure los cambios en su código y simule el pre-commit de Husky.'}
                        {simMode === 'ops' && 'Consola de auditoría de TI inactiva. Ajuste las desviaciones y ejecute el escaneo para validar SCPs e IAM.'}
                      </div>
                    )}
                    {simLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2 text-slate-300">
                        <span className="text-indigo-500 font-bold select-none">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    {simState === 'running' && (
                      <div className="w-full bg-slate-900 rounded-full h-1 mt-4 overflow-hidden">
                        <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${simProgress}%` }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Resultados e Informes de Cumplimiento de Políticas */}
                {simState === 'finished' && simulationResult && (
                  <div className={`mt-6 p-5 border rounded-2xl ${simulationResult.color} space-y-3 animate-fade-in`}>
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-extrabold tracking-tight">{simulationResult.summary}</h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${simulationResult.status === 'FAILED' ? 'bg-rose-900/20 text-rose-400 border border-rose-500/30' :
                          simulationResult.status === 'WARNING' ? 'bg-amber-900/20 text-amber-500 border border-amber-500/30' :
                            simulationResult.status === 'BYPASS_ALERT' ? 'bg-rose-950/40 text-rose-300 border border-rose-800' :
                              'bg-emerald-900/20 text-emerald-500 border border-emerald-500/30'
                        }`}>
                        {simulationResult.status}
                      </span>
                    </div>

                    <ul className="space-y-1.5">
                      {simulationResult.reasons.map((reason, idx) => (
                        <li key={idx} className="text-xs flex gap-2 items-start">
                          <span className="text-slate-400 mt-0.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Resumen explicativo de la política de Konecta Cloud */}
                    <div className={`text-[10px] border-t pt-2.5 ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-655'
                      }`}>
                      <span className="font-bold">Norma de Konecta Cloud Evaluada:</span> {
                        simMode === 'cloud' && 'La severidades Crítica y Alta detienen el flujo asíncrono en la nube. Las medias y bajas inician SLAs de remediación obligatorios de 30 y 90 días.'
                      } {
                        simMode === 'local' && 'El cinturón pre-commit de Husky es la primera línea de defensa para evitar compromisos de credenciales en repositorios corporativos.'
                      } {
                        simMode === 'ops' && 'Las SCPs organizativas son guardarraíles absolutos. Las brechas en SSH expuesto o falta de MFA en administradores suspenden inmediatamente la certificación de la cuenta.'
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUESTIONARIO (QUIZ) */}
        {currentTab === 'quiz' && (
          <div className="space-y-6">
            <div className={`border rounded-3xl p-6 md:p-8 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
              <div className={`flex justify-between items-center border-b pb-4 mb-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-150'
                }`}>
                <div>
                  <h3 className="text-lg font-bold">Cuestionario de Evaluación Exhaustiva (15 Preguntas)</h3>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
                    Pon a prueba tus conocimientos de los tres manuales de Konecta Cloud: **DevSecOps Handbook** (Q1-Q5), **Developer Onboarding** (Q6-Q10) y **IT Team Onboarding** (Q11-Q15).
                  </p>
                </div>
                {quizSubmitted && (
                  <div className={`border px-4 py-2 rounded-xl text-center ${isDarkMode ? 'bg-indigo-950 border-indigo-800' : 'bg-indigo-50 border-indigo-200'
                    }`}>
                    <div className={`text-xs font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Resultado Global</div>
                    <div className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{quizScore} / {QUIZ_QUESTIONS_ALL.length}</div>
                    <div className="text-[10px] font-semibold text-slate-500">
                      {quizScore >= 12 ? '🏆 ¡Sobresaliente! Certificación Aprobada' : quizScore >= 9 ? '🎖️ ¡Aprobado! Revisa los fallos' : '⚠️ Necesitas repasar los manuales'}
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de Preguntas */}
              <div className="space-y-6">
                {QUIZ_QUESTIONS_ALL.map((q, _) => {
                  const selectedOptionIdx = quizAnswers[q.id];
                  return (
                    <div key={q.id} className={`p-5 border rounded-2xl space-y-3 ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div className="flex gap-2.5 items-start">
                        <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${isDarkMode
                            ? 'bg-slate-900 text-slate-400 border-slate-800'
                            : 'bg-white text-slate-600 border-slate-200 shadow-sm'
                          }`}>
                          {q.id <= 5 && '📘 Manual Q'}{q.id > 5 && q.id <= 10 && '🚀 Dev Q'}{q.id > 10 && '⚙️ TI Q'}{q.id}
                        </span>
                        <h4 className={`text-sm font-semibold mt-0.5 leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-850'
                          }`}>{q.question}</h4>
                      </div>

                      {/* Opciones */}
                      <div className="grid grid-cols-1 gap-2 pl-9">
                        {q.options.map((option, optIdx) => {
                          const isSelected = selectedOptionIdx === optIdx;
                          let btnClass = isDarkMode
                            ? "border-slate-850 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-sm";

                          if (quizSubmitted) {
                            if (option.isCorrect) {
                              btnClass = isDarkMode
                                ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
                                : "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold";
                            } else if (isSelected) {
                              btnClass = isDarkMode
                                ? "border-rose-500/50 bg-rose-950/20 text-rose-300"
                                : "border-rose-500 bg-rose-50 text-rose-850 font-semibold";
                            } else {
                              btnClass = isDarkMode
                                ? "border-slate-950 bg-slate-950 opacity-30 text-slate-600"
                                : "border-slate-100 bg-slate-50 opacity-35 text-slate-400";
                            }
                          } else if (isSelected) {
                            btnClass = isDarkMode
                              ? "border-indigo-500/50 bg-indigo-950/40 text-white font-semibold"
                              : "border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectQuizOption(q.id, optIdx)}
                              disabled={quizSubmitted}
                              className={`p-3 rounded-xl border text-left text-xs transition-all flex gap-3 items-center ${btnClass}`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 border ${isSelected
                                  ? 'bg-indigo-600 border-indigo-400 text-white'
                                  : isDarkMode
                                    ? 'border-slate-700 bg-slate-950'
                                    : 'border-slate-300 bg-slate-100'
                                }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{option.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Retroalimentación explicativa */}
                      {quizSubmitted && (
                        <div className={`border p-3.5 rounded-xl text-xs pl-9 mt-2 leading-relaxed ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-inner'
                          }`}>
                          <span className="font-bold text-indigo-550 block mb-0.5">Fundamento Teórico:</span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botones del cuestionario */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={resetQuiz}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${isDarkMode
                      ? 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 shadow-sm'
                    }`}
                >
                  Reiniciar Respuestas
                </button>

                {!quizSubmitted ? (
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS_ALL.length}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${Object.keys(quizAnswers).length < QUIZ_QUESTIONS_ALL.length
                        ? 'bg-slate-200 border border-transparent text-slate-400 cursor-not-allowed opacity-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/10'
                      }`}
                  >
                    Calificar Examen ({Object.keys(quizAnswers).length}/{QUIZ_QUESTIONS_ALL.length})
                  </button>
                ) : (
                  <div className="text-xs text-indigo-500 font-bold italic">
                    ¡Examen calificado! Analice las justificaciones técnicas para fijar los conocimientos.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CHEAT SHEETS COMPARTIDOS */}
        {currentTab === 'cheatsheet' && (
          <div className="space-y-6">
            <div className={`border rounded-3xl p-6 md:p-8 space-y-8 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>

              {/* Sección A: Handbook Cheat Sheet */}
              <div className="space-y-4">
                <div className={`border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                  <div>
                    <h3 className="text-lg font-extrabold text-indigo-500">📘 Cheat Sheet A: Manual de Políticas (Handbook)</h3>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
                      Esquema de Quality Gates, severidades y flujos de aprobación excepcionales.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCheatSheet}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/10 self-stretch md:self-auto justify-center"
                  >
                    {copiedStatus ? (
                      <>
                        <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copiar Cheat Sheet A
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-5 border rounded-2xl space-y-4 ${isDarkMode ? 'bg-slate-950 border-slate-800/85' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <h4 className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Resumen SLAs de Mitigación</h4>
                    <div className="space-y-3">
                      <div className="border-l-2 border-rose-500 pl-3">
                        <div className="text-xs font-bold text-rose-500">Crítico / Alto (Bloqueante)</div>
                        <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>La remediación debe aplicarse de forma urgente en producción: &lt;24 horas para Críticos, &lt;7 días para Altos.</p>
                      </div>
                      <div className="border-l-2 border-blue-500 pl-3">
                        <div className="text-xs font-bold text-blue-600">Medio / Bajo (Informativo)</div>
                        <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-655'}`}>Permitidos temporalmente en el despliegue con SLAs de solución: &lt;30 días para Medios y &lt;90 días para Bajas.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 font-mono text-[11px] text-slate-300 shadow-md">
                    <pre className="whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed scrollbar-thin">
                      {CHEAT_SHEET_HANDBOOK_MD}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Sección B: Onboarding Cheat Sheet */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className={`border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                  <div>
                    <h3 className="text-lg font-extrabold text-indigo-500">🚀 Cheat Sheet B: Developer Onboarding</h3>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-655'}`}>
                      Instrucciones de terminal local, proxies de paquetes y Husky.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyOnboardingCheatSheet}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/10 self-stretch md:self-auto justify-center"
                  >
                    {copiedOnboardingStatus ? (
                      <>
                        <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copiar Cheat Sheet B
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-5 border rounded-2xl space-y-4 ${isDarkMode ? 'bg-slate-950 border-slate-800/85' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <h4 className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Anclaje Local Husky & Git</h4>
                    <div className="space-y-3 text-xs leading-relaxed">
                      <p>
                        <strong>Proxies de Artifactory:</strong> Configura localmente tus registros de NPM (\`.npmrc\`) o Python (\`pip.conf\`) obligatorios para apuntar al proxy privado de Konecta Cloud.
                      </p>
                      <p>
                        <strong>Hooks de Git:</strong> No evadas los pre-commits locales con '--no-verify'; la fuga de credenciales es monitorizada asíncronamente en GitLab.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 font-mono text-[11px] text-slate-300 shadow-md">
                    <pre className="whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed scrollbar-thin">
                      {CHEAT_SHEET_ONBOARDING_MD}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Sección C: IT Team Onboarding Cheat Sheet */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className={`border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                  <div>
                    <h3 className="text-lg font-extrabold text-indigo-500">⚙️ Cheat Sheet C: IT Team Onboarding (Infraestructura)</h3>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
                      Políticas de Landing Zones, endurecimiento de VMs y segmentación de VPCs.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyITCheatSheet}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/10 self-stretch md:self-auto justify-center"
                  >
                    {copiedITStatus ? (
                      <>
                        <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copiar Cheat Sheet C
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-5 border rounded-2xl space-y-4 ${isDarkMode ? 'bg-slate-950 border-slate-800/85' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <h4 className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Guardarraíles Cloud Obligatorios</h4>
                    <div className="space-y-3 text-xs leading-relaxed">
                      <p>
                        <strong>Gobernanza SCP:</strong> AWS Organizations impone SCPs a nivel raíz que impiden desactivar CloudTrail o aprovisionar fuera de las regiones aprobadas por la gerencia.
                      </p>
                      <p>
                        <strong>Conexiones de Red:</strong> Tráfico canalizado obligatoriamente a través de Transit Gateways privados. Las bases de datos operan en subredes 100% privadas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 font-mono text-[11px] text-slate-300 shadow-md">
                    <pre className="whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed scrollbar-thin">
                      {CHEAT_SHEET_IT_ONBOARDING_MD}
                    </pre>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA */}
      <footer className={`border-t py-6 px-4 md:px-8 text-center transition-colors duration-300 ${isDarkMode ? 'border-slate-900 bg-slate-950' : 'border-slate-200 bg-slate-100 shadow-inner'
        }`}>
        <div className={`max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-650'
          }`}>
          <p>© 2026 Konecta Cloud. Material unificado de entrenamiento de Ciberseguridad, Desarrollo Seguro y Operaciones de TI.</p>
          <div className="flex gap-4">
            <a href="https://devsecops-hub.konecta.cloud/devsecops-handbook-es.html" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors underline font-medium">
              DevSecOps Handbook
            </a>
            <span>•</span>
            <a href="https://devsecops-hub.konecta.cloud/developer-onboarding-es.html" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors underline font-medium">
              Developer Onboarding
            </a>
            <span>•</span>
            <a href="https://devsecops-hub.konecta.cloud/it-team-onboarding-es.html" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors underline font-medium">
              IT Onboarding
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}