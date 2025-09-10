import { DatabaseStorage } from "./storage";
import { type InsertResource } from "@shared/schema";

const storage = new DatabaseStorage();

// Comprehensive wellness resources for all six categories
const wellnessResources: InsertResource[] = [
  // STRESS MANAGEMENT
  {
    title: "4-7-8 Breathing Technique",
    description: "Learn the 4-7-8 breathing method to instantly reduce stress and anxiety. Inhale for 4, hold for 7, exhale for 8 counts.",
    type: "guide",
    category: "stress-management",
    content: `**How to Practice 4-7-8 Breathing:**

1. **Sit comfortably** with your back straight
2. **Exhale completely** through your mouth
3. **Inhale through nose** for 4 counts
4. **Hold your breath** for 7 counts
5. **Exhale through mouth** for 8 counts
6. **Repeat 3-4 cycles**

**Benefits:**
- Reduces anxiety within minutes
- Improves sleep quality
- Lowers heart rate
- Activates relaxation response

**When to Use:**
- Before exams or presentations
- When feeling overwhelmed
- At bedtime for better sleep
- During panic moments

**Pro Tips:**
- Practice regularly for best results
- Start with 3 cycles, increase gradually
- Focus on the counting rhythm
- Use anywhere, anytime`,
    duration: 5,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Quick Stress Relief Techniques",
    description: "A collection of 2-minute stress busters you can use anywhere on campus to instantly feel more relaxed.",
    type: "article",
    category: "stress-management",
    content: `**5 Quick Stress Busters (2 minutes each):**

**1. Progressive Muscle Relaxation**
- Tense shoulders for 5 seconds, then release
- Clench fists for 5 seconds, then release
- Tighten face muscles, then completely relax
- Feel the contrast between tension and relaxation

**2. Grounding 5-4-3-2-1 Technique**
- 5 things you can see
- 4 things you can touch
- 3 things you can hear
- 2 things you can smell
- 1 thing you can taste

**3. Power Pose**
- Stand tall with arms raised for 60 seconds
- Boosts confidence hormones
- Reduces stress hormones
- Perfect before presentations

**4. Mindful Water Break**
- Drink water slowly and mindfully
- Focus on temperature and sensation
- Take 10 deep breaths between sips
- Hydrates body and calms mind

**5. Desk Stretches**
- Neck rolls (left and right)
- Shoulder blade squeezes
- Gentle spinal twist
- Ankle circles under desk`,
    duration: 2,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Stress Management Workout Timer",
    description: "Interactive 10-minute stress relief routine with guided breathing, stretching, and relaxation exercises.",
    type: "tool",
    category: "stress-management",
    content: `**10-Minute Stress Relief Routine:**

**Warm-up (2 minutes):**
- Deep breathing x10
- Gentle neck stretches
- Shoulder rolls

**Movement (5 minutes):**
- 30 seconds jumping jacks
- 30 seconds wall push-ups
- 30 seconds in-place marching
- 30 seconds arm circles
- Repeat sequence twice

**Cool-down (3 minutes):**
- Forward fold stretch
- Seated spinal twist
- Child's pose variation
- Final meditation

**Timer Features:**
- Visual countdown
- Exercise prompts
- Breathing cues
- Progress tracking
- Customizable duration`,
    duration: 10,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Daily Stress Journal Prompts",
    description: "Guided journaling questions to help identify stress triggers and develop healthy coping strategies.",
    type: "activity",
    category: "stress-management",
    content: `**Morning Reflection (5 minutes):**

1. How am I feeling right now?
2. What challenges might I face today?
3. What tools can I use to stay calm?
4. What's one thing I'm grateful for?

**Evening Review (10 minutes):**

1. What stressed me most today?
2. How did I handle difficult moments?
3. What worked well for managing stress?
4. What would I do differently?
5. What am I proud of accomplishing?

**Weekly Deep Dive (15 minutes):**

1. What patterns do I notice in my stress?
2. Which triggers appear most frequently?
3. What coping strategies are most effective?
4. How has my stress level changed this week?
5. What goals do I have for next week?

**Helpful Prompts:**
- "When I feel overwhelmed, I..."
- "My safe space feels like..."
- "I am strongest when..."
- "Tomorrow I will..."

**Benefits:**
- Increased self-awareness
- Better stress pattern recognition
- Improved coping strategies
- Emotional release`,
    duration: 10,
    language: "en",
    isOfflineAvailable: true
  },

  // SLEEP HYGIENE
  {
    title: "Perfect Sleep Routine Planner",
    description: "Create your personalized bedtime routine with this step-by-step guide for better sleep quality.",
    type: "tool",
    category: "sleep-hygiene",
    content: `**Build Your Perfect Sleep Routine:**

**2 Hours Before Bed:**
- [ ] Dim all lights
- [ ] No more caffeine
- [ ] Finish eating
- [ ] Set tomorrow's clothes out

**1 Hour Before Bed:**
- [ ] Put devices away
- [ ] Light stretching or yoga
- [ ] Herbal tea or warm milk
- [ ] Read or listen to calm music

**30 Minutes Before Bed:**
- [ ] Complete hygiene routine
- [ ] Set room temperature to 65-68°F
- [ ] Use blackout curtains
- [ ] Practice breathing exercises

**In Bed:**
- [ ] Progressive muscle relaxation
- [ ] Gratitude reflection
- [ ] Visualization exercise
- [ ] Focus on breath rhythm

**Customization Options:**
- Adjust timing based on schedule
- Add personal preferences
- Track what works best
- Modify for weekends vs weekdays

**Sleep Quality Tracker:**
- Rate sleep 1-10
- Note wake-up time
- Track energy levels
- Monitor patterns`,
    duration: 15,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Sleep Hygiene Do's and Don'ts",
    description: "Essential guidelines for improving your sleep quality with science-backed tips and common mistakes to avoid.",
    type: "guide",
    category: "sleep-hygiene",
    content: `**✅ DO'S FOR BETTER SLEEP:**

**Environment:**
- Keep bedroom cool (65-68°F)
- Use blackout curtains or eye mask
- Invest in comfortable pillows
- Keep room quiet or use white noise

**Timing:**
- Go to bed at the same time daily
- Wake up at consistent times
- Get sunlight exposure in the morning
- Avoid naps after 3 PM

**Activities:**
- Exercise regularly (but not before bed)
- Read calming books
- Practice relaxation techniques
- Keep a sleep diary

**Diet:**
- Eat dinner 3 hours before bed
- Try herbal tea (chamomile, valerian)
- Stay hydrated during the day
- Avoid large meals before bed

**❌ DON'TS THAT RUIN SLEEP:**

**Technology:**
- No screens 1 hour before bed
- Don't charge phone in bedroom
- Avoid stimulating content
- Turn off all LED lights

**Substances:**
- No caffeine after 2 PM
- Limit alcohol consumption
- Avoid nicotine before bed
- Don't take long daytime naps

**Behaviors:**
- Don't do work in bed
- Avoid intense exercise late
- Don't sleep in on weekends
- Don't force sleep when not tired

**Quick Recovery Tips:**
- If awake 20+ minutes, get up
- Do quiet activity until sleepy
- Return to bed when drowsy
- Don't check the time`,
    duration: 8,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Power Nap Optimization Guide",
    description: "Master the art of strategic napping to boost energy without disrupting nighttime sleep.",
    type: "article",
    category: "sleep-hygiene",
    content: `**The Science of Power Napping:**

**Optimal Nap Duration:**
- **10-20 minutes:** Quick energy boost
- **30 minutes:** Light refreshment
- **60 minutes:** Cognitive enhancement
- **90 minutes:** Complete sleep cycle

**Best Nap Times:**
- **Early afternoon (1-3 PM):** Natural energy dip
- **6+ hours before bedtime:** Won't affect night sleep
- **After lunch:** Post-meal drowsiness

**Perfect Nap Environment:**
- Dark or dimly lit room
- Comfortable temperature
- Minimal noise
- Comfortable position

**Pre-Nap Strategy:**
- Set alarm for desired duration
- Use eye mask and earplugs
- Try "coffee nap" (caffeine before 20-min nap)
- Clear your mind with breathing

**Post-Nap Recovery:**
- Bright light exposure
- Gentle movement or stretching
- Cold water on face/hands
- Give yourself 15 minutes to fully wake

**When NOT to Nap:**
- If you have insomnia
- Late afternoon (after 3 PM)
- When extremely sleep-deprived
- If it affects nighttime sleep

**Student-Specific Tips:**
- Nap between classes
- Use library quiet zones
- Set phone to airplane mode
- Inform roommates of nap schedule`,
    duration: 20,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Bedtime Relaxation Sounds",
    description: "Calming audio collection including rain, ocean waves, and nature sounds for better sleep.",
    type: "audio",
    category: "sleep-hygiene",
    url: "/audio/bedtime-sounds",
    content: `**Curated Sleep Sounds Collection:**

**Nature Sounds (60 minutes each):**
- Gentle rain on leaves
- Ocean waves on beach
- Forest creek flowing
- Distant thunder

**White Noise Options:**
- Fan whirring sounds
- Air conditioner hum
- Light static noise
- Brown noise variations

**Guided Sleep Meditations:**
- Body scan relaxation
- Progressive muscle release
- Breathing focus
- Visualization journeys

**Binaural Beats:**
- Delta waves (deep sleep)
- Theta waves (REM sleep)
- Alpha waves (relaxation)
- Custom frequency blends

**Usage Tips:**
- Start volume low, adjust as needed
- Use timer function
- Combine with breathing exercises
- Create personal playlist
- Try different sounds nightly

**Science Behind Sleep Sounds:**
- Masks disruptive noises
- Creates consistent audio environment
- Triggers relaxation response
- Reduces racing thoughts`,
    duration: 60,
    language: "en",
    isOfflineAvailable: true
  },

  // STUDY TECHNIQUES
  {
    title: "Pomodoro Study Timer",
    description: "Interactive timer for the proven Pomodoro Technique: 25 minutes focused study, 5 minute breaks.",
    type: "tool",
    category: "study-techniques",
    content: `**Pomodoro Technique Timer:**

**How It Works:**
1. Choose a task to focus on
2. Set timer for 25 minutes
3. Work with complete focus
4. Take 5-minute break
5. Repeat for 4 cycles
6. Take longer 15-30 minute break

**Timer Features:**
- Visual countdown display
- Audio notifications
- Task tracking
- Session statistics
- Customizable intervals

**Break Activity Suggestions:**
- Stretch or walk
- Drink water
- Deep breathing
- Light snack
- Quick chat with friends

**Customization Options:**
- Adjust work intervals (20-30 min)
- Modify break lengths (5-10 min)
- Set daily goals
- Track completion rates
- Choose notification sounds

**Study Tips:**
- Turn off all distractions
- Have water and snacks ready
- Plan tasks in advance
- Use physical timer if possible
- Celebrate completed sessions

**Benefits:**
- Improved focus and productivity
- Reduced mental fatigue
- Better time awareness
- Manageable study chunks
- Built-in rest periods`,
    duration: 25,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Active Recall Master Guide",
    description: "Learn the most effective study method: actively retrieving information from memory instead of passive reading.",
    type: "guide",
    category: "study-techniques",
    content: `**Active Recall: The Science-Backed Study Method**

**What is Active Recall?**
Actively retrieving information from memory without looking at notes or textbooks. Studies show it's 2-3x more effective than passive reviewing.

**Core Techniques:**

**1. Flashcards (Digital or Physical)**
- Write question on one side, answer on other
- Review regularly with spaced intervals
- Focus on cards you get wrong
- Use images and mnemonics

**2. Practice Testing**
- Take practice exams regularly
- Create your own test questions
- Quiz yourself without notes
- Time yourself for realistic practice

**3. Teach-Back Method**
- Explain concepts to a friend or mirror
- Record yourself teaching
- Identify gaps in understanding
- Simplify complex topics

**4. Question Generation**
- Create questions while reading
- Transform notes into questions
- Use different question types
- Practice answering without looking

**Implementation Strategy:**
- Read material once
- Close book and write what you remember
- Check for accuracy
- Focus on missed information
- Repeat process

**Common Mistakes to Avoid:**
- Reading notes repeatedly
- Highlighting without testing
- Studying passively
- Avoiding difficult material
- Not spacing out practice

**Benefits:**
- Stronger memory consolidation
- Better exam performance
- Improved critical thinking
- Faster learning retention`,
    duration: 15,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Spaced Repetition Scheduler",
    description: "Optimize your memory retention with scientifically-timed review sessions for maximum learning efficiency.",
    type: "tool",
    category: "study-techniques",
    content: `**Spaced Repetition System:**

**The Science:**
Review information at increasing intervals to maximize long-term retention. Based on the forgetting curve research.

**Review Schedule:**
- **Day 1:** Learn new material
- **Day 2:** First review
- **Day 4:** Second review
- **Day 7:** Third review
- **Day 14:** Fourth review
- **Day 30:** Fifth review
- **Day 60:** Final review

**Digital Tools Integration:**
- Anki flashcard app
- Quizlet spaced repetition
- Custom spreadsheet tracker
- Mobile reminder apps

**Subject-Specific Application:**

**Languages:**
- Vocabulary cards
- Grammar rules
- Phrase patterns
- Pronunciation guides

**Sciences:**
- Formula memorization
- Concept relationships
- Problem-solving steps
- Terminology definitions

**History/Literature:**
- Date memorization
- Character analysis
- Timeline events
- Quote attribution

**Implementation Tips:**
- Start with small batches (10-20 items)
- Increase difficulty gradually
- Track success rates
- Adjust intervals based on performance
- Combine with active recall

**Tracking Your Progress:**
- Success rate per session
- Items mastered
- Time spent reviewing
- Difficulty adjustments needed`,
    duration: 30,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Cornell Note-Taking System",
    description: "Master the Cornell method for organized, effective note-taking that improves comprehension and review.",
    type: "guide",
    category: "study-techniques",
    content: `**Cornell Note-Taking System:**

**Page Setup:**
1. Draw vertical line 2.5" from left margin
2. Draw horizontal line 2" from bottom
3. Create three sections: Notes, Cues, Summary

**During Class/Reading:**

**Note-Taking Section (Right):**
- Write main ideas and details
- Use bullet points and short phrases
- Skip lines between topics
- Don't worry about perfect formatting
- Focus on key concepts

**After Class/Reading:**

**Cue Section (Left):**
- Write questions about notes
- Add keywords and formulas
- Create memory triggers
- Note important dates/names
- Develop study prompts

**Summary Section (Bottom):**
- Write 2-3 sentence summary
- Capture main themes
- Connect to previous learning
- Note personal insights
- Identify areas needing review

**Review Process:**
1. Cover right section with paper
2. Use cues to test recall
3. Check your answers
4. Focus on missed information
5. Review summary for big picture

**Digital Adaptations:**
- Use tablet with note-taking app
- Create templates in Word/Google Docs
- Use OneNote section formatting
- Try specialized apps like Notion

**Benefits:**
- Organized information storage
- Built-in review system
- Active engagement with material
- Easy identification of gaps
- Improved exam preparation

**Subject Modifications:**
- Math: Add formula section
- Science: Include diagrams area
- Literature: Add quote collection
- History: Timeline integration`,
    duration: 20,
    language: "en",
    isOfflineAvailable: true
  },

  // MINDFULNESS
  {
    title: "5-Minute Daily Meditation Guide",
    description: "Simple mindfulness meditation practice perfect for busy students to reduce stress and improve focus.",
    type: "guide",
    category: "mindfulness",
    content: `**5-Minute Daily Meditation:**

**Setup (30 seconds):**
- Sit comfortably with straight back
- Close eyes or soften gaze
- Place hands on knees or lap
- Take three deep breaths

**Breathing Focus (4 minutes):**
1. Focus on natural breath rhythm
2. When mind wanders, gently return to breath
3. Don't judge wandering thoughts
4. Notice breathing sensations
5. Count breaths if helpful (1-10, repeat)

**Closing (30 seconds):**
- Slowly wiggle fingers and toes
- Take three deeper breaths
- Open eyes gradually
- Set intention for the day

**Timing Options:**
- **Morning:** Energy and focus for the day
- **Between classes:** Reset and recharge
- **Before studying:** Improve concentration
- **Evening:** Release stress and tension

**Common Challenges:**
- **"I can't stop thinking"** - Normal! Just return to breath
- **"I don't have time"** - Start with 2 minutes
- **"I keep forgetting"** - Set phone reminder
- **"I feel restless"** - Try walking meditation

**Benefits for Students:**
- Improved focus and concentration
- Reduced anxiety and stress
- Better emotional regulation
- Enhanced memory retention
- Increased self-awareness

**Advanced Techniques:**
- Body scan meditation
- Loving-kindness practice
- Mindful breathing variations
- Visualization exercises`,
    duration: 5,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Gratitude Journal Templates",
    description: "Structured prompts for daily gratitude practice to boost mood, resilience, and overall well-being.",
    type: "activity",
    category: "mindfulness",
    content: `**Daily Gratitude Practice:**

**Morning Gratitude (3 minutes):**
1. Three things I'm grateful for today:
   - Something small and simple
   - Something about myself
   - Something about my relationships

2. Why am I grateful for each?
3. How can I show appreciation today?

**Evening Reflection (5 minutes):**
1. What went well today?
2. Who made a positive impact on me?
3. What challenge taught me something?
4. What moment brought me joy?
5. How did I make someone else's day better?

**Weekly Deep Dive (10 minutes):**
- Growth I've experienced this week
- Unexpected positive moments
- Support I've received from others
- Progress toward my goals
- Lessons learned from difficulties

**Creative Gratitude Formats:**

**Letter Writing:**
- Write thank-you note to someone special
- Express specific appreciation
- Share how they've impacted you
- Deliver or send the letter

**Photo Gratitude:**
- Take photo of something you appreciate
- Write brief explanation
- Create weekly gratitude album
- Share with friends/family

**Gratitude Jar:**
- Write daily appreciation note
- Fold and place in jar
- Read all notes monthly
- Share favorites with loved ones

**Benefits:**
- Improved mood and optimism
- Better sleep quality
- Stronger relationships
- Increased resilience
- Enhanced life satisfaction`,
    duration: 5,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Mindful Breathing Exercises",
    description: "Collection of simple breathing techniques to center yourself and reduce anxiety in any situation.",
    type: "guide",
    category: "mindfulness",
    content: `**Essential Breathing Techniques:**

**1. Box Breathing (4-4-4-4)**
- Inhale for 4 counts
- Hold for 4 counts
- Exhale for 4 counts
- Hold empty for 4 counts
- **Use for:** Anxiety, pre-exam nerves

**2. Triangle Breathing (4-4-4)**
- Inhale for 4 counts
- Hold for 4 counts
- Exhale for 4 counts
- **Use for:** Quick calming, between classes

**3. Extended Exhale (4-6)**
- Inhale for 4 counts
- Exhale for 6 counts
- **Use for:** Stress relief, bedtime

**4. Belly Breathing**
- Hand on chest, hand on belly
- Breathe so only belly hand moves
- Deep, slow breaths
- **Use for:** Deep relaxation, meditation

**5. Alternate Nostril Breathing**
- Use thumb to close right nostril
- Inhale through left nostril
- Close left nostril with ring finger
- Release thumb, exhale through right
- Inhale through right, switch, exhale left
- **Use for:** Mental balance, focus

**Quick Reference Guide:**

**Feeling Anxious?** → 4-7-8 Breathing
**Need Energy?** → Bellows Breath (rapid)
**Can't Focus?** → Box Breathing
**Overwhelmed?** → Extended Exhale
**Before Sleep?** → Belly Breathing

**Practice Tips:**
- Start with 5-10 breaths
- Practice daily for best results
- Use anywhere, anytime
- Don't force the breath
- Find your natural rhythm`,
    duration: 10,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Grounding Techniques for Anxiety",
    description: "Practical exercises to reconnect with the present moment when feeling overwhelmed or anxious.",
    type: "guide",
    category: "mindfulness",
    content: `**5-4-3-2-1 Grounding Technique:**

When feeling anxious or overwhelmed:

**5 - Things you can SEE:**
- Look around your environment
- Name 5 specific objects
- Notice colors, shapes, textures
- Focus on details

**4 - Things you can TOUCH:**
- Feel different textures
- Notice temperature
- Touch your clothes, a wall, your skin
- Press your feet into the ground

**3 - Things you can HEAR:**
- Background noises
- Distant sounds
- Your own breathing
- Immediate environment sounds

**2 - Things you can SMELL:**
- Air freshener or natural scents
- Food or drink nearby
- Your clothes or skin
- The room's general smell

**1 - Thing you can TASTE:**
- Current taste in mouth
- Sip of water or tea
- Gum or mint
- Notice any aftertaste

**Additional Grounding Techniques:**

**Physical Grounding:**
- Hold an ice cube
- Splash cold water on face
- Do jumping jacks
- Progressive muscle relaxation

**Mental Grounding:**
- Count backwards from 100 by 7s
- Name animals A-Z
- Describe your day in detail
- Plan your ideal vacation

**Emotional Grounding:**
- Say your name and age out loud
- Think of three people who care about you
- Recall a happy memory
- Repeat calming affirmations

**Benefits:**
- Breaks anxiety spiral
- Returns focus to present
- Provides immediate relief
- Easy to use anywhere`,
    duration: 5,
    language: "en",
    isOfflineAvailable: true
  },

  // SOCIAL CONFIDENCE
  {
    title: "Conversation Starter Templates",
    description: "Ready-to-use conversation starters for different social situations to help build confidence.",
    type: "guide",
    category: "social-confidence",
    content: `**Conversation Starters by Situation:**

**In Class/Academic Settings:**
- "What did you think about today's lecture?"
- "Have you started the assignment yet?"
- "Are you planning to attend the study group?"
- "Do you have any tips for this professor's exams?"
- "What's your major? What made you choose it?"

**Cafeteria/Dining:**
- "Is this seat taken?"
- "How's the food here today?"
- "Have you tried the [specific dish]?"
- "Busy day? You look like you need coffee too."

**Campus Events:**
- "Have you been to one of these events before?"
- "What brings you here tonight?"
- "Do you know what time this starts?"
- "Are you involved in [related activity]?"

**Study Spaces:**
- "Mind if I sit here?"
- "Taking the same class?"
- "Good study spot, isn't it?"
- "How long have you been here?"

**Follow-up Questions:**
- "Tell me more about that"
- "How did you get into that?"
- "What's that like?"
- "That sounds interesting"
- "What do you enjoy most about it?"

**Exit Strategies:**
- "I need to get to class, but it was nice talking!"
- "I should get back to studying. See you around!"
- "I'm meeting friends, but maybe we'll chat again soon!"

**Body Language Tips:**
- Make eye contact (not staring)
- Smile genuinely
- Keep open posture
- Mirror their energy level
- Nod to show engagement

**Confidence Boosters:**
- Remember: most people like talking about themselves
- Focus on being interested, not interesting
- It's okay if conversations are brief
- Practice makes it easier`,
    duration: 15,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Public Speaking Confidence Builder",
    description: "Step-by-step guide to overcome speaking anxiety and deliver confident presentations.",
    type: "guide",
    category: "social-confidence",
    content: `**Public Speaking Mastery:**

**Pre-Presentation Preparation:**

**Content Preparation:**
- Know your material inside out
- Create clear outline with main points
- Practice 3-5 times out loud
- Prepare for likely questions
- Have backup plans for tech issues

**Physical Preparation:**
- Practice power poses for 2 minutes
- Do breathing exercises
- Warm up your voice
- Dress confidently
- Arrive early to test equipment

**Mental Preparation:**
- Visualize successful presentation
- Focus on helping the audience
- Reframe nerves as excitement
- Remember: audience wants you to succeed

**During Presentation:**

**Opening Strong:**
- Start with confident posture
- Make eye contact with friendly faces
- Use opening line you've practiced
- Smile genuinely

**Managing Anxiety:**
- Focus on your message, not yourself
- Use pauses effectively
- If you make a mistake, keep going
- Remember to breathe

**Engagement Techniques:**
- Ask rhetorical questions
- Use "you" language
- Share relevant stories
- Make eye contact across the room

**Closing Powerfully:**
- Summarize key points
- End with clear call to action
- Thank audience sincerely
- Stay confident for questions

**Recovery Strategies:**
- If you lose your place, pause and breathe
- Say "Let me rephrase that" if needed
- Use notes as backup, not crutch
- Remember: minor mistakes are rarely noticed

**Practice Progression:**
1. Record yourself speaking
2. Present to mirror
3. Practice with one friend
4. Small group presentation
5. Larger audience

**Confidence Mantras:**
- "I have valuable information to share"
- "The audience is here to learn, not judge"
- "I am prepared and capable"`,
    duration: 20,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Social Anxiety Reduction Activities",
    description: "Practical exercises and challenges to gradually build social confidence in low-pressure situations.",
    type: "activity",
    category: "social-confidence",
    content: `**Social Confidence Building Challenges:**

**Week 1: Foundation Building**

**Day 1-2: Observation**
- Sit in a public space for 15 minutes
- Observe social interactions around you
- Notice body language and conversation flow
- No interaction required - just observe

**Day 3-4: Micro-Interactions**
- Make eye contact and smile at 3 people
- Say "thank you" with genuine warmth
- Hold doors open for others
- Practice good posture while walking

**Day 5-7: Basic Exchanges**
- Ask for directions (even if you know the way)
- Compliment someone genuinely
- Ask "How's your day?" to cashier/staff
- Say "excuse me" politely in crowds

**Week 2: Expanding Comfort Zone**

**Day 1-3: Campus Interactions**
- Ask classmate about assignment
- Sit near new people in cafeteria
- Join a study group or club meeting
- Participate once in class discussion

**Day 4-7: Deeper Conversations**
- Ask follow-up questions in conversations
- Share one personal opinion or experience
- Invite someone to grab coffee
- Attend one social event

**Week 3: Building Relationships**

**Practice Daily:**
- Initiate one conversation per day
- Remember and use people's names
- Suggest activities or meetups
- Be vulnerable about something small

**Confidence Tracking:**
Rate your comfort level 1-10 before and after each challenge:
- Initial anxiety level
- Actual outcome vs. feared outcome
- What went better than expected
- What you learned about yourself

**Backup Strategies:**
- Have conversation topics ready
- Practice deep breathing before interactions
- Use open-ended questions
- Focus on being curious about others

**Reward System:**
- Complete week 1: treat yourself to something special
- Complete week 2: share success with someone
- Complete week 3: plan a social celebration`,
    duration: 30,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Empathy and Active Listening Skills",
    description: "Develop deeper connections through improved listening skills and emotional intelligence.",
    type: "guide",
    category: "social-confidence",
    content: `**Active Listening Mastery:**

**Core Listening Skills:**

**Physical Presence:**
- Face the speaker
- Maintain appropriate eye contact
- Open, relaxed posture
- Minimal distracting movements
- Put away devices

**Verbal Responses:**
- "I see"
- "That makes sense"
- "Tell me more about that"
- "How did that feel?"
- "What was that like for you?"

**Reflection Techniques:**
- **Paraphrasing:** "So what you're saying is..."
- **Emotion labeling:** "It sounds like you felt frustrated"
- **Summarizing:** "Let me make sure I understand..."
- **Clarifying:** "When you say X, do you mean..."

**Empathy Building:**

**Perspective Taking:**
- Try to see their viewpoint
- Consider their background/context
- Imagine how you'd feel in their situation
- Ask yourself: "What might they need right now?"

**Emotional Validation:**
- Acknowledge their feelings
- Avoid immediately trying to "fix" problems
- Use phrases like "That sounds really difficult"
- Don't minimize their experience

**Questions for Deeper Connection:**
- "What's been the best part of your day?"
- "What's something you're excited about?"
- "What's been challenging lately?"
- "What matters most to you right now?"
- "How are you really doing?"

**Common Listening Mistakes:**
- Planning your response while they speak
- Jumping to solutions too quickly
- Making it about your similar experience
- Judging or giving unsolicited advice
- Getting distracted by your phone

**Practice Exercises:**
- Listen to podcast and summarize main points
- Practice with friends in low-stakes conversations
- Record yourself in practice conversations
- Ask for feedback on your listening skills

**Benefits:**
- Deeper, more meaningful relationships
- Increased trust and connection
- Better conflict resolution
- Enhanced emotional intelligence
- Improved teamwork and collaboration`,
    duration: 18,
    language: "en",
    isOfflineAvailable: true
  },

  // CAREER GUIDANCE
  {
    title: "Resume and Cover Letter Templates",
    description: "Professional templates and guides for creating compelling resumes and cover letters that get results.",
    type: "tool",
    category: "career-guidance",
    content: `**Student Resume Template:**

**Header:**
[Your Name]
[Phone] | [Email] | [LinkedIn] | [City, State]

**Professional Summary (2-3 lines):**
"Motivated [major] student with experience in [relevant skills]. Seeking to leverage [specific strengths] in [target role/industry]."

**Education:**
[University Name], [City, State]
Bachelor of [Degree], Expected [Month Year]
GPA: [if 3.5+] | Relevant Coursework: [3-4 relevant classes]

**Experience:**
[Job Title] | [Company] | [Dates]
• Achieved [specific result] by [action taken]
• Managed/Led [responsibility] resulting in [outcome]
• Developed [skill] through [activity]

**Projects:**
[Project Name] | [Date]
• Brief description of project and your role
• Technologies/methods used
• Results or outcomes achieved

**Skills:**
Technical: [Software, programming languages, tools]
Languages: [Languages and proficiency levels]
Certifications: [Any relevant certifications]

**Cover Letter Template:**

**Paragraph 1:** Hook and purpose
"I'm writing to express my interest in [position] at [company]. As a [year] [major] student with experience in [relevant area], I'm excited about [specific reason related to company/role]."

**Paragraph 2:** Your value proposition
"Through my experience as [role/project], I developed [relevant skills]. For example, [specific achievement with numbers/results]. This experience taught me [transferable skill relevant to target role]."

**Paragraph 3:** Company knowledge and fit
"I'm particularly drawn to [company] because [specific reason based on research]. Your focus on [company value/initiative] aligns with my passion for [related interest]."

**Paragraph 4:** Call to action
"I'd welcome the opportunity to discuss how my [key strengths] can contribute to [team/department]. Thank you for your consideration."

**Action Items:**
- Tailor each application to specific role
- Use keywords from job description
- Quantify achievements when possible
- Proofread multiple times
- Save as PDF before sending`,
    duration: 30,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Career Exploration Assessment",
    description: "Interactive quiz to help identify your interests, values, and potential career paths that align with your goals.",
    type: "tool",
    category: "career-guidance",
    content: `**Career Exploration Questionnaire:**

**Part 1: Interest Assessment**

Rate each activity 1-5 (1=dislike, 5=love):
- Analyzing data and solving problems
- Creating and designing things
- Helping and teaching others
- Leading teams and projects
- Working with technology
- Writing and communicating
- Working outdoors or with hands
- Research and investigation

**Part 2: Values Assessment**

Rank importance (1=most important, 8=least important):
- High salary potential
- Work-life balance
- Job security and stability
- Opportunities for advancement
- Making a positive impact
- Creative expression
- Independence and autonomy
- Recognition and prestige

**Part 3: Skills Assessment**

Rate your current strength (1-5):
- Public speaking and presentation
- Mathematical and analytical thinking
- Creative problem-solving
- Written communication
- Leadership and team management
- Technical and computer skills
- Interpersonal and social skills
- Organization and planning

**Part 4: Work Environment Preferences**

Choose your preferred options:
- Office vs. Remote vs. Varied locations
- Large corporation vs. Small company vs. Startup
- Structured routine vs. Flexible schedule
- Independent work vs. Team collaboration
- Fast-paced vs. Steady pace
- High pressure vs. Low stress

**Career Path Suggestions:**

**High analytical + tech skills:** Data Science, Engineering, Finance
**Creative + communication:** Marketing, Design, Journalism
**Helping others + interpersonal:** Counseling, Teaching, Healthcare
**Leadership + business:** Management, Entrepreneurship, Consulting

**Next Steps:**
1. Research 2-3 careers that match your profile
2. Conduct informational interviews
3. Seek relevant internships or projects
4. Join professional associations
5. Develop targeted skills through courses`,
    duration: 25,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Interview Preparation Toolkit",
    description: "Complete guide with common questions, STAR method examples, and confidence-building strategies.",
    type: "guide",
    category: "career-guidance",
    content: `**Interview Preparation Masterclass:**

**STAR Method Framework:**
**Situation:** Set the context
**Task:** Describe your responsibility
**Action:** Explain what you did
**Result:** Share the outcome

**Common Questions + STAR Examples:**

**"Tell me about yourself"**
Structure: Current situation → Relevant experience → Future goals
Example: "I'm a junior marketing student passionate about digital strategy. Through my internship at [company], I increased social media engagement by 40%. I'm seeking opportunities to apply these skills in a dynamic marketing role."

**"Describe a challenge you overcame"**
Situation: Group project with conflicting schedules
Task: Needed to coordinate 5 team members
Action: Created shared calendar and weekly check-ins
Result: Delivered project on time with 95% grade

**"Why do you want this position?"**
Research-based response connecting:
- Your interests and skills
- Company values and mission
- Specific role responsibilities
- Career growth opportunities

**"What are your strengths?"**
Choose 2-3 relevant strengths with examples:
- Problem-solving (with specific example)
- Communication skills (quantified result)
- Adaptability (situation where you learned quickly)

**"What's your greatest weakness?"**
Pick real weakness + improvement strategy:
"I used to struggle with public speaking, so I joined Toastmasters and now regularly present to groups of 20+."

**Pre-Interview Preparation:**

**Research Checklist:**
- Company mission, values, recent news
- Role requirements and qualifications
- Interviewer's background (LinkedIn)
- Company culture and work environment
- Competitors and industry trends

**Questions to Ask Them:**
- "What does success look like in this role?"
- "What are the biggest challenges facing the team?"
- "How would you describe the company culture?"
- "What opportunities for growth exist?"
- "What do you enjoy most about working here?"

**Day-of Success:**
- Arrive 10-15 minutes early
- Bring multiple copies of resume
- Prepare thoughtful questions
- Practice confident handshake
- Send thank-you email within 24 hours`,
    duration: 35,
    language: "en",
    isOfflineAvailable: true
  },
  {
    title: "Skill Development Roadmaps",
    description: "Structured learning paths for in-demand skills including tech, communication, and leadership abilities.",
    type: "guide",
    category: "career-guidance",
    content: `**Skill Development Roadmaps:**

**Digital Marketing Roadmap (6 months):**

**Month 1-2: Foundations**
- Google Analytics certification
- Social media platform basics
- Content creation fundamentals
- Email marketing principles

**Month 3-4: Advanced Techniques**
- SEO and keyword research
- Paid advertising (Google Ads, Facebook)
- Data analysis and reporting
- Marketing automation tools

**Month 5-6: Specialization**
- Choose focus area (content, analytics, ads)
- Build portfolio of campaigns
- Network with marketing professionals
- Apply for internships or freelance work

**Data Analysis Roadmap (8 months):**

**Month 1-2: Excel Mastery**
- Advanced formulas and functions
- Pivot tables and data visualization
- Statistical analysis basics
- Dashboard creation

**Month 3-4: Programming Introduction**
- Python or R fundamentals
- Data manipulation libraries
- Basic statistical concepts
- Data cleaning techniques

**Month 5-6: Visualization and Tools**
- Tableau or PowerBI
- Advanced data visualization
- Database basics (SQL)
- Statistical software

**Month 7-8: Portfolio Development**
- Complete 2-3 analysis projects
- GitHub portfolio creation
- Kaggle competition participation
- Networking and job applications

**Leadership Development Roadmap (ongoing):**

**Foundational Skills (3 months):**
- Communication and active listening
- Emotional intelligence development
- Conflict resolution techniques
- Team collaboration skills

**Intermediate Skills (6 months):**
- Project management basics
- Delegation and feedback skills
- Decision-making frameworks
- Public speaking and presentation

**Advanced Skills (12 months):**
- Strategic thinking and planning
- Change management
- Mentoring and coaching
- Organizational behavior

**Learning Resources:**

**Free Options:**
- Coursera financial aid courses
- YouTube educational channels
- LinkedIn Learning (free trial)
- Khan Academy skill courses
- Library book checkouts

**Paid Options:**
- Udemy skill-specific courses
- Professional certifications
- Online bootcamps
- Industry conferences
- Professional association memberships

**Progress Tracking:**
- Weekly learning hours goal
- Monthly skill assessment
- Project completion milestones
- Networking connection targets
- Job application metrics`,
    duration: 40,
    language: "en",
    isOfflineAvailable: true
  }
];

// Function to seed the database with wellness resources
export async function seedWellnessResources() {
  try {
    console.log("Starting to seed wellness resources...");
    
    // Create resources in bulk
    const results = await storage.createResourcesBulk(wellnessResources);
    
    console.log(`Successfully created ${results.length} wellness resources`);
    
    // Log summary by category
    const categoryCount = wellnessResources.reduce((acc, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("Resources created by category:");
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} resources`);
    });
    
    return results;
  } catch (error) {
    console.error("Error seeding wellness resources:", error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedWellnessResources()
    .then(() => {
      console.log("Seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}