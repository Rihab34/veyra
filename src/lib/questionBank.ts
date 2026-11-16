import type {
  InterviewCategory,
  Difficulty,
  Language,
  PracticeMode,
} from '@/types';

export interface QuestionSeed {
  id: string;
  category: InterviewCategory;
  text: Record<Language, string>;
  difficulty: Difficulty;
  tags: string[];
}

export const QUESTION_BANK: QuestionSeed[] = [
  // === University ===
  {
    id: 'uni_1',
    category: 'university',
    difficulty: 'beginner',
    tags: ['motivation', 'self_awareness'],
    text: {
      en: 'You have two minutes: walk us through the academic question you most want to explore, the experience that led you to it, and why this university is the right place to pursue it.',
      fr: "Parlez-nous de vous et expliquez pourquoi vous souhaitez étudier dans cette université.",
      ar: 'حدثنا عن نفسك ولماذا ترغب في الدراسة في هذه الجامعة.',
    },
  },
  {
    id: 'uni_2',
    category: 'university',
    difficulty: 'intermediate',
    tags: ['academic', 'curiosity'],
    text: {
      en: 'Choose one idea from a class, book, experiment, or project that changed your view. What did you believe before, what changed, and what would you investigate next?',
      fr: 'Quel sujet ou domaine vous passionne le plus et pourquoi ?',
      ar: 'ما الموضوع أو المجال الذي تشغف به أكثر ولماذا؟',
    },
  },
  {
    id: 'uni_3',
    category: 'university',
    difficulty: 'intermediate',
    tags: ['leadership', 'teamwork'],
    text: {
      en: 'Tell us about a group project where the team was losing momentum. What did you personally do, how did others respond, and what was the final outcome?',
      fr: 'Décrivez une fois où vous avez pris un rôle de leadership. Qu\'en avez-vous appris ?',
      ar: 'صف موقفاً توليت فيه دور القيادة. ماذا تعلمت منه؟',
    },
  },
  {
    id: 'uni_4',
    category: 'university',
    difficulty: 'advanced',
    tags: ['problem_solving', 'critical_thinking'],
    text: {
      en: 'Design a first-year research project on a problem you care about. What is your question, what evidence would you collect, and what result would change your mind?',
      fr: 'Si vous receviez une bourse de recherche demain, quel problème étudieriez-vous et comment procéderiez-vous ?',
      ar: 'لو مُنحت منحة بحثية غداً، ما المشكلة التي ستحقق فيها وكيف ستقاربها؟',
    },
  },
  {
    id: 'uni_5',
    category: 'university',
    difficulty: 'advanced',
    tags: ['values', 'contribution'],
    text: {
      en: 'Describe one campus community you would build or strengthen in your first year. Who would it serve, what would you do in the first month, and how would you know it worked?',
      fr: 'Comment contribueriez-vous à la diversité et à la communauté de notre campus ?',
      ar: 'كيف ستساهم في تنوع ومجتمع حرمuchtenا الجامعي؟',
    },
  },
  {
    id: 'uni_6',
    category: 'university',
    difficulty: 'beginner',
    tags: ['motivation', 'self_awareness'],
    text: {
      en: 'What is a book, lecture, or idea that changed how you think? Why did it affect you?',
      fr: 'Quel livre, cours ou idée a changé votre façon de penser ? Pourquoi vous a-t-il marqué ?',
      ar: 'ما كتاب أو محاضرة أو فكرة غيّرت طريقة تفكيرك؟ ولماذا أثرت فيك؟',
    },
  },
  {
    id: 'uni_7',
    category: 'university',
    difficulty: 'intermediate',
    tags: ['resilience', 'growth'],
    text: {
      en: 'Tell us about a time you struggled academically. What did you do to recover?',
      fr: 'Racontez-nous une fois où vous avez eu des difficultés académiques. Qu\'avez-vous fait pour vous en remettre ?',
      ar: 'حدثنا عن مرة واجهت فيها صعوبة أكاديمية. ماذا فعلت لتتجاوزها؟',
    },
  },
  {
    id: 'uni_8',
    category: 'university',
    difficulty: 'advanced',
    tags: ['ethics', 'critical_thinking'],
    text: {
      en: 'Describe an ethical dilemma you have faced. How did you reason through it?',
      fr: 'Décrivez un dilemme éthique auquel vous avez été confronté. Comment avez-vous raisonné ?',
      ar: 'صف معضلة أخلاقية واجهتها. كيف فكرت فيها؟',
    },
  },
  {
    id: 'uni_9',
    category: 'university',
    difficulty: 'intermediate',
    tags: ['collaboration', 'communication'],
    text: {
      en: 'Describe a time you worked in a team where members disagreed on direction. How did you contribute to a resolution?',
      fr: 'Décrivez une fois où vous avez travaillé en équipe avec des désaccords sur la direction. Comment avez-vous contribué à une résolution ?',
      ar: 'صف موقفاً عملت فيه في فريق اختلف أعضاؤه على الاتجاه. كيف ساهمت في الحل؟',
    },
  },
  {
    id: 'uni_10',
    category: 'university',
    difficulty: 'advanced',
    tags: ['vision', 'ambition'],
    text: {
      en: 'If you could redesign one aspect of the education system in your country, what would it be and why?',
      fr: 'Si vous pouviez redessiner un aspect du système éducatif de votre pays, quel serait-il et pourquoi ?',
      ar: 'لو استطعت إعادة تصميم جانب واحد من نظام التعليم في بلدك، فماذا سيكون ولماذا؟',
    },
  },
  // === Scholarship ===
  {
    id: 'sch_1',
    category: 'scholarship',
    difficulty: 'beginner',
    tags: ['motivation', 'goals'],
    text: {
      en: 'Why this scholarship, specifically? Explain the opportunity it would unlock, the constraint it would remove, and the concrete result you would aim to achieve within one year.',
      fr: 'Pourquoi demandez-vous cette bourse et que signifie-t-elle pour vous ?',
      ar: 'لماذا تتقدم لهذه المنحة وماذا تعني لك؟',
    },
  },
  {
    id: 'sch_2',
    category: 'scholarship',
    difficulty: 'intermediate',
    tags: ['achievement', 'resilience'],
    text: {
      en: 'Tell us about a time a financial, family, academic, or personal constraint threatened a goal. What choice did you make, what support did you seek, and what changed afterward?',
      fr: 'Parlez-nous d\'un obstacle important que vous avez surmonté et comment il vous a façonné.',
      ar: 'حدثنا عن عقبة كبيرة تجاوزتها وكيف شكلتك.',
    },
  },
  {
    id: 'sch_3',
    category: 'scholarship',
    difficulty: 'intermediate',
    tags: ['community', 'impact'],
    text: {
      en: 'Name a problem in your community that you understand personally. After this scholarship, what specific work would you do, for whom, and how would you measure its impact?',
      fr: 'Comment comptez-vous utiliser votre éducation pour redonner à votre communauté ?',
      ar: 'كيف تخطط لاستخدام تعليمك في العطاء لمجتمعك؟',
    },
  },
  {
    id: 'sch_4',
    category: 'scholarship',
    difficulty: 'advanced',
    tags: ['vision', 'ambition'],
    text: {
      en: 'Describe the role you hope to hold ten years from now, the capability you still need to build, and how this scholarship would change your next two decisions.',
      fr: 'Où vous voyez-vous dans dix ans, et comment cette bourse vous aide-t-elle à y arriver ?',
      ar: 'أين ترى نفسك بعد عشر سنوات، وكيف تساعدك هذه المنحة على الوصول إلى هناك؟',
    },
  },
  {
    id: 'sch_5',
    category: 'scholarship',
    difficulty: 'beginner',
    tags: ['self_awareness', 'values'],
    text: {
      en: 'What is something you would change about yourself, and why?',
      fr: 'Que changeriez-vous chez vous, et pourquoi ?',
      ar: 'ما شيء تغيره في نفسك، ولماذا؟',
    },
  },
  {
    id: 'sch_6',
    category: 'scholarship',
    difficulty: 'intermediate',
    tags: ['leadership', 'initiative'],
    text: {
      en: 'Describe a time when you saw something that needed changing and took the initiative to change it.',
      fr: 'Décrivez une fois où vous avez vu quelque chose qui devait changer et pris l\'initiative de le changer.',
      ar: 'صف موقفاً رأيت فيه شيئاً يحتاج للتغيير واتخذت المبادرة لتغييره.',
    },
  },
  {
    id: 'sch_7',
    category: 'scholarship',
    difficulty: 'advanced',
    tags: ['values', 'integrity'],
    text: {
      en: 'Describe a situation where doing the right thing came at a personal cost. What did you do?',
      fr: 'Décrivez une situation où faire ce qui était juste a eu un coût personnel. Qu\'avez-vous fait ?',
      ar: 'صف موقفاً كان فيه فعل الصواب مكلفاً شخصياً. ماذا فعلت؟',
    },
  },
  {
    id: 'sch_8',
    category: 'scholarship',
    difficulty: 'advanced',
    tags: ['impact', 'vision'],
    text: {
      en: 'If you had unlimited resources for one year, what problem would you solve and how?',
      fr: 'Si vous aviez des ressources illimitées pendant un an, quel problème résoudriez-vous et comment ?',
      ar: 'لو كان لديك موارد غير محدودة لسنة، ما المشكلة التي ستحلها وكيف؟',
    },
  },
  // === Job ===
  {
    id: 'job_1',
    category: 'job',
    difficulty: 'beginner',
    tags: ['motivation', 'fit'],
    text: {
      en: 'Based on this role, which problem would you expect to own in your first six months? What evidence from your past shows you can solve it?',
      fr: 'Pourquoi êtes-vous intéressé par ce poste et qu\'est-ce qui fait de vous un bon candidat ?',
      ar: 'لماذا أنت مهتم بهذا الدور وما الذي يجعلك مناسباً له؟',
    },
  },
  {
    id: 'job_2',
    category: 'job',
    difficulty: 'intermediate',
    tags: ['experience', 'skills'],
    text: {
      en: 'Walk me through a project from the original problem to the measurable result. What did you personally own, what trade-off did you make, and what would your teammate say you missed?',
      fr: 'Décrivez un projet dont vous êtes fier. Quelle était votre contribution spécifique ?',
      ar: 'صف مشروعاً تفخر به. ما كانت مساهمتك المحددة فيه؟',
    },
  },
  {
    id: 'job_3',
    category: 'job',
    difficulty: 'intermediate',
    tags: ['teamwork', 'conflict'],
    text: {
      en: 'Tell me about a disagreement over a decision that affected the quality, deadline, or customer of a project. How did you argue your position, what did you compromise on, and what happened?',
      fr: 'Parlez-moi d\'une fois où vous étiez en désaccord avec un coéquipier. Comment l\'avez-vous résolu ?',
      ar: 'حدثني عن مرة خالفت فيها زميلاً. كيف حليت الأمر؟',
    },
  },
  {
    id: 'job_4',
    category: 'job',
    difficulty: 'advanced',
    tags: ['problem_solving', 'judgment'],
    text: {
      en: 'Describe a situation where you had to make a decision with incomplete information. What did you do?',
      fr: 'Décrivez une situation où vous avez dû prendre une décision avec des informations incomplètes. Qu\'avez-vous fait ?',
      ar: 'صف موقفاً اضطررت فيه لاتخاذ قرار بمعلومات ناقصة. ماذا فعلت؟',
    },
  },
  {
    id: 'job_5',
    category: 'job',
    difficulty: 'advanced',
    tags: ['weakness', 'self_awareness'],
    text: {
      en: 'What is a professional weakness you are actively working on, and what steps are you taking?',
      fr: 'Quelle faiblesse professionnelle travaillez-vous activement, et quelles mesures prenez-vous ?',
      ar: 'ما نقطة ضعف مهنية تعمل عليها بنشاط، وما الخطوات التي تتخذها؟',
    },
  },
  {
    id: 'job_6',
    category: 'job',
    difficulty: 'beginner',
    tags: ['motivation', 'research'],
    text: {
      en: 'What do you know about our company, and why does our mission resonate with you?',
      fr: 'Que savez-vous de notre entreprise, et pourquoi notre mission résonne-t-elle avec vous ?',
      ar: 'ماذا تعرف عن شركتنا، ولماذا تتفق مهمتنا معك؟',
    },
  },
  {
    id: 'job_7',
    category: 'job',
    difficulty: 'intermediate',
    tags: ['failure', 'growth'],
    text: {
      en: 'Tell me about a time you failed at something important. What did you learn?',
      fr: 'Racontez-moi une fois où vous avez échoué dans quelque chose d\'important. Qu\'avez-vous appris ?',
      ar: 'حدثني عن مرة فشلت في شيء مهم. ماذا تعلمت؟',
    },
  },
  {
    id: 'job_8',
    category: 'job',
    difficulty: 'advanced',
    tags: ['ambiguity', 'strategy'],
    text: {
      en: 'How would you approach a project where the requirements keep changing every week?',
      fr: 'Comment aborderiez-vous un projet où les exigences changent chaque semaine ?',
      ar: 'كيف تقارب مشروعاً تتغير متطلباته كل أسبوع؟',
    },
  },
  {
    id: 'job_9',
    category: 'job',
    difficulty: 'intermediate',
    tags: ['mentorship', 'communication'],
    text: {
      en: 'Describe a time you had to explain something complex to someone who had no background in the topic.',
      fr: 'Décrivez une fois où vous avez dû expliquer quelque chose de complexe à quelqu\'un sans expérience du sujet.',
      ar: 'صف موقفاً اضطررت فيه لشرح شيء معقد لشخص ليس لديه خلفية في الموضوع.',
    },
  },
  {
    id: 'job_10',
    category: 'job',
    difficulty: 'advanced',
    tags: ['prioritization', 'judgment'],
    text: {
      en: 'At 9 a.m., a customer escalation, a production bug, and a leadership request all become urgent. What questions do you ask, how do you sequence the work, and how do you communicate the trade-offs?',
      fr: 'Vous avez trois tâches urgentes de trois parties prenantes, toutes à rendre aujourd\'hui. Comment décidez-vous quoi faire en premier ?',
      ar: 'لديك ثلاث مهام عاجلة من ثلاث جهات مختلفة، جميعها مستحقة اليوم. كيف تقرر ماذا تفعل أولاً؟',
    },
  },
  {
    id: 'job_11',
    category: 'job',
    difficulty: 'beginner',
    tags: ['strengths', 'fit'],
    text: {
      en: 'What is the one skill or quality that sets you apart from other candidates?',
      fr: 'Quelle compétence ou qualité vous distingue des autres candidats ?',
      ar: 'ما المهارة أو السمة التي تميزك عن المرشحين الآخرين؟',
    },
  },
  {
    id: 'job_12',
    category: 'job',
    difficulty: 'advanced',
    tags: ['scale', 'impact'],
    text: {
      en: 'Tell me about the most impactful thing you have built, shipped, or improved. What was the measurable outcome?',
      fr: 'Racontez-moi la chose la plus marquante que vous avez construite, livrée ou améliorée. Quel était le résultat mesurable ?',
      ar: 'حدثني عن أكثر شيء مؤثر بنيت أو شحنته أو حسنته. ما كانت النتيجة القابلة للقياس؟',
    },
  },
  // === Internship ===
  {
    id: 'int_1',
    category: 'internship',
    difficulty: 'beginner',
    tags: ['motivation', 'learning'],
    text: {
      en: 'What specific skill or work habit do you want to leave this internship with? Describe how you would practice it, ask for feedback, and prove that you improved.',
      fr: 'Qu\'espérez-vous apprendre pendant ce stage ?',
      ar: 'ماذا تأمل أن تتعلم خلال هذه التدريب؟',
    },
  },
  {
    id: 'int_2',
    category: 'internship',
    difficulty: 'intermediate',
    tags: ['initiative', 'proactivity'],
    text: {
      en: 'Tell me about a time you had to deliver work using a tool or subject you did not know. What did you learn first, who did you ask, and what did you deliver by the deadline?',
      fr: 'Parlez-moi d\'une fois où vous avez dû apprendre quelque chose de nouveau rapidement. Comment avez-vous procédé ?',
      ar: 'حدثني عن مرة اضطررت فيها لتعلم شيء جديد بسرعة. كيف قاربت الأمر؟',
    },
  },
  {
    id: 'int_3',
    category: 'internship',
    difficulty: 'intermediate',
    tags: ['teamwork', 'communication'],
    text: {
      en: 'Describe the most difficult feedback you received on school or work. What did you change in your next version, and how did you check that the change helped?',
      fr: 'Comment gérez-vous les retours et les critiques de vos superviseurs ?',
      ar: 'كيف تتعامل مع الملاحظات والنقد من المشرفين؟',
    },
  },
  {
    id: 'int_4',
    category: 'internship',
    difficulty: 'advanced',
    tags: ['contribution', 'value'],
    text: {
      en: 'What specific skills or perspective would you bring to our team?',
      fr: 'Quelles compétences ou perspective spécifiques apporteriez-vous à notre équipe ?',
      ar: 'ما المهارات أو المنظور المحدد الذي ستجلبه لفريقنا؟',
    },
  },
  {
    id: 'int_5',
    category: 'internship',
    difficulty: 'beginner',
    tags: ['motivation', 'curiosity'],
    text: {
      en: 'Which of our products or projects excites you the most, and what would you want to work on?',
      fr: 'Lequel de nos produits ou projets vous enthousiasme le plus, et sur quoi voudriez-vous travailler ?',
      ar: 'أي من منتجاتنا أو مشاريعنا يثير حماسك أكثر، وعلى ماذا تريد أن تعمل؟',
    },
  },
  {
    id: 'int_6',
    category: 'internship',
    difficulty: 'intermediate',
    tags: ['ownership', 'initiative'],
    text: {
      en: 'Describe a time you took ownership of a problem nobody asked you to solve. What happened?',
      fr: 'Décrivez une fois où vous avez pris la responsabilité d\'un problème que personne ne vous avait demandé de résoudre. Que s\'est-il passé ?',
      ar: 'صف موقفاً تحملت فيه مسؤولية مشكلة لم يطلب منك أحد حلها. ماذا حدث؟',
    },
  },
  {
    id: 'int_7',
    category: 'internship',
    difficulty: 'advanced',
    tags: ['adaptability', 'growth'],
    text: {
      en: 'How would you handle being assigned to a project that uses tools and languages you have never used before?',
      fr: 'Comment géreriez-vous le fait d\'être assigné à un projet utilisant des outils et langages que vous n\'avez jamais utilisés ?',
      ar: 'كيف ستتعامل مع تكليفك بمشروع يستخدم أدوات ولغات لم تستخدمها من قبل؟',
    },
  },
  {
    id: 'int_8',
    category: 'internship',
    difficulty: 'advanced',
    tags: ['value', 'contribution'],
    text: {
      en: 'If you could only contribute one thing during your internship, what would you want it to be and why?',
      fr: 'Si vous ne pouviez contribuer qu\'à une seule chose pendant votre stage, que voudriez-vous que ce soit et pourquoi ?',
      ar: 'لو كان بإمكانك المساهمة بشيء واحد فقط خلال تدريبك، فماذا تريد أن يكون ولماذا؟',
    },
  },
  // === Competition ===
  {
    id: 'comp_1',
    category: 'competition',
    difficulty: 'beginner',
    tags: ['motivation', 'preparation'],
    text: {
      en: 'What motivated you to enter this competition?',
      fr: 'Qu\'est-ce qui vous a motivé à participer à cette compétition ?',
      ar: 'ما الذي حفزك للمشاركة في هذه المسابقة؟',
    },
  },
  {
    id: 'comp_2',
    category: 'competition',
    difficulty: 'intermediate',
    tags: ['strategy', 'preparation'],
    text: {
      en: 'Take us through your preparation plan for this competition: what did you practice, how did you review mistakes, and how did your strategy change after a poor mock result?',
      fr: 'Comment vous êtes-vous préparé pour cette compétition et quelle était votre stratégie ?',
      ar: 'كيف استعدت لهذه المسابقة وما كانت استراتيجيتك؟',
    },
  },
  {
    id: 'comp_3',
    category: 'competition',
    difficulty: 'advanced',
    tags: ['pressure', 'performance'],
    text: {
      en: 'In the final hour of a competition, your strongest approach stops working. Describe exactly how you manage the pressure, protect your time, and decide whether to repair or replace your approach.',
      fr: 'Décrivez comment vous performez sous pression. Donnez un exemple spécifique.',
      ar: 'صف كيف تؤدي تحت الضغط. أعط مثالاً محدداً.',
    },
  },
  {
    id: 'comp_4',
    category: 'competition',
    difficulty: 'intermediate',
    tags: ['teamwork', 'collaboration'],
    text: {
      en: 'Your team has two plausible solutions and the deadline is close. How would you help compare them, reach a decision, and keep the team moving if your preferred option is rejected?',
      fr: 'Décrivez une fois où votre équipe était bloquée sur un problème. Comment avez-vous aidé à trouver une solution ?',
      ar: 'صف موقفاً علق فيه فريقك في مشكلة. كيف ساعدت في تجاوزها؟',
    },
  },
  {
    id: 'comp_5',
    category: 'competition',
    difficulty: 'advanced',
    tags: ['setback', 'resilience'],
    text: {
      en: 'Tell me about a competition or challenge where things went wrong. What did you do next?',
      fr: 'Racontez-moi une compétition ou un défi où les choses ont mal tourné. Qu\'avez-vous fait ensuite ?',
      ar: 'حدثني عن مسابقة أو تحدٍ سار بشكل خاطئ. ماذا فعلت بعدها؟',
    },
  },
  {
    id: 'comp_6',
    category: 'competition',
    difficulty: 'beginner',
    tags: ['self_awareness', 'growth'],
    text: {
      en: 'What is one thing you have learned about yourself through preparing for competitions?',
      fr: 'Qu\'avez-vous appris sur vous-même en vous préparant à des compétitions ?',
      ar: 'ما شيء واحد تعلمته عن نفسك من خلال الاستعداد للمسابقات؟',
    },
  },
  {
    id: 'comp_7',
    category: 'competition',
    difficulty: 'advanced',
    tags: ['strategy', 'judgment'],
    text: {
      en: 'If you were competing against someone with twice your experience, how would you approach the challenge differently?',
      fr: 'Si vous competiez contre quelqu\'un avec deux fois votre expérience, comment aborderiez-vous le défi différemment ?',
      ar: 'لو كنت تنافس شخصاً لديه ضعف خبرتك، كيف ستقارب التحدي بشكل مختلف؟',
    },
  },
  // === Personal Intro ===
  {
    id: 'pi_1',
    category: 'personal_intro',
    difficulty: 'beginner',
    tags: ['self_awareness', 'communication'],
    text: {
      en: 'Give a 90-second introduction that connects one formative experience, one strength you have earned rather than claimed, and the opportunity you are pursuing now.',
      fr: 'Présentez-vous d\'une manière qui nous dit qui vous êtes au-delà de votre CV.',
      ar: 'قدم نفسك بطريقة تخبرنا من أنت بما يتجاوز سيرتك الذاتية.',
    },
  },
  {
    id: 'pi_2',
    category: 'personal_intro',
    difficulty: 'intermediate',
    tags: ['values', 'authenticity'],
    text: {
      en: 'Tell me about a thoughtful opinion you hold that differs from people around you. What evidence shaped it, and what would make you revise it?',
      fr: 'Qu\'est-ce que vous croyez et que la plupart des gens autour de vous contestent ?',
      ar: 'ما شيء تؤمن به ويخالفك فيه معظم من حولك؟',
    },
  },
  {
    id: 'pi_3',
    category: 'personal_intro',
    difficulty: 'advanced',
    tags: ['storytelling', 'growth'],
    text: {
      en: 'Tell us about one moment when your view of your own ability changed. What happened, what did you do differently afterward, and what are you still working on?',
      fr: 'Racontez-nous l\'histoire d\'un moment qui a changé votre perception de vous-même.',
      ar: 'احك لنا قصة لحظة غيّرت نظرتك لنفسك.',
    },
  },
  {
    id: 'pi_4',
    category: 'personal_intro',
    difficulty: 'beginner',
    tags: ['strengths', 'communication'],
    text: {
      en: 'If you had to describe yourself in three words, what would they be and why those three?',
      fr: 'Si vous deviez vous décrire en trois mots, quels seraient-ils et pourquoi ceux-là ?',
      ar: 'لو كان عليك وصف نفسك بثلاث كلمات، فماذا ستكون ولماذا؟',
    },
  },
  {
    id: 'pi_5',
    category: 'personal_intro',
    difficulty: 'intermediate',
    tags: ['values', 'self_awareness'],
    text: {
      en: 'What is a belief or value you hold that has been tested? How did you respond?',
      fr: 'Quelle croyance ou valeur portez-vous qui a été mise à l\'épreuve ? Comment avez-vous réagi ?',
      ar: 'ما معتقد أو قيمة تتبناها تم اختبارها؟ كيف استجبت؟',
    },
  },
  {
    id: 'pi_6',
    category: 'personal_intro',
    difficulty: 'advanced',
    tags: ['storytelling', 'authenticity'],
    text: {
      en: 'Tell us about a person who has profoundly shaped who you are today. What did they teach you?',
      fr: 'Parlez-nous d\'une personne qui a profondément façonné qui vous êtes aujourd\'hui. Qu\'est-ce qu\'elle vous a appris ?',
      ar: 'حدثنا عن شخص أثّر عميقاً في من أنت اليوم. ماذا علمك؟',
    },
  },
  {
    id: 'pi_7',
    category: 'personal_intro',
    difficulty: 'intermediate',
    tags: ['growth', 'reflection'],
    text: {
      en: 'What is something you used to believe but no longer do? What changed your mind?',
      fr: 'Que croyiez-vous autrefois mais plus maintenant ? Qu\'est-ce qui vous a fait changer d\'avis ?',
      ar: 'ما شيء كنت تؤمن به ولم تعد تؤمن به؟ ما الذي غيّر رأيك؟',
    },
  },
  // === Custom (fallback) ===
  {
    id: 'custom_1',
    category: 'custom',
    difficulty: 'beginner',
    tags: ['motivation', 'self_awareness'],
    text: {
      en: 'Tell me about yourself and what brings you to this opportunity.',
      fr: 'Parlez-moi de vous et de ce qui vous amène à cette opportunité.',
      ar: 'حدثني عن نفسك وما الذي جلبك إلى هذه الفرصة.',
    },
  },
  {
    id: 'custom_2',
    category: 'custom',
    difficulty: 'intermediate',
    tags: ['experience', 'reflection'],
    text: {
      en: 'Describe a challenge you faced that required you to grow. What did you learn about yourself?',
      fr: 'Décrivez un défi qui vous a demandé de grandir. Qu\'avez-vous appris sur vous-même ?',
      ar: 'صف تحدياً واجهته تطلب منك أن تنمو. ماذا تعلمت عن نفسك؟',
    },
  },
  {
    id: 'custom_3',
    category: 'custom',
    difficulty: 'advanced',
    tags: ['problem_solving', 'judgment'],
    text: {
      en: 'What is the most complex problem you have tackled? Walk me through your approach.',
      fr: 'Quel est le problème le plus complexe que vous ayez traité ? Décrivez-moi votre approche.',
      ar: 'ما أكثر مشكلة معقدة عالجتها؟ استعرض لي طريقتك.',
    },
  },
];

export const FOLLOW_UP_TEMPLATES: Record<Language, string[]> = {
  en: [
    'Can you give a specific example of what you just described?',
    'That is interesting — what was the outcome of that situation?',
    'Walk me through your thought process in that moment.',
    'What would you do differently if you faced that situation again?',
    'How did the people around you respond to what you did?',
    'You mentioned something briefly — could you expand on that?',
    'What was the most challenging part of that experience?',
    'How does that experience relate to the role you are applying for?',
    'What did you personally learn from that experience?',
    'Could you quantify the impact of what you did?',
  ],
  fr: [
    'Pouvez-vous donner un exemple spécifique de ce que vous venez de décrire ?',
    'C\'est intéressant — quel a été le résultat de cette situation ?',
    'Décrivez-moi votre processus de réflexion à ce moment-là.',
    'Que feriez-vous différemment si vous faisiez face à cette situation à nouveau ?',
    'Comment les personnes autour de vous ont-elles réagi à ce que vous avez fait ?',
    'Vous avez mentionné quelque chose brièvement — pourriez-vous développer ?',
    'Quelle a été la partie la plus difficile de cette expérience ?',
    'Comment cette expérience se rapporte-t-elle au poste pour lequel vous postulez ?',
    'Qu\'avez-vous personnellement appris de cette expérience ?',
    'Pourriez-vous quantifier l\'impact de ce que vous avez fait ?',
  ],
  ar: [
    'هل يمكنك إعطاء مثال محدد على ما وصفت للتو؟',
    'هذا مثير للاهتمام — ماذا كانت نتيجة ذلك الموقف؟',
    'صف لي كيف كان تفكيرك في تلك اللحظة.',
    'ماذا ستفعل بشكل مختلف لو واجهت ذلك الموقف مرة أخرى؟',
    'كيف استجاب من حولك لما فعلته؟',
    'ذكرت شيئاً بإيجاز — هل يمكنك التوسع فيه؟',
    'ما كان أصعب جزء في تلك التجربة؟',
    'كيف ترتبط تلك التجربة بالدور الذي تتقدم له؟',
    'ماذا تعلمت شخصياً من تلك التجربة؟',
    'هل يمكنك قياس أثر ما فعلته؟',
  ],
};

export const FOCUS_WEAKNESS_QUESTIONS: Record<Language, Record<string, string>> = {
  en: {
    specificity: 'Tell me about a time you achieved something measurable. Be as specific as you can about the results.',
    structure: 'Walk me through a project from start to finish, explaining each step clearly.',
    examples: 'Describe a challenge you faced. Give a concrete example with details.',
    clarity: 'Explain a complex topic from your field as if you were teaching it to someone new.',
    relevance: 'Why do you think your background prepares you for this specific opportunity?',
    reasoning: 'Describe a difficult decision you made and explain the reasoning behind it.',
    persuasiveness: 'Convince me that you are the right candidate for this opportunity.',
    conciseness: 'In two or three sentences, tell me your biggest strength and why it matters here.',
  },
  fr: {
    specificity: 'Parlez-moi d\'une fois où vous avez atteint quelque chose de mesurable. Soyez aussi précis que possible sur les résultats.',
    structure: 'Décrivez-moi un projet de A à Z, en expliquant chaque étape clairement.',
    examples: 'Décrivez un défi auquel vous avez fait face. Donnez un exemple concret avec des détails.',
    clarity: 'Expliquez un sujet complexe de votre domaine comme si vous l\'enseigniez à un débutant.',
    relevance: 'Pourquoi pensez-vous que votre parcours vous prépare à cette opportunité spécifique ?',
    reasoning: 'Décrivez une décision difficile que vous avez prise et expliquez votre raisonnement.',
    persuasiveness: 'Convainquez-moi que vous êtes le bon candidat pour cette opportunité.',
    conciseness: 'En deux ou trois phrases, dites-moi votre plus grande force et pourquoi elle compte ici.',
  },
  ar: {
    specificity: 'حدثني عن مرة حققت فيها شيئاً قابلاً للقياس. كن محدداً قدر الإمكان حول النتائج.',
    structure: 'استعرض لي مشروعاً من البداية إلى النهاية، موضحاً كل خطوة بوضوح.',
    examples: 'صف تحدياً واجهته. أعطِ مثالاً ملموساً بالتفاصيل.',
    clarity: 'اشرح موضوعاً معقداً في مجالك كأنك تعلّمه لشخص مبتدئ.',
    relevance: 'لماذا تعتقد أن خلفيتك تعدك لهذه الفرصة تحديداً؟',
    reasoning: 'صف قراراً صعباً اتخذته واشرح وراءه.',
    persuasiveness: 'أقنعني بأنك المرشح المناسب لهذه الفرصة.',
    conciseness: 'في جملتين أو ثلاث، أخبرني بأكبر نقطة قوة لديك ولماذا تهم هنا.',
  },
};

export const DIMENSION_LABELS: Record<Language, Record<string, string>> = {
  en: {
    clarity: 'Clarity',
    structure: 'Structure',
    specificity: 'Specificity',
    relevance: 'Relevance',
    examples: 'Supporting Examples',
    reasoning: 'Reasoning',
    persuasiveness: 'Persuasiveness',
    conciseness: 'Conciseness',
    impact: 'Impact',
    authenticity: 'Authenticity',
  },
  fr: {
    clarity: 'Clarté',
    structure: 'Structure',
    specificity: 'Spécificité',
    relevance: 'Pertinence',
    examples: 'Exemples à l\'appui',
    reasoning: 'Raisonnement',
    persuasiveness: 'Pouvoir de conviction',
    conciseness: 'Concision',
    impact: 'Impact',
    authenticity: 'Authenticité',
  },
  ar: {
    clarity: 'الوضوح',
    structure: 'البنية',
    specificity: 'التحديد',
    relevance: 'الصلة',
    examples: 'أمثلة داعمة',
    reasoning: 'الاستدلال',
    persuasiveness: 'الإقناع',
    conciseness: 'الإيجاز',
    impact: 'الأثر',
    authenticity: 'الأصالة',
  },
};

export function pickQuestions(
  category: InterviewCategory,
  difficulty: Difficulty,
  language: Language,
  count: number,
  practiceMode: PracticeMode,
  focusArea?: string
): string[] {
  let pool = QUESTION_BANK.filter((q) => q.category === category);
  if (pool.length === 0) {
    pool = QUESTION_BANK.filter((q) => q.category === 'personal_intro');
  }

  const difficultyOrder: Record<Difficulty, string[]> = {
    beginner: ['beginner', 'intermediate', 'advanced'],
    intermediate: ['intermediate', 'beginner', 'advanced'],
    advanced: ['advanced', 'intermediate', 'beginner'],
  };

  const ordered: typeof pool = [];
  for (const d of difficultyOrder[difficulty]) {
    ordered.push(...pool.filter((q) => q.difficulty === d));
  }

  if (practiceMode === 'focus_weakness' && focusArea) {
    const focusQ = FOCUS_WEAKNESS_QUESTIONS[language]?.[focusArea];
    const ids = ordered.slice(0, count).map((q) => q.id);
    if (focusQ) {
      return [`focus:${focusArea}`, ...ids].slice(0, count);
    }
  }

  return ordered.slice(0, count).map((q) => q.id);
}

export function getQuestionText(id: string, language: Language): string {
  if (id.startsWith('focus:')) {
    const area = id.slice(6);
    return FOCUS_WEAKNESS_QUESTIONS[language]?.[area] ?? FOCUS_WEAKNESS_QUESTIONS.en[area] ?? '';
  }
  const q = QUESTION_BANK.find((x) => x.id === id);
  if (!q) return '';
  return q.text[language] || q.text.en;
}
