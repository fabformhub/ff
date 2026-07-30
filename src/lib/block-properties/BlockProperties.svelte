<script>
	import { formState } from "$lib/state/form.svelte.js";
	import { Input, MentionInput, TextArea, Checkbox, Dropdown, ImageUploader } from "$lib/ui";
	import { AlignmentControl, ChoicesEditor } from ".";

	let block = $derived(formState.blocks[formState.blockNo]);
	let meta = $derived(block?.meta ?? {});
	let props = $derived(meta?.props ?? {});
	let validation = $derived(meta?.validation ?? {});
	let coverImageProps = $derived(meta?.coverImageProps ?? {});

	const layoutOptions = [
		{ label: "Wallpaper", value: "wallpaper" },
		{ label: "Stack", value: "stack" },
		{ label: "Split Left", value: "split-left" },
		{ label: "Split Right", value: "split-right" }
	];
</script>

<div class="flex flex-col h-full">
	{#if block?.meta}
		<div class="flex-1 overflow-y-auto space-y-5 px-5 py-6">
			<!-- Explicit either/or branch checking schema keys -->
			{#if 'title' in meta}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
					<MentionInput bind:value={block.meta.title} />
				</div>
			{:else if 'question' in meta}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Question</label>
					<MentionInput bind:value={block.meta.question} />
				</div>
			{/if}

			{#if 'description' in meta}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
					<TextArea bind:value={block.meta.description} />
				</div>
			{/if}

			{#if 'embed' in meta}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Embed</label>
					<Input bind:value={block.meta.embed} />
				</div>
			{/if}

			{#if 'choices' in props}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Options</label>
					<ChoicesEditor bind:choices={block.meta.props.choices} />
				</div>
			{/if}

			{#if 'textAlign' in meta}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Text Align</label>
					<AlignmentControl bind:textAlign={block.meta.textAlign} />
				</div>
			{/if}

			{#if 'buttonText' in meta}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Button Text</label>
					<Input bind:value={block.meta.buttonText} />
				</div>
			{/if}

			{#if 'placeholder' in props}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Placeholder</label>
					<Input bind:value={block.meta.props.placeholder} />
				</div>
			{/if}

			{#if 'size' in props}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Textbox Size</label>
					<Dropdown
						choices={["Small", "Medium", "Large", "Extra Large"]}
						bind:value={block.meta.props.size}
					/>
				</div>
			{/if}

			{#if 'start' in props || 'end' in props}
				<div class="flex gap-3">
					{#if 'start' in props}
						<div class="flex-1">
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Start</label>
							<Dropdown choices={["0", "1"]} bind:value={block.meta.props.start} />
						</div>
					{/if}
					{#if 'end' in props}
						<div class="flex-1">
							<label class="block text-sm font-medium text-gray-700 mb-1.5">End</label>
							<Dropdown
								choices={["3", "4", "5", "6", "7", "8", "9", "10"]}
								bind:value={block.meta.props.end}
							/>
						</div>
					{/if}
				</div>
			{/if}

			{#if 'maxRating' in props}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Max Rating</label>
					<Dropdown
						choices={["3", "4", "5", "6", "7", "8", "9", "10"]}
						bind:value={block.meta.props.maxRating}
					/>
				</div>
			{/if}

			{#if 'maxCharacters' in props}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Max Characters</label>
					<Input bind:value={block.meta.props.maxCharacters} />
				</div>
			{/if}

			{#if 'leftLabel' in props || 'rightLabel' in props}
				<div class="flex gap-3">
					{#if 'leftLabel' in props}
						<div class="flex-1">
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Left Label</label>
							<Input bind:value={block.meta.props.leftLabel} />
						</div>
					{/if}
					{#if 'rightLabel' in props}
						<div class="flex-1">
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Right Label</label>
							<Input bind:value={block.meta.props.rightLabel} />
						</div>
					{/if}
				</div>
			{/if}

			{#if 'required' in validation}
				<div class="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
					<div>
						<label class="block text-sm font-medium text-gray-700">Required field</label>
						<p class="text-xs text-gray-500 mt-0.5">Users must complete this field to continue.</p>
					</div>
					<Checkbox bind:checked={block.meta.validation.required} />
				</div>
			{/if}

			{#if 'maxLength' in validation}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Max Characters</label>
					<Input bind:value={block.meta.validation.maxLength} />
				</div>
			{/if}

			{#if 'coverImageProps' in meta}
				<div class="pt-5 border-t border-gray-100">
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
					<ImageUploader
						id={block.id}
						imageType="block"
						bind:image={block.meta.coverImageProps.coverImage}
					/>
					{#if coverImageProps?.coverImage}
						<div class="mt-3">
							<label class="block text-sm font-medium text-gray-700 mb-1.5">Layout</label>
							<Dropdown options={layoutOptions} bind:value={block.meta.coverImageProps.layout} />
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
