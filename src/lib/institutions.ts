export type InstitutionCategory = 'university' | 'scholarship' | 'job' | 'internship' | 'competition' | 'personal_intro';

export interface Institution {
  id: string;
  name: string;
  category: InstitutionCategory;
  country: string;
  url: string;
  tags: string[];
  description: string;
}

export const INSTITUTIONS: Institution[] = [
  // === Universities ===
  // North America
  { id: 'mit', name: 'Massachusetts Institute of Technology', category: 'university', country: 'USA', url: 'https://www.mit.edu', tags: ['STEM', 'research', 'engineering'], description: 'Leading institute for technology, science, and engineering.' },
  { id: 'harvard', name: 'Harvard University', category: 'university', country: 'USA', url: 'https://www.harvard.edu', tags: ['ivy', 'research', 'liberal-arts'], description: 'Oldest US university, known for law, business, and liberal arts.' },
  { id: 'stanford', name: 'Stanford University', category: 'university', country: 'USA', url: 'https://www.stanford.edu', tags: ['STEM', 'research', 'entrepreneurship'], description: 'Silicon Valley hub for CS, engineering, and business.' },
  { id: 'yale', name: 'Yale University', category: 'university', country: 'USA', url: 'https://www.yale.edu', tags: ['ivy', 'liberal-arts', 'research'], description: 'Ivy league known for humanities, law, and drama.' },
  { id: 'princeton', name: 'Princeton University', category: 'university', country: 'USA', url: 'https://www.princeton.edu', tags: ['ivy', 'research', 'liberal-arts'], description: 'Ivy league strong in public policy and pure sciences.' },
  { id: 'columbia', name: 'Columbia University', category: 'university', country: 'USA', url: 'https://www.columbia.edu', tags: ['ivy', 'research', 'urban'], description: 'Ivy league in NYC, known for journalism and international affairs.' },
  { id: 'upenn', name: 'University of Pennsylvania', category: 'university', country: 'USA', url: 'https://www.upenn.edu', tags: ['ivy', 'business', 'research'], description: 'Ivy league home of Wharton School of Business.' },
  { id: 'caltech', name: 'California Institute of Technology', category: 'university', country: 'USA', url: 'https://www.caltech.edu', tags: ['STEM', 'research', 'science'], description: 'Premier science and engineering research institute.' },
  { id: 'berkeley', name: 'UC Berkeley', category: 'university', country: 'USA', url: 'https://www.berkeley.edu', tags: ['STEM', 'research', 'public'], description: 'Top public research university.' },
  { id: 'ucla', name: 'University of California, Los Angeles', category: 'university', country: 'USA', url: 'https://www.ucla.edu', tags: ['STEM', 'arts', 'public'], description: 'Public university strong in film, STEM, and arts.' },
  { id: 'umich', name: 'University of Michigan', category: 'university', country: 'USA', url: 'https://www.umich.edu', tags: ['STEM', 'research', 'public'], description: 'Top public university for engineering and business.' },
  { id: 'uchicago', name: 'University of Chicago', category: 'university', country: 'USA', url: 'https://www.uchicago.edu', tags: ['research', 'economics', 'liberal-arts'], description: 'Known for economics, social sciences, and rigorous academics.' },
  { id: 'cornell', name: 'Cornell University', category: 'university', country: 'USA', url: 'https://www.cornell.edu', tags: ['ivy', 'STEM', 'agriculture'], description: 'Ivy league with strong engineering and agriculture programs.' },
  { id: 'duke', name: 'Duke University', category: 'university', country: 'USA', url: 'https://duke.edu', tags: ['research', 'medicine', 'business'], description: 'Private research university in North Carolina.' },
  { id: 'northwestern', name: 'Northwestern University', category: 'university', country: 'USA', url: 'https://www.northwestern.edu', tags: ['research', 'journalism', 'business'], description: 'Known for Medill journalism and Kellogg business.' },
  { id: 'toronto', name: 'University of Toronto', category: 'university', country: 'Canada', url: 'https://www.utoronto.ca', tags: ['STEM', 'research', 'public'], description: "Canada's top research university." },
  { id: 'mcgill', name: 'McGill University', category: 'university', country: 'Canada', url: 'https://www.mcgill.ca', tags: ['research', 'medicine', 'public'], description: 'Leading Canadian university in Montreal.' },
  { id: 'ubc', name: 'University of British Columbia', category: 'university', country: 'Canada', url: 'https://www.ubc.ca', tags: ['STEM', 'research', 'public'], description: 'Top Canadian research university in Vancouver.' },

  // Europe
  { id: 'oxford', name: 'University of Oxford', category: 'university', country: 'UK', url: 'https://www.ox.ac.uk', tags: ['research', 'liberal-arts', 'prestige'], description: 'Oldest English-speaking university.' },
  { id: 'cambridge', name: 'University of Cambridge', category: 'university', country: 'UK', url: 'https://www.cam.ac.uk', tags: ['STEM', 'research', 'prestige'], description: 'Historic university known for sciences and mathematics.' },
  { id: 'imperial', name: 'Imperial College London', category: 'university', country: 'UK', url: 'https://www.imperial.ac.uk', tags: ['STEM', 'research', 'engineering'], description: 'Specialized in science, engineering, and medicine.' },
  { id: 'ucl', name: 'University College London', category: 'university', country: 'UK', url: 'https://www.ucl.ac.uk', tags: ['research', 'public', 'diverse'], description: 'Leading multidisciplinary research university in London.' },
  { id: 'edinburgh', name: 'University of Edinburgh', category: 'university', country: 'UK', url: 'https://www.ed.ac.uk', tags: ['research', 'AI', 'public'], description: 'Scottish university strong in AI and informatics.' },
  { id: 'eth', name: 'ETH Zurich', category: 'university', country: 'Switzerland', url: 'https://ethz.ch', tags: ['STEM', 'engineering', 'research'], description: 'Top continental European STEM university.' },
  { id: 'epfl', name: 'EPFL', category: 'university', country: 'Switzerland', url: 'https://www.epfl.ch', tags: ['STEM', 'engineering', 'research'], description: 'Swiss institute of technology in Lausanne.' },
  { id: 'sorbonne', name: 'Sorbonne University', category: 'university', country: 'France', url: 'https://www.sorbonne-universite.fr', tags: ['research', 'science', 'humanities'], description: 'Parisian university for science, medicine, and humanities.' },
  { id: 'polytechnique', name: 'École Polytechnique', category: 'university', country: 'France', url: 'https://www.polytechnique.edu', tags: ['STEM', 'engineering', 'prestige'], description: "France's top engineering school." },
  { id: 'tum', name: 'Technical University of Munich', category: 'university', country: 'Germany', url: 'https://www.tum.de', tags: ['STEM', 'engineering', 'research'], description: 'Germany\'s leading technical university.' },
  { id: 'lmu', name: 'Ludwig Maximilian University of Munich', category: 'university', country: 'Germany', url: 'https://www.lmu.de', tags: ['research', 'liberal-arts', 'public'], description: 'One of Germany\'s largest research universities.' },
  { id: 'heidelberg', name: 'Heidelberg University', category: 'university', country: 'Germany', url: 'https://www.uni-heidelberg.de', tags: ['research', 'medicine', 'prestige'], description: 'Germany\'s oldest university.' },
  { id: 'tudelft', name: 'Delft University of Technology', category: 'university', country: 'Netherlands', url: 'https://www.tudelft.nl', tags: ['STEM', 'engineering', 'research'], description: 'Top Dutch engineering university.' },
  { id: 'amsterdam', name: 'University of Amsterdam', category: 'university', country: 'Netherlands', url: 'https://www.uva.nl', tags: ['research', 'public', 'diverse'], description: 'Leading Dutch research university.' },
  { id: 'kth', name: 'KTH Royal Institute of Technology', category: 'university', country: 'Sweden', url: 'https://www.kth.se', tags: ['STEM', 'engineering', 'research'], description: 'Sweden\'s top technical university.' },
  { id: 'karolinska', name: 'Karolinska Institute', category: 'university', country: 'Sweden', url: 'https://ki.se', tags: ['medicine', 'research', 'prestige'], description: 'World-leading medical university.' },
  { id: 'trinity', name: 'Trinity College Dublin', category: 'university', country: 'Ireland', url: 'https://www.tcd.ie', tags: ['research', 'liberal-arts', 'prestige'], description: 'Ireland\'s premier university.' },
  { id: 'bsl', name: 'Bocconi University', category: 'university', country: 'Italy', url: 'https://www.unibocconi.eu', tags: ['business', 'economics', 'research'], description: 'Europe\'s leading business and economics university.' },
  { id: 'polimi', name: 'Politecnico di Milano', category: 'university', country: 'Italy', url: 'https://www.polimi.it', tags: ['STEM', 'engineering', 'design'], description: 'Italy\'s top engineering and design school.' },

  // Asia & Middle East
  { id: 'nus', name: 'National University of Singapore', category: 'university', country: 'Singapore', url: 'https://www.nus.edu.sg', tags: ['STEM', 'research', 'prestige'], description: 'Asia\'s top-ranked university.' },
  { id: 'ntu', name: 'Nanyang Technological University', category: 'university', country: 'Singapore', url: 'https://www.ntu.edu.sg', tags: ['STEM', 'engineering', 'research'], description: 'Leading Singaporean technical university.' },
  { id: 'tsinghua', name: 'Tsinghua University', category: 'university', country: 'China', url: 'https://www.tsinghua.edu.cn', tags: ['STEM', 'engineering', 'prestige'], description: 'China\'s top engineering and science university.' },
  { id: 'pku', name: 'Peking University', category: 'university', country: 'China', url: 'https://www.pku.edu.cn', tags: ['research', 'liberal-arts', 'prestige'], description: 'China\'s leading comprehensive university.' },
  { id: 'todai', name: 'University of Tokyo', category: 'university', country: 'Japan', url: 'https://www.u-tokyo.ac.jp', tags: ['STEM', 'research', 'prestige'], description: 'Japan\'s most prestigious university.' },
  { id: 'kyoto-u', name: 'Kyoto University', category: 'university', country: 'Japan', url: 'https://www.kyoto-u.ac.jp', tags: ['STEM', 'research', 'prestige'], description: 'Japan\'s second-oldest research university.' },
  { id: 'kaist', name: 'KAIST', category: 'university', country: 'South Korea', url: 'https://www.kaist.ac.kr', tags: ['STEM', 'engineering', 'research'], description: 'South Korea\'s top science and technology institute.' },
  { id: 'seoul', name: 'Seoul National University', category: 'university', country: 'South Korea', url: 'https://www.snu.ac.kr', tags: ['research', 'prestige', 'public'], description: 'South Korea\'s leading comprehensive university.' },
  { id: 'iitb', name: 'IIT Bombay', category: 'university', country: 'India', url: 'https://www.iitb.ac.in', tags: ['STEM', 'engineering', 'prestige'], description: 'India\'s premier engineering institute.' },
  { id: 'iitd', name: 'IIT Delhi', category: 'university', country: 'India', url: 'https://www.iitd.ac.in', tags: ['STEM', 'engineering', 'prestige'], description: 'Leading Indian engineering institute.' },
  { id: 'kaust', name: 'King Abdullah University of Science and Technology', category: 'university', country: 'Saudi Arabia', url: 'https://www.kaust.edu.sa', tags: ['STEM', 'research', 'graduate'], description: 'Graduate-level research university on the Red Sea.' },
  { id: 'nua', name: 'New York University Abu Dhabi', category: 'university', country: 'UAE', url: 'https://nyuad.nyu.edu', tags: ['liberal-arts', 'research', 'diverse'], description: 'NYU\'s Middle Eastern campus.' },
  { id: 'hbku', name: 'Hamad Bin Khalifa University', category: 'university', country: 'Qatar', url: 'https://www.hbku.edu.qa', tags: ['STEM', 'research', 'graduate'], description: 'Qatar\'s graduate research university.' },

  // Africa
  { id: 'uct', name: 'University of Cape Town', category: 'university', country: 'South Africa', url: 'https://www.uct.ac.za', tags: ['research', 'public', 'prestige'], description: 'Africa\'s top-ranked university.' },
  { id: 'wits', name: 'University of the Witwatersrand', category: 'university', country: 'South Africa', url: 'https://www.wits.ac.za', tags: ['research', 'public', 'medicine'], description: 'Leading South African research university.' },
  { id: 'aau', name: 'Addis Ababa University', category: 'university', country: 'Ethiopia', url: 'https://www.aau.edu.et', tags: ['research', 'public', 'comprehensive'], description: 'Ethiopia\'s largest and oldest university.' },
  { id: 'cairo-u', name: 'Cairo University', category: 'university', country: 'Egypt', url: 'https://cu.edu.eg', tags: ['research', 'public', 'comprehensive'], description: 'Egypt\'s premier public university.' },
  { id: 'aast', name: 'Arab Academy for Science and Technology', category: 'university', country: 'Egypt', url: 'https://www.aast.edu', tags: ['STEM', 'engineering', 'maritime'], description: 'Regional engineering and technology academy.' },
  { id: 'unilag', name: 'University of Lagos', category: 'university', country: 'Nigeria', url: 'https://unilag.edu.ng', tags: ['research', 'public', 'comprehensive'], description: 'One of Nigeria\'s top universities.' },

  // Australia & Oceania
  { id: 'melbourne', name: 'University of Melbourne', category: 'university', country: 'Australia', url: 'https://www.unimelb.edu.au', tags: ['research', 'public', 'prestige'], description: 'Australia\'s top-ranked university.' },
  { id: 'anu', name: 'Australian National University', category: 'university', country: 'Australia', url: 'https://www.anu.edu.au', tags: ['research', 'public', 'prestige'], description: 'Australia\'s national research university.' },
  { id: 'sydney', name: 'University of Sydney', category: 'university', country: 'Australia', url: 'https://www.sydney.edu.au', tags: ['research', 'public', 'medicine'], description: 'Australia\'s oldest university.' },
  { id: 'unsw', name: 'UNSW Sydney', category: 'university', country: 'Australia', url: 'https://www.unsw.edu.au', tags: ['STEM', 'engineering', 'research'], description: 'Leading Australian engineering university.' },
  { id: 'auckland', name: 'University of Auckland', category: 'university', country: 'New Zealand', url: 'https://www.auckland.ac.nz', tags: ['research', 'public', 'prestige'], description: 'New Zealand\'s top university.' },

  // Latin America
  { id: 'unam', name: 'Universidad Nacional Autónoma de México', category: 'university', country: 'Mexico', url: 'https://www.unam.mx', tags: ['research', 'public', 'prestige'], description: 'Mexico\'s largest and most prestigious university.' },
  { id: 'usp', name: 'University of São Paulo', category: 'university', country: 'Brazil', url: 'https://www5.usp.br', tags: ['research', 'public', 'prestige'], description: 'Latin America\'s top research university.' },
  { id: 'puc', name: 'Pontifical Catholic University of Chile', category: 'university', country: 'Chile', url: 'https://www.uc.cl', tags: ['research', 'private', 'prestige'], description: 'Chile\'s top private university.' },

  // === Scholarships ===
  { id: 'rhodes', name: 'Rhodes Scholarship', category: 'scholarship', country: 'UK', url: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/', tags: ['fully-funded', 'Oxford', 'leadership'], description: 'Full funding for graduate study at Oxford.' },
  { id: 'gates', name: 'Gates Cambridge Scholarship', category: 'scholarship', country: 'UK', url: 'https://www.gatescambridge.org', tags: ['fully-funded', 'Cambridge', 'leadership'], description: 'Full funding for graduate study at Cambridge.' },
  { id: 'fulbright', name: 'Fulbright Program', category: 'scholarship', country: 'USA', url: 'https://fulbrightprogram.org', tags: ['international', 'exchange', 'research'], description: 'International educational exchange program.' },
  { id: 'chevening', name: 'Chevening Scholarship', category: 'scholarship', country: 'UK', url: 'https://www.chevening.org', tags: ['fully-funded', 'UK', 'leadership'], description: 'UK government scholarship for international leaders.' },
  { id: 'commonwealth', name: 'Commonwealth Scholarships', category: 'scholarship', country: 'UK', url: 'https://cscuk.fcdo.gov.uk/scholarships/', tags: ['fully-funded', 'Commonwealth', 'development'], description: 'Funding for students from Commonwealth countries.' },
  { id: 'daad', name: 'DAAD Scholarship', category: 'scholarship', country: 'Germany', url: 'https://www.daad.de/en/', tags: ['fully-funded', 'Germany', 'research'], description: 'German academic exchange service scholarships.' },
  { id: 'erasmus', name: 'Erasmus Mundus', category: 'scholarship', country: 'EU', url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus_en', tags: ['fully-funded', 'EU', 'joint-degree'], description: 'EU-funded joint master\'s degree programs.' },
  { id: 'clf', name: 'Clarendon Scholarship', category: 'scholarship', country: 'UK', url: 'https://www.clarendon.ox.ac.uk', tags: ['fully-funded', 'Oxford', 'academic'], description: 'Full funding for graduate study at Oxford.' },
  { id: 'knight-hennessy', name: 'Knight-Hennessy Scholars', category: 'scholarship', country: 'USA', url: 'https://knight-hennessy.stanford.edu', tags: ['fully-funded', 'Stanford', 'leadership'], description: 'Full funding for graduate study at Stanford.' },
  { id: 'schwarzman', name: 'Schwarzman Scholars', category: 'scholarship', country: 'China', url: 'https://www.schwarzmanscholars.org', tags: ['fully-funded', 'China', 'leadership'], description: 'One-year master\'s at Tsinghua University.' },
  { id: 'yenching', name: 'Yenching Academy Scholarship', category: 'scholarship', country: 'China', url: 'https://yenchingacademy.pku.edu.cn', tags: ['fully-funded', 'China', 'interdisciplinary'], description: 'Master\'s program at Peking University.' },
  { id: 'orange', name: 'Orange Knowledge Programme', category: 'scholarship', country: 'Netherlands', url: 'https://www.nuffic.nl/en/subjects/orange-knowledge-programme/', tags: ['fully-funded', 'Netherlands', 'capacity-building'], description: 'Dutch scholarship for professionals from partner countries.' },
  { id: 'holland', name: 'Holland Scholarship', category: 'scholarship', country: 'Netherlands', url: 'https://www.studyinnl.org/finance/scholarships/holland-scholarship', tags: ['partial', 'Netherlands', 'bachelor-master'], description: 'Financial aid for international students in the Netherlands.' },
  { id: 'aus', name: 'Australia Awards Scholarship', category: 'scholarship', country: 'Australia', url: 'https://www.australiaawards.gov.au', tags: ['fully-funded', 'Australia', 'development'], description: 'Australian government scholarship for developing countries.' },
  { id: 'japan-mext', name: 'MEXT Scholarship', category: 'scholarship', country: 'Japan', url: 'https://www.studyinjapan.go.jp/en/scholarship/', tags: ['fully-funded', 'Japan', 'research'], description: 'Japanese government scholarship for international students.' },
  { id: 'kgs', name: 'Kuwait Government Scholarship', category: 'scholarship', country: 'Kuwait', url: 'https://www.mohe.edu.kw', tags: ['fully-funded', 'Kuwait', 'international'], description: 'Kuwaiti government scholarships for study abroad.' },
  { id: 'qu-scholarship', name: 'Qatar University Scholarship', category: 'scholarship', country: 'Qatar', url: 'https://www.qu.edu.qa/admissions/scholarship', tags: ['fully-funded', 'Qatar', 'academic'], description: 'Scholarships for outstanding students at Qatar University.' },
  { id: 'eduqatar', name: 'Education Above All', category: 'scholarship', country: 'Qatar', url: 'https://educationaboveall.org', tags: ['fully-funded', 'Qatar', 'development'], description: 'Qatar Foundation initiative for education access.' },
  { id: 'mandela', name: 'Mandela Rhodes Scholarship', category: 'scholarship', country: 'South Africa', url: 'https://www.mandelarhodes.org', tags: ['fully-funded', 'South-Africa', 'leadership'], description: 'Leadership development program for African scholars.' },
  { id: 'mastercard-foundation', name: 'Mastercard Foundation Scholars Program', category: 'scholarship', country: 'International', url: 'https://mastercardfdn.org/all-africa/mastercard-foundation-scholars-program/', tags: ['fully-funded', 'Africa', 'leadership'], description: 'Scholarships for young African leaders.' },
  { id: 'aad', name: 'African Academy of Sciences', category: 'scholarship', country: 'Kenya', url: 'https://aasciences.africa', tags: ['research', 'Africa', 'STEM'], description: 'Research funding for African scientists.' },

  // === Jobs (Companies) ===
  // Big Tech
  { id: 'google', name: 'Google', category: 'job', country: 'USA', url: 'https://www.google.com/about/careers/applications/', tags: ['tech', 'engineering', 'product'], description: 'Search, cloud, AI, and advertising giant.' },
  { id: 'microsoft', name: 'Microsoft', category: 'job', country: 'USA', url: 'https://careers.microsoft.com', tags: ['tech', 'software', 'cloud'], description: 'Software, cloud (Azure), and enterprise technology.' },
  { id: 'amazon', name: 'Amazon', category: 'job', country: 'USA', url: 'https://www.amazon.jobs', tags: ['tech', 'logistics', 'cloud'], description: 'E-commerce, AWS, and cloud infrastructure.' },
  { id: 'apple', name: 'Apple', category: 'job', country: 'USA', url: 'https://www.apple.com/careers', tags: ['tech', 'hardware', 'design'], description: 'Consumer electronics, software, and services.' },
  { id: 'meta', name: 'Meta', category: 'job', country: 'USA', url: 'https://www.metacareers.com', tags: ['tech', 'social', 'VR'], description: 'Facebook, Instagram, WhatsApp, and Reality Labs.' },
  { id: 'netflix', name: 'Netflix', category: 'job', country: 'USA', url: 'https://jobs.netflix.com', tags: ['tech', 'streaming', 'entertainment'], description: 'Streaming entertainment and content production.' },
  { id: 'tesla', name: 'Tesla', category: 'job', country: 'USA', url: 'https://www.tesla.com/careers', tags: ['automotive', 'energy', 'engineering'], description: 'Electric vehicles and clean energy solutions.' },
  { id: 'nvidia', name: 'NVIDIA', category: 'job', country: 'USA', url: 'https://www.nvidia.com/en-us/about-nvidia/careers/', tags: ['tech', 'AI', 'hardware'], description: 'GPU and AI computing leader.' },
  { id: 'openai', name: 'OpenAI', category: 'job', country: 'USA', url: 'https://openai.com/careers', tags: ['AI', 'research', 'tech'], description: 'AI research and deployment lab.' },
  { id: 'anthropic', name: 'Anthropic', category: 'job', country: 'USA', url: 'https://www.anthropic.com/careers', tags: ['AI', 'research', 'safety'], description: 'AI safety research company.' },

  // Consulting & Finance
  { id: 'mckinsey', name: 'McKinsey & Company', category: 'job', country: 'Global', url: 'https://www.mckinsey.com/careers', tags: ['consulting', 'strategy', 'business'], description: 'Global management consulting firm.' },
  { id: 'bcg', name: 'Boston Consulting Group', category: 'job', country: 'Global', url: 'https://www.bcg.com/careers', tags: ['consulting', 'strategy', 'business'], description: 'Top-tier strategy consulting.' },
  { id: 'bain', name: 'Bain & Company', category: 'job', country: 'Global', url: 'https://www.bain.com/careers', tags: ['consulting', 'strategy', 'business'], description: 'Management consulting and private equity advisory.' },
  { id: 'deloitte', name: 'Deloitte', category: 'job', country: 'Global', url: 'https://careers.deloitte.com', tags: ['consulting', 'audit', 'finance'], description: 'Big Four accounting and consulting.' },
  { id: 'pwc', name: 'PwC', category: 'job', country: 'Global', url: 'https://www.pwc.com/us/en/careers.html', tags: ['consulting', 'audit', 'finance'], description: 'Big Four professional services.' },
  { id: 'ey', name: 'EY (Ernst & Young)', category: 'job', country: 'Global', url: 'https://careers.ey.com', tags: ['consulting', 'audit', 'finance'], description: 'Big Four assurance and advisory.' },
  { id: 'kpmg', name: 'KPMG', category: 'job', country: 'Global', url: 'https://careers.kpmg.com', tags: ['consulting', 'audit', 'finance'], description: 'Big Four tax and advisory.' },
  { id: 'goldman', name: 'Goldman Sachs', category: 'job', country: 'USA', url: 'https://www.goldmansachs.com/careers', tags: ['finance', 'banking', 'investment'], description: 'Global investment banking and securities.' },
  { id: 'jpmorgan', name: 'JPMorgan Chase', category: 'job', country: 'USA', url: 'https://careers.jpmorgan.com', tags: ['finance', 'banking', 'investment'], description: 'Largest US bank by assets.' },
  { id: 'morganstanley', name: 'Morgan Stanley', category: 'job', country: 'USA', url: 'https://www.morganstanley.com/careers', tags: ['finance', 'banking', 'investment'], description: 'Global financial services and wealth management.' },
  { id: 'blackstone', name: 'Blackstone', category: 'job', country: 'USA', url: 'https://www.blackstone.com/careers', tags: ['finance', 'private-equity', 'investment'], description: 'World\'s largest alternative asset manager.' },

  // Other major employers
  { id: 'boeing', name: 'Boeing', category: 'job', country: 'USA', url: 'https://www.boeing.com/careers', tags: ['aerospace', 'engineering', 'defense'], description: 'Aerospace and defense manufacturer.' },
  { id: 'spacex', name: 'SpaceX', category: 'job', country: 'USA', url: 'https://www.spacex.com/careers', tags: ['aerospace', 'space', 'engineering'], description: 'Space exploration and rocket technology.' },
  { id: 'ibm', name: 'IBM', category: 'job', country: 'USA', url: 'https://www.ibm.com/careers', tags: ['tech', 'enterprise', 'AI'], description: 'Enterprise technology and hybrid cloud.' },
  { id: 'oracle', name: 'Oracle', category: 'job', country: 'USA', url: 'https://www.oracle.com/careers', tags: ['tech', 'database', 'cloud'], description: 'Database and enterprise cloud software.' },
  { id: 'salesforce', name: 'Salesforce', category: 'job', country: 'USA', url: 'https://www.salesforce.com/company/careers/', tags: ['tech', 'CRM', 'cloud'], description: 'Customer relationship management platform.' },
  { id: 'adobe', name: 'Adobe', category: 'job', country: 'USA', url: 'https://www.adobe.com/careers.html', tags: ['tech', 'software', 'design'], description: 'Creative and digital marketing software.' },
  { id: 'accenture', name: 'Accenture', category: 'job', country: 'Global', url: 'https://www.accenture.com/us-en/careers', tags: ['consulting', 'tech', 'business'], description: 'Global professional services and consulting.' },
  { id: 'un', name: 'United Nations', category: 'job', country: 'International', url: 'https://careers.un.org', tags: ['international', 'policy', 'humanitarian'], description: 'International organization for peace and development.' },
  { id: 'who', name: 'World Health Organization', category: 'job', country: 'International', url: 'https://www.who.int/careers', tags: ['health', 'international', 'policy'], description: 'Global public health authority.' },
  { id: 'worldbank', name: 'World Bank', category: 'job', country: 'International', url: 'https://www.worldbank.org/en/about/careers', tags: ['finance', 'development', 'international'], description: 'International development finance institution.' },

  // Regional / MEA employers
  { id: 'aramco', name: 'Saudi Aramco', category: 'job', country: 'Saudi Arabia', url: 'https://www.aramco.com/en/careers', tags: ['energy', 'oil', 'engineering'], description: 'World\'s largest oil producer.' },
  { id: 'qatarenergy', name: 'QatarEnergy', category: 'job', country: 'Qatar', url: 'https://www.qatarenergy.com.qa/en/Pages/Careers.aspx', tags: ['energy', 'oil', 'gas'], description: 'Qatar\'s national energy company.' },
  { id: 'emaar', name: 'Emaar Properties', category: 'job', country: 'UAE', url: 'https://www.emaar.com/careers', tags: ['real-estate', 'construction', 'business'], description: 'Dubai-based real estate developer.' },
  { id: 'stc', name: 'STC (Saudi Telecom)', category: 'job', country: 'Saudi Arabia', url: 'https://www.stc.com.sa/careers', tags: ['telecom', 'tech', 'digital'], description: 'Leading Middle East telecom and digital services.' },
  { id: 'noon', name: 'Noon', category: 'job', country: 'UAE', url: 'https://careers.noon.com', tags: ['tech', 'e-commerce', 'digital'], description: 'Regional e-commerce marketplace.' },
  { id: 'careem', name: 'Careem', category: 'job', country: 'UAE', url: 'https://careers.careem.com', tags: ['tech', 'ride-hailing', 'delivery'], description: 'Super-app for the Middle East region.' },

  // === Internships ===
  { id: 'google-intern', name: 'Google STEP Internship', category: 'internship', country: 'USA', url: 'https://www.google.com/about/careers/applications/jobs/results/?degree=BACHELORS', tags: ['tech', 'engineering', 'student'], description: 'Software engineering internship for undergrads.' },
  { id: 'ms-intern', name: 'Microsoft Explore Internship', category: 'internship', country: 'USA', url: 'https://careers.microsoft.com/students', tags: ['tech', 'software', 'student'], description: 'Internship program for university students.' },
  { id: 'meta-intern', name: 'Meta University Internship', category: 'internship', country: 'USA', url: 'https://www.metacareers.com/university', tags: ['tech', 'engineering', 'student'], description: 'Engineering internship for students.' },
  { id: 'amazon-intern', name: 'Amazon SDE Internship', category: 'internship', country: 'USA', url: 'https://www.amazon.jobs/en/teams/university-recruiting', tags: ['tech', 'software', 'student'], description: 'Software development engineering internships.' },
  { id: 'apple-intern', name: 'Apple Internship Program', category: 'internship', country: 'USA', url: 'https://www.apple.com/careers/us/students.html', tags: ['tech', 'hardware', 'student'], description: 'Internships across Apple teams.' },
  { id: 'nvidia-intern', name: 'NVIDIA Internship', category: 'internship', country: 'USA', url: 'https://www.nvidia.com/en-us/about-nvidia/careers/university-recruiting/', tags: ['tech', 'AI', 'student'], description: 'Internships in AI and GPU computing.' },
  { id: 'goldman-intern', name: 'Goldman Sachs Summer Analyst', category: 'internship', country: 'Global', url: 'https://www.goldmansachs.com/careers/students/programs.html', tags: ['finance', 'banking', 'student'], description: 'Summer analyst internship program.' },
  { id: 'jpmorgan-intern', name: 'JPMorgan Summer Analyst', category: 'internship', country: 'Global', url: 'https://careers.jpmorgan.com/students', tags: ['finance', 'banking', 'student'], description: 'Investment banking summer internships.' },
  { id: 'mckinsey-intern', name: 'McKinsey Summer Intern', category: 'internship', country: 'Global', url: 'https://www.mckinsey.com/careers/students', tags: ['consulting', 'strategy', 'student'], description: 'Summer associate program for MBA students.' },
  { id: 'bcg-intern', name: 'BCG Summer Internship', category: 'internship', country: 'Global', url: 'https://www.bcg.com/careers/students', tags: ['consulting', 'strategy', 'student'], description: 'Internship for undergrad and MBA students.' },
  { id: 'un-intern', name: 'UN Internship Programme', category: 'internship', country: 'International', url: 'https://careers.un.org/lbw/home.aspx?viewtype=IP', tags: ['international', 'policy', 'student'], description: 'Internships at UN offices worldwide.' },
  { id: 'who-intern', name: 'WHO Internship', category: 'internship', country: 'International', url: 'https://www.who.int/careers/internship', tags: ['health', 'international', 'student'], description: 'Global health internship program.' },
  { id: 'warby-intern', name: 'NASA Internship', category: 'internship', country: 'USA', url: 'https://intern.nasa.gov', tags: ['aerospace', 'space', 'STEM'], description: 'Internships at NASA centers.' },
  { id: 'eu-intern', name: 'EU Blue Book Traineeship', category: 'internship', country: 'EU', url: 'https://ec.europa.eu/stages/home_en', tags: ['policy', 'EU', 'student'], description: 'European Commission traineeship program.' },
  { id: 'aramco-intern', name: 'Saudi Aramco Internship', category: 'internship', country: 'Saudi Arabia', url: 'https://www.aramco.com/en/careers/students-and-graduates', tags: ['energy', 'engineering', 'student'], description: 'Internships in energy and engineering.' },

  // === Competitions ===
  { id: 'icpc', name: 'ICPC (International Collegiate Programming Contest)', category: 'competition', country: 'International', url: 'https://icpc.global', tags: ['programming', 'algorithm', 'team'], description: 'Premier competitive programming contest.' },
  { id: 'kaggle', name: 'Kaggle Competitions', category: 'competition', country: 'International', url: 'https://www.kaggle.com/competitions', tags: ['data-science', 'ML', 'AI'], description: 'Machine learning and data science competitions.' },
  { id: 'imo', name: 'International Mathematical Olympiad', category: 'competition', country: 'International', url: 'https://www.imo-official.org', tags: ['mathematics', 'olympiad', 'prestige'], description: 'World championship mathematics competition.' },
  { id: 'ipho', name: 'International Physics Olympiad', category: 'competition', country: 'International', url: 'https://www.ipho.org', tags: ['physics', 'olympiad', 'STEM'], description: 'Annual physics competition for pre-university students.' },
  { id: 'icho', name: 'International Chemistry Olympiad', category: 'competition', country: 'International', url: 'https://www.icho.org', tags: ['chemistry', 'olympiad', 'STEM'], description: 'Annual chemistry competition.' },
  { id: 'ibo', name: 'International Biology Olympiad', category: 'competition', country: 'International', url: 'https://www.ibo-info.org', tags: ['biology', 'olympiad', 'STEM'], description: 'Biology competition for pre-university students.' },
  { id: 'robofest', name: 'RoboFest', category: 'competition', country: 'International', url: 'https://www.robofest.net', tags: ['robotics', 'engineering', 'STEM'], description: 'Autonomous robotics competition.' },
  { id: 'frc', name: 'FIRST Robotics Competition', category: 'competition', country: 'International', url: 'https://www.firstinspires.org/robotics/frc', tags: ['robotics', 'engineering', 'team'], description: 'High school robotics competition.' },
  { id: 'debate-wudc', name: 'World Universities Debating Championship', category: 'competition', country: 'International', url: 'https://wudc.org', tags: ['debate', 'public-speaking', 'prestige'], description: 'World championship for university debating.' },
  { id: 'moot', name: 'Jessup International Moot Court', category: 'competition', country: 'International', url: 'https://www.ilsa.org/jessup', tags: ['law', 'moot-court', 'international'], description: 'World\'s largest moot court competition.' },
  { id: 'hultprize', name: 'Hult Prize', category: 'competition', country: 'International', url: 'https://www.hultprize.org', tags: ['social-entrepreneurship', 'startup', 'business'], description: 'Student social entrepreneurship competition.' },
  { id: 'echallenge', name: 'MIT $100K Entrepreneurship Competition', category: 'competition', country: 'USA', url: 'https://www.mit100k.org', tags: ['entrepreneurship', 'startup', 'business'], description: 'Leading student startup competition.' },
  { id: 'hackathon-mlh', name: 'MLH Hackathons', category: 'competition', country: 'International', url: 'https://mlh.io', tags: ['hackathon', 'coding', 'student'], description: 'Major League Hacking student hackathons.' },
  { id: 'gsf', name: 'Google Science Fair', category: 'competition', country: 'International', url: 'https://edu.google.com/international-science-fair/', tags: ['science', 'research', 'student'], description: 'Global online science competition.' },
  { id: 'breaking', name: 'Breakthrough Junior Challenge', category: 'competition', country: 'International', url: 'https://breakthroughjuniorchallenge.org', tags: ['science', 'video', 'STEM'], description: 'Science explainer video challenge.' },
  { id: 'arc', name: 'ARC Prize', category: 'competition', country: 'International', url: 'https://arcprize.org', tags: ['AI', 'reasoning', 'research'], description: 'AI reasoning benchmark challenge.' },

  // === Personal Intro Resources ===
  { id: 'toastmasters', name: 'Toastmasters International', category: 'personal_intro', country: 'International', url: 'https://www.toastmasters.org', tags: ['public-speaking', 'communication', 'leadership'], description: 'Public speaking and leadership practice.' },
  { id: 'tedx', name: 'TEDx Talks Guide', category: 'personal_intro', country: 'International', url: 'https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide', tags: ['public-speaking', 'storytelling', 'communication'], description: 'How to craft and deliver a compelling talk.' },
  { id: 'linkedin-intro', name: 'LinkedIn About Section Guide', category: 'personal_intro', country: 'International', url: 'https://www.linkedin.com/help/linkedin/answer/55464', tags: ['self-introduction', 'professional', 'networking'], description: 'How to write a strong LinkedIn summary.' },
  { id: 'elevator-pitch', name: 'Elevator Pitch Guide (Harvard)', category: 'personal_intro', country: 'USA', url: 'https://hbr.org/2024/04/how-to-introduce-yourself', tags: ['self-introduction', 'networking', 'professional'], description: 'Harvard Business Review guide to self-introductions.' },
  { id: 'storytelling', name: 'The Moth — Storytelling', category: 'personal_intro', country: 'International', url: 'https://themoth.org/storytelling-tips', tags: ['storytelling', 'communication', 'personal'], description: 'True personal storytelling tips and resources.' },
];

export function searchInstitutions(query: string, category?: InstitutionCategory): Institution[] {
  const q = query.toLowerCase().trim();
  return INSTITUTIONS.filter((inst) => {
    if (category && inst.category !== category) return false;
    if (!q) return true;
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.country.toLowerCase().includes(q) ||
      inst.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function getInstitutionById(id: string): Institution | undefined {
  return INSTITUTIONS.find((i) => i.id === id);
}
