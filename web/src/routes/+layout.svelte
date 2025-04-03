<!-- routes/+layout.svelte -->
<script lang="ts">
	import '../app.css'
	import 'material-icons/iconfont/material-icons.css'
	import { synchronizeUserData, initializeStatusMonitor } from '$lib/utils/requests'
	import { online } from '$lib/stores'
	import { page } from '$app/state'

	const { children } = $props()
	let hasSynced = false

	$effect(initializeStatusMonitor)

	$effect(() => {
		const isAuthPath = page.url.pathname.startsWith('/auth')
		if ($online && !isAuthPath && (!hasSynced || document.visibilityState === 'visible')) {
			synchronizeUserData().then((success) => {
				if (!success) {
					window.location.href = '/auth/login'
				} else {
					hasSynced = true
				}
			})
		}
	})
</script>

{@render children()}
