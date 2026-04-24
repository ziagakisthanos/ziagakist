export const SECTIONS = {
    Cube009: {
        id: 'hero',
        preview: 'About Me',
        label: 'WELCOME',
        title: 'Hi, I\'m Thanos.',
        outterTitle: 'Ziagakis Athanasios',
        body: 'Full-stack developer & creative technologist. I build things that live at the intersection of code and design.',
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
        label: 'CONTACT',
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
        id: 'projects',
        preview: 'Projects',
        label: 'PROJECTS',
        title: "GraphQl-Dev",
        body: "interesting.",
        links: [
        { label: 'GraphQL',    href: 'https://graphql-dev.vercel.app' },
        ],
        camera: { 
                offset: { x: 2, y: 0.2, z: 1 },
                lookAtOffset: { x: 0, y: 0.6 , z: 0} 
                }
    },
    
    Cube023: {
        id: '023',
        label: 'label',
        title: "023",
        camera: { 
                offset: { x: -0.4, y: 0.3, z: 2.5 },
                lookAtOffset: { x: 0, y: 0.6 , z: 0} 
                }
    },

    Cube027: {
        id: '027',
        label: 'label',
        title: "027",
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
