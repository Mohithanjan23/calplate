import { User, Flag, Clock, ChevronRight } from 'lucide-react';

const SettingsItem = ({ icon, label, path = '#' }) => (
     <a href={path} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border">
        <div className="flex items-center gap-4">
            {icon}
            <span className="font-semibold">{label}</span>
        </div>
        <ChevronRight className="text-gray-400" />
    </a>
);

export default function Settings() {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-3xl font-bold">Settings</h1>
            <SettingsItem icon={<User size={20} />} label="Personal details" />
            <SettingsItem icon={<Flag size={20} />} label="Goal & current weight" />
            <SettingsItem icon={<Clock size={20} />} label="Weight history" />
        </div>
    );
}