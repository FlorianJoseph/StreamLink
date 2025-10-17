export function useVignetteUploader(linkRef) {
    const supabase = useSupabaseClient()
    const linkStore = useLinkStore()

    const imageUrl = ref(null)
    const croppedImage = ref(null)
    const selectedIcon = ref(null)

    // Liste d'icônes disponibles
    const availableIcons = [
        'simple-icons:instagram',
        'simple-icons:twitter',
        'simple-icons:tiktok',
        'simple-icons:facebook',
        'simple-icons:snapchat',
        'simple-icons:reddit',
        'simple-icons:threads',
        'simple-icons:linkedin',
        'simple-icons:youtube',
        'simple-icons:twitch',
        'simple-icons:discord',
        'simple-icons:kick',
        'simple-icons:steam',
        'simple-icons:epicgames',
        'simple-icons:xbox',
        'simple-icons:playstation',
        'simple-icons:nintendo',
        'simple-icons:roblox',
        'simple-icons:spotify',
        'simple-icons:soundcloud',
        'simple-icons:applemusic',
        'simple-icons:bandcamp',
        'simple-icons:deezer',
        'simple-icons:paypal',
        'simple-icons:patreon',
        'simple-icons:kofi',
        'simple-icons:buymeacoffee',
        'simple-icons:amazon',
        'simple-icons:cashapp',
        'simple-icons:github',
        'simple-icons:gitlab',
        'simple-icons:telegram',
        'simple-icons:whatsapp',
        'simple-icons:slack',
        'simple-icons:google',
        'simple-icons:linktree',
        'simple-icons:onlyfans',
        'simple-icons:medium',
        'simple-icons:pinterest',
        'simple-icons:dribbble',
        'simple-icons:flickr',
        'simple-icons:tumblr',
        'simple-icons:wechat',
        'simple-icons:line',
        'simple-icons:vimeo',
        'simple-icons:quora',
        'simple-icons:behance',
        'simple-icons:discord',
        'simple-icons:signal',

        'lucide:mail',
        'lucide:link',
        'lucide:phone',
        'lucide:globe',
        'lucide:home',
        'lucide:user',
        'lucide:users',
        'lucide:search',
        'lucide:settings',
        'lucide:lock',
        'lucide:shield',
        'lucide:star',
        'lucide:heart',
        'lucide:check',
        'lucide:x',
        'lucide:alert-circle',
        'lucide:alert-triangle',
        'lucide:info',
        'lucide:download',
        'lucide:upload',
        'lucide:camera',
        'lucide:video',
        'lucide:play',
        'lucide:pause',
        'lucide:square',
        'lucide:clock',
        'lucide:calendar',
        'lucide:map-pin',
        'lucide:map',
        'lucide:folder',
        'lucide:file',
        'lucide:book',
        'lucide:bookmark',
        'lucide:bell',
        'lucide:plus',
        'lucide:minus',
        'lucide:menu',
        'lucide:more-vertical',
        'lucide:more-horizontal',
        'lucide:repeat',
        'lucide:refresh-cw',
        'lucide:refresh-ccw',
        'lucide:send',
        'lucide:share-2',
        'lucide:shopping-cart',
        'lucide:credit-card',
        'lucide:truck',
        'lucide:tag',
        'lucide:paperclip',
        'lucide:trash',
        'lucide:edit',
        'lucide:eye',
        'lucide:eye-off',
        'lucide:chevron-up',
        'lucide:chevron-down',
        'lucide:chevron-left',
        'lucide:chevron-right',
        'lucide:arrow-up',
        'lucide:arrow-down',
        'lucide:arrow-left',
        'lucide:arrow-right',
        'lucide:corner-up-right',
        'lucide:corner-up-left',
        'lucide:corner-down-right',
        'lucide:corner-down-left',
        'lucide:copy',
        'lucide:command',
        'lucide:terminal',
        'lucide:code',
        'lucide:layout',
        'lucide:database',
        'lucide:server',
        'lucide:cpu',
        'lucide:smartphone',
        'lucide:tablet',
        'lucide:watch',
        'lucide:headphones',
        'lucide:speaker',
    ]


    const searchIcon = ref('')

    const filteredIcons = computed(() => {
        const query = searchIcon.value.trim().toLowerCase()
        if (!query) return availableIcons
        return availableIcons.filter(icon => icon.toLowerCase().includes(query))
    })

    // Étape 1 : Fichier sélectionné
    const onFileSelect = (event) => {
        const file = event.files?.[0]
        if (!file) return
        const localUrl = URL.createObjectURL(file)
        imageUrl.value = localUrl
    }

    // Étape 2 : Crop
    const onCropChange = ({ canvas }) => {
        if (canvas) croppedImage.value = canvas
    }

    const selectIcon = (iconName) => {
        selectedIcon.value = iconName
        imageUrl.value = null // supprime l'image si icône choisie
    }

    // Étape 3 : Sauvegarde sur Supabase
    const saveVignette = async () => {
        if (!linkRef.value) {
            console.warn('linkRef ou linkRef.id est manquant !')
            return
        }

        // Si une image est uploadée
        if (croppedImage.value) {
            croppedImage.value.toBlob(async (blob) => {
                const filePath = `Vignette/${linkRef.value.id}_${crypto.randomUUID()}.png`
                const { error } = await supabase.storage.from('Streamlink').upload(filePath, blob, { upsert: true })

                if (error) {
                    console.error('Erreur upload:', error)
                    return
                }

                const publicUrl = supabase.storage.from('Streamlink').getPublicUrl(filePath).data.publicUrl
                await linkStore.updateLink(linkRef.value.id, { icon_url: publicUrl, custom_icon: true })
            }, 'image/png')
        }
        // Si une icône est choisie
        else if (selectedIcon.value) {
            await linkStore.updateLink(linkRef.value.id, { icon: selectedIcon.value, icon_url: null, custom_icon: true })
        }

        // Reset
        imageUrl.value = null
        croppedImage.value = null
        selectedIcon.value = null
    }

    // Supprimer la vignette
    const removeVignette = async () => {
        if (!linkRef.value) return
        if (linkRef.value.icon_url) {
            const path = linkRef.value.icon_url.split('/Vignette/')[1]
            await supabase.storage.from('Streamlink').remove([`Vignette/${path}`])
        }
        await linkStore.updateLink(linkRef.value.id, { icon_url: null, custom_icon: false })
        imageUrl.value = null
        croppedImage.value = null
        selectedIcon.value = null
    }

    return {
        imageUrl,
        croppedImage,
        selectedIcon,
        availableIcons,
        onFileSelect,
        onCropChange,
        selectIcon,
        saveVignette,
        removeVignette,
        searchIcon,
        filteredIcons,
    }
}
