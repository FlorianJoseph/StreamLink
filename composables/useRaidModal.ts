const _state = ref<{
    open: boolean
    streamer: any | null
    confirmed: boolean
    countdown: number
    earnedCoins: number
    loading: boolean
}>({ open: false, streamer: null, confirmed: false, countdown: 15, earnedCoins: 0, loading: false })

export function useRaidModal() {
    function openRaidFor(streamer: any) {
        _state.value = {
            open: true, streamer,
            confirmed: false, countdown: 15,
            earnedCoins: 0, loading: false,
        }
    }
    function closeRaid() {
        _state.value.open = false
        _state.value.confirmed = false
        _state.value.countdown = 15
    }
    return { raidModal: _state, openRaidFor, closeRaid }
}
