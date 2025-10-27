import React, { useState } from "react";
import {
    Calendar,
    Users,
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
} from "lucide-react";

const LBNApp = () => {
    type Day = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";
    type RoomFilter = "all" | "occupied" | "free";

    interface Course {
        time: string;
        room: string;
        tutor: string;
        students: number;
        subject: string;
        color: string;
    }

    interface TimeSlot {
        id: string;
        startTime: string;
        endTime: string;
        label: string;
    }

    interface StatisticConfig {
        id: string;
        name: string;
        visible: boolean;
    }

    interface Tuteur {
        id: number;
        name: string;
        type: "tuteur";
        courses: number;
        capacity: string;
        status: string;
        avatar: string;
        email: string;
        phone: string;
        niveau: string;
        specialites: string[];
        prochainsCours: Array<{
            day: string;
            time: string;
            room: string;
            students: number;
        }>;
    }

    interface Eleve {
        id: number;
        name: string;
        type: "eleve";
        grade: string;
        pg: number;
        status: string;
        avatar: string;
        email: string;
        phone: string;
        tuteur: string;
        prochainsCours: Array<{
            day: string;
            time: string;
            subject: string;
            tuteur: string;
        }>;
    }

    type Personnel = Tuteur | Eleve;

    const [currentPage, setCurrentPage] = useState("dashboard");
    const [selectedDay, setSelectedDay] = useState<Day>("Lundi");
    const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");
    const [visibleStats, setVisibleStats] = useState<Record<string, boolean>>({
        activeStudents: true,
        plannedCourses: true,
        occupancyRate: true,
        overages: true,
        tutorCapacity: true,
        roomUsage: true,
    });

    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
        { id: "1", startTime: "08:00", endTime: "10:15", label: "8h-10h15" },
        { id: "2", startTime: "10:30", endTime: "12:30", label: "10h30-12h30" },
        { id: "3", startTime: "13:00", endTime: "15:15", label: "13h-15h15" },
        { id: "4", startTime: "15:30", endTime: "17:30", label: "15h30-17h30" },
    ]);

    const days: Day[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

    // All rooms available for the dashboard
    const allRooms = ["Salle A", "Salle B", "Salle C", "Salle D", "Salle E"];

    const courses: Partial<Record<Day, Course[]>> = {
        Lundi: [
            {
                time: "8h00",
                room: "Salle A",
                tutor: "Marie Dupont",
                students: 3,
                subject: "Math",
                color: "bg-blue-500",
            },
            {
                time: "8h00",
                room: "Salle B",
                tutor: "Jean Martin",
                students: 4,
                subject: "Français",
                color: "bg-purple-500",
            },
            {
                time: "10h30",
                room: "Salle A",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
            },
            {
                time: "13h00",
                room: "Salle B",
                tutor: "Jean Martin",
                students: 4,
                subject: "Français",
                color: "bg-purple-500",
            },
            {
                time: "13h00",
                room: "Salle C",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
            {
                time: "15h30",
                room: "Salle A",
                tutor: "Marie Dupont",
                students: 5,
                subject: "Math",
                color: "bg-blue-500",
            },
        ],
        Mardi: [
            {
                time: "8h00",
                room: "Salle C",
                tutor: "Marie Dupont",
                students: 3,
                subject: "Math",
                color: "bg-blue-500",
            },
            {
                time: "8h00",
                room: "Salle D",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
            },
            {
                time: "10h30",
                room: "Salle B",
                tutor: "Jean Martin",
                students: 4,
                subject: "Français",
                color: "bg-purple-500",
            },
            {
                time: "13h00",
                room: "Salle A",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
            {
                time: "15h30",
                room: "Salle C",
                tutor: "Marie Dupont",
                students: 5,
                subject: "Math",
                color: "bg-blue-500",
            },
        ],
        Mercredi: [
            {
                time: "8h00",
                room: "Salle A",
                tutor: "Jean Martin",
                students: 4,
                subject: "Français",
                color: "bg-purple-500",
            },
            {
                time: "10h30",
                room: "Salle B",
                tutor: "Marie Dupont",
                students: 3,
                subject: "Math",
                color: "bg-blue-500",
            },
            {
                time: "10h30",
                room: "Salle D",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
            },
            {
                time: "13h00",
                room: "Salle C",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
            {
                time: "15h30",
                room: "Salle E",
                tutor: "Jean Martin",
                students: 5,
                subject: "Français",
                color: "bg-purple-500",
            },
        ],
        Jeudi: [
            {
                time: "8h00",
                room: "Salle B",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
            },
            {
                time: "10h30",
                room: "Salle A",
                tutor: "Jean Martin",
                students: 4,
                subject: "Français",
                color: "bg-purple-500",
            },
            {
                time: "10h30",
                room: "Salle C",
                tutor: "Marie Dupont",
                students: 3,
                subject: "Math",
                color: "bg-blue-500",
            },
            {
                time: "13h00",
                room: "Salle D",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
            {
                time: "15h30",
                room: "Salle B",
                tutor: "Marie Dupont",
                students: 5,
                subject: "Math",
                color: "bg-blue-500",
            },
        ],
        Vendredi: [
            {
                time: "8h00",
                room: "Salle A",
                tutor: "Thomas Roy",
                students: 3,
                subject: "Anglais",
                color: "bg-orange-500",
            },
            {
                time: "8h00",
                room: "Salle D",
                tutor: "Jean Martin",
                students: 4,
                subject: "Français",
                color: "bg-purple-500",
            },
            {
                time: "10h30",
                room: "Salle B",
                tutor: "Marie Dupont",
                students: 3,
                subject: "Math",
                color: "bg-blue-500",
            },
            {
                time: "13h00",
                room: "Salle C",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
            },
            {
                time: "15h30",
                room: "Salle E",
                tutor: "Jean Martin",
                students: 5,
                subject: "Français",
                color: "bg-purple-500",
            },
        ],
    };

    // Navigation
    const NavBar = () => null;

    const Sidebar = () => (
        <div className="fixed left-0 top-0 w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white h-screen overflow-y-auto shadow-2xl border-r border-slate-700/50 z-40">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg ring-2 ring-orange-400/20">
                        LBN
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">La Bonne Note</span>
                        <span className="text-xs text-slate-400">Gestion de cours</span>
                    </div>
                </div>
            </div>

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
                        <Settings size={20} className="group-hover:scale-110 transition-transform" />
                        <span>Réglages</span>
                    </button>
                </div>
            </nav>

            {/* Footer/User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-md flex items-center justify-center text-sm font-bold">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">Admin</div>
                        <div className="text-xs text-slate-400 truncate">admin@labonnenote.com</div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Page Login
    const LoginPage = () => (
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
                            Identifiant
                        </label>
                        <input
                            type="email"
                            placeholder="email@exemple.com"
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
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                        Se connecter
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-900 text-slate-400">
                                ou
                            </span>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all">
                        Connexion avec Google
                    </button>
                </div>
            </div>
        </div>
    );

    // Helper function to get filtered rooms
    const getFilteredRooms = () => {
        if (roomFilter === "all") return allRooms;

        const occupiedRooms = new Set(
            courses[selectedDay]?.map((c) => c.room) || []
        );

        if (roomFilter === "occupied") {
            return allRooms.filter((room) => occupiedRooms.has(room));
        } else {
            return allRooms.filter((room) => !occupiedRooms.has(room));
        }
    };

    // Helper to get courses for a room in a time slot
    const getCoursesForRoomAndSlot = (room: string, slotStart: string) => {
        return (
            courses[selectedDay]?.filter(
                (c) => c.room === room && c.time.startsWith(slotStart.split(":")[0])
            ) || []
        );
    };

    // Statistics configuration
    const statsConfig: StatisticConfig[] = [
        { id: "activeStudents", name: "Élèves actifs", visible: true },
        { id: "plannedCourses", name: "Cours planifiés", visible: true },
        { id: "occupancyRate", name: "Taux occupation", visible: true },
        { id: "overages", name: "Dépassements", visible: true },
        { id: "tutorCapacity", name: "Capacité tuteurs", visible: false },
        { id: "roomUsage", name: "Utilisation salles", visible: false },
    ];

    // Dashboard Page
    const DashboardPage = () => {
        const [showStatsPicker, setShowStatsPicker] = useState(false);
        const [printRange, setPrintRange] = useState("week");

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
                                    Semaine du 17 octobre 2025
                                </p>
                            </div>
                            <button
                                onClick={() => setShowStatsPicker(!showStatsPicker)}
                                className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                            >
                                <Eye size={16} />
                                Personnaliser
                            </button>
                        </div>

                        {/* Statistics Picker */}
                        {showStatsPicker && (
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
                                <p className="text-sm font-medium text-slate-700 mb-3">
                                    Choisir les statistiques à afficher:
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {statsConfig.map((stat) => (
                                        <label
                                            key={stat.id}
                                            className="flex items-center gap-2 p-2 hover:bg-white rounded transition-colors cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    visibleStats[stat.id] ?? stat.visible
                                                }
                                                onChange={(e) =>
                                                    setVisibleStats({
                                                        ...visibleStats,
                                                        [stat.id]: e.target.checked,
                                                    })
                                                }
                                                className="rounded"
                                            />
                                            <span className="text-sm text-slate-700">
                                                {stat.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {visibleStats.activeStudents && (
                                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-5 shadow-md border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
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
                                <div className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200">
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
                                    <div className="text-slate-500 text-sm mt-2">
                                        Cette semaine
                                    </div>
                                </div>
                            )}

                            {visibleStats.occupancyRate && (
                                <div className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200">
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
                                </div>
                            )}

                            {visibleStats.overages && (
                                <div className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200">
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
                                    <div className="text-orange-600 text-sm mt-2">
                                        À résoudre
                                    </div>
                                </div>
                            )}

                            {visibleStats.tutorCapacity && (
                                <div className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200">
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
                                    <div className="text-slate-500 text-sm mt-2">
                                        Moyenne utilisation
                                    </div>
                                </div>
                            )}

                            {visibleStats.roomUsage && (
                                <div className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-200">
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
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Schedule with New Layout - SECOND */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Vue hebdomadaire
                                </h2>
                                <p className="text-slate-600 text-sm">
                                    Salles et créneaux horaires
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={roomFilter}
                                    onChange={(e) =>
                                        setRoomFilter(e.target.value as RoomFilter)
                                    }
                                    className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <option value="all">Toutes les salles</option>
                                    <option value="occupied">Salles occupées</option>
                                    <option value="free">Salles libres</option>
                                </select>
                                <button
                                    onClick={() => window.print()}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    <Printer size={16} />
                                    Imprimer
                                </button>
                                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                                    <Plus size={16} />
                                    Nouveau cours
                                </button>
                            </div>
                        </div>

                        {/* Day tabs */}
                        <div className="flex gap-3 mb-6 flex-wrap">
                            {days.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${selectedDay === day
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md"
                                        }`}
                                >
                                    {day}
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
                                        {timeSlots.map((slot) => (
                                            <th
                                                key={slot.id}
                                                className="p-3 text-center bg-slate-50 border border-slate-200 min-w-[150px]"
                                            >
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {slot.label}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilteredRooms().map((room, roomIdx) => (
                                        <tr key={room} className={`transition-colors duration-200 hover:bg-orange-50 ${roomIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                            <td className="p-3 bg-inherit border border-slate-200 font-semibold text-slate-900 whitespace-nowrap hover:bg-orange-100 transition-colors">
                                                {room}
                                            </td>
                                            {timeSlots.map((slot) => {
                                                const roomCourses =
                                                    getCoursesForRoomAndSlot(
                                                        room,
                                                        slot.startTime
                                                    );
                                                return (
                                                    <td
                                                        key={`${room}-${slot.id}`}
                                                        className="p-2 border border-slate-200 min-w-[150px] align-top"
                                                    >
                                                        {roomCourses.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {roomCourses.map(
                                                                    (course, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className={`${course.color} text-white rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer text-xs font-medium group hover:scale-105 border border-opacity-20 border-white`}
                                                                        >
                                                                            <div className="font-bold mb-1 group-hover:text-yellow-50">
                                                                                {
                                                                                    course.tutor
                                                                                }
                                                                            </div>
                                                                            <div className="opacity-90 flex items-center gap-1 group-hover:opacity-100">
                                                                                <Users
                                                                                    size={
                                                                                        12
                                                                                    }
                                                                                />
                                                                                <span>{course.students} élèves</span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-300 hover:border-slate-300 transition-colors cursor-pointer h-20 flex items-center justify-center">
                                                                <span className="text-xs">
                                                                    Libre
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Personnel Page
    const PersonnelPage = () => {
        const [searchQuery, setSearchQuery] = useState("");
        const [personnelFilter, setPersonnelFilter] = useState<"tuteur" | "eleve">("tuteur");
        const [selectedPerson, setSelectedPerson] = useState<any>(null);
        const [showFilters, setShowFilters] = useState(false);

        // Filter states for tuteurs
        const [niveauFilter, setNiveauFilter] = useState<string[]>([]);
        const [specialiteFilter, setSpecialiteFilter] = useState<string[]>([]);
        const [statusFilter, setStatusFilter] = useState<string[]>([]);

        // Filter states for élèves
        const [gradeFilter, setGradeFilter] = useState<string[]>([]);
        const [pgFilter, setPgFilter] = useState<string>("");

        // Mock data for tuteurs
        const tuteurs = [
            {
                id: 1,
                name: "Marie Dupont",
                type: "tuteur",
                courses: 8,
                capacity: "12/15 PG",
                status: "active",
                avatar: "from-blue-500 to-blue-600",
                email: "marie.dupont@lbn.com",
                phone: "514-555-0001",
                niveau: "Sénior",
                specialites: ["Mathématiques", "Sciences"],
                prochainsCours: [
                    { day: "Lundi", time: "8h00", room: "Salle A", students: 3 },
                    { day: "Lundi", time: "15h30", room: "Salle A", students: 5 },
                    { day: "Mardi", time: "15h30", room: "Salle C", students: 5 },
                ],
            },
            {
                id: 2,
                name: "Jean Martin",
                type: "tuteur",
                courses: 6,
                capacity: "10/12 PG",
                status: "active",
                avatar: "from-purple-500 to-purple-600",
                email: "jean.martin@lbn.com",
                phone: "514-555-0002",
                niveau: "Intermédiaire",
                specialites: ["Français", "Histoire"],
                prochainsCours: [
                    { day: "Lundi", time: "8h00", room: "Salle B", students: 4 },
                    { day: "Lundi", time: "13h00", room: "Salle B", students: 4 },
                ],
            },
            {
                id: 3,
                name: "Sophie Chen",
                type: "tuteur",
                courses: 10,
                capacity: "15/15 PG",
                status: "full",
                avatar: "from-green-500 to-green-600",
                email: "sophie.chen@lbn.com",
                phone: "514-555-0003",
                niveau: "Sénior",
                specialites: ["Sciences", "Chimie"],
                prochainsCours: [
                    { day: "Lundi", time: "10h30", room: "Salle A", students: 2 },
                    { day: "Mardi", time: "8h00", room: "Salle D", students: 2 },
                ],
            },
            {
                id: 4,
                name: "Thomas Roy",
                type: "tuteur",
                courses: 4,
                capacity: "6/10 PG",
                status: "active",
                avatar: "from-orange-500 to-orange-600",
                email: "thomas.roy@lbn.com",
                phone: "514-555-0004",
                niveau: "Junior",
                specialites: ["Anglais"],
                prochainsCours: [
                    { day: "Lundi", time: "13h00", room: "Salle C", students: 3 },
                    { day: "Mardi", time: "13h00", room: "Salle A", students: 3 },
                ],
            },
        ];

        // Mock data for élèves
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
                prochainsCours: [
                    { day: "Lundi", time: "15h30", subject: "Math", tuteur: "Marie Dupont" },
                ],
            },
        ];

        // Filter personnel based on type, search query, and advanced filters
        const filteredPersonnel = (personnelFilter === "tuteur" ? tuteurs : eleves).filter((person) => {
            // Search filter
            const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());

            if (personnelFilter === "tuteur") {
                const tuteur = person as Tuteur;
                const matchesNiveau = niveauFilter.length === 0 || niveauFilter.includes(tuteur.niveau);
                const matchesSpecialite = specialiteFilter.length === 0 ||
                    specialiteFilter.some(spec => tuteur.specialites.includes(spec));
                const matchesStatus = statusFilter.length === 0 || statusFilter.includes(tuteur.status);

                return matchesSearch && matchesNiveau && matchesSpecialite && matchesStatus;
            } else {
                const eleve = person as Eleve;
                const matchesGrade = gradeFilter.length === 0 || gradeFilter.includes(eleve.grade);
                const matchesPg = pgFilter === "" || eleve.pg.toString() === pgFilter;

                return matchesSearch && matchesGrade && matchesPg;
            }
        });

        // Count active filters
        const activeFiltersCount = personnelFilter === "tuteur"
            ? niveauFilter.length + specialiteFilter.length + statusFilter.length
            : gradeFilter.length + (pgFilter ? 1 : 0);

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
                            <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2">
                                <Download size={16} />
                                Import CSV
                            </button>
                            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
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
                                    {personnelFilter === "tuteur" ? `${tuteurs.length} tuteurs` : `${eleves.length} élèves`}
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
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Niveau</label>
                                                    <div className="space-y-2">
                                                        {["Sénior", "Intermédiaire", "Junior"].map((niveau) => (
                                                            <label key={niveau} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={niveauFilter.includes(niveau)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setNiveauFilter([...niveauFilter, niveau]);
                                                                        } else {
                                                                            setNiveauFilter(niveauFilter.filter(n => n !== niveau));
                                                                        }
                                                                    }}
                                                                    className="rounded text-orange-500 focus:ring-orange-500"
                                                                />
                                                                <span className="text-sm text-slate-700">{niveau}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="border-t border-slate-200 pt-3">
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
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Disponibilité</label>
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
                                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Périodes-Groupes (PG)</label>
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
                                            </div>
                                        )}

                                        {/* Filter Actions */}
                                        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200">
                                            <button
                                                onClick={() => {
                                                    setNiveauFilter([]);
                                                    setSpecialiteFilter([]);
                                                    setStatusFilter([]);
                                                    setGradeFilter([]);
                                                    setPgFilter("");
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
                                            onClick={() => setSelectedPerson(person)}
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
                                                        ? `${(person as Tuteur).courses} cours • ${(person as Tuteur).capacity}`
                                                        : `${(person as Eleve).grade} • ${(person as Eleve).pg} PG`
                                                    }
                                                </div>
                                            </div>
                                            {selectedPerson?.id === person.id && (
                                                <div className="text-orange-500">
                                                    <ChevronDown size={18} className="transform -rotate-90" />
                                                </div>
                                            )}
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
                            {selectedPerson ? (
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
                                                    {selectedPerson.niveau && ` • Niveau ${selectedPerson.niveau}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                <Mail size={18} />
                                            </button>
                                            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                                Modifier
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                                        <h4 className="font-semibold text-slate-900 mb-3">Informations de contact</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-slate-600 mb-1">Email</div>
                                                <div className="text-slate-900">{selectedPerson.email}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-600 mb-1">Téléphone</div>
                                                <div className="text-slate-900">{selectedPerson.phone}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tutor-specific information */}
                                    {selectedPerson.type === "tuteur" && (
                                        <>
                                            {/* Specialties */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold text-slate-900 mb-3">Spécialités</h4>
                                                <div className="flex gap-2 flex-wrap">
                                                    {selectedPerson.specialites.map((spec: string, idx: number) => (
                                                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                            {spec}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Capacity */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold text-slate-900 mb-3">Capacité</h4>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl font-bold text-slate-900">
                                                        {selectedPerson.capacity}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-3 rounded-full ${selectedPerson.status === "full"
                                                                    ? "bg-orange-500"
                                                                    : "bg-green-500"
                                                                    }`}
                                                                style={{
                                                                    width: `${(parseInt(selectedPerson.capacity.split('/')[0]) / parseInt(selectedPerson.capacity.split('/')[1])) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${selectedPerson.status === "full"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-green-100 text-green-700"
                                                        }`}>
                                                        {selectedPerson.status === "full" ? "Complet" : "Disponible"}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Student-specific information */}
                                    {selectedPerson.type === "eleve" && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <div className="text-sm text-slate-600 mb-1">Niveau</div>
                                                    <div className="text-xl font-bold text-slate-900">{selectedPerson.grade}</div>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <div className="text-sm text-slate-600 mb-1">Périodes-Groupes</div>
                                                    <div className="text-xl font-bold text-slate-900">{selectedPerson.pg} PG</div>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="font-semibold text-slate-900 mb-3">Tuteur assigné</h4>
                                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                                                    <div className="font-medium text-blue-900">{selectedPerson.tuteur}</div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Upcoming Courses */}
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
                                                                {selectedPerson.type === "tuteur"
                                                                    ? `${course.room} • ${course.students} élèves`
                                                                    : `${course.subject} • ${course.tuteur}`
                                                                }
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
                                    </div>                                {/* Action Buttons */}
                                    <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
                                        <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                                            Modifier une date unique
                                        </button>
                                        <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                            Modification long terme
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">
                                    <div className="text-center">
                                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium">Sélectionnez une personne</p>
                                        <p className="text-sm">pour voir les détails</p>
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
                            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                                <Plus size={16} />
                                Créer un groupe
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Example groups */}
                            <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-orange-300 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="font-semibold text-slate-900">Groupe Math Avancé</div>
                                    <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Avec tuteur</div>
                                </div>
                                <div className="text-sm text-slate-600 mb-2">
                                    Tuteur: Marie Dupont
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-slate-400" />
                                    <span className="text-sm text-slate-600">4 élèves</span>
                                </div>
                            </div>

                            <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-orange-300 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="font-semibold text-slate-900">Groupe Sec. 3</div>
                                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Sans tuteur</div>
                                </div>
                                <div className="text-sm text-slate-600 mb-2">
                                    Niveau secondaire 3
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-slate-400" />
                                    <span className="text-sm text-slate-600">6 élèves</span>
                                </div>
                            </div>

                            <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-orange-300 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="font-semibold text-slate-900">Groupe Sciences</div>
                                    <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Avec tuteur</div>
                                </div>
                                <div className="text-sm text-slate-600 mb-2">
                                    Tuteur: Sophie Chen
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-slate-400" />
                                    <span className="text-sm text-slate-600">3 élèves</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            { id: 5, name: "William Roy", pg: 3, grade: "Sec. 4" }
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

        return (
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex flex-col">
                {/* Top Action Bar */}
                <div className="bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <BookOpen className="text-orange-500" size={28} />
                                Gestion des placements
                            </h2>
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
                            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                                <Download size={16} />
                                Exporter
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
                                        <div className="px-4 pb-4 space-y-2 max-h-96 overflow-y-auto">
                                            {groups.map((group) => (
                                                <div
                                                    key={group.id}
                                                    draggable
                                                    onDragStart={() => setDraggedItem({ type: 'group', data: group })}
                                                    onDragEnd={() => setDraggedItem(null)}
                                                    className={`p-3 border-2 rounded-lg cursor-move hover:shadow-lg transition-all ${group.color === 'blue' ? 'bg-blue-50 border-blue-200 hover:border-blue-400' :
                                                        group.color === 'purple' ? 'bg-purple-50 border-purple-200 hover:border-purple-400' :
                                                            'bg-green-50 border-green-200 hover:border-green-400'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="font-semibold text-slate-900 text-sm">{group.name}</div>
                                                        <div className="text-xs bg-white px-2 py-0.5 rounded-full font-medium">
                                                            {group.totalPG} PG
                                                        </div>
                                                    </div>
                                                    {group.tutor && (
                                                        <div className="text-xs text-slate-600 mb-1">
                                                            👨‍🏫 {group.tutor}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-slate-600">
                                                        👥 {group.students.length} élèves
                                                    </div>
                                                </div>
                                            ))}
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
                                                {filteredTutors.map((tutor) => (
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
                                                        <div className="text-xs text-slate-600 mb-1">{tutor.capacity} PG</div>
                                                        <div className="flex gap-1 flex-wrap">
                                                            {tutor.specialties.map((spec, idx) => (
                                                                <span key={idx} className="text-xs bg-white px-2 py-0.5 rounded-full">
                                                                    {spec}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
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
                                                                <label className="text-xs font-semibold text-slate-700 mb-2 block">Périodes-Groupes (PG)</label>
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
                                                {filteredStudents.map((student) => (
                                                    <div
                                                        key={student.id}
                                                        draggable
                                                        onDragStart={() => setDraggedItem({ type: 'student', data: student })}
                                                        onDragEnd={() => setDraggedItem(null)}
                                                        className="p-3 bg-purple-50 border-2 border-purple-200 rounded-lg cursor-move hover:border-purple-400 hover:shadow-lg transition-all"
                                                    >
                                                        <div className="font-medium text-slate-900 text-sm mb-1">{student.name}</div>
                                                        <div className="text-xs text-slate-600">
                                                            {student.grade} • {student.pg} PG
                                                        </div>
                                                    </div>
                                                ))}
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

                            {/* Day Selector */}
                            <div className="flex gap-2">
                                {days.map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => setPlacementDay(day)}
                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${placementDay === day
                                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid Layout - All Rooms */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                                            <th className="p-4 text-left font-semibold text-slate-700 border-b-2 border-slate-200 sticky left-0 bg-slate-100 z-10">
                                                Salles
                                            </th>
                                            {timeSlots.map((slot) => (
                                                <th
                                                    key={slot.id}
                                                    className="p-4 text-center font-semibold text-slate-700 border-b-2 border-slate-200 min-w-[250px]"
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
                                                {timeSlots.map((slot) => {
                                                    const roomCourses = getCoursesForRoomAndSlot(room, slot.startTime);
                                                    return (
                                                        <td
                                                            key={`${room}-${slot.id}`}
                                                            className="p-3 border border-slate-200 align-top"
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onDrop={(e) => {
                                                                e.preventDefault();
                                                                if (draggedItem) {
                                                                    setHasUnsavedChanges(true);
                                                                    // Handle drop logic here
                                                                    console.log(`Dropped ${draggedItem.type}:`, draggedItem.data, 'in', room, slot.label);
                                                                }
                                                            }}
                                                        >
                                                            {roomCourses.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {roomCourses.map((course, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className={`${course.color} text-white rounded-lg p-3 shadow-md hover:shadow-xl transition-all cursor-pointer group relative`}
                                                                        >
                                                                            <div className="font-bold mb-1 text-sm">
                                                                                {course.tutor}
                                                                            </div>
                                                                            <div className="text-xs opacity-90 flex items-center gap-1">
                                                                                <Users size={12} />
                                                                                <span>{course.students} élèves • {course.subject}</span>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedSlot(slot.id);
                                                                                    setSelectedRoom(room);
                                                                                }}
                                                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white text-slate-700 rounded p-1 transition-opacity"
                                                                            >
                                                                                <Settings size={12} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
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
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-semibold text-slate-700">Légende:</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                    <span className="text-xs text-slate-600">Mathématiques</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                    <span className="text-xs text-slate-600">Français</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-xs text-slate-600">Sciences</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                    <span className="text-xs text-slate-600">Anglais</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-dashed border-slate-300 rounded"></div>
                                    <span className="text-xs text-slate-600">Salle libre</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Stats Page
    const StatsPage = () => (
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

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
                    <div className="grid grid-cols-5 gap-4">
                        {[
                            { subject: "Mathématiques", count: 45, percentage: 35, color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" },
                            { subject: "Français", count: 32, percentage: 25, color: "bg-purple-500", textColor: "text-purple-700", bgColor: "bg-purple-50" },
                            { subject: "Sciences", count: 28, percentage: 22, color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
                            { subject: "Anglais", count: 18, percentage: 14, color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" },
                            { subject: "Autres", count: 5, percentage: 4, color: "bg-slate-500", textColor: "text-slate-700", bgColor: "bg-slate-50" },
                        ].map((subject, idx) => (
                            <div key={idx} className={`${subject.bgColor} rounded-lg p-4 border border-slate-200`}>
                                <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-3`}>
                                    {subject.count}
                                </div>
                                <div className="font-medium text-slate-900 text-sm mb-1">{subject.subject}</div>
                                <div className={`text-xs ${subject.textColor} font-semibold`}>{subject.percentage}% du total</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Settings Page
    const SettingsPage = () => {
        const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
        const [newSlotStart, setNewSlotStart] = useState("");
        const [newSlotEnd, setNewSlotEnd] = useState("");
        const [newSlotLabel, setNewSlotLabel] = useState("");

        const handleAddTimeSlot = () => {
            if (newSlotStart && newSlotEnd && newSlotLabel) {
                const newSlot: TimeSlot = {
                    id: Date.now().toString(),
                    startTime: newSlotStart,
                    endTime: newSlotEnd,
                    label: newSlotLabel,
                };
                setTimeSlots([...timeSlots, newSlot]);
                setNewSlotStart("");
                setNewSlotEnd("");
                setNewSlotLabel("");
            }
        };

        const handleDeleteTimeSlot = (id: string) => {
            setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
        };

        return (
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
                {/* Page Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Settings className="text-orange-500" size={28} />
                        Réglages
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Configurez votre système et préférences
                    </p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Paramètres généraux
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nom de l'organisation
                                    </label>
                                    <input
                                        type="text"
                                        value="La Bonne Note"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Capacité max par défaut (PG)
                                    </label>
                                    <input
                                        type="number"
                                        value="15"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Durée des cours (min)
                                    </label>
                                    <input
                                        type="number"
                                        value="90"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Notifications
                            </h3>
                            <div className="space-y-3">
                                {[
                                    {
                                        label: "Envoi automatique des horaires",
                                        checked: true,
                                    },
                                    { label: "Alertes de dépassement", checked: true },
                                    { label: "Rappels avant cours", checked: false },
                                    {
                                        label: "Confirmations par e-mail",
                                        checked: true,
                                    },
                                ].map((setting, idx) => (
                                    <label
                                        key={idx}
                                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <span className="text-sm font-medium text-slate-700">
                                            {setting.label}
                                        </span>
                                        <div
                                            className={`w-12 h-6 rounded-full transition-colors ${setting.checked
                                                ? "bg-orange-500"
                                                : "bg-slate-300"
                                                }`}
                                        >
                                            <div
                                                className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${setting.checked ? "ml-6" : "ml-0.5"
                                                    }`}
                                            ></div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Thème et affichage
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Couleur principale
                                    </label>
                                    <div className="flex gap-2">
                                        {[
                                            "bg-orange-500",
                                            "bg-blue-500",
                                            "bg-purple-500",
                                            "bg-green-500",
                                        ].map((color, idx) => (
                                            <button
                                                key={idx}
                                                className={`w-10 h-10 ${color} rounded-lg ${idx === 0
                                                    ? "ring-2 ring-slate-900 ring-offset-2"
                                                    : ""
                                                    }`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Sécurité
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 rounded-lg text-left text-sm font-medium text-slate-700 transition-colors">
                                    Changer le mot de passe
                                </button>
                                <button className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 rounded-lg text-left text-sm font-medium text-slate-700 transition-colors">
                                    Activer 2FA
                                </button>
                                <button className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 rounded-lg text-left text-sm font-medium text-slate-700 transition-colors">
                                    Gérer les sessions
                                </button>
                            </div>
                        </div>

                        {/* Time Slots Configuration */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Créneaux horaires fixes
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Définissez les créneaux fixes de votre organisation
                            </p>

                            {/* Add new time slot form */}
                            <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Heure début
                                        </label>
                                        <input
                                            type="time"
                                            value={newSlotStart}
                                            onChange={(e) =>
                                                setNewSlotStart(e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Heure fin
                                        </label>
                                        <input
                                            type="time"
                                            value={newSlotEnd}
                                            onChange={(e) =>
                                                setNewSlotEnd(e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Libellé
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ex: 8h-10h15"
                                            value={newSlotLabel}
                                            onChange={(e) =>
                                                setNewSlotLabel(e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddTimeSlot}
                                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} />
                                    Ajouter un créneau
                                </button>
                            </div>

                            {/* List of time slots */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                                    Créneaux actuels:
                                </h4>
                                {timeSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                                    >
                                        <div>
                                            <div className="font-medium text-slate-900">
                                                {slot.label}
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                {slot.startTime} - {slot.endTime}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleDeleteTimeSlot(slot.id)
                                            }
                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Main render
    if (currentPage === "login") {
        return <LoginPage />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Sidebar />
            <div className="ml-64">
                {currentPage === "dashboard" && <DashboardPage />}
                {currentPage === "personnel" && <PersonnelPage />}
                {currentPage === "placement" && <PlacementPage />}
                {currentPage === "stats" && <StatsPage />}
                {currentPage === "settings" && <SettingsPage />}
            </div>
        </div>
    );
};

export default LBNApp;
