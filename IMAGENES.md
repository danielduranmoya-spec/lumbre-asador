# Fotos que necesita la web

La web funciona sin fotos: cada hueco tiene su tamaño fijo, un fondo de la paleta y el texto alternativo definitivo. Para poner una foto:

1. Súbela a la carpeta `img/` con el nombre exacto de la tabla.
2. Añade ese nombre a `CONFIG.fotos` al principio de `script.js`, por ejemplo `fotos: ['hero-parrilla.jpg', 'carta-brasa.jpg']`.

La web solo pide las fotos que están en esa lista. Si una está en la lista pero todavía no se ha subido, se queda el hueco con su texto.

**Estado:** las seis fotos (inicio y carta) ya están en `img/` y en `CONFIG.fotos`.

**Estilo común para todas:** luz cálida y lateral (de ventana o de la propia brasa), fondo oscuro, sin flash, madera y barro como superficies, nada de vajilla blanca brillante. Mismo encuadre ligeramente cenital en los platos.

| Archivo | Tamaño | Dónde sale | Qué debe verse |
|---|---|---|---|
| `img/hero-parrilla.jpeg` ✓ | 2400 × 1500 px | Fondo del inicio (se oscurece al 55 %) | Secreto ibérico dorándose sobre la parrilla, con brasas de encina debajo y algo de humo. Horizontal, con espacio libre arriba a la izquierda para el titular. |
| `img/carta-brasa.jpeg` ✓ | 1200 × 900 px | Carta · Brasa | Presa ibérica cortada en láminas sobre una tabla de madera. |
| `img/carta-entrantes.jpeg` ✓ | 1200 × 900 px | Carta · Entrantes | Migas extremeñas con uvas y huevo frito en una cazuela de barro. |
| `img/carta-quesos.jpeg` ✓ | 1200 × 900 px | Carta · Quesos de la tierra | Torta del Casar abierta con una cuchara y tostas alrededor. |
| `img/carta-postres.jpeg` ✓ | 1200 × 900 px | Carta · Postres | Porción de técula mécula con almendra laminada. |
| `img/carta-vinos.jpeg` ✓ | 1200 × 900 px | Carta · Vinos | Copa de vino tinto junto a una botella de Ribera del Guadiana. |

## Antes de subirlas

- Expórtalas en JPG con calidad 75–80 %. Cada foto de la carta debería pesar menos de 200 KB y la del inicio menos de 450 KB.
- Si cambias una foto por otra distinta, actualiza su texto alternativo: el de la carta está en `CARTA` dentro de `script.js` (campo `foto.alt`).
- La foto del inicio es decorativa (`alt=""`), porque el titular ya dice lo que hay que saber.
