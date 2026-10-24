# Greek God Protocol

PWA personal de entrenamiento y dieta. Un solo archivo (`index.html`) sin build, sin dependencias
y sin backend: todo el estado vive en el `localStorage` del navegador.

## Rutinas

| Rutina | Días | Origen |
|---|---|---|
| **KEEPCOOL** *(por defecto)* | 3 · Push / Pull / Legs | Programa del coach Valentin en KeepCool (ficha del 09/09). Todo en máquinas, ~45 min por sesión. |
| **DEFAULT** | 5 · Push / Lower / Pull / Push / Arms+Delt (+ Abs) | Greek God: lean bulk con prioridad estética en deltoides y pecho clavicular. |
| **GENESIS** | 3 · Pecho+Espalda / Hombro+Brazo / Pierna (+ Abs) | Programa original de volumen alto con pirámides y doble rango. |

Además hay secciones de **Dietas** (comidas, lista del súper, suplementos, sustituciones, reglas),
**Guía** (nutrición base, lista negra, cómo leer la rutina, instalación) y **Métricas**.

## Qué hace

- **Modo entrenar**: check por serie, barra de progreso de la sesión, cronómetro de sesión y timer
  de descanso flotante que sobrevive a cerrar el modal, cambiar de pestaña y recargar la página.
- **Registro de cargas** por ejercicio con historial (kg × reps), delta contra la sesión anterior,
  mini-gráfica y sugerencia de subir carga al llegar al tope del rango de reps.
- **Métricas** en cuatro pantallas:
  - *Progreso* — composición corporal de referencia, gráfica de peso con banda de ritmo objetivo
    (+0.5–1 kg/mes), medidas con cinta y análisis por periodo (mes / 3 meses / 6 meses).
  - *Fuerza* — 1RM estimado por ejercicio (fórmula de Epley sobre kg × reps), con su evolución
    y la tabla de récords.
  - *Volumen* — series de la semana repartidas por grupo muscular contra la franja MEV–MRV de tu
    propia tabla, y mapa de constancia de las últimas 8 semanas.
  - *Historial* — cada sesión terminada con su duración, series y récords.
- **Unidades kg / lb** con un interruptor: se guarda siempre en kg y solo cambia lo que se muestra.
- **Copia de seguridad**: exportar / importar todos los datos en JSON desde el panel de Métricas.
- **PWA instalable** y funcional sin conexión (`sw.js`).

## Datos y privacidad

No hay servidor ni cuenta: **todo se guarda solo en el navegador del dispositivo**. Cambiar de móvil,
borrar los datos del sitio o usar otro navegador implica empezar de cero — por eso existe el botón
de exportar en Métricas. Úsalo de vez en cuando.

Claves de `localStorage`: `doneLog`, `sessionLog`, `wlog-<ejercicio>`, `bwLog`, `measLog`,
`eatenLog`, `routine`, `unit`, `forcePick`, `lastTab`, `lastSection`, `restTimer`, `sessStart`.

## iPhone y zonas seguras

La app se usa sobre todo en un iPhone con Dynamic Island, así que el modal de ejercicio respeta
`env(safe-area-inset-*)`: la barra con el botón de cerrar nunca queda bajo la isla y el pie deja
libre la franja del indicador de inicio, para que el gesto de salir de la app siga funcionando.
Si tocas algo de ese layout, compruébalo simulando los insets:

```css
:root { --sat: 62px; --sab: 34px; }
```

## Desarrollo

No hay build. Edita `index.html` y recarga. Eso sí: el service worker **necesita HTTP(S)**, así que
para probarlo hay que servir la carpeta en vez de abrir el archivo con `file://`:

```bash
python -m http.server 8777
```

Al cambiar el HTML durante el desarrollo, acuérdate de que el service worker cachea la página:
usa recarga forzada o desregístralo desde DevTools → Application.

## Despliegue

Cualquier hosting estático sirve (GitHub Pages, Netlify, Vercel). Solo hay que publicar la carpeta
tal cual: `index.html`, `sw.js`, `manifest.json` y los tres iconos.

## Nota sobre las demostraciones de ejercicios

Los ejercicios de KEEPCOOL llevan vídeo de YouTube verificado. Muchos ejercicios de DEFAULT y
GENESIS apuntaban a GIFs de `inspireusafoundation.org`, y **ese host ya no sirve esas rutas**
(404): en esos casos la app muestra automáticamente un enlace de búsqueda en YouTube con el nombre
del ejercicio. Para arreglarlo del todo habría que asignarles un `yt:` verificado, como se hizo con
KEEPCOOL.
