/**
 * DigiVirasat 2.0 - Heritage Monuments Registry
 */

export const MONUMENTS = [
  {
    id: 'amer-fort',
    name: 'Amer Fort',
    hindiName: 'आमेर किला',
    location: 'Jaipur, Rajasthan',
    state: 'Rajasthan',
    era: '16th - 18th Century',
    builtYear: '1592 CE',
    builtBy: 'Raja Man Singh I & Mirza Raja Jai Singh',
    architecturalStyle: 'Rajput - Mughal Syncretic',
    unescoStatus: 'UNESCO World Heritage Site (2013)',
    heroImage: '/heritage/amer-fort/hero.jpg',
    thumbnail: '/heritage/amer-fort/hero.jpg',
    tags: ['UNESCO World Heritage', 'Rajput Architecture', '18th Century', 'Hill Fort'],
    description:
      'Amer Fort, also known as Amber Fort, is a majestic fortress located in Amer, 11 km from Jaipur. Perched high upon Cheel ka Teela (Hill of Eagles) overlooking Maota Lake, it showcases an opulent fusion of Rajput defensive grandeur and Mughal marble ornamentation.',
    hindiDescription:
      'आमेर किला राजस्थान के जयपुर के पास एक पहाड़ी पर स्थित एक भव्य ऐतिहासिक दुर्ग है, जो अपनी कलात्मक हिंदू-मुगल स्थापत्य शैली, संगमरमर के शीश महल और भव्य प्राचीरों के लिए विश्व प्रसिद्ध है।',
    pullQuote: 'A symbol of Rajput bravery, art and architectural genius.',
    hindiQuote: 'राजपूत वीरता, कला और स्थापत्य प्रतिभा का अमर प्रतीक।',
    elementCount: 5,
    highlights: [
      'Sheesh Mahal (Palace of Mirrors) with convex glass mosaics',
      'Diwan-e-Aam (Hall of Public Audience) with double columned sandstone',
      'Sukh Niwas with innovative water-cooled air ducting',
      'Ganesh Pol gateway with vibrant natural vegetable dye frescoes',
    ],
    architecture: {
  title: 'Rajput & Mughal Syncretism',
  hindiTitle: 'राजपूत और मुगल स्थापत्य का संगम',

  introduction:
    'Amer Fort is a layered palace complex where courtyards, gateways, audience halls and royal spaces come together to create a carefully organized architectural experience.',

  hindiIntroduction:
    'आमेर किले की स्थापत्य संरचना में प्रांगणों, भव्य द्वारों, सभा कक्षों और राजसी आवासों का सुंदर संयोजन दिखाई देता है।',

  atAGlance: [
    {
      title: 'Courtyards',
      category: 'Spatial Organization',
      description:
        'Open courtyards organize movement and connect different architectural and functional zones.',
    },
    {
      title: 'Stone & Marble',
      category: 'Material Language',
      description:
        'Stone, marble, plaster and decorative surfaces contribute to the palace’s architectural character.',
    },
    {
      title: 'Ornamentation',
      category: 'Decorative Arts',
      description:
        'Reflective elements, carved details and painted surfaces create visual richness.',
    },
    {
      title: 'Rajput & Mughal',
      category: 'Cultural Influence',
      description:
        'Regional Rajput traditions appear alongside architectural vocabulary associated with Mughal court culture.',
    },
  ],

  spaces: [
    {
      title: 'Sheesh Mahal',
      hindiTitle: 'शीश महल',
      category: 'Decorative Interior',
      elementId: 'SM-01',
      image:
        '/heritage/amer-fort/sheesh-mahal/sm-01/historical/sheesh-mahal-2021.jpg',
      description:
        'The Palace of Mirrors is known for its reflective glass ornamentation and richly decorated interior.',
    },

    {
      title: 'Diwan-i-Aam',
      hindiTitle: 'दीवान-ए-आम',
      category: 'Courtly Architecture',
      image:
        '/heritage/amer-fort/diwan-i-aam.jpg',
      description:
        'The Hall of Public Audience represents the formal public-facing side of palace life.',
    },

    {
      title: 'Sukh Niwas',
      hindiTitle: 'सुख निवास',
      category: 'Environmental Architecture',
      image:
        '/heritage/amer-fort/sukh-niwas.jpg',
      description:
        'Sukh Niwas demonstrates the relationship between palace architecture, water and interior comfort.',
    },

    {
      title: 'Ganesh Pol',
      hindiTitle: 'गणेश पोल',
      category: 'Gateway Architecture',
      elementId: 'SM-02',
      image:
        '/heritage/amer-fort/ganesh-pol/ganeshpol-2019.jpg',
      description:
        'Ganesh Pol is an important gateway marking a transition between architectural spaces within the palace complex.',
    },
  ],

  vocabulary: [
    {
      title: 'Gateways',
      description:
        'Gateways define movement and transitions between different areas of the palace.',
    },
    {
      title: 'Courtyards',
      description:
        'Open spaces organize circulation and connect architectural zones.',
    },
    {
      title: 'Ornament',
      description:
        'Decorative surfaces, reflective details and carved elements enrich the architecture.',
    },
    {
      title: 'Materials',
      description:
        'Stone, marble, plaster and decorative surfaces form an important part of the architectural character.',
    },
  ],
},
  },
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    hindiName: 'हवा महल',
    location: 'Jaipur, Rajasthan',
    state: 'Rajasthan',
    era: '18th Century',
    builtYear: '1799 CE',
    builtBy: 'Maharaja Sawai Pratap Singh',
    architecturalStyle: 'Rajput Architecture',
    unescoStatus: 'Heritage Site',
    heroImage: '/heritage/hawa-mahal/hawa-mahal.jpg',
    thumbnail: '/heritage/hawa-mahal/hawa-mahal.jpg',
    tags: ['Heritage Site', 'Rajput Architecture', '18th Century', 'Pink City'],
    description:
      'Constructed of red and pink sandstone, the five-story Palace of Winds features 953 intricately carved jharokhas designed to allow royal women to observe street festivals undetected while enjoying breezy cross-ventilation.',
    hindiDescription:
      'लाल और गुलाबी बलुआ पत्थर से निर्मित हवा महल में 953 नक्काशीदार खिड़कियां (झरोखे) हैं, जिन्हें राजसी महिलाओं के लिए महल के बाहर की हलचल देखने और प्राकृतिक ठंडक के लिए बनाया गया था।',
    pullQuote: 'A honeycomb crown rising gracefully over the Pink City.',
    hindiQuote: 'गुलाबी शहर के ऊपर शान से लहराता एक मधुमक्खी के छत्ते जैसा मुकुट।',
    elementCount: 4,
    highlights: [
      '953 carved sandstone jharokhas with miniature casements',
      'Venturi-effect natural cooling system',
      'No foundation — built with a subtle backward incline',
    ],

  architecture: {
    title: 'Architecture of Air and Light',
    hindiTitle: 'हवा, प्रकाश और झरोखों की स्थापत्य कला',

    introduction:
      'Hawa Mahal is renowned for its distinctive façade, extensive jharokhas and architectural design that creates a strong relationship between the building and the movement of air and light.',

    hindiIntroduction:
      'हवा महल अपने विशिष्ट अग्रभाग, अनेक झरोखों और हवा तथा प्रकाश के साथ स्थापत्य संबंध के लिए प्रसिद्ध है।',

    atAGlance: [
      {
        title: '953 Jharokhas',
        category: 'Façade',
        description:
          'The honeycomb-like façade is characterized by numerous small windows and projecting jharokhas.',
      },
      {
        title: 'Five Storeys',
        category: 'Vertical Design',
        description:
          'The palace rises through five storeys with a distinctive pyramidal façade.',
      },
      {
        title: 'Red & Pink Sandstone',
        category: 'Materials',
        description:
          'The structure uses the characteristic sandstone palette associated with Jaipur architecture.',
      },
      {
        title: 'Air & Light',
        category: 'Environmental Design',
        description:
          'Its numerous openings create a distinctive relationship between the interior spaces, air movement and daylight.',
      },
    ],

    spaces: [
      {
        title: 'Jharokha Façade',
        hindiTitle: 'झरोखा अग्रभाग',
        category: 'Architectural Feature',
        image: '/heritage/hawa-mahal/jharokhas.jpg',
        description:
          'The elaborate façade of projecting windows gives Hawa Mahal its characteristic honeycomb appearance.',
      },

      {
        title: 'Interior Passages',
        hindiTitle: 'आंतरिक मार्ग',
        category: 'Spatial Design',
        image: '/heritage/hawa-mahal/interior.jpg',
        description:
          'The interior circulation connects the building’s different levels and viewing spaces.',
      },
    ],

    vocabulary: [
      {
        title: 'Jharokhas',
        description:
          'Projecting windows are a defining visual feature of the palace façade.',
      },
      {
        title: 'Façade',
        description:
          'The highly articulated front elevation creates the building’s iconic appearance.',
      },
      {
        title: 'Openings',
        description:
          'Numerous openings shape the relationship between air, daylight and interior space.',
      },
      {
        title: 'Verticality',
        description:
          'The five-storey composition creates a strong upward architectural rhythm.',
      },
    ],
  },
},
     
 

  {
    id: 'jantar-mantar',
    name: 'Jantar Mantar',
    hindiName: 'जंतर मंतर',
    location: 'Jaipur, Rajasthan',
    state: 'Rajasthan',
    era: '18th Century',
    builtYear: '1734 CE',
    builtBy: 'Sawai Jai Singh II',
    architecturalStyle: 'Astronomical Architecture',
    unescoStatus: 'UNESCO World Heritage Site (2010)',
    heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
    tags: ['Astronomical', '18th Century', 'UNESCO Site', 'Geometric'],
    description:
      'A collection of 19 monumental architectural astronomical instruments built to measure time, predict eclipses, and track celestial bodies with astonishing naked-eye mathematical precision.',
    hindiDescription:
      'सवाई जय सिंह द्वितीय द्वारा निर्मित उन्नीस खगोलीय उपकरणों का यह अनूठा समूह नंगी आंखों से समय और नक्षत्रों की गति मापने की अद्भुत वैज्ञानिक मिसाल है।',
    pullQuote: 'Stone instruments that measure infinity.',
    hindiQuote: 'पत्थरों में गढ़े गए यंत्र जो अनंत आकाश को मापते हैं।',
    elementCount: 3,
    highlights: [
      'Vrihat Samrat Yantra — the world largest stone sundial (27m high)',
      'Jai Prakash Yantra for tracking celestial coordinates',
      'Ram Yantra for measuring altitude and azimuth',
    ],
  },
  {
    id: 'mehrangarh-fort',
    name: 'Mehrangarh Fort',
    hindiName: 'मेहरानगढ़ किला',
    location: 'Jodhpur, Rajasthan',
    state: 'Rajasthan',
    era: '15th Century',
    builtYear: '1459 CE',
    builtBy: 'Rao Jodha',
    architecturalStyle: 'Rajput Defensive & Palatial',
    unescoStatus: 'Heritage Citadel',
    heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    tags: ['Rajput Architecture', '15th Century', 'Fortress', 'Sun Citadel'],
    description:
      'Rising 400 feet above the skyline of Jodhpur on a perpendicular cliff, Mehrangarh is one of India’s most formidable hill citadels, renowned for its burnished lattice carvings and battle-scarred gateways.',
    hindiDescription:
      'जोधपुर के ऊपर 400 फीट ऊंची खड़ी चट्टान पर स्थित मेहरानगढ़ भारत के सबसे भव्य और अभेद्य किलों में से एक है।',
    pullQuote: 'A work of giants, of angels, and of magicians.',
    hindiQuote: 'विशाल प्राचीरों और जादूई नक्काशी से बना अजेय दुर्ग।',
    elementCount: 3,
    highlights: [
      'Moti Mahal (Pearl Palace) with iridescent glass ceiling',
      'Phool Mahal (Flower Palace) with pure gold filigree work',
      'Sheesh Mahal with large mirror pieces and painted woodwork',
    ],
  },
];
