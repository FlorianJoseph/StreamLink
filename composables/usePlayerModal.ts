const _state = ref<{ open: boolean; streamer: any | null }>({ open: false, streamer: null })

export function usePlayerModal() {
    function openPlayer(streamer: any) {
        _state.value = { open: true, streamer }
    }
    function closePlayer() {
        _state.value.open = false
    }
    return { playerModal: _state, openPlayer, closePlayer }
}
