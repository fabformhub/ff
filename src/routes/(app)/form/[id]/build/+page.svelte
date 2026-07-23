<script>
	import { page } from "$app/state";
	import { goto } from "$app/navigation";

	import {
		formState,
		setFormState,
		selectBlock,
		addBlock,
		deleteBlock,
                saveChanges
	} from "$lib/state/form.svelte.js";

	import { Sidebar, SubMenu } from "$lib/layouts";
	import { FormView, BlockPicker } from "$lib/form-builder";
	import { AddBlockButton } from "$lib/ui";
	import { Dialog } from "$lib/dialogs";
	import { FormProperties } from "$lib/form-properties";
	import { BlockProperties } from "$lib/block-properties";
	import { openDialog } from "$lib/utils/dialog.svelte.js";

	let { data } = $props();

	let showDesign = $state(false);
	let showBlockPicker = $state(false);

	setFormState(data.form, data.blocks);

	const formId = $derived(page.params.id);


	async function handleDeleteBlock(id) {
		const confirmed = await openDialog(
			"Delete Confirmation",
			"Are you sure you want to delete this block?",
			"Cancel",
			"Yes! Delete it"
		);

		if (confirmed) {
			await deleteBlock(id);
		}
	}

$effect(() => {
		JSON.stringify(formState.form);
		saveChanges();
	});

	$effect(() => {
		JSON.stringify(formState.blocks[formState.blockNo]);
		saveChanges();
	});

</script>


<SubMenu
	onBlock={() => showBlockPicker = !showBlockPicker}
	onDesign={() => showDesign = !showDesign}
	onEmail={() => goto(`/form/${formId}/email-settings`)}
/>

<FormProperties
	bind:form={formState.form}
	bind:open={showDesign}
/>


<BlockPicker
	show={showBlockPicker}
	close={() => showBlockPicker = false}
/>


<Dialog />


<main class="flex flex-col h-[100dvh]">

	<div class="flex flex-1 overflow-hidden">

		<div class="w-1/4 p-2 border-r overflow-auto">

			<AddBlockButton
				clickHandler={() => showBlockPicker = true}
			/>

			<Sidebar
				blockNo={formState.blockNo}
				blocks={formState.blocks}
				onSelectBlock={selectBlock}
				deleteBlock={handleDeleteBlock}
			/>

		</div>


		<div class="w-1/2 overflow-auto">

			{#if formState.blocks[formState.blockNo]}

				<FormView
					form={formState.form}
					bind:block={formState.blocks[formState.blockNo]}
				/>

			{/if}

		</div>


		<div class="w-1/4 border-l overflow-auto">

			{#if formState.blocks[formState.blockNo]}

				<BlockProperties
					bind:block={formState.blocks[formState.blockNo]}
				/>

			{/if}

		</div>

	</div>

</main>
