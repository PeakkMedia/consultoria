# Peakk Media — sitio

Dos páginas estáticas. Sin build, sin dependencias: se sube tal cual a Vercel.

| URL             | Archivo            | Qué es                                     |
| --------------- | ------------------ | ------------------------------------------ |
| `/`             | `index.html`       | Landing                                    |
| `/testimonios`  | `testimonios.html` | Entrevistas, testimonios en video y capturas |

## Estructura

```
.
├── index.html          landing
├── testimonios.html    reseñas
├── vercel.json         urls limpias (/testimonios sin .html)
├── base.css            tokens, barra, pie, botones, casos, muro ← lo comparten las dos
├── landing.css         solo el landing
├── testimonios.css     solo las reseñas
├── comun.js            Wistia, aparición al scroll y lupa ← lo comparten las dos
├── landing.js          escenario de la solución, calculadora, faq
└── assets/
    ├── logo.webp
    ├── *.png                  las 105 capturas de clientes
    ├── landing/
    │   ├── nico.jpg
    │   ├── mateo.jpg
    │   ├── marcas/01.jpg … 15.jpg     carrusel de marcas (cuadradas)
    │   └── sistema/01.jpg … 06.jpg    las seis áreas (4:3)
    └── marcas/                        logos de marca de los testimonios
```

## Subir a Vercel

1. Subí todo a un repo de GitHub.
2. En Vercel: **Add New → Project**, importá el repo.
3. Framework Preset **Other**. Build Command, Output Directory e Install Command vacíos.
4. Deploy.

`vercel.json` ya deja `/testimonios` funcionando sin el `.html`, y redirige
`/testimonios.html` a la URL limpia.

## Imágenes que faltan

Las que todavía no subiste tienen `data-opcional` en el HTML: si el archivo no
existe, en vez del ícono roto aparece un recuadro punteado que dice qué ruta
falta. Podés publicar el sitio y completarlas después.

Faltan por cargar:

- `assets/landing/nico.jpg` y `assets/landing/mateo.jpg` — fotos verticales, se recortan a 340×400.
- `assets/landing/marcas/01.jpg` a `15.jpg` — cuadradas, se muestran a 290×290.
- `assets/landing/sistema/01.jpg` a `06.jpg` — apaisadas 4:3.
- `assets/marcas/` — logos de las marcas de los casos. Subilos en blanco o en hueso
  con fondo transparente: sobre el fondo oscuro un logo negro no se ve. Los nombres
  que espera el HTML son `lachanga.png`, `charabias.png`, `gamecenter.png`,
  `moscu.png`, `foxies.png`, `loira.png`, `clutchloop.png`, `spbikinis.png`,
  `andreina.png`, `babystore.png` y `marca-08.png`.

## Videos de Wistia

En los dos archivos, cada video es un `div` con el link (o el id) en `data-wistia`:

```html
<div class="video video--ancho" data-wistia="https://peakkmediagroup.wistia.com/s/v7rn076eu4x3w5d" data-aspect="1.7778"></div>
```

Sirven las dos formas: el link completo o solo `v7rn076eu4x3w5d`. El script del
reproductor se inyecta solo. Con el campo vacío queda un recuadro punteado y la
página no se rompe.

`data-aspect="1.7778"` para 16:9 y `"0.5625"` para 9:16.

Faltan dos videos: el de portada del landing y el octavo testimonio vertical.

## Los casos de éxito

Los mismos cuatro casos y ocho testimonios aparecen en las dos páginas, con el
mismo bloque de HTML. Si editás uno, acordate de editarlo en los dos archivos:
en `index.html` están en la sección `#casos` y en `testimonios.html` en
`#entrevistas` y `#testimonios`.

## Agregar una captura

El landing muestra 60 capturas y `/testimonios` las 105. Subí la imagen a
`assets/` y pegá este bloque dentro de un `<div class="muro">`. El orden en el
archivo es el orden en pantalla.

```html
<figure class="tarjeta tarjeta--captura">
  <img src="assets/ARCHIVO.png" alt="Resultado de NOMBRE" loading="lazy" decoding="async">
  <figcaption class="tarjeta-pie">NOMBRE</figcaption>
</figure>
```

Si el archivo tiene espacios o paréntesis: espacio = `%20`, `(` = `%28`, `)` = `%29`.
Para la etiqueta al lado del nombre:

```html
<figcaption class="tarjeta-pie">NOMBRE <span class="tarjeta-tag">Mes récord</span></figcaption>
```

Ojo con las mayúsculas: el hosting las distingue aunque Windows no. Si un archivo
cambia de nombre en el camino, esa captura da 404 y las demás andan igual, que es
el error más difícil de encontrar.

## Cosas que quizás quieras cambiar

- **Cifras del hero de testimonios**: bloque `.cifras` en `testimonios.html`.
- **Cuántas capturas se ven en el landing**: borrá o pegá bloques `<figure class="tarjeta">`
  dentro del `<div class="muro">` de `index.html`.
- **El calendario**: el `iframe` de iClosed está en la sección `#agendar` del landing.
- **WhatsApp**: el número y el mensaje están en los enlaces `wa.me` de los dos archivos.
- **Google Tag Manager**: contenedor `GTM-TSXGCTTX` en el `<head>` de ambas. Si esta
  página no se mide con la misma cuenta, borrá ese `<script>` y el `<noscript>`.
- **Columnas del muro**: regla `.muro` en `base.css` (4 en desktop; 3, 2 y 1 en los `@media` del final).
- **Supuestos de la calculadora**: función `calculadora()` en `landing.js`
  (CPM −25%, CTR +40%, conversión +0,5 pp, ticket +15%).
