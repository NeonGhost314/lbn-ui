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
} from "lucide-react";

const LBNApp = () => {
    type Day = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";

    interface Course {
        time: string;
        room: string;
        tutor: string;
        students: number;
        subject: string;
        color: string;
    }

    const [currentPage, setCurrentPage] = useState("dashboard");
    const [selectedDay, setSelectedDay] = useState<Day>("Lundi");

    const days: Day[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    const timeSlots = [
        "8h00",
        "9h30",
        "11h00",
        "13h00",
        "14h30",
        "16h00",
        "17h30",
    ];

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
                time: "13h00",
                room: "Salle B",
                tutor: "Jean Martin",
                students: 4,
                subject: "Français",
                color: "bg-purple-500",
            },
        ],
        Mardi: [
            {
                time: "9h30",
                room: "Salle A",
                tutor: "Sophie Chen",
                students: 2,
                subject: "Sciences",
                color: "bg-green-500",
            },
            {
                time: "14h30",
                room: "Salle C",
                tutor: "Marie Dupont",
                students: 5,
                subject: "Math",
                color: "bg-blue-500",
            },
        ],
    };

    // Navigation
    const NavBar = () => (
        <div className="bg-white text-slate-800 p-4 flex items-center justify-between shadow-md border-b border-slate-200">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center font-bold text-xl text-white">
                    LBN
                </div>
                <span
                    className="text-xl font-semibold"
                    style={{ fontFamily: "Georgia, serif" }}
                >
                    la bonne note
                </span>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                    <Bell size={20} className="text-slate-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full"></div>
                    <span className="text-sm text-slate-700">Admin</span>
                </div>
            </div>
        </div>
    );

    const Sidebar = () => (
        <div className="w-64 bg-slate-900 text-white h-screen p-4 space-y-2">
            <button
                onClick={() => setCurrentPage("dashboard")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${currentPage === "dashboard"
                        ? "bg-orange-500 shadow-lg"
                        : "hover:bg-slate-800"
                    }`}
            >
                <Calendar size={20} />
                <span>Tableau de bord</span>
            </button>
            <button
                onClick={() => setCurrentPage("personnel")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${currentPage === "personnel"
                        ? "bg-orange-500 shadow-lg"
                        : "hover:bg-slate-800"
                    }`}
            >
                <Users size={20} />
                <span>Personnel</span>
            </button>
            <button
                onClick={() => setCurrentPage("placement")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${currentPage === "placement"
                        ? "bg-orange-500 shadow-lg"
                        : "hover:bg-slate-800"
                    }`}
            >
                <BookOpen size={20} />
                <span>Placement</span>
            </button>
            <button
                onClick={() => setCurrentPage("stats")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${currentPage === "stats"
                        ? "bg-orange-500 shadow-lg"
                        : "hover:bg-slate-800"
                    }`}
            >
                <BarChart3 size={20} />
                <span>Statistiques</span>
            </button>
            <button
                onClick={() => setCurrentPage("settings")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${currentPage === "settings"
                        ? "bg-orange-500 shadow-lg"
                        : "hover:bg-slate-800"
                    }`}
            >
                <Settings size={20} />
                <span>Réglages</span>
            </button>
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

    // Dashboard Page
    const DashboardPage = () => (
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm font-medium">
                            Élèves actifs
                        </span>
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">142</div>
                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                        <TrendingUp size={14} />
                        <span>+12% ce mois</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm font-medium">
                            Cours planifiés
                        </span>
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Calendar size={20} className="text-purple-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">87</div>
                    <div className="text-slate-500 text-sm mt-2">
                        Cette semaine
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm font-medium">
                            Taux occupation
                        </span>
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <BarChart3 size={20} className="text-green-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">92%</div>
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                        <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "92%" }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
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
                    <div className="text-3xl font-bold text-slate-900">3</div>
                    <div className="text-orange-600 text-sm mt-2">
                        À résoudre
                    </div>
                </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Vue hebdomadaire
                        </h2>
                        <p className="text-slate-600 text-sm">
                            Semaine du 17 octobre 2025
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
                            <Filter size={16} />
                            Filtrer
                        </button>
                        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                            <Plus size={16} />
                            Nouveau cours
                        </button>
                    </div>
                </div>

                {/* Day tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${selectedDay === day
                                    ? "bg-orange-500 text-white shadow-lg"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Schedule grid */}
                <div className="grid grid-cols-4 gap-4">
                    {timeSlots.map((time) => {
                        const coursesAtTime =
                            courses[selectedDay]?.filter(
                                (c) => c.time === time
                            ) || [];
                        return (
                            <div key={time} className="space-y-2">
                                <div className="text-sm font-medium text-slate-500">
                                    {time}
                                </div>
                                {coursesAtTime.length > 0 ? (
                                    coursesAtTime.map((course, idx) => (
                                        <div
                                            key={idx}
                                            className={`${course.color} text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                                        >
                                            <div className="font-semibold mb-1">
                                                {course.subject}
                                            </div>
                                            <div className="text-sm opacity-90 flex items-center gap-1 mb-1">
                                                <MapPin size={12} />
                                                {course.room}
                                            </div>
                                            <div className="text-sm opacity-90">
                                                {course.tutor}
                                            </div>
                                            <div className="flex items-center gap-1 mt-2 text-xs">
                                                <Users size={12} />
                                                <span>
                                                    {course.students} élèves
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 hover:border-slate-300 transition-colors cursor-pointer">
                                        <Plus
                                            size={16}
                                            className="mx-auto mb-1"
                                        />
                                        <span className="text-xs">Ajouter</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

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
    const SettingsPage = () => (
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
            </div>
        </div>
    );

    // Main render
    if (currentPage === "login") {
        return <LoginPage />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="flex flex-1">
                <Sidebar />
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
