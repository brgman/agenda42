
interface ILanguages {
    id: string;
    value: string;
    code: string;
}

const languages: ILanguages[] = [
        { "id": "1", "value": "Français", "code": "🇫🇷" },
        { "id": "21", "value": "German", "code": "🇩🇪" },
        { "id": "24", "value": "Polish", "code": "🇵🇱" },
        { "id": "19", "value": "Catalan", "code": "🇪🇸" },
        { "id": "6", "value": "Russian", "code": "🇷🇺" },
        { "id": "18", "value": "Turkish", "code": "🇹🇷" },
        { "id": "9", "value": "Portuguese", "code": "🇵🇹" },
        { "id": "13", "value": "Japanese", "code": "🇯🇵" },
        { "id": "15", "value": "Armenian", "code": "🇦🇲" },
        { "id": "11", "value": "Spanish", "code": "🇪🇸" },
        { "id": "17", "value": "Brazilian Portuguese", "code": "🇧🇷" },
    { "id": "2", "value": "English", "code": "🇬🇧" },
        { "id": "20", "value": "Dutch", "code": "🇳🇱" },
        { "id": "14", "value": "Korean", "code": "🇰🇷" },
        { "id": "16", "value": "Italian", "code": "🇮🇹" },
        { "id": "5", "value": "Ukrainian", "code": "🇺🇦" },
        { "id": "3", "value": "Romanian", "code": "🇷🇴" }
];

export default languages;