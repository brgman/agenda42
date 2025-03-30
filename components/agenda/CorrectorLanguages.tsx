import languages from "../../common/data/languages";

export const CorrectorLanguages = ({ id, users = null }: { id: any; users: any; }) => (
    users.filter((i: any) => i.id == id)[0].languages
        ?.map((i: any) => (<span style={{ marginLeft: 10 }} >
            {languages.filter(j => i.language_id == j.id)[0].code}
        </span>))
);