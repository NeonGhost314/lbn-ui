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
    const NavBar = () => (
        <div className="fixed top-0 left-64 right-0 bg-white/80 backdrop-blur-sm text-slate-800 px-6 py-3 flex items-center justify-between shadow-sm border-b border-slate-200/60 z-50">
            <div>
                <h1 className="text-lg font-semibold text-slate-700">
                    {currentPage === "dashboard" && "Tableau de bord"}
                    {currentPage === "personnel" && "Personnel"}
                    {currentPage === "placement" && "Placement"}
                    {currentPage === "stats" && "Statistiques"}
                    {currentPage === "settings" && "Réglages"}
                </h1>
            </div>
        </div>
    );

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
            <div className="flex-1 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 p-8 overflow-auto">
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
        );
    };

    // Personnel Page
    const PersonnelPage = () => (
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                    Gestion du personnel
                </h2>
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

            <div className="grid grid-cols-2 gap-6">
                {/* Tuteurs */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">
                            Tuteurs (12)
                        </h3>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Search size={18} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {[
                            {
                                name: "Marie Dupont",
                                courses: 8,
                                capacity: "12/15 PG",
                                status: "active",
                                avatar: "from-blue-500 to-blue-600",
                            },
                            {
                                name: "Jean Martin",
                                courses: 6,
                                capacity: "10/12 PG",
                                status: "active",
                                avatar: "from-purple-500 to-purple-600",
                            },
                            {
                                name: "Sophie Chen",
                                courses: 10,
                                capacity: "15/15 PG",
                                status: "full",
                                avatar: "from-green-500 to-green-600",
                            },
                            {
                                name: "Thomas Roy",
                                courses: 4,
                                capacity: "6/10 PG",
                                status: "active",
                                avatar: "from-orange-500 to-orange-600",
                            },
                        ].map((tutor, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <div
                                    className={`w-12 h-12 bg-gradient-to-br ${tutor.avatar} rounded-full`}
                                ></div>
                                <div className="flex-1">
                                    <div className="font-semibold text-slate-900">
                                        {tutor.name}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {tutor.courses} cours • {tutor.capacity}
                                    </div>
                                </div>
                                <div
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${tutor.status === "full"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {tutor.status === "full"
                                        ? "Complet"
                                        : "Actif"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Élèves */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">
                            Élèves (142)
                        </h3>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Search size={18} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {[
                            {
                                name: "Lucas Bernard",
                                grade: "Sec. 3",
                                pg: 3,
                                status: "active",
                            },
                            {
                                name: "Emma Tremblay",
                                grade: "Sec. 4",
                                pg: 2,
                                status: "active",
                            },
                            {
                                name: "Noah Gagnon",
                                grade: "Sec. 5",
                                pg: 4,
                                status: "active",
                            },
                            {
                                name: "Olivia Côté",
                                grade: "Sec. 3",
                                pg: 2,
                                status: "active",
                            },
                            {
                                name: "William Roy",
                                grade: "Sec. 4",
                                pg: 3,
                                status: "active",
                            },
                        ].map((student, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="font-semibold text-slate-900">
                                        {student.name}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {student.grade} • {student.pg} PG
                                    </div>
                                </div>
                                <CheckCircle
                                    size={18}
                                    className="text-green-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Placement Page
    const PlacementPage = () => (
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Placement et organisation
            </h2>

            <div className="grid grid-cols-3 gap-6">
                {/* Available resources */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                        Tuteurs disponibles
                    </h3>
                    <div className="space-y-2">
                        {["Marie D.", "Jean M.", "Sophie C."].map(
                            (name, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:shadow-md transition-all"
                                >
                                    <div className="font-medium text-blue-900">
                                        {name}
                                    </div>
                                    <div className="text-xs text-blue-600">
                                        Capacité: 5/10 PG
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-6 mb-4">
                        Élèves à placer
                    </h3>
                    <div className="space-y-2">
                        {["Lucas B.", "Emma T.", "Noah G.", "Olivia C."].map(
                            (name, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-move hover:shadow-md transition-all"
                                >
                                    <div className="font-medium text-slate-900">
                                        {name}
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        3 PG • Sec. 3
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Drop zones */}
                <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                        Lundi 8h00 - Salle A
                    </h3>

                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-xl p-6">
                            <div className="text-sm font-medium text-orange-700 mb-3">
                                Tuteur assigné
                            </div>
                            <div className="p-4 bg-white border-2 border-orange-400 rounded-lg">
                                <div className="font-semibold text-slate-900">
                                    Marie Dupont
                                </div>
                                <div className="text-sm text-slate-600">
                                    Capacité utilisée: 7/15 PG
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                                    <div
                                        className="bg-orange-500 h-2 rounded-full"
                                        style={{ width: "47%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-6">
                            <div className="text-sm font-medium text-blue-700 mb-3">
                                Élèves inscrits (3)
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 bg-white border border-blue-200 rounded-lg flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-slate-900">
                                            Lucas Bernard
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            3 PG
                                        </div>
                                    </div>
                                    <button className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="p-3 bg-white border border-blue-200 rounded-lg flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-slate-900">
                                            Emma Tremblay
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            2 PG
                                        </div>
                                    </div>
                                    <button className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="p-3 bg-white border border-blue-200 rounded-lg flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-slate-900">
                                            Noah Gagnon
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            2 PG
                                        </div>
                                    </div>
                                    <button className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                            <CheckCircle size={18} />
                            Valider le placement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Stats Page
    const StatsPage = () => (
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                    Statistiques et rapports
                </h2>
                <button className="px-4 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Download size={16} />
                    Exporter
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Chart 1 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                        Occupation des salles
                    </h3>
                    <div className="space-y-3">
                        {[
                            { room: "Salle A", rate: 95, color: "bg-blue-500" },
                            {
                                room: "Salle B",
                                rate: 88,
                                color: "bg-purple-500",
                            },
                            {
                                room: "Salle C",
                                rate: 72,
                                color: "bg-green-500",
                            },
                            {
                                room: "Salle D",
                                rate: 65,
                                color: "bg-orange-500",
                            },
                        ].map((room, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700">
                                        {room.room}
                                    </span>
                                    <span className="text-sm font-bold text-slate-900">
                                        {room.rate}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                                    <div
                                        className={`${room.color} h-3 rounded-full transition-all`}
                                        style={{ width: `${room.rate}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart 2 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                        Matières populaires
                    </h3>
                    <div className="space-y-3">
                        {[
                            {
                                subject: "Mathématiques",
                                count: 45,
                                color: "bg-blue-500",
                            },
                            {
                                subject: "Français",
                                count: 32,
                                color: "bg-purple-500",
                            },
                            {
                                subject: "Sciences",
                                count: 28,
                                color: "bg-green-500",
                            },
                            {
                                subject: "Anglais",
                                count: 18,
                                color: "bg-orange-500",
                            },
                        ].map((subject, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div
                                    className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center text-white font-bold`}
                                >
                                    {subject.count}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-900">
                                        {subject.subject}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {subject.count} cours/semaine
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Rapport des dépassements
                </h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                        <AlertCircle
                            size={20}
                            className="text-orange-600 mt-0.5"
                        />
                        <div className="flex-1">
                            <div className="font-semibold text-orange-900">
                                Capacité dépassée - Marie Dupont
                            </div>
                            <div className="text-sm text-orange-700">
                                Lundi 14h30: 16/15 PG (Salle B)
                            </div>
                        </div>
                        <button className="text-orange-600 hover:bg-orange-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                            Résoudre
                        </button>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle
                            size={20}
                            className="text-red-600 mt-0.5"
                        />
                        <div className="flex-1">
                            <div className="font-semibold text-red-900">
                                Cours incomplet - Salle A
                            </div>
                            <div className="text-sm text-red-700">
                                Mercredi 10h00: Aucun tuteur assigné
                            </div>
                        </div>
                        <button className="text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                            Assigner
                        </button>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <AlertCircle
                            size={20}
                            className="text-yellow-600 mt-0.5"
                        />
                        <div className="flex-1">
                            <div className="font-semibold text-yellow-900">
                                Salle surchargée
                            </div>
                            <div className="text-sm text-yellow-700">
                                Vendredi 16h00: 8/6 élèves (Salle C)
                            </div>
                        </div>
                        <button className="text-yellow-600 hover:bg-yellow-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                            Ajuster
                        </button>
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
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Réglages</h2>

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
        );
    };

    // Main render
    if (currentPage === "login") {
        return <LoginPage />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <NavBar />
            <Sidebar />
            <div className="ml-64 pt-14">
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
