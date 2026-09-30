# SOFTWARE-ALTERNATIVE.COM — AUTONOMOUS BUILD

Quiero que trabajes de forma AUTÓNOMA sobre este proyecto hasta completar una primera versión de producción de software-alternative.com.

Este es un trabajo end-to-end.

NO quiero que pares al terminar cada fase para preguntarme si continúas.

NO quiero tener que escribir "continúa".

NO quiero aprobaciones intermedias para decisiones técnicas rutinarias.

Tu objetivo es inspeccionar el proyecto existente, planificar, implementar, probar, corregir y continuar automáticamente hasta que el producto definido a continuación esté terminado y funcionando.

---

# REGLAS DE EJECUCIÓN AUTÓNOMA

Trabaja siguiendo este ciclo hasta completar el proyecto:

ANALYZE
→ PLAN
→ IMPLEMENT
→ TEST
→ FIX
→ VERIFY
→ CONTINUE

Después de completar una fase:

1. Ejecuta los tests relevantes.
2. Ejecuta lint.
3. Ejecuta typecheck.
4. Ejecuta build.
5. Corrige cualquier error.
6. Actualiza PROGRESS.md.
7. Continúa automáticamente con la siguiente fase.

NO te detengas para informarme simplemente de que una fase está terminada.

Continúa trabajando.

---

# DECISIONES

Cuando exista una decisión técnica razonablemente clara:

TÓMALA.

No preguntes al usuario entre varias opciones menores.

Prioriza:

1. simplicidad;
2. mantenibilidad;
3. rendimiento;
4. SEO;
5. buena experiencia de usuario;
6. escalabilidad razonable.

Si existen varias soluciones válidas, utiliza la que consideres más apropiada para este proyecto y documenta brevemente la decisión.

---

# CUÁNDO PUEDES DETENERTE

Solo debes detener la ejecución antes de completar el proyecto cuando exista un bloqueo REAL que no puedas resolver por ti mismo.

Ejemplos:

* falta una contraseña o API key imprescindible;
* necesitas acceso a una cuenta externa que no tienes;
* una acción irreversible requiere autorización;
* existe riesgo de borrar datos reales;
* existe un pago o contratación externa;
* el entorno no permite realizar una operación necesaria.

NO se considera bloqueo:

* elegir una librería;
* elegir estructura de carpetas;
* diseñar una API;
* decidir nombres;
* crear componentes;
* cambiar estilos;
* corregir tests;
* solucionar problemas de TypeScript;
* solucionar lint;
* crear migraciones;
* refactorizar;
* decidir arquitectura;
* escoger entre soluciones técnicas razonables.

En esos casos, decide y continúa.

Si aparece un bloqueo externo, continúa desarrollando TODO lo demás que no dependa de ese bloqueo antes de detenerte.

---

# NO ABANDONES POR ERRORES

Si algo falla:

Investiga el error.

Corrígelo.

Vuelve a ejecutar.

No dejes una funcionalidad rota simplemente porque el primer intento no funcionó.

Puedes modificar tu propia implementación tantas veces como sea necesario.

---

# CONTEXTO PERSISTENTE

Crea en la raíz:

PROGRESS.md

Debe contener:

* objetivo del proyecto;
* arquitectura;
* fases;
* fase actual;
* tareas terminadas;
* tareas pendientes;
* decisiones técnicas importantes;
* problemas encontrados;
* migraciones realizadas;
* comandos importantes;
* próximos pasos.

Actualízalo continuamente.

También crea o actualiza AGENTS.md si resulta útil para futuras ejecuciones.

La finalidad es que otra instancia del agente pueda continuar el proyecto sin tener que reconstruir todo el contexto.

---

# NO REESCRIBIR SIN NECESIDAD

Antes de empezar:

1. inspecciona completamente el repositorio;
2. entiende el stack actual;
3. localiza código reutilizable;
4. localiza configuración existente;
5. localiza base de datos;
6. localiza deployment;
7. localiza variables de entorno;
8. localiza documentación;
9. localiza tests.

No reconstruyas desde cero algo que ya funciona correctamente.

---

# OBJETIVO DEL PRODUCTO

Convertir:

software-alternative.com

en una plataforma internacional para descubrir, comparar y filtrar alternativas a software, aplicaciones y servicios SaaS.

No quiero un simple blog.

El producto principal será:

> Find the best software alternative for your needs.

El mercado inicial será inglés/internacional.

Debe quedar preparada la internacionalización futura.

---

# MODELO DE NEGOCIO

Preparar el producto para monetización mediante:

* Google AdSense;
* afiliados SaaS/software;
* listings patrocinados claramente identificados;
* fichas premium;
* posibles acuerdos comerciales.

La monetización no debe perjudicar la experiencia de usuario ni alterar silenciosamente los rankings.

---

# HOMEPAGE

La homepage debe comunicar en pocos segundos qué hace la plataforma.

Elemento protagonista:

Find an alternative to...

[ Photoshop                         ]

Debe existir:

* búsqueda;
* autocomplete;
* software popular;
* categorías;
* alternativas populares;
* comparaciones populares.

Evitar llenar la homepage de texto SEO artificial.

---

# SOFTWARE

Ruta:

/software/[slug]

Ejemplo:

/software/photoshop

Información:

* nombre;
* logo;
* descripción;
* empresa;
* URL oficial;
* categoría;
* precio;
* modelo de precios;
* plataformas;
* funcionalidades;
* licencia;
* open source;
* API;
* IA;
* self-hosted;
* offline;
* pros;
* contras;
* casos de uso;
* última actualización;
* fuentes.

---

# ALTERNATIVAS

Ruta:

/alternatives/[software]

Ejemplo:

/alternatives/photoshop

Debe contener:

* producto original;
* explicación breve;
* mejores alternativas;
* filtros;
* scoring;
* tabla/comparación;
* características;
* precios;
* plataformas;
* ventajas;
* inconvenientes.

Filtros iniciales:

* Free
* Paid
* Open Source
* Windows
* macOS
* Linux
* Web
* Android
* iOS
* One-time payment
* Subscription
* No subscription
* AI features
* Offline
* Self-hosted
* Cloud
* Commercial use
* Beginner friendly
* Professional

---

# LANDINGS SEO

Preparar rutas como:

/alternatives/photoshop/free

/alternatives/photoshop/open-source

/alternatives/photoshop/linux

/alternatives/photoshop/no-subscription

Pero NO generar automáticamente todas las combinaciones posibles.

Una landing debe ser indexable únicamente cuando:

* tenga intención diferenciada;
* existan suficientes resultados;
* pueda aportar contenido específico;
* tenga utilidad independiente.

Los filtros normales pueden funcionar mediante estado o query params y permanecer fuera del índice.

Evitar thin content.

---

# COMPARADOR

Crear:

/compare/[software-a]-vs-[software-b]

Ejemplo:

/compare/notion-vs-obsidian

Debe incluir datos reales comparables como:

* precio;
* free plan;
* free trial;
* plataformas;
* open source;
* AI;
* API;
* offline;
* self-hosted;
* modelo de licencia;
* facilidad de uso;
* casos de uso;
* características.

No crear comparaciones absurdas únicamente para generar URLs SEO.

---

# FIND MY ALTERNATIVE

Crear una funcionalidad interactiva donde el usuario pueda indicar:

* software actual;
* presupuesto;
* sistema operativo;
* open source;
* comercial/personal;
* IA;
* offline;
* self-hosted;
* suscripción o pago único;
* características importantes.

El sistema debe devolver alternativas y explicar por qué.

Ejemplo:

Krita

92% match

✓ Free
✓ Open source
✓ Windows
✓ macOS
✓ No subscription
✗ Limited AI functionality

---

# SCORING

Diseña un algoritmo reproducible.

NO generar scores arbitrarios mediante LLM.

El score debe derivarse de datos estructurados.

Debe admitir:

* hard requirements;
* preferencias;
* pesos;
* compatibilidad;
* penalizaciones;
* datos desconocidos.

Añade tests exhaustivos para esta lógica.

La explicación del resultado debe poder reconstruirse a partir de los factores utilizados.

---

# BASE DE DATOS

Diseña un modelo normalizado.

Como mínimo deben contemplarse conceptos equivalentes a:

Software

Category

Feature

Platform

PricingPlan

License

SoftwareFeature

SoftwarePlatform

AlternativeRelationship

AffiliateProgram

SeoLandingPage

Source

ChangeHistory

No es obligatorio utilizar exactamente esos nombres si existe una estructura mejor.

Software debe poder representar al menos:

id

slug

name

shortDescription

description

website

company

logo

categories

features

platforms

pricingModel

startingPrice

currency

freePlan

freeTrial

openSource

selfHosted

offlineSupport

apiAvailable

aiFeatures

license

affiliateUrl

officialUrl

createdAt

updatedAt

dataLastVerifiedAt

---

# FUENTES Y VERIFICACIÓN

Nunca inventes:

* precios;
* características;
* compatibilidad;
* licencias;
* plataformas.

La base de datos debe permitir asociar información con fuentes.

Necesitamos conocer:

* fuente;
* URL;
* fecha de consulta;
* fecha de verificación;
* dato verificado;
* cambios históricos;
* datos pendientes de revisar.

Si no existe información fiable utiliza:

UNKNOWN

o:

UNVERIFIED

Nunca presentes una suposición como dato real.

---

# DATOS INICIALES

Crear un catálogo inicial pequeño pero de calidad.

Objetivo aproximado:

20-30 productos.

Priorizar software conocido como:

Photoshop
Canva
Figma
Illustrator
Premiere Pro
DaVinci Resolve
Notion
Obsidian
Trello
Asana
Slack
Discord
Visual Studio Code
JetBrains
GitHub
GitLab
Dropbox
Google Drive
1Password
Bitwarden
Mailchimp
HubSpot

Puedes ampliar o modificar la selección si existe una razón clara.

NO inventes datos reales para completar el catálogo.

Si no puedes verificar un dato, déjalo explícitamente sin verificar.

---

# CATEGORÍAS

Preparar una taxonomía inicial:

Design
Photo Editing
Video Editing
Productivity
Project Management
Communication
CRM
Accounting
Development
Code Editors
AI Tools
Marketing
Analytics
Email Marketing
Cybersecurity
Cloud Storage
Password Managers
Office Suites
3D
Audio Editing

---

# SEARCH

La búsqueda es una funcionalidad central.

Debe soportar:

* nombre exacto;
* coincidencia parcial;
* alias;
* autocomplete;
* pequeños errores tipográficos.

Ejemplos:

photosop → Photoshop

premiere → Adobe Premiere Pro

vs code → Visual Studio Code

Empieza con una solución simple.

No añadas Elasticsearch u otra infraestructura pesada salvo que exista una necesidad real.

---

# ADMIN

Construye un panel protegido para gestionar:

* software;
* categorías;
* features;
* plataformas;
* precios;
* fuentes;
* relaciones entre alternativas;
* afiliados;
* landings SEO;
* datos pendientes de verificar.

Incluir:

* búsqueda;
* filtros;
* paginación;
* edición;
* creación;
* validación.

---

# SEO

Implementar correctamente:

* metadata dinámica;
* titles;
* descriptions;
* canonical;
* Open Graph;
* sitemap;
* robots.txt;
* breadcrumbs;
* structured data;
* SoftwareApplication cuando proceda;
* ItemList;
* BreadcrumbList;
* enlaces internos;
* URLs limpias;
* páginas rápidas.

Evitar:

* keyword stuffing;
* doorway pages;
* thin content;
* páginas duplicadas;
* millones de combinaciones de filtros indexables.

---

# IA / LLM

La aplicación NO debe depender de un LLM para funcionar.

Crear, si resulta útil, una abstracción preparada para añadir modelos en el futuro.

Los LLM podrán utilizarse posteriormente para:

* resúmenes;
* explicaciones;
* borradores editoriales;
* clasificación;
* detección de datos posiblemente obsoletos.

Los datos objetivos nunca deben ser inventados por un LLM.

---

# MONETIZACIÓN

Preparar componentes reutilizables:

AdSlot

AffiliateButton

SponsoredBadge

AffiliateDisclosure

Campos de afiliación:

affiliateUrl
affiliateProvider
affiliateEnabled
commissionNotes

Los resultados patrocinados deben identificarse.

Un pago nunca debe modificar silenciosamente el algoritmo de recomendación.

---

# ANALYTICS

Preparar eventos desacoplados del proveedor:

search

software_view

alternative_click

filter_used

comparison_view

affiliate_click

external_website_click

match_completed

---

# DISEÑO

Objetivo:

moderno;
minimalista;
tecnológico;
rápido;
profesional;
mobile-first.

Referencias conceptuales:

Linear
Vercel
Product Hunt
G2
Capterra
AlternativeTo

No copiar interfaces.

Crear un sistema visual coherente y componentes reutilizables.

---

# COMPONENTES

Valora componentes equivalentes a:

SoftwareCard

AlternativeCard

SearchSoftware

Autocomplete

FilterPanel

ComparisonTable

PricingBadge

PlatformIcons

FeatureList

ProsCons

MatchScore

Breadcrumbs

AffiliateButton

AdSlot

RelatedSoftware

CategoryCard

LastUpdated

SourceReference

EmptyState

Skeleton

---

# PERFORMANCE

Priorizar:

* SSR/SSG cuando corresponda;
* mínima cantidad razonable de JavaScript cliente;
* optimización de imágenes;
* caché;
* consultas eficientes;
* lazy loading;
* Core Web Vitals.

Evitar animaciones pesadas que no aporten valor.

---

# ACCESSIBILITY

La aplicación debe ser usable mediante:

* teclado;
* lectores de pantalla;
* foco visible;
* labels correctos;
* HTML semántico;
* contrastes adecuados.

---

# SEGURIDAD

Implementar:

* validación de inputs;
* sanitización;
* autorización admin;
* rate limiting donde tenga sentido;
* secretos solo en servidor;
* headers apropiados;
* manejo seguro de errores.

Nunca exponer secretos al navegador.

---

# TESTING

Crear tests principalmente para lógica importante:

* scoring;
* filtros;
* búsqueda;
* slugs;
* metadata;
* lógica SEO;
* endpoints;
* validaciones;
* permisos.

Añadir E2E para los principales recorridos cuando sea razonable.

---

# ESTADOS DE UI

No olvides:

* loading;
* empty;
* error;
* not found;
* datos desconocidos;
* sin alternativas;
* búsqueda sin resultados.

---

# PÁGINAS LEGALES / PRODUCCIÓN

Preparar estructura para:

* Privacy Policy;
* Cookie Policy;
* Terms;
* Affiliate Disclosure;
* About;
* Contact.

No inventes una entidad jurídica que no haya sido proporcionada.

Marca la información legal que necesite datos del propietario para completarse posteriormente.

---

# FASES INTERNAS

Utiliza internamente esta secuencia:

Fase 0 — Auditoría

Fase 1 — Arquitectura

Fase 2 — Base de datos

Fase 3 — Catálogo

Fase 4 — Search

Fase 5 — Alternatives

Fase 6 — Scoring

Fase 7 — Comparisons

Fase 8 — SEO

Fase 9 — Admin

Fase 10 — Analytics y monetización

Fase 11 — UX / responsive / accessibility

Fase 12 — Testing

Fase 13 — Performance

Fase 14 — Security review

Fase 15 — Production review

Estas fases son TU organización interna.

NO debes pedir autorización al usuario entre ellas.

---

# DEFINITION OF DONE

NO consideres terminado el proyecto simplemente porque las páginas existan.

El trabajo estará terminado cuando:

* la aplicación compile;
* no existan errores TypeScript;
* lint pase;
* tests importantes pasen;
* build de producción pase;
* navegación principal funcione;
* búsqueda funcione;
* filtros funcionen;
* páginas software funcionen;
* alternativas funcionen;
* scoring funcione;
* comparaciones funcionen;
* admin funcione;
* base de datos funcione;
* SEO técnico esté implementado;
* sitemap funcione;
* robots funcione;
* structured data esté presente;
* responsive esté revisado;
* estados de error estén implementados;
* no existan secretos hardcodeados;
* documentación esté actualizada;
* PROGRESS.md esté actualizado.

Haz además una revisión final completa buscando:

TODO
FIXME
HACK

y resuelve todos aquellos que formen parte razonablemente del MVP.

---

# VERIFICACIÓN FINAL

Cuando creas haber terminado:

NO termines todavía.

Realiza una última auditoría del proyecto.

Comprueba:

1. instalación limpia;
2. base de datos;
3. migraciones;
4. seed;
5. lint;
6. typecheck;
7. tests;
8. production build;
9. rutas importantes;
10. SEO;
11. responsive;
12. seguridad básica;
13. errores de consola;
14. errores de servidor;
15. enlaces rotos;
16. estados vacíos;
17. documentación.

Corrige lo que encuentres.

Repite la verificación hasta que el resultado sea satisfactorio.

---

# ENTREGA FINAL

SOLO cuando hayas completado y verificado todo lo posible debes detenerte.

En tu respuesta final dame:

* qué has construido;
* arquitectura final;
* funcionalidades terminadas;
* tests ejecutados;
* resultado del build;
* aspectos SEO implementados;
* base de datos implementada;
* cualquier dato que permanezca sin verificar;
* cualquier bloqueo externo real;
* instrucciones exactas para ejecutar el proyecto;
* instrucciones exactas para desplegarlo.

No me pidas que escriba "continúa".

Empieza inspeccionando el repositorio AHORA y continúa autónomamente hasta cumplir la Definition of Done.
