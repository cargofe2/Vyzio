// prisma/seed-nivel2-prompting-chatgpt.ts
// Mundo 11: Prompt Engineering completo (17 lecciones)
// Mundo 12: ChatGPT completo (15 lecciones)
// Fuentes: papers públicos arXiv, documentación OpenAI, Anthropic docs

import { PrismaClient, LessonType } from "@prisma/client";
const prisma = new PrismaClient();

const MUNDO11: any[] = [
  {
    number:1, slug:"pe-anatomia-prompt-perfecto", title:"Anatomía de un prompt perfecto",
    type:LessonType.VIDEO, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"Un prompt es la instrucción que le das a un modelo de IA. La diferencia entre un prompt mediocre y uno excelente puede ser la diferencia entre una respuesta inútil y un resultado que te ahorra horas. El prompt engineering es la habilidad de comunicarte efectivamente con la IA." },
      { type:"heading", text:"Los cuatro elementos de un prompt efectivo" },
      { type:"text", text:"1. Contexto: quién eres, para qué es esto, qué información relevante debe saber el modelo. 2. Instrucción: qué quieres que haga exactamente, con verbos de acción claros. 3. Formato: cómo quieres la respuesta — longitud, estructura, tono, idioma. 4. Ejemplos (opcional): muestra uno o dos ejemplos del resultado que buscas." },
      { type:"callout", text:"El error más común: prompts sin contexto. 'Escríbeme un email' es un prompt pobre. 'Escríbeme un email profesional de 150 palabras al cliente XYZ rechazando su solicitud de descuento, manteniendo la relación, firmado por mí (Director de Ventas)' es un prompt efectivo." },
      { type:"tip", text:"Los modelos son literales: si no especificas longitud, tono, audiencia o formato, el modelo elige. Siempre especifica lo que importa. Todo lo que no dices es una variable libre que el modelo llena con sus defaults." },
    ]},
    quiz:[
      { question:"¿Cuál es el error más común en prompts básicos?", options:["Usar demasiadas palabras","Falta de contexto: no especificar quién eres, para qué es ni qué resultado esperas","Pedir cosas muy difíciles","Usar un idioma que el modelo no entiende bien"], correctIndex:1, explanation:"Sin contexto, el modelo llena los blancos con sus propias asunciones que raramente coinciden con lo que necesitas.", order:1 },
    ]
  },
  {
    number:2, slug:"pe-roles-personas", title:"Roles y personas: 'actúa como un experto en...'",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"Asignar un rol al modelo es una de las técnicas más efectivas del prompt engineering. En lugar de preguntar 'cómo mejoro este código', pregunta 'actúa como un senior developer de Python con 10 años de experiencia y revisa este código identificando problemas de rendimiento y seguridad'." },
      { type:"text", text:"Los roles funcionan porque activan patrones específicos del entrenamiento. El modelo tiene internalizado cómo responde un experto médico vs un divulgador científico vs un estudiante. El rol es un shortcut para comunicar el nivel, tono y perspectiva que buscas." },
      { type:"callout", text:"Roles útiles que puedes usar hoy: 'Actúa como un editor de textos implacable', 'Como CEO de una startup con 10 años de experiencia', 'Como un profesor de universidad que explica a estudiantes de 16 años', 'Como un abogado corporativo revisando un contrato', 'Como un hacker de sombrero blanco buscando vulnerabilidades'." },
      { type:"text", text:"Roles combinados con restricciones: 'Actúa como un nutricionista clínico. Responde SOLO basándote en evidencia científica con estudios publicados. No des consejos sin respaldo.' Esto combina el rol con una restricción de calidad que mejora la fiabilidad de las respuestas." },
      { type:"tip", text:"No necesitas que el rol sea real. 'Actúa como el mejor maestro de escritura del mundo que ha leído más de 10,000 libros' activa patrones de calidad aunque no haya una persona real que encarne eso." },
    ]},
    quiz:[
      { question:"¿Por qué funciona asignar roles en los prompts?", options:["Porque el modelo verifica las credenciales del rol","Porque activa patrones específicos del entrenamiento que corresponden a ese tipo de experto","Porque el modelo es más obediente con autoridades","Por razones que los investigadores no entienden aún"], correctIndex:1, explanation:"Durante el entrenamiento el modelo vio millones de textos de distintos tipos de expertos. El rol es un shortcut para activar esos patrones específicos.", order:1 },
    ]
  },
  {
    number:3, slug:"pe-chain-of-thought", title:"Chain-of-Thought: hazlo pensar paso a paso",
    type:LessonType.VIDEO, durationMin:6, xpReward:75,
    content:{ blocks:[
      { type:"text", text:"Chain-of-Thought (CoT) fue introducido en un paper de Google (Wei et al., 2022) y demostró algo sorprendente: simplemente añadir 'piensa paso a paso' al prompt mejora dramáticamente el rendimiento en problemas de razonamiento matemático y lógico." },
      { type:"callout", text:"En el paper original, CoT mejoró el rendimiento en problemas matemáticos de un 17.9% con prompting estándar a un 78.9% — una mejora de más de 4x simplemente cambiando cómo se pedía la respuesta. Sin cambiar el modelo, sin reentrenar, solo el prompt." },
      { type:"text", text:"¿Por qué funciona? Los LLMs generan texto token por token. Cuando escriben el razonamiento intermedio, ese texto se convierte en contexto para los siguientes tokens. Es como si el modelo 'usara papel de borrador' para llegar a la respuesta correcta." },
      { type:"heading", text:"Variantes de CoT" },
      { type:"text", text:"Zero-shot CoT: simplemente añade 'Piensa paso a paso antes de responder.' Few-shot CoT: proporciona 1-3 ejemplos mostrando el razonamiento completo. Auto-CoT: pide al modelo que genere sus propios ejemplos de razonamiento. Tree of Thoughts (ToT): permite al modelo explorar múltiples caminos de razonamiento y elegir el mejor." },
      { type:"tip", text:"CoT es especialmente útil para: problemas matemáticos, razonamiento lógico multi-paso, análisis de situaciones complejas, debugging de código. Para respuestas factuales simples, no aporta mucho y solo aumenta el costo en tokens." },
    ]},
    quiz:[
      { question:"¿Por qué Chain-of-Thought mejora el razonamiento de los LLMs?", options:["Porque el modelo accede a más datos","El razonamiento intermedio escrito se convierte en contexto que ayuda a generar los tokens siguientes más precisos","Porque activa una parte diferente del modelo","Porque reduce la temperatura del modelo"], correctIndex:1, explanation:"Al escribir el razonamiento paso a paso, cada token del proceso se convierte en contexto para los siguientes — es literalmente usar 'papel de borrador'.", order:1 },
      { question:"¿En qué tipo de tareas NO aportará mucho Chain-of-Thought?", options:["Problemas matemáticos complejos","Razonamiento lógico multi-paso","Preguntas factuales simples ('¿cuál es la capital de Francia?')","Debugging de código"], correctIndex:2, explanation:"CoT es para razonamiento complejo. Para hechos directos solo aumenta la longitud y el costo sin mejorar la precisión.", order:2 },
    ]
  },
  {
    number:4, slug:"pe-few-shot-zero-shot", title:"Few-shot y zero-shot: enseñar con ejemplos",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"text", text:"Zero-shot prompting: pedirle al modelo que haga algo sin darle ejemplos. Funciona bien para tareas comunes donde el modelo tiene mucho entrenamiento. Few-shot prompting: proporcionar 1-5 ejemplos del resultado esperado antes de la tarea real. Es una de las técnicas más poderosas disponibles." },
      { type:"heading", text:"Cuándo usar few-shot" },
      { type:"text", text:"Usa few-shot cuando: el formato de salida es muy específico y difícil de describir, la tarea es inusual o poco común en el entrenamiento del modelo, necesitas consistencia entre múltiples llamadas, o cuando zero-shot da resultados inconsistentes." },
      { type:"callout", text:"La calidad de los ejemplos importa más que la cantidad. Dos ejemplos perfectos superan a diez ejemplos mediocres. Cada ejemplo debe mostrar exactamente el patrón que quieres — incluyendo casos borde si son relevantes." },
      { type:"text", text:"Estructura few-shot: Input: [ejemplo 1] → Output: [respuesta ideal 1]. Input: [ejemplo 2] → Output: [respuesta ideal 2]. Input: [tu tarea real] → Output:" },
      { type:"tip", text:"El orden de los ejemplos importa. Los modelos tienen sesgo hacia los ejemplos más recientes (recency bias). Pon los ejemplos más representativos al final, justo antes de tu tarea real." },
    ]},
    quiz:[
      { question:"¿Cuándo es más útil el few-shot prompting?", options:["Siempre, es mejor que zero-shot en todos los casos","Cuando el formato de salida es específico o la tarea es inusual para el modelo","Cuando no tienes ejemplos disponibles","Para preguntas de hecho simples"], correctIndex:1, explanation:"Few-shot brilla cuando el resultado esperado es difícil de describir pero fácil de mostrar, o cuando la tarea es inusual.", order:1 },
    ]
  },
  {
    number:5, slug:"pe-prompts-negativos", title:"Prompts negativos: dile qué NO hacer",
    type:LessonType.READING, durationMin:4, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"Los prompts negativos (instrucciones sobre qué evitar) son una herramienta subestimada. Decirle al modelo qué no incluir es tan importante como decirle qué incluir. 'Escribe un resumen ejecutivo. No uses bullet points. No incluyas jerga técnica. No menciones limitaciones del estudio.' es un prompt más efectivo que solo 'escribe un resumen ejecutivo'." },
      { type:"text", text:"Las restricciones de formato son especialmente útiles: 'sin introducción', 'sin cierre genérico', 'sin frases como en conclusión o es importante destacar', 'sin listas numeradas', 'sin preguntas retóricas'. Estas eliminan los vicios más comunes del modelo." },
      { type:"callout", text:"Restricción anti-hallucination: añadir 'Si no estás seguro de un dato, dilo explícitamente. Prefiero que admitas ignorancia a que inventes información.' cambia significativamente el comportamiento del modelo en tareas que requieren precisión factual." },
      { type:"tip", text:"Construye tu biblioteca de restricciones favoritas. Con el tiempo tendrás un conjunto de negaciones que añades automáticamente según el tipo de tarea — eliminando los problemas que te has encontrado antes." },
    ]},
    quiz:[
      { question:"¿Por qué son útiles los prompts negativos?", options:["Hacen al modelo más creativo","Eliminan proactivamente comportamientos no deseados que el modelo haría por defecto","Reducen el costo de tokens","Son más claros que las instrucciones positivas"], correctIndex:1, explanation:"Los modelos tienen comportamientos por defecto (bullets, introducciones genéricas, frases de relleno). Los negativos eliminan estos vicios antes de que aparezcan.", order:1 },
    ]
  },
  {
    number:6, slug:"pe-temperature-parametros", title:"Temperature y top-p: controla la creatividad",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"Temperature controla la aleatoriedad de las respuestas. Temperature 0: el modelo siempre elige el token más probable — respuestas deterministas y repetitivas. Temperature 1 (default): balance entre coherencia y variedad. Temperature 2: muy aleatorio, puede ser incoherente. Para código o datos: usa 0. Para escritura creativa: usa 0.7-1.2." },
      { type:"text", text:"Top-p (nucleus sampling): en lugar de fijar la aleatoriedad, elige del conjunto de tokens que suman el p% de probabilidad. Top-p 0.9 = elige aleatoriamente de los tokens más probables que suman el 90% de la masa de probabilidad. Más matizado que temperature." },
      { type:"callout", text:"En la mayoría de APIs, temperature y top-p se recomienda ajustar solo uno a la vez, no ambos simultáneamente. Anthropic recomienda ajustar temperature y dejar top-p en su default." },
      { type:"text", text:"Guía práctica: extracción de datos estructurados (JSON, tablas) → temperature 0. Respuestas de chatbot → 0.3-0.7. Escritura creativa → 0.7-1.0. Brainstorming → 0.8-1.2. Código → 0-0.3." },
      { type:"tip", text:"Muchos usuarios nunca tocan temperature y usan el default. Es suficiente para la mayoría de casos. Ajústala solo cuando notes que las respuestas son demasiado repetitivas (sube) o demasiado inconsistentes (baja)." },
    ]},
    quiz:[
      { question:"¿Para generar código Python que siempre funcione igual, qué temperature usarías?", options:["1.5 — máxima creatividad","0.8 — balance entre creatividad y consistencia","0 o muy cercano a 0 — respuestas deterministas","2 — máxima variedad"], correctIndex:2, explanation:"Para código correcto y reproducible, temperature 0 (o muy baja) garantiza que el modelo elige el token más probable en cada paso, resultando en código más predecible.", order:1 },
    ]
  },
  {
    number:7, slug:"pe-formato-output", title:"Controla el formato de salida: JSON, Markdown, XML",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"text", text:"Especificar el formato de salida es una de las partes más importantes del prompt engineering para aplicaciones. Un modelo puede darte la misma información en texto libre, JSON estructurado, Markdown formateado o XML — y cada uno tiene su lugar." },
      { type:"heading", text:"JSON para datos estructurados" },
      { type:"text", text:"Cuando necesitas procesar la respuesta programáticamente, pide JSON. Sé explícito sobre la estructura: 'Responde SOLO con JSON válido siguiendo este esquema: {\"nombre\": string, \"edad\": number, \"habilidades\": string[]}. Sin texto adicional, sin markdown, solo el JSON.' Con temperatura 0 y esta instrucción, obtendrás JSON parseble consistentemente." },
      { type:"heading", text:"Markdown para documentos" },
      { type:"text", text:"Para contenido destinado a ser leído por humanos en interfaces que renderizan Markdown, especifica el uso de headers, bullets y bold. Para texto plano (emails, SMS, bases de datos), especifica 'sin Markdown'." },
      { type:"callout", text:"Anthropic recomienda en su documentación usar XML tags para estructurar prompts complejos. Claude responde especialmente bien a outputs estructurados con XML porque fue entrenado con mucho texto en ese formato." },
      { type:"tip", text:"Técnica avanzada: incluye un ejemplo del JSON schema vacío en el prompt. El modelo completará la estructura exactamente como mostraste — mucho más efectivo que describir el schema en palabras." },
    ]},
    quiz:[
      { question:"¿Cuándo es imprescindible pedir output en JSON?", options:["Siempre que quieras respuestas cortas","Cuando la respuesta será procesada programáticamente por código","Cuando el usuario quiere ver la respuesta formateada","Para respuestas en múltiples idiomas"], correctIndex:1, explanation:"JSON es necesario cuando tu código necesita parsear la respuesta. Sin formato estructurado, parsear texto libre es frágil y propenso a errores.", order:1 },
    ]
  },
  {
    number:8, slug:"pe-prompt-chaining", title:"Prompt chaining: divide y vencerás",
    type:LessonType.VIDEO, durationMin:6, xpReward:75,
    content:{ blocks:[
      { type:"text", text:"El prompt chaining es encadenar múltiples llamadas al modelo donde el output de una es el input de la siguiente. En lugar de un prompt gigante que hace todo, divides la tarea en pasos más pequeños y manejables." },
      { type:"text", text:"Ejemplo: analizar un documento largo. Paso 1: extrae los puntos clave. Paso 2: identifica contradicciones entre los puntos clave. Paso 3: genera recomendaciones basadas en las contradicciones. Tres prompts simples producen un resultado más profundo que un solo prompt complejo." },
      { type:"callout", text:"La investigación muestra que los modelos tienen mejor rendimiento en tareas específicas y acotadas que en tareas amplias y complejas. El prompt chaining te permite aprovechar esa especialización." },
      { type:"text", text:"Casos de uso ideales para prompt chaining: generación de contenido largo (outline → sección por sección → revisión), análisis de datos (limpieza → análisis → visualización de insights), código complejo (arquitectura → implementación → testing → documentación)." },
      { type:"tip", text:"En LangChain, los chains son la implementación técnica de prompt chaining. En automático con herramientas como Zapier o Make, cada paso de un flujo puede ser un prompt diferente encadenado al anterior." },
    ]},
    quiz:[
      { question:"¿Cuál es la ventaja principal del prompt chaining sobre un solo prompt complejo?", options:["Es más barato en tokens","Los modelos tienen mejor rendimiento en tareas acotadas; dividir mejora la calidad de cada paso","Funciona sin API","Es más rápido de ejecutar"], correctIndex:1, explanation:"Los modelos se desempeñan mejor cuando se les pide una cosa a la vez. Dividir tareas complejas en pasos mejora la calidad total del resultado.", order:1 },
    ]
  },
  {
    number:9, slug:"pe-meta-prompting", title:"Meta-prompting: usa IA para crear mejores prompts",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"Meta-prompting es pedirle al modelo que genere o mejore prompts. El modelo conoce sus propias capacidades y limitaciones — puede ayudarte a formular preguntas de forma más efectiva. Es uno de los trucos más poderosos y menos conocidos del prompt engineering." },
      { type:"text", text:"Flujo básico: describe tu objetivo en lenguaje natural → pide al modelo que genere un prompt óptimo para ese objetivo → usa ese prompt generado → itera. El modelo suele generar prompts más específicos y efectivos que los que escribirías manualmente." },
      { type:"callout", text:"Prompt para generar prompts: 'Eres un experto en prompt engineering para [modelo]. Voy a describir una tarea y quiero que generes el prompt óptimo para obtener los mejores resultados. La tarea es: [descripción]. Genera el prompt completo incluyendo rol, contexto, instrucción, formato y restricciones.'" },
      { type:"tip", text:"Variante: 'Revisa este prompt y mejóralo: [tu prompt]. Identifica qué información falta, qué es ambiguo y cómo podría ser más específico.' Usar el modelo como revisor de prompts es tan poderoso como usarlo para generarlos." },
    ]},
    quiz:[
      { question:"¿Por qué el meta-prompting puede ser más efectivo que escribir prompts manualmente?", options:["Porque el modelo sabe mejor que tú lo que quieres","El modelo conoce sus propias capacidades y cómo formular instrucciones que las aprovechen mejor","Porque es más rápido","Porque los prompts generados son más cortos"], correctIndex:1, explanation:"El modelo tiene conocimiento interno de cómo responde mejor a distintos tipos de instrucciones, haciendo sus prompts generados más efectivos.", order:1 },
    ]
  },
  {
    number:10, slug:"pe-prompts-codigo", title:"Prompts para código: el arte de pedir funciones perfectas",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"text", text:"El código es el caso de uso donde el prompt engineering tiene el mayor impacto económico inmediato. Un prompt de código bien formulado puede ahorrar horas de trabajo. Los elementos clave: lenguaje y versión, input/output esperado, casos borde a manejar, estilo de código y docstrings." },
      { type:"heading", text:"El prompt de código ideal" },
      { type:"text", text:"'Escribe una función Python 3.11 llamada [nombre] que recibe [inputs con tipos] y retorna [output con tipo]. Debe manejar los siguientes casos borde: [lista]. Incluye docstring estilo Google. Añade type hints. No uses librerías externas. Incluye 3 tests con pytest que cubran casos normales y borde.'" },
      { type:"callout", text:"El 'rubber duck debugging' con IA: pega tu código que no funciona y dile 'Este código debería hacer X pero hace Y. Explica por qué falla y cómo arreglarlo.' El proceso de explicar el problema al modelo frecuentemente revela el bug antes de que el modelo responda." },
      { type:"text", text:"Para refactoring: 'Refactoriza este código para: (1) reducir la complejidad ciclomática, (2) eliminar duplicación, (3) mejorar los nombres de variables. Muestra el código original y el refactorizado con una explicación de cada cambio.'" },
      { type:"tip", text:"Especifica siempre el contexto del proyecto: 'Este código es parte de una API FastAPI que maneja...'. El modelo genera código más apropiado cuando entiende el contexto más amplio." },
    ]},
    quiz:[
      { question:"¿Qué información es más importante incluir en un prompt de código?", options:["El nombre del programador que lo usará","Lenguaje/versión, tipos de input/output, casos borde y estilo esperado","La fecha de entrega","El nivel de experiencia del desarrollador"], correctIndex:1, explanation:"El modelo necesita saber exactamente qué entra, qué sale, qué casos especiales manejar y en qué estilo. Sin eso, el código puede no servir para tu caso.", order:1 },
    ]
  },
  {
    number:11, slug:"pe-prompts-escritura", title:"Prompts para escritura profesional",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"La escritura profesional es donde muchos profesionales tienen el mayor ROI inmediato del prompt engineering. Emails, informes, presentaciones, propuestas — todo mejora con prompts bien formulados. Las variables clave: audiencia, tono, longitud, objetivo y acción que buscas." },
      { type:"text", text:"Framework para emails: 'Escribe un email [tono: formal/casual/urgente] de [longitud: X palabras] al [audiencia: cargo/empresa] sobre [tema]. El objetivo es [qué quieres lograr]. Incluye [elementos específicos]. No incluyas [cosas a evitar]. Firma como [tu nombre y cargo].'" },
      { type:"callout", text:"El poder del 'revisor implacable': 'Actúa como un editor profesional. Revisa este texto e identifica: (1) frases innecesarias, (2) palabras débiles que puedes hacer más precisas, (3) pasivas que pueden ser activas, (4) repeticiones. Proporciona el texto revisado y una lista de cambios con justificación.'" },
      { type:"tip", text:"Para mantener tu voz: primero escribe un borrador tú mismo, luego pide al modelo que lo mejore manteniendo tu estilo. Es mucho más efectivo que pedir al modelo que escriba desde cero — el resultado suena más auténtico." },
    ]},
    quiz:[
      { question:"¿Por qué es mejor escribir un borrador propio antes de pedir al modelo que lo mejore?", options:["Es más barato en tokens","El resultado mantiene tu voz y estilo auténtico en lugar de sonar genérico","El modelo no puede escribir desde cero","Es más rápido"], correctIndex:1, explanation:"El modelo que mejora texto existente preserva la voz del autor. El modelo que escribe desde cero produce texto que suena 'de IA'.", order:1 },
    ]
  },
  {
    number:12, slug:"pe-biblioteca-prompts", title:"Construye tu biblioteca de prompts",
    type:LessonType.READING, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"Los prompts son activos reutilizables. Cada vez que creas un prompt que funciona bien, deberías guardarlo. Con el tiempo construyes una biblioteca personal que multiplica tu productividad — no empiezas desde cero cada vez." },
      { type:"text", text:"Estructura recomendada para tu biblioteca: categoría (código/escritura/análisis/investigación), modelo óptimo para ese prompt, variables que hay que rellenar, ejemplo de output esperado, y casos de uso específicos donde funciona bien." },
      { type:"callout", text:"Herramientas gratuitas para gestionar prompts: Notion (crear una base de datos de prompts), PromptLayer (tracking de prompts y resultados), o simplemente una carpeta de archivos .txt bien organizados. La herramienta importa menos que el hábito de guardar." },
      { type:"tip", text:"Los mejores prompts se escriben iterando — no salen perfectos la primera vez. Mantén un registro de versiones: cuando mejoras un prompt, guarda la versión anterior. Los cambios que empeorar un prompt son tan informativos como los que lo mejoran." },
    ]},
    quiz:[
      { question:"¿Por qué es valioso mantener una biblioteca de prompts?", options:["Para no tener que pagar por la API","Los prompts que funcionan bien son activos reutilizables que ahorran tiempo en el futuro","Para cumplir con regulaciones de IA","Para poder compartirlos con otros"], correctIndex:1, explanation:"Cada buen prompt que guardas es tiempo ahorrado en el futuro. Una biblioteca de prompts es uno de los activos de productividad más valiosos de un profesional que trabaja con IA.", order:1 },
    ]
  },
  {
    number:13, slug:"pe-prompts-investigacion", title:"Prompts para investigación y síntesis",
    type:LessonType.VIDEO, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"Los LLMs son extraordinariamente buenos para sintetizar información de múltiples fuentes — pero tienes que verificar los hechos. El flujo óptimo: usa el modelo para estructurar, identificar gaps, formular preguntas de búsqueda y sintetizar. Usa fuentes primarias para los hechos específicos." },
      { type:"text", text:"Prompt de síntesis: 'Actúa como un investigador experto en [tema]. He aquí varios fragmentos de información: [pega los fragmentos]. Sintetiza los puntos clave en 5 bullets, identifica las contradicciones entre fuentes y lista las 3 preguntas más importantes que estos fragmentos no responden.'" },
      { type:"callout", text:"Prompt anti-alucinación para investigación: 'Responde SOLO con información de la que estés altamente seguro. Para cada afirmación factual específica, indica tu nivel de confianza: [ALTO], [MEDIO], [BAJO]. Si no sabes algo, dilo directamente.'" },
      { type:"tip", text:"Para investigación con Perplexity.ai: es un motor de búsqueda con IA que cita fuentes en tiempo real. Es mejor que ChatGPT para hechos actuales porque accede a internet. Úsalos en combinación: Perplexity para hechos verificados, Claude/ChatGPT para síntesis y razonamiento." },
    ]},
    quiz:[
      { question:"¿Qué debes hacer siempre al usar LLMs para investigación factual?", options:["Confiar completamente en el modelo porque tiene todo el conocimiento de internet","Verificar los hechos específicos con fuentes primarias — el modelo puede alucinar con confianza","Usar siempre temperatura 0 para garantizar la precisión","Pedir que el modelo cite sus fuentes (aunque no pueda verificarlas)"], correctIndex:1, explanation:"Los LLMs pueden generar información incorrecta con aparente confianza. La síntesis y estructuración son sus puntos fuertes; la precisión factual requiere verificación.", order:1 },
    ]
  },
  {
    number:14, slug:"pe-quiz-torneo", title:"Quiz + Reto: El Gran Torneo de Prompts",
    type:LessonType.QUIZ, durationMin:10, xpReward:120,
    content:{ blocks:[{ type:"text", text:"El quiz de prompts más completo. 10 preguntas que cubren todas las técnicas. Necesitas 8/10 para completar el mundo y desbloquear el reto de battle de prompts." }]},
    quiz:[
      { question:"¿Qué hace Chain-of-Thought (CoT)?", options:["Encadena múltiples modelos","Hace que el modelo razone paso a paso antes de responder, mejorando en tareas complejas","Conecta prompts de diferentes usuarios","Vincula el prompt con la base de datos"], correctIndex:1, explanation:"CoT pide al modelo que muestre su razonamiento, lo que mejora la precisión especialmente en matemáticas y lógica.", order:1 },
      { question:"Para extraer JSON de un LLM de forma fiable, ¿qué debes hacer?", options:["Pedirlo amablemente","Especificar el schema exacto, usar temperatura 0, e instruir que no añada texto adicional","Usar un modelo específico para JSON","Postprocesar con regex"], correctIndex:1, explanation:"La combinación de schema explícito + temperatura baja + restricción de no añadir texto produce JSON parseble consistentemente.", order:2 },
      { question:"¿Qué es el 'Efecto de recencia' en few-shot prompting?", options:["Que los modelos más nuevos son mejores","Los modelos ponderan más los ejemplos más recientes en el prompt","Que los prompts recientes son más efectivos","Que hay que actualizar los prompts regularmente"], correctIndex:1, explanation:"Los LLMs tienen sesgo hacia el final del contexto. Los últimos ejemplos few-shot tienen más influencia que los primeros.", order:3 },
      { question:"¿Para qué tarea usarías temperature = 0?", options:["Escribir un poema creativo","Generar múltiples ideas de negocio","Extraer datos estructurados de un contrato","Hacer brainstorming de nombres de marca"], correctIndex:2, explanation:"Extracción de datos requiere precisión y reproducibilidad. Temperature 0 maximiza la determinismo del modelo.", order:4 },
      { question:"¿Qué añadir a un prompt para reducir alucinaciones en tareas factuales?", options:["'Sé lo más creativo posible'","'Si no estás seguro de un dato, dilo explícitamente en lugar de inventarlo'","'Usa temperatura alta'","'Responde en el idioma más largo posible'"], correctIndex:1, explanation:"Instructing the model to admit uncertainty reduces confabulation — the model tends to follow explicit instructions about its epistemic behavior.", order:5 },
    ]
  },
  {
    number:15, slug:"pe-proyecto-20-prompts", title:"Proyecto: 20 prompts profesionales para tu industria",
    type:LessonType.PROJECT, durationMin:30, xpReward:200,
    content:{ blocks:[
      { type:"heading", text:"El proyecto más práctico del Nivel 2" },
      { type:"text", text:"Crea una biblioteca de 20 prompts profesionales para tu área de interés (educación, marketing, programación, negocios, arte, ciencias). Cada prompt debe: tener un caso de uso claro, incluir todos los elementos (rol, contexto, instrucción, formato), mostrar un ejemplo de output real, y estar probado con al menos un modelo." },
      { type:"callout", text:"Criterio de calidad: cada prompt debe resolver un problema real que tendrías en tu trabajo o estudios. No prompts genéricos — prompts específicos y útiles para ti." },
      { type:"tip", text:"Formato sugerido para documentar cada prompt: Nombre, Caso de uso, Modelo recomendado, Prompt completo, Variables a rellenar, Ejemplo de output, Notas de uso. Usa Notion o una hoja de cálculo." },
    ]},
    quiz:[]
  },
  {
    number:16, slug:"pe-evaluacion-practica", title:"Evaluación práctica de prompts en casos reales",
    type:LessonType.EVALUATION, durationMin:20, xpReward:150,
    content:{ blocks:[
      { type:"heading", text:"Evaluación del Mundo 11" },
      { type:"text", text:"Se te presentarán 5 prompts reales con sus outputs. Debes identificar qué técnicas usan, qué mejorarías y por qué. Luego escribe una versión mejorada de 2 de ellos." },
    ]},
    quiz:[]
  },
];

const MUNDO12: any[] = [
  {
    number:1, slug:"gpt-interfaz-funciones-avanzadas", title:"ChatGPT: funciones avanzadas que probablemente no conoces",
    type:LessonType.VIDEO, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"La interfaz de ChatGPT esconde funcionalidades poderosas que la mayoría de usuarios ignoran. Más allá del chat básico: memory (recuerda conversaciones pasadas), Canvas (editor colaborativo), análisis de datos con Code Interpreter, GPTs personalizados, y búsqueda web en tiempo real." },
      { type:"heading", text:"Memory: ChatGPT que te recuerda" },
      { type:"text", text:"Con Memory activado, ChatGPT recuerda información sobre ti entre conversaciones: tu trabajo, preferencias, proyectos, contexto personal. Puedes ver y editar qué recuerda desde Configuración → Personalización → Memoria. Funciona con GPT-4o y versiones superiores." },
      { type:"heading", text:"Canvas: colaboración en documentos" },
      { type:"text", text:"Canvas abre un editor de texto o código en paralelo al chat. En lugar de pegar y copiar respuestas, editas directamente en el documento. ChatGPT puede ver el documento completo y hacer cambios específicos que señalas. Es el flujo de trabajo más eficiente para escribir con IA." },
      { type:"tip", text:"Para proyectos largos, la combinación Projects + Memory + Canvas de ChatGPT es actualmente el mejor flujo de trabajo para escritura y código de larga duración en la interfaz web. Sin código, sin API — solo el producto." },
    ]},
    quiz:[
      { question:"¿Qué permite la funcionalidad Memory de ChatGPT?", options:["Guardar conversaciones localmente","Que ChatGPT recuerde información sobre ti entre conversaciones distintas","Hacer la IA más rápida","Guardar prompts favoritos"], correctIndex:1, explanation:"Memory permite persistencia de contexto entre sesiones, haciendo que ChatGPT personalice sus respuestas según lo que ya sabe de ti.", order:1 },
    ]
  },
  {
    number:2, slug:"gpt-gpt4o-modelos", title:"GPT-4o, o1 y los modelos de OpenAI: cuándo usar cada uno",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"OpenAI tiene múltiples modelos con distintos trade-offs. GPT-4o (omni) es el modelo principal: multimodal (texto, imagen, audio), rápido y más barato que versiones anteriores. GPT-4o mini: más rápido y económico, ideal para tareas simples. o1 y o3: modelos de razonamiento que piensan antes de responder — equivalente al Extended Thinking de Claude." },
      { type:"heading", text:"Cuándo usar o1 / o3" },
      { type:"text", text:"Los modelos o1/o3 de OpenAI están diseñados para problemas que requieren razonamiento profundo: matemáticas avanzadas, código complejo, análisis científico, problemas de lógica multi-paso. Son significativamente más lentos y caros que GPT-4o pero superan en tareas de razonamiento." },
      { type:"callout", text:"Regla práctica: GPT-4o para el 80% de tareas diarias. o1/o3 para el 20% que requiere razonamiento profundo. La diferencia de rendimiento en tareas complejas justifica el mayor costo." },
      { type:"tip", text:"Los modelos de OpenAI se versionan con fechas (gpt-4o-2024-11-20). Sin versión específica, usas la más reciente. En producción, ancla siempre a una versión específica para evitar cambios de comportamiento inesperados." },
    ]},
    quiz:[
      { question:"¿Para qué tipo de tarea están diseñados los modelos o1/o3 de OpenAI?", options:["Generación rápida de texto creativo","Razonamiento profundo multi-paso: matemáticas, código complejo, lógica","Procesamiento de imágenes en tiempo real","Respuestas en múltiples idiomas"], correctIndex:1, explanation:"o1/o3 usa 'razonamiento interno' antes de responder, similar al Extended Thinking de Claude, mejorando dramáticamente en tareas que requieren planificación.", order:1 },
    ]
  },
  {
    number:3, slug:"gpt-code-interpreter", title:"Code Interpreter: ChatGPT que ejecuta código",
    type:LessonType.VIDEO, durationMin:6, xpReward:75,
    content:{ blocks:[
      { type:"text", text:"Code Interpreter es una de las funcionalidades más poderosas de ChatGPT Plus. Ejecuta código Python real en un sandbox y puede: analizar archivos CSV y Excel, crear visualizaciones, procesar imágenes, hacer cálculos estadísticos, generar PDFs y convertir formatos de archivo." },
      { type:"heading", text:"Casos de uso inmediatos" },
      { type:"text", text:"Análisis de datos sin saber Python: sube tu CSV, describe en lenguaje natural qué quieres saber, ChatGPT escribe y ejecuta el código, te muestra los resultados visualizados. Conversión de formato: sube un Excel mal formateado, pide que lo limpie y lo exporte como CSV. Edición de imágenes básica: recortar, redimensionar, cambiar formato." },
      { type:"callout", text:"Code Interpreter no tiene acceso a internet ni puede ejecutar código que accede a sistemas externos. Es un sandbox aislado — lo que lo hace seguro para datos confidenciales pero limita lo que puede hacer." },
      { type:"tip", text:"Para análisis de datos de empresa: Code Interpreter puede procesar archivos con datos sensibles sin que salgan del sandbox (y de los servidores de OpenAI, que tienen acuerdos de privacidad para datos de empresa en el tier ChatGPT Enterprise)." },
    ]},
    quiz:[
      { question:"¿Qué puede hacer Code Interpreter que el chat normal no puede?", options:["Responder preguntas más inteligentes","Ejecutar código Python real y procesar archivos como CSV, imágenes y Excel","Acceder a internet en tiempo real","Recordar conversaciones pasadas"], correctIndex:1, explanation:"Code Interpreter ejecuta código real en un sandbox, permitiendo análisis de datos, visualizaciones y procesamiento de archivos que el chat normal solo puede describir.", order:1 },
    ]
  },
  {
    number:4, slug:"gpt-gpts-marketplace", title:"GPTs personalizados: el marketplace de ChatGPT",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"text", text:"GPTs son versiones personalizadas de ChatGPT que cualquier usuario puede crear y publicar. Tienen un system prompt fijo, pueden incluir archivos de conocimiento, conectarse a APIs externas y tener capacidades específicas activadas. El marketplace de OpenAI tiene millones de GPTs." },
      { type:"heading", text:"GPTs útiles que existen hoy" },
      { type:"text", text:"Consensus: busca en papers académicos y te resume hallazgos científicos con citas. Canva: genera diseños directamente desde ChatGPT. Code Copilot: especializado en programación con herramientas extra. DALL-E: generación de imágenes integrada en conversación. Scholar AI: análisis de papers en PDF." },
      { type:"heading", text:"Crear tu propio GPT" },
      { type:"text", text:"Crear un GPT básico toma menos de 10 minutos: ve a chatgpt.com/gpts/editor, describe qué quieres que haga, sube archivos de conocimiento si los tienes, prueba y publica. Puedes crear GPTs privados (solo para ti) o públicos (cualquiera puede usarlos)." },
      { type:"tip", text:"El GPT Builder usa GPT-4 para configurar el GPT por ti a través de conversación. Le describes lo que quieres y él genera el system prompt. Es meta-prompting en acción." },
    ]},
    quiz:[
      { question:"¿Qué es un GPT personalizado en el contexto de ChatGPT?", options:["Una versión más inteligente de ChatGPT que se vende por separado","Una versión de ChatGPT con system prompt, conocimiento y herramientas específicas para un caso de uso","Un modelo entrenado desde cero por un usuario","Una alternativa open source de ChatGPT"], correctIndex:1, explanation:"Los GPTs son configuraciones personalizadas de ChatGPT — mismo modelo base pero con instrucciones, conocimiento y herramientas específicas para una tarea.", order:1 },
    ]
  },
  {
    number:5, slug:"gpt-limites-alucinaciones", title:"Límites y alucinaciones: cuándo no confiar en ChatGPT",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"Conocer los límites de ChatGPT es tan importante como conocer sus capacidades. Las principales áreas donde falla: hechos recientes (fecha de corte de conocimiento), matemáticas precisas sin Code Interpreter, citas y referencias (puede inventarlas), información privada de empresas, y cualquier tarea que requiera datos actualizados." },
      { type:"text", text:"Alucinación de citas: ChatGPT puede generar referencias bibliográficas que suenan perfectamente reales pero no existen. Autores reales + títulos inventados + años plausibles. Nunca confíes en una cita de ChatGPT sin verificarla en Google Scholar o la fuente directa." },
      { type:"callout", text:"Regla de oro para uso profesional: usa ChatGPT para razonar, sintetizar y estructurar. Usa fuentes primarias para los hechos específicos que importan. La combinación de ambos — IA para la estructura, humano para la verificación — produce el mejor resultado." },
      { type:"tip", text:"Para detectar si ChatGPT está inventando algo: pregúntale qué tan seguro está y pedirle que liste sus fuentes. Cuando empieza a dudar o a decir 'no tengo acceso a información reciente', es una señal de que está al límite de su conocimiento confiable." },
    ]},
    quiz:[
      { question:"¿Por qué nunca debes citar directamente una referencia bibliográfica de ChatGPT sin verificarla?", options:["Porque ChatGPT solo conoce libros en inglés","Porque puede generar citas que suenan reales pero son completamente inventadas","Porque las citas siempre están desactualizadas","Porque viola los términos de servicio de OpenAI"], correctIndex:1, explanation:"La alucinación de citas es uno de los fallos más documentados de los LLMs — mezclan información real con detalles inventados de forma convincente.", order:1 },
    ]
  },
  {
    number:6, slug:"gpt-practica-primer-gpt", title:"Práctica: crea tu primer GPT personalizado",
    type:LessonType.PRACTICE, durationMin:20, xpReward:150,
    content:{ blocks:[
      { type:"heading", text:"Crea un GPT útil para tu vida" },
      { type:"text", text:"Crea un GPT personalizado para un caso de uso concreto: tutor de un idioma específico, revisor de tu tipo de escritura, asistente de tu materia difícil, o especialista en el área donde trabajas." },
      { type:"callout", text:"Requisitos mínimos: system prompt con rol, objetivo y 3+ restricciones; al menos un archivo de conocimiento subido; nombre y descripción claros; probado con 10 conversaciones de ejemplo." },
      { type:"tip", text:"El system prompt de un buen GPT tiene: persona clara, casos de uso específicos, ejemplos de cómo responder bien, y restricciones de lo que no debe hacer. Trata el system prompt del GPT con el mismo cuidado que el código." },
    ]},
    quiz:[]
  },
  {
    number:7, slug:"gpt-proyecto-gpt-real", title:"Proyecto: GPT personalizado para un caso de uso real",
    type:LessonType.PROJECT, durationMin:30, xpReward:200,
    content:{ blocks:[
      { type:"heading", text:"Proyecto del Mundo 12" },
      { type:"text", text:"Construye un GPT que resuelva un problema real para un usuario real (puede ser para ti). Documenta el proceso completo: problema identificado, diseño del system prompt (con versiones), archivos de conocimiento, pruebas realizadas, mejoras iterativas. Publica el GPT y comparte el link en tu portafolio." },
      { type:"callout", text:"Evaluación: el GPT será probado con 10 preguntas relacionadas con su caso de uso. Se evaluará precisión, utilidad y si maneja correctamente los casos borde." },
    ]},
    quiz:[]
  },
];

async function main() {
  console.log("🌱 Insertando Mundos 11 (Prompting) y 12 (ChatGPT)...\n");
  let total = 0;

  const mundos = [
    { slug:"prompt-engineering", data: MUNDO11, label:"Mundo 11 — Prompt Engineering" },
    { slug:"dominando-chatgpt", data: MUNDO12, label:"Mundo 12 — ChatGPT" },
  ];

  for (const { slug, data, label } of mundos) {
    const world = await prisma.world.findFirst({
      where: { slug: { contains: slug.split("-")[0] } }
    });
    if (!world) {
      console.warn(`⚠️  ${label}: buscando por slug parcial '${slug}'...`);
      const worlds = await prisma.world.findMany({ where: { level: { number: 2 } }, orderBy: { order: "asc" } });
      console.log(`   Mundos disponibles en Nivel 2: ${worlds.map(w => w.slug).join(", ")}`);
      continue;
    }

    console.log(`\n📚 ${label} (${data.length} lecciones) → ${world.name}`);
    for (const l of data) {
      const lesson = await prisma.lesson.upsert({
        where: { slug: l.slug },
        create: { number:l.number, title:l.title, slug:l.slug, type:l.type as any, durationMin:l.durationMin, xpReward:l.xpReward, content:l.content, order:l.number, isPublished:true, worldId:world.id },
        update: { content:l.content, isPublished:true, title:l.title },
      });
      if (l.quiz?.length) {
        await prisma.quizQuestion.deleteMany({ where:{ lessonId:lesson.id } });
        for (const q of l.quiz) await prisma.quizQuestion.create({ data:{ ...q, lessonId:lesson.id } });
      }
      total++;
      process.stdout.write(`\r  ✅ ${total}: ${l.title.slice(0,55)}`);
    }
  }

  console.log(`\n\n🚀 ${total} lecciones insertadas. Mundos 11 y 12 completos.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
