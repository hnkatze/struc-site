export interface GraphNode {
  id: string
  question: string
  options: {
    text: string
    nextId: string | null
    result?: string
  }[]
  isResult?: boolean
}

export const cafeDecisionGraph: GraphNode[] = [
    {
      id: "start",
      question: "¿Qué tipo de bebida te gustaría?",
      options: [
        { text: "Café", nextId: "coffee" },
        { text: "Té", nextId: "tea" },
        { text: "Bebida fría", nextId: "cold" }
      ]
    },
    {
      id: "coffee",
      question: "¿Qué tipo de café prefieres?",
      options: [
        { text: "Espresso", nextId: "espresso" },
        { text: "Con leche", nextId: "milk-coffee" },
        { text: "Negro", nextId: "black-coffee" }
      ]
    },
    {
      id: "tea",
      question: "¿Qué tipo de té te gustaría?",
      options: [
        { text: "Negro", nextId: "black-tea" },
        { text: "Verde", nextId: "green-tea" },
        { text: "Herbal", nextId: "herbal-tea" }
      ]
    },
    {
      id: "cold",
      question: "¿Qué bebida fría prefieres?",
      options: [
        { text: "Frappuccino", nextId: "frappuccino" },
        { text: "Té helado", nextId: "iced-tea" },
        { text: "Limonada", nextId: "lemonade" }
      ]
    },
    {
      id: "espresso",
      question: "¿Tamaño de tu espresso?",
      options: [
        { text: "Simple", nextId: "espresso-result" },
        { text: "Doble", nextId: "double-espresso-result" }
      ]
    },
    {
      id: "milk-coffee",
      question: "¿Qué café con leche prefieres?",
      options: [
        { text: "Cappuccino", nextId: "cappuccino-result" },
        { text: "Latte", nextId: "latte-result" },
        { text: "Flat White", nextId: "flatwhite-result" }
      ]
    },
    {
      id: "black-coffee",
      question: "¿Cómo te gustaría tu café negro?",
      options: [
        { text: "Americano", nextId: "americano-result" },
        { text: "Café de filtro", nextId: "filter-result" }
      ]
    },
    {
      id: "black-tea",
      question: "¿Cómo te gustaría tu té negro?",
      options: [
        { text: "Con leche", nextId: "milk-tea-result" },
        { text: "Con limón", nextId: "lemon-tea-result" },
        { text: "Solo", nextId: "plain-black-tea-result" }
      ]
    },
    {
      id: "green-tea",
      question: "¿Qué tipo de té verde prefieres?",
      options: [
        { text: "Matcha", nextId: "matcha-result" },
        { text: "Sencha", nextId: "sencha-result" }
      ]
    },
    {
      id: "herbal-tea",
      question: "¿Qué infusión herbal te gustaría?",
      options: [
        { text: "Manzanilla", nextId: "chamomile-result" },
        { text: "Menta", nextId: "mint-result" },
        { text: "Frutos rojos", nextId: "berries-result" }
      ]
    },
    {
      id: "frappuccino",
      question: "¿Qué sabor de frappuccino?",
      options: [
        { text: "Chocolate", nextId: "choco-frap-result" },
        { text: "Caramelo", nextId: "caramel-frap-result" },
        { text: "Café", nextId: "coffee-frap-result" }
      ]
    },
    {
      id: "iced-tea",
      question: "¿Qué té helado prefieres?",
      options: [
        { text: "Limón", nextId: "lemon-iced-tea-result" },
        { text: "Durazno", nextId: "peach-iced-tea-result" }
      ]
    },
    {
      id: "lemonade",
      question: "¿Qué tipo de limonada?",
      options: [
        { text: "Clásica", nextId: "classic-lemonade-result" },
        { text: "De fresa", nextId: "strawberry-lemonade-result" }
      ]
    },
    // Nodos de resultado
    {
      id: "espresso-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Espresso simple", 
          nextId: null,
          result: "Un shot de espresso intenso y concentrado. Perfecto para un impulso rápido de energía."
        }
      ]
    },
    {
      id: "double-espresso-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Espresso doble", 
          nextId: null,
          result: "Doble shot de espresso para los amantes del café fuerte. Intenso y aromático."
        }
      ]
    },
    {
      id: "cappuccino-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Cappuccino", 
          nextId: null,
          result: "Espresso con leche vaporizada y abundante espuma. Equilibrio perfecto entre intensidad y cremosidad."
        }
      ]
    },
    {
      id: "latte-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Latte", 
          nextId: null,
          result: "Espresso con abundante leche vaporizada y una capa ligera de espuma. Suave y cremoso."
        }
      ]
    },
    {
      id: "flatwhite-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Flat White", 
          nextId: null,
          result: "Espresso con leche vaporizada aterciopelada. Más intenso que un latte pero igual de cremoso."
        }
      ]
    },
    {
      id: "americano-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Americano", 
          nextId: null,
          result: "Espresso diluido con agua caliente. Mantiene el sabor del café con menos intensidad."
        }
      ]
    },
    {
      id: "filter-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Café de filtro", 
          nextId: null,
          result: "Café preparado por goteo a través de un filtro. Sabor limpio y definido."
        }
      ]
    },
    {
      id: "milk-tea-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té negro con leche", 
          nextId: null,
          result: "Té negro con un toque de leche. Reconfortante y tradicional."
        }
      ]
    },
    {
      id: "lemon-tea-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té negro con limón", 
          nextId: null,
          result: "Té negro con un toque cítrico de limón. Refrescante y aromático."
        }
      ]
    },
    {
      id: "plain-black-tea-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té negro solo", 
          nextId: null,
          result: "Té negro puro. Sabor intenso y tradicional."
        }
      ]
    },
    {
      id: "matcha-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té Matcha", 
          nextId: null,
          result: "Té verde en polvo con un sabor intenso y terroso. Rico en antioxidantes."
        }
      ]
    },
    {
      id: "sencha-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té Sencha", 
          nextId: null,
          result: "Té verde japonés con sabor fresco y vegetal. Delicado y aromático."
        }
      ]
    },
    {
      id: "chamomile-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té de manzanilla", 
          nextId: null,
          result: "Infusión herbal relajante con notas florales. Ideal para calmar los nervios."
        }
      ]
    },
    {
      id: "mint-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té de menta", 
          nextId: null,
          result: "Infusión refrescante y digestiva. Perfecta después de las comidas."
        }
      ]
    },
    {
      id: "berries-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té de frutos rojos", 
          nextId: null,
          result: "Infusión frutal con sabores de fresa, frambuesa y mora. Dulce y aromática."
        }
      ]
    },
    {
      id: "choco-frap-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Frappuccino de chocolate", 
          nextId: null,
          result: "Bebida fría y cremosa de chocolate con hielo triturado. Indulgente y refrescante."
        }
      ]
    },
    {
      id: "caramel-frap-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Frappuccino de caramelo", 
          nextId: null,
          result: "Bebida fría con sabor a caramelo, hielo triturado y crema batida. Dulce y satisfactoria."
        }
      ]
    },
    {
      id: "coffee-frap-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Frappuccino de café", 
          nextId: null,
          result: "Café frío mezclado con hielo y crema. El equilibrio perfecto entre café y dulzura."
        }
      ]
    },
    {
      id: "lemon-iced-tea-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té helado de limón", 
          nextId: null,
          result: "Té negro frío con limón. Refrescante y revitalizante."
        }
      ]
    },
    {
      id: "peach-iced-tea-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Té helado de durazno", 
          nextId: null,
          result: "Té negro frío con sabor a durazno. Dulce y refrescante."
        }
      ]
    },
    {
      id: "classic-lemonade-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Limonada clásica", 
          nextId: null,
          result: "Bebida refrescante de limón, agua y azúcar. Cítrica y revitalizante."
        }
      ]
    },
    {
      id: "strawberry-lemonade-result",
      question: "¡Tu pedido está listo!",
      isResult: true,
      options: [
        { 
          text: "Limonada de fresa", 
          nextId: null,
          result: "Limonada con puré de fresas. Dulce, cítrica y refrescante."
        }
      ]
    }
  ];