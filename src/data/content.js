export const SECTIONS = {
    Cube009: {
        id: 'hero',
        label: 'WELCOME',
        tittle: 'Hi, I\'m Thanos.',
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
        label: 'SKILLS',
        title: 'My Toolkit',
        skills: [
        { category: 'Frontend',  items: ['JavaScript', 'TypeScript', 'React', 'Three.js'] },
        { category: 'Backend',   items: ['Node.js', 'Java', 'Spring Boot', 'Python'] },
        { category: 'Database',  items: ['PostgreSQL', 'MongoDB', 'Redis'] },
        { category: 'Tools',     items: ['Git', 'Docker', 'AWS', 'Figma'] },
        ],
        camera: { 
                offset: { x: 0.6, y: 0.2, z: 2 },
                lookAtOffset: { x: 0, y: 0.5 , z: 0} 
                }
    },

    Cube037: {
        id: 'contact',
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
        camera: { 
                offset: { x: -1.4, y: 0.2, z: 1.4 },
                lookAtOffset: { x: 0, y: 0.4 , z: 0} 
                }
    },
}

export const DECOR_NODES = ['Cube076', 'Cube115_1']
