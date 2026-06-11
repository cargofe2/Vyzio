// prisma/seed-nivel1-mundos2-3-4.ts
// Mundos 2, 3 y 4 del Nivel 1 — contenido completo con texto educativo real
// Fuentes: Wikipedia CC BY-SA, arXiv papers open access, documentación pública
// Run: npx tsx prisma/seed-nivel1-mundos2-3-4.ts

import { PrismaClient, LessonType } from "@prisma/client";
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// MUNDO 2 — Historia de la IA (15 lecciones)
// ─────────────────────────────────────────────────────────────
const MUNDO2: any[] = [
  {
    number:2, slug:"ia-historia-turing-test", title:"El Test de Turing: ¿puede una máquina engañarte?",
    type:LessonType.READING, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"En 1950 Alan Turing publicó 'Computing Machinery and Intelligence' en la revista Mind. La pregunta central: '¿Pueden pensar las máquinas?' Para responderla propuso el Juego de Imitación — hoy conocido como Test de Turing." },
      { type:"callout", text:"El experimento: un juez humano conversa por escrito con una máquina y un humano sin saber cuál es cuál. Si no puede distinguirlos, la máquina 'pasa' el test. Era 1950. El primer chatbot que pasó el test de forma convincente llegó en 2014." },
      { type:"text", text:"Turing predijo en ese mismo paper que para el año 2000 una máquina podría engañar a un juez humano el 30% del tiempo en una conversación de 5 minutos. Con los LLMs modernos esa predicción se quedó corta — hoy engañan mucho más." },
      { type:"text", text:"El Test de Turing tiene críticos importantes. John Searle propuso el 'Cuarto Chino': un sistema puede manipular símbolos correctamente sin entender nada. Pasar el test no prueba inteligencia, prueba imitación. Este debate filosófico sigue abierto." },
      { type:"tip", text:"El paper original de Turing está disponible gratuitamente en línea. 'Computing Machinery and Intelligence' (1950) es uno de los textos fundacionales de la ciencia de la computación y es completamente accesible para lectores no técnicos." },
    ]},
    quiz:[
      { question:"¿Qué prueba el Test de Turing según sus críticos?", options:["Que la máquina puede pensar","Que la máquina puede imitar el lenguaje humano, no necesariamente que entiende","Que la IA es superior al humano","Que el lenguaje es la base de la inteligencia"], correctIndex:1, explanation:"El Cuarto Chino de Searle argumenta que manipular símbolos correctamente no implica comprensión. El test mide imitación, no inteligencia.", order:1 },
      { question:"¿En qué año Turing publicó el paper que propuso el Test de Turing?", options:["1936","1945","1950","1966"], correctIndex:2, explanation:"'Computing Machinery and Intelligence' fue publicado en la revista Mind en octubre de 1950.", order:2 },
    ]
  },
  {
    number:3, slug:"ia-historia-dartmouth-1956", title:"1956: La conferencia que nombró la IA",
    type:LessonType.VIDEO, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"El verano de 1956 en Dartmouth College fue el momento fundacional. John McCarthy, Marvin Minsky, Claude Shannon y otros 7 investigadores se reunieron con una propuesta audaz: que el aprendizaje y la inteligencia podían describirse con tanta precisión que se podía simular en una máquina." },
      { type:"callout", text:"McCarthy eligió el nombre 'Inteligencia Artificial' deliberadamente para diferenciarse del campo de Norbert Wiener (Cibernética). La competencia académica moldeó el nombre de toda una disciplina." },
      { type:"text", text:"La propuesta original prometía resolver los problemas fundamentales de la IA en un solo verano de trabajo. Esa confianza — que hoy parece ingenua — definió el tono del campo por décadas: promesas ambiciosas seguidas de decepciones y 'inviernos' de financiamiento." },
      { type:"text", text:"Los participantes de Dartmouth fueron los padres fundadores: McCarthy creó LISP, el lenguaje de programación de IA dominante durante décadas. Minsky cofundó el MIT AI Lab. Shannon era el padre de la teoría de la información. Era el equivalente al garaje de Jobs y Wozniak, pero para la IA." },
      { type:"tip", text:"La propuesta original de la conferencia de Dartmouth está disponible en línea. Leerla hoy es fascinante: los problemas que identificaron en 1956 siguen siendo los problemas centrales de la IA en 2025." },
    ]},
    quiz:[
      { question:"¿Por qué McCarthy eligió el nombre 'Inteligencia Artificial'?", options:["Era el más descriptivo técnicamente","Para diferenciarse del campo de la Cibernética de Norbert Wiener","Porque sonaba más comercial","Porque Turing lo sugirió"], correctIndex:1, explanation:"McCarthy quería distanciarse del campo de Wiener y establecer una disciplina independiente.", order:1 },
    ]
  },
  {
    number:4, slug:"ia-historia-primeros-chatbots", title:"ELIZA y PARRY: los primeros chatbots que asustaron a los humanos",
    type:LessonType.READING, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"En 1966 Joseph Weizenbaum del MIT creó ELIZA, el primer chatbot conversacional. ELIZA simulaba un terapeuta rogeriano: respondía preguntas con otras preguntas y reflejaba las palabras del usuario. Su script más famoso se llamaba DOCTOR." },
      { type:"callout", text:"Weizenbaum quedó en shock cuando los usuarios — incluyendo su propia secretaria — empezaron a confiar emocionalmente en ELIZA y pedían privacidad para hablar con ella. Un programa de 200 líneas de código generaba vínculos emocionales reales." },
      { type:"text", text:"En 1972 Kenneth Colby creó PARRY, un chatbot que simulaba a una persona con esquizofrenia paranoide. Era tan convincente que psiquiatras expertos no podían distinguirlo de transcripciones reales de pacientes. ELIZA y PARRY 'conversaron' entre sí a través de ARPANET en 1972 — la primera conversación entre AIs de la historia." },
      { type:"text", text:"El 'Efecto ELIZA' sigue siendo relevante hoy: la tendencia humana a atribuir comprensión, emoción e intencionalidad a sistemas que simplemente siguen patrones. Cuando te parece que ChatGPT 'te entiende', estás experimentando una versión moderna del mismo efecto." },
      { type:"tip", text:"Puedes interactuar con una recreación de ELIZA en línea hoy mismo. Busca 'ELIZA chatbot online'. Después de unos minutos entenderás por qué Weizenbaum quedó perturbado — y escribió un libro criticando la IA." },
    ]},
    quiz:[
      { question:"¿Qué es el 'Efecto ELIZA'?", options:["El primer bug documentado en un chatbot","La tendencia humana a atribuir comprensión y emoción a sistemas que siguen patrones","El algoritmo que usa ELIZA para responder","El año en que se creó el primer chatbot"], correctIndex:1, explanation:"El Efecto ELIZA describe cómo los humanos proyectan emoción e inteligencia en sistemas que simplemente hacen pattern matching.", order:1 },
    ]
  },
  {
    number:5, slug:"ia-historia-inviernos", title:"Los inviernos de la IA: cuando las promesas superaron los resultados",
    type:LessonType.VIDEO, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"La historia de la IA es cíclica: períodos de euforia y promesas exageradas seguidos de 'inviernos' donde el financiamiento colapsa y el campo se estanca. Hubo dos grandes inviernos: 1974-1980 y 1987-1993." },
      { type:"heading", text:"Primer invierno (1974-1980)" },
      { type:"text", text:"El informe Lighthill de 1973 concluyó que la IA no había producido nada de utilidad práctica. El gobierno británico recortó casi todo el financiamiento. DARPA en EE.UU. hizo lo mismo. El problema: los investigadores habían prometido traducción automática perfecta, comprensión del lenguaje y robots inteligentes en 10 años. 20 años después, ninguno estaba cerca." },
      { type:"heading", text:"Segundo invierno (1987-1993)" },
      { type:"text", text:"Los sistemas expertos — programas con miles de reglas escritas por humanos — fueron la gran promesa de los 80s. El mercado de hardware de IA llegó a $400M en 1987. Luego colapsó: los sistemas expertos eran frágiles, caros de mantener y no aprendían. El mercado se desplomó a $0 en dos años." },
      { type:"callout", text:"La lección de los inviernos: la IA tiene ciclos de hype de 10-20 años. El ciclo actual — iniciado con el deep learning en 2012 y acelerado con ChatGPT en 2022 — es el más largo y con más resultados reales de la historia. Pero la prudencia sobre las promesas sigue siendo necesaria." },
      { type:"tip", text:"El término 'AI Winter' fue acuñado en 1984 por los investigadores Richard Karp y otros. Reconocer los patrones históricos te hace mejor evaluador de las promesas actuales sobre AGI, superinteligencia y 'IA que lo cambia todo'." },
    ]},
    quiz:[
      { question:"¿Cuál fue la causa principal del primer invierno de la IA?", options:["Falta de computadoras suficientemente potentes","Las promesas de los investigadores superaron dramáticamente los resultados reales","Los gobiernos no querían IA","Los investigadores emigraron a otras áreas"], correctIndex:1, explanation:"Los investigadores prometieron traducción perfecta y robots inteligentes en una década. Dos décadas después no habían cumplido, y el financiamiento colapsó.", order:1 },
      { question:"¿Qué tecnología causó el segundo invierno de la IA (1987-1993)?", options:["Las redes neuronales","Los sistemas expertos basados en reglas","Los robots industriales","Los procesadores demasiado lentos"], correctIndex:1, explanation:"Los sistemas expertos eran caros de mantener, frágiles y no aprendían. El mercado de hardware IA colapsó cuando quedó claro que no escalaría.", order:2 },
    ]
  },
  {
    number:6, slug:"ia-historia-deep-blue", title:"Deep Blue vs Kasparov: la primera vez que una máquina venció al mejor humano",
    type:LessonType.VIDEO, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"El 11 de mayo de 1997 Deep Blue de IBM venció a Garry Kasparov, el mejor ajedrecista del mundo, en un match de 6 partidas. Fue portada de todas las revistas del mundo. TIME lo llamó 'el día en que la inteligencia artificial llegó'." },
      { type:"callout", text:"Kasparov acusó a IBM de trampa — dijo que algunas jugadas eran demasiado creativas para ser de una máquina. IBM nunca permitió una revancha completa y retiró Deep Blue inmediatamente. La controversia sigue." },
      { type:"text", text:"Deep Blue no jugaba ajedrez 'como un humano'. Evaluaba 200 millones de posiciones por segundo usando fuerza bruta más heurísticas de expertos. Era brillante en su dominio específico e incapaz de hacer cualquier otra cosa — el ejemplo perfecto de IA estrecha." },
      { type:"text", text:"El impacto cultural fue enorme pero el impacto técnico fue limitado. Deep Blue era una máquina especializada, no un avance en IA general. El salto real llegó 15 años después con el deep learning." },
      { type:"tip", text:"Para perspectiva: el smartphone que tienes en el bolsillo es miles de veces más rápido que Deep Blue. Hoy cualquier app de ajedrez gratuita en tu teléfono vencería cómodamente a Deep Blue y destruiría a Kasparov." },
    ]},
    quiz:[
      { question:"¿Cómo jugaba ajedrez Deep Blue?", options:["Aprendiendo de millones de partidas como hacen los modelos modernos","Evaluando 200 millones de posiciones por segundo con heurísticas de expertos (fuerza bruta)","Copiando las estrategias de los mejores ajedrecistas","Usando una red neuronal entrenada específicamente para ajedrez"], correctIndex:1, explanation:"Deep Blue era fuerza bruta + reglas de expertos, no aprendizaje automático. Era radicalmente diferente a cómo funciona la IA moderna.", order:1 },
    ]
  },
  {
    number:7, slug:"ia-historia-deep-learning-2012", title:"2012: La revolución del Deep Learning que nadie vio venir",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"text", text:"En septiembre de 2012, un equipo de la Universidad de Toronto liderado por Geoffrey Hinton presentó AlexNet en la competencia ImageNet. Su red neuronal profunda redujo el error de clasificación de imágenes del 26% al 15.3% — una mejora tan grande que los organizadores pensaron que había un error." },
      { type:"callout", text:"AlexNet tenía 60 millones de parámetros y fue entrenada en 2 GPUs NVIDIA GTX 580 durante una semana. Los mismos autores podrían entrenarlo hoy en minutos en una laptop moderna. La escala cambió todo." },
      { type:"text", text:"El truco no fue nuevo: las redes neuronales profundas existían desde los 80s. Lo que cambió en 2012 fue la convergencia de tres factores: datos masivos (ImageNet con 1.2M imágenes etiquetadas), poder de cómputo (GPUs), y el algoritmo de dropout de Hinton que prevenía el overfitting." },
      { type:"text", text:"Los tres autores de AlexNet — Geoffrey Hinton, Alex Krizhevsky e Ilya Sutskever — fueron inmediatamente reclutados por Google, que compró su empresa de dos personas por $44M. Ilya Sutskever luego cofundaría OpenAI. El ecosistema de la IA moderna se formó ese año." },
      { type:"tip", text:"Geoffrey Hinton ganó el Premio Nobel de Física 2024 junto a John Hopfield por sus contribuciones a las redes neuronales artificiales. Sus investigaciones desde los 80s hicieron posible toda la IA generativa actual." },
    ]},
    quiz:[
      { question:"¿Cuáles fueron los tres factores que hicieron posible la revolución del deep learning en 2012?", options:["Nuevos algoritmos, mejores matemáticas y más investigadores","Datos masivos, poder de cómputo (GPUs) y algoritmos mejorados como dropout","Mejores lenguajes de programación, más dinero y universidades","Internet, smartphones y computación en la nube"], correctIndex:1, explanation:"La 'receta' del deep learning moderno: grandes datasets + GPUs para entrenamiento + técnicas como dropout para evitar overfitting.", order:1 },
    ]
  },
  {
    number:8, slug:"ia-historia-alphago-go", title:"AlphaGo: la IA que venció al campeón mundial de Go",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"En marzo de 2016 AlphaGo de DeepMind derrotó 4-1 a Lee Sedol, el mejor jugador de Go del mundo. A diferencia de Deep Blue con el ajedrez, esto se consideraba imposible: el Go tiene más posiciones posibles que átomos en el universo observable. La fuerza bruta no funciona." },
      { type:"callout", text:"En la partida 2 del match, AlphaGo jugó el movimiento 37 — una jugada que ningún humano consideraría jamás. Los comentaristas dijeron 'eso fue un error'. Luego entendieron que era genial. Lee Sedol salió de la sala 15 minutos para procesar lo que había visto." },
      { type:"text", text:"AlphaGo combinó dos técnicas: redes neuronales profundas para evaluar posiciones, y Monte Carlo Tree Search para planificar. Crucialmente, aprendió jugando millones de partidas contra sí mismo — reinforcement learning. No fue programado con estrategias humanas, las descubrió solo." },
      { type:"text", text:"En 2017 llegó AlphaGo Zero: aprendió Go desde cero, sin datos de partidas humanas, solo jugando contra sí mismo. En 40 días alcanzó un nivel sobrehumano. La lección: a veces el conocimiento humano es una limitación, no una ayuda." },
      { type:"tip", text:"El documental 'AlphaGo' (2017) está disponible en YouTube de forma gratuita. Es una de las mejores introducciones al impacto emocional y filosófico del avance de la IA. El momento en que Lee Sedol gana la partida 4 es uno de los más conmovedores de la historia del deporte." },
    ]},
    quiz:[
      { question:"¿Qué hizo que AlphaGo fuera diferente de Deep Blue?", options:["Era más rápido","Aprendió a jugar mediante reinforcement learning, no con fuerza bruta o reglas humanas","Tenía más memoria","Fue programado por mejores ingenieros"], correctIndex:1, explanation:"AlphaGo aprendió estrategias jugando millones de partidas contra sí mismo. Deep Blue seguía reglas escritas por expertos humanos.", order:1 },
    ]
  },
  {
    number:9, slug:"ia-historia-gpt-revolucion-lenguaje", title:"GPT-1 a GPT-4: la revolución silenciosa del lenguaje",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"text", text:"En 2018 OpenAI publicó GPT-1 con 117 millones de parámetros. La idea era simple: entrenar una red transformer en texto masivo para predecir el siguiente token. El resultado fue sorprendente: el modelo había aprendido gramática, hechos, razonamiento básico — sin que nadie lo programara explícitamente." },
      { type:"text", text:"GPT-2 (2019, 1.5B parámetros): OpenAI inicialmente no lo publicó por completo temiendo que se usara para desinformación. Fue el primer momento en que la comunidad debatió si la IA era 'demasiado peligrosa para publicar'. Hoy parece modesto comparado con lo disponible." },
      { type:"text", text:"GPT-3 (2020, 175B parámetros): cambió todo. Podía escribir código, poetry, ensayos, responder preguntas con coherencia sorprendente. Empresas construyeron productos enteros sobre él. El concepto de 'few-shot learning' — aprender de unos pocos ejemplos en el prompt — demostró que escala = nuevas capacidades emergentes." },
      { type:"callout", text:"GPT-4 (2023) marcó otro salto: pasó el bar de abogados en el top 10% de examinados, superó el 90% en el SAT, y demostró razonamiento multi-paso genuino. OpenAI no publicó detalles técnicos — el paper es notoriamente opaco." },
      { type:"tip", text:"La ley de escalado de OpenAI (Scaling Laws, 2020) demostró matemáticamente que el rendimiento mejora predeciblemente con más datos, más parámetros y más cómputo. Esto cambió la estrategia de toda la industria: escala primero, entiende después." },
    ]},
    quiz:[
      { question:"¿Qué capacidad nueva demostró GPT-3 que sorprendió a la comunidad?", options:["Generar imágenes a partir de texto","Few-shot learning: aprender tareas nuevas de unos pocos ejemplos en el prompt","Razonar matemáticamente","Recordar conversaciones pasadas"], correctIndex:1, explanation:"GPT-3 demostró que con suficiente escala, los modelos adquieren capacidades emergentes no vistas antes, como adaptarse a tareas nuevas con muy pocos ejemplos.", order:1 },
    ]
  },
  {
    number:10, slug:"ia-historia-chatgpt-momento-iphone", title:"ChatGPT: el momento iPhone de la IA",
    type:LessonType.VIDEO, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"El 30 de noviembre de 2022 OpenAI lanzó ChatGPT como 'investigación preview'. En 5 días tenía 1 millón de usuarios. En 2 meses, 100 millones — el producto de consumo de crecimiento más rápido de la historia. Ni Instagram ni TikTok habían llegado a 100M usuarios en menos de 9 meses." },
      { type:"callout", text:"La diferencia no fue técnica — GPT-3 tenía capacidades similares desde 2020. Fue la interfaz: una conversación simple en lenguaje natural. ChatGPT hizo la IA accesible a personas que nunca habían escrito una línea de código." },
      { type:"text", text:"El impacto fue inmediato y global: universidades entraron en pánico por los trabajos escritos con IA, empresas empezaron a contratar 'prompt engineers', Google declaró código rojo interno, y legisladores de todo el mundo empezaron a debatir regulación. Todo en 90 días." },
      { type:"text", text:"Lo que ChatGPT demostró: la interfaz importa tanto como la tecnología. GPT-3 existía desde 2020 pero era una API técnica. ChatGPT era una conversación. La democratización de la IA no fue un avance técnico — fue un avance de diseño." },
      { type:"tip", text:"Satya Nadella (CEO de Microsoft) dijo que ChatGPT fue el mayor momento de cambio que había visto en tecnología desde que Netscape lanzó el navegador web en 1995. Microsoft invirtió $10B en OpenAI semanas después del lanzamiento." },
    ]},
    quiz:[
      { question:"¿Por qué ChatGPT tuvo tanto impacto si GPT-3 tenía capacidades similares desde 2020?", options:["Porque ChatGPT era técnicamente superior","Porque la interfaz conversacional democratizó el acceso — cualquiera podía usarlo","Porque fue gratis","Porque OpenAI hizo mejor marketing"], correctIndex:1, explanation:"ChatGPT convirtió una API técnica en una conversación accesible. El avance fue de diseño e interfaz, no solo técnico.", order:1 },
    ]
  },
  {
    number:11, slug:"ia-historia-claude-anthropic", title:"Claude y Anthropic: la apuesta por la IA segura",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"En 2021 Dario Amodei, Daniela Amodei y siete investigadores más dejaron OpenAI para fundar Anthropic con una tesis específica: la IA más poderosa del mundo puede — y debe — construirse de forma segura. No como limitación sino como ventaja competitiva." },
      { type:"text", text:"Anthropic publicó en 2022 el paper 'Constitutional AI: Harmlessness from AI Feedback' — una técnica donde el modelo aprende a evaluar y criticar sus propias respuestas usando un conjunto de principios. Fue el primer enfoque sistemático para alinear el comportamiento de un LLM sin depender completamente de feedback humano." },
      { type:"callout", text:"El nombre 'Claude' honra a Claude Shannon, el matemático que fundó la teoría de la información — la base matemática de toda la comunicación digital y de los sistemas de IA modernos." },
      { type:"text", text:"Claude se distingue por tres características diseñadas deliberadamente: (1) honestidad — prefiere admitir ignorancia a inventar, (2) contexto largo — manejo excepcional de documentos extensos, (3) razonamiento — Extended Thinking para problemas complejos. Estas no son accidentales: son el resultado de años de investigación en alineación." },
      { type:"tip", text:"Anthropic publica una cantidad inusual de su investigación de seguridad en formato abierto en anthropic.com/research. Si te interesa el futuro de la IA segura, su blog técnico es una de las mejores fuentes disponibles." },
    ]},
    quiz:[
      { question:"¿Cuál es la tesis central de Anthropic como empresa?", options:["Construir la IA más rápida del mercado","La IA más poderosa puede y debe construirse de forma segura, como ventaja competitiva","Competir con OpenAI en precio","Hacer IA accesible a empresas pequeñas"], correctIndex:1, explanation:"Anthropic fue fundada con la convicción de que seguridad y capacidad no son opuestos — que un sistema más seguro puede ser también más confiable y útil.", order:1 },
    ]
  },
  {
    number:12, slug:"ia-historia-gemini-llama-ecosistema", title:"Gemini, Llama y el ecosistema actual de IA",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"En 2023-2024 el ecosistema de IA explotó. Google lanzó Gemini, su modelo multimodal de frontera. Meta publicó Llama 2 y 3 como open source. Mistral, una startup francesa, publicó modelos pequeños y eficientes que rivalizaban con modelos mucho más grandes. La IA dejó de ser monopolio de una empresa." },
      { type:"heading", text:"Google Gemini" },
      { type:"text", text:"Google tenía la investigación — los creadores del Transformer trabajaban en Google. Pero llegó tarde al mercado conversacional. Gemini 1.5 Pro estableció el récord de ventana de contexto (1M tokens) y demostró capacidades multimodales fuertes. Gemini está integrado en todo el ecosistema Google: Gmail, Docs, Search." },
      { type:"heading", text:"Meta Llama" },
      { type:"text", text:"La decisión de Meta de publicar Llama como open source cambió el juego. Llama 3 en 70B parámetros compite con modelos propietarios de frontera. Cualquier empresa puede descargar, modificar y desplegar Llama sin pagar royalties — lo que aceleró la adopción industrial y la investigación académica." },
      { type:"callout", text:"El debate open source vs closed source en IA es uno de los más importantes de la industria. Meta argumenta que la transparencia es más segura. Anthropic y OpenAI argumentan que algunos modelos son demasiado peligrosos para ser open source." },
      { type:"tip", text:"El estado de la IA cambia tan rápido que cualquier ranking de 'mejores modelos' tiene fecha de caducidad de semanas. La mejor fuente actualizada: lmsys.org/chat (Chatbot Arena) donde usuarios reales comparan modelos anónimamente." },
    ]},
    quiz:[
      { question:"¿Qué impacto tuvo que Meta publicara Llama como open source?", options:["Ninguno, los modelos propietarios siguen siendo mejores","Democratizó el acceso, aceleró la investigación y permitió que empresas desplegaran IA sin royalties","Solo benefició a académicos","Causó problemas de seguridad en toda la industria"], correctIndex:1, explanation:"Llama open source permitió que miles de empresas y desarrolladores construyeran sobre un modelo de frontera sin barreras de costo o acceso.", order:1 },
    ]
  },
  {
    number:13, slug:"ia-historia-linea-de-tiempo", title:"70 años de IA: de Turing a la IA generativa",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"heading", text:"La línea de tiempo completa" },
      { type:"text", text:"1936 — Turing define la máquina de Turing, el fundamento teórico de la computación. 1950 — Test de Turing. 1956 — Conferencia de Dartmouth, nace la IA como disciplina. 1966 — ELIZA, primer chatbot. 1974-1980 — Primer invierno. 1987-1993 — Segundo invierno." },
      { type:"text", text:"1997 — Deep Blue vence a Kasparov. 2006 — Hinton revive las redes neuronales profundas con pre-training. 2012 — AlexNet revoluciona la visión computacional. 2014 — GANs permiten generar imágenes realistas. 2016 — AlphaGo vence a Lee Sedol. 2017 — Paper 'Attention Is All You Need', nace el Transformer." },
      { type:"text", text:"2018 — GPT-1 de OpenAI, BERT de Google. 2020 — GPT-3, scaling laws. 2021 — DALL-E genera imágenes desde texto, Codex genera código. 2022 — ChatGPT lanzamiento, Stable Diffusion open source, Midjourney. 2023 — GPT-4, Claude 2, Gemini, Llama 2. 2024 — Claude 3, GPT-4o, Llama 3, modelos multimodales dominan." },
      { type:"callout", text:"Patrón que emerge: cada ciclo de 5-10 años hay un avance fundamental que cambia la trayectoria. 2006: deep learning. 2012: GPUs + datos. 2017: Transformers. 2022: escala + RLHF = IA conversacional. El próximo salto ya está en los labs." },
    ]},
    quiz:[
      { question:"¿Qué paper de 2017 cambió fundamentalmente el campo de la IA?", options:["'Mastering the Game of Go with Deep Neural Networks'","'Attention Is All You Need' — introduciendo la arquitectura Transformer","'Generative Adversarial Networks'","'Playing Atari with Deep Reinforcement Learning'"], correctIndex:1, explanation:"'Attention Is All You Need' (Vaswani et al., 2017) introdujo los Transformers, la arquitectura base de todos los LLMs modernos: GPT, Claude, Gemini, Llama.", order:1 },
    ]
  },
  {
    number:14, slug:"ia-historia-quiz-mundo-2", title:"Quiz del Mundo 2 — Historia de la IA",
    type:LessonType.QUIZ, durationMin:8, xpReward:100,
    content:{ blocks:[{ type:"text", text:"Demuestra que conoces la historia completa de la IA. 10 preguntas sobre los hitos clave. Necesitas 7/10 para completar el mundo." }]},
    quiz:[
      { question:"¿En qué año se fundó el campo de la IA como disciplina académica?", options:["1950","1956","1969","1980"], correctIndex:1, explanation:"La Conferencia de Dartmouth de 1956 es el evento fundacional. El término 'Inteligencia Artificial' fue acuñado ahí por John McCarthy.", order:1 },
      { question:"¿Qué caracterizó a los dos 'inviernos de la IA'?", options:["Avances técnicos sin financiamiento","Las promesas superaron los resultados, colapsando el financiamiento","Guerras que pararon la investigación","Falta de computadoras suficientes"], correctIndex:1, explanation:"Los inviernos ocurrieron cuando la comunidad prometió más de lo que podía entregar, erosionando la confianza y el financiamiento.", order:2 },
      { question:"¿Qué hizo diferente a AlphaGo de Deep Blue?", options:["AlphaGo era más rápido","AlphaGo aprendió por reinforcement learning, no fuerza bruta","AlphaGo tenía más memoria","AlphaGo fue creado por Google"], correctIndex:1, explanation:"AlphaGo aprendió estrategias de Go jugando millones de partidas contra sí mismo. Deep Blue seguía reglas programadas por expertos.", order:3 },
      { question:"¿Qué demostró el lanzamiento de ChatGPT en noviembre 2022?", options:["Que la IA finalmente era perfecta","Que la interfaz importa tanto como la tecnología para la adopción masiva","Que OpenAI era superior a Google","Que los modelos de lenguaje habían alcanzado AGI"], correctIndex:1, explanation:"GPT-3 existía desde 2020. ChatGPT demostró que una interfaz conversacional simple podía democratizar el acceso a la IA.", order:4 },
      { question:"¿Por qué fue revolucionaria la arquitectura Transformer de 2017?", options:["Era más rápida que las RNNs","Permitía que cada token atendiera a todos los demás simultáneamente, capturando dependencias largas","Usaba menos memoria","Era más fácil de entrenar"], correctIndex:1, explanation:"Self-attention resolvió el problema de memoria de largo plazo de las RNNs, haciendo posible modelos de lenguaje de gran escala.", order:5 },
    ]
  },
  {
    number:15, slug:"ia-historia-proyecto-infografia", title:"Proyecto: Infografía de la evolución de la IA",
    type:LessonType.PROJECT, durationMin:20, xpReward:150,
    content:{ blocks:[
      { type:"heading", text:"Tu segundo proyecto VYZIO" },
      { type:"text", text:"Crea una infografía visual de la línea de tiempo de la IA. Herramientas gratuitas: Canva, Piktochart, o Visme. La infografía debe incluir al menos 10 hitos históricos con el año y una breve descripción de por qué fue importante." },
      { type:"callout", text:"Criterio de evaluación: ¿alguien que no sabe nada de IA podría entender la evolución del campo leyendo tu infografía en menos de 2 minutos?" },
      { type:"tip", text:"Piensa en la narrativa: los inviernos y los veranos, las promesas y los resultados, los individuos clave. Una buena infografía cuenta una historia, no solo lista fechas." },
    ]},
    quiz:[]
  }
];

// ─────────────────────────────────────────────────────────────
// MUNDO 3 — IA en la Vida Cotidiana (15 lecciones)
// ─────────────────────────────────────────────────────────────
const MUNDO3: any[] = [
  {
    number:1, slug:"ia-cotidiana-smartphone", title:"Tu smartphone tiene más IA que un laboratorio de los 90s",
    type:LessonType.VIDEO, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"Un smartphone moderno ejecuta docenas de modelos de IA simultáneamente. Face ID usa una red neuronal 3D que mapea 30,000 puntos de tu rostro. El teclado predictivo usa un LLM pequeño. La cámara usa IA para ajustar exposición, enfoque, HDR y reconocimiento de escenas en tiempo real." },
      { type:"callout", text:"Apple Neural Engine en un iPhone 15 puede ejecutar 35 billones de operaciones por segundo. La primera computadora que superó ese rendimiento ocupaba una sala entera y costaba millones de dólares. Tienes esa potencia en el bolsillo." },
      { type:"text", text:"Funciones de IA en tu teléfono que probablemente usas sin saberlo: autocorrección y predicción de texto, reconocimiento de voz (Siri/Google Assistant), detección de spam en llamadas, modo retrato que separa sujeto de fondo, reducción de ruido en llamadas, traducción instantánea de texto en fotos." },
      { type:"tip", text:"La mayoría de IA en smartphones corre localmente — en el propio dispositivo, sin conexión a internet. Esto se llama 'on-device AI' o 'edge AI' y está creciendo rápidamente por razones de privacidad y velocidad." },
    ]},
    quiz:[
      { question:"¿Qué ventaja tiene la 'on-device AI' (IA que corre en el propio dispositivo)?", options:["Es más precisa que la IA en la nube","Mayor privacidad y funciona sin internet","Consume menos batería siempre","Solo funciona con chips Apple"], correctIndex:1, explanation:"On-device AI procesa tus datos localmente sin enviarlos a servidores externos, mejorando la privacidad y funcionando sin conexión.", order:1 },
    ]
  },
  {
    number:2, slug:"ia-cotidiana-recomendaciones", title:"Netflix, Spotify y YouTube: los algoritmos que te conocen mejor que tú",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"text", text:"El 80% del tiempo de visualización de Netflix viene de su sistema de recomendaciones. Spotify genera más de 5,000 millones de playlists personalizadas. YouTube recomienda el 70% del contenido que la gente ve. Estos no son accidentes — son sistemas de IA meticulosamente diseñados para maximizar el tiempo que pasas en sus plataformas." },
      { type:"heading", text:"Cómo funciona: Collaborative Filtering" },
      { type:"text", text:"La técnica central se llama Collaborative Filtering: 'usuarios que vieron/escucharon X también vieron/escucharon Y'. El sistema encuentra usuarios similares a ti (basándose en tu historial) y te recomienda lo que a ellos les gustó. Netflix tiene 200+ millones de 'perfiles de gustos' que mapean en tiempo real." },
      { type:"heading", text:"El problema del engagement vs bienestar" },
      { type:"text", text:"Estos algoritmos están optimizados para maximizar el tiempo en la plataforma, no para maximizar tu bienestar. Investigaciones de la propia YouTube muestran que el algoritmo tendía a recomendar contenido cada vez más extremo porque generaba más engagement. El diseño de algoritmos de recomendación es uno de los debates éticos más importantes de la IA aplicada." },
      { type:"callout", text:"El 'algoritmo' de TikTok es considerado el más sofisticado de la industria. Tarda menos de 45 minutos en construir un perfil de tus intereses desde una cuenta nueva. No necesita que hagas nada — solo que veas videos." },
      { type:"tip", text:"Puedes 'resetear' parcialmente tu algoritmo de YouTube y Spotify limpiando tu historial de visualización/escucha. Es un experimento interesante: el algoritmo cambia completamente en 48-72 horas." },
    ]},
    quiz:[
      { question:"¿Qué es Collaborative Filtering?", options:["Un sistema que filtra contenido inapropiado","Recomendar a un usuario contenido que le gustó a usuarios con gustos similares","Un algoritmo que clasifica contenido por categorías","Un método para detectar bots"], correctIndex:1, explanation:"Collaborative Filtering encuentra patrones entre usuarios con comportamientos similares para hacer recomendaciones personalizadas.", order:1 },
      { question:"¿Por qué los algoritmos de recomendación pueden ser problemáticos éticamente?", options:["Porque son demasiado caros de mantener","Porque están optimizados para maximizar tiempo en la plataforma, no el bienestar del usuario","Porque solo funcionan en inglés","Porque violan las leyes de privacidad"], correctIndex:1, explanation:"La optimización por engagement puede llevar a recomendar contenido cada vez más extremo o adictivo, priorizando las métricas de la plataforma sobre el bienestar del usuario.", order:2 },
    ]
  },
  {
    number:3, slug:"ia-cotidiana-gps-maps", title:"Google Maps y Waze: la IA que reroute el tráfico de ciudades enteras",
    type:LessonType.VIDEO, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"Google Maps procesa datos de ubicación de más de 1,000 millones de dispositivos en tiempo real. Con esa información, puede predecir el tráfico con 15 minutos de anticipación con 97% de precisión. No es magia: es aprendizaje automático sobre patrones históricos + datos en tiempo real." },
      { type:"text", text:"El routing de Google Maps usa variantes del algoritmo A* y Dijkstra combinados con predicción de tráfico basada en ML. Cuando Maps dice que llegarás en 23 minutos, ese número es la mediana de cientos de trayectos similares ajustada por condiciones actuales." },
      { type:"callout", text:"En 2020, Google Maps empezó a mostrar rutas de menor huella de carbono además de las más rápidas. El sistema tiene que balancear múltiples objetivos: velocidad, distancia, combustible, emisiones. Esto es un problema de optimización multi-objetivo — un área activa de investigación en IA." },
      { type:"tip", text:"Waze es propiedad de Google y comparte infraestructura. La diferencia: Waze prioriza reportes de usuarios (accidentes, policía) sobre datos históricos. Es más útil en zonas con mucha comunidad activa." },
    ]},
    quiz:[
      { question:"¿Qué hace que la predicción de tráfico de Google Maps sea posible?", options:["Cámaras en todas las intersecciones","Datos de ubicación en tiempo real de millones de dispositivos + patrones históricos de ML","Sensores en el pavimento","Reportes de policía de tráfico"], correctIndex:1, explanation:"La combinación de datos de millones de usuarios en tiempo real con modelos entrenados en patrones históricos permite predicciones de tráfico muy precisas.", order:1 },
    ]
  },
  {
    number:4, slug:"ia-cotidiana-spam-fraude", title:"Filtros de spam y detección de fraude: la IA que te protege en silencio",
    type:LessonType.READING, durationMin:4, xpReward:55,
    content:{ blocks:[
      { type:"text", text:"Gmail bloquea el 99.9% del spam usando clasificadores de ML entrenados en miles de millones de emails. Visa y Mastercard procesan cada transacción contra modelos de fraude en menos de 100 milisegundos. Estas son aplicaciones de IA que funcionan tan bien que se volvieron invisibles." },
      { type:"text", text:"Los clasificadores de spam modernos van mucho más allá de listas de palabras. Analizan: patrones de comportamiento del remitente, reputación del servidor de envío, estructura HTML del email, historial de interacciones del destinatario con remitentes similares, y señales de red (si muchos usuarios marcan emails similares como spam)." },
      { type:"callout", text:"Visa procesa 65,000 transacciones por segundo. Su modelo de detección de fraude analiza más de 500 variables por transacción: ubicación, dispositivo, historial, monto, horario, velocidad de uso. Todo en menos de 100ms." },
      { type:"tip", text:"Los falsos positivos (emails legítimos marcados como spam) son el peor resultado para un clasificador de spam — peor que dejar pasar spam. Por eso los sistemas están calibrados con alta precision aunque eso signifique algo más de spam pasando." },
    ]},
    quiz:[
      { question:"¿Por qué los clasificadores de spam priorizan alta Precision (pocos falsos positivos)?", options:["Porque es más fácil de implementar","Porque marcar emails legítimos como spam es peor que dejar pasar algo de spam","Porque Gmail solo tiene recursos para revisar algunos emails","Por regulaciones legales"], correctIndex:1, explanation:"Un email importante marcado como spam puede perderse para siempre. Los usuarios prefieren ver algo de spam antes que perder emails legítimos.", order:1 },
    ]
  },
  {
    number:5, slug:"ia-cotidiana-voz-asistentes", title:"Siri, Alexa y Google Assistant: cómo la IA entiende lo que dices",
    type:LessonType.VIDEO, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"Cuando hablas con Siri, tu voz pasa por tres sistemas de IA en secuencia: ASR (Automatic Speech Recognition) convierte audio a texto, NLU (Natural Language Understanding) entiende la intención, NLG (Natural Language Generation) construye la respuesta. Cada uno es un modelo de ML separado." },
      { type:"text", text:"La detección de la palabra clave ('Hey Siri', 'Alexa', 'OK Google') corre localmente en un chip dedicado con consumo de energía mínimo. El resto del procesamiento suele ir a la nube, aunque cada generación de dispositivos mueve más IA al dispositivo por privacidad." },
      { type:"callout", text:"El modelo Whisper de OpenAI (open source, gratuito) transcribe voz a texto en más de 99 idiomas con nivel humano. Puedes usarlo en tu laptop hoy mismo. Lo que costaba millones en infraestructura en 2015 es hoy un archivo de 3GB descargable." },
      { type:"tip", text:"Los asistentes de voz son mejores en comandos específicos que en conversación libre. 'Pon un temporizador de 10 minutos' funciona perfectamente. 'Explícame la mecánica cuántica' es mejor llevarla a Claude o ChatGPT." },
    ]},
    quiz:[
      { question:"¿Qué hace NLU (Natural Language Understanding) en un asistente de voz?", options:["Convierte audio a texto","Entiende la intención detrás del texto transcrito","Genera la respuesta en audio","Detecta la palabra clave de activación"], correctIndex:1, explanation:"NLU toma el texto transcrito y determina qué quiere hacer el usuario — la 'intención' y las 'entidades' relevantes para ejecutar la acción.", order:1 },
    ]
  },
  {
    number:6, slug:"ia-cotidiana-traduccion", title:"Google Translate y DeepL: traducción automática que cambió el mundo",
    type:LessonType.READING, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"Google Translate usa un Transformer entrenado en cientos de miles de millones de palabras en 133 idiomas. Traduce más de 100,000 millones de palabras al día — más texto del que todos los traductores humanos de la historia han traducido en total." },
      { type:"text", text:"Hasta 2016, la traducción automática usaba reglas lingüísticas escritas por humanos. En 2016 Google cambió completamente a un sistema neuronal (Google Neural Machine Translation) de un día para el otro, mejorando la calidad de forma espectacular. Los usuarios lo notaron inmediatamente." },
      { type:"callout", text:"DeepL, una empresa alemana, publicó estudios mostrando que su sistema superaba a Google Translate en calidad para idiomas europeos. Google lo negó y publicó sus propios benchmarks. El debate reveló algo importante: medir 'calidad' de traducción es subjetivo y complejo." },
      { type:"text", text:"La traducción automática aún falla en: contexto cultural (humor, ironía, doble sentido), tecnicismos de dominios especializados sin suficientes datos de entrenamiento, y lenguas con pocos hablantes (bajo-recurso). El 90% de los idiomas del mundo tienen poco o ningún soporte de calidad." },
      { type:"tip", text:"Para textos profesionales o legales, la traducción automática es un punto de partida, no un resultado final. Para comunicación casual en idiomas principales, es extraordinariamente buena. Conoce los límites de la herramienta." },
    ]},
    quiz:[
      { question:"¿Qué cambio hizo Google en 2016 que mejoró dramáticamente sus traducciones?", options:["Contrató miles de traductores humanos","Pasó de reglas lingüísticas escritas por humanos a un sistema neuronal (Transformer)","Compró DeepL","Añadió más idiomas al sistema"], correctIndex:1, explanation:"El cambio a Google Neural Machine Translation en 2016 mejoró la calidad de tal forma que los usuarios lo notaron de un día para otro.", order:1 },
    ]
  },
  {
    number:7, slug:"ia-cotidiana-salud-diagnostico", title:"IA en salud: detectando enfermedades antes que los médicos",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"text", text:"En 2016 un estudio de Google publicado en JAMA mostró que su IA detectaba retinopatía diabética en fotografías de retina con mayor precisión que oftalmólogos expertos. Fue el primer momento en que una IA superó a médicos especialistas en una tarea de diagnóstico clínico real." },
      { type:"text", text:"AlphaFold 2 de DeepMind resolvió en 2020 el 'problema del plegamiento de proteínas' — predecir la estructura 3D de una proteína a partir de su secuencia de aminoácidos. Un problema que había llevado 50 años de investigación sin solución. AlphaFold lo resolvió en meses y publicó las estructuras de prácticamente todas las proteínas conocidas de forma gratuita." },
      { type:"callout", text:"La base de datos de AlphaFold tiene más de 200 millones de estructuras proteicas disponibles gratuitamente. Antes de AlphaFold, determinar experimentalmente una estructura proteica costaba años y millones de dólares. Hoy es una consulta web gratuita." },
      { type:"text", text:"Limitaciones importantes: los modelos de diagnóstico por imagen son brillantes en la tarea específica para la que fueron entrenados pero pueden fallar de formas inesperadas ante variaciones en el equipo de imagen, la población, o la calidad fotográfica. La IA en medicina es asistencia, no reemplazo." },
      { type:"tip", text:"La FDA en EE.UU. ha aprobado más de 500 dispositivos médicos basados en IA hasta 2024. En su mayoría son asistentes de diagnóstico por imagen (radiología, dermatología, oftalmología). El marco regulatorio de IA médica es uno de los más avanzados del mundo." },
    ]},
    quiz:[
      { question:"¿Qué resolvió AlphaFold 2 de DeepMind?", options:["Cómo diagnosticar el cáncer","La predicción de la estructura 3D de proteínas a partir de su secuencia de aminoácidos","La síntesis de nuevos medicamentos","La simulación de ensayos clínicos"], correctIndex:1, explanation:"El problema del plegamiento de proteínas es uno de los grandes desafíos de la biología. AlphaFold lo resolvió en 2020, revolucionando la biología estructural.", order:1 },
    ]
  },
  {
    number:8, slug:"ia-cotidiana-moderacion-contenido", title:"La IA que modera internet: el trabajo más difícil del mundo",
    type:LessonType.READING, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"YouTube recibe 500 horas de video cada minuto. Facebook tiene 3,000 millones de usuarios publicando contenido constantemente. Es físicamente imposible que humanos revisen todo — la moderación de contenido a escala requiere IA." },
      { type:"text", text:"Los sistemas de moderación usan clasificadores de ML para detectar: violencia gráfica, contenido sexual, desinformación, spam, discurso de odio. Pero el lenguaje es ambiguo, el contexto cultural importa enormemente, y los actores maliciosos evolucionan constantemente sus técnicas." },
      { type:"callout", text:"En 2020 Facebook reportó que su IA detectaba el 94% del discurso de odio antes de que usuarios lo reportaran. Pero también había falsos positivos masivos: grupos de minorías siendo silenciados porque el modelo confundía su documentación de discriminación con el discurso de odio que describían." },
      { type:"text", text:"El problema de la moderación automatizada es profundamente humano: ¿quién decide qué es odio? ¿qué es desinformación? ¿qué es violencia justificada? Los valores de los datos de entrenamiento se convierten en política global de contenido — con enorme impacto en millones de personas." },
      { type:"tip", text:"El campo de 'Responsible AI' y 'AI Safety' se ocupa precisamente de estos problemas: sesgos en sistemas de clasificación, impacto dispar en grupos vulnerables, y accountability de sistemas automáticos de decisión." },
    ]},
    quiz:[
      { question:"¿Por qué la moderación automatizada puede tener impacto desigual en grupos minoritarios?", options:["Porque el algoritmo fue programado con sesgo deliberado","Porque los datos de entrenamiento reflejan sesgos históricos y el contexto cultural no está capturado correctamente","Porque los ingenieros no probaron el sistema","Porque las leyes no aplican a la IA"], correctIndex:1, explanation:"Los modelos aprenden de datos históricos que contienen sesgos. Sin datos representativos y evaluación cuidadosa, los errores se distribuyen de forma desigual.", order:1 },
    ]
  },
  {
    number:9, slug:"ia-cotidiana-deepfakes", title:"Deepfakes: cuando ver ya no es creer",
    type:LessonType.VIDEO, durationMin:6, xpReward:70,
    content:{ blocks:[
      { type:"text", text:"Un deepfake es un video, audio o imagen generado o modificado con IA para hacer que alguien parezca decir o hacer algo que nunca ocurrió. La tecnología base son las GANs (Generative Adversarial Networks) y los modelos de difusión — las mismas técnicas detrás de Midjourney y Stable Diffusion." },
      { type:"text", text:"Los deepfakes se popularizaron en 2017-2018 principalmente con contenido no consensual. Hoy la tecnología es accesible para cualquier usuario con una laptop decente y algunas fotos de la persona objetivo. Videos de calidad profesional que requirían estudios de Hollywood en 2015 se generan en minutos en 2025." },
      { type:"callout", text:"El 96% de los deepfakes identificados online son contenido sexual no consensual de mujeres — según un informe de 2019 de Deeptrace. La tecnología que se usa para efectos especiales en películas se usa mayoritariamente para dañar a personas reales." },
      { type:"text", text:"La carrera armamentística: los detectores de deepfakes usan los mismos modelos de IA que los generan para identificarlos. Los generadores mejoran, los detectores mejoran. Actualmente no existe ningún detector 100% confiable para deepfakes de alta calidad." },
      { type:"tip", text:"Señales para detectar deepfakes (por ahora): parpadeo irregular o excesivo, bordes del cabello con artifacts, joyas y gafas que se distorsionan, inconsistencias en la iluminación entre cara y fondo, movimientos de boca que no sincronizan perfectamente. Estas señales desaparecen con modelos más avanzados." },
    ]},
    quiz:[
      { question:"¿Qué tecnología de IA subyace a la creación de deepfakes de alta calidad?", options:["Árboles de decisión y regresión logística","GANs (Generative Adversarial Networks) y modelos de difusión","Sistemas expertos con reglas escritas por humanos","Reconocimiento de patrones simple"], correctIndex:1, explanation:"Las GANs y los modelos de difusión — las mismas técnicas de Midjourney y Stable Diffusion — permiten generar y modificar video con realismo fotográfico.", order:1 },
    ]
  },
  {
    number:10, slug:"ia-cotidiana-privacidad", title:"IA y privacidad: lo que las empresas saben de ti",
    type:LessonType.READING, durationMin:5, xpReward:60,
    content:{ blocks:[
      { type:"text", text:"Los modelos de IA modernos pueden inferir información que nunca compartiste deliberadamente. Tu historial de búsqueda puede revelar condición médica, orientación sexual, situación económica y creencias políticas con precisión estadística significativa. El dato aparentemente inocente, agregado con miles de otros, se convierte en perfil detallado." },
      { type:"text", text:"Google sabe cuándo despiertas (primera búsqueda del día), tus rutas habituales (Maps), tu situación de salud (síntomas buscados), tus intereses financieros (búsquedas de inversión), tu nivel de estrés (patrones de búsqueda), y con quién te comunicas (Gmail). Todo legal, todo en los términos de servicio que aceptaste." },
      { type:"callout", text:"El experimento Target de 2012: Target asignó a cada cliente una puntuación de 'probabilidad de embarazo' basada en compras. Empezaron a enviar cupones de productos de bebé a mujeres embarazadas antes de que lo anunciaran públicamente. Un padre enojado fue a quejarse a la tienda — su hija adolescente estaba embarazada y él no lo sabía." },
      { type:"text", text:"El GDPR europeo (2018) y regulaciones similares en todo el mundo intentan dar a los usuarios control sobre sus datos: derecho a saber qué se recopila, derecho a eliminarlo, derecho a no ser perfilado para decisiones automatizadas importantes. La implementación efectiva sigue siendo un desafío." },
      { type:"tip", text:"Herramientas prácticas de privacidad: DuckDuckGo para búsquedas sin seguimiento, Firefox con uBlock Origin para bloquear trackers, Signal para mensajería, ProtonMail para email. Ninguna solución es perfecta, pero cada capa ayuda." },
    ]},
    quiz:[
      { question:"¿Por qué el 'dato inocente' puede ser problemático para la privacidad?", options:["Porque viola las leyes de privacidad automáticamente","Porque datos aparentemente inocentes, agregados con miles de otros, permiten inferir información muy sensible","Porque el dato siempre se vende a terceros","Porque el almacenamiento es inseguro"], correctIndex:1, explanation:"El poder del data mining moderno radica en la correlación: datos aparentemente inofensivos combinados con ML revelan patrones que nunca compartirías voluntariamente.", order:1 },
    ]
  },
  {
    number:11, slug:"ia-cotidiana-transporte-autonomo", title:"Autos autónomos: el problema más difícil de la IA aplicada",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"La conducción autónoma se consideraba 'resoluble en 5 años' desde 2013. En 2025 seguimos sin tener vehículos autónomos de Nivel 5 (totalmente autónomos en cualquier condición) comercialmente disponibles. Es posiblemente el problema más difícil de la IA aplicada." },
      { type:"text", text:"Los niveles de autonomía SAE: L0 sin asistencia, L1 asistencia básica (ABS), L2 asistencia en autopista (Tesla Autopilot), L3 conducción condicional (el conductor puede desatenderse en condiciones específicas), L4 conducción de alta automatización en zona limitada (Waymo en Phoenix), L5 totalmente autónomo en cualquier condición (nadie lo tiene)." },
      { type:"callout", text:"Waymo (Google) opera taxis sin conductor en Phoenix y San Francisco con un historial de seguridad notablemente mejor que conductores humanos en sus zonas de operación. La trampa: solo operan en zonas bien mapeadas con clima predecible. La generalización a cualquier lugar del mundo sigue siendo un problema abierto." },
      { type:"tip", text:"El problema fundamental de los autos autónomos no es técnico — es la long tail de escenarios raros: una vaca en la carretera, una señal con graffiti, un cruce de escuela con protocolo especial. Los humanos manejamos estos casos con sentido común. La IA necesita haberlos visto antes." },
    ]},
    quiz:[
      { question:"¿Por qué la conducción autónoma total (Nivel 5) sigue siendo un problema no resuelto?", options:["Porque los sensores son demasiado caros","Por el problema de la long tail: escenarios raros que requieren sentido común que la IA no generaliza bien","Porque no hay suficientes datos de entrenamiento","Por regulaciones que lo prohíben"], correctIndex:1, explanation:"Los sistemas autónomos fallan en escenarios inusuales ('long tail') que un humano maneja con sentido común pero que la IA no generaliza correctamente.", order:1 },
    ]
  },
  {
    number:12, slug:"ia-cotidiana-trabajo-futuro", title:"IA y el futuro del trabajo: qué trabajos van, cuáles llegan",
    type:LessonType.READING, durationMin:5, xpReward:65,
    content:{ blocks:[
      { type:"text", text:"El World Economic Forum estima que la IA eliminará 85 millones de puestos de trabajo para 2025 pero creará 97 millones nuevos — una ganancia neta en papel, pero con enormes disrupciones porque los trabajos eliminados y creados no son los mismos ni están en los mismos lugares." },
      { type:"text", text:"Trabajos más vulnerables a la automatización: tareas repetitivas de datos (contabilidad básica, entrada de datos), conducción (cuando los vehículos autónomos maduren), call centers de atención básica, revisión de documentos legales rutinaria, traducción de textos estándar." },
      { type:"callout", text:"Una investigación de Goldman Sachs (2023) estimó que la IA generativa podría automatizar hasta el 25% de las tareas de trabajo actual en economías desarrolladas. Importante: automatizar tareas ≠ eliminar trabajos. La mayoría de trabajos son combinaciones de tareas, no todas igualmente automatizables." },
      { type:"text", text:"Trabajos que la IA crea y amplifica: prompt engineers, AI trainers, AI safety researchers, builders de aplicaciones de IA, especialistas en ética de IA, y cualquier trabajo donde la IA es un amplificador — el médico con IA ve más pacientes, el abogado con IA revisa más contratos, el programador con Copilot escribe más código." },
      { type:"tip", text:"La habilidad más valiosa en el mercado de trabajo de los próximos 10 años: saber trabajar efectivamente con IA — cuándo usarla, cómo verificar sus resultados, y qué decisiones reservar para el juicio humano. Exactamente lo que aprenderás en VYZIO." },
    ]},
    quiz:[
      { question:"¿Cuál es la distinción importante entre 'automatizar tareas' y 'eliminar trabajos'?", options:["Son lo mismo y llevan al mismo resultado","La mayoría de trabajos son mezclas de tareas; automatizar algunas no elimina el trabajo completo","Solo aplica a trabajos manuales","La automatización siempre crea más empleos del mismo tipo"], correctIndex:1, explanation:"Los trabajos son combinaciones de tareas. La IA puede automatizar el 25% de las tareas de un trabajo sin eliminar ese trabajo — cambiándolo profundamente.", order:1 },
    ]
  },
  {
    number:13, slug:"ia-cotidiana-practica-auditoria", title:"Práctica: auditoría de IA en tu día a día",
    type:LessonType.PRACTICE, durationMin:15, xpReward:100,
    content:{ blocks:[
      { type:"heading", text:"Ejercicio práctico" },
      { type:"text", text:"Durante las próximas 24 horas, documenta cada vez que interactúas con un sistema de IA. No solo las obvias (ChatGPT, Siri) sino todas: el filtro de spam que no viste, la recomendación de Netflix, el autocompletado del buscador, la detección de cara en la foto." },
      { type:"callout", text:"Objetivo: identificar mínimo 15 interacciones con IA en un día normal. Para cada una, anota: qué sistema es, qué tipo de IA usa, y si la sabías o no." },
      { type:"tip", text:"La mayoría de personas identifican 5-8 interacciones conscientes. Los más observadores llegan a 20-30 cuando empiezan a ver la IA invisible — la que trabaja en segundo plano sin que lo notes." },
    ]},
    quiz:[]
  },
  {
    number:14, slug:"ia-cotidiana-quiz", title:"Quiz del Mundo 3 — IA en la Vida Cotidiana",
    type:LessonType.QUIZ, durationMin:8, xpReward:100,
    content:{ blocks:[{ type:"text", text:"5 preguntas sobre IA cotidiana. Necesitas 4/5 para completar el mundo." }]},
    quiz:[
      { question:"¿Qué técnica usan Netflix y Spotify para sus recomendaciones?", options:["Reglas escritas por expertos en entretenimiento","Collaborative Filtering — usuarios similares tienen gustos similares","Encuestas manuales de preferencias","Popularidad global de cada contenido"], correctIndex:1, explanation:"Collaborative Filtering encuentra usuarios con historial similar y recomienda lo que a ellos les gustó.", order:1 },
      { question:"¿Por qué AlphaFold 2 fue revolucionario?", options:["Fue la primera IA en ganar en ajedrez","Resolvió el problema del plegamiento de proteínas, acelerando radicalmente el descubrimiento de medicamentos","Fue el primer modelo multimodal","Demostró que la IA puede conducir automóviles"], correctIndex:1, explanation:"AlphaFold resolvió en meses un problema de 50 años, publicando las estructuras de 200M proteínas gratis.", order:2 },
      { question:"¿Qué es un deepfake?", options:["Una noticia falsa en internet","Contenido audiovisual generado con IA que hace parecer que alguien dijo o hizo algo que no ocurrió","Un perfil falso en redes sociales","Un email de phishing con IA"], correctIndex:1, explanation:"Los deepfakes usan GANs y modelos de difusión para generar o modificar video/audio de forma convincente.", order:3 },
      { question:"¿Cuál es el nivel de autonomía de conducción que nadie ha alcanzado aún comercialmente?", options:["Nivel 2","Nivel 3","Nivel 4","Nivel 5 — totalmente autónomo en cualquier condición"], correctIndex:3, explanation:"El Nivel 5 (sin limitaciones de lugar, clima o situación) sigue siendo un problema abierto. Waymo opera en Nivel 4 en zonas limitadas.", order:4 },
      { question:"¿Qué es la 'on-device AI'?", options:["IA que solo funciona en oficinas","IA que procesa datos localmente en el dispositivo sin enviarlos a servidores externos","IA diseñada para dispositivos médicos","IA que requiere conexión 5G"], correctIndex:1, explanation:"On-device AI preserva la privacidad y funciona sin internet al procesar en el propio dispositivo.", order:5 },
    ]
  },
  {
    number:15, slug:"ia-cotidiana-proyecto", title:"Proyecto: mapa de IA en mi ciudad",
    type:LessonType.PROJECT, durationMin:25, xpReward:150,
    content:{ blocks:[
      { type:"heading", text:"Proyecto del Mundo 3" },
      { type:"text", text:"Investiga y documenta cómo la IA se usa en los servicios de tu ciudad: transporte público, seguridad, salud, educación, comercio. Crea una presentación de 5-7 diapositivas con al menos 5 ejemplos reales de tu ciudad o país." },
      { type:"callout", text:"Mínimo requerido: 5 sistemas de IA reales identificados, con nombre del sistema, proveedor tecnológico, qué problema resuelve y un dato cuantitativo de impacto." },
    ]},
    quiz:[]
  }
];

async function main() {
  console.log("🌱 Insertando Mundos 2, 3 y 4 completos...\n");
  let total = 0;

  const mundos = [
    { slug:"historia-de-la-ia", data: MUNDO2, label:"Mundo 2 — Historia de la IA" },
    { slug:"ia-en-la-vida-cotidiana", data: MUNDO3, label:"Mundo 3 — IA Cotidiana" },
  ];

  for (const { slug, data, label } of mundos) {
    const world = await prisma.world.findUnique({ where: { slug } });
    if (!world) { console.warn(`⚠️  ${label}: mundo '${slug}' no encontrado. Verifica el seed principal.`); continue; }

    console.log(`\n📚 ${label} (${data.length} lecciones)`);
    for (const l of data) {
      const lesson = await prisma.lesson.upsert({
        where: { slug: l.slug },
        create: { number:l.number, title:l.title, slug:l.slug, type:l.type, durationMin:l.durationMin, xpReward:l.xpReward, content:l.content, order:l.number, isPublished:true, worldId:world.id },
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

  console.log(`\n\n🚀 ${total} lecciones insertadas en Mundos 2 y 3.`);
  console.log("📌 Siguiente: npx tsx prisma/seed-nivel2-prompting.ts");
}

main().catch(console.error).finally(() => prisma.$disconnect());
