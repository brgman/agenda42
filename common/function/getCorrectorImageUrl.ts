import { getName } from "../../helpers/helpers";

export const getCorrectorImageUrl = (id: number, users: any, me: any): string | undefined => {
    const user = users?.find((user) => user.id === id);
    return user?.image?.versions.small ?? me?.image?.versions.small;
};

export const getCorrectorName = (id: any, users: any, me: any) => {
    let name = null;
    users.map((i: any) => {
        if (i.id == id) {
            name = `${getName(i)} (${i.login})`;
        }
    });
    if (!name)
        name = me.usual_full_name;
    return (name);
};

export const getRentre = (id: any, users: any, me: any) => {
    const user = users?.find((user) => user.id === id);
    return (`${user.pool_month} ${user.pool_year}`);
};
