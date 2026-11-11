const bcrypt = require('bcryptjs');

// Pre-hashed passwords for seed users
// 'Admin@12345' -> $2a$10$wKqK6n66H3xK... or hashed at seeding time
// 'Student@123' and 'Teacher@123'

const usersData = [
  {
    _id: '65f000000000000000000001',
    name: 'Sanskriti Sharma (Admin)',
    email: 'admin@heritagehub.in',
    password: 'Admin@12345', // Will be hashed by seeder
    role: 'admin',
    profile: {
      bio: 'Chief Heritage Officer & Academic Administrator for Heritage Learning Hub.',
      institution: 'Archaeological & Cultural Studies Council of India',
      grade: 'Executive Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      badges: [
        {
          id: 'b1',
          name: 'Platform Guardian',
          icon: 'Shield',
          description: 'Awarded for curating and preserving authentic Indian heritage education.',
        },
        {
          id: 'b2',
          name: 'National Heritage Fellow',
          icon: 'Award',
          description: 'Recognized for distinguished academic contributions to cultural preservation.',
        },
      ],
    },
    isActive: true,
  },
  {
    _id: '65f000000000000000000002',
    name: 'Prof. Rajesh Kulkarni',
    email: 'teacher@heritagehub.in',
    password: 'Teacher@123',
    role: 'teacher',
    profile: {
      bio: 'Senior History Professor specializing in Ancient and Medieval Indian Architecture.',
      institution: 'Delhi Department of History & Culture',
      grade: 'Senior Faculty',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      badges: [
        {
          id: 'b3',
          name: 'Master Educator',
          icon: 'GraduationCap',
          description: 'Conducted over 50 structured heritage modules for students nationwide.',
        },
      ],
    },
    isActive: true,
  },
  {
    _id: '65f000000000000000000003',
    name: 'Aarav Patel',
    email: 'student@heritagehub.in',
    password: 'Student@123',
    role: 'student',
    profile: {
      bio: 'High school student and passionate explorer of India’s temple architecture and festivals.',
      institution: 'Kendriya Vidyalaya, New Delhi',
      grade: 'Grade 11 (Humanities)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      badges: [
        {
          id: 'b4',
          name: 'Temple Architecture Explorer',
          icon: 'Compass',
          description: 'Explored and completed 5 comprehensive modules on Dravidian and Nagara styles.',
        },
        {
          id: 'b5',
          name: 'Quiz Champion',
          icon: 'Trophy',
          description: 'Scored 100% on the UNESCO World Heritage Sites of India Quiz.',
        },
        {
          id: 'b6',
          name: 'Festival Scholar',
          icon: 'Sparkles',
          description: 'Read all lessons on intangible cultural heritage and seasonal celebrations.',
        },
      ],
    },
    isActive: true,
  },
];

const heritageData = [
  {
    _id: '65f100000000000000000001',
    name: 'Taj Mahal',
    category: 'UNESCO Heritage Sites',
    state: 'Uttar Pradesh',
    location: 'Agra',
    description:
      'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in Agra. Commissioned in 1631 by Mughal Emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal, it also houses the tomb of Shah Jahan himself. Recognized universally as the jewel of Muslim art in India, it stands as one of the most universally admired masterpieces of the world heritage.',
    historicalPeriod: '17th Century Mughal Era (1631–1648 CE)',
    culturalSignificance:
      'Considered the pinnacle of Mughal architectural achievement, combining Persian, Islamic, and Indian architectural idioms. It symbolises eternal love and artistic excellence.',
    architecturalDetails:
      'Constructed using pure white Makrana marble from Rajasthan, inlaid with semi-precious stones (pietra dura). Features a symmetrical charbagh garden, four 40-meter minarets tilted slightly outward to protect the central dome in case of collapse, and an onion dome rising 73 meters.',
    importantFacts: [
      'Inscribed as a UNESCO World Heritage Site in 1983.',
      'Over 20,000 artisans and craftsmen worked under the guidance of Ustad Ahmad Lahori.',
      'The color of the marble appears to change throughout the day: pinkish at dawn, milky white in the evening, and golden under the moon.',
      'Protected and maintained by the Archaeological Survey of India (ASI).',
    ],
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=49HTVoNu5XA'],
    sourceReferences: [
      {
        title: 'Taj Mahal UNESCO World Heritage Listing',
        url: 'https://whc.unesco.org/en/list/252/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Monuments of Agra Circle - Taj Mahal',
        url: 'https://asi.nic.in/taj-mahal-agra/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: true,
    viewsCount: 1420,
  },
  {
    _id: '65f100000000000000000002',
    name: 'Ajanta Caves',
    category: 'UNESCO Heritage Sites',
    state: 'Maharashtra',
    location: 'Aurangabad (Chhatrapati Sambhaji Nagar)',
    description:
      'The Ajanta Caves are approximately 30 rock-cut Buddhist cave monuments dating from the 2nd century BCE to about 480 CE in the Aurangabad district of Maharashtra. The caves include paintings and rock-cut sculptures described as among the finest surviving examples of ancient Indian art, particularly expressive paintings that present emotion through gesture, pose, and form.',
    historicalPeriod: 'Ancient Period: Satavahana (2nd BCE) & Vakataka (5th CE) Dynasties',
    culturalSignificance:
      'Masterpieces of Buddhist religious art depicting the Jataka tales (previous lives of Gautama Buddha), vital for understanding ancient Indian cosmopolitan civilization, trade routes, and philosophical monastic life.',
    architecturalDetails:
      'Hewn out of the sheer vertical face of a 75-meter horse-shoe shaped basalt rock canyon along the Waghora River. Consists of Chaitya-grihas (sanctuaries/prayer halls) and Viharas (monasteries), painted with tempera technique on mud plaster.',
    importantFacts: [
      'Discovered accidentally in April 1819 by British Officer John Smith during a tiger hunt.',
      'Cave 1 contains the world-renowned murals of Bodhisattva Padmapani and Vajrapani.',
      'Designated a UNESCO World Heritage Site in 1983.',
      'Cave 26 features a magnificent 7-meter reclining statue representing Mahaparinirvana of the Buddha.',
    ],
    images: [
      'https://images.unsplash.com/photo-1600100397608-f010f443b793?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=Jm3U4l_w6wQ'],
    sourceReferences: [
      {
        title: 'Ajanta Caves - UNESCO Documentation',
        url: 'https://whc.unesco.org/en/list/242/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Ajanta Caves Heritage Profile',
        url: 'https://asi.nic.in/ajanta-caves/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: true,
    viewsCount: 980,
  },
  {
    _id: '65f100000000000000000003',
    name: 'Konark Sun Temple',
    category: 'Architecture',
    state: 'Odisha',
    location: 'Puri District',
    description:
      'The Sun Temple of Konark is a 13th-century CE monument dedicated to the Hindu Sun god Surya. Shaped as a colossal chariot drawn by seven horses with 24 elaborately carved stone wheels, it is the peak achievement of Kalinga architecture.',
    historicalPeriod: '13th Century (c. 1250 CE, Eastern Ganga Dynasty)',
    culturalSignificance:
      'Celebrates solar worship and celestial mechanics. Rabindranath Tagore famously wrote: "Here the language of stone surpasses the language of human."',
    architecturalDetails:
      'Built from Khondalite rocks using traditional Kalinga architectural principles. The 24 wheels function as accurate sundials, indicating time down to minutes using shadow alignments.',
    importantFacts: [
      'Attributed to King Narasimhadeva I of the Eastern Ganga Dynasty.',
      'Referred to as the "Black Pagoda" by European sailors due to its dark tower standing as a landmark on the Bay of Bengal.',
      'Inscribed on the UNESCO World Heritage List in 1984.',
      'The base displays thousands of carved figures depicting everyday life, warfare, musicians, and mythical beasts.',
    ],
    images: [
      'https://images.unsplash.com/photo-1599818816938-f9479b18365d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621511218520-2c7fa71c696e?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=kYJzXf1kI8g'],
    sourceReferences: [
      {
        title: 'Sun Temple, Konârak',
        url: 'https://whc.unesco.org/en/list/246/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Sun Temple Konark Conservation',
        url: 'https://asi.nic.in/sun-temple-konark/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: true,
    viewsCount: 1120,
  },
  {
    _id: '65f100000000000000000004',
    name: 'Group of Monuments at Hampi',
    category: 'Monuments',
    state: 'Karnataka',
    location: 'Vijayanagara',
    description:
      'Hampi was the majestic capital of the Vijayanagara Empire during the 14th to 16th centuries. Situated amidst rugged boulder-strewn terrain on the banks of the Tungabhadra River, it encompasses palaces, forts, temples, aquatic structures, and ancient marketplaces.',
    historicalPeriod: 'Vijayanagara Empire (1336–1565 CE)',
    culturalSignificance:
      'Stands as testimony to one of the greatest Hindu empires of South India, famous for cultural synthesis, international trade, literature, and temple rituals.',
    architecturalDetails:
      'Dravidian architectural style characterized by massive stone mandapas, towering gopurams, and musical pillars. The iconic Stone Chariot in the Vittala Temple complex is dedicated to Garuda.',
    importantFacts: [
      'Visited by prominent foreign travelers including Domingo Paes, Fernão Nunes, and Abdur Razzaq who praised its immense wealth.',
      'Features the 56 monolithic musical pillars of the Vittala Temple that produce acoustic notes when gently tapped.',
      'Declared a UNESCO World Heritage Site in 1986.',
      'Virupaksha Temple in Hampi has remained an active place of uninterrupted worship since the 7th century CE.',
    ],
    images: [
      'https://images.unsplash.com/photo-1609137144820-22c92e9e0237?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=F01JgV8vN0k'],
    sourceReferences: [
      {
        title: 'Group of Monuments at Hampi',
        url: 'https://whc.unesco.org/en/list/241/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Hampi Mini Circle ASI',
        url: 'https://asi.nic.in/hampi-mini-circle/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: true,
    viewsCount: 890,
  },
  {
    _id: '65f100000000000000000005',
    name: 'Khajuraho Group of Monuments',
    category: 'Monuments',
    state: 'Madhya Pradesh',
    location: 'Chhatarpur',
    description:
      'Built between 950 and 1050 CE by the Chandela dynasty, the temples of Khajuraho represent one of the greatest artistic peaks of North Indian Nagara-style architecture. Famous for balance between architectural design and sculptural ornamentation.',
    historicalPeriod: 'Chandela Dynasty (950–1050 CE)',
    culturalSignificance:
      'Reflects the four purusarthas of classical Hindu philosophy: Dharma, Artha, Kama, and Moksha. Demonstrates celebration of life, spirituality, and craftsmanship.',
    architecturalDetails:
      'Built of sandstone on high masonry terraces (jagati). Characterized by ascending shikhara towers mirroring Mount Meru, with intricately detailed relief sculptures.',
    importantFacts: [
      'Originally comprised 85 temples spread across 20 square kilometers; 25 survive today.',
      'The Kandariya Mahadeva Temple is the largest and most ornate temple of the western group.',
      'Contains Hindu and Jain temples located closely together, representing historical religious pluralism.',
      'Inscribed on the UNESCO World Heritage List in 1986.',
    ],
    images: [
      'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600100397608-f010f443b793?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=Fj7n0w8jW8k'],
    sourceReferences: [
      {
        title: 'Khajuraho Group of Monuments',
        url: 'https://whc.unesco.org/en/list/240/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Khajuraho Temples ASI Profile',
        url: 'https://asi.nic.in/khajuraho/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: false,
    viewsCount: 750,
  },
  {
    _id: '65f100000000000000000006',
    name: 'Rani ki Vav (The Queen’s Stepwell)',
    category: 'Architecture',
    state: 'Gujarat',
    location: 'Patan',
    description:
      'Rani ki Vav is an exceptionally refined subterranean stepwell situated on the banks of the Saraswati River. It was commissioned in 1063 CE by Rani Udayamati in memory of King Bhima I of the Solanki (Chalukya) dynasty. Designed as an inverted temple highlighting the sanctity of water.',
    historicalPeriod: '11th Century CE (Solanki Dynasty, c. 1063 CE)',
    culturalSignificance:
      'Represents the zenith of the Maru-Gurjara architectural style and demonstrates technological mastery in hydraulic engineering and water management in arid western India.',
    architecturalDetails:
      'Subterranean architecture arranged over seven levels of stairs with sculpted panels. Features more than 500 principal sculptures and over a thousand minor ones, predominantly dedicated to Lord Vishnu and his avatars.',
    importantFacts: [
      'Inscribed as a UNESCO World Heritage Site in 2014.',
      'Buried under silt for centuries after the Saraswati River shifted course, which helped preserve its intricate stone carvings.',
      'Depicted on the reverse side of the Indian ₹100 currency note issued by the Reserve Bank of India.',
      'Excavated and restored by the Archaeological Survey of India starting in the 1980s.',
    ],
    images: [
      'https://images.unsplash.com/photo-1609137144820-22c92e9e0237?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599818816938-f9479b18365d?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=W06jV6bK7bE'],
    sourceReferences: [
      {
        title: 'Rani-ki-Vav at Patan, Gujarat',
        url: 'https://whc.unesco.org/en/list/1307/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Rani ki Vav ASI Portal',
        url: 'https://asi.nic.in/rani-ki-vav-patan/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: true,
    viewsCount: 820,
  },
  {
    _id: '65f100000000000000000007',
    name: 'Garba of Gujarat',
    category: 'Festivals',
    state: 'Gujarat',
    location: 'Pan-Gujarat (Ahmedabad, Vadodara, Rajkot)',
    description:
      'Garba is a devotional folk dance performed during the Hindu festival of Navratri, celebrating feminine divinity (Shakti). Dancers move circularly around an illuminated lantern or an image of the Goddess Durga, symbolizing the cyclic nature of time and creation.',
    historicalPeriod: 'Ancient Folk Tradition, Continuous Practice',
    culturalSignificance:
      'Inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity in December 2023. Fosters social equality, inter-generational bonding, and community harmony.',
    architecturalDetails:
      'Performed in open courtyards (Chowks) and vast community grounds. Dancers wear traditional Chaniya Choli embroidered with mirrors, cowrie shells, and bandhani tie-dye work.',
    importantFacts: [
      'The word Garba comes from the Sanskrit word "Garbha", meaning womb, symbolizing the source of life.',
      'Navratri is celebrated over 9 consecutive nights, making Garba one of the world’s longest dance festivals.',
      'Accompanied by traditional acoustic instruments including Dhol, Dholak, Shehnai, and harmonium.',
      'Inscribed by UNESCO as Intangible Cultural Heritage in 2023.',
    ],
    images: [
      'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=FzX7w7lP2o8'],
    sourceReferences: [
      {
        title: 'Garba of Gujarat - UNESCO Intangible Heritage',
        url: 'https://ich.unesco.org/en/RL/garba-of-gujarat-01962',
        organization: 'UNESCO Intangible Cultural Heritage',
      },
      {
        title: 'Ministry of Culture Press Note on Garba',
        url: 'https://pib.gov.in/PressReleaseIframePage.aspx?PRID=1983050',
        organization: 'Ministry of Culture, Government of India',
      },
    ],
    featured: true,
    viewsCount: 1350,
  },
  {
    _id: '65f100000000000000000008',
    name: 'Durga Puja of Kolkata',
    category: 'Festivals',
    state: 'West Bengal',
    location: 'Kolkata',
    description:
      'Durga Puja is an annual celebration of the Hindu goddess Durga, commemorating her triumph over the buffalo demon Mahishasura. It is celebrated with grand temporary bamboo and fabric pavilions (pandals), spectacular public art, traditional Dhak drumming, and communal feasts.',
    historicalPeriod: 'Medieval Roots (16th Century CE to Present)',
    culturalSignificance:
      'Inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity in 2021. Transcends religious boundaries, transforming Kolkata into the world’s largest open-air art installation.',
    architecturalDetails:
      'Temporary architecture called "Pandals" designed by artists using eco-friendly materials like bamboo, clay, jute, and paper, housing clay idols of Goddess Durga crafted in the artisans’ quarter of Kumartuli.',
    importantFacts: [
      'First festival in Asia to receive UNESCO Intangible Cultural Heritage recognition.',
      'The idol making tradition in Kumartuli uses clay collected from the banks of the sacred Hooghly River.',
      'Concludes on Vijaya Dashami with Sindoor Khela and immersion (Visarjan) of the clay idols into the river.',
      'Features the energizing Dhunuchi Naach performed holding smoking clay censers with burning coconut husk.',
    ],
    images: [
      'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=rZ04Y7xL4jI'],
    sourceReferences: [
      {
        title: 'Durga Puja in Kolkata - UNESCO Inscription',
        url: 'https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00707',
        organization: 'UNESCO Intangible Cultural Heritage',
      },
      {
        title: 'National Portal of India - Durga Puja',
        url: 'https://www.india.gov.in/spotlight/durga-puja-celebration-spirit',
        organization: 'Government of India',
      },
    ],
    featured: true,
    viewsCount: 1290,
  },
  {
    _id: '65f100000000000000000009',
    name: 'Bharatanatyam',
    category: 'Traditions',
    state: 'Tamil Nadu',
    location: 'Thanjavur & Chennai',
    description:
      'Bharatanatyam is one of the oldest and most revered classical dance traditions of India, originating in the Hindu temples of Tamil Nadu. Regulated by sage Bharata Muni’s ancient treatise, the Natyashastra, it seamlessly weaves Nritta (pure rhythmic dance), Nritya (solo expressive dance), and Natya (dramatic storytelling).',
    historicalPeriod: 'Ancient Classical Origin (c. 2nd Century BCE Natyashastra)',
    culturalSignificance:
      'Expresses spiritual devotion (Bhakti), mythological narratives, and Vedic philosophical concepts through codified mudras (hand gestures), eye movements, and precise geometric footwork.',
    architecturalDetails:
      'The sculptures of the Chidambaram Nataraja Temple depict all 108 Karanas (fundamental dance postures) described in the Natyashastra, serving as an architectural encyclopedia of Bharatanatyam.',
    importantFacts: [
      'Historically practiced by temple dancers known as Devadasis and preserved in Thanjavur Royal Court.',
      'Revitalized in the early 20th century by visionary pioneers Rukmini Devi Arundale and E. Krishna Iyer.',
      'Costumes are woven from authentic Kanchipuram silk with pleated front fans that open dynamically during Araimandi stance.',
      'Music is accompanied by Carnatic classical orchestra including Mridangam, Veena, Flute, and Nattuvangam cymbals.',
    ],
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=q60h6rE3KxQ'],
    sourceReferences: [
      {
        title: 'Sangeet Natak Akademi - Classical Dances',
        url: 'https://sangeetnatak.gov.in/sna/bharatanatyam.php',
        organization: 'Sangeet Natak Akademi, Ministry of Culture',
      },
      {
        title: 'Indian Culture Portal - Classical Dances',
        url: 'https://indianculture.gov.in/performing-arts/dance/classical-dance',
        organization: 'Ministry of Culture, Government of India',
      },
    ],
    featured: false,
    viewsCount: 710,
  },
  {
    _id: '65f100000000000000000010',
    name: 'Madhubani (Mithila) Painting',
    category: 'Art and Crafts',
    state: 'Bihar',
    location: 'Mithila Region (Madhubani, Darbhanga)',
    description:
      'Madhubani painting, also known as Mithila art, is a traditional folk art practiced predominantly by women in the Mithila region of Bihar and Nepal. Characterized by complex geometric patterns, double-line borders, and scenes depicting nature, deities, rituals, and celestial elements.',
    historicalPeriod: 'Ancient Roots (Folklore connects it to King Janaka and Ramayana era)',
    culturalSignificance:
      'Transmitted orally from mothers to daughters over millennia, serving as a visual medium for domestic blessing, marriage rituals (Kohbar), and ecological reverence.',
    architecturalDetails:
      'Traditionally painted on freshly plastered mud and cow-dung walls of huts; in contemporary times practiced on handmade paper, canvas, and tussar silk textiles.',
    importantFacts: [
      'Uses 100% natural pigments derived from turmeric, indigo, crushed marigold petals, soot, and peepal tree sap.',
      'Rendered using simple tools like bamboo sticks wrapped in cotton and pointed twigs without preliminary sketch lines.',
      'Holds a Geographical Indication (GI) tag certifying its authentic regional origin.',
      'Celebrated artists like Ganga Devi, Sita Devi, and Mahasundari Devi received the prestigious Padma Shri award.',
    ],
    images: [
      'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=Fj7n0w8jW8k'],
    sourceReferences: [
      {
        title: 'Geographical Indications Registry - Madhubani Paintings',
        url: 'https://ipindia.gov.in/registered-gls.htm',
        organization: 'Intellectual Property India',
      },
      {
        title: 'Indian Culture Portal - Mithila Folk Art',
        url: 'https://indianculture.gov.in/paintings/mithila-paintings',
        organization: 'Ministry of Culture, Government of India',
      },
    ],
    featured: false,
    viewsCount: 640,
  },
  {
    _id: '65f100000000000000000011',
    name: 'Qutub Minar & Its Monuments',
    category: 'Monuments',
    state: 'Delhi',
    location: 'Mehrauli, South Delhi',
    description:
      'The Qutub Minar is a soaring 72.5-meter red sandstone minaret built between 1199 and 1220 CE. Surrounded by ancient medieval ruins including the Quwwat-ul-Islam Mosque, the Alai Darwaza gate, and the celebrated 4th-century rust-resistant Iron Pillar of Chandragupta II.',
    historicalPeriod: 'Delhi Sultanate (1199–1220 CE; Mamluk & Khalji Dynasties)',
    culturalSignificance:
      'Marks the transition and establishment of Indo-Islamic architectural idioms in Northern India, synthesizing Islamic inscriptions with traditional Hindu stone-carving craftsmanship.',
    architecturalDetails:
      'Features five distinct tapering stories with projecting balconies supported by intricate stalactite-like corbels. The first three storeys are constructed from fluted red sandstone, while the fourth and fifth storeys incorporate white marble.',
    importantFacts: [
      'Tallest brick minaret in the world at 72.5 meters (238 feet).',
      'The Iron Pillar in the courtyard has stood for over 1,600 years without rusting due to a protective layer of crystalline iron hydrogen phosphate hydrate (misawite).',
      'Inscribed on the UNESCO World Heritage List in 1993.',
      'Contains detailed Arabic calligraphic inscriptions and verses from the Holy Quran.',
    ],
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=34d7w8eL4eE'],
    sourceReferences: [
      {
        title: 'Qutb Minar and its Monuments, Delhi',
        url: 'https://whc.unesco.org/en/list/239/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Qutub Minar ASI Profile',
        url: 'https://asi.nic.in/qutb-minar-delhi/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: false,
    viewsCount: 930,
  },
  {
    _id: '65f100000000000000000012',
    name: 'Red Fort Complex (Lal Qila)',
    category: 'Historical Events',
    state: 'Delhi',
    location: 'Old Delhi',
    description:
      'The Red Fort was built by Mughal Emperor Shah Jahan when he shifted his imperial capital from Agra to Shahjahanabad in 1638. Constructed of massive red sandstone walls, it served as the political seat of the Mughal empire for two centuries and remains the ceremonial epicenter of India’s Independence Day celebrations.',
    historicalPeriod: 'Mughal Empire (1638–1648 CE)',
    culturalSignificance:
      'A supreme symbol of sovereign Indian statehood. Every year on August 15th, the Prime Minister of India unfurls the national tricolor from the ramparts of the Lahori Gate.',
    architecturalDetails:
      'Designed by Ustad Ahmad Lahori. Highlights include the Diwan-i-Aam (Hall of Public Audiences), Diwan-i-Khas (Hall of Private Audiences) inscribed with the famous Persian couplet on paradise, and the Nahr-i-Bihisht (Canal of Paradise) water system.',
    importantFacts: [
      'Inscribed as a UNESCO World Heritage Site in 2007.',
      'Once housed the legendary jewel-encrusted Peacock Throne before it was carried away by Nadir Shah in 1739.',
      'Site of the historic 1945 Indian National Army (INA) trials featuring Col. Prem Sahgal, Col. Gurbaksh Singh Dhillon, and Maj. Gen. Shah Nawaz Khan.',
      'Features the octagonal Moti Masjid (Pearl Mosque) built in white marble by Aurangzeb.',
    ],
    images: [
      'https://images.unsplash.com/photo-1585131526462-23c8a9f39002?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599818816938-f9479b18365d?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=2rE4s4d9wQw'],
    sourceReferences: [
      {
        title: 'Red Fort Complex - UNESCO',
        url: 'https://whc.unesco.org/en/list/1054/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Red Fort ASI National Monument',
        url: 'https://asi.nic.in/red-fort-delhi/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: true,
    viewsCount: 1510,
  },
  {
    _id: '65f100000000000000000013',
    name: 'Jaipur City (Pink City)',
    category: 'UNESCO Heritage Sites',
    state: 'Rajasthan',
    location: 'Jaipur',
    description:
      'Jaipur was founded in 1727 CE by Maharaja Sawai Jai Singh II. Unlike other medieval hill towns in the region, Jaipur was intentionally planned on a grid iron plan derived from ancient Vedic Shilpa Shastra and Vastu Vidya under architect Vidyadhar Bhattacharya.',
    historicalPeriod: '18th Century Princely State (Founded 1727 CE)',
    culturalSignificance:
      'Declared a UNESCO World Heritage Site in 2019 for outstanding urban planning, historic bazaars, traditional craft guilds, and preservation of royal architectural heritage.',
    architecturalDetails:
      'Unified terracotta-pink wash painted across building facades in 1876 to welcome the Prince of Wales. Notable landmarks include Hawa Mahal (Palace of Winds) with 953 jharokhas, City Palace, and Jantar Mantar astronomical observatory.',
    importantFacts: [
      'Inscribed on the UNESCO World Heritage List as a Historic City in July 2019.',
      'Jantar Mantar in Jaipur houses the world’s largest stone sundial, the Vrihat Samrat Yantra.',
      'City streets are divided into nine rectangular blocks (Chowkris) reflecting the Navagraha celestial arrangement.',
      'Home to world-renowned artisanal traditions including blue pottery, block printing, and meenakari jewelry.',
    ],
    images: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=F01JgV8vN0k'],
    sourceReferences: [
      {
        title: 'Jaipur City, Rajasthan - UNESCO Inscription',
        url: 'https://whc.unesco.org/en/list/1605/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Rajasthan Tourism - The Pink City Jaipur',
        url: 'https://www.tourism.rajasthan.gov.in/jaipur.html',
        organization: 'Department of Tourism, Government of Rajasthan',
      },
    ],
    featured: false,
    viewsCount: 1100,
  },
  {
    _id: '65f100000000000000000014',
    name: 'Ellora Caves (Verul)',
    category: 'Architecture',
    state: 'Maharashtra',
    location: 'Aurangabad District',
    description:
      'Ellora Caves comprises 34 monasteries and temples dug side by side in the wall of a high basalt cliff. Dating from 600 to 1000 CE, it brings to life the ancient civilization of India with Hindu, Buddhist, and Jain sanctuaries standing in peaceful coexistence.',
    historicalPeriod: 'Rashtrakuta & Yadava Dynasties (6th to 10th Century CE)',
    culturalSignificance:
      'Home to the awe-inspiring Cave 16 (Kailash Temple), the largest monolithic rock-cut structure in the world, carved from top to bottom out of a single living rock cliff.',
    architecturalDetails:
      'The Kailash Temple (Cave 16) was excavated by removing over 200,000 tonnes of basalt rock without structural joins or scaffolding. Represents Mount Kailash, abode of Lord Shiva.',
    importantFacts: [
      'Caves 1–12 are Buddhist, 13–29 are Hindu, and 30–34 are Jain, demonstrating unparalleled religious tolerance in ancient India.',
      'Commissioned predominantly under Rashtrakuta King Krishna I (reigned c. 756–773 CE).',
      'Inscribed on the UNESCO World Heritage List in 1983.',
      'Features two-storey and three-storey monastic halls carved entirely into bedrock.',
    ],
    images: [
      'https://images.unsplash.com/photo-1600100397608-f010f443b793?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=Jm3U4l_w6wQ'],
    sourceReferences: [
      {
        title: 'Ellora Caves - UNESCO Documentation',
        url: 'https://whc.unesco.org/en/list/243/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Ellora Caves ASI Monument Archive',
        url: 'https://asi.nic.in/ellora-caves/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: false,
    viewsCount: 880,
  },
  {
    _id: '65f100000000000000000015',
    name: 'Diwali (Deepotsav)',
    category: 'Festivals',
    state: 'Pan-India',
    location: 'Ayodhya & Pan-India',
    description:
      'Diwali, or Deepavali, is the festival of lights celebrated across India. It symbolizes the spiritual victory of light over darkness, good over evil, and knowledge over ignorance. Celebrated with the lighting of clay diyas, rangoli patterns, fireworks, family feasts, and prayers to Goddess Lakshmi and Lord Ganesha.',
    historicalPeriod: 'Ancient Vedic Roots (Continuous Living Tradition)',
    culturalSignificance:
      'Commemorates the return of Lord Rama, Sita, and Lakshmana to Ayodhya after 14 years of exile and victory over Ravana. Also marks the commencement of the traditional new fiscal year (Vikram Samvat) in Western and Northern India.',
    architecturalDetails:
      'Public illumination transforms temples, river ghats (notably Ram Ki Paidi in Ayodhya and Dashashwamedh Ghat in Varanasi), and residential homes with symmetrical kolams and clay earthen lamps.',
    importantFacts: [
      'The Ayodhya Deepotsav sets Guinness World Records annually by lighting over 2.2 million eco-friendly earthen diyas on the Sarayu river ghats.',
      'Celebrated over five festive days: Dhanteras, Naraka Chaturdashi, Lakshmi Puja, Govardhan Puja, and Bhai Dooj.',
      'Also observed by Jains commemorating the Nirvana of Lord Mahavira, and by Sikhs celebrating Bandi Chhor Divas.',
      'Unites diverse communities across all 28 states and 8 union territories.',
    ],
    images: [
      'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=uK1f4g77xY4'],
    sourceReferences: [
      {
        title: 'Incredible India - Deepavali Festival of Lights',
        url: 'https://www.incredibleindia.gov.in/en/destinations/diwali',
        organization: 'Ministry of Tourism, Government of India',
      },
      {
        title: 'Indian Culture Portal - Festivals of India',
        url: 'https://indianculture.gov.in/festivals-of-india',
        organization: 'Ministry of Culture, Government of India',
      },
    ],
    featured: true,
    viewsCount: 1670,
  },
  {
    _id: '65f100000000000000000016',
    name: 'Dholavira: A Harappan City',
    category: 'UNESCO Heritage Sites',
    state: 'Gujarat',
    location: 'Khadir Bet, Kutch District',
    description:
      'Dholavira is an ancient archaeological metropolis belonging to the Indus Valley (Harappan) Civilization, flourishing between 3000 BCE and 1500 BCE. Located in the Great Rann of Kutch, it is renowned for its sophisticated water harvesting network, rock-cut reservoirs, tripartite city planning, and stone architecture.',
    historicalPeriod: 'Bronze Age Harappan Civilization (3000–1500 BCE)',
    culturalSignificance:
      'Inscribed as a UNESCO World Heritage Site in 2021. Demonstrates exceptional human ingenuity in environmental adaptation, urban sanitation, and trade connectivity across the Persian Gulf and Mesopotamia.',
    architecturalDetails:
      'Consists of a fortified citadel, middle town, and lower town built of dressed stone instead of baked bricks common in other Harappan sites. Features 16 enormous stone-cut reservoirs capable of storing millions of liters of seasonal monsoon runoff.',
    importantFacts: [
      'Unearthed a famous 10-character Harappan signboard carved in gypsum, one of the longest preserved Indus inscriptions.',
      'First Indus Valley Civilization site in India to be granted UNESCO World Heritage status.',
      'Features advanced stormwater collection drains and sedimentation filtration chambers.',
      'Excavated extensively under ASI archaeologist Dr. R.S. Bisht starting in 1990.',
    ],
    images: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1609137144820-22c92e9e0237?auto=format&fit=crop&w=1200&q=80',
    ],
    videoLinks: ['https://www.youtube.com/watch?v=F01JgV8vN0k'],
    sourceReferences: [
      {
        title: 'Dholavira: a Harappan City - UNESCO',
        url: 'https://whc.unesco.org/en/list/1644/',
        organization: 'UNESCO World Heritage Centre',
      },
      {
        title: 'Dholavira Excavations and Conservation',
        url: 'https://asi.nic.in/dholavira-kutch/',
        organization: 'Archaeological Survey of India (ASI)',
      },
    ],
    featured: false,
    viewsCount: 780,
  },
];

const learningModulesData = [
  {
    _id: '65f200000000000000000001',
    title: 'Mastering Temple Architecture of India',
    category: 'Architecture',
    level: 'Intermediate',
    duration: '1.5 Hours',
    description:
      'A curriculum-aligned deep-dive into the architectural taxonomy of India: Nagara (North), Dravida (South), and Vesara (Deccan) styles, examining ground plans, mandapas, and shikhara typologies.',
    thumbnail: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80',
    lessons: [
      {
        id: 'les-1',
        title: 'The Grammar of Hindu Temple Architecture',
        summary: 'Understanding the Garbhagriha, Mandapa, Shikhara/Vimana, and Antarala.',
        content:
          'The Hindu temple is conceived as a macrocosm and microcosm of the universe according to the Vastu Purusha Mandala. At its core lies the Garbhagriha (sanctum sanctorum), housing the main deity under the highest vertical tower. Worshippers traverse the Ardha-mandapa and Maha-mandapa before reaching the circumambulatory path (Pradakshina-patha).',
        readingTime: '12 mins',
        keyTakeaways: [
          'The Garbhagriha represents the cosmic womb of pure consciousness.',
          'Vastu Purusha Mandala provides the 64 or 81 square grid governing temple layout.',
          'Shikhara represents the axis mundi connecting earthly life to celestial realms.',
        ],
      },
      {
        id: 'les-2',
        title: 'Nagara Style vs Dravidian Style: Structural Contrasts',
        summary: 'Analyzing curvilinear spires versus pyramidal stepped vimanas.',
        content:
          'In Northern India (Nagara style), the shikhara is curvilinear (Rekha-Prasad) capped by an Amalaka (stone disc) and Kalasha. In Southern India (Dravida style), the Vimana rises as a stepped pyramid capped by an octagonal or spherical Shikhara, while the entrance gateway (Gopuram) dominates the exterior skyline.',
        readingTime: '15 mins',
        keyTakeaways: [
          'Nagara style features Amalaka and Kalasha at the top of a bee-hive shaped tower.',
          'Dravidian style emphasizes towering decorative Gopurams on boundary walls.',
          'Vesara style, seen in Hoysala and Chalukyan temples, synthesizes both systems.',
        ],
      },
    ],
    pdfResources: [
      {
        title: 'NCERT Fine Arts: Indian Temple Architectural Traditions',
        fileSize: '3.8 MB',
        downloadUrl: 'https://ncert.nic.in/textbook/pdf/kefa106.pdf',
        description: 'Comprehensive NCERT Class XI Chapter 6 on Temple Architecture and Sculpture.',
      },
      {
        title: 'ASI Field Guide to Kalinga Architecture (Konark & Puri)',
        fileSize: '2.1 MB',
        downloadUrl: 'https://asi.nic.in/pdf/kalinga-architecture-guide.pdf',
        description: 'Detailed anatomical diagrams of Jagamohana, Deula, and Natamandira.',
      },
    ],
    videoResources: [
      {
        title: 'Deciphering the Kailash Temple at Ellora',
        duration: '18 mins',
        videoUrl: 'https://www.youtube.com/watch?v=Jm3U4l_w6wQ',
        source: 'Archaeological Survey of India Documentary Archive',
      },
    ],
  },
  {
    _id: '65f200000000000000000002',
    title: 'UNESCO Intangible Cultural Heritage of India',
    category: 'Traditions',
    level: 'Beginner',
    duration: '1 Hour',
    description:
      'Explore living heritage elements of India inscribed on the UNESCO Intangible Cultural Heritage list, including Vedic chanting, Ramlila, Garba, and Kumbh Mela.',
    thumbnail: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=600&q=80',
    lessons: [
      {
        id: 'les-3',
        title: 'What is Intangible Cultural Heritage (ICH)?',
        summary: 'Defining living expressions, oral traditions, and craftsmanship.',
        content:
          'Intangible cultural heritage comprises practices, representations, expressions, knowledge, and skills that communities recognize as part of their cultural heritage. Unlike monuments, it is living and dynamic, safeguarded through transmission from generation to generation.',
        readingTime: '10 mins',
        keyTakeaways: [
          'UNESCO adopted the Convention for Safeguarding of ICH in 2003.',
          'India currently has 15 elements inscribed on the Representative List.',
          'Garba of Gujarat was inscribed in 2023, and Durga Puja in Kolkata in 2021.',
        ],
      },
      {
        id: 'les-4',
        title: 'The Tradition of Vedic Chanting',
        summary: 'Mastering unbroken auditory recitation techniques spanning three millennia.',
        content:
          'The oral tradition of the Vedas is considered one of the oldest unbroken auditory lineages in human history. To ensure pristine phonetic preservation, ancient rishis engineered 11 recitation modes including Samhita-patha, Pada-patha, Krama-patha, and complex permutation methods like Jata and Ghana patha.',
        readingTime: '14 mins',
        keyTakeaways: [
          'Inscribed by UNESCO in 2008 (originally proclaimed in 2003).',
          'Mathematical permutations prevented any textual corruption across thousands of years.',
          'Encompasses Rigveda, Samaveda, Yajurveda, and Atharvaveda chant meters.',
        ],
      },
    ],
    pdfResources: [
      {
        title: 'UNESCO Dossier: Intangible Heritage Elements of India',
        fileSize: '4.5 MB',
        downloadUrl: 'https://ich.unesco.org/doc/src/00707-EN.pdf',
        description: 'Official dossier documenting the 15 inscribed Indian living traditions.',
      },
    ],
    videoResources: [
      {
        title: 'The Sacred Cadence: Vedic Chanting Masterclass',
        duration: '22 mins',
        videoUrl: 'https://www.youtube.com/watch?v=q60h6rE3KxQ',
        source: 'Sangeet Natak Akademi Archives',
      },
    ],
  },
  {
    _id: '65f200000000000000000003',
    title: 'Indus Valley Civilization: Urban Engineering & Trade',
    category: 'Historical Events',
    level: 'Advanced',
    duration: '2 Hours',
    description:
      'Examine Harappan town planning, standardized weights, dockyards at Lothal, and hydraulic engineering at Dholavira with authentic archaeological evidence.',
    thumbnail: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
    lessons: [
      {
        id: 'les-5',
        title: 'Urban Planning and Sanitary Infrastructure',
        summary: 'Grid plans, standardized baked bricks, and covered drainage networks.',
        content:
          'Indus Valley cities demonstrated unprecedented civic planning. Roads ran in north-south and east-west cardinal directions. Every house had private bathing platforms and latrines connecting to soak-pits and subterranean covered street drains with inspection manholes.',
        readingTime: '15 mins',
        keyTakeaways: [
          'Standard brick ratio of 1:2:4 used uniformly across all Harappan settlements.',
          'The Great Bath of Mohenjo-daro was waterproofed with gypsum mortar and natural bitumen.',
          'Citadels housed public granaries, assembly halls, and administrative quarters.',
        ],
      },
    ],
    pdfResources: [
      {
        title: 'ASI Memoirs: Dholavira Excavation Report by Dr. R.S. Bisht',
        fileSize: '6.2 MB',
        downloadUrl: 'https://asi.nic.in/pdf/dholavira-report-summary.pdf',
        description: 'Comprehensive study of ancient hydraulic engineering and signboards.',
      },
    ],
    videoResources: [
      {
        title: 'Harappan Engineering: Secrets of Dholavira',
        duration: '25 mins',
        videoUrl: 'https://www.youtube.com/watch?v=F01JgV8vN0k',
        source: 'National Geographic / ASI Joint Research Series',
      },
    ],
  },
];

const quizzesData = [
  {
    _id: '65f300000000000000000001',
    title: 'UNESCO World Heritage Sites of India Quiz',
    category: 'UNESCO Heritage Sites',
    difficulty: 'Medium',
    timeLimit: 10,
    description:
      'Test your knowledge on India’s iconic UNESCO World Heritage Sites, their historical dates, builders, and distinctive architectural elements.',
    questions: [
      {
        id: 'q1',
        question: 'Under which Mughal Emperor was the construction of the Taj Mahal commissioned?',
        options: ['Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb'],
        correctAnswer: 2,
        explanation:
          'Shah Jahan commissioned the Taj Mahal in 1631 in memory of his beloved empress Mumtaz Mahal.',
      },
      {
        id: 'q2',
        question: 'Which ancient dynasty commissioned the subterranean stepwell "Rani ki Vav" in Patan, Gujarat?',
        options: ['Solanki (Chalukya) Dynasty', 'Rashtrakuta Dynasty', 'Chola Dynasty', 'Maurya Dynasty'],
        correctAnswer: 0,
        explanation:
          'Rani ki Vav was built in 1063 CE by Queen Udayamati of the Solanki dynasty in memory of King Bhima I.',
      },
      {
        id: 'q3',
        question: 'What unique scientific feature is incorporated into the stone wheels of the Konark Sun Temple?',
        options: [
          'They resonate sound when wind blows',
          'They function as precise sundials indicating time by shadow alignment',
          'They can rotate 360 degrees on wooden axles',
          'They mark the exact compass coordinates of ancient sea ports',
        ],
        correctAnswer: 1,
        explanation:
          'The 24 wheels of Konark Sun Temple act as intricate sundials, where spokes indicate hours and minutes using shadow calculations.',
      },
      {
        id: 'q4',
        question: 'In which Indian state are the famous rock-cut Buddhist Ajanta Caves located?',
        options: ['Madhya Pradesh', 'Karnataka', 'Maharashtra', 'Odisha'],
        correctAnswer: 2,
        explanation:
          'Ajanta Caves are located in the Aurangabad (Chhatrapati Sambhaji Nagar) district of Maharashtra along the Waghora River canyon.',
      },
      {
        id: 'q5',
        question: 'Which living tradition was officially inscribed on the UNESCO Intangible Cultural Heritage List in December 2023?',
        options: ['Kumbh Mela', 'Durga Puja of Kolkata', 'Garba of Gujarat', 'Chhau Dance'],
        correctAnswer: 2,
        explanation:
          'Garba of Gujarat was inscribed by UNESCO on December 6, 2023 during the 18th session of the Intergovernmental Committee in Kasane, Botswana.',
      },
    ],
  },
  {
    _id: '65f300000000000000000002',
    title: 'Indian Architecture & Temple Styles Assessment',
    category: 'Architecture',
    difficulty: 'Hard',
    timeLimit: 12,
    description:
      'Challenge yourself on structural components, canonical treatises like Natyashastra, and temple styles across Indian history.',
    questions: [
      {
        id: 'q2-1',
        question: 'The Kailash Temple at Ellora (Cave 16) was excavated during the reign of which Rashtrakuta monarch?',
        options: ['Krishna I', 'Dantidurga', 'Amoghavarsha I', 'Govinda III'],
        correctAnswer: 0,
        explanation:
          'Cave 16 Kailash Temple was excavated top-to-bottom from a single rock cliff predominantly under King Krishna I (c. 756–773 CE).',
      },
      {
        id: 'q2-2',
        question: 'Which crowning stone element distinguishes the top of a northern Nagara style temple shikhara?',
        options: ['Gopuram', 'Amalaka and Kalasha', 'Vimana', 'Torana'],
        correctAnswer: 1,
        explanation:
          'A Nagara style shikhara is crowned with an Amalaka (a fluted stone disc) topped by a Kalasha (sacred finial pot).',
      },
      {
        id: 'q2-3',
        question: 'What is the primary material used in the iconic monolithic sculptures of the Vittala Temple in Hampi?',
        options: ['Granite', 'Red Sandstone', 'Makrana Marble', 'Chlorite Schist'],
        correctAnswer: 0,
        explanation:
          'The monuments of Hampi, including the musical pillars and the Stone Chariot, were masterfully carved from indigenous hard granite rocks.',
      },
      {
        id: 'q2-4',
        question: 'Which ancient Harappan city is world-famous for its 16 rock-cut rainwater reservoirs and 10-symbol signboard?',
        options: ['Kalibangan', 'Lothal', 'Dholavira', 'Banawali'],
        correctAnswer: 2,
        explanation:
          'Dholavira in Kutch, Gujarat possesses the most advanced rainwater harvesting and rock-cut reservoir network in the ancient world.',
      },
    ],
  },
  {
    _id: '65f300000000000000000003',
    title: 'Festivals and Folk Traditions of India',
    category: 'Festivals',
    difficulty: 'Easy',
    timeLimit: 8,
    description:
      'A delightful quiz testing your grasp of India’s festive calendar, folk arts, and community celebrations.',
    questions: [
      {
        id: 'q3-1',
        question: 'Which classical dance originated in the temples of Tamil Nadu and is rooted in the Natyashastra?',
        options: ['Kathakali', 'Bharatanatyam', 'Manipuri', 'Kathak'],
        correctAnswer: 1,
        explanation:
          'Bharatanatyam originated in Tamil Nadu and was historically practiced in temple sanctums before modern renaissance.',
      },
      {
        id: 'q3-2',
        question: 'Madhubani painting is an ancient folk art tradition native to which Indian state?',
        options: ['Rajasthan', 'West Bengal', 'Bihar', 'Odisha'],
        correctAnswer: 2,
        explanation:
          'Madhubani (Mithila) art hails from the Mithila region of Bihar, traditionally painted using natural pigments and twigs.',
      },
      {
        id: 'q3-3',
        question: 'During Durga Puja in Kolkata, what is the term for the temporary artistic architectural pavilions created to house the idols?',
        options: ['Pandals', 'Mandapas', 'Gopurams', 'Jharokhas'],
        correctAnswer: 0,
        explanation:
          'Pandals are temporary pavilions crafted with extraordinary artistic themes across Kolkata during Durga Puja.',
      },
    ],
  },
];

const progressData = [
  {
    userId: '65f000000000000000000003', // Aarav Patel (Student)
    completedModules: [
      {
        moduleId: '65f200000000000000000001',
        moduleTitle: 'Mastering Temple Architecture of India',
        completedAt: new Date('2026-10-15T10:30:00Z'),
        score: 100,
      },
      {
        moduleId: '65f200000000000000000002',
        moduleTitle: 'UNESCO Intangible Cultural Heritage of India',
        completedAt: new Date('2026-10-28T14:20:00Z'),
        score: 95,
      },
    ],
    quizScores: [
      {
        quizId: '65f300000000000000000001',
        quizTitle: 'UNESCO World Heritage Sites of India Quiz',
        score: 5,
        totalQuestions: 5,
        percentage: 100,
        difficulty: 'Medium',
        completedAt: new Date('2026-11-01T16:00:00Z'),
      },
      {
        quizId: '65f300000000000000000003',
        quizTitle: 'Festivals and Folk Traditions of India',
        score: 3,
        totalQuestions: 3,
        percentage: 100,
        difficulty: 'Easy',
        completedAt: new Date('2026-11-05T11:45:00Z'),
      },
    ],
    recentlyViewed: [
      { heritageId: '65f100000000000000000001', viewedAt: new Date('2026-11-10T18:00:00Z') }, // Taj Mahal
      { heritageId: '65f100000000000000000004', viewedAt: new Date('2026-11-09T14:15:00Z') }, // Hampi
      { heritageId: '65f100000000000000000007', viewedAt: new Date('2026-11-08T09:30:00Z') }, // Garba
    ],
    lastAccessed: new Date(),
  },
];

const bookmarksData = [
  {
    userId: '65f000000000000000000003',
    heritageId: '65f100000000000000000001', // Taj Mahal
    createdAt: new Date('2026-11-02T10:00:00Z'),
  },
  {
    userId: '65f000000000000000000003',
    heritageId: '65f100000000000000000003', // Konark
    createdAt: new Date('2026-11-04T12:00:00Z'),
  },
  {
    userId: '65f000000000000000000003',
    heritageId: '65f100000000000000000006', // Rani ki Vav
    createdAt: new Date('2026-11-07T15:30:00Z'),
  },
];

module.exports = {
  usersData,
  heritageData,
  learningModulesData,
  quizzesData,
  progressData,
  bookmarksData,
};
