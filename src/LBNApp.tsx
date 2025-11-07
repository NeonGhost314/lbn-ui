import React, { useState, useEffect, useRef } from "react";
import {
    Calendar,
    Users,
    User,
    BookOpen,
    BarChart3,
    Settings,
    Bell,
    Search,
    Filter,
    Plus,
    Download,
    Mail,
    Clock,
    MapPin,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Menu,
    X,
    Eye,
    EyeOff,
    Printer,
    Trash2,
    ChevronDown,
    Building2,
    UserCog,
    Palette,
    Lock,
    MessageSquare,
    DoorOpen,
    Wifi,
    Monitor,
    Wind,
    Activity,
    Target,
    TrendingDown,
    PieChart,
    BarChart,
    Send,
    Upload,
    ChevronRight,
    ChevronLeft,
    Ban,
    FileText,
    LogIn,
    Globe,
    Home,
    Phone,
    MapPin as MapPinIcon,
    Info,
    Shield,
    ExternalLink,
    Check,
    Copy,
} from "lucide-react";

const LBNApp = () => {
    type Day = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi" | "Dimanche";
    type RoomFilter = "all" | "occupied" | "free";

    interface Course {
        time: string;
        room: string;
        tutor: string;
        students: number;
        subject: string;
        color: string;
        groupId?: number;
        studentNames?: string[];
        attendance?: Record<string, boolean>;
    }

    interface TimeSlot {
        id: string;
        startTime: string;
        endTime: string;
        label: string;
        daysOfWeek: string[];
        startDate: string;
        endDate: string;
    }

    interface BlacklistEntry {
        id: string;
        roomName?: string; // Optional: if empty, blocks all rooms
        startDate?: string; // Optional: if empty, blocks for all dates
        endDate?: string; // Optional: if empty, blocks only the startDate
        comment?: string; // Reason/comment for the blacklist entry
    }

    interface StatisticConfig {
        id: string;
        name: string;
        visible: boolean;
    }

    interface Log {
        id: string;
        timestamp: Date;
        type: "connexion" | "deconnexion" | "creation" | "modification" | "suppression" | "erreur" | "admin";
        user: string;
        description: string;
        status: "success" | "error" | "warning";
        details?: string;
    }

    interface Tuteur {
        id: number;
        name: string;
        prenom?: string;
        nom?: string;
        type: "tuteur";
        typeTuteur?: "Apprenti" | "Tuteur" | "Administrateur";
        courses: number;
        capacity: string;
        status: string;
        avatar: string;
        email: string;
        phone: string;
        specialites: string[];
        anneesConfortables: string[];
        salaireHoraire: number;
        capaciteGestion: number;
        allergies?: string;
        alias?: string;
        groupeId?: number;
        prochainsCours: Array<{
            day: string;
            time: string;
            room: string;
            students: number;
        }>;
        disponibilites?: Array<{
            id: string;
            day: string;
            startTime: string;
            endTime: string;
            type: "recurrente" | "ponctuelle" | "exception";
            startDate?: string;
            endDate?: string;
            commentaire?: string;
            active: boolean;
        }>;
        statistiques?: {
            heuresEnseignees: number;
            tauxCompletion: number;
            nombreCours: number;
            dateDebut: string;
            nombreElevesDifferents: number;
        };
        note?: string;
    }

    interface Eleve {
        id: number;
        name: string;
        type: "eleve";
        age?: number;
        grade: string;
        pg: number;
        status: string;
        avatar: string;
        email: string;
        emails?: string[];
        phone: string;
        tuteur: string;
        difficultes?: string;
        allergies?: string;
        alias?: string;
        groupeId?: number;
        prochainsCours: Array<{
            day: string;
            time: string;
            subject: string;
            tuteur: string;
        }>;
        disponibilites?: Array<{
            id: string;
            day: string;
            startTime: string;
            endTime: string;
            type: "recurrente" | "ponctuelle" | "exception";
            startDate?: string;
            endDate?: string;
            commentaire?: string;
            active: boolean;
        }>;
        statistiques?: {
            tauxPresence: number;
            progression: number;
            nombreCours: number;
        };
        note?: string;
    }

    interface Groupe {
        id: number;
        name: string;
        tuteurId?: number;
        tuteurName?: string;
        eleveIds: number[];
        eleveNames: string[];
        pgTotal: number;
        disponibilites?: Array<{
            day: string;
            time: string;
        }>;
    }

    type Personnel = Tuteur | Eleve;

    const [currentPage, setCurrentPage] = useState("landing");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedDay, setSelectedDay] = useState<Day>("Lundi");
    const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");
    const [targetStatsSection, setTargetStatsSection] = useState<string | null>(null);
    const [visibleStats, setVisibleStats] = useState<Record<string, boolean>>({
        activeStudents: true,
        plannedCourses: true,
        completedCourses: true,
        occupancyRate: true,
        overages: true,
        tutorCapacity: true,
        roomUsage: true,
    });

    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
        // Créneaux pour Lundi au Jeudi
        { id: "1", startTime: "16:15", endTime: "18:15", label: "16h15-18h15", daysOfWeek: ["Lundi", "Mardi", "Mercredi", "Jeudi"], startDate: "2024-01-01", endDate: "2024-12-31" },
        { id: "2", startTime: "18:30", endTime: "20:30", label: "18h30-20h30", daysOfWeek: ["Lundi", "Mardi", "Mercredi", "Jeudi"], startDate: "2024-01-01", endDate: "2024-12-31" },
        // Créneaux pour Samedi et Dimanche
        { id: "3", startTime: "08:15", endTime: "10:15", label: "8h15-10h15", daysOfWeek: ["Samedi", "Dimanche"], startDate: "2024-01-01", endDate: "2024-12-31" },
        { id: "4", startTime: "10:30", endTime: "12:30", label: "10h30-12h30", daysOfWeek: ["Samedi", "Dimanche"], startDate: "2024-01-01", endDate: "2024-12-31" },
        { id: "5", startTime: "13:00", endTime: "15:00", label: "13h-15h", daysOfWeek: ["Samedi", "Dimanche"], startDate: "2024-01-01", endDate: "2024-12-31" },
    ]);

    // Mock logs data - historique complet de toutes les actions
    const generateMockLogs = (): Log[] => {
        const now = new Date();
        const logs: Log[] = [];
        
        // Logs des dernières 24 heures
        for (let i = 0; i < 50; i++) {
            const hoursAgo = Math.floor(Math.random() * 24);
            const minutesAgo = Math.floor(Math.random() * 60);
            const timestamp = new Date(now);
            timestamp.setHours(timestamp.getHours() - hoursAgo);
            timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);
            
            const types: Log["type"][] = ["connexion", "deconnexion", "creation", "modification", "suppression", "erreur", "admin"];
            const statuses: Log["status"][] = ["success", "error", "warning"];
            const users = ["admin@labonnenote.com", "marie.dupont@labonnenote.com", "jean.martin@labonnenote.com", "sophie.chen@labonnenote.com"];
            
            const type = types[Math.floor(Math.random() * types.length)];
            const status = type === "erreur" ? "error" : (Math.random() > 0.8 ? "warning" : "success");
            const user = users[Math.floor(Math.random() * users.length)];
            
            let description = "";
            switch (type) {
                case "connexion":
                    description = `Connexion réussie pour ${user}`;
                    break;
                case "deconnexion":
                    description = `Déconnexion de ${user}`;
                    break;
                case "creation":
                    const createdItems = ["un nouveau tuteur", "un nouvel élève", "un nouveau groupe", "un nouveau cours", "un créneau horaire"];
                    description = `Création de ${createdItems[Math.floor(Math.random() * createdItems.length)]}`;
                    break;
                case "modification":
                    const modifiedItems = ["les informations d'un tuteur", "les informations d'un élève", "les paramètres d'un groupe", "un cours", "les paramètres de la compagnie"];
                    description = `Modification de ${modifiedItems[Math.floor(Math.random() * modifiedItems.length)]}`;
                    break;
                case "suppression":
                    const deletedItems = ["un tuteur", "un élève", "un groupe", "un cours"];
                    description = `Suppression de ${deletedItems[Math.floor(Math.random() * deletedItems.length)]}`;
                    break;
                case "erreur":
                    description = `Erreur système lors de l'opération`;
                    break;
                case "admin":
                    description = `Action administrative effectuée`;
                    break;
            }
            
            logs.push({
                id: `log-${timestamp.getTime()}-${i}`,
                timestamp,
                type,
                user,
                description,
                status,
                details: status === "error" ? "Une erreur technique s'est produite" : undefined,
            });
        }
        
        return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    const [logs, setLogs] = useState<Log[]>(generateMockLogs());

    // Helper function to get days that have time slots configured
    const getDaysWithTimeSlots = (slots: TimeSlot[]): Day[] => {
        const daysWithSlots = new Set<Day>();
        slots.forEach(slot => {
            slot.daysOfWeek.forEach(day => {
                if (day === "Lundi" || day === "Mardi" || day === "Mercredi" || day === "Jeudi" || day === "Vendredi" || day === "Samedi" || day === "Dimanche") {
                    daysWithSlots.add(day as Day);
                }
            });
        });
        // Return days in the original order
        const allDays: Day[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
        return allDays.filter(day => daysWithSlots.has(day));
    };

    const allDays: Day[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    // All rooms available for the dashboard
    const allRooms = ["Salle A", "Salle B", "Salle C", "Salle D", "Salle E"];

    const courses: Partial<Record<Day, Course[]>> = {
        Lundi: [
            {
                time: "16:15",
                room: "Salle A",
                tutor: "Marie Dupont",
                students: 4,
                subject: "Math",
                color: "bg-blue-500",
                groupId: 1,
                studentNames: ["Lucas Bernard", "Emma Tremblay", "Noah Gagnon", "Olivia Côté"],
                attendance: {
                    "Lucas Bernard": true,
                    "Emma Tremblay": true,
                    "Noah Gagnon": false,
                    "Olivia Côté": true,
                },
            },
            {
                time: "16:15",
                room: "Salle B",
                tutor: "Jean Martin",
                students: 3,
                subject: "Français",
                color: "bg-purple-500",
                groupId: 2,
                studentNames: ["William Roy", "Sophie Martin", "Alex Leblanc"],
                attendance: {
                    "William Roy": true,
                    "Sophie Martin": true,
                    "Alex Leblanc": true,
                },
            },
            {
                time: "18:30",
                room: "Salle A",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
                groupId: 3,
                studentNames: ["Emma Chen", "Marc Dubois"],
                attendance: {
                    "Emma Chen": true,
                    "Marc Dubois": false,
                },
            },
            {
                time: "18:30",
                room: "Salle C",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
        ],
        Mardi: [
            {
                time: "16:15",
                room: "Salle C",
                tutor: "Marie Dupont",
                students: 4,
                subject: "Math",
                color: "bg-blue-500",
                groupId: 1,
                studentNames: ["Lucas Bernard", "Emma Tremblay", "Noah Gagnon", "Olivia Côté"],
            },
            {
                time: "16:15",
                room: "Salle D",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
                groupId: 3,
                studentNames: ["Emma Chen", "Marc Dubois"],
            },
            {
                time: "18:30",
                room: "Salle B",
                tutor: "Jean Martin",
                students: 3,
                subject: "Français",
                color: "bg-purple-500",
                groupId: 2,
                studentNames: ["William Roy", "Sophie Martin", "Alex Leblanc"],
            },
            {
                time: "18:30",
                room: "Salle A",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
        ],
        Mercredi: [
            {
                time: "16:15",
                room: "Salle A",
                tutor: "Jean Martin",
                students: 3,
                subject: "Français",
                color: "bg-purple-500",
                groupId: 2,
                studentNames: ["William Roy", "Sophie Martin", "Alex Leblanc"],
            },
            {
                time: "16:15",
                room: "Salle B",
                tutor: "Marie Dupont",
                students: 4,
                subject: "Math",
                color: "bg-blue-500",
                groupId: 1,
                studentNames: ["Lucas Bernard", "Emma Tremblay", "Noah Gagnon", "Olivia Côté"],
            },
            {
                time: "18:30",
                room: "Salle D",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
                groupId: 3,
                studentNames: ["Emma Chen", "Marc Dubois"],
            },
            {
                time: "18:30",
                room: "Salle C",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
        ],
        Jeudi: [
            {
                time: "16:15",
                room: "Salle B",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
                groupId: 3,
                studentNames: ["Emma Chen", "Marc Dubois"],
            },
            {
                time: "16:15",
                room: "Salle A",
                tutor: "Jean Martin",
                students: 3,
                subject: "Français",
                color: "bg-purple-500",
                groupId: 2,
                studentNames: ["William Roy", "Sophie Martin", "Alex Leblanc"],
            },
            {
                time: "18:30",
                room: "Salle C",
                tutor: "Marie Dupont",
                students: 4,
                subject: "Math",
                color: "bg-blue-500",
                groupId: 1,
                studentNames: ["Lucas Bernard", "Emma Tremblay", "Noah Gagnon", "Olivia Côté"],
            },
            {
                time: "18:30",
                room: "Salle D",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
        ],
        Vendredi: [], // Pas de cours le vendredi
        Samedi: [
            {
                time: "08:15",
                room: "Salle A",
                tutor: "Marie Dupont",
                students: 4,
                subject: "Math",
                color: "bg-blue-500",
                groupId: 1,
                studentNames: ["Lucas Bernard", "Emma Tremblay", "Noah Gagnon", "Olivia Côté"],
            },
            {
                time: "10:30",
                room: "Salle B",
                tutor: "Jean Martin",
                students: 3,
                subject: "Français",
                color: "bg-purple-500",
                groupId: 2,
                studentNames: ["William Roy", "Sophie Martin", "Alex Leblanc"],
            },
            {
                time: "13:00",
                room: "Salle C",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
                groupId: 3,
                studentNames: ["Emma Chen", "Marc Dubois"],
            },
        ],
        Dimanche: [
            {
                time: "08:15",
                room: "Salle B",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
            {
                time: "10:30",
                room: "Salle A",
                tutor: "Marie Dupont",
                students: 4,
                subject: "Math",
                color: "bg-blue-500",
                groupId: 1,
                studentNames: ["Lucas Bernard", "Emma Tremblay", "Noah Gagnon", "Olivia Côté"],
            },
            {
                time: "13:00",
                room: "Salle D",
                tutor: "Jean Martin",
                students: 3,
                subject: "Français",
                color: "bg-purple-500",
                groupId: 2,
                studentNames: ["William Roy", "Sophie Martin", "Alex Leblanc"],
            },
        ],
    };

    // Navigation
    const NavBar = () => null;

    const Sidebar = () => (
        <div className="fixed left-0 top-0 w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white h-screen overflow-y-auto shadow-2xl border-r border-slate-700/50 z-40">
            {/* Logo Section */}
            <button 
                onClick={() => setCurrentPage("landing")}
                className="w-full p-6 border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors"
            >
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg ring-2 ring-orange-400/20">
                        LBN
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">La Bonne Note</span>
                        <span className="text-xs text-slate-400">Gestion de cours</span>
                    </div>
                </div>
            </button>

            {/* Navigation */}
            <nav className="p-4 space-y-1.5">
                <button
                    onClick={() => setCurrentPage("dashboard")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group ${currentPage === "dashboard"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white"
                        : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                        }`}
                >
                    {currentPage === "dashboard" && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}
                    <Calendar size={20} className={currentPage === "dashboard" ? "" : "group-hover:scale-110 transition-transform"} />
                    <span>Tableau de bord</span>
                </button>

                <button
                    onClick={() => setCurrentPage("personnel")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group ${currentPage === "personnel"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white"
                        : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                        }`}
                >
                    {currentPage === "personnel" && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}
                    <Users size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Personnel</span>
                </button>

                <button
                    onClick={() => setCurrentPage("placement")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group ${currentPage === "placement"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white"
                        : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                        }`}
                >
                    {currentPage === "placement" && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}
                    <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Placement</span>
                </button>

                <button
                    onClick={() => setCurrentPage("stats")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group ${currentPage === "stats"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white"
                        : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                        }`}
                >
                    {currentPage === "stats" && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}
                    <BarChart3 size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Statistiques</span>
                </button>

                <button
                    onClick={() => setCurrentPage("logs")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group ${currentPage === "logs"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white"
                        : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                        }`}
                >
                    {currentPage === "logs" && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}
                    <FileText size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Logs</span>
                </button>

                {/* Notifications Button */}
                <div className="pt-4 mt-4 border-t border-slate-700/50">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group hover:bg-slate-800/50 text-slate-300 hover:text-white">
                        <div className="relative">
                            <Bell size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                        </div>
                        <span>Notifications</span>
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                    </button>
                </div>

                <div className="pt-2">
                    <button
                        onClick={() => setCurrentPage("settings")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group ${currentPage === "settings"
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white"
                            : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                            }`}
                    >
                        {currentPage === "settings" && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                        )}
                        <UserCog size={20} className="group-hover:scale-110 transition-transform" />
                        <span>Mon Compte</span>
                    </button>

                    <button
                        onClick={() => setCurrentPage("companySettings")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden group mt-1.5 ${currentPage === "companySettings"
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white"
                            : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                            }`}
                    >
                        {currentPage === "companySettings" && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                        )}
                        <Building2 size={20} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span>Compagnie</span>
                    </button>
                </div>
            </nav>

            {/* Footer/User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 mb-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md flex items-center justify-center text-sm font-bold">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">Admin</div>
                        <div className="text-xs text-slate-400 truncate">admin@labonnenote.com</div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setIsLoggedIn(false);
                        setCurrentPage("landing");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-red-500/20 text-slate-300 hover:text-red-400"
                >
                    <DoorOpen size={20} />
                    <span>Se déconnecter</span>
                </button>
            </div>
        </div>
    );

    // Page Login
    const LoginPage = () => {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center font-bold text-4xl text-white mx-auto mb-4 shadow-lg">
                            LBN
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            La Bonne Note
                        </h1>
                        <p className="text-slate-300">
                            Système de gestion de cours
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Adresse courriel
                            </label>
                            <input
                                type="email"
                                placeholder="email@exemple.com"
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-300">
                                    Mot de passe
                                </label>
                                <button
                                    onClick={() => setCurrentPage("reset-password")}
                                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <button 
                            onClick={() => {
                                setIsLoggedIn(true);
                                setCurrentPage("dashboard");
                            }}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Se connecter
                        </button>

                        <div className="text-center pt-4">
                            <span className="text-slate-400 text-sm">Nouveau compte ? </span>
                            <button
                                onClick={() => setCurrentPage("invitation-check")}
                                className="text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium"
                            >
                                Créer votre compte
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Page Invitation Check - Vérification d'invitation
    const InvitationCheckPage = () => {
        const [email, setEmail] = useState("");

        const handleVerify = () => {
            // Redirection directe vers la page d'inscription
            setCurrentPage("signup");
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg border border-white/20 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center font-bold text-4xl text-white mx-auto mb-4 shadow-lg">
                            LBN
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Créer un compte
                        </h1>
                        <p className="text-orange-400 font-medium mb-4">
                            Invitation requise
                        </p>
                    </div>

                    <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                <Info className="w-5 h-5 text-blue-300" />
                            </div>
                            <div className="text-slate-200 text-sm space-y-2">
                                <p>
                                    La création de compte à <strong>La Bonne Note</strong> se fait uniquement sur invitation. 
                                </p>
                                <p>
                                    Si vous n'avez pas encore reçu d'invitation, un courriel vous sera envoyé prochainement par notre équipe.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="text-center mb-4">
                            <p className="text-slate-300 text-sm">
                                Si vous pensez avoir reçu une invitation, entrez votre adresse courriel ci-dessous pour vérifier.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Adresse courriel
                            </label>
                            <input
                                type="email"
                                placeholder="email@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <button 
                            onClick={handleVerify}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Vérifier mon invitation
                        </button>

                        <div className="text-center pt-4">
                            <button
                                onClick={() => setCurrentPage("login")}
                                className="text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium"
                            >
                                ← Retour à la connexion
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Page Signup - Inscription
    const SignupPage = () => {
        const [formData, setFormData] = useState({
            prenom: "",
            nom: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
        const [error, setError] = useState("");

        const handleSubmit = () => {
            // Validation minimale
            if (!formData.prenom || !formData.nom || !formData.email || !formData.password || !formData.confirmPassword) {
                setError("Veuillez remplir tous les champs");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Les mots de passe ne correspondent pas");
                return;
            }
            
            // UI seulement - redirection directe vers dashboard
            setIsLoggedIn(true);
            setCurrentPage("dashboard");
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center font-bold text-4xl text-white mx-auto mb-4 shadow-lg">
                            LBN
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Créer un compte
                        </h1>
                        <p className="text-slate-300">
                            Rejoignez La Bonne Note
                        </p>
                    </div>

                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Prénom
                            </label>
                            <input
                                type="text"
                                placeholder="Jean"
                                value={formData.prenom}
                                onChange={(e) => {
                                    setFormData({...formData, prenom: e.target.value});
                                    setError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Nom
                            </label>
                            <input
                                type="text"
                                placeholder="Dupont"
                                value={formData.nom}
                                onChange={(e) => {
                                    setFormData({...formData, nom: e.target.value});
                                    setError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                Poste
                                <Lock className="w-4 h-4 text-slate-400" />
                            </label>
                            <input
                                type="text"
                                value="Tuteur"
                                disabled
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-slate-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Assigné par l'administrateur
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Adresse courriel
                            </label>
                            <input
                                type="email"
                                placeholder="email@exemple.com"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({...formData, email: e.target.value});
                                    setError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({...formData, password: e.target.value});
                                    setError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => {
                                    setFormData({...formData, confirmPassword: e.target.value});
                                    setError("");
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <button 
                            onClick={handleSubmit}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Créer le compte
                        </button>

                        <div className="text-center pt-4">
                            <span className="text-slate-400 text-sm">Déjà un compte ? </span>
                            <button
                                onClick={() => setCurrentPage("login")}
                                className="text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium"
                            >
                                Se connecter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Page Reset Password - Réinitialisation du mot de passe
    const ResetPasswordPage = () => {
        const [email, setEmail] = useState("");
        const [submitted, setSubmitted] = useState(false);
        const [error, setError] = useState("");

        const handleSubmit = () => {
            // Validation minimale
            if (!email) {
                setError("Veuillez entrer votre adresse courriel");
                return;
            }
            
            // UI seulement - afficher message de succès
            setSubmitted(true);
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center font-bold text-4xl text-white mx-auto mb-4 shadow-lg">
                            LBN
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Mot de passe oublié ?
                        </h1>
                        <p className="text-slate-300">
                            {submitted 
                                ? "Vérifiez votre boîte courriel" 
                                : "Entrez votre adresse courriel pour réinitialiser votre mot de passe"}
                        </p>
                    </div>

                    {!submitted ? (
                        <div className="space-y-4">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Adresse courriel
                                </label>
                                <input
                                    type="email"
                                    placeholder="email@exemple.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <button 
                                onClick={handleSubmit}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Envoyer le lien de réinitialisation
                            </button>

                            <div className="text-center pt-4">
                                <button
                                    onClick={() => setCurrentPage("login")}
                                    className="text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium"
                                >
                                    ← Retour à la connexion
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm text-center">
                                <p className="mb-2">
                                    Un lien de réinitialisation a été envoyé à <strong>{email}</strong>
                                </p>
                                <p className="text-xs text-green-300">
                                    Le lien expirera dans 24 heures.
                                </p>
                            </div>

                            <button 
                                onClick={() => setCurrentPage("login")}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Retour à la connexion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Landing Page - Page d'ouverture publique
    const LandingPage = () => {
        const [selectedLanguage, setSelectedLanguage] = useState<"fr" | "en" | "es">("fr");
        const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
        const [showUserMenu, setShowUserMenu] = useState(false);
        const [contactFormData, setContactFormData] = useState({
            name: "",
            email: "",
            message: ""
        });
        const [formErrors, setFormErrors] = useState<Record<string, string>>({});
        const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
        const [formMessage, setFormMessage] = useState("");

        // Determine if user is authenticated (UI state only)
        const isAuthenticated = isLoggedIn;

        // Language options
        const languages = [
            { code: "fr", name: "Français", flag: "🇫🇷" },
            { code: "en", name: "English", flag: "🇬🇧" },
            { code: "es", name: "Español", flag: "🇪🇸" }
        ];

        const selectedLang = languages.find(l => l.code === selectedLanguage) || languages[0];

        // Contact form validation
        const validateForm = () => {
            const errors: Record<string, string> = {};
            
            if (!contactFormData.name.trim()) {
                errors.name = "Le nom est requis";
            }
            
            if (!contactFormData.email.trim()) {
                errors.email = "L'adresse courriel est requise";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactFormData.email)) {
                errors.email = "Adresse courriel invalide";
            }
            
            if (!contactFormData.message.trim()) {
                errors.message = "Le message est requis";
            }
            
            setFormErrors(errors);
            return Object.keys(errors).length === 0;
        };

        // Handle form submission (UI simulation only)
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }

            setFormStatus("submitting");
            setFormMessage("");

            // Simulate API call with timeout
            setTimeout(() => {
                // Simulate success (90% chance) or error (10% chance)
                const isSuccess = Math.random() > 0.1;
                
                if (isSuccess) {
                    setFormStatus("success");
                    setFormMessage("Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.");
                    setContactFormData({ name: "", email: "", message: "" });
                    setFormErrors({});
                    
                    // Reset to idle after 5 seconds
                    setTimeout(() => {
                        setFormStatus("idle");
                        setFormMessage("");
                    }, 5000);
                } else {
                    setFormStatus("error");
                    setFormMessage("Une erreur s'est produite lors de l'envoi. Veuillez réessayer plus tard.");
                    
                    // Reset to idle after 5 seconds
                    setTimeout(() => {
                        setFormStatus("idle");
                        setFormMessage("");
                    }, 5000);
                }
            }, 1500);
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
                {/* Fixed Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo and Platform Name */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg">
                                    LBN
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white">La Bonne Note</span>
                                    <span className="text-xs text-slate-400 hidden sm:block">Plateforme de gestion</span>
                                </div>
                            </div>

                            {/* Language Selector and Auth Button */}
                            <div className="flex items-center gap-4">
                                {/* Language Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
                                    >
                                        <Globe size={18} />
                                        <span className="hidden sm:inline">{selectedLang.flag} {selectedLang.name}</span>
                                        <span className="sm:hidden">{selectedLang.flag}</span>
                                        <ChevronDown size={16} className={showLanguageDropdown ? "transform rotate-180" : ""} />
                                    </button>
                                    
                                    {showLanguageDropdown && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-40" 
                                                onClick={() => setShowLanguageDropdown(false)}
                                            ></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => {
                                                            setSelectedLanguage(lang.code as "fr" | "en" | "es");
                                                            setShowLanguageDropdown(false);
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                                                            selectedLanguage === lang.code 
                                                                ? "bg-slate-700 border-l-2 border-orange-500" 
                                                                : "text-slate-200"
                                                        }`}
                                                    >
                                                        <span className="text-xl">{lang.flag}</span>
                                                        <span className="flex-1">{lang.name}</span>
                                                        {selectedLanguage === lang.code && (
                                                            <CheckCircle size={16} className="text-orange-500" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Conditional Auth Button or User Menu */}
                                {isAuthenticated ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
                                        >
                                            <User size={20} />
                                            <ChevronDown size={16} className={showUserMenu ? "transform rotate-180" : ""} />
                                        </button>
                                        
                                        {showUserMenu && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-40" 
                                                    onClick={() => setShowUserMenu(false)}
                                                ></div>
                                                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            setCurrentPage("settings");
                                                            setShowUserMenu(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors text-slate-200"
                                                    >
                                                        <Settings size={18} />
                                                        <span>Paramètres</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setCurrentPage("dashboard");
                                                            setShowUserMenu(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors text-slate-200"
                                                    >
                                                        <Home size={18} />
                                                        <span>Accéder à la plateforme</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setCurrentPage("login")}
                                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                                    >
                                        <LogIn size={18} />
                                        <span className="hidden sm:inline">Se connecter</span>
                                        <span className="sm:hidden">Connexion</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content - All sections in one page */}
                <div className="pt-20">
                    {/* Hero Section - Enhanced with parallax and animations */}
                    <section className="relative container mx-auto px-4 py-32">
                        <div className="relative z-10">
                            <div className="text-center mb-16">
                                {/* Animated Logo */}
                                <div className="relative inline-block mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />
                                    <div className="relative w-28 h-28 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-500 rounded-3xl flex items-center justify-center font-bold text-5xl text-white shadow-2xl transform transition-transform hover:scale-110 hover:rotate-3">
                                        LBN
                                    </div>
                                </div>

                                {/* Main Heading with Gradient */}
                                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent animate-fade-in">
                                    La Bonne Note
                                </h1>
                                
                                {/* Subtitle with typing effect feel */}
                                <div className="mb-8">
                                    <p className="text-2xl md:text-3xl font-semibold text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text mb-4">
                                        Système de gestion de cours intelligent
                                    </p>
                                    <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full" />
                                </div>

                                {/* Description */}
                                <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                                    Transformez votre gestion éducative avec une plateforme tout-en-un. 
                                    Gérez efficacement votre personnel, vos cours et vos salles avec une interface 
                                    <span className="text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text font-semibold"> moderne et intuitive</span>.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                                    <button
                                        onClick={() => {
                                            if (isAuthenticated) {
                                                setCurrentPage("dashboard");
                                            } else {
                                                setCurrentPage("login");
                                            }
                                        }}
                                        className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                                    >
                                        <span>Accéder à la plateforme</span>
                                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                                    >
                                        <Info size={20} />
                                        <span>En savoir plus</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Scroll Indicator */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <ChevronDown size={32} className="text-slate-400" />
                        </div>
                    </section>

                    {/* Company Information Section */}
                    <section className="container mx-auto px-4 py-24">
                        <div className="max-w-5xl mx-auto">
                            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-slate-700/50 overflow-hidden">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl" />
                                
                                <div className="relative z-10">
                                    <div className="text-center mb-12">
                                        <div className="inline-flex items-center gap-3 mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                                                <Info size={32} className="text-white" />
                                            </div>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                            À propos de La Bonne Note
                                        </h2>
                                        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-8" />
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <p className="text-lg text-slate-300 leading-relaxed text-center max-w-3xl mx-auto">
                                            La Bonne Note est une <span className="text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text font-semibold">plateforme innovante</span> conçue pour révolutionner la gestion des établissements éducatifs. 
                                            Notre système offre une solution complète pour la planification, l'organisation et le suivi des cours, 
                                            permettant aux administrateurs de gagner du temps et d'améliorer l'efficacité opérationnelle.
                                        </p>
                                        <p className="text-lg text-slate-300 leading-relaxed text-center max-w-3xl mx-auto">
                                            Grâce à une interface intuitive et des outils puissants, transformez votre façon de gérer les ressources 
                                            pédagogiques, le personnel et les étudiants. La Bonne Note simplifie les tâches complexes et vous permet 
                                            de vous concentrer sur ce qui compte vraiment : <span className="text-transparent bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text font-semibold">l'éducation</span>.
                                        </p>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="flex justify-center mt-12">
                                        <button
                                            onClick={() => {
                                                if (isAuthenticated) {
                                                    setCurrentPage("dashboard");
                                                } else {
                                                    setCurrentPage("login");
                                                }
                                            }}
                                            className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold shadow-xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                                        >
                                            <span>Découvrir la plateforme</span>
                                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Enhanced Platform Features Section */}
                    <section id="features" className="container mx-auto px-4 py-24">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-4">
                                    <span className="text-orange-400 font-semibold text-sm">Fonctionnalités</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    Tout ce dont vous avez besoin
                                </h2>
                                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                                    Une suite complète d'outils puissants pour transformer votre gestion éducative
                                </p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Feature Card 1 */}
                                <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-orange-500/50">
                                            <Users size={32} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                                            Gestion du Personnel
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">
                                            Gérez facilement vos tuteurs et élèves avec des profils détaillés, suivi des disponibilités, 
                                            et une vue d'ensemble complète de votre équipe pédagogique.
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                </div>

                                {/* Feature Card 2 */}
                                <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-orange-500/50">
                                            <Calendar size={32} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                                            Planification des Cours
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">
                                            Organisez vos cours avec un calendrier interactif, gestion intelligente des salles, 
                                            et détection automatique des conflits d'horaire.
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                </div>

                                {/* Feature Card 3 */}
                                <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-orange-500/50">
                                            <BarChart3 size={32} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                                            Statistiques Avancées
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">
                                            Suivez vos performances avec des tableaux de bord détaillés, analyses en temps réel, 
                                            et rapports personnalisables pour une prise de décision éclairée.
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                </div>

                                {/* Feature Card 4 */}
                                <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-orange-500/50">
                                            <MapPin size={32} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                                            Gestion des Salles
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">
                                            Optimisez l'utilisation de vos espaces avec un système intelligent d'allocation des salles, 
                                            suivi de disponibilité et gestion des équipements.
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                </div>

                                {/* Feature Card 5 */}
                                <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-orange-500/50">
                                            <Clock size={32} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                                            Gestion des Horaires
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">
                                            Créez et modifiez facilement les horaires avec une interface intuitive, 
                                            notifications automatiques et synchronisation en temps réel.
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                </div>

                                {/* Feature Card 6 */}
                                <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-orange-500/50">
                                            <TrendingUp size={32} className="text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                                            Optimisation Continue
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">
                                            Améliorez constamment vos opérations grâce à des analyses prédictives, 
                                            suggestions d'optimisation et suivi des tendances.
                                        </p>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Form Section */}
                    <section className="container mx-auto px-4 py-24">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-16">
                                <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-4">
                                    <span className="text-orange-400 font-semibold text-sm">Contact</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    Parlons de votre projet
                                </h2>
                                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                                    Une question? Une suggestion? Notre équipe est là pour vous accompagner.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Contact Info Cards */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-orange-500/50 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Mail size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                                                <p className="text-slate-400 text-sm mb-2">Notre équipe vous répond sous 24h</p>
                                                <a href="mailto:contact@labonnenote.com" className="text-orange-400 hover:text-orange-300 transition-colors">
                                                    contact@labonnenote.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-orange-500/50 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Phone size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1">Téléphone</h3>
                                                <p className="text-slate-400 text-sm mb-2">Disponible du lundi au vendredi</p>
                                                <a href="tel:+15141234567" className="text-orange-400 hover:text-orange-300 transition-colors">
                                                    +1 (514) 123-4567
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-orange-500/50 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <MapPinIcon size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1">Adresse</h3>
                                                <p className="text-slate-400 text-sm">
                                                    123 Rue de l'Éducation<br />
                                                    Montréal, QC, Canada
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-white mb-6">Envoyez-nous un message</h3>
                                        
                                        {/* Name Field */}
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
                                                Nom complet <span className="text-orange-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={contactFormData.name}
                                                onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border-2 ${
                                                    formErrors.name ? "border-red-500" : "border-slate-700 focus:border-orange-500"
                                                } text-white placeholder-slate-500 focus:outline-none transition-all`}
                                                placeholder="Jean Dupont"
                                            />
                                            {formErrors.name && (
                                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {formErrors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                                                Adresse courriel <span className="text-orange-400">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={contactFormData.email}
                                                onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border-2 ${
                                                    formErrors.email ? "border-red-500" : "border-slate-700 focus:border-orange-500"
                                                } text-white placeholder-slate-500 focus:outline-none transition-all`}
                                                placeholder="jean.dupont@exemple.com"
                                            />
                                            {formErrors.email && (
                                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {formErrors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Message Field */}
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-2">
                                                Votre message <span className="text-orange-400">*</span>
                                            </label>
                                            <textarea
                                                id="message"
                                                value={contactFormData.message}
                                                onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                                                rows={5}
                                                className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border-2 ${
                                                    formErrors.message ? "border-red-500" : "border-slate-700 focus:border-orange-500"
                                                } text-white placeholder-slate-500 focus:outline-none transition-all resize-none`}
                                                placeholder="Parlez-nous de votre projet..."
                                            />
                                            {formErrors.message && (
                                                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle size={14} />
                                                    {formErrors.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Status Messages */}
                                        {formStatus === "success" && formMessage && (
                                            <div className="p-4 bg-green-500/10 border-2 border-green-500/30 rounded-xl flex items-start gap-3">
                                                <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-green-300 text-sm">{formMessage}</p>
                                            </div>
                                        )}

                                        {formStatus === "error" && formMessage && (
                                            <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl flex items-start gap-3">
                                                <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-red-300 text-sm">{formMessage}</p>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={formStatus === "submitting"}
                                            className="group w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            {formStatus === "submitting" ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Envoi en cours...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                                                    <span>Envoyer le message</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="relative bg-gradient-to-b from-slate-900 to-black border-t border-slate-800">
                        <div className="container mx-auto px-4 py-8">
                            <div className="grid md:grid-cols-4 gap-8 mb-6">
                                {/* Company Info */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
                                            LBN
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">La Bonne Note</h3>
                                            <p className="text-xs text-slate-400">Gestion éducative intelligente</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <a href="mailto:contact@labonnenote.com" className="flex items-center gap-3 text-slate-400 hover:text-orange-400 transition-colors group">
                                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                                <Mail size={16} className="text-orange-500" />
                                            </div>
                                            <span>contact@labonnenote.com</span>
                                        </a>
                                        <a href="tel:+15141234567" className="flex items-center gap-3 text-slate-400 hover:text-orange-400 transition-colors group">
                                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                                <Phone size={16} className="text-orange-500" />
                                            </div>
                                            <span>+1 (514) 123-4567</span>
                                        </a>
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                                <MapPinIcon size={16} className="text-orange-500" />
                                            </div>
                                            <span>Montréal, QC, Canada</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div>
                                    <h3 className="text-base font-bold text-white mb-3">Navigation</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <button 
                                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                className="text-slate-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                                            >
                                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                Accueil
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="text-slate-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                                            >
                                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                Fonctionnalités
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="text-slate-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                                            >
                                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                Contact
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                {/* Legal Links */}
                                <div>
                                    <h3 className="text-base font-bold text-white mb-3">Légal</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <button 
                                                onClick={() => {/* Placeholder for privacy policy */}}
                                                className="text-slate-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                                            >
                                                <Shield size={14} />
                                                Confidentialité
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                onClick={() => {/* Placeholder for terms */}}
                                                className="text-slate-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                                            >
                                                <FileText size={14} />
                                                Conditions
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                onClick={() => {/* Placeholder for legal mentions */}}
                                                className="text-slate-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                                            >
                                                <Info size={14} />
                                                Mentions légales
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Bottom Bar */}
                            <div className="border-t border-slate-800 pt-6 text-center">
                                <p className="text-slate-400 text-sm">
                                    © {new Date().getFullYear()} La Bonne Note. Tous droits réservés.
                                </p>
                            </div>
                        </div>

                        {/* Decorative gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-20" />
                    </footer>
                </div>
            </div>
        );
    };

    // Helper function to get filtered rooms
    const getFilteredRooms = () => {
        // Automatically filter out rooms that have no courses for the selected day
        const occupiedRooms = new Set(
            courses[selectedDay]?.map((c) => c.room) || []
        );
        
        return allRooms.filter((room) => occupiedRooms.has(room));
    };

    // Helper to get courses for a room in a time slot
    const getCoursesForRoomAndSlot = (room: string, slotStart: string, day?: Day) => {
        const dayToUse = day || selectedDay;
        return (
            courses[dayToUse]?.filter(
                (c) => c.room === room && c.time.startsWith(slotStart.split(":")[0])
            ) || []
        );
    };

    // Statistics configuration
    const statsConfig: StatisticConfig[] = [
        { id: "activeStudents", name: "Élèves actifs", visible: true },
        { id: "plannedCourses", name: "Cours planifiés", visible: true },
        { id: "completedCourses", name: "Cours réalisés", visible: true },
        { id: "occupancyRate", name: "Taux occupation", visible: true },
        { id: "overages", name: "Dépassements", visible: true },
        { id: "tutorCapacity", name: "Capacité tuteurs", visible: false },
        { id: "roomUsage", name: "Utilisation salles", visible: false },
    ];

    // Dashboard Page
    const DashboardPage = () => {
        const [showStatsPicker, setShowStatsPicker] = useState(false);
        const [printRange, setPrintRange] = useState("week");
        const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
        const statsPickerRef = useRef<HTMLDivElement>(null);
        const statsPickerButtonRef = useRef<HTMLButtonElement>(null);
        const [coursesState, setCoursesState] = useState<Partial<Record<Day, Course[]>>>(courses);
        const [hasEditPermissions] = useState(true); // Simulate permissions - can be changed based on user role
        const [selectedSlotForMenu, setSelectedSlotForMenu] = useState<string | null>(null);
        const [selectedCellForAdd, setSelectedCellForAdd] = useState<{room: string, slotId: string} | null>(null);
        
        // Get the Monday of the current week
        const getCurrentWeekStart = (): Date => {
            const today = new Date();
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            const monday = new Date(today);
            monday.setDate(diff);
            monday.setHours(0, 0, 0, 0);
            return monday;
        };
        
        const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getCurrentWeekStart());
        
        // Utility functions for week management
        const getWeekStart = (date: Date): Date => {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(d);
            monday.setDate(diff);
            monday.setHours(0, 0, 0, 0);
            return monday;
        };
        
        const getWeekDates = (weekStart: Date): Record<Day, Date> => {
            const monday = new Date(weekStart);
            monday.setHours(0, 0, 0, 0);
            
            const dates: Record<string, Date> = {};
            const dayOrder: Day[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
            
            dayOrder.forEach((day, index) => {
                const date = new Date(monday);
                date.setDate(monday.getDate() + index);
                dates[day] = date;
            });
            
            return dates as Record<Day, Date>;
        };
        
        const formatWeekRange = (weekStart: Date): string => {
            const weekDates = getWeekDates(weekStart);
            const monday = weekDates["Lundi"];
            const sunday = weekDates["Dimanche"];
            
            const formatDate = (date: Date): string => {
                return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            };
            
            const mondayStr = formatDate(monday);
            const sundayStr = formatDate(sunday);
            
            // If same month, show "14 - 20 octobre 2025"
            if (monday.getMonth() === sunday.getMonth() && monday.getFullYear() === sunday.getFullYear()) {
                const day1 = monday.getDate();
                const day2 = sunday.getDate();
                const monthYear = monday.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                return `${day1} - ${day2} ${monthYear}`;
            } else {
                // Different months or years
                return `${mondayStr} - ${sundayStr}`;
            }
        };
        
        const formatDayWithDate = (day: Day, weekStart: Date): string => {
            const weekDates = getWeekDates(weekStart);
            const date = weekDates[day];
            const dayName = day;
            const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
            return `${dayName} ${dateStr}`;
        };
        
        const goToPreviousWeek = () => {
            setCurrentWeekStart(prev => {
                const newDate = new Date(prev);
                newDate.setDate(prev.getDate() - 7);
                return newDate;
            });
        };
        
        const goToNextWeek = () => {
            setCurrentWeekStart(prev => {
                const newDate = new Date(prev);
                newDate.setDate(prev.getDate() + 7);
                return newDate;
            });
        };
        
        const goToCurrentWeek = () => {
            setCurrentWeekStart(getCurrentWeekStart());
        };
        
        const isCurrentWeek = (): boolean => {
            const currentWeek = getCurrentWeekStart();
            return currentWeekStart.getTime() === currentWeek.getTime();
        };

        // Mock students data - accessible for grade lookup
        const studentsData = [
            { id: 1, name: "Lucas Bernard", grade: "Sec. 3", pg: 3 },
            { id: 2, name: "Emma Tremblay", grade: "Sec. 4", pg: 2 },
            { id: 3, name: "Noah Gagnon", grade: "Sec. 5", pg: 4 },
            { id: 4, name: "Olivia Côté", grade: "Sec. 3", pg: 2 },
            { id: 5, name: "William Roy", grade: "Sec. 4", pg: 3 },
            { id: 6, name: "Sophie Martin", grade: "Sec. 3", pg: 3 },
            { id: 7, name: "Alex Leblanc", grade: "Sec. 3", pg: 3 },
            { id: 8, name: "Emma Chen", grade: "Sec. 4", pg: 3 },
            { id: 9, name: "Marc Dubois", grade: "Sec. 4", pg: 3 }
        ];

        // Mock tutors data with capacity
        const tutorsData = [
            { name: "Marie Dupont", capaciteGestion: 15 },
            { name: "Jean Martin", capaciteGestion: 15 },
            { name: "Sophie Chen", capaciteGestion: 15 },
            { name: "Thomas Roy", capaciteGestion: 15 }
        ];

        // Function to calculate total PG used in a course (only for present students)
        const calculateCoursePG = (course: Course): number => {
            if (!course.studentNames || course.studentNames.length === 0) {
                return 0;
            }
            return course.studentNames.reduce((total, studentName) => {
                // Only count PG for present students (attendance !== false)
                const isPresent = course.attendance?.[studentName] !== false;
                if (!isPresent) {
                    return total; // Skip absent students
                }
                const student = studentsData.find(s => s.name === studentName);
                return total + (student?.pg || 0);
            }, 0);
        };

        // Function to get tutor capacity
        const getTutorCapacity = (tutorName: string): number => {
            const tutor = tutorsData.find(t => t.name === tutorName);
            return tutor?.capaciteGestion || 15; // Default to 15 if not found
        };

        // Function to format student name: "Lucas B., Sec. 3"
        const formatStudentName = (studentName: string, grade: string | null): string => {
            const parts = studentName.trim().split(/\s+/);
            if (parts.length < 2) {
                return grade ? `${studentName}, ${grade}` : studentName;
            }
            const firstName = parts[0];
            const lastNameInitial = parts[parts.length - 1][0].toUpperCase();
            return grade ? `${firstName} ${lastNameInitial}., ${grade}` : `${firstName} ${lastNameInitial}.`;
        };

        // Function to get student grade from database
        const getStudentGrade = (studentName: string): string | null => {
            const student = studentsData.find(s => s.name === studentName);
            return student ? student.grade : null;
        };

        // Function to toggle attendance for a student in a course
        const toggleAttendance = (day: Day, courseIndex: number, studentName: string) => {
            setCoursesState(prev => {
                const newState = { ...prev };
                if (!newState[day]) return newState;
                
                const updatedCourses = [...newState[day]!];
                const course = { ...updatedCourses[courseIndex] };
                
                // Initialize attendance if not exists
                if (!course.attendance) {
                    course.attendance = {};
                }
                
                // Toggle attendance (default to true if undefined/null)
                const currentStatus = course.attendance[studentName];
                course.attendance = {
                    ...course.attendance,
                    [studentName]: currentStatus === false ? true : false
                };
                
                updatedCourses[courseIndex] = course;
                newState[day] = updatedCourses;
                
                return newState;
            });
        };

        // Mock groups (same as PlacementPage)
        const groups = [
            {
                id: 1,
                name: "Groupe Math Avancé",
                tutor: "Marie Dupont",
                students: ["Lucas Bernard", "Emma Tremblay", "Noah Gagnon", "Olivia Côté"],
                totalPG: 12,
                color: "blue"
            },
            {
                id: 2,
                name: "Groupe Sec. 3",
                tutor: null,
                students: ["William Roy", "Sophie Martin", "Alex Leblanc"],
                totalPG: 9,
                color: "purple"
            },
            {
                id: 3,
                name: "Groupe Sciences",
                tutor: "Sophie Chen",
                students: ["Emma Chen", "Marc Dubois"],
                totalPG: 6,
                color: "green"
            }
        ];

        const getGroupForCourse = (course: Course) => {
            if (!course.groupId) return null;
            return groups.find(g => g.id === course.groupId) || null;
        };

        // Local function to get courses for a room in a time slot using coursesState
        const getCoursesForRoomAndSlotLocal = (room: string, slotStart: string) => {
            return (
                coursesState[selectedDay]?.filter(
                    (c) => c.room === room && c.time.startsWith(slotStart.split(":")[0])
                ) || []
            );
        };

        // Helper to find course index in coursesState for toggleAttendance
        const findCourseIndex = (room: string, slotStart: string, courseToFind: Course): number => {
            const courses = coursesState[selectedDay] || [];
            return courses.findIndex(
                (c) => c.room === room && 
                       c.time.startsWith(slotStart.split(":")[0]) &&
                       c.tutor === courseToFind.tutor &&
                       c.subject === courseToFind.subject &&
                       c.time === courseToFind.time
            );
        };

        // Helper functions to detect issues
        const detectOverrun = (course: Course): boolean => {
            const coursePG = calculateCoursePG(course);
            const tutorCapacity = getTutorCapacity(course.tutor);
            return coursePG > tutorCapacity;
        };

        const detectConflict = (course: Course, room: string, slotStart: string): boolean => {
            const roomCourses = getCoursesForRoomAndSlotLocal(room, slotStart);
            return roomCourses.length > 1; // Multiple courses in same room/slot = conflict
        };

        const detectIncompleteCourse = (course: Course): boolean => {
            return !course.studentNames || course.studentNames.length === 0 || course.students === 0;
        };

        // Filter time slots for the selected day
        const getTimeSlotsForDay = (day: Day): TimeSlot[] => {
            if (day === "Vendredi") {
                return []; // Pas de cours le vendredi
            }
            return timeSlots.filter(slot => slot.daysOfWeek.includes(day));
        };
        
        const filteredTimeSlots = getTimeSlotsForDay(selectedDay);
        
        // Ensure selectedDay is valid (has time slots)
        useEffect(() => {
            const availableDays = getDaysWithTimeSlots(timeSlots);
            if (availableDays.length > 0 && !availableDays.includes(selectedDay)) {
                setSelectedDay(availableDays[0]);
            }
        }, [timeSlots]);

        // Close stats picker when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                if (
                    showStatsPicker &&
                    statsPickerRef.current &&
                    statsPickerButtonRef.current &&
                    !statsPickerRef.current.contains(target) &&
                    !statsPickerButtonRef.current.contains(target)
                ) {
                    setShowStatsPicker(false);
                }
            };

            if (showStatsPicker) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [showStatsPicker]);

        // Close slot menu when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (selectedSlotForMenu) {
                    const target = event.target as HTMLElement;
                    if (!target.closest('.time-slot-menu')) {
                        setSelectedSlotForMenu(null);
                    }
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [selectedSlotForMenu]);

        return (
            <div className="flex-1 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 overflow-auto">
                {/* Page Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Calendar className="text-orange-500" size={28} />
                        Tableau de bord
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Vue d'ensemble de vos cours et statistiques
                    </p>
                </div>

                <div className="p-8">
                    {/* Statistics Section with Configuration - FIRST */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8 w-full">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Statistiques
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    Semaine du {formatWeekRange(currentWeekStart)}
                                </p>
                            </div>
                            {/* Relative wrapper for stats picker positioning */}
                            <div className="relative">
                                {/* Square clickable box to add statistics */}
                                <button
                                    ref={statsPickerButtonRef}
                                    onClick={() => setShowStatsPicker(!showStatsPicker)}
                                    className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 flex items-center justify-center transition-all duration-200 hover:shadow-md"
                                    title="Ajouter des statistiques"
                                >
                                    <Plus size={20} className="text-slate-700" />
                                </button>

                                {/* Floating Statistics Picker Popup */}
                                {showStatsPicker && (
                                    <div 
                                        ref={statsPickerRef}
                                        className="absolute top-14 right-0 z-50 w-72 bg-white rounded-xl border border-slate-200 shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <p className="text-sm font-medium text-slate-700 mb-3">
                                            Statistiques disponibles:
                                        </p>
                                        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                            {statsConfig.map((stat) => {
                                                const isVisible = visibleStats[stat.id] ?? stat.visible;
                                                return (
                                                    <button
                                                        key={stat.id}
                                                        onClick={() => {
                                                            if (!isVisible) {
                                                                setVisibleStats({
                                                                    ...visibleStats,
                                                                    [stat.id]: true,
                                                                });
                                                            }
                                                            setShowStatsPicker(false);
                                                        }}
                                                        disabled={isVisible}
                                                        className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors text-left ${
                                                            isVisible 
                                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                                                : 'hover:bg-slate-50 text-slate-700 cursor-pointer'
                                                        }`}
                                                    >
                                                        <Plus size={16} className={isVisible ? 'invisible' : 'text-slate-600'} />
                                                        <span className="text-sm flex-1">
                                                            {stat.name}
                                                        </span>
                                                        {isVisible && (
                                                            <span className="text-xs text-slate-400">Déjà affichée</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {visibleStats.activeStudents && (
                                <div 
                                    className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-5 shadow-md border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105 relative cursor-pointer"
                                    onClick={() => {
                                        setTargetStatsSection("activeStudents");
                                        setCurrentPage("stats");
                                    }}
                                    title="Cliquer pour voir les détails"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVisibleStats({ ...visibleStats, activeStudents: false });
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors text-slate-600 hover:text-slate-800 z-10"
                                        title="Fermer cette statistique"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 text-sm font-medium">
                                            Élèves actifs
                                        </span>
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <Users size={20} className="text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        142
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                        <TrendingUp size={14} />
                                        <span>+12% ce mois</span>
                                    </div>
                                </div>
                            )}

                            {visibleStats.plannedCourses && (
                                <div 
                                    className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200 relative cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105"
                                    onClick={() => {
                                        setTargetStatsSection("plannedCourses");
                                        setCurrentPage("stats");
                                    }}
                                    title="Cliquer pour voir les détails"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVisibleStats({ ...visibleStats, plannedCourses: false });
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors text-slate-600 hover:text-slate-800 z-10"
                                        title="Fermer cette statistique"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 text-sm font-medium">
                                            Cours planifiés
                                        </span>
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <Calendar size={20} className="text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        87
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                        <TrendingUp size={14} />
                                        <span>+8% vs mois dernier</span>
                                    </div>
                                </div>
                            )}

                            {visibleStats.completedCourses && (
                                <div 
                                    className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200 relative cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105"
                                    onClick={() => {
                                        setTargetStatsSection("completedCourses");
                                        setCurrentPage("stats");
                                    }}
                                    title="Cliquer pour voir les détails"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVisibleStats({ ...visibleStats, completedCourses: false });
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors text-slate-600 hover:text-slate-800 z-10"
                                        title="Fermer cette statistique"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 text-sm font-medium">
                                            Cours réalisés
                                        </span>
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <CheckCircle size={20} className="text-emerald-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        82
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                        <TrendingUp size={14} />
                                        <span>+15% vs mois dernier</span>
                                    </div>
                                </div>
                            )}

                            {visibleStats.occupancyRate && (
                                <div 
                                    className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200 relative cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105"
                                    onClick={() => {
                                        setTargetStatsSection("occupancyRate");
                                        setCurrentPage("stats");
                                    }}
                                    title="Cliquer pour voir les détails"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVisibleStats({ ...visibleStats, occupancyRate: false });
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors text-slate-600 hover:text-slate-800 z-10"
                                        title="Fermer cette statistique"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 text-sm font-medium">
                                            Taux occupation
                                        </span>
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <BarChart3 size={20} className="text-green-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        92%
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: "92%" }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                        <TrendingUp size={14} />
                                        <span>+5% vs mois dernier</span>
                                    </div>
                                </div>
                            )}

                            {visibleStats.overages && (
                                <div 
                                    className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200 relative cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105"
                                    onClick={() => {
                                        setTargetStatsSection("overages");
                                        setCurrentPage("stats");
                                    }}
                                    title="Cliquer pour voir les détails"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVisibleStats({ ...visibleStats, overages: false });
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors text-slate-600 hover:text-slate-800 z-10"
                                        title="Fermer cette statistique"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 text-sm font-medium">
                                            Dépassements
                                        </span>
                                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                            <AlertCircle
                                                size={20}
                                                className="text-orange-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        3
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                        <TrendingDown size={14} />
                                        <span>-25% vs mois dernier</span>
                                    </div>
                                </div>
                            )}

                            {visibleStats.tutorCapacity && (
                                <div 
                                    className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200 relative cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105"
                                    onClick={() => {
                                        setTargetStatsSection("tutorCapacity");
                                        setCurrentPage("stats");
                                    }}
                                    title="Cliquer pour voir les détails"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVisibleStats({ ...visibleStats, tutorCapacity: false });
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors text-slate-600 hover:text-slate-800 z-10"
                                        title="Fermer cette statistique"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 text-sm font-medium">
                                            Capacité tuteurs
                                        </span>
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <Users size={20} className="text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        78%
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                        <TrendingUp size={14} />
                                        <span>+3% vs mois dernier</span>
                                    </div>
                                </div>
                            )}

                            {visibleStats.roomUsage && (
                                <div 
                                    className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200 relative cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105"
                                    onClick={() => {
                                        setTargetStatsSection("roomUsage");
                                        setCurrentPage("stats");
                                    }}
                                    title="Cliquer pour voir les détails"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVisibleStats({ ...visibleStats, roomUsage: false });
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors text-slate-600 hover:text-slate-800 z-10"
                                        title="Fermer cette statistique"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 text-sm font-medium">
                                            Utilisation salles
                                        </span>
                                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                                            <MapPin size={20} className="text-teal-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">
                                        85%
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                                        <div
                                            className="bg-teal-500 h-2 rounded-full"
                                            style={{ width: "85%" }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                        <TrendingUp size={14} />
                                        <span>+7% vs mois dernier</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Schedule with New Layout - SECOND */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Vue hebdomadaire
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={goToPreviousWeek}
                                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center"
                                            title="Semaine précédente"
                                        >
                                            <ChevronLeft size={18} className="text-slate-700" />
                                        </button>
                                        <button
                                            onClick={goToCurrentWeek}
                                            disabled={isCurrentWeek()}
                                            className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                                                isCurrentWeek() 
                                                    ? 'bg-slate-100 text-slate-500 cursor-default' 
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                            }`}
                                            title={isCurrentWeek() ? "Semaine actuelle" : "Retour à cette semaine"}
                                        >
                                            {formatWeekRange(currentWeekStart)}
                                        </button>
                                        <button
                                            onClick={goToNextWeek}
                                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center"
                                            title="Semaine suivante"
                                        >
                                            <ChevronRight size={18} className="text-slate-700" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    <Printer size={16} />
                                    Imprimer
                                </button>
                                <button 
                                    onClick={() => setCurrentPage("placement")}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Nouveau cours
                                </button>
                            </div>
                        </div>

                        {/* Day tabs */}
                        <div className="flex gap-3 mb-6 flex-wrap">
                            {getDaysWithTimeSlots(timeSlots).map((day) => (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${selectedDay === day
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md"
                                        }`}
                                >
                                    {formatDayWithDate(day, currentWeekStart)}
                                </button>
                            ))}
                        </div>

                        {/* New Grid Layout: Time slots horizontally, Rooms vertically */}
                        <div className="w-full overflow-x-auto -mx-6 px-6">
                            <table className="w-full border-collapse min-w-max">
                                <thead>
                                    <tr>
                                        <th className="p-3 text-left bg-slate-50 border border-slate-200">
                                            <span className="text-sm font-semibold text-slate-700">
                                                Salles / Créneaux
                                            </span>
                                        </th>
                                        {filteredTimeSlots.length > 0 ? (
                                            filteredTimeSlots.map((slot) => (
                                                <th
                                                    key={slot.id}
                                                    className="p-3 text-center bg-slate-50 border border-slate-200 min-w-[150px] relative"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-sm font-semibold text-slate-700">
                                                            {slot.label}
                                                        </span>
                                                        {hasEditPermissions && (
                                                            <div className="relative time-slot-menu">
                                                                <button
                                                                    onClick={() => setSelectedSlotForMenu(selectedSlotForMenu === slot.id ? null : slot.id)}
                                                                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                                    title="Gérer le créneau"
                                                                >
                                                                    <Menu size={14} className="text-slate-600" />
                                                                </button>
                                                                {selectedSlotForMenu === slot.id && (
                                                                    <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                                                                        <button
                                                                            onClick={() => {
                                                                                // Edit time slot - redirect to settings
                                                                                setCurrentPage("settings");
                                                                                setSelectedSlotForMenu(null);
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                                        >
                                                                            <Settings size={14} />
                                                                            <span>Modifier</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                // Delete time slot
                                                                                if (confirm(`Êtes-vous sûr de vouloir supprimer le créneau ${slot.label}?`)) {
                                                                                    setTimeSlots(timeSlots.filter(s => s.id !== slot.id));
                                                                                    setSelectedSlotForMenu(null);
                                                                                }
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                            <span>Supprimer</span>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </th>
                                            ))
                                        ) : (
                                            <th className="p-3 text-center bg-slate-50 border border-slate-200">
                                                <span className="text-sm font-semibold text-slate-500 italic">
                                                    Aucun cours
                                                </span>
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilteredRooms().map((room, roomIdx) => (
                                        <tr key={room} className={`transition-colors duration-200 hover:bg-orange-50 ${roomIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                            <td className="p-3 bg-inherit border border-slate-200 font-semibold text-slate-900 whitespace-nowrap hover:bg-orange-100 transition-colors">
                                                {room}
                                            </td>
                                            {filteredTimeSlots.length > 0 ? (
                                                filteredTimeSlots.map((slot) => {
                                                    const roomCourses =
                                                        getCoursesForRoomAndSlotLocal(
                                                            room,
                                                            slot.startTime
                                                        );
                                                    return (
                                                        <td
                                                            key={`${room}-${slot.id}`}
                                                            className="p-2 border border-slate-200 min-w-[200px] align-top"
                                                        >
                                                        {roomCourses.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {roomCourses.map(
                                                                    (course, idx) => {
                                                                        const courseIndex = findCourseIndex(room, slot.startTime, course);
                                                                        const hasOverrun = detectOverrun(course);
                                                                        const hasConflict = detectConflict(course, room, slot.startTime);
                                                                        const isIncomplete = detectIncompleteCourse(course);
                                                                        const alertCount = [hasOverrun, hasConflict, isIncomplete].filter(Boolean).length;
                                                                        
                                                                        return (
                                                                            <div
                                                                                key={idx}
                                                                                className={`bg-white rounded-lg shadow-sm overflow-hidden relative ${
                                                                                    hasOverrun ? 'border-2 border-red-400' : 
                                                                                    hasConflict ? 'border-2 border-orange-400' : 
                                                                                    isIncomplete ? 'border-2 border-amber-400' : 
                                                                                    'border border-slate-200'
                                                                                }`}
                                                                            >
                                                                                {/* Alert Badge */}
                                                                                {alertCount > 0 && (
                                                                                    <div className="absolute top-1 right-1 z-10">
                                                                                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                                                                            hasOverrun ? 'bg-red-500 text-white' :
                                                                                            hasConflict ? 'bg-orange-500 text-white' :
                                                                                            'bg-amber-500 text-white'
                                                                                        }`}>
                                                                                            <AlertCircle size={10} />
                                                                                            {alertCount > 1 && <span>{alertCount}</span>}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                                {/* Course Header Section */}
                                                                                <div 
                                                                                    className={`${course.color} text-white px-3 py-2 text-xs font-semibold relative`}
                                                                                    onClick={() => setSelectedCourseForDetails(course)}
                                                                                >
                                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                                        <span className="opacity-90">Tutorat avec {course.tutor.split(' ')[0]} {course.tutor.split(' ')[1]?.[0]}.</span>
                                                                                        {/* Alert indicators in header */}
                                                                                        <div className="flex items-center gap-1">
                                                                                            {hasOverrun && (
                                                                                                <div className="flex items-center gap-0.5 bg-red-500/30 px-1.5 py-0.5 rounded text-[10px]">
                                                                                                    <AlertCircle size={10} />
                                                                                                    <span>Dépassement</span>
                                                                                                </div>
                                                                                            )}
                                                                                            {hasConflict && (
                                                                                                <div className="flex items-center gap-0.5 bg-orange-500/30 px-1.5 py-0.5 rounded text-[10px]">
                                                                                                    <AlertCircle size={10} />
                                                                                                    <span>Conflit</span>
                                                                                                </div>
                                                                                            )}
                                                                                            {isIncomplete && (
                                                                                                <div className="flex items-center gap-0.5 bg-amber-500/30 px-1.5 py-0.5 rounded text-[10px]">
                                                                                                    <AlertCircle size={10} />
                                                                                                    <span>Incomplet</span>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    {(() => {
                                                                                        const coursePG = calculateCoursePG(course);
                                                                                        const tutorCapacity = getTutorCapacity(course.tutor);
                                                                                        const percentage = tutorCapacity > 0 ? Math.round((coursePG / tutorCapacity) * 100) : 0;
                                                                                        const isNearFull = percentage >= 80;
                                                                                        const isFull = percentage >= 100;
                                                                                        
                                                                                        return (
                                                                                            <div className="flex items-center gap-2">
                                                                                                <div className="flex-1 bg-white/20 rounded-full h-1.5 overflow-hidden">
                                                                                                    <div 
                                                                                                        className={`h-full transition-all duration-300 ${
                                                                                                            isFull ? 'bg-red-200' : isNearFull ? 'bg-yellow-200' : 'bg-white/60'
                                                                                                        }`}
                                                                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                                                                    />
                                                                                                </div>
                                                                                                <span className="text-[10px] opacity-90 font-medium whitespace-nowrap">
                                                                                                    {coursePG}/{tutorCapacity} PG
                                                                                                </span>
                                                                                            </div>
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                                
                                                                                {/* Students Section */}
                                                                                {course.studentNames && course.studentNames.length > 0 ? (
                                                                                    <div className="p-2 flex flex-col gap-1.5 min-h-[60px]">
                                                                                        {course.studentNames.map((studentName, studentIdx) => {
                                                                                            const grade = getStudentGrade(studentName);
                                                                                            const formattedName = formatStudentName(studentName, grade);
                                                                                            const isPresent = course.attendance?.[studentName] !== false; // Default to true if undefined
                                                                                            
                                                                                            return (
                                                                                                <div
                                                                                                    key={studentIdx}
                                                                                                    onClick={(e) => {
                                                                                                        e.stopPropagation();
                                                                                                        toggleAttendance(selectedDay, courseIndex, studentName);
                                                                                                    }}
                                                                                                    className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                                                                                        isPresent
                                                                                                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300'
                                                                                                            : 'bg-gray-100 text-gray-500 border border-gray-200 line-through hover:bg-gray-200 hover:border-gray-300'
                                                                                                    }`}
                                                                                                    title={isPresent ? "Cliquer pour marquer absent" : "Cliquer pour marquer présent"}
                                                                                                >
                                                                                                    {isPresent ? (
                                                                                                        <Check size={12} className="text-green-600" />
                                                                                                    ) : (
                                                                                                        <X size={12} className="text-gray-400" />
                                                                                                    )}
                                                                                                    <span>{formattedName}</span>
                                                                                                </div>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="p-3 text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded">
                                                                                        <AlertCircle size={14} className="inline mr-1" />
                                                                                        {course.students || 0} élève(s) non spécifié(s)
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div 
                                                                className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-300 hover:border-slate-300 transition-colors cursor-pointer h-20 flex flex-col items-center justify-center gap-2 relative"
                                                                onClick={() => {
                                                                    if (hasEditPermissions) {
                                                                        setSelectedCellForAdd({room, slotId: slot.id});
                                                                        setCurrentPage("placement");
                                                                    }
                                                                }}
                                                            >
                                                                <span className="text-xs">
                                                                    Libre
                                                                </span>
                                                                {hasEditPermissions && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedCellForAdd({room, slotId: slot.id});
                                                                            setCurrentPage("placement");
                                                                        }}
                                                                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-slate-50 rounded-lg"
                                                                        title="Ajouter un cours"
                                                                    >
                                                                        <div className="flex flex-col items-center gap-1">
                                                                            <Plus size={20} className="text-orange-500" />
                                                                            <span className="text-xs text-orange-600 font-medium">Ajouter un cours</span>
                                                                        </div>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                                })
                                            ) : (
                                                <td colSpan={1} className="p-2 border border-slate-200 text-center text-slate-400 italic">
                                                    Aucun créneau disponible
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Course Details Modal */}
                {selectedCourseForDetails && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedCourseForDetails(null)}
                    >
                        <div 
                            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-900">Détails du cours</h3>
                                    <button
                                        onClick={() => setSelectedCourseForDetails(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X size={20} className="text-slate-500" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {/* Course Info */}
                                <div className="mb-6">
                                    <div className={`${selectedCourseForDetails.color} text-white rounded-lg p-4 mb-4`}>
                                        <div className="font-bold text-lg mb-1">Tutorat avec {selectedCourseForDetails.tutor}</div>
                                        <div className="text-sm opacity-90">{selectedCourseForDetails.room} • {selectedCourseForDetails.time}</div>
                                    </div>
                                    
                                    {(() => {
                                        const group = getGroupForCourse(selectedCourseForDetails);
                                        return (
                                            <>
                                                {/* Tutor Info */}
                                                <div className="mb-4">
                                                    <div className="text-sm font-semibold text-slate-700 mb-2">Tuteur:</div>
                                                    <div className="text-lg font-medium text-slate-900">{selectedCourseForDetails.tutor}</div>
                                                    {group && group.tutor && (
                                                        <div className="text-xs text-slate-500 mt-1">Tuteur du groupe</div>
                                                    )}
                                                </div>

                                                {/* Group Info */}
                                                {group && (
                                                    <div className="mb-4 border-2 rounded-xl p-4 border-slate-200 bg-white">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="font-semibold text-slate-900">{group.name}</div>
                                                            <div className={`text-xs px-2 py-1 rounded-full ${
                                                                group.tutor ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                            }`}>
                                                                {group.tutor ? "Avec tuteur" : "Sans tuteur"}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-slate-600 mb-2">
                                                            {group.tutor ? `Tuteur: ${group.tutor}` : "Aucun tuteur assigné"}
                                                        </div>
                                                        {/* Students Section */}
                                                        {group.students && group.students.length > 0 ? (
                                                            <div className="mb-3">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Users size={14} className="text-slate-400" />
                                                                    <span className="text-xs text-slate-600 font-medium">{group.students.length} élève(s)</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {group.students.slice(0, 4).map((studentName, idx) => {
                                                                        const grade = getStudentGrade(studentName);
                                                                        const formattedName = formatStudentName(studentName, grade);
                                                                        return (
                                                                            <div
                                                                                key={idx}
                                                                                className="px-2 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200"
                                                                                title={studentName}
                                                                            >
                                                                                {formattedName}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {group.students.length > 4 && (
                                                                        <div className="px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                                            +{group.students.length - 4}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Users size={14} className="text-slate-400" />
                                                                <span className="text-sm text-slate-600">0 élève(s)</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-end">
                                                            <div className="text-xs text-slate-500 font-medium">
                                                                {group.totalPG} PG
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Students List */}
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-700 mb-3">
                                                        Élèves ({selectedCourseForDetails.studentNames?.length || selectedCourseForDetails.students}):
                                                    </div>
                                                    {selectedCourseForDetails.studentNames && selectedCourseForDetails.studentNames.length > 0 ? (
                                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                                            {selectedCourseForDetails.studentNames.map((studentName, idx) => {
                                                                const grade = getStudentGrade(studentName);
                                                                const formattedName = formatStudentName(studentName, grade);
                                                                const isPresent = selectedCourseForDetails.attendance?.[studentName] !== false;
                                                                return (
                                                                    <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg ${
                                                                        isPresent ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                                                                    }`}>
                                                                        {isPresent ? (
                                                                            <Check size={16} className="text-green-600" />
                                                                        ) : (
                                                                            <X size={16} className="text-gray-400" />
                                                                        )}
                                                                        <span className={`flex-1 ${isPresent ? 'text-slate-900' : 'text-gray-500 line-through'}`}>
                                                                            {formattedName}
                                                                        </span>
                                                                        <span className={`text-xs font-medium ${
                                                                            isPresent ? 'text-green-700' : 'text-gray-500'
                                                                        }`}>
                                                                            {isPresent ? "Présent" : "Absent"}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-slate-500 text-sm">
                                                            {selectedCourseForDetails.students} élève(s) non spécifié(s)
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Personnel Page
    const PersonnelPage = () => {
        const [searchQuery, setSearchQuery] = useState("");
        const [personnelFilter, setPersonnelFilter] = useState<"tuteur" | "eleve">("tuteur");
        const [selectedPerson, setSelectedPerson] = useState<any>(null);
        const [selectedGroup, setSelectedGroup] = useState<Groupe | null>(null);
        const [showFilters, setShowFilters] = useState(false);

        // Filter states for tuteurs
        const [specialiteFilter, setSpecialiteFilter] = useState<string[]>([]);
        const [statusFilter, setStatusFilter] = useState<string[]>([]);
        const [typeTuteurFilter, setTypeTuteurFilter] = useState<string[]>([]);
        const [groupeFilter, setGroupeFilter] = useState<string>("");

        // Filter states for élèves
        const [gradeFilter, setGradeFilter] = useState<string[]>([]);
        const [pgFilter, setPgFilter] = useState<string>("");
        const [availabilityDateFilter, setAvailabilityDateFilter] = useState<string>("");
        const [availabilityTimeSlotFilter, setAvailabilityTimeSlotFilter] = useState<string[]>([]);

        // Export menu state
        const [showExportMenu, setShowExportMenu] = useState(false);

        // Modal states
        const [showStudentForm, setShowStudentForm] = useState(false);
        const [showTutorForm, setShowTutorForm] = useState(false);
        const [showGroupForm, setShowGroupForm] = useState(false);
        const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
        const [showImportModal, setShowImportModal] = useState(false);
        const [editingItem, setEditingItem] = useState<any>(null);
        const [availabilityType, setAvailabilityType] = useState<"long" | "court" | "ponctuel">("long");

        // User role for security (mock - should come from auth system)
        const [userRole] = useState<"admin" | "tuteur" | "apprenti">("admin");
        const canViewSensitiveData = userRole === "admin" || userRole === "tuteur";

        // Close export menu when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                if (showExportMenu && !target.closest('.export-menu-container')) {
                    setShowExportMenu(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [showExportMenu]);

        // Clear invalid time slot selections when date changes
        useEffect(() => {
            if (availabilityDateFilter && availabilityTimeSlotFilter.length > 0) {
                const selectedDay = (() => {
                    const date = new Date(availabilityDateFilter);
                    const dayIndex = date.getDay();
                    const dayNames: Day[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
                    return dayNames[dayIndex];
                })();
                
                const validTimeSlots = timeSlots.filter(ts => ts.daysOfWeek.includes(selectedDay));
                const validTimeSlotIds = validTimeSlots.map(ts => ts.id);
                const invalidSelections = availabilityTimeSlotFilter.filter(id => !validTimeSlotIds.includes(id));
                
                if (invalidSelections.length > 0) {
                    setAvailabilityTimeSlotFilter(availabilityTimeSlotFilter.filter(id => validTimeSlotIds.includes(id)));
                }
            }
        }, [availabilityDateFilter, availabilityTimeSlotFilter, timeSlots]);

        // State for data
        const [tuteurs, setTuteurs] = useState<Tuteur[]>([
            {
                id: 1,
                name: "Marie Dupont",
                prenom: "Marie",
                nom: "Dupont",
                type: "tuteur",
                typeTuteur: "Tuteur",
                courses: 8,
                capacity: "12/15 PG",
                status: "active",
                avatar: "from-blue-500 to-blue-600",
                email: "marie.dupont@lbn.com",
                phone: "514-555-0001",
                specialites: ["Mathématiques", "Sciences"],
                anneesConfortables: ["Sec. 3", "Sec. 4", "Sec. 5"],
                salaireHoraire: 35.50,
                capaciteGestion: 15,
                statistiques: {
                    heuresEnseignees: 120,
                    tauxCompletion: 95,
                    nombreCours: 45,
                    dateDebut: "2023-09-01",
                    nombreElevesDifferents: 8
                },
                prochainsCours: [
                    { day: "Lundi", time: "8h00", room: "Salle A", students: 3 },
                    { day: "Lundi", time: "15h30", room: "Salle A", students: 5 },
                    { day: "Mardi", time: "15h30", room: "Salle C", students: 5 },
                ],
                allergies: "Arachides, Fruits de mer",
                disponibilites: [
                    {
                        id: "t1-d1",
                        day: "Lundi",
                        startTime: "16:15",
                        endTime: "18:15",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                    {
                        id: "t1-d2",
                        day: "Mardi",
                        startTime: "18:30",
                        endTime: "20:30",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                    {
                        id: "t1-d3",
                        day: "Mercredi",
                        startTime: "16:15",
                        endTime: "18:15",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                ],
            },
            {
                id: 2,
                name: "Jean Martin",
                prenom: "Jean",
                nom: "Martin",
                type: "tuteur",
                typeTuteur: "Tuteur",
                courses: 6,
                capacity: "10/12 PG",
                status: "active",
                avatar: "from-purple-500 to-purple-600",
                email: "jean.martin@lbn.com",
                phone: "514-555-0002",
                specialites: ["Français", "Histoire"],
                anneesConfortables: ["Sec. 1", "Sec. 2", "Sec. 3"],
                salaireHoraire: 28.75,
                capaciteGestion: 15,
                statistiques: {
                    heuresEnseignees: 90,
                    tauxCompletion: 92,
                    nombreCours: 32,
                    dateDebut: "2023-10-15",
                    nombreElevesDifferents: 6
                },
                prochainsCours: [
                    { day: "Lundi", time: "8h00", room: "Salle B", students: 4 },
                    { day: "Lundi", time: "13h00", room: "Salle B", students: 4 },
                ],
                disponibilites: [
                    {
                        id: "t2-d1",
                        day: "Lundi",
                        startTime: "18:30",
                        endTime: "20:30",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                    {
                        id: "t2-d2",
                        day: "Jeudi",
                        startTime: "16:15",
                        endTime: "18:15",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                ],
            },
            {
                id: 3,
                name: "Sophie Chen",
                prenom: "Sophie",
                nom: "Chen",
                type: "tuteur",
                typeTuteur: "Administrateur",
                courses: 10,
                capacity: "15/15 PG",
                status: "full",
                avatar: "from-green-500 to-green-600",
                email: "sophie.chen@lbn.com",
                phone: "514-555-0003",
                specialites: ["Sciences", "Chimie"],
                anneesConfortables: ["Sec. 4", "Sec. 5"],
                salaireHoraire: 42.00,
                capaciteGestion: 15,
                statistiques: {
                    heuresEnseignees: 150,
                    tauxCompletion: 98,
                    nombreCours: 58,
                    dateDebut: "2022-01-10",
                    nombreElevesDifferents: 10
                },
                prochainsCours: [
                    { day: "Lundi", time: "10h30", room: "Salle A", students: 2 },
                    { day: "Mardi", time: "8h00", room: "Salle D", students: 2 },
                ],
                allergies: "Lactose",
                disponibilites: [
                    {
                        id: "t3-d1",
                        day: "Samedi",
                        startTime: "08:15",
                        endTime: "10:15",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                    {
                        id: "t3-d2",
                        day: "Samedi",
                        startTime: "10:30",
                        endTime: "12:30",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                    {
                        id: "t3-d3",
                        day: "Dimanche",
                        startTime: "13:00",
                        endTime: "15:00",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                ],
            },
            {
                id: 4,
                name: "Thomas Roy",
                prenom: "Thomas",
                nom: "Roy",
                type: "tuteur",
                typeTuteur: "Apprenti",
                courses: 4,
                capacity: "6/10 PG",
                status: "active",
                avatar: "from-orange-500 to-orange-600",
                email: "thomas.roy@lbn.com",
                phone: "514-555-0004",
                specialites: ["Anglais"],
                anneesConfortables: ["Sec. 1", "Sec. 2", "Sec. 3", "Sec. 4"],
                salaireHoraire: 25.00,
                capaciteGestion: 15,
                statistiques: {
                    heuresEnseignees: 60,
                    tauxCompletion: 88,
                    nombreCours: 20,
                    dateDebut: "2024-01-20",
                    nombreElevesDifferents: 4
                },
                prochainsCours: [
                    { day: "Lundi", time: "13h00", room: "Salle C", students: 3 },
                    { day: "Mardi", time: "13h00", room: "Salle A", students: 3 },
                ],
            },
        ]);

        const [eleves, setEleves] = useState<Eleve[]>([
            {
                id: 5,
                name: "Lucas Bernard",
                type: "eleve",
                age: 15,
                grade: "Sec. 3",
                pg: 3,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "lucas.bernard@student.com",
                emails: ["lucas.bernard@student.com", "lucas.parent@email.com"],
                phone: "514-555-1001",
                tuteur: "Marie Dupont",
                groupeId: 1,
                statistiques: {
                    tauxPresence: 95,
                    progression: 85,
                    nombreCours: 24
                },
                prochainsCours: [
                    { day: "Lundi", time: "8h00", subject: "Math", tuteur: "Marie Dupont" },
                    { day: "Mercredi", time: "10h30", subject: "Français", tuteur: "Jean Martin" },
                ],
                allergies: "Arachides",
                disponibilites: [
                    {
                        id: "e1-d1",
                        day: "Lundi",
                        startTime: "16:15",
                        endTime: "18:15",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                    {
                        id: "e1-d2",
                        day: "Mardi",
                        startTime: "18:30",
                        endTime: "20:30",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                ],
            },
            {
                id: 6,
                name: "Emma Tremblay",
                type: "eleve",
                age: 16,
                grade: "Sec. 4",
                pg: 2,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "emma.tremblay@student.com",
                emails: ["emma.tremblay@student.com"],
                phone: "514-555-1002",
                tuteur: "Jean Martin",
                groupeId: 2,
                statistiques: {
                    tauxPresence: 92,
                    progression: 78,
                    nombreCours: 20
                },
                prochainsCours: [
                    { day: "Lundi", time: "8h00", subject: "Français", tuteur: "Jean Martin" },
                ],
                allergies: "Gluten, Œufs",
                disponibilites: [
                    {
                        id: "e2-d1",
                        day: "Lundi",
                        startTime: "18:30",
                        endTime: "20:30",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                    {
                        id: "e2-d2",
                        day: "Jeudi",
                        startTime: "16:15",
                        endTime: "18:15",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                ],
            },
            {
                id: 7,
                name: "Noah Gagnon",
                type: "eleve",
                age: 17,
                grade: "Sec. 5",
                pg: 4,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "noah.gagnon@student.com",
                emails: ["noah.gagnon@student.com"],
                phone: "514-555-1003",
                tuteur: "Sophie Chen",
                groupeId: 3,
                statistiques: {
                    tauxPresence: 98,
                    progression: 92,
                    nombreCours: 28
                },
                prochainsCours: [
                    { day: "Mardi", time: "10h30", subject: "Sciences", tuteur: "Sophie Chen" },
                ],
                disponibilites: [
                    {
                        id: "e3-d1",
                        day: "Samedi",
                        startTime: "08:15",
                        endTime: "10:15",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                    {
                        id: "e3-d2",
                        day: "Samedi",
                        startTime: "10:30",
                        endTime: "12:30",
                        type: "recurrente",
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        active: true
                    },
                ],
            },
            {
                id: 8,
                name: "Olivia Côté",
                type: "eleve",
                age: 15,
                grade: "Sec. 3",
                pg: 2,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "olivia.cote@student.com",
                emails: ["olivia.cote@student.com"],
                phone: "514-555-1004",
                tuteur: "Thomas Roy",
                statistiques: {
                    tauxPresence: 90,
                    progression: 75,
                    nombreCours: 18
                },
                prochainsCours: [
                    { day: "Lundi", time: "13h00", subject: "Anglais", tuteur: "Thomas Roy" },
                ],
            },
            {
                id: 9,
                name: "William Roy",
                type: "eleve",
                age: 16,
                grade: "Sec. 4",
                pg: 3,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "william.roy@student.com",
                emails: ["william.roy@student.com"],
                phone: "514-555-1005",
                tuteur: "Marie Dupont",
                groupeId: 1,
                statistiques: {
                    tauxPresence: 93,
                    progression: 80,
                    nombreCours: 22
                },
                prochainsCours: [
                    { day: "Lundi", time: "15h30", subject: "Math", tuteur: "Marie Dupont" },
                ],
                allergies: "Fruits de mer",
            },
        ]);

        const [groupes, setGroupes] = useState<Groupe[]>([
            {
                id: 1,
                name: "Groupe Math Avancé",
                tuteurId: 1,
                tuteurName: "Marie Dupont",
                eleveIds: [5, 9],
                eleveNames: ["Lucas Bernard", "William Roy"],
                pgTotal: 6,
            },
            {
                id: 2,
                name: "Groupe Sec. 3",
                eleveIds: [5, 8],
                eleveNames: ["Lucas Bernard", "Olivia Côté"],
                pgTotal: 5,
            },
            {
                id: 3,
                name: "Groupe Sciences",
                tuteurId: 3,
                tuteurName: "Sophie Chen",
                eleveIds: [7],
                eleveNames: ["Noah Gagnon"],
                pgTotal: 4,
            },
        ]);

        // Calculate PG used by tutors from their assigned students
        const calculatePGUsed = (tuteurName: string): number => {
            return eleves
                .filter(eleve => eleve.tuteur === tuteurName)
                .reduce((total, eleve) => total + eleve.pg, 0);
        };

        // Update tutor capacities based on assigned students
        const tuteursWithUpdatedCapacity = tuteurs.map(tuteur => {
            const pgUsed = calculatePGUsed(tuteur.name);
            return {
                ...tuteur,
                capacity: `${pgUsed}/${tuteur.capaciteGestion} PG`
            };
        });

        // Helper function to get day name from date string
        const getDayNameFromDate = (dateString: string): Day | null => {
            if (!dateString) return null;
            const date = new Date(dateString);
            const dayIndex = date.getDay();
            const dayNames: Day[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            return dayNames[dayIndex];
        };

        // Helper function to check if date is within range
        const isDateInRange = (dateString: string, startDate?: string, endDate?: string): boolean => {
            if (!dateString) return true;
            const date = new Date(dateString);
            if (startDate) {
                const start = new Date(startDate);
                if (date < start) return false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Include the end date
                if (date > end) return false;
            }
            return true;
        };

        // Helper function to check if time slot matches availability
        const matchesTimeSlot = (availabilityStart: string, availabilityEnd: string, timeSlotId: string): boolean => {
            const timeSlot = timeSlots.find(ts => ts.id === timeSlotId);
            if (!timeSlot) return false;
            return availabilityStart === timeSlot.startTime && availabilityEnd === timeSlot.endTime;
        };

        // Filter personnel based on type, search query, and advanced filters
        const filteredPersonnel = (personnelFilter === "tuteur" ? tuteursWithUpdatedCapacity : eleves).filter((person) => {
            // Search filter - includes name and alias
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = person.name.toLowerCase().includes(searchLower) ||
                (person.alias && person.alias.toLowerCase().includes(searchLower));

            if (personnelFilter === "tuteur") {
                const tuteur = person as Tuteur;
                const matchesSpecialite = specialiteFilter.length === 0 ||
                    specialiteFilter.some(spec => tuteur.specialites.includes(spec));
                const matchesStatus = statusFilter.length === 0 || statusFilter.includes(tuteur.status);
                const matchesTypeTuteur = typeTuteurFilter.length === 0 || 
                    (tuteur.typeTuteur && typeTuteurFilter.includes(tuteur.typeTuteur));
                const matchesGroupe = groupeFilter === "" || 
                    (tuteur.groupeId && tuteur.groupeId.toString() === groupeFilter);

                // Availability filter
                let matchesAvailability = true;
                if (availabilityDateFilter || availabilityTimeSlotFilter.length > 0) {
                    matchesAvailability = false;
                    if (tuteur.disponibilites && tuteur.disponibilites.length > 0) {
                        const selectedDay = availabilityDateFilter ? getDayNameFromDate(availabilityDateFilter) : null;
                        
                        for (const disponibilite of tuteur.disponibilites) {
                            if (!disponibilite.active) continue;
                            
                            // Check if date is in range
                            if (availabilityDateFilter && !isDateInRange(availabilityDateFilter, disponibilite.startDate, disponibilite.endDate)) {
                                continue;
                            }
                            
                            // Check day match
                            if (selectedDay && disponibilite.day !== selectedDay) {
                                continue;
                            }
                            
                            // Check time slot match
                            if (availabilityTimeSlotFilter.length > 0) {
                                const matchesTimeSlotFilter = availabilityTimeSlotFilter.some(tsId => 
                                    matchesTimeSlot(disponibilite.startTime, disponibilite.endTime, tsId)
                                );
                                if (!matchesTimeSlotFilter) {
                                    continue;
                                }
                            }
                            
                            // If we have date filter, we need both date and (optionally) time slot match
                            // If we only have time slot filter, we need time slot match
                            if (availabilityDateFilter) {
                                // Date is selected: need day match and optionally time slot match
                                if (selectedDay === disponibilite.day && 
                                    (availabilityTimeSlotFilter.length === 0 || availabilityTimeSlotFilter.some(tsId => 
                                        matchesTimeSlot(disponibilite.startTime, disponibilite.endTime, tsId)))) {
                                    matchesAvailability = true;
                                    break;
                                }
                            } else if (availabilityTimeSlotFilter.length > 0) {
                                // Only time slot filter: just need time slot match
                                if (availabilityTimeSlotFilter.some(tsId => 
                                    matchesTimeSlot(disponibilite.startTime, disponibilite.endTime, tsId))) {
                                    matchesAvailability = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                return matchesSearch && matchesSpecialite && matchesStatus && matchesTypeTuteur && matchesGroupe && matchesAvailability;
            } else {
                const eleve = person as Eleve;
                const matchesGrade = gradeFilter.length === 0 || gradeFilter.includes(eleve.grade);
                const matchesPg = pgFilter === "" || eleve.pg.toString() === pgFilter;
                const matchesGroupe = groupeFilter === "" || 
                    (eleve.groupeId && eleve.groupeId.toString() === groupeFilter);

                return matchesSearch && matchesGrade && matchesPg && matchesGroupe;
            }
        });

        // Count active filters
        const activeFiltersCount = personnelFilter === "tuteur"
            ? specialiteFilter.length + statusFilter.length + typeTuteurFilter.length + (groupeFilter ? 1 : 0) + (availabilityDateFilter ? 1 : 0) + availabilityTimeSlotFilter.length
            : gradeFilter.length + (pgFilter ? 1 : 0) + (groupeFilter ? 1 : 0);

        // Form state for student
        const [studentFormData, setStudentFormData] = useState({
            name: "",
            age: "",
            grade: "",
            pg: "",
            emails: [""],
            phone: "",
            difficultes: "",
            allergies: "",
            alias: "",
            tuteur: "",
        });

        // Form state for tutor
        const [tutorFormData, setTutorFormData] = useState({
            prenom: "",
            nom: "",
            typeTuteur: "Tuteur" as "Apprenti" | "Tuteur" | "Administrateur",
            specialites: [] as string[],
            salaireHoraire: "",
            capaciteGestion: "",
            email: "",
            phone: "",
            allergies: "",
            alias: "",
            anneesConfortables: [] as string[],
        });

        // Form state for group
        const [groupFormData, setGroupFormData] = useState({
            name: "",
            tuteurId: "",
            eleveIds: [] as number[],
        });

        // Handler functions
        const handleAddStudent = () => {
            setEditingItem(null);
            setStudentFormData({
                name: "",
                age: "",
                grade: "",
                pg: "",
                emails: [""],
                phone: "",
                difficultes: "",
                allergies: "",
                alias: "",
                tuteur: "",
            });
            setShowStudentForm(true);
        };

        const handleEditStudent = (eleve: Eleve) => {
            setEditingItem(eleve);
            setStudentFormData({
                name: eleve.name,
                age: eleve.age?.toString() || "",
                grade: eleve.grade,
                pg: eleve.pg.toString(),
                emails: eleve.emails && eleve.emails.length > 0 ? eleve.emails : [eleve.email],
                phone: eleve.phone,
                difficultes: eleve.difficultes || "",
                allergies: eleve.allergies || "",
                alias: eleve.alias || "",
                tuteur: eleve.tuteur,
            });
            setShowStudentForm(true);
        };

        const handleSaveStudent = () => {
            if (!studentFormData.name || !studentFormData.grade || !studentFormData.pg) {
                alert("Veuillez remplir tous les champs obligatoires");
                return;
            }

            const newStudent: Eleve = {
                id: editingItem ? editingItem.id : Math.max(...eleves.map(e => e.id), 0) + 1,
                name: studentFormData.name,
                type: "eleve",
                age: studentFormData.age ? parseInt(studentFormData.age) : undefined,
                grade: studentFormData.grade,
                pg: parseInt(studentFormData.pg),
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: studentFormData.emails[0] || "",
                emails: studentFormData.emails.filter(e => e.trim() !== ""),
                phone: studentFormData.phone,
                tuteur: studentFormData.tuteur || "",
                difficultes: studentFormData.difficultes || undefined,
                allergies: studentFormData.allergies || undefined,
                alias: studentFormData.alias || undefined,
                groupeId: groupeFilter ? parseInt(groupeFilter) : undefined,
                prochainsCours: editingItem ? (editingItem as Eleve).prochainsCours : [],
                statistiques: editingItem ? (editingItem as Eleve).statistiques : undefined,
            };

            if (editingItem) {
                setEleves(eleves.map(e => e.id === editingItem.id ? newStudent : e));
            } else {
                setEleves([...eleves, newStudent]);
            }

            setShowStudentForm(false);
            setEditingItem(null);
        };

        const handleDeleteStudent = (eleve: Eleve) => {
            if (confirm(`Êtes-vous sûr de vouloir supprimer l'élève ${eleve.name}?`)) {
                setEleves(eleves.filter(e => e.id !== eleve.id));
                if (selectedPerson?.id === eleve.id) {
                    setSelectedPerson(null);
                }
            }
        };

        const handleAddTutor = () => {
            setEditingItem(null);
            setTutorFormData({
                prenom: "",
                nom: "",
                typeTuteur: "Tuteur",
                specialites: [],
                salaireHoraire: "",
                capaciteGestion: "",
                email: "",
                phone: "",
                allergies: "",
                alias: "",
                anneesConfortables: [],
            });
            setShowTutorForm(true);
        };

        const handleEditTutor = (tuteur: Tuteur) => {
            setEditingItem(tuteur);
            setTutorFormData({
                prenom: tuteur.prenom || "",
                nom: tuteur.nom || "",
                typeTuteur: tuteur.typeTuteur || "Tuteur",
                specialites: tuteur.specialites || [],
                salaireHoraire: tuteur.salaireHoraire.toString(),
                capaciteGestion: tuteur.capaciteGestion.toString(),
                email: tuteur.email,
                phone: tuteur.phone,
                allergies: tuteur.allergies || "",
                alias: tuteur.alias || "",
                anneesConfortables: tuteur.anneesConfortables || [],
            });
            setShowTutorForm(true);
        };

        const handleSaveTutor = () => {
            if (!tutorFormData.prenom || !tutorFormData.nom || !tutorFormData.email || !tutorFormData.capaciteGestion) {
                alert("Veuillez remplir tous les champs obligatoires");
                return;
            }

            const newTutor: Tuteur = {
                id: editingItem ? editingItem.id : Math.max(...tuteurs.map(t => t.id), 0) + 1,
                name: `${tutorFormData.prenom} ${tutorFormData.nom}`,
                prenom: tutorFormData.prenom,
                nom: tutorFormData.nom,
                type: "tuteur",
                typeTuteur: tutorFormData.typeTuteur,
                courses: editingItem ? (editingItem as Tuteur).courses : 0,
                capacity: editingItem ? (editingItem as Tuteur).capacity : "0/" + tutorFormData.capaciteGestion + " PG",
                status: "active",
                avatar: editingItem ? (editingItem as Tuteur).avatar : "from-blue-500 to-blue-600",
                email: tutorFormData.email,
                phone: tutorFormData.phone,
                specialites: tutorFormData.specialites,
                anneesConfortables: tutorFormData.anneesConfortables,
                salaireHoraire: parseFloat(tutorFormData.salaireHoraire) || 0,
                capaciteGestion: parseInt(tutorFormData.capaciteGestion),
                allergies: tutorFormData.allergies || undefined,
                alias: tutorFormData.alias || undefined,
                groupeId: groupeFilter ? parseInt(groupeFilter) : undefined,
                prochainsCours: editingItem ? (editingItem as Tuteur).prochainsCours : [],
                statistiques: editingItem ? (editingItem as Tuteur).statistiques : undefined,
            };

            if (editingItem) {
                setTuteurs(tuteurs.map(t => t.id === editingItem.id ? newTutor : t));
            } else {
                setTuteurs([...tuteurs, newTutor]);
            }

            setShowTutorForm(false);
            setEditingItem(null);
        };

        const handleDeleteTutor = (tuteur: Tuteur) => {
            if (confirm(`Êtes-vous sûr de vouloir supprimer le tuteur ${tuteur.name}?`)) {
                setTuteurs(tuteurs.filter(t => t.id !== tuteur.id));
                if (selectedPerson?.id === tuteur.id) {
                    setSelectedPerson(null);
                }
            }
        };

        const handleAddGroup = () => {
            setEditingItem(null);
            setGroupFormData({
                name: "",
                tuteurId: "",
                eleveIds: [],
            });
            setShowGroupForm(true);
        };

        const handleEditGroup = (groupe: Groupe) => {
            setEditingItem(groupe);
            setGroupFormData({
                name: groupe.name,
                tuteurId: groupe.tuteurId?.toString() || "",
                eleveIds: groupe.eleveIds,
            });
            setShowGroupForm(true);
        };

        const handleSaveGroup = () => {
            if (!groupFormData.name) {
                alert("Veuillez entrer un nom pour le groupe");
                return;
            }

            const selectedEleves = eleves.filter(e => groupFormData.eleveIds.includes(e.id));
            const pgTotal = selectedEleves.reduce((sum, e) => sum + e.pg, 0);
            const tuteur = groupFormData.tuteurId ? tuteurs.find(t => t.id === parseInt(groupFormData.tuteurId)) : undefined;

            const newGroup: Groupe = {
                id: editingItem ? (editingItem as Groupe).id : Math.max(...groupes.map(g => g.id), 0) + 1,
                name: groupFormData.name,
                tuteurId: groupFormData.tuteurId ? parseInt(groupFormData.tuteurId) : undefined,
                tuteurName: tuteur?.name,
                eleveIds: groupFormData.eleveIds,
                eleveNames: selectedEleves.map(e => e.name),
                pgTotal: pgTotal,
            };

            if (editingItem) {
                setGroupes(groupes.map(g => g.id === (editingItem as Groupe).id ? newGroup : g));
            } else {
                setGroupes([...groupes, newGroup]);
            }

            setShowGroupForm(false);
            setEditingItem(null);
        };

        const handleDeleteGroup = (groupe: Groupe) => {
            if (confirm(`Êtes-vous sûr de vouloir supprimer le groupe ${groupe.name}?`)) {
                setGroupes(groupes.filter(g => g.id !== groupe.id));
                if (selectedGroup?.id === groupe.id) {
                    setSelectedGroup(null);
                }
            }
        };

        const handleRemoveStudentFromGroup = (studentId: number, groupId: number) => {
            const groupe = groupes.find(g => g.id === groupId);
            if (!groupe) return;

            const student = eleves.find(e => e.id === studentId);
            if (!student) return;

            const updatedEleveIds = groupe.eleveIds.filter(id => id !== studentId);
            const updatedEleveNames = groupe.eleveNames?.filter(name => name !== student.name) || [];
            const updatedPG = updatedEleveIds.reduce((sum, id) => {
                const eleve = eleves.find(e => e.id === id);
                return sum + (eleve ? eleve.pg : 0);
            }, 0);

            const updatedGroup: Groupe = {
                ...groupe,
                eleveIds: updatedEleveIds,
                eleveNames: updatedEleveNames,
                pgTotal: updatedPG,
            };

            setGroupes(groupes.map(g => g.id === groupId ? updatedGroup : g));
            if (selectedGroup?.id === groupId) {
                setSelectedGroup(updatedGroup);
            }
        };

        const handleAddStudentToGroup = (studentId: number, groupId: number) => {
            const groupe = groupes.find(g => g.id === groupId);
            if (!groupe) return;

            const student = eleves.find(e => e.id === studentId);
            if (!student) return;

            // Check if student is already in the group
            if (groupe.eleveIds.includes(studentId)) return;

            const updatedEleveIds = [...groupe.eleveIds, studentId];
            const updatedEleveNames = [...(groupe.eleveNames || []), student.name];
            const updatedPG = updatedEleveIds.reduce((sum, id) => {
                const eleve = eleves.find(e => e.id === id);
                return sum + (eleve ? eleve.pg : 0);
            }, 0);

            const updatedGroup: Groupe = {
                ...groupe,
                eleveIds: updatedEleveIds,
                eleveNames: updatedEleveNames,
                pgTotal: updatedPG,
            };

            setGroupes(groupes.map(g => g.id === groupId ? updatedGroup : g));
            if (selectedGroup?.id === groupId) {
                setSelectedGroup(updatedGroup);
            }
        };

        const handleAddTutorToGroup = (tutorId: number, groupId: number) => {
            const groupe = groupes.find(g => g.id === groupId);
            if (!groupe) return;

            const tutor = tuteurs.find(t => t.id === tutorId);
            if (!tutor) return;

            // Check if tutor is already assigned
            if (groupe.tuteurId === tutorId) return;

            const updatedGroup: Groupe = {
                ...groupe,
                tuteurId: tutorId,
                tuteurName: tutor.name,
            };

            setGroupes(groupes.map(g => g.id === groupId ? updatedGroup : g));
            if (selectedGroup?.id === groupId) {
                setSelectedGroup(updatedGroup);
            }
        };

        const handleRemoveTutorFromGroup = (groupId: number) => {
            const groupe = groupes.find(g => g.id === groupId);
            if (!groupe) return;

            const updatedGroup: Groupe = {
                ...groupe,
                tuteurId: undefined,
                tuteurName: undefined,
            };

            setGroupes(groupes.map(g => g.id === groupId ? updatedGroup : g));
            if (selectedGroup?.id === groupId) {
                setSelectedGroup(updatedGroup);
            }
        };

        const handleSaveGroupChanges = () => {
            if (!selectedGroup) return;
            
            // Update the group in the groupes array
            setGroupes(groupes.map(g => g.id === selectedGroup.id ? selectedGroup : g));
            
            // Show confirmation
            alert("Groupe sauvegardé avec succès!");
        };

        // Function to get the exact date (day and month) for a day of the week
        const getDateForDay = (day: Day): string => {
            const today = new Date();
            const dayNames: Day[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            const dayIndex = dayNames.indexOf(day);
            
            // Get the next occurrence of this day
            const currentDay = today.getDay();
            let daysUntilTarget = dayIndex - currentDay;
            if (daysUntilTarget < 0) {
                daysUntilTarget += 7; // Next week
            }
            
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + daysUntilTarget);
            
            const dayNum = targetDate.getDate();
            const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
            const month = monthNames[targetDate.getMonth()];
            
            return `${dayNum} ${month}`;
        };

        // Function to format student name: "Lucas B., Sec. 3"
        const formatStudentName = (studentName: string, grade: string | null): string => {
            const parts = studentName.trim().split(/\s+/);
            if (parts.length < 2) {
                return grade ? `${studentName}, ${grade}` : studentName;
            }
            const firstName = parts[0];
            const lastNameInitial = parts[parts.length - 1][0].toUpperCase();
            return grade ? `${firstName} ${lastNameInitial}., ${grade}` : `${firstName} ${lastNameInitial}.`;
        };

        // Function to get student grade from database
        const getStudentGrade = (studentName: string): string | null => {
            const student = eleves.find(s => s.name === studentName);
            return student ? student.grade : null;
        };

        // Function to get all courses for a group from placement page
        const getCoursesForGroup = (groupId: number): Array<{day: Day, course: Course}> => {
            const groupCourses: Array<{day: Day, course: Course}> = [];
            const allDays: Day[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
            
            allDays.forEach((day) => {
                const dayCourses = courses[day] || [];
                dayCourses.forEach((course) => {
                    if (course.groupId === groupId) {
                        groupCourses.push({ day, course });
                    }
                });
            });
            
            return groupCourses;
        };

        // Validate PG capacity
        const validatePGCapacity = (tuteurId: number, newPG: number): boolean => {
            const tuteur = tuteurs.find(t => t.id === tuteurId);
            if (!tuteur) return false;
            
            const currentPG = calculatePGUsed(tuteur.name);
            return currentPG + newPG <= tuteur.capaciteGestion;
        };

        // Export functions
        const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
            if (filteredPersonnel.length === 0) {
                alert('Aucune donnée à exporter');
                setShowExportMenu(false);
                return;
            }

            const dataToExport = personnelFilter === "tuteur" 
                ? filteredPersonnel.map(t => {
                    const tuteur = t as Tuteur;
                    return {
                        Nom: tuteur.name,
                        Email: tuteur.email,
                        Téléphone: tuteur.phone,
                        Spécialités: tuteur.specialites.join(', '),
                        "Années confortables": tuteur.anneesConfortables.join(', '),
                        "Salaire horaire": `$${tuteur.salaireHoraire.toFixed(2)}/heure`,
                        Capacité: tuteur.capacity,
                        Statut: tuteur.status === "active" ? "Disponible" : "Complet",
                        "Nombre de cours": tuteur.courses
                    };
                })
                : filteredPersonnel.map(e => {
                    const eleve = e as Eleve;
                    return {
                        Nom: eleve.name,
                        Email: eleve.email,
                        Téléphone: eleve.phone,
                        Niveau: eleve.grade,
                        PG: eleve.pg,
                        Statut: eleve.status === "active" ? "Actif" : "Inactif",
                        Tuteur: eleve.tuteur
                    };
                });

            const typeName = personnelFilter === "tuteur" ? "tuteurs" : "eleves";
            const timestamp = new Date().toISOString().split('T')[0];
            
            if (format === 'csv') {
                const headers = Object.keys(dataToExport[0] || {});
                const csvContent = [
                    headers.join(','),
                    ...dataToExport.map(row => 
                        headers.map(header => {
                            const value = row[header];
                            return `"${String(value).replace(/"/g, '""')}"`;
                        }).join(',')
                    )
                ].join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${typeName}_${timestamp}.csv`;
                link.click();
            } else if (format === 'excel') {
                // For Excel, we'll use CSV format (Excel can open CSV)
                const headers = Object.keys(dataToExport[0] || {});
                const csvContent = [
                    headers.join(','),
                    ...dataToExport.map(row => 
                        headers.map(header => {
                            const value = row[header];
                            return `"${String(value).replace(/"/g, '""')}"`;
                        }).join(',')
                    )
                ].join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${typeName}_${timestamp}.csv`;
                link.click();
            } else {
                // For PDF, create a simple HTML table
                const htmlContent = `
                    <html>
                        <head>
                            <title>${typeName}_${timestamp}</title>
                            <style>
                                table { border-collapse: collapse; width: 100%; }
                                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                th { background-color: #f2f2f2; }
                            </style>
                        </head>
                        <body>
                            <h1>${typeName.charAt(0).toUpperCase() + typeName.slice(1)} - ${timestamp}</h1>
                            <table>
                                <thead>
                                    <tr>
                                        ${Object.keys(dataToExport[0] || {}).map(key => `<th>${key}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${dataToExport.map(row => 
                                        `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>`
                                    ).join('')}
                                </tbody>
                            </table>
                        </body>
                    </html>
                `;
                
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${typeName}_${timestamp}.html`;
                link.click();
            }
            
            setShowExportMenu(false);
        };

        return (
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
                {/* Page Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <Users className="text-orange-500" size={28} />
                                Personnel
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Gérez vos tuteurs et élèves
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setShowImportModal(true)}
                                className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                <Upload size={16} />
                                Import CSV
                            </button>
                            <div className="relative export-menu-container">
                                <button 
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    Exporter
                                    <ChevronDown size={14} className={showExportMenu ? "transform rotate-180" : ""} />
                                </button>
                                {showExportMenu && (
                                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20 min-w-[160px]">
                                        <button
                                            onClick={() => handleExport('csv')}
                                            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm"
                                        >
                                            Export CSV
                                        </button>
                                        <button
                                            onClick={() => handleExport('excel')}
                                            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm"
                                        >
                                            Export Excel
                                        </button>
                                        <button
                                            onClick={() => handleExport('pdf')}
                                            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm"
                                        >
                                            Export PDF
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => {
                                    if (personnelFilter === "tuteur") {
                                        handleAddTutor();
                                    } else {
                                        handleAddStudent();
                                    }
                                }}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-3 gap-6 mb-6" style={{ height: 'calc(100vh - 280px)' }}>
                        {/* Left Panel - Search and Filter */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Recherche
                                </h3>
                                <div className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-medium">
                                    {personnelFilter === "tuteur" ? `${tuteursWithUpdatedCapacity.length} tuteurs` : `${eleves.length} élèves`}
                                </div>
                            </div>

                            {/* Search Bar with Clear Button and Filter */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Rechercher une personne..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-20 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="text-slate-400 hover:text-slate-700 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`relative p-1.5 rounded-lg transition-colors ${showFilters || activeFiltersCount > 0
                                            ? "bg-orange-100 text-orange-600"
                                            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                            }`}
                                    >
                                        <Filter size={16} />
                                        {activeFiltersCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Filter Popup */}
                                {showFilters && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-10">
                                        {personnelFilter === "tuteur" ? (
                                            // Tuteur filters
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Spécialités</label>
                                                    <div className="space-y-2">
                                                        {["Mathématiques", "Sciences", "Français", "Anglais", "Histoire", "Chimie"].map((spec) => (
                                                            <label key={spec} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={specialiteFilter.includes(spec)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSpecialiteFilter([...specialiteFilter, spec]);
                                                                        } else {
                                                                            setSpecialiteFilter(specialiteFilter.filter(s => s !== spec));
                                                                        }
                                                                    }}
                                                                    className="rounded text-orange-500 focus:ring-orange-500"
                                                                />
                                                                <span className="text-sm text-slate-700">{spec}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-200 pt-3">
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Type de tuteur</label>
                                                    <div className="space-y-2">
                                                        {["Apprenti", "Tuteur", "Administrateur"].map((type) => (
                                                            <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={typeTuteurFilter.includes(type)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setTypeTuteurFilter([...typeTuteurFilter, type]);
                                                                        } else {
                                                                            setTypeTuteurFilter(typeTuteurFilter.filter(t => t !== type));
                                                                        }
                                                                    }}
                                                                    className="rounded text-orange-500 focus:ring-orange-500"
                                                                />
                                                                <span className="text-sm text-slate-700">{type}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-200 pt-3">
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Statut</label>
                                                    <div className="space-y-2">
                                                        {[
                                                            { value: "active", label: "Disponible" },
                                                            { value: "full", label: "Complet" }
                                                        ].map((status) => (
                                                            <label key={status.value} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={statusFilter.includes(status.value)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setStatusFilter([...statusFilter, status.value]);
                                                                        } else {
                                                                            setStatusFilter(statusFilter.filter(s => s !== status.value));
                                                                        }
                                                                    }}
                                                                    className="rounded text-orange-500 focus:ring-orange-500"
                                                                />
                                                                <span className="text-sm text-slate-700">{status.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-200 pt-3">
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Disponibilité</label>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="text-xs text-slate-600 mb-1 block">Date</label>
                                                            <input
                                                                type="date"
                                                                value={availabilityDateFilter}
                                                                onChange={(e) => setAvailabilityDateFilter(e.target.value)}
                                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-slate-600 mb-2 block">Créneaux horaires</label>
                                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                                {(() => {
                                                                    // Filter time slots based on selected date's day of week
                                                                    const selectedDay = availabilityDateFilter ? (() => {
                                                                        const date = new Date(availabilityDateFilter);
                                                                        const dayIndex = date.getDay();
                                                                        const dayNames: Day[] = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
                                                                        return dayNames[dayIndex];
                                                                    })() : null;
                                                                    
                                                                    const availableTimeSlots = selectedDay 
                                                                        ? timeSlots.filter(ts => ts.daysOfWeek.includes(selectedDay))
                                                                        : timeSlots;
                                                                    
                                                                    return availableTimeSlots.length > 0 ? (
                                                                        availableTimeSlots.map((timeSlot) => (
                                                                            <label key={timeSlot.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={availabilityTimeSlotFilter.includes(timeSlot.id)}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.checked) {
                                                                                            setAvailabilityTimeSlotFilter([...availabilityTimeSlotFilter, timeSlot.id]);
                                                                                        } else {
                                                                                            setAvailabilityTimeSlotFilter(availabilityTimeSlotFilter.filter(id => id !== timeSlot.id));
                                                                                        }
                                                                                    }}
                                                                                    className="rounded text-orange-500 focus:ring-orange-500"
                                                                                />
                                                                                <span className="text-sm text-slate-700">{timeSlot.label}</span>
                                                                            </label>
                                                                        ))
                                                                    ) : (
                                                                        <p className="text-xs text-slate-500 italic">Sélectionnez une date pour voir les créneaux disponibles</p>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-200 pt-3">
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Groupe d'appartenance</label>
                                                    <select
                                                        value={groupeFilter}
                                                        onChange={(e) => setGroupeFilter(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                                    >
                                                        <option value="">Tous</option>
                                                        {groupes.map((g) => (
                                                            <option key={g.id} value={g.id.toString()}>{g.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        ) : (
                                            // Élève filters
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Niveau scolaire</label>
                                                    <div className="space-y-2">
                                                        {["Sec. 1", "Sec. 2", "Sec. 3", "Sec. 4", "Sec. 5"].map((grade) => (
                                                            <label key={grade} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={gradeFilter.includes(grade)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setGradeFilter([...gradeFilter, grade]);
                                                                        } else {
                                                                            setGradeFilter(gradeFilter.filter(g => g !== grade));
                                                                        }
                                                                    }}
                                                                    className="rounded text-orange-500 focus:ring-orange-500"
                                                                />
                                                                <span className="text-sm text-slate-700">{grade}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-200 pt-3">
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Points de Gestion (PG)</label>
                                                    <select
                                                        value={pgFilter}
                                                        onChange={(e) => setPgFilter(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                                    >
                                                        <option value="">Tous</option>
                                                        <option value="2">2 PG</option>
                                                        <option value="3">3 PG</option>
                                                        <option value="4">4 PG</option>
                                                        <option value="5">5 PG et plus</option>
                                                    </select>
                                                </div>

                                                <div className="border-t border-slate-200 pt-3">
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Groupe d'appartenance</label>
                                                    <select
                                                        value={groupeFilter}
                                                        onChange={(e) => setGroupeFilter(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                                    >
                                                        <option value="">Tous</option>
                                                        {groupes.map((g) => (
                                                            <option key={g.id} value={g.id.toString()}>{g.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* Filter Actions */}
                                        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200">
                                            <button
                                                onClick={() => {
                                                    setSpecialiteFilter([]);
                                                    setStatusFilter([]);
                                                    setTypeTuteurFilter([]);
                                                    setGradeFilter([]);
                                                    setPgFilter("");
                                                    setGroupeFilter("");
                                                    setAvailabilityDateFilter("");
                                                    setAvailabilityTimeSlotFilter([]);
                                                }}
                                                className="flex-1 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                            >
                                                Réinitialiser
                                            </button>
                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="flex-1 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                            >
                                                Appliquer
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Filter Buttons with Icons */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => {
                                        setPersonnelFilter("tuteur");
                                        setSelectedPerson(null);
                                    }}
                                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${personnelFilter === "tuteur"
                                        ? "bg-orange-500 text-white shadow-md"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    <Users size={16} />
                                    Tuteurs
                                </button>
                                <button
                                    onClick={() => {
                                        setPersonnelFilter("eleve");
                                        setSelectedPerson(null);
                                    }}
                                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${personnelFilter === "eleve"
                                        ? "bg-orange-500 text-white shadow-md"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    <BookOpen size={16} />
                                    Élèves
                                </button>
                            </div>

                            {/* Results Count */}
                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
                                <div className="text-sm text-slate-600">
                                    <span className="font-semibold text-slate-900">{filteredPersonnel.length}</span> résultat(s)
                                </div>
                            </div>

                            {/* Personnel List */}
                            <div className="flex-1 overflow-y-auto space-y-2">
                                {filteredPersonnel.length > 0 ? (
                                    filteredPersonnel.map((person) => (
                                        <div
                                            key={person.id}
                                            onClick={() => {
                                                setSelectedPerson(person);
                                                setSelectedGroup(null);
                                            }}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedPerson?.id === person.id
                                                ? "bg-orange-100 border-2 border-orange-500 shadow-sm"
                                                : "bg-slate-50 hover:bg-slate-100 border-2 border-transparent hover:shadow-sm"
                                                }`}
                                        >
                                            <div className="relative">
                                                <div className={`w-10 h-10 bg-gradient-to-br ${person.avatar} rounded-full flex-shrink-0`}></div>
                                                {/* Status indicator dot */}
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${person.status === "full"
                                                    ? "bg-red-500"
                                                    : person.status === "active"
                                                        ? "bg-green-500"
                                                        : "bg-gray-400"
                                                    }`} title={
                                                        person.status === "full"
                                                            ? "Complet"
                                                            : person.status === "active"
                                                                ? "Disponible"
                                                                : "Inactif"
                                                    }></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-slate-900 truncate">
                                                    {person.name}
                                                </div>
                                                <div className="text-xs text-slate-600">
                                                    {person.type === "tuteur"
                                                        ? `${(person as Tuteur).courses} cours`
                                                        : `${(person as Eleve).grade} • ${(person as Eleve).pg} PG`
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {selectedGroup && (
                                                    <>
                                                        {person.type === "tuteur" && selectedGroup.tuteurId !== person.id && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAddTutorToGroup(person.id, selectedGroup.id);
                                                                }}
                                                                className="p-1.5 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                                                title="Ajouter le tuteur au groupe"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        )}
                                                        {person.type === "eleve" && !selectedGroup.eleveIds.includes(person.id) && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAddStudentToGroup(person.id, selectedGroup.id);
                                                                }}
                                                                className="p-1.5 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                                                title="Ajouter l'élève au groupe"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                {selectedPerson?.id === person.id && (
                                                    <div className="text-orange-500">
                                                        <ChevronDown size={18} className="transform -rotate-90" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                        <Search size={48} className="mb-3 opacity-50" />
                                        <p className="text-sm font-medium">Aucune personne trouvée</p>
                                        <p className="text-xs">Essayez un autre terme de recherche</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel - Details View */}
                        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-y-auto">
                            {selectedGroup ? (
                                <div>
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                                                <Users size={32} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900">
                                                    {selectedGroup.name}
                                                </h3>
                                                <div className="text-slate-600">
                                                    Groupe • {selectedGroup.pgTotal} PG total
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    handleSaveGroupChanges();
                                                }}
                                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                            >
                                                Sauvegarder
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    handleDeleteGroup(selectedGroup);
                                                }}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 size={16} />
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>

                                    {/* Group Name */}
                                    <div className="mb-6">
                                        <div className="bg-orange-500 text-white rounded-lg p-4">
                                            <div className="font-bold text-lg mb-1">{selectedGroup.name}</div>
                                            <div className="text-sm opacity-90">{selectedGroup.pgTotal} PG total</div>
                                        </div>
                                    </div>

                                    {/* Tutor Section */}
                                    <div className="mb-6">
                                        <div className="text-sm font-semibold text-slate-700 mb-2">Tuteur:</div>
                                        {selectedGroup.tuteurName ? (
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="flex-1">
                                                    <div className="text-lg font-medium text-slate-900">{selectedGroup.tuteurName}</div>
                                                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${
                                                        selectedGroup.tuteurId ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                    }`}>
                                                        {selectedGroup.tuteurId ? "Avec tuteur" : "Sans tuteur"}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveTutorFromGroup(selectedGroup.id)}
                                                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                                    title="Retirer le tuteur du groupe"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
                                                Aucun tuteur assigné
                                            </div>
                                        )}
                                    </div>

                                    {/* Students Section */}
                                    <div className="mb-6">
                                        <div className="text-sm font-semibold text-slate-700 mb-3">
                                            Élèves ({selectedGroup.eleveNames?.length || selectedGroup.eleveIds.length}):
                                        </div>
                                        {selectedGroup.eleveNames && selectedGroup.eleveNames.length > 0 ? (
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {selectedGroup.eleveNames.map((studentName, idx) => {
                                                    const grade = getStudentGrade(studentName);
                                                    const formattedName = formatStudentName(studentName, grade);
                                                    const student = eleves.find(e => e.name === studentName);
                                                    const studentId = student ? student.id : selectedGroup.eleveIds[idx];
                                                    return (
                                                        <div 
                                                            key={idx} 
                                                            className="flex items-center gap-3 p-2 rounded-lg bg-green-50 border border-green-200"
                                                        >
                                                            <Check size={16} className="text-green-600" />
                                                            <span className="flex-1 text-slate-900">
                                                                {formattedName}
                                                            </span>
                                                            <button
                                                                onClick={() => handleRemoveStudentFromGroup(studentId, selectedGroup.id)}
                                                                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                                                title="Retirer l'élève du groupe"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-slate-500 text-sm p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                Aucun élève dans ce groupe
                                            </div>
                                        )}
                                    </div>

                                    {/* PG Total */}
                                    <div className="mb-6">
                                        <div className="text-sm font-semibold text-slate-700 mb-2">Total PG:</div>
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="text-lg font-medium text-slate-900">{selectedGroup.pgTotal} PG</div>
                                        </div>
                                    </div>

                                    {/* Créneaux de cours Section */}
                                    {(() => {
                                        const groupCourses = getCoursesForGroup(selectedGroup.id);
                                        return groupCourses.length > 0 ? (
                                            <div className="mb-6">
                                                <div className="text-sm font-semibold text-slate-700 mb-3">
                                                    Créneaux de cours ({groupCourses.length}):
                                                </div>
                                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                                    {groupCourses.map(({ day, course }, idx) => {
                                                        // Find the time slot label for this course
                                                        const timeSlot = timeSlots.find(ts => ts.startTime === course.time);
                                                        const timeLabel = timeSlot ? timeSlot.label : course.time;
                                                        const exactDate = getDateForDay(day);
                                                        
                                                        return (
                                                            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <div className="text-sm font-medium text-slate-900">{day} {exactDate}</div>
                                                                    <div className={`px-2 py-0.5 rounded text-xs font-medium ${course.color} text-white`}>
                                                                        {course.subject}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock size={12} />
                                                                        <span>{timeLabel}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin size={12} />
                                                                        <span>{course.room}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <User size={12} />
                                                                        <span>{course.tutor}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-6">
                                                <div className="text-sm font-semibold text-slate-700 mb-3">Créneaux de cours:</div>
                                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 text-sm">
                                                    Aucun créneau assigné à ce groupe pour le moment
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Disponibilités Section */}
                                    {selectedGroup.disponibilites && selectedGroup.disponibilites.length > 0 && (
                                        <div className="mb-6">
                                            <div className="text-sm font-semibold text-slate-700 mb-3">Disponibilités:</div>
                                            <div className="space-y-2">
                                                {selectedGroup.disponibilites.map((dispo, idx) => (
                                                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                        <div className="text-sm font-medium text-slate-900">{dispo.day}</div>
                                                        <div className="text-xs text-slate-600">{dispo.time}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : selectedPerson ? (
                                <div>
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-20 h-20 bg-gradient-to-br ${selectedPerson.avatar} rounded-2xl`}></div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900">
                                                    {selectedPerson.name}
                                                </h3>
                                                <div className="text-slate-600">
                                                    {selectedPerson.type === "tuteur" ? "Tuteur" : "Élève"}
                                                    {selectedPerson.type === "tuteur" && (selectedPerson as Tuteur).typeTuteur && ` • ${(selectedPerson as Tuteur).typeTuteur}`}
                                                    {selectedPerson.alias && ` • Alias: ${selectedPerson.alias}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                <Mail size={18} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (selectedPerson.type === "tuteur") {
                                                        handleEditTutor(selectedPerson as Tuteur);
                                                    } else {
                                                        handleEditStudent(selectedPerson as Eleve);
                                                    }
                                                }}
                                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                            >
                                                Modifier
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (selectedPerson.type === "tuteur") {
                                                        handleDeleteTutor(selectedPerson as Tuteur);
                                                    } else {
                                                        handleDeleteStudent(selectedPerson as Eleve);
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 size={16} />
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                                        <h4 className="font-semibold text-slate-900 mb-3">Informations de contact</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-slate-600 mb-1">Email{selectedPerson.type === "eleve" && (selectedPerson as Eleve).emails && (selectedPerson as Eleve).emails!.length > 1 ? "s" : ""}</div>
                                                {selectedPerson.type === "eleve" && (selectedPerson as Eleve).emails && (selectedPerson as Eleve).emails!.length > 1 ? (
                                                    <div className="space-y-1">
                                                        {(selectedPerson as Eleve).emails!.map((email, idx) => (
                                                            <div key={idx} className="text-slate-900">{email}</div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-slate-900">{selectedPerson.email}</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-600 mb-1">Téléphone</div>
                                                <div className="text-slate-900">{selectedPerson.phone}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-600 mb-1">Allergies</div>
                                                <div className="text-slate-900">{selectedPerson.allergies || "-"}</div>
                                            </div>
                                            {selectedPerson.type === "tuteur" && (
                                                <div>
                                                    <div className="text-sm text-slate-600 mb-1">Salaire horaire</div>
                                                    <div className="text-slate-900 font-semibold">${(selectedPerson as Tuteur).salaireHoraire.toFixed(2)}/heure</div>
                                                </div>
                                            )}
                                            {selectedPerson.type === "eleve" && (selectedPerson as Eleve).age && (
                                                <div>
                                                    <div className="text-sm text-slate-600 mb-1">Âge</div>
                                                    <div className="text-slate-900">{(selectedPerson as Eleve).age} ans</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sensitive Information - Security Restricted */}
                                    {(selectedPerson.allergies || (selectedPerson.type === "eleve" && (selectedPerson as Eleve).difficultes)) && canViewSensitiveData && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Shield size={18} className="text-yellow-600" />
                                                <h4 className="font-semibold text-slate-900">Informations sensibles</h4>
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Accès restreint</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {selectedPerson.allergies && (
                                                    <div>
                                                        <div className="text-sm text-slate-600 mb-1">Allergies</div>
                                                        <div className="text-slate-900">{selectedPerson.allergies}</div>
                                                    </div>
                                                )}
                                                {selectedPerson.type === "eleve" && (selectedPerson as Eleve).difficultes && (
                                                    <div>
                                                        <div className="text-sm text-slate-600 mb-1">Difficultés</div>
                                                        <div className="text-slate-900">{(selectedPerson as Eleve).difficultes}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Statistics */}
                                    {((selectedPerson.type === "tuteur" && (selectedPerson as Tuteur).statistiques) || 
                                      (selectedPerson.type === "eleve" && (selectedPerson as Eleve).statistiques)) && (
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
                                            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                <BarChart3 size={18} className="text-blue-600" />
                                                Statistiques
                                            </h4>
                                            {selectedPerson.type === "tuteur" && (selectedPerson as Tuteur).statistiques && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-lg p-3">
                                                        <div className="text-xs text-slate-600 mb-1">Heures enseignées</div>
                                                        <div className="text-xl font-bold text-slate-900">{(selectedPerson as Tuteur).statistiques!.heuresEnseignees}h</div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-3">
                                                        <div className="text-xs text-slate-600 mb-1">Taux de complétion</div>
                                                        <div className="text-xl font-bold text-slate-900">{(selectedPerson as Tuteur).statistiques!.tauxCompletion}%</div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-3">
                                                        <div className="text-xs text-slate-600 mb-1">Nombre de cours</div>
                                                        <div className="text-xl font-bold text-slate-900">{(selectedPerson as Tuteur).statistiques!.nombreCours}</div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-3">
                                                        <div className="text-xs text-slate-600 mb-1">Date de début</div>
                                                        <div className="text-xl font-bold text-slate-900">{(selectedPerson as Tuteur).statistiques!.dateDebut}</div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-3">
                                                        <div className="text-xs text-slate-600 mb-1">Nombre d'élèves différents</div>
                                                        <div className="text-xl font-bold text-slate-900">{(selectedPerson as Tuteur).statistiques!.nombreElevesDifferents}</div>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedPerson.type === "eleve" && (selectedPerson as Eleve).statistiques && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-lg p-3">
                                                        <div className="text-xs text-slate-600 mb-1">Taux de présence</div>
                                                        <div className="text-xl font-bold text-slate-900">{(selectedPerson as Eleve).statistiques!.tauxPresence}%</div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-3">
                                                        <div className="text-xs text-slate-600 mb-1">Progression</div>
                                                        <div className="text-xl font-bold text-slate-900">{(selectedPerson as Eleve).statistiques!.progression}%</div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-3 col-span-2">
                                                        <div className="text-xs text-slate-600 mb-1">Nombre de cours</div>
                                                        <div className="text-xl font-bold text-slate-900">{(selectedPerson as Eleve).statistiques!.nombreCours}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Tutor-specific information */}
                                    {selectedPerson.type === "tuteur" && (
                                        <>
                                            {/* Specialties */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold text-slate-900 mb-3">Spécialités</h4>
                                                <div className="flex gap-2 flex-wrap">
                                                    {(selectedPerson as Tuteur).specialites.map((spec: string, idx: number) => (
                                                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                            {spec}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Years comfortable */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold text-slate-900 mb-3">Années confortables</h4>
                                                <div className="flex gap-2 flex-wrap">
                                                    {(selectedPerson as Tuteur).anneesConfortables.map((annee: string, idx: number) => (
                                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                            {annee}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Capacity Management */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold text-slate-900 mb-3">Capacité de Gestion</h4>
                                                {(() => {
                                                    const tuteur = selectedPerson as Tuteur;
                                                    const pgUsed = calculatePGUsed(tuteur.name);
                                                    const isOverCapacity = pgUsed > tuteur.capaciteGestion;
                                                    return (
                                                        <div className={`rounded-xl p-4 ${isOverCapacity ? "bg-red-50 border-2 border-red-300" : "bg-slate-50"}`}>
                                                            <div className="text-sm text-slate-600 mb-2">Quantité d'élèves qu'il peut gérer</div>
                                                            <div className={`text-2xl font-bold mb-2 ${isOverCapacity ? "text-red-700" : "text-slate-900"}`}>
                                                                {pgUsed}/{tuteur.capaciteGestion} PG
                                                            </div>
                                                            {isOverCapacity && (
                                                                <div className="text-sm text-red-700 font-semibold mb-2 flex items-center gap-2">
                                                                    <AlertCircle size={16} />
                                                                    Capacité dépassée!
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-slate-500">
                                                                Les PG des élèves assignés s'additionnent jusqu'à atteindre {tuteur.capaciteGestion} PG
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </>
                                    )}

                                    {/* Student-specific information */}
                                    {selectedPerson.type === "eleve" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <div className="text-sm text-slate-600 mb-1">Niveau</div>
                                                    <div className="text-xl font-bold text-slate-900">{(selectedPerson as Eleve).grade}</div>
                                                </div>
                                            <div className="bg-slate-50 rounded-xl p-4">
                                                <div className="text-sm text-slate-600 mb-1">Points de Gestion</div>
                                                <div className="text-xl font-bold text-slate-900">{(selectedPerson as Eleve).pg} PG</div>
                                            </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Upcoming Courses - Only for élèves */}
                                    {selectedPerson.type === "eleve" && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                                    <Clock size={18} className="text-orange-500" />
                                                    Prochains cours
                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                                                        {selectedPerson.prochainsCours.length}
                                                    </span>
                                                </h4>
                                                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 hover:underline">
                                                    <Plus size={14} />
                                                    Modifier horaire
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {selectedPerson.prochainsCours.map((course: any, idx: number) => (
                                                    <div key={idx} className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-50 hover:from-orange-50 hover:to-slate-50 rounded-lg border border-slate-200 hover:border-orange-300 transition-all cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <Calendar size={20} className="text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-slate-900">
                                                                    {course.day} - {course.time}
                                                                </div>
                                                                <div className="text-sm text-slate-600">
                                                                    {course.subject} • {course.tuteur}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-blue-100 rounded-lg transition-all text-blue-600"
                                                                title="Modifier ce cours"
                                                            >
                                                                <Settings size={16} />
                                                            </button>
                                                            <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
                                                                <ChevronDown size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes Section - For all entities */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                            <FileText size={18} className="text-slate-600" />
                                            Note
                                        </h4>
                                        <textarea
                                            className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y min-h-[120px]"
                                            placeholder="Ajoutez une note..."
                                            value={selectedPerson.note || ""}
                                            onChange={(e) => {
                                                const updatedPerson = { ...selectedPerson, note: e.target.value };
                                                if (selectedPerson.type === "tuteur") {
                                                    setTuteurs(tuteurs.map(t => t.id === selectedPerson.id ? updatedPerson as Tuteur : t));
                                                } else {
                                                    setEleves(eleves.map(e => e.id === selectedPerson.id ? updatedPerson as Eleve : e));
                                                }
                                                setSelectedPerson(updatedPerson);
                                            }}
                                            rows={4}
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
                                        <button 
                                            onClick={() => {
                                                setAvailabilityType("court");
                                                setShowAvailabilityForm(true);
                                            }}
                                            className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            Modifier une date unique
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setAvailabilityType("long");
                                                setShowAvailabilityForm(true);
                                            }}
                                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Modification long terme
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">
                                    <div className="text-center">
                                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium">Sélectionnez une personne</p>
                                        <p className="text-sm">ou un groupe pour voir les détails</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Panel - Group Management */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Gestion des groupes</h3>
                                <p className="text-sm text-slate-600">Créez et gérez des groupes pour déplacer plusieurs personnes ensemble</p>
                            </div>
                            <button 
                                onClick={handleAddGroup}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Créer un groupe
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {groupes.map((groupe) => (
                                <div 
                                    key={groupe.id}
                                    onClick={() => {
                                        setSelectedGroup(groupe);
                                        setSelectedPerson(null);
                                    }}
                                    className="border-2 rounded-xl p-4 hover:border-orange-300 transition-colors cursor-pointer border-slate-200"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="font-semibold text-slate-900">{groupe.name}</div>
                                        <div className={`text-xs px-2 py-1 rounded-full ${
                                            groupe.tuteurId ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {groupe.tuteurId ? "Avec tuteur" : "Sans tuteur"}
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-600 mb-2">
                                        {groupe.tuteurName ? `Tuteur: ${groupe.tuteurName}` : "Aucun tuteur assigné"}
                                    </div>
                                    {/* Students Section */}
                                    {groupe.eleveNames && groupe.eleveNames.length > 0 ? (
                                        <div className="mb-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users size={14} className="text-slate-400" />
                                                <span className="text-xs text-slate-600 font-medium">{groupe.eleveIds.length} élève(s)</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {groupe.eleveNames.slice(0, 4).map((studentName, idx) => {
                                                    const grade = getStudentGrade(studentName);
                                                    const formattedName = formatStudentName(studentName, grade);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="px-2 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200"
                                                            title={studentName}
                                                        >
                                                            {formattedName}
                                                        </div>
                                                    );
                                                })}
                                                {groupe.eleveNames.length > 4 && (
                                                    <div className="px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                        +{groupe.eleveNames.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users size={14} className="text-slate-400" />
                                            <span className="text-sm text-slate-600">0 élève(s)</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-end">
                                        <div className="text-xs text-slate-500 font-medium">
                                            {groupe.pgTotal} PG
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                {/* Student Form Modal */}
                {showStudentForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {editingItem ? "Modifier l'élève" : "Créer un élève"}
                                </h3>
                                <button onClick={() => { setShowStudentForm(false); setEditingItem(null); }} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nom <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={studentFormData.name}
                                        onChange={(e) => setStudentFormData({...studentFormData, name: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Âge</label>
                                        <input
                                            type="number"
                                            value={studentFormData.age}
                                            onChange={(e) => setStudentFormData({...studentFormData, age: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Année scolaire <span className="text-red-500">*</span></label>
                                        <select
                                            value={studentFormData.grade}
                                            onChange={(e) => setStudentFormData({...studentFormData, grade: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Sélectionner</option>
                                            {["Sec. 1", "Sec. 2", "Sec. 3", "Sec. 4", "Sec. 5"].map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Points de Gestion (PG) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={studentFormData.pg}
                                            onChange={(e) => setStudentFormData({...studentFormData, pg: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={studentFormData.phone}
                                            onChange={(e) => setStudentFormData({...studentFormData, phone: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Adresses courriel</label>
                                    {studentFormData.emails.map((email, idx) => (
                                        <div key={idx} className="flex gap-2 mb-2">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    const newEmails = [...studentFormData.emails];
                                                    newEmails[idx] = e.target.value;
                                                    setStudentFormData({...studentFormData, emails: newEmails});
                                                }}
                                                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                placeholder="email@exemple.com"
                                            />
                                            {studentFormData.emails.length > 1 && (
                                                <button
                                                    onClick={() => {
                                                        const newEmails = studentFormData.emails.filter((_, i) => i !== idx);
                                                        setStudentFormData({...studentFormData, emails: newEmails});
                                                    }}
                                                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setStudentFormData({...studentFormData, emails: [...studentFormData.emails, ""]})}
                                        className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                                    >
                                        <Plus size={14} />
                                        Ajouter une adresse courriel
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Difficultés {!canViewSensitiveData && <span className="text-xs text-slate-500">(Accès restreint)</span>}</label>
                                    <textarea
                                        value={studentFormData.difficultes}
                                        onChange={(e) => setStudentFormData({...studentFormData, difficultes: e.target.value})}
                                        disabled={!canViewSensitiveData}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Allergies {!canViewSensitiveData && <span className="text-xs text-slate-500">(Accès restreint)</span>}</label>
                                    <input
                                        type="text"
                                        value={studentFormData.allergies}
                                        onChange={(e) => setStudentFormData({...studentFormData, allergies: e.target.value})}
                                        disabled={!canViewSensitiveData}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Alias</label>
                                    <input
                                        type="text"
                                        value={studentFormData.alias}
                                        onChange={(e) => setStudentFormData({...studentFormData, alias: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Alias pour distinguer les doublons"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tuteur assigné</label>
                                    <select
                                        value={studentFormData.tuteur}
                                        onChange={(e) => setStudentFormData({...studentFormData, tuteur: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Aucun</option>
                                        {tuteurs.map(t => (
                                            <option key={t.id} value={t.name}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => { setShowStudentForm(false); setEditingItem(null); }}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveStudent}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    {editingItem ? "Enregistrer" : "Créer"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tutor Form Modal */}
                {showTutorForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {editingItem ? "Modifier le tuteur" : "Créer un tuteur"}
                                </h3>
                                <button onClick={() => { setShowTutorForm(false); setEditingItem(null); }} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Prénom <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={tutorFormData.prenom}
                                            onChange={(e) => setTutorFormData({...tutorFormData, prenom: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nom <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={tutorFormData.nom}
                                            onChange={(e) => setTutorFormData({...tutorFormData, nom: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Type de tuteur <span className="text-red-500">*</span></label>
                                        <select
                                            value={tutorFormData.typeTuteur}
                                            onChange={(e) => setTutorFormData({...tutorFormData, typeTuteur: e.target.value as "Apprenti" | "Tuteur" | "Administrateur"})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="Apprenti">Apprenti</option>
                                            <option value="Tuteur">Tuteur</option>
                                            <option value="Administrateur">Administrateur</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Matière(s) enseignée(s)</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tutorFormData.specialites.map((spec, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                                                {spec}
                                                <button onClick={() => {
                                                    setTutorFormData({...tutorFormData, specialites: tutorFormData.specialites.filter((_, i) => i !== idx)});
                                                }} className="hover:text-blue-900">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value && !tutorFormData.specialites.includes(e.target.value)) {
                                                setTutorFormData({...tutorFormData, specialites: [...tutorFormData.specialites, e.target.value]});
                                            }
                                            e.target.value = "";
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Ajouter une matière</option>
                                        {["Mathématiques", "Sciences", "Français", "Anglais", "Histoire", "Chimie"].filter(s => !tutorFormData.specialites.includes(s)).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Taux horaire</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={tutorFormData.salaireHoraire}
                                            onChange={(e) => setTutorFormData({...tutorFormData, salaireHoraire: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Points de gestion <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={tutorFormData.capaciteGestion}
                                            onChange={(e) => setTutorFormData({...tutorFormData, capaciteGestion: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            value={tutorFormData.email}
                                            onChange={(e) => setTutorFormData({...tutorFormData, email: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={tutorFormData.phone}
                                            onChange={(e) => setTutorFormData({...tutorFormData, phone: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Allergies {!canViewSensitiveData && <span className="text-xs text-slate-500">(Accès restreint)</span>}</label>
                                    <input
                                        type="text"
                                        value={tutorFormData.allergies}
                                        onChange={(e) => setTutorFormData({...tutorFormData, allergies: e.target.value})}
                                        disabled={!canViewSensitiveData}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Alias</label>
                                    <input
                                        type="text"
                                        value={tutorFormData.alias}
                                        onChange={(e) => setTutorFormData({...tutorFormData, alias: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Alias pour distinguer les doublons"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Années confortables</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tutorFormData.anneesConfortables.map((annee, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
                                                {annee}
                                                <button onClick={() => {
                                                    setTutorFormData({...tutorFormData, anneesConfortables: tutorFormData.anneesConfortables.filter((_, i) => i !== idx)});
                                                }} className="hover:text-green-900">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value && !tutorFormData.anneesConfortables.includes(e.target.value)) {
                                                setTutorFormData({...tutorFormData, anneesConfortables: [...tutorFormData.anneesConfortables, e.target.value]});
                                            }
                                            e.target.value = "";
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Ajouter une année</option>
                                        {["Sec. 1", "Sec. 2", "Sec. 3", "Sec. 4", "Sec. 5"].filter(a => !tutorFormData.anneesConfortables.includes(a)).map(a => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => { setShowTutorForm(false); setEditingItem(null); }}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveTutor}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    {editingItem ? "Enregistrer" : "Créer"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Group Form Modal */}
                {showGroupForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {editingItem ? "Modifier le groupe" : "Créer un groupe"}
                                </h3>
                                <button onClick={() => { setShowGroupForm(false); setEditingItem(null); }} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nom du groupe <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={groupFormData.name}
                                        onChange={(e) => setGroupFormData({...groupFormData, name: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tuteur assigné</label>
                                    <select
                                        value={groupFormData.tuteurId}
                                        onChange={(e) => setGroupFormData({...groupFormData, tuteurId: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Aucun tuteur</option>
                                        {tuteurs.map(t => (
                                            <option key={t.id} value={t.id.toString()}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Élèves</label>
                                    <div className="border border-slate-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                                        {eleves.map(eleve => (
                                            <label key={eleve.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={groupFormData.eleveIds.includes(eleve.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setGroupFormData({...groupFormData, eleveIds: [...groupFormData.eleveIds, eleve.id]});
                                                        } else {
                                                            setGroupFormData({...groupFormData, eleveIds: groupFormData.eleveIds.filter(id => id !== eleve.id)});
                                                        }
                                                    }}
                                                    className="rounded text-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="text-sm text-slate-700">{eleve.name} ({eleve.pg} PG)</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-sm text-slate-600">
                                        PG total: {eleves.filter(e => groupFormData.eleveIds.includes(e.id)).reduce((sum, e) => sum + e.pg, 0)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => { setShowGroupForm(false); setEditingItem(null); }}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveGroup}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    {editingItem ? "Enregistrer" : "Créer"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Availability Form Modal */}
                {showAvailabilityForm && selectedPerson && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {availabilityType === "long" ? "Modification long terme" : availabilityType === "court" ? "Modification court terme" : "Ajout ponctuel"}
                                </h3>
                                <button onClick={() => setShowAvailabilityForm(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-900">
                                        {availabilityType === "long" 
                                            ? "Modifiez les disponibilités récurrentes avec dates de début et de fin."
                                            : availabilityType === "court"
                                            ? "Signalez une absence, un retard ou une exception ponctuelle."
                                            : "Ajoutez une plage horaire pour une journée spécifique."}
                                    </p>
                                </div>
                                {availabilityType === "long" && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date de début</label>
                                                <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date de fin</label>
                                                <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Plage horaire à désactiver</label>
                                            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                                <option value="">Sélectionner une plage</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                {availabilityType === "court" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                                            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                                <option value="">Sélectionner</option>
                                                <option value="absence">Absence</option>
                                                <option value="retard">Retard</option>
                                                <option value="exception">Exception</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                                            <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Commentaire <span className="text-red-500">*</span></label>
                                            <textarea
                                                rows={3}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                placeholder="Précisez le motif du changement"
                                            />
                                        </div>
                                    </>
                                )}
                                {availabilityType === "ponctuel" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                                            <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Heure de début</label>
                                                <input type="time" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Heure de fin</label>
                                                <input type="time" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => setShowAvailabilityForm(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => {
                                        alert("Fonctionnalité de disponibilité enregistrée (simulation)");
                                        setShowAvailabilityForm(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Import Modal */}
                {showImportModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-900">Importer des données CSV</h3>
                                <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-900">
                                        Sélectionnez un fichier CSV contenant les données à importer. Le fichier doit respecter le format attendu.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Fichier CSV</label>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                alert(`Import du fichier ${file.name} (simulation)`);
                                                setShowImportModal(false);
                                            }
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => setShowImportModal(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Placement Page
    const PlacementPage = () => {
        const [placementView, setPlacementView] = useState<"grid" | "detailed">("grid");
        const [placementDay, setPlacementDay] = useState<Day>("Lundi");
        const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
        const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
        const [showFilterPanel, setShowFilterPanel] = useState(true);
        const [tutorSearch, setTutorSearch] = useState("");
        const [studentSearch, setStudentSearch] = useState("");
        const [draggedItem, setDraggedItem] = useState<any>(null);
        const [savedStates, setSavedStates] = useState<any[]>([]);
        const [showSaveHistory, setShowSaveHistory] = useState(false);
        const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
        const [selectedTimeSlotFilter, setSelectedTimeSlotFilter] = useState<string | null>(null);
        const [selectedTimeSlotsForDetailedView, setSelectedTimeSlotsForDetailedView] = useState<string[]>([]);
        const [selectedTimeSlotsForGridView, setSelectedTimeSlotsForGridView] = useState<string[]>([]);
        const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
        const [placementCourses, setPlacementCourses] = useState<Partial<Record<Day, Course[]>>>({});
        const [showDuplicateModal, setShowDuplicateModal] = useState(false);
        const [duplicateTargetDate, setDuplicateTargetDate] = useState<Date | null>(null);

        // Accordion state - which sections are expanded
        const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
            groups: true,
            tutors: false,
            students: false
        });

        // Filter popups state
        const [showTutorFilters, setShowTutorFilters] = useState(false);
        const [showStudentFilters, setShowStudentFilters] = useState(false);

        // Tutor filters
        const [tutorAvailabilityFilter, setTutorAvailabilityFilter] = useState<string[]>([]);
        const [tutorSpecialtyFilter, setTutorSpecialtyFilter] = useState<string[]>([]);

        // Student filters
        const [studentGradeFilter, setStudentGradeFilter] = useState<string[]>([]);
        const [studentPgFilter, setStudentPgFilter] = useState<string>("");

        // Week navigation state and functions
        const getCurrentWeekStart = (): Date => {
            const today = new Date();
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            const monday = new Date(today);
            monday.setDate(diff);
            monday.setHours(0, 0, 0, 0);
            return monday;
        };
        
        const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getCurrentWeekStart());
        
        // Utility functions for week management
        const getWeekStart = (date: Date): Date => {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(d);
            monday.setDate(diff);
            monday.setHours(0, 0, 0, 0);
            return monday;
        };
        
        const getWeekDates = (weekStart: Date): Record<Day, Date> => {
            const monday = new Date(weekStart);
            monday.setHours(0, 0, 0, 0);
            
            const dates: Record<string, Date> = {};
            const dayOrder: Day[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
            
            dayOrder.forEach((day, index) => {
                const date = new Date(monday);
                date.setDate(monday.getDate() + index);
                dates[day] = date;
            });
            
            return dates as Record<Day, Date>;
        };
        
        const formatWeekRange = (weekStart: Date): string => {
            const weekDates = getWeekDates(weekStart);
            const monday = weekDates["Lundi"];
            const sunday = weekDates["Dimanche"];
            
            const formatDate = (date: Date): string => {
                return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            };
            
            const mondayStr = formatDate(monday);
            const sundayStr = formatDate(sunday);
            
            // If same month, show "14 - 20 octobre 2025"
            if (monday.getMonth() === sunday.getMonth() && monday.getFullYear() === sunday.getFullYear()) {
                const day1 = monday.getDate();
                const day2 = sunday.getDate();
                const monthYear = monday.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                return `${day1} - ${day2} ${monthYear}`;
            } else {
                // Different months or years
                return `${mondayStr} - ${sundayStr}`;
            }
        };
        
        const formatDayWithDate = (day: Day, weekStart: Date): string => {
            const weekDates = getWeekDates(weekStart);
            const date = weekDates[day];
            const dayName = day;
            const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
            return `${dayName} ${dateStr}`;
        };
        
        const goToPreviousWeek = () => {
            setCurrentWeekStart(prev => {
                const newDate = new Date(prev);
                newDate.setDate(prev.getDate() - 7);
                return newDate;
            });
        };
        
        const goToNextWeek = () => {
            setCurrentWeekStart(prev => {
                const newDate = new Date(prev);
                newDate.setDate(prev.getDate() + 7);
                return newDate;
            });
        };
        
        const goToCurrentWeek = () => {
            setCurrentWeekStart(getCurrentWeekStart());
        };
        
        const isCurrentWeek = (): boolean => {
            const currentWeek = getCurrentWeekStart();
            return currentWeekStart.getTime() === currentWeek.getTime();
        };

        const toggleSection = (section: string) => {
            setExpandedSections(prev => ({
                ...prev,
                [section]: !prev[section]
            }));
        };

        // Mock groups from Personnel page
        const groups = [
            {
                id: 1,
                name: "Groupe Math Avancé",
                tutor: "Marie Dupont",
                students: ["Lucas Bernard", "Emma Tremblay", "Noah Gagnon", "Olivia Côté"],
                totalPG: 12,
                color: "blue"
            },
            {
                id: 2,
                name: "Groupe Sec. 3",
                tutor: null,
                students: ["William Roy", "Sophie Martin", "Alex Leblanc"],
                totalPG: 9,
                color: "purple"
            },
            {
                id: 3,
                name: "Groupe Sciences",
                tutor: "Sophie Chen",
                students: ["Emma Chen", "Marc Dubois"],
                totalPG: 6,
                color: "green"
            }
        ];

        // Mock tutors
        const tutors = [
            { id: 1, name: "Marie Dupont", capacity: "12/15", available: true, specialties: ["Math", "Sciences"] },
            { id: 2, name: "Jean Martin", capacity: "10/12", available: true, specialties: ["Français"] },
            { id: 3, name: "Sophie Chen", capacity: "15/15", available: false, specialties: ["Sciences", "Chimie"] },
            { id: 4, name: "Thomas Roy", capacity: "6/10", available: true, specialties: ["Anglais"] }
        ];

        // Mock students
        const students = [
            { id: 1, name: "Lucas Bernard", pg: 3, grade: "Sec. 3" },
            { id: 2, name: "Emma Tremblay", pg: 2, grade: "Sec. 4" },
            { id: 3, name: "Noah Gagnon", pg: 4, grade: "Sec. 5" },
            { id: 4, name: "Olivia Côté", pg: 2, grade: "Sec. 3" },
            { id: 5, name: "William Roy", pg: 3, grade: "Sec. 4" },
            { id: 6, name: "Sophie Martin", pg: 3, grade: "Sec. 3" },
            { id: 7, name: "Alex Leblanc", pg: 3, grade: "Sec. 3" },
            { id: 8, name: "Emma Chen", pg: 3, grade: "Sec. 4" },
            { id: 9, name: "Marc Dubois", pg: 3, grade: "Sec. 4" }
        ];

        const handleSaveState = () => {
            const newState = {
                id: Date.now(),
                timestamp: new Date().toLocaleString(),
                data: { /* current placement state */ }
            };
            setSavedStates([newState, ...savedStates]);
            setHasUnsavedChanges(false);
        };

        const handleRestoreState = (stateId: number) => {
            // Restore logic here
            setHasUnsavedChanges(false);
            setShowSaveHistory(false);
        };

        const handlePrint = () => {
            window.print();
        };

        const handleDuplicate = () => {
            setShowDuplicateModal(true);
            // Set default target date to next week
            const nextWeek = new Date(currentWeekStart);
            nextWeek.setDate(nextWeek.getDate() + 7);
            setDuplicateTargetDate(nextWeek);
        };

        const confirmDuplicate = () => {
            if (!duplicateTargetDate) return;
            
            const targetWeekStart = getWeekStart(duplicateTargetDate);
            
            // Create a copy of current week's courses for the target week
            const duplicatedCourses: Partial<Record<Day, Course[]>> = {};
            
            Object.keys(placementCourses).forEach((day) => {
                const dayKey = day as Day;
                const dayCourses = placementCourses[dayKey];
                if (dayCourses && dayCourses.length > 0) {
                    // Deep copy the courses
                    duplicatedCourses[dayKey] = dayCourses.map(course => ({
                        ...course,
                        // Keep all properties but create a new object
                    }));
                }
            });
            
            // Navigate to the target week and set the duplicated courses
            setCurrentWeekStart(targetWeekStart);
            setPlacementCourses(duplicatedCourses);
            setShowDuplicateModal(false);
            setDuplicateTargetDate(null);
            setHasUnsavedChanges(true);
        };

        const filteredTutors = tutors.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(tutorSearch.toLowerCase());
            const matchesAvailability = tutorAvailabilityFilter.length === 0 ||
                tutorAvailabilityFilter.includes(t.available ? 'available' : 'full');
            const matchesSpecialty = tutorSpecialtyFilter.length === 0 ||
                tutorSpecialtyFilter.some(spec => t.specialties.includes(spec));
            return matchesSearch && matchesAvailability && matchesSpecialty;
        });

        const filteredStudents = students.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase());
            const matchesGrade = studentGradeFilter.length === 0 || studentGradeFilter.includes(s.grade);
            const matchesPg = studentPgFilter === "" || s.pg.toString() === studentPgFilter;
            return matchesSearch && matchesGrade && matchesPg;
        });

        const activeTutorFiltersCount = tutorAvailabilityFilter.length + tutorSpecialtyFilter.length;
        const activeStudentFiltersCount = studentGradeFilter.length + (studentPgFilter ? 1 : 0);

        // Helper functions for student name formatting
        const formatStudentName = (studentName: string, grade: string | null): string => {
            const parts = studentName.trim().split(/\s+/);
            if (parts.length < 2) {
                return grade ? `${studentName}, ${grade}` : studentName;
            }
            const firstName = parts[0];
            const lastNameInitial = parts[parts.length - 1][0].toUpperCase();
            return grade ? `${firstName} ${lastNameInitial}., ${grade}` : `${firstName} ${lastNameInitial}.`;
        };

        const getStudentGrade = (studentName: string): string | null => {
            const student = students.find(s => s.name === studentName);
            return student ? student.grade : null;
        };

        // Helper functions for groups and courses
        const getGroupForCourse = (course: Course) => {
            if (!course.groupId) return null;
            return groups.find(g => g.id === course.groupId) || null;
        };

        const getGroupForPerson = (personName: string) => {
            return groups.find(g => 
                g.tutor === personName || 
                g.students.includes(personName)
            ) || null;
        };

        const getPlacementStatus = (personName: string, day: Day) => {
            const dayCourses = placementCourses[day] || [];
            const personCourses = dayCourses.filter(c => 
                c.tutor === personName || 
                c.studentNames?.includes(personName)
            );
            
            // Filter time slots for the specific day
            const dayTimeSlots = day === "Vendredi" ? [] : timeSlots.filter(slot => slot.daysOfWeek.includes(day));
            const totalSlots = dayTimeSlots.length;
            const placedSlots = personCourses.length;
            
            if (placedSlots === 0) return { status: "unplaced", slots: 0, total: totalSlots };
            if (placedSlots === totalSlots && totalSlots > 0) return { status: "fully_placed", slots: placedSlots, total: totalSlots };
            return { status: "partially_placed", slots: placedSlots, total: totalSlots };
        };

        // Filter time slots for the selected day in placement
        const getTimeSlotsForPlacementDay = (day: Day): TimeSlot[] => {
            if (day === "Vendredi") {
                return []; // Pas de cours le vendredi
            }
            return timeSlots.filter(slot => slot.daysOfWeek.includes(day));
        };
        
        const filteredPlacementTimeSlots = getTimeSlotsForPlacementDay(placementDay);
        
        // Helper to get courses for a room in a time slot for placement page
        const getPlacementCoursesForRoomAndSlot = (room: string, slotStart: string, day: Day) => {
            return (
                placementCourses[day]?.filter(
                    (c) => c.room === room && c.time.startsWith(slotStart.split(":")[0])
                ) || []
            );
        };

        // Helper to get course title based on tutor presence
        const getCourseTitle = (course: Course, day: Day, slot: TimeSlot): string => {
            if (course.tutor && course.tutor.trim() !== "") {
                return `Tutorat avec ${course.tutor}`;
            }
            return `Salle ${course.room} - ${day} - ${slot.startTime}`;
        };

        // Helper to get assigned tutors for a specific day
        const getAssignedTutorsForDay = (day: Day): string[] => {
            const dayCourses = placementCourses[day] || [];
            const tutorSet = new Set<string>();
            dayCourses.forEach(course => {
                if (course.tutor && course.tutor.trim() !== "") {
                    tutorSet.add(course.tutor);
                }
            });
            return Array.from(tutorSet).sort();
        };

        // Helper to get courses for a tutor in a specific time slot
        const getTutorCoursesForSlot = (tutorName: string, slot: TimeSlot, day: Day): Course[] => {
            const dayCourses = placementCourses[day] || [];
            return dayCourses.filter(course => 
                course.tutor === tutorName && 
                course.time.startsWith(slot.startTime.split(":")[0])
            );
        };

        // Handle drop to create or update course
        const handleDrop = (room: string, slot: TimeSlot, day: Day) => {
            if (!draggedItem) return;

            const dayCourses = placementCourses[day] || [];
            
            // Handle course movement (moving a complete course to another time slot)
            if (draggedItem.type === 'course') {
                const courseToMove = draggedItem.data as Course;
                
                // Find the course in the current day's courses
                const courseIndex = dayCourses.findIndex(
                    (c) => c.room === courseToMove.room && 
                           c.time.startsWith(courseToMove.time.split(":")[0]) &&
                           c.tutor === courseToMove.tutor &&
                           JSON.stringify(c.studentNames?.sort()) === JSON.stringify(courseToMove.studentNames?.sort())
                );
                
                if (courseIndex === -1) return; // Course not found
                
                // Create updated course with new time and room
                const movedCourse: Course = {
                    ...courseToMove,
                    time: slot.startTime,
                    room: room
                };
                
                // Remove the course from its old position
                const updatedCourses = dayCourses.filter((_, idx) => idx !== courseIndex);
                
                // Check if there's already a course at the target location
                const existingCourseAtTarget = updatedCourses.find(
                    (c) => c.room === room && c.time.startsWith(slot.startTime.split(":")[0])
                );
                
                if (existingCourseAtTarget) {
                    // Merge with existing course or replace? For now, we'll replace
                    const targetIndex = updatedCourses.findIndex(
                        (c) => c.room === room && c.time.startsWith(slot.startTime.split(":")[0])
                    );
                    updatedCourses[targetIndex] = movedCourse;
                } else {
                    // Add the moved course to the new location
                    updatedCourses.push(movedCourse);
                }
                
                setPlacementCourses({
                    ...placementCourses,
                    [day]: updatedCourses
                });
                setHasUnsavedChanges(true);
                return;
            }

            // Original logic for groups, tutors, and students
            const existingCourses = dayCourses.filter(
                (c) => c.room === room && c.time.startsWith(slot.startTime.split(":")[0])
            );

            let updatedCourses: Course[] = [...dayCourses];
            let courseToUpdate: Course | null = existingCourses.length > 0 ? existingCourses[0] : null;

            if (!courseToUpdate) {
                // Create new course
                const newCourse: Course = {
                    time: slot.startTime,
                    room: room,
                    tutor: "",
                    students: 0,
                    subject: "",
                    color: "bg-blue-500",
                    studentNames: [],
                };
                courseToUpdate = newCourse;
                updatedCourses.push(newCourse);
            }

            // Update course based on dragged item type
            if (!courseToUpdate) return; // Safety check
            
            const currentCourse = courseToUpdate; // Store reference for TypeScript
            
            if (draggedItem.type === 'group') {
                const group = draggedItem.data;
                currentCourse.groupId = group.id;
                currentCourse.tutor = group.tutor || currentCourse.tutor || "";
                const existingStudentNames = currentCourse.studentNames || [];
                currentCourse.studentNames = [
                    ...existingStudentNames,
                    ...(group.students || []).filter((s: string) => !existingStudentNames.includes(s))
                ];
                currentCourse.students = currentCourse.studentNames.length;
                currentCourse.color = group.color === "blue" ? "bg-blue-500" : 
                                      group.color === "purple" ? "bg-purple-500" : 
                                      group.color === "green" ? "bg-green-500" : "bg-orange-500";
            } else if (draggedItem.type === 'tutor') {
                const tutor = draggedItem.data;
                if (!currentCourse.tutor || currentCourse.tutor === "") {
                    currentCourse.tutor = tutor.name;
                }
            } else if (draggedItem.type === 'student') {
                const student = draggedItem.data;
                if (!currentCourse.studentNames) {
                    currentCourse.studentNames = [];
                }
                if (!currentCourse.studentNames.includes(student.name)) {
                    currentCourse.studentNames.push(student.name);
                    currentCourse.students = currentCourse.studentNames.length;
                }
            }

            // Update the course in the array
            const courseIndex = updatedCourses.findIndex(
                (c) => c.room === currentCourse.room && 
                       c.time.startsWith(currentCourse.time.split(":")[0]) &&
                       c === currentCourse
            );
            if (courseIndex >= 0) {
                updatedCourses[courseIndex] = currentCourse;
            }

            setPlacementCourses({
                ...placementCourses,
                [day]: updatedCourses
            });
            setHasUnsavedChanges(true);
        };

        // Handle removing a person from a course
        const handleRemovePersonFromCourse = (course: Course, personName: string, personType: 'student' | 'tutor', day: Day) => {
            const dayCourses = placementCourses[day] || [];
            // Find course by matching room, time slot, and having the same student names (for uniqueness)
            const courseIndex = dayCourses.findIndex(
                (c) => c.room === course.room && 
                       c.time.startsWith(course.time.split(":")[0]) &&
                       c.tutor === course.tutor &&
                       JSON.stringify(c.studentNames?.sort()) === JSON.stringify(course.studentNames?.sort())
            );

            if (courseIndex === -1) return;

            const updatedCourses = [...dayCourses];
            const courseToUpdate = { ...updatedCourses[courseIndex] };

            if (personType === 'student') {
                // Remove student from course
                courseToUpdate.studentNames = (courseToUpdate.studentNames || []).filter(name => name !== personName);
                courseToUpdate.students = courseToUpdate.studentNames.length;
                
                // Check if all students from the group are still present
                if (courseToUpdate.groupId) {
                    const group = groups.find(g => g.id === courseToUpdate.groupId);
                    if (group) {
                        const remainingGroupStudents = courseToUpdate.studentNames.filter(name => 
                            group.students.includes(name)
                        );
                        // If no students from the group remain, remove the groupId
                        if (remainingGroupStudents.length === 0) {
                            courseToUpdate.groupId = undefined;
                        }
                    }
                }
                
                // If no students left and no tutor, remove the course
                if (courseToUpdate.studentNames.length === 0 && (!courseToUpdate.tutor || courseToUpdate.tutor.trim() === "")) {
                    updatedCourses.splice(courseIndex, 1);
                } else {
                    updatedCourses[courseIndex] = courseToUpdate;
                }
            } else if (personType === 'tutor') {
                // Remove tutor from course
                courseToUpdate.tutor = "";
                
                // If no students left, remove the course
                if (!courseToUpdate.studentNames || courseToUpdate.studentNames.length === 0) {
                    updatedCourses.splice(courseIndex, 1);
                } else {
                    updatedCourses[courseIndex] = courseToUpdate;
                }
            }

            setPlacementCourses({
                ...placementCourses,
                [day]: updatedCourses
            });
            setHasUnsavedChanges(true);
        };
        
        // Ensure placementDay is valid (has time slots)
        useEffect(() => {
            const availableDays = getDaysWithTimeSlots(timeSlots);
            if (availableDays.length > 0 && !availableDays.includes(placementDay)) {
                setPlacementDay(availableDays[0]);
            }
        }, [timeSlots]);

        // Update selected course details when placementCourses changes
        useEffect(() => {
            if (selectedCourseForDetails) {
                const dayCourses = placementCourses[placementDay] || [];
                // Try to find the course by room and time slot
                const matchingCourses = dayCourses.filter(c => 
                    c.room === selectedCourseForDetails.room && 
                    c.time.startsWith(selectedCourseForDetails.time.split(":")[0])
                );
                
                if (matchingCourses.length === 0) {
                    // Course was removed, close modal
                    setSelectedCourseForDetails(null);
                } else if (matchingCourses.length === 1) {
                    // Update with the found course
                    setSelectedCourseForDetails(matchingCourses[0]);
                } else {
                    // Multiple courses in same slot, try to find exact match
                    const exactMatch = matchingCourses.find(c =>
                        c.tutor === selectedCourseForDetails.tutor &&
                        JSON.stringify(c.studentNames?.sort()) === JSON.stringify(selectedCourseForDetails.studentNames?.sort())
                    );
                    if (exactMatch) {
                        setSelectedCourseForDetails(exactMatch);
                    } else {
                        // Use first match if no exact match
                        setSelectedCourseForDetails(matchingCourses[0]);
                    }
                }
            }
        }, [placementCourses, placementDay]);

        return (
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex flex-col">
                {/* Top Action Bar */}
                <div className="bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    <BookOpen className="text-orange-500" size={28} />
                                    Gestion des placements
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goToPreviousWeek}
                                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center"
                                        title="Semaine précédente"
                                    >
                                        <ChevronLeft size={18} className="text-slate-700" />
                                    </button>
                                    <button
                                        onClick={goToCurrentWeek}
                                        disabled={isCurrentWeek()}
                                        className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                                            isCurrentWeek() 
                                                ? 'bg-slate-100 text-slate-500 cursor-default' 
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                        title={isCurrentWeek() ? "Semaine actuelle" : "Retour à cette semaine"}
                                    >
                                        {formatWeekRange(currentWeekStart)}
                                    </button>
                                    <button
                                        onClick={goToNextWeek}
                                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center"
                                        title="Semaine suivante"
                                    >
                                        <ChevronRight size={18} className="text-slate-700" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                                Organisez les groupes, tuteurs et élèves dans les salles
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {hasUnsavedChanges && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                                    <AlertCircle size={16} className="text-amber-600" />
                                    <span className="text-sm font-medium text-amber-700">Modifications non sauvegardées</span>
                                </div>
                            )}
                            <button
                                onClick={() => setShowSaveHistory(!showSaveHistory)}
                                className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 relative"
                            >
                                <Clock size={16} />
                                Historique
                                {savedStates.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {savedStates.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={handleSaveState}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle size={16} />
                                Sauvegarder
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <Printer size={16} />
                                Imprimer
                            </button>
                            <button
                                onClick={handleDuplicate}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                            >
                                <Copy size={16} />
                                Dupliquer
                            </button>
                        </div>
                    </div>

                    {/* History Dropdown */}
                    {showSaveHistory && savedStates.length > 0 && (
                        <div className="absolute right-6 top-32 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 w-96">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-slate-900">Historique des sauvegardes</h3>
                                <button onClick={() => setShowSaveHistory(false)}>
                                    <X size={18} className="text-slate-400 hover:text-slate-700" />
                                </button>
                            </div>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {savedStates.map((state) => (
                                    <div key={state.id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{state.timestamp}</div>
                                                <div className="text-xs text-slate-600">État sauvegardé</div>
                                            </div>
                                            <button
                                                onClick={() => handleRestoreState(state.id)}
                                                className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm transition-colors"
                                            >
                                                Restaurer
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Duplicate Modal */}
                    {showDuplicateModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 w-96">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-slate-900 text-lg">Dupliquer la configuration</h3>
                                    <button 
                                        onClick={() => {
                                            setShowDuplicateModal(false);
                                            setDuplicateTargetDate(null);
                                        }}
                                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                                    >
                                        <X size={18} className="text-slate-400 hover:text-slate-700" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Semaine actuelle
                                        </label>
                                        <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-600">
                                            {formatWeekRange(currentWeekStart)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Dupliquer vers la semaine du
                                        </label>
                                        <input
                                            type="date"
                                            value={duplicateTargetDate ? duplicateTargetDate.toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                const date = new Date(e.target.value);
                                                if (!isNaN(date.getTime())) {
                                                    setDuplicateTargetDate(date);
                                                }
                                            }}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        {duplicateTargetDate && (
                                            <div className="mt-2 text-sm text-slate-600">
                                                {formatWeekRange(getWeekStart(duplicateTargetDate))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => {
                                                setShowDuplicateModal(false);
                                                setDuplicateTargetDate(null);
                                            }}
                                            className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={confirmDuplicate}
                                            disabled={!duplicateTargetDate}
                                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                                        >
                                            Dupliquer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel - Resources with Accordion */}
                    {showFilterPanel && (
                        <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-slate-900 text-lg">Ressources</h3>
                                    <button
                                        onClick={() => setShowFilterPanel(false)}
                                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                                    >
                                        <X size={18} className="text-slate-500" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500">Glissez-déposez dans la grille</p>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {/* Groups Accordion Section */}
                                <div className="border-b border-slate-200">
                                    <button
                                        onClick={() => toggleSection('groups')}
                                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Users size={18} className="text-orange-500" />
                                            <h4 className="font-semibold text-slate-900">Groupes</h4>
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                                                {groups.length}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            size={18}
                                            className={`text-slate-400 transition-transform ${expandedSections.groups ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {expandedSections.groups && (
                                        <div className="px-4 pb-4 space-y-3 max-h-96 overflow-y-auto">
                                            {groups.map((group) => {
                                                const groupTitle = group.tutor ? `Tutorat avec ${group.tutor}` : group.name;
                                                return (
                                                <div
                                                    key={group.id}
                                                    draggable
                                                    onDragStart={() => setDraggedItem({ type: 'group', data: group })}
                                                    onDragEnd={() => setDraggedItem(null)}
                                                    className="border-2 rounded-xl p-4 hover:border-orange-300 transition-colors cursor-move border-slate-200 bg-white hover:shadow-lg"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="font-semibold text-slate-900">{groupTitle}</div>
                                                        <div className={`text-xs px-2 py-1 rounded-full ${
                                                            group.tutor ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                        }`}>
                                                            {group.tutor ? "Avec tuteur" : "Sans tuteur"}
                                                        </div>
                                                    </div>
                                                    {!group.tutor && (
                                                        <div className="text-sm text-slate-600 mb-2">
                                                            Aucun tuteur assigné
                                                        </div>
                                                    )}
                                                    {/* Students Section */}
                                                    {group.students && group.students.length > 0 ? (
                                                        <div className="mb-3">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Users size={14} className="text-slate-400" />
                                                                <span className="text-xs text-slate-600 font-medium">{group.students.length} élève(s)</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {group.students.slice(0, 4).map((studentName, idx) => {
                                                                    const grade = getStudentGrade(studentName);
                                                                    const formattedName = formatStudentName(studentName, grade);
                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            className="px-2 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200"
                                                                            title={studentName}
                                                                        >
                                                                            {formattedName}
                                                                        </div>
                                                                    );
                                                                })}
                                                                {group.students.length > 4 && (
                                                                    <div className="px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                                        +{group.students.length - 4}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Users size={14} className="text-slate-400" />
                                                            <span className="text-sm text-slate-600">0 élève(s)</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-end">
                                                        <div className="text-xs text-slate-500 font-medium">
                                                            {group.totalPG} PG
                                                        </div>
                                                    </div>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Tutors Accordion Section */}
                                <div className="border-b border-slate-200">
                                    <button
                                        onClick={() => toggleSection('tutors')}
                                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Users size={18} className="text-blue-500" />
                                            <h4 className="font-semibold text-slate-900">Tuteurs</h4>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                                {filteredTutors.length}/{tutors.length}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            size={18}
                                            className={`text-slate-400 transition-transform ${expandedSections.tutors ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {expandedSections.tutors && (
                                        <div className="px-4 pb-4">
                                            <div className="relative mb-3">
                                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    type="text"
                                                    placeholder="Rechercher tuteur..."
                                                    value={tutorSearch}
                                                    onChange={(e) => setTutorSearch(e.target.value)}
                                                    className="w-full pl-8 pr-10 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    onClick={() => setShowTutorFilters(!showTutorFilters)}
                                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors ${showTutorFilters || activeTutorFiltersCount > 0
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                        }`}
                                                >
                                                    <Filter size={14} />
                                                    {activeTutorFiltersCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                            {activeTutorFiltersCount}
                                                        </span>
                                                    )}
                                                </button>

                                                {/* Tutor Filters Popup */}
                                                {showTutorFilters && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-semibold text-slate-900 text-sm">Filtres</h4>
                                                            <button onClick={() => setShowTutorFilters(false)}>
                                                                <X size={16} className="text-slate-400 hover:text-slate-700" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="text-xs font-semibold text-slate-700 mb-2 block">Disponibilité</label>
                                                                <div className="space-y-1.5">
                                                                    {[
                                                                        { value: 'available', label: 'Disponible' },
                                                                        { value: 'full', label: 'Complet' }
                                                                    ].map((option) => (
                                                                        <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={tutorAvailabilityFilter.includes(option.value)}
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        setTutorAvailabilityFilter([...tutorAvailabilityFilter, option.value]);
                                                                                    } else {
                                                                                        setTutorAvailabilityFilter(tutorAvailabilityFilter.filter(v => v !== option.value));
                                                                                    }
                                                                                }}
                                                                                className="rounded text-blue-500 focus:ring-blue-500"
                                                                            />
                                                                            <span className="text-xs text-slate-700">{option.label}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="border-t border-slate-200 pt-3">
                                                                <label className="text-xs font-semibold text-slate-700 mb-2 block">Spécialités</label>
                                                                <div className="space-y-1.5">
                                                                    {["Math", "Sciences", "Français", "Anglais", "Chimie"].map((spec) => (
                                                                        <label key={spec} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={tutorSpecialtyFilter.includes(spec)}
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        setTutorSpecialtyFilter([...tutorSpecialtyFilter, spec]);
                                                                                    } else {
                                                                                        setTutorSpecialtyFilter(tutorSpecialtyFilter.filter(s => s !== spec));
                                                                                    }
                                                                                }}
                                                                                className="rounded text-blue-500 focus:ring-blue-500"
                                                                            />
                                                                            <span className="text-xs text-slate-700">{spec}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200">
                                                            <button
                                                                onClick={() => {
                                                                    setTutorAvailabilityFilter([]);
                                                                    setTutorSpecialtyFilter([]);
                                                                }}
                                                                className="flex-1 px-3 py-2 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                                            >
                                                                Réinitialiser
                                                            </button>
                                                            <button
                                                                onClick={() => setShowTutorFilters(false)}
                                                                className="flex-1 px-3 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                            >
                                                                Appliquer
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                                {filteredTutors.map((tutor) => {
                                                    const tutorGroup = getGroupForPerson(tutor.name);
                                                    return (
                                                        <div
                                                            key={tutor.id}
                                                            draggable
                                                            onDragStart={() => setDraggedItem({ type: 'tutor', data: tutor })}
                                                            onDragEnd={() => setDraggedItem(null)}
                                                            className={`p-3 rounded-lg border-2 cursor-move transition-all ${tutor.available
                                                                ? 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-lg'
                                                                : 'bg-slate-100 border-slate-300 opacity-60'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div className="font-medium text-slate-900 text-sm">{tutor.name}</div>
                                                                <div className={`w-2 h-2 rounded-full ${tutor.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                            </div>
                                                            {tutorGroup && (
                                                                <div className="mb-1">
                                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                                                        {tutorGroup.name}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-slate-600 mb-1">{tutor.capacity} PG</div>
                                                            <div className="flex gap-1 flex-wrap">
                                                                {tutor.specialties.map((spec, idx) => (
                                                                    <span key={idx} className="text-xs bg-white px-2 py-0.5 rounded-full">
                                                                        {spec}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Students Accordion Section */}
                                <div className="border-b border-slate-200">
                                    <button
                                        onClick={() => toggleSection('students')}
                                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={18} className="text-purple-500" />
                                            <h4 className="font-semibold text-slate-900">Élèves</h4>
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                                                {filteredStudents.length}/{students.length}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            size={18}
                                            className={`text-slate-400 transition-transform ${expandedSections.students ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {expandedSections.students && (
                                        <div className="px-4 pb-4">
                                            <div className="relative mb-3">
                                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    type="text"
                                                    placeholder="Rechercher élève..."
                                                    value={studentSearch}
                                                    onChange={(e) => setStudentSearch(e.target.value)}
                                                    className="w-full pl-8 pr-10 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                                <button
                                                    onClick={() => setShowStudentFilters(!showStudentFilters)}
                                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors ${showStudentFilters || activeStudentFiltersCount > 0
                                                        ? "bg-purple-100 text-purple-600"
                                                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                        }`}
                                                >
                                                    <Filter size={14} />
                                                    {activeStudentFiltersCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                            {activeStudentFiltersCount}
                                                        </span>
                                                    )}
                                                </button>

                                                {/* Student Filters Popup */}
                                                {showStudentFilters && (
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-semibold text-slate-900 text-sm">Filtres</h4>
                                                            <button onClick={() => setShowStudentFilters(false)}>
                                                                <X size={16} className="text-slate-400 hover:text-slate-700" />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="text-xs font-semibold text-slate-700 mb-2 block">Niveau scolaire</label>
                                                                <div className="space-y-1.5">
                                                                    {["Sec. 1", "Sec. 2", "Sec. 3", "Sec. 4", "Sec. 5"].map((grade) => (
                                                                        <label key={grade} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={studentGradeFilter.includes(grade)}
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        setStudentGradeFilter([...studentGradeFilter, grade]);
                                                                                    } else {
                                                                                        setStudentGradeFilter(studentGradeFilter.filter(g => g !== grade));
                                                                                    }
                                                                                }}
                                                                                className="rounded text-purple-500 focus:ring-purple-500"
                                                                            />
                                                                            <span className="text-xs text-slate-700">{grade}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="border-t border-slate-200 pt-3">
                                                                <label className="text-xs font-semibold text-slate-700 mb-2 block">Points de Gestion (PG)</label>
                                                                <select
                                                                    value={studentPgFilter}
                                                                    onChange={(e) => setStudentPgFilter(e.target.value)}
                                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                                                                >
                                                                    <option value="">Tous</option>
                                                                    <option value="2">2 PG</option>
                                                                    <option value="3">3 PG</option>
                                                                    <option value="4">4 PG</option>
                                                                    <option value="5">5 PG et plus</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200">
                                                            <button
                                                                onClick={() => {
                                                                    setStudentGradeFilter([]);
                                                                    setStudentPgFilter("");
                                                                }}
                                                                className="flex-1 px-3 py-2 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                                            >
                                                                Réinitialiser
                                                            </button>
                                                            <button
                                                                onClick={() => setShowStudentFilters(false)}
                                                                className="flex-1 px-3 py-2 text-xs bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                                            >
                                                                Appliquer
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                                {filteredStudents.map((student) => {
                                                    const studentGroup = getGroupForPerson(student.name);
                                                    return (
                                                        <div
                                                            key={student.id}
                                                            draggable
                                                            onDragStart={() => setDraggedItem({ type: 'student', data: student })}
                                                            onDragEnd={() => setDraggedItem(null)}
                                                            className="p-3 bg-purple-50 border-2 border-purple-200 rounded-lg cursor-move hover:border-purple-400 hover:shadow-lg transition-all"
                                                        >
                                                            <div className="font-medium text-slate-900 text-sm mb-1">{student.name}</div>
                                                            {studentGroup && (
                                                                <div className="mb-1">
                                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                                                        {studentGroup.name}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-slate-600">
                                                                {student.grade} • {student.pg} PG
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Area - Grid View */}
                    <div className="flex-1 overflow-auto p-6">
                        {!showFilterPanel && (
                            <button
                                onClick={() => setShowFilterPanel(true)}
                                className="mb-4 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                <Menu size={16} />
                                Afficher les ressources
                            </button>
                        )}

                        {/* View Selector and Day Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPlacementView("grid")}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${placementView === "grid"
                                            ? "bg-orange-500 text-white shadow-md"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        <Calendar size={16} />
                                        Vue grille
                                    </button>
                                    <button
                                        onClick={() => setPlacementView("detailed")}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${placementView === "detailed"
                                            ? "bg-orange-500 text-white shadow-md"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        <Eye size={16} />
                                        Vue détaillée
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600">Afficher:</span>
                                    <select className="px-3 py-2 bg-slate-100 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                        <option>Toutes les salles</option>
                                        <option>Salles occupées</option>
                                        <option>Salles libres</option>
                                    </select>
                                </div>
                            </div>

                            {/* Day and Time Slot Selector */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                <div className="mb-3">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Jours de la semaine</h4>
                                    <div className="flex gap-2">
                                        {getDaysWithTimeSlots(timeSlots).map((day) => (
                                            <button
                                                key={day}
                                                onClick={() => {
                                                    setPlacementDay(day);
                                                    // Reset selected time slots for both views if they're not available for the new day
                                                    const dayTimeSlots = timeSlots.filter(slot => slot.daysOfWeek.includes(day));
                                                    const availableSlotIds = dayTimeSlots.map(slot => slot.id);
                                                    if (placementView === "detailed") {
                                                        setSelectedTimeSlotsForDetailedView(prev => 
                                                            prev.filter(id => availableSlotIds.includes(id))
                                                        );
                                                    }
                                                    if (placementView === "grid") {
                                                        setSelectedTimeSlotsForGridView(prev => 
                                                            prev.filter(id => availableSlotIds.includes(id))
                                                        );
                                                    }
                                                }}
                                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${placementDay === day
                                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    }`}
                                            >
                                                {formatDayWithDate(day, currentWeekStart)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Time Slots Selector for both views */}
                                {filteredPlacementTimeSlots.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Créneaux</h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {filteredPlacementTimeSlots.map((slot) => {
                                                const isSelected = placementView === "detailed" 
                                                    ? selectedTimeSlotsForDetailedView.includes(slot.id)
                                                    : selectedTimeSlotsForGridView.includes(slot.id);
                                                return (
                                                    <button
                                                        key={slot.id}
                                                        onClick={() => {
                                                            if (placementView === "detailed") {
                                                                setSelectedTimeSlotsForDetailedView(prev => {
                                                                    if (prev.includes(slot.id)) {
                                                                        return prev.filter(id => id !== slot.id);
                                                                    } else {
                                                                        return [...prev, slot.id];
                                                                    }
                                                                });
                                                            } else {
                                                                setSelectedTimeSlotsForGridView(prev => {
                                                                    if (prev.includes(slot.id)) {
                                                                        return prev.filter(id => id !== slot.id);
                                                                    } else {
                                                                        return [...prev, slot.id];
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${isSelected
                                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                            }`}
                                                    >
                                                        {slot.label} ({slot.startTime} - {slot.endTime})
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Grid Layout - All Rooms */}
                        {placementView === "grid" && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                                            <th className="p-4 text-left font-semibold text-slate-700 border-b-2 border-slate-200 sticky left-0 bg-slate-100 z-10">
                                                Salles
                                            </th>
                                            {(() => {
                                                const displayedSlots = selectedTimeSlotsForGridView.length > 0
                                                    ? filteredPlacementTimeSlots.filter(slot => selectedTimeSlotsForGridView.includes(slot.id))
                                                    : filteredPlacementTimeSlots;
                                                
                                                return displayedSlots.length > 0 ? (
                                                    displayedSlots.map((slot) => (
                                                    <th
                                                        key={slot.id}
                                                        className="p-4 text-center font-semibold text-slate-700 border-b-2 border-slate-200 min-w-[250px]"
                                                    >
                                                        <div>{slot.label}</div>
                                                        <div className="text-xs font-normal text-slate-500">
                                                            {slot.startTime} - {slot.endTime}
                                                        </div>
                                                    </th>
                                                    ))
                                                ) : (
                                                    <th className="p-4 text-center font-semibold text-slate-500 border-b-2 border-slate-200 italic">
                                                        {selectedTimeSlotsForGridView.length > 0 ? "Aucun créneau correspond à votre sélection" : "Aucun cours"}
                                                    </th>
                                                );
                                            })()}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allRooms.map((room, roomIdx) => (
                                            <tr
                                                key={room}
                                                className={`transition-colors ${roomIdx % 2 === 0 ? "bg-white" : "bg-slate-50"
                                                    } hover:bg-orange-50`}
                                            >
                                                <td className="p-4 font-semibold text-slate-900 border-r-2 border-slate-200 sticky left-0 bg-inherit z-10">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={16} className="text-orange-500" />
                                                        {room}
                                                    </div>
                                                </td>
                                                {(() => {
                                                    const displayedSlots = selectedTimeSlotsForGridView.length > 0
                                                        ? filteredPlacementTimeSlots.filter(slot => selectedTimeSlotsForGridView.includes(slot.id))
                                                        : filteredPlacementTimeSlots;
                                                    
                                                    return displayedSlots.length > 0 ? (
                                                        displayedSlots.map((slot) => {
                                                        const roomCourses = getPlacementCoursesForRoomAndSlot(room, slot.startTime, placementDay);
                                                        return (
                                                            <td
                                                                key={`${room}-${slot.id}`}
                                                                className="p-3 border border-slate-200 align-top"
                                                                onDragOver={(e) => e.preventDefault()}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    handleDrop(room, slot, placementDay);
                                                                    setDraggedItem(null);
                                                                }}
                                                            >
                                                            {roomCourses.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {roomCourses.map((course, idx) => {
                                                                        const group = getGroupForCourse(course);
                                                                        const courseTitle = getCourseTitle(course, placementDay, slot);
                                                                        return (
                                                                            <div
                                                                                key={idx}
                                                                                draggable
                                                                                onDragStart={(e) => {
                                                                                    setDraggedItem({ type: 'course', data: course });
                                                                                    e.dataTransfer.effectAllowed = 'move';
                                                                                }}
                                                                                onDragEnd={() => setDraggedItem(null)}
                                                                                onClick={() => setSelectedCourseForDetails(course)}
                                                                                className="bg-white rounded-lg shadow-sm overflow-hidden relative border border-slate-200 cursor-move hover:shadow-md transition-all"
                                                                            >
                                                                                {/* Course Header Section */}
                                                                                <div 
                                                                                    className={`${course.color || 'bg-blue-500'} text-white px-3 py-2 text-xs font-semibold relative`}
                                                                                >
                                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                                        <span className="opacity-90">{courseTitle}</span>
                                                                                        {course.tutor && course.tutor.trim() !== "" && (
                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    handleRemovePersonFromCourse(course, course.tutor, 'tutor', placementDay);
                                                                                                }}
                                                                                                className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/20"
                                                                                                title="Retirer le tuteur"
                                                                                            >
                                                                                                <X size={12} />
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                {/* Students Section - Planning mode (no attendance) */}
                                                                                {course.studentNames && course.studentNames.length > 0 ? (
                                                                                    <div className="p-2 flex flex-col gap-1.5 min-h-[60px]">
                                                                                        {course.studentNames.map((studentName, studentIdx) => {
                                                                                            const grade = getStudentGrade(studentName);
                                                                                            const formattedName = formatStudentName(studentName, grade);
                                                                                            
                                                                                            return (
                                                                                                <div
                                                                                                    key={studentIdx}
                                                                                                    className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 flex items-center gap-1.5 group"
                                                                                                >
                                                                                                    <Check size={12} className="text-green-600" />
                                                                                                    <span className="flex-1">{formattedName}</span>
                                                                                                    <button
                                                                                                        onClick={(e) => {
                                                                                                            e.stopPropagation();
                                                                                                            handleRemovePersonFromCourse(course, studentName, 'student', placementDay);
                                                                                                        }}
                                                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-100 text-red-600"
                                                                                                        title="Retirer l'élève"
                                                                                                    >
                                                                                                        <X size={12} />
                                                                                                    </button>
                                                                                                </div>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="p-3 text-center text-xs text-slate-400">
                                                                                        Aucun élève assigné
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-400 hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer min-h-[100px] flex items-center justify-center">
                                                                    <div>
                                                                        <Plus size={24} className="mx-auto mb-1 opacity-50" />
                                                                        <span className="text-xs">Glissez ici</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                    })
                                                    ) : (
                                                        <td colSpan={filteredPlacementTimeSlots.length || 1} className="p-3 border border-slate-200 text-center text-slate-400 italic">
                                                            {selectedTimeSlotsForGridView.length > 0 ? "Aucun créneau correspond à votre sélection" : "Aucun créneau disponible"}
                                                        </td>
                                                    );
                                                })()}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        )}


                        {/* Detailed View */}
                        {placementView === "detailed" && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-900">Vue détaillée - {placementDay}</h3>
                                </div>
                                
                                {(() => {
                                    const assignedTutors = getAssignedTutorsForDay(placementDay);
                                    
                                    // Filter time slots based on selection
                                    const displayedTimeSlots = selectedTimeSlotsForDetailedView.length > 0
                                        ? filteredPlacementTimeSlots.filter(slot => selectedTimeSlotsForDetailedView.includes(slot.id))
                                        : filteredPlacementTimeSlots;
                                    
                                    if (assignedTutors.length === 0) {
                                        return (
                                            <div className="p-12 text-center">
                                                <Users size={48} className="mx-auto mb-4 text-slate-300" />
                                                <p className="text-slate-500 text-lg mb-2">Aucun tuteur assigné</p>
                                                <p className="text-slate-400 text-sm">Aucun tuteur n'a été assigné à un créneau pour ce jour.</p>
                                            </div>
                                        );
                                    }

                                    if (displayedTimeSlots.length === 0) {
                                        return (
                                            <div className="p-12 text-center">
                                                <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
                                                <p className="text-slate-500 text-lg mb-2">Aucun créneau disponible</p>
                                                <p className="text-slate-400 text-sm">
                                                    {selectedTimeSlotsForDetailedView.length > 0 
                                                        ? "Aucun créneau correspond à votre sélection."
                                                        : "Aucun créneau horaire n'est disponible pour ce jour."}
                                                </p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                                                        <th className="p-4 text-left font-semibold text-slate-700 border-b-2 border-slate-200 sticky left-0 bg-slate-100 z-10 min-w-[200px]">
                                                            <div className="flex items-center gap-2">
                                                                <Users size={18} className="text-blue-500" />
                                                                Tuteurs
                                                            </div>
                                                        </th>
                                                        {displayedTimeSlots.map((slot) => (
                                                            <th
                                                                key={slot.id}
                                                                className="p-4 text-center font-semibold text-slate-700 border-b-2 border-slate-200 min-w-[300px]"
                                                            >
                                                                <div>{slot.label}</div>
                                                                <div className="text-xs font-normal text-slate-500">
                                                                    {slot.startTime} - {slot.endTime}
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {assignedTutors.map((tutorName, tutorIdx) => {
                                                        const tutor = tutors.find(t => t.name === tutorName);
                                                        const group = getGroupForPerson(tutorName);
                                                        
                                                        return (
                                                            <tr
                                                                key={tutorName}
                                                                className={`transition-colors ${tutorIdx % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-orange-50`}
                                                            >
                                                                <td className="p-4 font-semibold text-slate-900 border-r-2 border-slate-200 sticky left-0 bg-inherit z-10">
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span>{tutorName}</span>
                                                                            {group && (
                                                                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                                                                    {group.name}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {tutor && (
                                                                            <div className="text-xs text-slate-600">
                                                                                {tutor.specialties.join(", ")} • {tutor.capacity} PG
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                {displayedTimeSlots.map((slot) => {
                                                                    const tutorCourses = getTutorCoursesForSlot(tutorName, slot, placementDay);
                                                                    
                                                                    return (
                                                                        <td
                                                                            key={`${tutorName}-${slot.id}`}
                                                                            className="p-3 border border-slate-200 align-top"
                                                                        >
                                                                            {tutorCourses.length > 0 ? (
                                                                                <div className="space-y-3">
                                                                                    {tutorCourses.map((course, courseIdx) => (
                                                                                        <div
                                                                                            key={courseIdx}
                                                                                            className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                                                                                        >
                                                                                            <div className="bg-blue-500 text-white px-3 py-2 text-xs font-semibold">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <MapPin size={12} />
                                                                                                    {course.room}
                                                                                                </div>
                                                                                            </div>
                                                                                            {course.studentNames && course.studentNames.length > 0 ? (
                                                                                                <div className="p-2 flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                                                                                                    {course.studentNames.map((studentName, studentIdx) => {
                                                                                                        const grade = getStudentGrade(studentName);
                                                                                                        const formattedName = formatStudentName(studentName, grade);
                                                                                                        
                                                                                                        return (
                                                                                                            <div
                                                                                                                key={studentIdx}
                                                                                                                className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 flex items-center gap-1.5"
                                                                                                            >
                                                                                                                <Check size={12} className="text-green-600" />
                                                                                                                <span className="flex-1">{formattedName}</span>
                                                                                                            </div>
                                                                                                        );
                                                                                                    })}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="p-3 text-center text-xs text-slate-400">
                                                                                                    Aucun élève assigné
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="text-center text-slate-400 text-sm py-4">
                                                                                    -
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Course Details Modal */}
                {selectedCourseForDetails && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedCourseForDetails(null)}
                    >
                        <div 
                            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-900">Détails du cours</h3>
                                    <button
                                        onClick={() => setSelectedCourseForDetails(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X size={20} className="text-slate-500" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {/* Course Info */}
                                <div className="mb-6">
                                    {(() => {
                                        const group = getGroupForCourse(selectedCourseForDetails);
                                        const slot = filteredPlacementTimeSlots.find(s => s.startTime === selectedCourseForDetails.time || selectedCourseForDetails.time.startsWith(s.startTime.split(":")[0]));
                                        const courseTitle = slot ? getCourseTitle(selectedCourseForDetails, placementDay, slot) : (selectedCourseForDetails.tutor ? `Tutorat avec ${selectedCourseForDetails.tutor}` : `Salle ${selectedCourseForDetails.room}`);
                                        
                                        // Check if all students from the group are still present in the course
                                        const shouldShowGroup = group && selectedCourseForDetails.groupId && selectedCourseForDetails.studentNames && 
                                            group.students.every(studentName => selectedCourseForDetails.studentNames?.includes(studentName));
                                        
                                        // Get actual student count
                                        const actualStudentCount = selectedCourseForDetails.studentNames?.length || 0;
                                        
                                        return (
                                            <>
                                                <div className={`${selectedCourseForDetails.color || 'bg-blue-500'} text-white rounded-lg p-4 mb-4`}>
                                                    <div className="font-bold text-lg mb-1">{courseTitle}</div>
                                                    <div className="text-sm opacity-90">{selectedCourseForDetails.room} • {selectedCourseForDetails.time}</div>
                                                </div>
                                                
                                                {/* Tutor Info */}
                                                {selectedCourseForDetails.tutor && selectedCourseForDetails.tutor.trim() !== "" && (
                                                    <div className="mb-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="text-sm font-semibold text-slate-700">Tuteur:</div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemovePersonFromCourse(selectedCourseForDetails, selectedCourseForDetails.tutor, 'tutor', placementDay);
                                                                }}
                                                                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                title="Retirer le tuteur"
                                                            >
                                                                Retirer
                                                            </button>
                                                        </div>
                                                        <div className="text-lg font-medium text-slate-900">{selectedCourseForDetails.tutor}</div>
                                                        {shouldShowGroup && group && group.tutor && group.tutor === selectedCourseForDetails.tutor && (
                                                            <div className="text-xs text-slate-500 mt-1">Tuteur du groupe</div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Group Info - Only show if all group students are present */}
                                                {shouldShowGroup && group && (
                                                    <div className="mb-4 border-2 rounded-xl p-4 border-slate-200 bg-white">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="font-semibold text-slate-900">Groupe: {group.name}</div>
                                                            <div className={`text-xs px-2 py-1 rounded-full ${
                                                                group.tutor ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                            }`}>
                                                                {group.tutor ? "Avec tuteur" : "Sans tuteur"}
                                                            </div>
                                                        </div>
                                                        {group.tutor && (
                                                            <div className="text-sm text-slate-600 mb-2">
                                                                Tuteur: {group.tutor}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-end mb-2">
                                                            <div className="text-xs text-slate-500 font-medium">
                                                                {group.totalPG} PG
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Students List */}
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-700 mb-3">
                                                        Élèves ({actualStudentCount}):
                                                    </div>
                                                    {selectedCourseForDetails.studentNames && selectedCourseForDetails.studentNames.length > 0 ? (
                                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                                            {selectedCourseForDetails.studentNames.map((studentName, idx) => {
                                                                const grade = getStudentGrade(studentName);
                                                                const formattedName = formatStudentName(studentName, grade);
                                                                return (
                                                                    <div key={idx} className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded-lg group">
                                                                        <Check size={16} className="text-green-600" />
                                                                        <span className="text-slate-900 flex-1">{formattedName}</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleRemovePersonFromCourse(selectedCourseForDetails, studentName, 'student', placementDay);
                                                                            }}
                                                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-100 text-red-600"
                                                                            title="Retirer l'élève"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-slate-500 text-sm">
                                                            Aucun élève assigné
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Stats Page
    const StatsPage = () => {
        // Scroll vers la section ciblée quand on arrive depuis le dashboard
        useEffect(() => {
            if (targetStatsSection) {
                // Attendre que le DOM soit rendu
                setTimeout(() => {
                    const element = document.getElementById(`stats-section-${targetStatsSection}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Mettre en surbrillance temporairement
                        element.classList.add('ring-4', 'ring-orange-300', 'ring-offset-2');
                        setTimeout(() => {
                            element.classList.remove('ring-4', 'ring-orange-300', 'ring-offset-2');
                        }, 2000);
                    }
                    // Réinitialiser le target après le scroll
                    setTargetStatsSection(null);
                }, 100);
            }
        }, [targetStatsSection]);

        // Données des élèves (même structure que dans PersonnelPage)
        const eleves = [
            {
                id: 5,
                name: "Lucas Bernard",
                type: "eleve",
                grade: "Sec. 3",
                pg: 3,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "lucas.bernard@student.com",
                phone: "514-555-1001",
                tuteur: "Marie Dupont",
                allergies: "Arachides",
                prochainsCours: [
                    { day: "Lundi", time: "8h00", subject: "Math", tuteur: "Marie Dupont" },
                    { day: "Mercredi", time: "10h30", subject: "Français", tuteur: "Jean Martin" },
                ],
            },
            {
                id: 6,
                name: "Emma Tremblay",
                type: "eleve",
                grade: "Sec. 4",
                pg: 2,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "emma.tremblay@student.com",
                phone: "514-555-1002",
                tuteur: "Jean Martin",
                allergies: "Gluten, Œufs",
                prochainsCours: [
                    { day: "Lundi", time: "8h00", subject: "Français", tuteur: "Jean Martin" },
                ],
            },
            {
                id: 7,
                name: "Noah Gagnon",
                type: "eleve",
                grade: "Sec. 5",
                pg: 4,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "noah.gagnon@student.com",
                phone: "514-555-1003",
                tuteur: "Sophie Chen",
                prochainsCours: [
                    { day: "Mardi", time: "10h30", subject: "Sciences", tuteur: "Sophie Chen" },
                ],
            },
            {
                id: 8,
                name: "Olivia Côté",
                type: "eleve",
                grade: "Sec. 3",
                pg: 2,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "olivia.cote@student.com",
                phone: "514-555-1004",
                tuteur: "Thomas Roy",
                prochainsCours: [
                    { day: "Lundi", time: "13h00", subject: "Anglais", tuteur: "Thomas Roy" },
                ],
            },
            {
                id: 9,
                name: "William Roy",
                type: "eleve",
                grade: "Sec. 4",
                pg: 3,
                status: "active",
                avatar: "from-slate-300 to-slate-400",
                email: "william.roy@student.com",
                phone: "514-555-1005",
                tuteur: "Marie Dupont",
                allergies: "Fruits de mer",
                prochainsCours: [
                    { day: "Lundi", time: "15h30", subject: "Math", tuteur: "Marie Dupont" },
                ],
            },
        ];

        // Données des tuteurs pour calculer les PG utilisés
        const tuteurs = [
            { name: "Marie Dupont", used: 14, total: 15 },
            { name: "Sophie Chen", used: 15, total: 15 },
            { name: "Jean Martin", used: 10, total: 12 },
            { name: "Thomas Roy", used: 6, total: 10 },
        ];

        // Fonction pour calculer la répartition par matière
        const calculateSubjectDistribution = () => {
            const subjectMap: { [key: string]: { pg: number; count: number } } = {};
            
            eleves.forEach((eleve) => {
                eleve.prochainsCours?.forEach((cours) => {
                    const subject = cours.subject;
                    // Normaliser les noms de matières
                    let normalizedSubject = subject;
                    if (subject === "Math") normalizedSubject = "Mathématiques";
                    
                    if (!subjectMap[normalizedSubject]) {
                        subjectMap[normalizedSubject] = { pg: 0, count: 0 };
                    }
                    
                    // Attribuer les PG de l'élève à cette matière
                    // Si un élève a plusieurs cours, on divise les PG proportionnellement
                    const pgPerCourse = eleve.pg / (eleve.prochainsCours?.length || 1);
                    subjectMap[normalizedSubject].pg += pgPerCourse;
                    subjectMap[normalizedSubject].count += 1;
                });
            });

            // Calculer les totaux et pourcentages
            const totalPG = Object.values(subjectMap).reduce((sum, subj) => sum + subj.pg, 0);
            
            const subjectColors: { [key: string]: { color: string; textColor: string; bgColor: string } } = {
                "Mathématiques": { color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" },
                "Français": { color: "bg-purple-500", textColor: "text-purple-700", bgColor: "bg-purple-50" },
                "Sciences": { color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
                "Anglais": { color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" },
            };

            return Object.entries(subjectMap).map(([subject, data]) => ({
                subject,
                pg: Math.round(data.pg),
                count: data.count,
                percentage: totalPG > 0 ? Math.round((data.pg / totalPG) * 100) : 0,
                ...subjectColors[subject] || { color: "bg-slate-500", textColor: "text-slate-700", bgColor: "bg-slate-50" },
            })).sort((a, b) => b.pg - a.pg);
        };

        // Fonction pour calculer la répartition par difficulté
        const calculateDifficultyDistribution = () => {
            const difficultyMap: { [key: string]: { count: number; pg: number } } = {
                "Facile": { count: 0, pg: 0 },
                "Moyen": { count: 0, pg: 0 },
                "Difficile": { count: 0, pg: 0 },
                "Très difficile": { count: 0, pg: 0 },
            };

            eleves.forEach((eleve) => {
                let difficulty: string;
                if (eleve.pg === 2) {
                    difficulty = "Facile";
                } else if (eleve.pg === 3) {
                    difficulty = "Moyen";
                } else if (eleve.pg === 4) {
                    difficulty = "Difficile";
                } else {
                    difficulty = "Très difficile";
                }

                difficultyMap[difficulty].count += 1;
                difficultyMap[difficulty].pg += eleve.pg;
            });

            // Calculer les totaux et pourcentages
            const totalStudents = eleves.length;
            const totalPG = eleves.reduce((sum, eleve) => sum + eleve.pg, 0);

            const difficultyColors: { [key: string]: { color: string; textColor: string; bgColor: string } } = {
                "Facile": { color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
                "Moyen": { color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" },
                "Difficile": { color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" },
                "Très difficile": { color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50" },
            };

            return Object.entries(difficultyMap)
                .filter(([_, data]) => data.count > 0)
                .map(([difficulty, data]) => ({
                    difficulty,
                    count: data.count,
                    pg: data.pg,
                    percentage: totalStudents > 0 ? Math.round((data.count / totalStudents) * 100) : 0,
                    pgPercentage: totalPG > 0 ? Math.round((data.pg / totalPG) * 100) : 0,
                    ...difficultyColors[difficulty],
                }));
        };

        const subjectDistribution = calculateSubjectDistribution();
        const difficultyDistribution = calculateDifficultyDistribution();

        return (
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
                {/* Page Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <BarChart3 className="text-orange-500" size={28} />
                                Statistiques et rapports
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Analysez les performances et tendances pour optimiser vos ressources
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <select className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
                                <option>Cette semaine</option>
                                <option>Ce mois</option>
                                <option>Ce trimestre</option>
                                <option>Cette année</option>
                            </select>
                            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                                <Download size={16} />
                                Exporter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                {/* KPIs - Indicateurs clés */}
                <div className="grid grid-cols-4 gap-4">
                    <div id="stats-section-activeStudents" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 scroll-mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">Élèves actifs</span>
                            <Users className="text-blue-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900">142</div>
                        <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                            <TrendingUp size={14} />
                            <span>+12% ce mois</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">Taux utilisation tuteurs</span>
                            <Activity className="text-blue-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900">78%</div>
                        <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                            <TrendingUp size={14} />
                            <span>+5% vs mois dernier</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full mt-3">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">Tuteurs à capacité max</span>
                            <Target className="text-orange-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900">3/12</div>
                        <div className="text-sm text-slate-600 mt-2">25% de vos tuteurs</div>
                        <div className="mt-3 text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded">
                            ⚠️ Envisager recrutement
                        </div>
                    </div>

                    <div id="stats-section-occupancyRate" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 scroll-mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">Salles occupation moy.</span>
                            <MapPin className="text-purple-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900">82%</div>
                        <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                            <TrendingUp size={14} />
                            <span>Optimal</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full mt-3">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">Dépassements</span>
                            <AlertCircle className="text-red-500" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900">7</div>
                        <div className="text-sm text-slate-600 mt-2">cette semaine</div>
                        <div className="flex items-center gap-1 mt-3 text-red-600 text-sm">
                            <TrendingUp size={14} />
                            <span>+2 vs semaine dernière</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Remplissage des tuteurs */}
                    <div id="stats-section-tutorCapacity" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 scroll-mt-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Users className="text-blue-500" size={20} />
                            Remplissage des tuteurs
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: "Marie Dupont", used: 14, total: 15, rate: 93, status: "full" },
                                { name: "Sophie Chen", used: 15, total: 15, rate: 100, status: "critical" },
                                { name: "Jean Martin", used: 10, total: 12, rate: 83, status: "good" },
                                { name: "Thomas Roy", used: 6, total: 10, rate: 60, status: "low" },
                            ].map((tutor, idx) => (
                                <div key={idx} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{tutor.name}</div>
                                            <div className="text-xs text-slate-600">{tutor.used}/{tutor.total} PG</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${tutor.status === "critical" ? "bg-red-100 text-red-700" :
                                            tutor.status === "full" ? "bg-orange-100 text-orange-700" :
                                                tutor.status === "good" ? "bg-green-100 text-green-700" :
                                                    "bg-blue-100 text-blue-700"
                                            }`}>
                                            {tutor.rate}%
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-2 rounded-full ${tutor.status === "critical" ? "bg-red-500" :
                                                tutor.status === "full" ? "bg-orange-500" :
                                                    tutor.status === "good" ? "bg-green-500" :
                                                        "bg-blue-500"
                                                }`}
                                            style={{ width: `${tutor.rate}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                                <div className="text-xs text-amber-800">
                                    <strong>Recommandation:</strong> 2 tuteurs à pleine capacité. Considérez l'embauche d'un nouveau tuteur pour Math/Sciences.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Occupation des salles */}
                    <div id="stats-section-roomUsage" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 scroll-mt-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MapPin className="text-purple-500" size={20} />
                            Occupation des salles
                        </h3>
                        <div className="space-y-3">
                            {[
                                { room: "Salle A", rate: 95, hours: "38/40h", color: "bg-purple-500" },
                                { room: "Salle B", rate: 88, hours: "35/40h", color: "bg-blue-500" },
                                { room: "Salle C", rate: 72, hours: "29/40h", color: "bg-green-500" },
                                { room: "Salle D", rate: 65, hours: "26/40h", color: "bg-yellow-500" },
                                { room: "Salle E", rate: 45, hours: "18/40h", color: "bg-slate-400" },
                            ].map((room, idx) => (
                                <div key={idx}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="text-sm font-medium text-slate-900">{room.room}</span>
                                            <span className="text-xs text-slate-600 ml-2">{room.hours}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{room.rate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className={`${room.color} h-2.5 rounded-full transition-all`}
                                            style={{ width: `${room.rate}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-xs text-blue-800">
                                <strong>Insight:</strong> Salle E sous-utilisée. Potentiel de réaffectation ou réduction des coûts.
                            </div>
                        </div>
                    </div>

                    {/* Dépassements et alertes */}
                    <div id="stats-section-overages" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 scroll-mt-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="text-red-500" size={20} />
                            Dépassements
                        </h3>
                        <div className="space-y-3">
                            {[
                                { day: "Lundi 10h30", tutor: "Sophie Chen", over: "+2 PG", severity: "high" },
                                { day: "Mardi 15h30", tutor: "Marie Dupont", over: "+1 PG", severity: "medium" },
                                { day: "Mercredi 8h00", tutor: "Sophie Chen", over: "+3 PG", severity: "high" },
                                { day: "Jeudi 13h00", tutor: "Jean Martin", over: "+1 PG", severity: "medium" },
                            ].map((item, idx) => (
                                <div key={idx} className={`p-3 rounded-lg border ${item.severity === "high"
                                    ? "bg-red-50 border-red-200"
                                    : "bg-orange-50 border-orange-200"
                                    }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-slate-900">{item.day}</div>
                                            <div className="text-xs text-slate-600 mt-1">{item.tutor}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold ${item.severity === "high"
                                            ? "bg-red-200 text-red-800"
                                            : "bg-orange-200 text-orange-800"
                                            }`}>
                                            {item.over}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-xs text-slate-600">
                            <div className="flex items-center justify-between mb-2">
                                <span>Total cette semaine:</span>
                                <span className="font-bold text-red-600">7 dépassements</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Semaine dernière:</span>
                                <span className="font-medium">5 dépassements</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tendances et recommandations */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Évolution hebdomadaire */}
                    <div id="stats-section-plannedCourses" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 scroll-mt-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="text-green-500" size={20} />
                            Tendances hebdomadaires
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Users className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">Nouveaux élèves</div>
                                        <div className="text-xs text-slate-600">+12 cette semaine</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">+8%</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BookOpen className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">Cours planifiés</div>
                                        <div className="text-xs text-slate-600">87 cette semaine</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">+3%</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Activity className="text-orange-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">Taux présence</div>
                                        <div className="text-xs text-slate-600">Moyenne élèves</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-orange-600">94%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommandations intelligentes */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Target className="text-orange-600" size={20} />
                            Recommandations d'action
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-600 font-bold text-sm">!</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm mb-1">Urgent: Embauche recommandée</div>
                                        <div className="text-xs text-slate-600">
                                            Sophie Chen et Marie Dupont sont à 100% et 93% de capacité.
                                            Recommandation: Recruter 1 tuteur Math/Sciences pour alléger la charge.
                                        </div>
                                        <div className="mt-2 text-xs text-red-600 font-medium">
                                            Impact: Réduction de 40% des dépassements estimée
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-orange-600 font-bold text-sm">⚡</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm mb-1">Optimisation des salles</div>
                                        <div className="text-xs text-slate-600">
                                            Salle E utilisée à seulement 45%. Envisagez de redistribuer ou sous-louer.
                                        </div>
                                        <div className="mt-2 text-xs text-orange-600 font-medium">
                                            Économie potentielle: ~300$/mois
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-600 font-bold text-sm">✓</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm mb-1">Croissance positive</div>
                                        <div className="text-xs text-slate-600">
                                            +12 nouveaux élèves cette semaine. Excellente tendance!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Matières populaires */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <PieChart className="text-indigo-500" size={20} />
                        Répartition par matières
                    </h3>
                    <div className={`grid gap-4 ${subjectDistribution.length <= 5 ? 'grid-cols-5' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'}`}>
                        {subjectDistribution.length > 0 ? (
                            subjectDistribution.map((subject, idx) => (
                                <div key={idx} className={`${subject.bgColor} rounded-lg p-4 border border-slate-200`}>
                                    <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-3`}>
                                        {subject.pg}
                                    </div>
                                    <div className="font-medium text-slate-900 text-sm mb-1">{subject.subject}</div>
                                    <div className={`text-xs ${subject.textColor} font-semibold`}>{subject.percentage}% du total</div>
                                    <div className="text-xs text-slate-600 mt-1">{subject.count} cours</div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-slate-500 py-8">
                                Aucune donnée disponible
                            </div>
                        )}
                    </div>
                </div>

                {/* Répartition par difficultés */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="text-purple-500" size={20} />
                        Répartition par difficultés
                    </h3>
                    <div className={`grid gap-4 ${difficultyDistribution.length <= 4 ? 'grid-cols-4' : 'grid-cols-2 md:grid-cols-4'}`}>
                        {difficultyDistribution.length > 0 ? (
                            difficultyDistribution.map((difficulty, idx) => (
                                <div key={idx} className={`${difficulty.bgColor} rounded-lg p-4 border border-slate-200`}>
                                    <div className={`w-12 h-12 ${difficulty.color} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-3`}>
                                        {difficulty.count}
                                    </div>
                                    <div className="font-medium text-slate-900 text-sm mb-1">{difficulty.difficulty}</div>
                                    <div className={`text-xs ${difficulty.textColor} font-semibold`}>{difficulty.percentage}% des élèves</div>
                                    <div className="text-xs text-slate-600 mt-1">{difficulty.pg} PG totaux ({difficulty.pgPercentage}%)</div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-slate-500 py-8">
                                Aucune donnée disponible
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
    };

    // Settings Page - Manager Profile
    const SettingsPage = () => {
        const [showPasswordModal, setShowPasswordModal] = useState(false);
        const [showErrorReportModal, setShowErrorReportModal] = useState(false);
        const [errorDescription, setErrorDescription] = useState("");
        const [errorSeverity, setErrorSeverity] = useState("medium");

        return (
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
                {/* Page Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <UserCog className="text-orange-500" size={28} />
                        Mon Compte
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Gérez vos informations personnelles et préférences
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <UserCog size={20} className="text-orange-500" />
                            Informations personnelles
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Marie Dupont"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Adresse e-mail
                                </label>
                                <input
                                    type="email"
                                    defaultValue="marie.dupont@labonnenote.ca"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    defaultValue="+1 (514) 555-0123"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Poste
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Gestionnaire principal"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                                Sauvegarder les modifications
                            </button>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Lock size={20} className="text-orange-500" />
                            Sécurité
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left font-medium text-slate-700 transition-colors flex items-center justify-between group"
                            >
                                <span className="flex items-center gap-3">
                                    <Lock size={18} className="text-slate-500 group-hover:text-orange-500 transition-colors" />
                                    Changer le mot de passe
                                </span>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                            </button>
                            <button className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left font-medium text-slate-700 transition-colors flex items-center justify-between group">
                                <span className="flex items-center gap-3">
                                    <Activity size={18} className="text-slate-500 group-hover:text-orange-500 transition-colors" />
                                    Gérer les sessions actives
                                </span>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Theme Customization */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Palette size={20} className="text-orange-500" />
                                Personnalisation du thème
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Couleur primaire
                                    </label>
                                    <div className="flex gap-3">
                                        {["bg-orange-500", "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500"].map((color, idx) => (
                                            <button
                                                key={idx}
                                                className={`w-12 h-12 ${color} rounded-xl shadow-sm hover:scale-110 transition-transform ${idx === 0 ? "ring-2 ring-slate-900 ring-offset-2" : ""}`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Couleur secondaire
                                    </label>
                                    <div className="flex gap-3">
                                        {["bg-slate-700", "bg-indigo-600", "bg-teal-600", "bg-amber-600", "bg-pink-600"].map((color, idx) => (
                                            <button
                                                key={idx}
                                                className={`w-12 h-12 ${color} rounded-xl shadow-sm hover:scale-110 transition-transform ${idx === 0 ? "ring-2 ring-slate-900 ring-offset-2" : ""}`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Couleur tertiaire (accents)
                                    </label>
                                    <div className="flex gap-3">
                                        {["bg-cyan-400", "bg-yellow-400", "bg-lime-400", "bg-rose-400", "bg-violet-400"].map((color, idx) => (
                                            <button
                                                key={idx}
                                                className={`w-12 h-12 ${color} rounded-xl shadow-sm hover:scale-110 transition-transform ${idx === 0 ? "ring-2 ring-slate-900 ring-offset-2" : ""}`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Settings size={20} className="text-orange-500" />
                                Préférences
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Langue de l'interface
                                    </label>
                                    <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                        <option>Français (Canada)</option>
                                        <option>English (US)</option>
                                        <option>Español</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Fuseau horaire
                                    </label>
                                    <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                        <option>EST (UTC-5)</option>
                                        <option>PST (UTC-8)</option>
                                        <option>MST (UTC-7)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                        <span className="text-sm font-medium text-slate-700">Notifications par e-mail</span>
                                        <div className="w-12 h-6 bg-orange-500 rounded-full">
                                            <div className="w-5 h-5 bg-white rounded-full mt-0.5 ml-6"></div>
                                        </div>
                                    </label>
                                </div>
                                <div>
                                    <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                        <span className="text-sm font-medium text-slate-700">Alertes sonores</span>
                                        <div className="w-12 h-6 bg-slate-300 rounded-full">
                                            <div className="w-5 h-5 bg-white rounded-full mt-0.5 ml-0.5"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Reporting */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <AlertCircle size={20} className="text-orange-500" />
                            Signaler une erreur
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Vous avez rencontré un problème? Signalez-le à notre équipe technique.
                        </p>
                        <button
                            onClick={() => setShowErrorReportModal(true)}
                            className="w-full py-3 px-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-lg font-medium text-orange-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageSquare size={18} />
                            Ouvrir le formulaire de signalement
                        </button>
                    </div>
                </div>

                {/* Password Change Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Lock size={22} className="text-orange-500" />
                                Changer le mot de passe
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Report Modal */}
                {showErrorReportModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <AlertCircle size={22} className="text-orange-500" />
                                Signaler une erreur
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Gravité du problème
                                    </label>
                                    <select
                                        value={errorSeverity}
                                        onChange={(e) => setErrorSeverity(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="low">Faible - Problème mineur</option>
                                        <option value="medium">Moyen - Affecte l'utilisation</option>
                                        <option value="high">Élevé - Bloque des fonctionnalités</option>
                                        <option value="critical">Critique - Système inutilisable</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Description du problème
                                    </label>
                                    <textarea
                                        value={errorDescription}
                                        onChange={(e) => setErrorDescription(e.target.value)}
                                        placeholder="Décrivez le problème rencontré en détail..."
                                        rows={6}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Captures d'écran (optionnel)
                                    </label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
                                        <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-600">Glissez-déposez ou cliquez pour ajouter des fichiers</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowErrorReportModal(false);
                                        setErrorDescription("");
                                        setErrorSeverity("medium");
                                    }}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                    <Send size={16} />
                                    Envoyer le rapport
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Company Settings Page
    const CompanySettingsPage = () => {
        const [newSlotStart, setNewSlotStart] = useState("");
        const [newSlotEnd, setNewSlotEnd] = useState("");
        const [newSlotLabel, setNewSlotLabel] = useState("");
        const [newSlotDays, setNewSlotDays] = useState<string[]>([]);
        const [newSlotStartDate, setNewSlotStartDate] = useState("");
        const [newSlotEndDate, setNewSlotEndDate] = useState("");
        const [newRoomName, setNewRoomName] = useState("");
        const [newRoomCapacity, setNewRoomCapacity] = useState("");
        const [newRoomAccommodations, setNewRoomAccommodations] = useState<string[]>([]);
        const [roomFilterStartDate, setRoomFilterStartDate] = useState("");
        const [roomFilterEndDate, setRoomFilterEndDate] = useState("");
        const [roomFilterNoEndDate, setRoomFilterNoEndDate] = useState(false);
        const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
        const [showFilteredRooms, setShowFilteredRooms] = useState(false);
        const [blacklistEntries, setBlacklistEntries] = useState<BlacklistEntry[]>([
            {
                id: "1",
                roomName: "A-101",
                startDate: "2024-12-20",
                endDate: "2024-12-25",
                comment: "Rénovation majeure de la salle - remplacement du système de ventilation",
            },
            {
                id: "2",
                roomName: "B-201",
                startDate: undefined,
                endDate: undefined,
                comment: "Salle réservée exclusivement pour les réunions du conseil d'administration",
            },
            {
                id: "3",
                roomName: undefined,
                startDate: "2024-12-31",
                endDate: "2025-01-05",
                comment: "Fermeture annuelle de l'établissement pour les fêtes de fin d'année",
            },
            {
                id: "4",
                roomName: "A-102",
                startDate: "2024-12-15",
                endDate: undefined,
                comment: "Réparation du projecteur - date de fin à déterminer selon disponibilité des pièces",
            },
            {
                id: "5",
                roomName: "B-202",
                startDate: "2025-01-10",
                endDate: "2025-01-15",
                comment: "Formation interne du personnel - salle utilisée pour les sessions de formation",
            },
        ]);
        const [newBlacklistRoom, setNewBlacklistRoom] = useState("");
        const [newBlacklistStartDate, setNewBlacklistStartDate] = useState("");
        const [newBlacklistEndDate, setNewBlacklistEndDate] = useState("");
        const [newBlacklistNoEndDate, setNewBlacklistNoEndDate] = useState(false);
        const [newBlacklistNoRoom, setNewBlacklistNoRoom] = useState(false);
        const [newBlacklistNoDates, setNewBlacklistNoDates] = useState(false);
        const [newBlacklistComment, setNewBlacklistComment] = useState("");

        const availableRooms = ["A-101", "A-102", "B-201", "B-202"];
        const daysOfWeekOptions = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

        const toggleDay = (day: string) => {
            setNewSlotDays(prev =>
                prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
            );
        };

        const handleAddTimeSlot = () => {
            if (newSlotStart && newSlotEnd && newSlotLabel && newSlotDays.length > 0 && newSlotStartDate && newSlotEndDate) {
                const newSlot: TimeSlot = {
                    id: Date.now().toString(),
                    startTime: newSlotStart,
                    endTime: newSlotEnd,
                    label: newSlotLabel,
                    daysOfWeek: newSlotDays,
                    startDate: newSlotStartDate,
                    endDate: newSlotEndDate,
                };
                setTimeSlots([...timeSlots, newSlot]);
                setNewSlotStart("");
                setNewSlotEnd("");
                setNewSlotLabel("");
                setNewSlotDays([]);
                setNewSlotStartDate("");
                setNewSlotEndDate("");
            }
        };

        const handleDeleteTimeSlot = (id: string) => {
            setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
        };

        const handleAddBlacklist = () => {
            // Validation: at least one of roomName or startDate must be specified
            const hasRoom = !newBlacklistNoRoom && newBlacklistRoom;
            const hasDates = !newBlacklistNoDates && newBlacklistStartDate;
            
            if (hasRoom || hasDates) {
                const newEntry: BlacklistEntry = {
                    id: Date.now().toString(),
                    roomName: newBlacklistNoRoom ? undefined : (newBlacklistRoom || undefined),
                    startDate: newBlacklistNoDates ? undefined : (newBlacklistStartDate || undefined),
                    endDate: newBlacklistNoDates || newBlacklistNoEndDate ? undefined : (newBlacklistEndDate || undefined),
                    comment: newBlacklistComment.trim() || undefined,
                };
                setBlacklistEntries([...blacklistEntries, newEntry]);
                // Reset form
                setNewBlacklistRoom("");
                setNewBlacklistStartDate("");
                setNewBlacklistEndDate("");
                setNewBlacklistNoEndDate(false);
                setNewBlacklistNoRoom(false);
                setNewBlacklistNoDates(false);
                setNewBlacklistComment("");
            }
        };

        const handleDeleteBlacklist = (id: string) => {
            setBlacklistEntries(blacklistEntries.filter((entry) => entry.id !== id));
        };

        const accommodationOptions = [
            { id: "windows", label: "Fenêtres", icon: Wind },
            { id: "projector", label: "Projecteur", icon: Monitor },
            { id: "whiteboard", label: "Tableau blanc", icon: Activity },
            { id: "restroom", label: "Proximité toilettes", icon: DoorOpen },
        ];

        const toggleAccommodation = (id: string) => {
            setNewRoomAccommodations(prev =>
                prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
            );
        };

        const handleFilterRooms = () => {
            if (roomFilterStartDate) {
                // Filter rooms based on availability for the period
                // For now, we'll show all rooms as available (this would be connected to actual availability logic)
                const allRooms = [
                    { name: "A-101", capacity: 15, accommodations: ["windows", "wifi", "projector"] },
                    { name: "A-102", capacity: 12, accommodations: ["wifi", "whiteboard"] },
                    { name: "B-201", capacity: 20, accommodations: ["windows", "wifi", "projector", "restroom"] },
                    { name: "B-202", capacity: 18, accommodations: ["wifi", "projector", "whiteboard"] },
                ];
                setFilteredRooms(allRooms);
                setShowFilteredRooms(true);
            }
        };

        return (
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
                {/* Page Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Building2 className="text-orange-500" size={28} />
                        Paramètres de la Compagnie
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Gérez les paramètres organisationnels de La Bonne Note
                    </p>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* LEFT COLUMN */}
                        <div className="space-y-6">
                            {/* Organization Information */}
                            <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-lg border border-orange-100 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                                    <div className="p-2 bg-orange-500 rounded-lg">
                                        <Building2 size={20} className="text-white" />
                                    </div>
                                    Informations de l'organisation
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Nom de l'organisation
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="La Bonne Note"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            E-mail de contact
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue="contact@labonnenote.ca"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                defaultValue="+1 (514) 555-0100"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Site web
                                            </label>
                                            <input
                                                type="url"
                                                defaultValue="labonnenote.ca"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Adresse complète
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue="123 Rue Principale, Montréal, QC H2X 1Y4"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Time Slots Configuration */}
                            <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-lg border border-purple-100 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="p-2 bg-purple-500 rounded-lg">
                                        <Calendar size={20} className="text-white" />
                                    </div>
                                    Créneaux horaires
                                </h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Définissez les plages horaires disponibles
                                </p>

                                {/* Add new time slot form */}
                                <div className="bg-white/80 backdrop-blur rounded-xl p-4 mb-5 shadow-sm border border-purple-100">
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Début
                                            </label>
                                            <input
                                                type="time"
                                                value={newSlotStart}
                                                onChange={(e) => setNewSlotStart(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Fin
                                            </label>
                                            <input
                                                type="time"
                                                value={newSlotEnd}
                                                onChange={(e) => setNewSlotEnd(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Libellé
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="8h-10h"
                                                value={newSlotLabel}
                                                onChange={(e) => setNewSlotLabel(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">
                                            Jours de la semaine
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {daysOfWeekOptions.map((day) => {
                                                const isSelected = newSlotDays.includes(day);
                                                return (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => toggleDay(day)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                            isSelected
                                                                ? "bg-purple-500 text-white shadow-md"
                                                                : "bg-white border-2 border-slate-200 text-slate-600 hover:border-purple-300"
                                                        }`}
                                                    >
                                                        {day.substring(0, 3)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Date de début
                                            </label>
                                            <input
                                                type="date"
                                                value={newSlotStartDate}
                                                onChange={(e) => setNewSlotStartDate(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Date de fin
                                            </label>
                                            <input
                                                type="date"
                                                value={newSlotEndDate}
                                                onChange={(e) => setNewSlotEndDate(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddTimeSlot}
                                        className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Ajouter
                                    </button>
                                </div>

                                {/* List of time slots */}
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {timeSlots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className="flex items-center justify-between p-3 bg-white/80 backdrop-blur rounded-lg border border-purple-100 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex-1">
                                                <div className="font-bold text-slate-900">{slot.label}</div>
                                                <div className="text-xs text-slate-500">
                                                    {slot.startTime} - {slot.endTime}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1">
                                                    {slot.daysOfWeek.map(d => d.substring(0, 3)).join(", ")}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    Du {slot.startDate} au {slot.endDate}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteTimeSlot(slot.id)}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">
                            {/* Rooms Management */}
                            <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-lg border border-green-100 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <DoorOpen size={20} className="text-white" />
                                    </div>
                                    Gestion des salles
                                </h3>
                                <p className="text-sm text-slate-600 mb-5">
                                    Salles avec capacités et accommodements
                                </p>

                                {/* Filter available rooms by period */}
                                <div className="bg-white/80 backdrop-blur rounded-xl p-4 mb-5 shadow-sm border border-green-100">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                        <Calendar size={16} className="text-green-500" />
                                        Filtrer les salles disponibles par période
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Date de début
                                            </label>
                                            <input
                                                type="date"
                                                value={roomFilterStartDate}
                                                onChange={(e) => setRoomFilterStartDate(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Date de fin
                                            </label>
                                            <input
                                                type="date"
                                                value={roomFilterEndDate}
                                                onChange={(e) => setRoomFilterEndDate(e.target.value)}
                                                disabled={roomFilterNoEndDate}
                                                className={`w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${roomFilterNoEndDate ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={roomFilterNoEndDate}
                                                onChange={(e) => {
                                                    setRoomFilterNoEndDate(e.target.checked);
                                                    if (e.target.checked) {
                                                        setRoomFilterEndDate("");
                                                    }
                                                }}
                                                className="w-4 h-4 text-green-500 border-slate-300 rounded focus:ring-green-500"
                                            />
                                            Sans date de fin
                                        </label>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleFilterRooms}
                                            disabled={!roomFilterStartDate}
                                            className={`flex-1 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${!roomFilterStartDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Search size={18} />
                                            Filtrer
                                        </button>
                                        {showFilteredRooms && (
                                            <button
                                                onClick={() => {
                                                    setShowFilteredRooms(false);
                                                    setRoomFilterStartDate("");
                                                    setRoomFilterEndDate("");
                                                    setRoomFilterNoEndDate(false);
                                                }}
                                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                            >
                                                <X size={18} />
                                                Réinitialiser
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Add new room form */}
                                <div className="bg-white/80 backdrop-blur rounded-xl p-4 mb-5 shadow-sm border border-green-100">
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Nom de la salle
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="A-101"
                                                value={newRoomName}
                                                onChange={(e) => setNewRoomName(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Capacité max
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="15"
                                                value={newRoomCapacity}
                                                onChange={(e) => setNewRoomCapacity(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-slate-700 mb-2.5">
                                            Accommodements
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {accommodationOptions.map((option) => {
                                                const Icon = option.icon;
                                                const isSelected = newRoomAccommodations.includes(option.id);
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => toggleAccommodation(option.id)}
                                                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${isSelected
                                                            ? "bg-green-500 text-white shadow-md"
                                                            : "bg-white border-2 border-slate-200 text-slate-600 hover:border-green-300"
                                                            }`}
                                                    >
                                                        <Icon size={14} />
                                                        {option.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <button className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                        <Plus size={18} />
                                        Ajouter la salle
                                    </button>
                                </div>

                                {/* Rooms List */}
                                {showFilteredRooms && filteredRooms.length > 0 && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="text-sm font-semibold text-green-700 mb-1">
                                            Salles disponibles pour la période sélectionnée:
                                        </div>
                                        <div className="text-xs text-green-600">
                                            {roomFilterStartDate && (
                                                <>
                                                    Du {new Date(roomFilterStartDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    {roomFilterEndDate && !roomFilterNoEndDate && (
                                                        <> au {new Date(roomFilterEndDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</>
                                                    )}
                                                    {roomFilterNoEndDate && " (sans date de fin)"}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {(showFilteredRooms ? filteredRooms : [
                                        { name: "A-101", capacity: 15, accommodations: ["windows", "wifi", "projector"] },
                                        { name: "A-102", capacity: 12, accommodations: ["wifi", "whiteboard"] },
                                        { name: "B-201", capacity: 20, accommodations: ["windows", "wifi", "projector", "restroom"] },
                                        { name: "B-202", capacity: 18, accommodations: ["wifi", "projector", "whiteboard"] },
                                    ]).map((room, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 bg-white/80 backdrop-blur rounded-xl border border-green-100 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                                        {room.name.split("-")[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{room.name}</div>
                                                        <div className="text-xs text-slate-600 flex items-center gap-1">
                                                            <Users size={12} />
                                                            Max {room.capacity} pers.
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500 opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {room.accommodations.map((accId) => {
                                                    const acc = accommodationOptions.find((a) => a.id === accId);
                                                    if (!acc) return null;
                                                    const Icon = acc.icon;
                                                    return (
                                                        <span
                                                            key={accId}
                                                            className="px-2.5 py-1 bg-green-50 border border-green-200 rounded-md text-xs font-medium text-green-700 flex items-center gap-1"
                                                        >
                                                            <Icon size={12} />
                                                            {acc.label}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Blacklist */}
                            <div className="bg-gradient-to-br from-white to-red-50/30 rounded-2xl shadow-lg border border-red-100 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="p-2 bg-red-500 rounded-lg">
                                        <Ban size={20} className="text-white" />
                                    </div>
                                    Blacklist
                                </h3>
                                <p className="text-sm text-slate-600 mb-5">
                                    Bloquez des dates spécifiques pour des salles spécifiques
                                </p>

                                {/* Add new blacklist entry form */}
                                <div className="bg-white/80 backdrop-blur rounded-xl p-4 mb-5 shadow-sm border border-red-100">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                        <Ban size={16} className="text-red-500" />
                                        Options de blocage
                                    </h4>
                                    
                                    {/* Option to block all rooms (no room specified) */}
                                    <div className="mb-3">
                                        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newBlacklistNoRoom}
                                                onChange={(e) => {
                                                    setNewBlacklistNoRoom(e.target.checked);
                                                    if (e.target.checked) {
                                                        setNewBlacklistRoom("");
                                                    }
                                                }}
                                                className="w-4 h-4 text-red-500 border-slate-300 rounded focus:ring-red-500"
                                            />
                                            Bloquer toutes les salles (ne pas spécifier de salle)
                                        </label>
                                    </div>

                                    {/* Room selection (disabled if blocking all rooms) */}
                                    <div className="mb-3">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Salle {!newBlacklistNoRoom && <span className="text-red-500">*</span>}
                                        </label>
                                        <select
                                            value={newBlacklistRoom}
                                            onChange={(e) => setNewBlacklistRoom(e.target.value)}
                                            disabled={newBlacklistNoRoom}
                                            className={`w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white ${newBlacklistNoRoom ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="">Sélectionner une salle</option>
                                            {availableRooms.map((room) => (
                                                <option key={room} value={room}>
                                                    {room}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Option to block for all dates (no dates specified) */}
                                    <div className="mb-3">
                                        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newBlacklistNoDates}
                                                onChange={(e) => {
                                                    setNewBlacklistNoDates(e.target.checked);
                                                    if (e.target.checked) {
                                                        setNewBlacklistStartDate("");
                                                        setNewBlacklistEndDate("");
                                                        setNewBlacklistNoEndDate(false);
                                                    }
                                                }}
                                                className="w-4 h-4 text-red-500 border-slate-300 rounded focus:ring-red-500"
                                            />
                                            Bloquer pour toutes les dates (ne pas spécifier de dates)
                                        </label>
                                    </div>

                                    {/* Date range selection (disabled if blocking for all dates) */}
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Date de début {!newBlacklistNoDates && <span className="text-red-500">*</span>}
                                            </label>
                                            <input
                                                type="date"
                                                value={newBlacklistStartDate}
                                                onChange={(e) => setNewBlacklistStartDate(e.target.value)}
                                                disabled={newBlacklistNoDates}
                                                className={`w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${newBlacklistNoDates ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Date de fin
                                            </label>
                                            <input
                                                type="date"
                                                value={newBlacklistEndDate}
                                                onChange={(e) => setNewBlacklistEndDate(e.target.value)}
                                                disabled={newBlacklistNoDates || newBlacklistNoEndDate}
                                                className={`w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${(newBlacklistNoDates || newBlacklistNoEndDate) ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Option for no end date */}
                                    {!newBlacklistNoDates && (
                                        <div className="mb-3">
                                            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={newBlacklistNoEndDate}
                                                    onChange={(e) => {
                                                        setNewBlacklistNoEndDate(e.target.checked);
                                                        if (e.target.checked) {
                                                            setNewBlacklistEndDate("");
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-red-500 border-slate-300 rounded focus:ring-red-500"
                                                />
                                                Sans date de fin
                                            </label>
                                        </div>
                                    )}

                                    {/* Comment/Reason field */}
                                    <div className="mb-3">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Commentaire / Raison du blocage
                                        </label>
                                        <textarea
                                            value={newBlacklistComment}
                                            onChange={(e) => setNewBlacklistComment(e.target.value)}
                                            placeholder="Ex: Rénovation en cours, Réparation nécessaire, Événement privé..."
                                            rows={3}
                                            className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                        />
                                    </div>

                                    <button
                                        onClick={handleAddBlacklist}
                                        className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Ajouter à la blacklist
                                    </button>
                                </div>

                                {/* List of blacklist entries */}
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {blacklistEntries.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400 text-sm">
                                            Aucune entrée dans la blacklist
                                        </div>
                                    ) : (
                                        blacklistEntries.map((entry) => {
                                            // Determine blocking type
                                            const hasRoom = entry.roomName && entry.roomName.trim() !== "";
                                            const hasDates = entry.startDate;
                                            let blockingType = "";
                                            if (hasRoom && hasDates) {
                                                blockingType = "Salle et dates spécifiques";
                                            } else if (hasRoom && !hasDates) {
                                                blockingType = "Salle uniquement (toutes les dates)";
                                            } else if (!hasRoom && hasDates) {
                                                blockingType = "Dates uniquement (toutes les salles)";
                                            }

                                            // Format date range
                                            let dateRange = "";
                                            if (entry.startDate) {
                                                const startDate = new Date(entry.startDate + 'T00:00:00');
                                                const startFormatted = startDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                                
                                                if (entry.endDate) {
                                                    const endDate = new Date(entry.endDate + 'T00:00:00');
                                                    const endFormatted = endDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                                    dateRange = `Du ${startFormatted} au ${endFormatted}`;
                                                } else {
                                                    dateRange = `À partir du ${startFormatted}`;
                                                }
                                            } else {
                                                dateRange = "Toutes les dates";
                                            }

                                            return (
                                                <div
                                                    key={entry.id}
                                                    className="p-4 bg-white/80 backdrop-blur rounded-xl border border-red-100 hover:shadow-md transition-all group"
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Ban size={16} className="text-red-500" />
                                                                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                                                                    {blockingType}
                                                                </span>
                                                            </div>
                                                            
                                                            {hasRoom && (
                                                                <div className="mb-2">
                                                                    <span className="text-xs font-semibold text-slate-600">Salle:</span>
                                                                    <span className="ml-2 font-bold text-slate-900">{entry.roomName}</span>
                                                                </div>
                                                            )}
                                                            {!hasRoom && (
                                                                <div className="mb-2">
                                                                    <span className="text-xs font-semibold text-slate-600">Salle:</span>
                                                                    <span className="ml-2 font-bold text-red-600">Toutes les salles</span>
                                                                </div>
                                                            )}
                                                            
                                                            <div className="mb-2">
                                                                <span className="text-xs font-semibold text-slate-600">Période:</span>
                                                                <span className="ml-2 text-sm text-slate-700">{dateRange}</span>
                                                            </div>
                                                            
                                                            {entry.comment && (
                                                                <div className="mt-2 pt-2 border-t border-red-100">
                                                                    <span className="text-xs font-semibold text-slate-600">Raison:</span>
                                                                    <p className="text-sm text-slate-700 mt-1 italic">{entry.comment}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteBlacklist(entry.id)}
                                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500 opacity-0 group-hover:opacity-100 ml-2"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end gap-4">
                        <button className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all">
                            Réinitialiser
                        </button>
                        <button className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                            <CheckCircle size={20} />
                            Sauvegarder tous les changements
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Logs Page - Historique complet de toutes les actions
    const LogsPage = () => {
        const [searchQuery, setSearchQuery] = useState("");
        const [filterType, setFilterType] = useState<Log["type"] | "all">("all");
        const [filterStatus, setFilterStatus] = useState<Log["status"] | "all">("all");
        const [filterUser, setFilterUser] = useState<string>("all");
        const [currentPageNum, setCurrentPageNum] = useState(1);
        const logsPerPage = 20;

        const uniqueUsers = Array.from(new Set(logs.map(log => log.user)));

        const filteredLogs = logs.filter(log => {
            const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               log.user.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === "all" || log.type === filterType;
            const matchesStatus = filterStatus === "all" || log.status === filterStatus;
            const matchesUser = filterUser === "all" || log.user === filterUser;
            return matchesSearch && matchesType && matchesStatus && matchesUser;
        });

        const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
        const paginatedLogs = filteredLogs.slice(
            (currentPageNum - 1) * logsPerPage,
            currentPageNum * logsPerPage
        );

        const getTypeColor = (type: Log["type"]) => {
            switch (type) {
                case "connexion":
                    return "bg-green-500/20 text-green-600 border-green-500/30";
                case "deconnexion":
                    return "bg-slate-500/20 text-slate-600 border-slate-500/30";
                case "creation":
                    return "bg-blue-500/20 text-blue-600 border-blue-500/30";
                case "modification":
                    return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
                case "suppression":
                    return "bg-red-500/20 text-red-600 border-red-500/30";
                case "erreur":
                    return "bg-red-600/20 text-red-700 border-red-600/30";
                case "admin":
                    return "bg-purple-500/20 text-purple-600 border-purple-500/30";
                default:
                    return "bg-slate-500/20 text-slate-600 border-slate-500/30";
            }
        };

        const getStatusIcon = (status: Log["status"]) => {
            switch (status) {
                case "success":
                    return <CheckCircle size={16} className="text-green-500" />;
                case "error":
                    return <AlertCircle size={16} className="text-red-500" />;
                case "warning":
                    return <AlertCircle size={16} className="text-yellow-500" />;
            }
        };

        const exportLogs = () => {
            const csvContent = [
                ["Date", "Heure", "Type", "Utilisateur", "Description", "Statut"].join(","),
                ...filteredLogs.map(log => [
                    log.timestamp.toLocaleDateString("fr-FR"),
                    log.timestamp.toLocaleTimeString("fr-FR"),
                    log.type,
                    log.user,
                    `"${log.description}"`,
                    log.status
                ].join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `logs-${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        };

        return (
            <div className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">Journal des activités</h1>
                            <p className="text-slate-600">Historique complet de toutes les actions du système</p>
                        </div>
                        <button
                            onClick={exportLogs}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <Download size={20} />
                            Exporter les logs
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Type Filter */}
                            <select
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value as Log["type"] | "all");
                                    setCurrentPageNum(1);
                                }}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">Tous les types</option>
                                <option value="connexion">Connexion</option>
                                <option value="deconnexion">Déconnexion</option>
                                <option value="creation">Création</option>
                                <option value="modification">Modification</option>
                                <option value="suppression">Suppression</option>
                                <option value="erreur">Erreur</option>
                                <option value="admin">Admin</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value as Log["status"] | "all");
                                    setCurrentPageNum(1);
                                }}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="success">Succès</option>
                                <option value="error">Erreur</option>
                                <option value="warning">Avertissement</option>
                            </select>

                            {/* User Filter */}
                            <select
                                value={filterUser}
                                onChange={(e) => {
                                    setFilterUser(e.target.value);
                                    setCurrentPageNum(1);
                                }}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">Tous les utilisateurs</option>
                                {uniqueUsers.map(user => (
                                    <option key={user} value={user}>{user}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 text-sm text-slate-600">
                            {filteredLogs.length} log{filteredLogs.length !== 1 ? "s" : ""} trouvé{filteredLogs.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </div>

                {/* Logs List */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date/Heure</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Utilisateur</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {paginatedLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            Aucun log trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {log.timestamp.toLocaleDateString("fr-FR", { 
                                                        day: "2-digit", 
                                                        month: "short", 
                                                        year: "numeric" 
                                                    })}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {log.timestamp.toLocaleTimeString("fr-FR", { 
                                                        hour: "2-digit", 
                                                        minute: "2-digit" 
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(log.type)}`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900">{log.user}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-900">{log.description}</div>
                                                {log.details && (
                                                    <div className="text-xs text-slate-500 mt-1">{log.details}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(log.status)}
                                                    <span className="text-sm text-slate-900 capitalize">{log.status}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Page {currentPageNum} sur {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPageNum(prev => Math.max(1, prev - 1))}
                                    disabled={currentPageNum === 1}
                                    className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                                >
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setCurrentPageNum(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPageNum === totalPages}
                                    className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Main render
    if (currentPage === "login") {
        return <LoginPage />;
    }

    if (currentPage === "invitation-check") {
        return <InvitationCheckPage />;
    }

    if (currentPage === "signup") {
        return <SignupPage />;
    }

    if (currentPage === "reset-password") {
        return <ResetPasswordPage />;
    }

    if (currentPage === "landing") {
        return <LandingPage />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Sidebar />
            <div className="ml-64">
                {currentPage === "dashboard" && <DashboardPage />}
                {currentPage === "personnel" && <PersonnelPage />}
                {currentPage === "placement" && <PlacementPage />}
                {currentPage === "stats" && <StatsPage />}
                {currentPage === "logs" && <LogsPage />}
                {currentPage === "settings" && <SettingsPage />}
                {currentPage === "companySettings" && <CompanySettingsPage />}
            </div>
        </div>
    );
};

export default LBNApp;
