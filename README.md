# Peakk Media — Consultoría

Landing page y sitio de reseñas/testimonios de la consultoría de Peakk Media. Sitio estático (HTML/CSS/JS), desplegado en Vercel.

## Estructura

```
.
├── index.html                                landing principal
├── testimonios.html                          página de reseñas
├── calendario.html                           agenda de llamada
├── calendario-proyeccion.html                agenda de llamada (variante "proyección")
├── confirmacion-pre-llamada.html             confirmación previa a la llamada
├── confirmacion-pre-llamada-proyeccion.html  confirmación previa (variante "proyección")
├── confirma-tu-llamada-video.html            confirmación con video
├── onboarding.html                           onboarding de clientes
├── politicas-de-privacidad-page.html         políticas de privacidad
├── terminos-y-condiciones.html               términos y condiciones
├── vercel.json                               config de Vercel (URLs limpias, ej. /testimonios sin .html)
├── base.css                                  tokens, barra, pie, botones, casos, muro — compartido por landing y testimonios
├── landing.css                               estilos exclusivos del landing
├── testimonios.css                           estilos exclusivos de testimonios
├── paginas.css                               estilos compartidos por las páginas secundarias (calendario, confirmaciones, etc.)
├── comun.js                                  Wistia, aparición al scroll y lupa — compartido por landing y testimonios
├── landing.js                                escenario de la solución, calculadora y FAQ del landing
└── assets/                                   imágenes y otros archivos estáticos
```

## Cómo editar contenido

- **Videos (Wistia):** se pueden usar como link completo o solo el ID (ej. `v7rn076eu4x3w5d`). El script del reproductor se inyecta solo. Si el campo queda vacío se muestra un recuadro punteado y la página no se rompe.
  - `data-aspect="1.7778"` → 16:9
  - `data-aspect="0.5625"` → 9:16
- **Casos y testimonios:** el mismo bloque de HTML se repite en `index.html` (sección `#casos`) y en `testimonios.html` (secciones `#entrevistas` y `#testimonios`). Si editás uno, hay que editarlo en los dos archivos.
- **Muro de capturas:** el landing muestra 60 capturas y `/testimonios` muestra 105. Para agregar una, subí la imagen a `assets/` y agregá el bloque dentro de un `<div class="muro">`. El orden en el archivo define el orden en pantalla.

## Deploy

El sitio se despliega en [Vercel](https://vercel.com/). `vercel.json` define las URLs limpias (por ejemplo, `/testimonios` en lugar de `/testimonios.html`).

## Stack

- HTML / CSS / JS puro, sin framework ni build step.
- Wistia para video.
- Vercel para hosting.
