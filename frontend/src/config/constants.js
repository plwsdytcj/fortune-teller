export const DIVINATION_OPTIONS = [
    {
        label: 'Tarot',
        key: 'tarot',
        icon: '🔮',
        title: 'Tarot Reading',
        description: 'Unveil your future through mystical tarot cards',
        longDescription: 'Tarot is an ancient divination tool consisting of 78 cards, each with unique symbolic meanings. Through drawing three cards representing past, present, and future, gain deep insights and guidance for your questions.',
        features: ['Three-card spread', 'Past, present, future', 'Detailed interpretations', 'Personal guidance'],
        example: 'Ask questions like: "What does my financial future hold?" or "How will my love life develop?"',
        backgroundImage: 'https://images.pexels.com/photos/6980530/pexels-photo-6980530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cardImages: [
            'https://images.pexels.com/photos/6980530/pexels-photo-6980530.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/8134848/pexels-photo-8134848.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/8134849/pexels-photo-8134849.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        label: 'Horoscope',
        key: 'horoscope',
        icon: '⭐',
        title: 'Daily Horoscope',
        description: 'Discover your daily fortune based on your zodiac sign',
        longDescription: 'Horoscope divination is based on celestial influences on human personality and destiny. Select your zodiac sign to receive today\'s predictions and advice for love, career, and health.',
        features: ['12 zodiac signs', 'Daily predictions', 'Love, career, health', 'Practical advice'],
        example: 'Choose your sign: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, or Pisces',
        backgroundImage: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cardImages: [
            'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        label: 'Marriage Compatibility',
        key: 'fate',
        icon: '💕',
        title: 'Love Compatibility',
        description: 'Test the romantic compatibility between two people',
        longDescription: 'Love compatibility analysis is a traditional method of assessing romantic potential between two people. By analyzing names, predict the depth of connection and relationship development.',
        features: ['Name compatibility', 'Relationship analysis', 'Love predictions', 'Entertainment value'],
        example: 'Enter two names like "John Smith" and "Jane Doe" to see your compatibility',
        backgroundImage: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cardImages: [
            'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1024994/pexels-photo-1024994.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1024995/pexels-photo-1024995.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        label: 'Birth Chart (Bazi)',
        key: 'birthday',
        icon: '📅',
        title: 'Chinese Astrology',
        description: 'Analyze your destiny through birth date and time',
        longDescription: 'Bazi (Eight Characters) is the core of traditional Chinese astrology. Using your birth year, month, day, and time, calculate the combination of Heavenly Stems and Earthly Branches to analyze five-element attributes.',
        features: ['Birth chart calculation', 'Five elements analysis', 'Fortune prediction', 'Personality insights'],
        example: 'Enter your birth date and time - the system will automatically convert to lunar calendar',
        backgroundImage: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cardImages: [
            'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        label: 'Name Generator',
        key: 'new_name',
        icon: '✨',
        title: 'Chinese Name Creator',
        description: 'Generate auspicious names based on birth chart',
        longDescription: 'Name generation combines traditional Bazi astrology and five-element numerology. Based on your surname, gender, and birth time, generate names that balance the five elements.',
        features: ['Bazi-based naming', 'Five-element balance', 'Auspicious meanings', 'Detailed explanations'],
        example: 'Enter surname "Wang", gender "Male", birth time and additional preferences',
        backgroundImage: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cardImages: [
            'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        label: 'Name Analysis',
        key: 'name',
        icon: '📜',
        title: 'Name Numerology',
        description: 'Analyze the numerology and meaning of your name',
        longDescription: 'Name analysis is based on traditional Chinese five-grid numerology. By analyzing the stroke count and character meanings of your name, calculate the five grids to interpret personality and fortune.',
        features: ['Five-grid numerology', 'Stroke analysis', 'Character interpretation', 'Fortune influence'],
        example: 'Enter your name like "Wang Xiaoming" for complete analysis',
        backgroundImage: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cardImages: [
            'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        label: 'Dream Interpretation',
        key: 'dream',
        icon: '🌙',
        title: 'Dream Analysis',
        description: 'Decode the mysterious messages in your dreams',
        longDescription: 'Dream interpretation is an ancient Chinese system for understanding dream meanings. By analyzing people, scenes, and events in dreams, decode subconscious messages and future omens.',
        features: ['Dream symbolism', 'Subconscious insights', 'Psychological hints', 'Future omens'],
        example: 'Describe your dreams like "flying in the sky" or "swimming in water"',
        backgroundImage: 'https://images.pexels.com/photos/1252814/pexels-photo-1252814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cardImages: [
            'https://images.pexels.com/photos/1252814/pexels-photo-1252814.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1252815/pexels-photo-1252815.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        label: 'I Ching Divination',
        key: 'plum_flower',
        icon: '🌸',
        title: 'Plum Blossom Oracle',
        description: 'Use I Ching hexagrams to predict changes',
        longDescription: 'Plum Blossom divination is a method based on I Ching principles. Using random numbers to generate hexagrams, analyze hexagram changes to predict development trends and fortune.',
        features: ['I Ching hexagrams', 'Number-based divination', 'Hexagram analysis', 'Trend prediction'],
        example: 'Randomly enter two numbers between 0-1000, like "123" and "456"',
        backgroundImage: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cardImages: [
            'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        label: 'Flower Oracle',
        key: 'flower_oracle',
        icon: '🌸',
        title: 'Flower Oracle Reading',
        description: 'Receive guidance from the language of flowers',
        longDescription: 'Flower Oracle is a gentle divination method that uses the symbolic meanings of flowers to provide insight and inspiration. By drawing a flower, you receive a message that reflects your current situation or question.',
        features: ['Symbolic flower meanings', 'Gentle and positive guidance', 'Beautiful visual experience'],
        example: 'Ask: "What flower energy is guiding me today?" or "What message do the flowers have for my love life?"',
        backgroundImage: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        cardImages: [
            'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/36753/flower-purple-lical-blosso.jpg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/36754/flower-purple-lical-blosso.jpg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
];

export const ABOUT = `# About Fortune Telling & Terminology

## Name Analysis (Five-Grid Numerology)

Name Five-Grid is a numerological system based on names, used to analyze and infer an individual's personality traits, potential, fortune, etc. It believes that each Chinese character has specific sounds, meanings, and shapes. By comprehensively analyzing the five-element attributes, sound numbers, and meanings of each character in a name, it aims to reveal a person's destiny and character.

## Plum Blossom Divination (I Ching Oracle)

Plum Blossom Divination, also known as Meihua Yi Shu, is an ancient Chinese method of divination used to predict future situations or gain insight into matters. It is based on the principles and symbolic system of the I Ching, combined with mathematical calculations, symbolic meanings, and intuitive perception.

## Dream Interpretation

Dream interpretation is an ancient Chinese method of understanding dreams, traditionally attributed to the Duke of Zhou (Ji Dan), a famous statesman of the Western Zhou Dynasty. According to legend, the Duke of Zhou had the ability to interpret dreams, understanding the various symbols and images people saw in their sleep and providing corresponding explanations and guidance.

## Tarot Cards

Tarot cards are a tool of divination originating from Europe, often used for predicting the future, exploring the inner self, and providing guidance. It consists of a deck of 78 cards, each with a specific pattern and symbolic meaning.

## Bazi (Eight Characters of Birth)

Bazi calculation is a traditional Chinese numerology method, also known as Eight-Character numerology or Bazi fortune-telling. It is based on the lunar birth date and time, using eight characters to reveal information about an individual's destiny, personality traits, and fortune.
`;

export default {}