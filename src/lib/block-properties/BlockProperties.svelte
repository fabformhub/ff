<script>
let { block = $bindable() } = $props();
import { Input, TextArea, Checkbox, Dropdown } from "$lib/ui";
import { AlignmentControl, ChoicesEditor } from ".";
import { ImageUploader } from "$lib/ui";
const layoutOptions = [
  { label: "Wallpaper", value: "wallpaper" },
  { label: "Stack", value: "stack" },
  { label: "Split Left", value: "split-left" },
  { label: "Split Right", value: "split-right" }
];
</script>

<div class="flex flex-col h-full">
	<div class="flex-1 overflow-y-auto space-y-5 px-5 py-6">

		{#if block?.meta?.title !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
				<Input bind:value={block.meta.title} />
			</div>
		{:else if block?.meta?.question !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Question</label>
				<Input bind:value={block.meta.question} />
			</div>
		{/if}

		{#if block?.meta?.description !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
				<TextArea bind:value={block.meta.description} />
			</div>
		{/if}

		{#if block?.meta?.embed !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Embed</label>
				<Input bind:value={block.meta.embed} />
			</div>
		{/if}

		{#if block?.meta?.props?.choices !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Options</label>
				<ChoicesEditor bind:choices={block.meta.props.choices} />
			</div>
		{/if}

		{#if block?.meta?.textAlign !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Text Align</label>
				<AlignmentControl bind:textAlign={block.meta.textAlign} />
			</div>
		{/if}

		{#if block?.meta?.buttonText !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Button Text</label>
				<Input bind:value={block.meta.buttonText} />
			</div>
		{/if}

		{#if block?.meta?.props?.placeholder !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Placeholder</label>
				<Input bind:value={block.meta.props.placeholder} />
			</div>
		{/if}

		{#if block?.meta?.props?.size !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Textbox Size</label>
				<Dropdown
					choices={["Small", "Medium", "Large", "Extra Large"]}
					bind:value={block.meta.props.size}
				/>
			</div>
		{/if}

		{#if block?.meta?.props?.start !== undefined || block?.meta?.props?.end !== undefined}
			<div class="flex gap-3">
				{#if block?.meta?.props?.start !== undefined}
					<div class="flex-1">
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Start</label>
						<Dropdown choices={["0", "1"]} bind:value={block.meta.props.start} />
					</div>
				{/if}
				{#if block?.meta?.props?.end !== undefined}
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

		{#if block?.meta?.props?.maxRating !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Max Rating</label>
				<Dropdown
					choices={["3", "4", "5", "6", "7", "8", "9", "10"]}
					bind:value={block.meta.props.maxRating}
				/>
			</div>
		{/if}

		{#if block?.meta?.props?.maxCharacters !== undefined}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Max Characters</label>
				<Input bind:value={block.meta.props.maxCharacters} />
			</div>
		{/if}

		{#if block?.meta?.props?.leftLabel !== undefined || block?.meta?.props?.rightLabel !== undefined}
			<div class="flex gap-3">
				{#if block?.meta?.props?.leftLabel !== undefined}
					<div class="flex-1">
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Left Label</label>
						<Input bind:value={block.meta.props.leftLabel} />
					</div>
				{/if}
				{#if block?.meta?.props?.rightLabel !== undefined}
					<div class="flex-1">
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Right Label</label>
						<Input bind:value={block.meta.props.rightLabel} />
					</div>
				{/if}
			</div>
		{/if}

		{#if block?.meta?.validation?.required != null}
			<div class="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
				<div>
					<label class="block text-sm font-medium text-gray-700">Required field</label>
					<p class="text-xs text-gray-500 mt-0.5">Users must complete this field to continue.</p>
				</div>
				<Checkbox bind:checked={block.meta.validation.required} />
			</div>
		{/if}

		{#if block?.meta?.validation?.maxLength != null}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1.5">Max Characters</label>
				<Input bind:value={block.meta.validation.maxLength} />
			</div>
		{/if}

		<div class="pt-5 border-t border-gray-100">
			<label class="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
			<ImageUploader
				id={block.id}
				imageType="block"
				bind:image={block.meta.coverImageProps.coverImage}
			/>
			{#if block?.meta?.coverImageProps?.coverImage}
				<div class="mt-3">
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Layout</label>
					<Dropdown options={layoutOptions} bind:value={block.meta.coverImageProps.layout} />
				</div>
			{/if}
		</div>

	</div>
</div>
