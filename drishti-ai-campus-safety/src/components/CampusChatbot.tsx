import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  MapPin,
  Bot,
  User,
  Compass,
  PhoneCall,
  Clock,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { SSIPMT_BUILDINGS, SSIPMT_CAMPUS_INFO } from '../data/ssipmtCampusKnowledge';
import { soundManager } from '../utils/audioAlert';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickActions?: { label: string; query: string }[];
  buildingHighlight?: string;
}

interface CampusChatbotProps {
  onSelectBuilding?: (buildingId: string) => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function CampusChatbot({
  onSelectBuilding,
  isOpen: externalIsOpen,
  onOpen: externalOnOpen,
  onClose: externalOnClose,
}: CampusChatbotProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleOpen = () => {
    if (externalOnOpen) {
      externalOnOpen();
    } else {
      setInternalIsOpen(true);
    }
  };

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hey there! 👋 I'm your **SSIPMT Campus Assistant**.\n\nYou can talk to me just like a friend or campus senior! Feel free to ask me anything—whether it's **finding classrooms and labs**, **checking canteen food timings**, **emergency contacts**, or **management queries** about our 128 CCTV cameras.\n\nWhat's on your mind?`,
      timestamp: 'Just now',
      quickActions: [
        { label: '📍 Directions to Exam Cell', query: 'How do I reach the Examination Cell?' },
        { label: '🍔 Where is Canteen?', query: 'Where is the canteen and what are the timings?' },
        { label: '🔬 AICTE IDEA Lab', query: 'Where is the AICTE IDEA Lab?' },
        { label: '🚨 Emergency Contacts', query: 'What are the campus emergency numbers?' },
        { label: '📹 Live Camera Status', query: 'What is the CCTV camera status?' },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Conversational Natural AI Response Engine
  const generateConversationalAnswer = (userQuery: string): { text: string; buildingId?: string; actions?: { label: string; query: string }[] } => {
    const raw = userQuery.trim();
    const q = raw.toLowerCase();

    // 1. Natural Human Greetings
    if (/^(hi|hello|hey|heyy|namaste|hlo|hola|sup|good morning|good afternoon|good evening|yo)\b/i.test(q) || q === 'hi' || q === 'hello') {
      const greetings = [
        "Hey! Great to meet you! How's your day going at SSIPMT? Are you looking for a specific building, classroom, or just browsing around?",
        "Hello there! Welcome to SSIPMT Raipur. I'm here to help you navigate the campus or answer any questions about facilities, timings, or safety. What can I do for you?",
        "Hey! 👋 Good to see you. Whether you need directions to the Exam Cell, want to know what's cooking at the Canteen, or have a safety inquiry, just let me know!",
        "Namaste! 🙏 Welcome to Shri Shankaracharya Institute (SSIPMT). How can I assist you on campus today?"
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      return {
        text: randomGreeting,
        actions: [
          { label: '📍 Show Campus Map', query: 'How is the campus laid out?' },
          { label: '🍔 Canteen Timings', query: 'Where is the canteen and what are the timings?' },
          { label: '📚 Central Library', query: 'Tell me about the Central Library' },
        ]
      };
    }

    // 2. Personal & Small Talk ("How are you?", "Who are you?", "Who made you?")
    if (q.includes('how are you') || q.includes('how r u') || q.includes("how's it going")) {
      return {
        text: "I'm doing fantastic, thank you for asking! 😊 Everything is running smoothly across the SSIPMT network right now—128 cameras are online and the campus is calm. How are you doing today?",
        actions: [
          { label: '📍 Directions to Exam Cell', query: 'How do I reach the Examination Cell?' },
          { label: '🍔 Where is Canteen?', query: 'Where is the canteen?' }
        ]
      };
    }

    if (q.includes('who are you') || q.includes('what are you') || q.includes('your name') || q.includes('what can you do')) {
      return {
        text: "I'm the **Drishti AI Campus Assistant** for SSIPMT Raipur! 🏛️\n\nThink of me as your personal digital guide on campus. I can:\n• Give you exact walking directions from the Main Gate to any lab, office, or hostel\n• Tell you about college schedules, library hours, and canteen menu timings\n• Connect you with campus authorities and emergency numbers\n• Provide real-time surveillance insights to faculty and management\n\nFeel free to ask me anything in plain English!",
        actions: [
          { label: '📍 Guide me to Central Library', query: 'Where is the Central Library?' },
          { label: '🔬 AICTE IDEA Lab', query: 'Where is the AICTE IDEA Lab?' }
        ]
      };
    }

    if (q.includes('who made you') || q.includes('who created you') || q.includes('developer')) {
      return {
        text: "I was built for **Drishti AI**, an intelligent edge-vision campus surveillance and spatial twin platform custom tailored for **SSIPMT Raipur (Mujgahan)**. My mission is keeping our students safe, informed, and never lost!",
      };
    }

    if (q.includes('thank') || q.includes('thx') || q.includes('awesome') || q.includes('great job') || q.includes('cool')) {
      return {
        text: "You're most welcome! 😊 Always happy to help. Let me know if you need directions to anywhere else, or have fun exploring the campus!",
      };
    }

    if (q.includes('joke') || q.includes('funny')) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛 Speaking of which, our AI vision models are bug-free today!",
        "Why did the engineering student cross the campus lawn? To get to the canteen before the hot samosas ran out! 🥟",
        "There are 10 types of people in Raipur: those who understand binary, and those who don't! 😄"
      ];
      return {
        text: jokes[Math.floor(Math.random() * jokes.length)],
      };
    }

    // 3. Campus Overview / "How is the campus laid out?"
    if (q.includes('campus laid out') || q.includes('about ssipmt') || q.includes('tell me about campus') || q.includes('campus overview')) {
      return {
        text: `🏛️ **SSIPMT Raipur Campus Overview**:\n\nOur campus spans over 30 peaceful acres in Mujgahan, Raipur. Here's the layout from South to North:\n\n1. **Entrance**: Main Gate & Security Checkpoint on Old Dhamtari Road with shaded student/faculty parking.\n2. **Center**: Central Palm Boulevard leading to the Shree Shankaracharya Ji Statue Plaza.\n3. **Front Complex**: Grand Administrative Block (Principal Office, Admissions, Accounts, Exam Cell).\n4. **Academic Wings**: Wing A (CSE, IT, AI & IDEA Lab) on the East, Wing B (Mech, Civil, EE) on the West.\n5. **Center-West**: Central Library and modern student Canteen facing the open lawns.\n6. **Rear & Flanks**: Heavy Engineering Workshop sheds, sports cricket ground, and residential hostels (Boys & Girls).\n\nWould you like directions to any specific building?`,
        actions: [
          { label: '📍 Directions to Exam Cell', query: 'How do I reach the Examination Cell?' },
          { label: '🔬 AICTE IDEA Lab', query: 'Where is the AICTE IDEA Lab?' },
          { label: '🏠 Hostels Info', query: 'Tell me about the campus hostels' }
        ]
      };
    }

    // 4. Examination Cell & Administrative Block
    if (q.includes('exam') || q.includes('principal') || q.includes('admin') || q.includes('admission') || q.includes('tpo') || q.includes('registrar') || q.includes('fees') || q.includes('marksheet')) {
      const b = SSIPMT_BUILDINGS.admin;
      return {
        text: `Sure thing! Here's how to reach the **${b.name}**:\n\n📍 **Walking Directions**:\n${b.directionsFromMainGate}\n\n🏢 **Room Guide Inside**:\n• **Central Examination Cell**: 1st Floor, Room 204 (Right staircase)\n• **Principal's Office**: Ground Floor, Room 102 (Right off the reception lobby)\n• **Training & Placement Cell (TPO)**: 2nd Floor, Room 301\n• **Student Section & Accounts**: Ground Floor Counter Area\n\n⏰ **Office Hours**: 9:00 AM to 5:00 PM (Monday – Saturday)\n• **Security**: Monitored by CAM-006 and CAM-008.`,
        buildingId: 'admin',
        actions: [
          { label: '🗺️ Locate on 3D Model', query: 'Highlight Administrative Block' },
          { label: '📚 How to reach Library?', query: 'How do I reach the Central Library?' },
        ],
      };
    }

    // 5. Canteen & Cafeteria
    if (q.includes('canteen') || q.includes('food') || q.includes('lunch') || q.includes('breakfast') || q.includes('eat') || q.includes('tea') || q.includes('coffee') || q.includes('snack') || q.includes('hungry') || q.includes('samosa') || q.includes('maggi')) {
      const b = SSIPMT_BUILDINGS.canteen;
      return {
        text: `Craving a bite? 🍔 The **${b.name}** is the campus favorite hangout!\n\n📍 **Where to find it**:\n${b.directionsFromMainGate}\n\n⏰ **Hours**: 8:00 AM to 7:00 PM\n\n🍴 **What's Good**:\n• **Breakfast (8 AM - 11 AM)**: Hot poha, samosas, idli sambar, tea & coffee\n• **Lunch (12:30 PM - 2:30 PM)**: Full student thalis (North & South Indian options)\n• **Evening**: Fresh juices, sandwiches, and snacks on the shaded patio terrace.\n\nEverything is clean, subsidized, and supervised!`,
        buildingId: 'canteen',
        actions: [
          { label: '🗺️ Locate Canteen in 3D', query: 'Highlight Canteen' },
          { label: '📚 Library Timings', query: 'What are the library timings?' },
        ],
      };
    }

    // 6. Central Library
    if (q.includes('library') || q.includes('book') || q.includes('reading') || q.includes('quiet') || q.includes('study') || q.includes('wifi') || q.includes('journal')) {
      const b = SSIPMT_BUILDINGS.library;
      return {
        text: `Looking for a quiet place to study? 📚 The **${b.name}** is top notch!\n\n📍 **Directions**:\n${b.directionsFromMainGate}\n\n⏰ **Operating Hours**:\n• Regular days: 8:30 AM to 6:30 PM\n• During Semester Exams: Reading hall remains open till **8:00 PM**\n\n📖 **Highlights**:\n• Over 45,000 engineering & management volumes\n• Air-conditioned silent reading hall (250 seating capacity)\n• Digital E-Library with 50 high-speed internet terminals for IEEE / DELNET papers.\n• Free high-speed student Wi-Fi.`,
        buildingId: 'library',
        actions: [
          { label: '🗺️ Highlight Library in 3D', query: 'Highlight Central Library' },
          { label: '💻 Where is CSE Block?', query: 'Where is the Computer Science department?' }
        ],
      };
    }

    // 7. Computer Science (CSE), IT & AICTE IDEA Lab
    if (q.includes('cse') || q.includes('computer') || q.includes('idea lab') || q.includes('coding') || q.includes('it block') || q.includes('software') || q.includes('3d print') || q.includes('lab')) {
      const b = SSIPMT_BUILDINGS.cse_it_block;
      return {
        text: `💻 **${b.name}** is our flagship computing center!\n\n📍 **How to get there**:\n${b.directionsFromMainGate}\n\n⚡ **What's inside**:\n• **AICTE IDEA Lab** (Ground Floor East): 3D printers, laser engravers, PCB prototyping & robotics stations open for student projects.\n• **Computer Labs (1st - 3rd Floors)**: High-speed GPU workstations, cloud computing setups, and cybersecurity labs.\n• **HOD CSE Office**: 3rd Floor, Room 312.\n\nIt's active and vibrant—just remember to carry your college ID badge!`,
        buildingId: 'cse_it_block',
        actions: [
          { label: '🗺️ Show in 3D Map', query: 'Highlight Academic Wing A' },
          { label: '⚙️ Where are Mechanical Workshops?', query: 'Where are the Mechanical Workshops?' }
        ],
      };
    }

    // 8. Mechanical / Civil / Heavy Workshops
    if (q.includes('workshop') || q.includes('mechanical') || q.includes('civil') || q.includes('lathe') || q.includes('machine') || q.includes('welding') || q.includes('survey')) {
      const b = SSIPMT_BUILDINGS.workshops;
      return {
        text: `⚙️ **${b.name}** & **Academic Wing B** are dedicated to core engineering:\n\n📍 **Directions**:\n${b.directionsFromMainGate}\n\n🔧 **Equipment & Labs**:\n• Heavy lathe machine bay, welding and carpentry bays\n• Fluid mechanics, wind tunnel, and hydraulic turbine setups\n• Universal Testing Machine (UTM) & concrete compressive strength testing\n\n⚠️ **Safety Reminder**: Hard shoes and safety workshop coats are strictly mandatory when handling machinery!`,
        buildingId: 'workshops',
        actions: [
          { label: '🗺️ Locate Workshops in 3D', query: 'Highlight Workshops' },
          { label: '🏠 Tell me about Hostels', query: 'Tell me about the campus hostels' }
        ],
      };
    }

    // 9. Residential Hostels (Boys & Girls)
    if (q.includes('hostel') || q.includes('room') || q.includes('curfew') || q.includes('stay') || q.includes('warden') || q.includes('girls hostel') || q.includes('boys hostel')) {
      const isGirls = q.includes('girl') || q.includes('gargi') || q.includes('women');
      const b = isGirls ? SSIPMT_BUILDINGS.hostel_girls : SSIPMT_BUILDINGS.hostel_boys;
      return {
        text: `🏠 **${b.name}** (${isGirls ? 'Gargi Girls Hostel' : 'Vivekananda Boys Hostel'}):\n\n📍 **Location**:\n${b.directionsFromMainGate}\n\n🔒 **Important Hostel Rules**:\n• **Curfew Time**: 7:30 PM sharp every evening (biometric card log)\n• **Mess Timings**: Breakfast 7:30-8:30 AM, Lunch 12:30-2 PM, Dinner 7:45-9 PM\n• **Security**: Guarded 24/7 with female security personnel at girls hostel and round-the-clock CCTV.\n• In-house medical dispensary with on-call nurse.\n\nNeed to contact the warden? The security desk can reach them immediately!`,
        buildingId: isGirls ? 'hostel_girls' : 'hostel_boys',
        actions: [
          { label: '🚨 Emergency Contact Numbers', query: 'What are the emergency numbers?' },
          { label: '⚽ Sports Ground Info', query: 'Where is the sports ground?' }
        ],
      };
    }

    // 10. Sports & Cricket Grounds
    if (q.includes('sport') || q.includes('cricket') || q.includes('football') || q.includes('ground') || q.includes('gym') || q.includes('basketball') || q.includes('play')) {
      const b = SSIPMT_BUILDINGS.sports_ground;
      return {
        text: `⚽ **${b.name}** is on the eastern flank of the campus:\n\n📍 **Directions**:\n${b.directionsFromMainGate}\n\n🏆 **Available Facilities**:\n• Full-size green cricket ground with turf pitch\n• Football pitch with boundary nets\n• Standard basketball court with evening LED floodlights\n• Volleyball & badminton courts\n• Student fitness gym & indoor sports room\n\n⏰ Open for recreation from 6:00 AM – 8:00 AM & 4:30 PM – 7:00 PM.`,
        buildingId: 'sports_ground',
        actions: [
          { label: '🚗 Where is Parking?', query: 'Where is the parking area?' },
          { label: '🍔 Where is Canteen?', query: 'Where is the canteen?' }
        ],
      };
    }

    // 11. Parking & Gates
    if (q.includes('parking') || q.includes('park') || q.includes('car') || q.includes('bike') || q.includes('scooter') || q.includes('vehicle') || q.includes('bus') || q.includes('gate')) {
      const b = SSIPMT_BUILDINGS.parking;
      return {
        text: `🚗 **${b.name} & Main Entrance**:\n\n📍 **Location**:\n${b.directionsFromMainGate}\n\n🅿️ **Designated Bays**:\n• **Bay A (Left)**: Covered student two-wheeler shed\n• **Bay B (Right)**: Shaded faculty & staff four-wheeler carport\n• **Bay C**: College transit buses fleet\n\n⚠️ **Gate Rules**: Helmets are strictly compulsory for two-wheelers. Speed limit is 15 km/h inside the gate. Monitored by CAM-003 with ANPR plate recognition.`,
        buildingId: 'parking',
        actions: [
          { label: '🚨 Emergency Contacts', query: 'What are the emergency contact numbers?' },
          { label: '📍 Directions to Admin Block', query: 'How do I reach the Administrative Block?' }
        ],
      };
    }

    // 12. Emergency Contacts & Authorities
    if (q.includes('emergency') || q.includes('contact') || q.includes('phone') || q.includes('ambulance') || q.includes('medical') || q.includes('doctor') || q.includes('guard') || q.includes('ragging') || q.includes('police')) {
      return {
        text: `🚨 **SSIPMT Campus Emergency Helpline** (Save these numbers):\n\n• **Security Control Room**: ${SSIPMT_CAMPUS_INFO.emergencyContacts[0].phone} (Internal Ext: 101)\n• **Chief Proctor Office (Discipline)**: ${SSIPMT_CAMPUS_INFO.emergencyContacts[1].phone}\n• **Campus Medical Dispensary & Ambulance**: ${SSIPMT_CAMPUS_INFO.emergencyContacts[2].phone} (Ext: 108)\n• **Women Safety & Anti-Ragging Cell**: ${SSIPMT_CAMPUS_INFO.emergencyContacts[3].phone}\n• **Training & Placement Officer (TPO)**: ${SSIPMT_CAMPUS_INFO.emergencyContacts[4].phone}\n\nAll emergency response alerts are tied into the Drishti AI dispatch system with sub-60s on-site patrol response.`,
        actions: [
          { label: '📹 Live Cameras Status', query: 'What is the current CCTV status?' },
          { label: '📍 Directions to Exam Cell', query: 'Where is the Exam Cell?' }
        ]
      };
    }

    // 13. Camera & Security Telemetry
    if (q.includes('camera') || q.includes('cctv') || q.includes('alert') || q.includes('security') || q.includes('surveillance') || q.includes('fall') || q.includes('crowd') || q.includes('drishti')) {
      return {
        text: `📊 **Drishti AI Surveillance Status for SSIPMT Raipur**:\n\n• **128 Monitored CCTV Endpoints**: 100% active across all buildings and perimeter boundaries.\n• **AI Neural Pipeline**: Real-time YOLOv8 for human/crowd density surges + MediaPipe Pose for sudden fall distress detection.\n• **Current Campus Safety Score**: **94 / 100** (Operational & Nominal).\n• **High-Attention Zones**: Parking Bay (CAM-003) and Hostel A stairwell (CAM-007).\n• **Response Latency**: <15ms edge inference on local hardware.\n\nManagement can download audit reports anytime via the Dashboard!`,
        actions: [
          { label: '🚀 Open Operations Console', query: 'Launch Security Console' },
          { label: '📍 Directions to Parking', query: 'Where is the parking area?' }
        ]
      };
    }

    // 14. Friendly Conversational Fallback for general questions
    return {
      text: `Got it! While I specialize in everything related to **SSIPMT Raipur** (like finding rooms, lab timings, canteen snacks, contacts, and security cameras), I'm happy to chat about anything!\n\nCould you clarify what you'd like to know? You can ask me:\n• *"How do I walk to the Examination Cell or Library?"*\n• *"What are the hostel curfew rules?"*\n• *"Where can I get food on campus right now?"*\n• *"What are the emergency guard contact numbers?"*`,
      actions: [
        { label: '📍 Directions to Exam Cell', query: 'How do I reach the Examination Cell?' },
        { label: '🍔 Canteen Timings', query: 'Where is the canteen?' },
        { label: '📚 Central Library', query: 'Tell me about the Central Library' },
        { label: '🚨 Emergency Contacts', query: 'What are the emergency numbers?' }
      ]
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    soundManager.playAcknowledgePing();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateConversationalAnswer(query);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: response.actions,
        buildingHighlight: response.buildingId,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (response.buildingId && onSelectBuilding) {
        onSelectBuilding(response.buildingId);
      }
    }, 400);
  };

  return (
    <>
      {/* Floating Launcher Button (Compact, never overlaps content) */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-40 btn-brutal w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cream-accent hover:bg-yellow-300 text-black border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Open SSIPMT Campus Assistant & Directions"
          aria-label="Open SSIPMT Campus Guide"
        >
          <div className="relative flex items-center justify-center">
            <span className="text-xl sm:text-2xl select-none">🏛️</span>
            <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black animate-pulse"></span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[440px] h-[580px] max-h-[85vh] bg-cream-50 dark:bg-darkbg-900 border-2 sm:border-3 border-black rounded-2xl sm:rounded-3xl shadow-[8px_8px_0px_#000] flex flex-col overflow-hidden font-mono text-xs select-none animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 bg-cream-accent text-black border-b-2 border-black flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm shadow">
                🤖
              </div>
              <div>
                <h3 className="font-black text-sm leading-tight">SSIPMT Campus Assistant</h3>
                <span className="text-[10px] font-bold text-black/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Online • Campus Guide & Directions
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-xl bg-black text-white hover:bg-slate-800 cursor-pointer"
              title="Close Guide"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Subheader */}
          <div className="px-4 py-2 bg-cream-200 dark:bg-darkbg-850 text-black dark:text-slate-300 border-b border-black/20 flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              Mujgahan, Raipur • 128 CCTVs Active
            </span>
            <span className="text-emerald-700 dark:text-emerald-400">NAAC A</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-slate-800 dark:text-slate-200">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} space-y-1`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl border-2 border-black text-xs font-medium leading-relaxed shadow-[2px_2px_0px_#000] ${
                      isBot
                        ? 'bg-white dark:bg-darkbg-800 text-black dark:text-white rounded-tl-sm'
                        : 'bg-cream-accent text-black rounded-tr-sm font-bold'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Interactive 3D Building Jump Button */}
                    {msg.buildingHighlight && (
                      <div className="pt-2.5 mt-2 border-t border-black/15">
                        <button
                          onClick={() => {
                            if (onSelectBuilding && msg.buildingHighlight) {
                              onSelectBuilding(msg.buildingHighlight);
                              const mapEl = document.getElementById('section-twin-3d');
                              if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="w-full py-1.5 px-3 rounded-xl bg-black text-cream-accent text-[11px] font-black flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800"
                        >
                          <MapPin className="w-3.5 h-3.5 text-cream-accent" />
                          <span>Locate & Highlight on 3D Campus Model</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 font-bold px-1">
                    {msg.timestamp}
                  </span>

                  {/* Quick Action Chips if present */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-w-[92%]">
                      {msg.quickActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(act.query)}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-darkbg-800 hover:bg-cream-200 dark:hover:bg-darkbg-700 text-black dark:text-slate-200 border border-black text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-cream-accent border border-black animate-bounce"></span>
                <span>Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-darkbg-850 border-t-2 border-black flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything: directions, timings, contacts..."
              className="flex-1 bg-cream-100 dark:bg-darkbg-750 border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black dark:text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-brutal px-4 py-2.5 rounded-xl bg-cream-accent text-black font-black border-2 border-black disabled:opacity-40 cursor-pointer flex items-center justify-center shadow-[2px_2px_0px_#000]"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
