import type { Tables } from '~/types/database.types'

type Streamer = Tables<'Streamer'>
type QuestContext = {
    streamer: Streamer | null
    hasLinks: boolean
    hasMultipleLinks: boolean
    hasSlots: boolean
}

type QuestCondition = (ctx: QuestContext) => boolean

export interface Quest {
    id: string
    type: 'required' | 'optional'
    label: string
    to: string
    condition: QuestCondition
}

export const PROFILE_QUESTS: Quest[] = [

    // ESSENTIELLES
    {
        id: 'avatar',
        type: 'required',
        label: 'Ajouter une photo de profil',
        to: '/admin/design',
        condition: ({ streamer }) => !!streamer?.avatar_url
    },

    {
        id: 'link',
        type: 'required',
        label: 'Ajouter au moins un lien',
        to: '/admin/links',
        condition: ({ hasLinks }) => hasLinks
    },

    // OPTIONNELLES
    {
        id: 'bio',
        type: 'optional',
        label: 'Rédiger une description',
        to: '/admin/links',
        condition: ({ streamer }) => !!streamer?.bio
    },
    {
        id: 'schedule',
        type: 'optional',
        label: 'Ajouter ton prochain stream',
        to: '/schedule',
        condition: ({ hasSlots }) => hasSlots
    },
    {
        id: 'multiple-links',
        type: 'optional',
        label: 'Ajoute 3 liens ou plus',
        to: '/admin/links',
        condition: ({ hasMultipleLinks }) => hasMultipleLinks
    }
]
