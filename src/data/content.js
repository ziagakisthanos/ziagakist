export const SECTIONS = {
    Cube009: {
        id: 'hero',
        preview: 'About Me',
        label: 'WELCOME',
        title: 'Hi, I\'m Thanos.',
        body: 'Full-stack developer & creative technologist. I build things that live at the intersection of code and design.',
        outterTitle: 'Ziagakis Athanasios',
        roles: ['Full-stack Developer', 'Creative Technologist', ],
        cta: null,
        camera: {
                    offset: { x: 0, y: 1, z: 2.6},
                    lookAtOffset: { x: 0, y: 0.6 } 
                }
    },

    Cube014: {
        id: 'skills',
        preview: 'Skills',
        label: 'SKILLS',
        title: 'My Toolkit',
        skills: [
        { category: 'Backend',   items: ['Node.js', 'Java', 'Spring Boot', 'GoLang'] },
        { category: 'Frontend',  items: ['JavaScript', 'UX', 'Webpack', 'Vue', 'Three.js'] },
        { category: 'Database',  items: ['PostgreSQL', 'MongoDB', 'Redis'] },
        { category: 'Tools',     items: ['Git', 'Docker', 'DevTools', 'Figma'] },
        { category: '...and more',     items: []  },

        ],
        camera: { 
                offset: { x: 0.6, y: 0.2, z: 2 },
                lookAtOffset: { x: 0, y: 0.5 , z: 0} 
                }
    },

    Cube037: {
        id: 'contact',
        preview: 'Contact',
        previewOffset: { x: 0.1 },
        previewFontSize: '300px',

        label: 'CONTACT1',
        title: "Let's Talk",
        body: "Open to freelance, full-time roles, and interesting collaborations.",
        links: [
        { label: 'Email',    href: 'mailto:ziagakisthanos@gmail.com' },
        { label: 'GitHub',   href: 'https://github.com/ziagakisthanos' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/ziagakisthanos' },
        ],
        camera: { 
                offset: { x: 2, y: 0.2, z: 1 },
                lookAtOffset: { x: 0, y: 0.5 , z: 0} 
                }
    },

    Cube018: {
        id: 'contact',
        label: '',
        preview: 'CV',
        previewOffset: { x: 0.1 },
        previewFontSize: '300px',
        title: "Take me with you",
        body: "Get more insights into my work experience.",
        links: [
        { label: 'Download CV (.pdf)', href: '/ziagakisAthanasios.pdf', download: true },
        ],
        camera: { 
                offset: { x: 2, y: 0.2, z: 1 },
                lookAtOffset: { x: 0, y: 0.6 , z: 0} 
                }
    },
    
    Cube023: {
        id: 'projects',
        preview: 'Projects',
        previewFontSize: '320px',
        label: 'PROJECTS',
        carousel: [
            {
                title: "GraphQL-Dev",
                body: "A pure static frontend dashboard for the Zone01 school platform. Visualises your personal learning data fetched live from the platform's GraphQL API.",
                links: [{ label: 'Live Demo', href: 'https://graphql-dev.vercel.app' }],
            },
            {
                title: "Net-Cat",
                body: "A simple TCP-based chat application written in Go, originally known as TCP-Chat.",
                links: [{ label: 'Repository', href: 'https://github.com/ziagakisthanos/net-cat' }],
            },
        ],
        camera: {
                offset: { x: -0.4, y: 0.3, z: 2.5 },
                lookAtOffset: { x: 0, y: 0.6 , z: 0}
                }
    },

    Cube027: {
        id: 'credits',
        preview: 'Credits',


        // previewColor: 'rgba(80, 150, 255, 0.9)',
        label: 'Special Thanks',
        previewFontSize: '280px',
        previewOffset: { x: -0.1, y: -0.1 },
        previewScale:  { x: 1, y: 1 },
        overlayOffset: { x: 0.05, y: -0.06, z: 0 },
        overlayWidth:  1600,
        worldSize: { w: 1, h: 0.85 },
        carousel: [
            {
                title: "Rafael Rodrigues",
                body: "- 3D Model [old-computers]",
                links: [{ label: 'License CC Atribution', href: 'https://creativecommons.org/licenses/by/4.0/' }],
            },
        ],
        
        camera: { 
                offset: { x: -1.4, y: 0.2, z: 1.4 },
                lookAtOffset: { x: 0, y: 0.4 , z: 0} 
                }
    },

    Cube116_1: {
        id: '116',
        // title: "LATE NIGHT WITH THE DEVIL",
        title: 'I am really passionate about what I do.',
        camera: { 
                offset: { x: -1.4, y: 0.2, z: 1.4 },
                lookAtOffset: { x: 0, y: 0.4 , z: 0} 
                }
    },
}

export const DECOR_NODES = ['Cube076', 'Cube115_1']
