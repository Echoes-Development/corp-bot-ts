import {CMGuild} from "../types/guild";

export const ensureAdmin = (guild: CMGuild, userId: string): boolean =>
    !!guild.admins.find((aid) => aid === userId)
