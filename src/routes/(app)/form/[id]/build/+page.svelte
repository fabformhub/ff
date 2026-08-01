<script>
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { formState, setFormState, addBlock, deleteBlock, } from "$lib/state/form.svelte.js";

	import { Sidebar, SubMenu } from "$lib/layouts";
	import { FormView, BlockPicker } from "$lib/form-builder";
	import { AddBlockButton } from "$lib/ui";
	import { Dialog } from "$lib/dialogs";
	import { FormProperties } from "$lib/form-properties";
	import { BlockProperties } from "$lib/block-properties";
	import { openDialog } from "$lib/utils/dialog.svelte.js";
	let { data } = $props();
	const formId = $derived(page.params.id);
	
        let showDesign = $state(false);
	let showBlockPicker = $state(false);

         setFormState(data.form, data.blocks);

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

</script>

<SubMenu
	onBlock={() => showBlockPicker = !showBlockPicker}
	onDesign={() => showDesign = !showDesign}
	onEmail={() => goto(`/form/${formId}/email-settings`)}
/>

<FormProperties
	bind:open={showDesign}
/>

<BlockPicker
	show={showBlockPicker}
	close={() => showBlockPicker = false}
        onPick={addBlock}
/>

<Dialog />


<main class="flex flex-col h-[100dvh]">

	<div class="flex flex-1 overflow-hidden">

		<div class="w-1/4 p-2 border-r overflow-auto">

			<AddBlockButton
				clickHandler={() => showBlockPicker = true}
			/>

			<Sidebar
				onDeleteBlock={handleDeleteBlock}
			/>

		</div>


		<div class="w-1/2 overflow-auto">

			{#if formState.blocks[formState.blockNo]}
                        <FormView
                         form={formState.form}
                         bind:block={formState.blocks[formState.blockNo]}
                         canAnswer={false}
                        />
			{/if}

		</div>


		<div class="w-1/4 border-l overflow-auto">
			{#if formState.blocks[formState.blockNo]}
			<BlockProperties/>
			{/if}
		</div>

	</div>

</main>
