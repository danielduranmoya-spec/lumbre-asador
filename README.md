# LUMBRE Asador · web (concepto)

Web de negocio de un asador **ficticio** de ibérico a la brasa en Mérida. Es el ejemplo de la tarifa *Web de negocio (desde 890 €)* del portfolio: cinco secciones, reservas online, carta, mapa, horario, reseñas, animaciones y textos legales.

Web publicada: https://danielduranmoya-spec.github.io/lumbre-asador/

```
lumbre-asador/
├── index.html        ← la web (estructura y textos)
├── style.css         ← estilos: colores, tipografías y espaciado al principio, en :root
├── script.js         ← teléfono, horario, turnos de reserva y la carta completa (CONFIG y CARTA)
├── IMAGENES.md       ← lista de las fotos que faltan, con nombre, tamaño y qué debe verse
├── img/              ← aquí van las fotos (se crea al subir la primera)
├── aviso-legal.html  ← plantilla: completa los campos [PENDIENTE]
├── privacidad.html   ← plantilla: completa los campos [PENDIENTE]
├── cookies.html      ← qué guarda la web y qué servicios externos usa
└── favicon.svg
```

## Secciones

1. **Inicio**: titular a pantalla completa con brasas animadas en un canvas (40 partículas como máximo, se paran fuera de la vista y con movimiento reducido).
2. **Carta**: filtros por categoría (Brasa, Entrantes, Quesos de la tierra, Postres y Vinos), precios y alérgenos con iconos de línea.
3. **Reservas**: tres pasos (fecha → personas y hora → mesa y datos), con validación en cada paso, los lunes bloqueados y una pantalla de confirmación que abre WhatsApp con el mensaje ya escrito.
4. **Opiniones**: cuatro reseñas marcadas como *de ejemplo*, con nota media y reparto de estrellas.
5. **Dónde estamos**: dirección, aviso «Abierto ahora / Cerrado» con la hora de Madrid, horario y mapa.

## Abrirla en VS Code

```bash
git clone https://github.com/danielduranmoya-spec/lumbre-asador.git
code lumbre-asador
```

Funciona con doble clic en `index.html`, pero es mejor usar la extensión **Live Server** (clic derecho en `index.html` → *Open with Live Server*) para ver los cambios al guardar.

## Qué cambiar para un cliente real

- **Teléfono y WhatsApp**: `CONFIG` al principio de `script.js`. Cambia también el número del JSON-LD del `<head>` de `index.html`.
- **Horario**: `CONFIG.horario` (aviso «Abierto ahora»), `CONFIG.turnos` (horas que se pueden reservar) y `CONFIG.diasCerrados`. Revisa también la tabla `.hours` y la franja del inicio en `index.html`.
- **Carta**: objeto `CARTA` en `script.js`. Los alérgenos usan las claves `gluten`, `lacteos`, `huevo`, `frutos` y `sulfitos`. La categoría Brasa también está escrita en `index.html` para que se vea sin JavaScript.
- **Fotos**: sigue `IMAGENES.md`. Cada foto subida a `img/` se activa añadiendo su nombre a `CONFIG.fotos`.
- **Reseñas**: en `index.html`. Para una web real usa reseñas reales con permiso del negocio y quita la etiqueta «de ejemplo».
- **Colores**: variables de `:root` en `style.css` (`--brasa` es el único acento).
- **Barra superior «Concepto»**: bórrala (`.concept-bar`) en la web de un cliente real.

## Reservas: cómo funcionan

No hay servidor. Al confirmar, la web prepara un mensaje de WhatsApp con día, hora, turno, personas, zona, nombre, teléfono y comentarios. La reserva queda hecha cuando el restaurante responde. Para probarla desde la consola del navegador, `__lumbre.reserva` muestra el estado del formulario.

## Privacidad y cookies

- El mapa de OpenStreetMap solo se carga si la persona lo acepta en el aviso o pulsa «Cargar mapa».
- La elección se guarda en `localStorage` con la clave `lumbre-consent`.
- Las tipografías (Anton, Newsreader y Space Mono) se cargan desde Google Fonts.

## Publicar cambios

La web se publica con GitHub Pages desde la rama `main` (carpeta raíz). Cada `git push` a `main` actualiza la web en uno o dos minutos.
