<script>
	import { supabase } from "$lib/supabaseClient";
	import { authService } from "$lib/services/authService.svelte.js";
	import { BlockWrapper } from "$lib/blocks";
	import CloudUpload from "@lucide/svelte/icons/cloud-upload";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import FileText from "@lucide/svelte/icons/file-text";

	let { canAnswer = false } = $props();
	let fileInput;
	let uploadedFiles = $state([]);
	let currentUserId = "";
	let progress = $state(0);
	let uploading = $state(false);
	let dragging = $state(false);

	authService.getUser().then(async (user) => {
		if (user) {
			currentUserId = user.id;
			await listUserFiles();
		}
	});

	async function listUserFiles() {
		if (!currentUserId) return;
		const { data, error } = await supabase.storage
			.from("user-files")
			.list(`users/${currentUserId}/`, { limit: 100 });
		if (!error) {
			uploadedFiles = await Promise.all(
				data.map(async (file) => {
					const { data: urlData } = supabase.storage
						.from("user-files")
						.getPublicUrl(`users/${currentUserId}/${file.name}`);
					return {
						...file,
						publicUrl: urlData.publicUrl,
						sizeKB: file.metadata?.size ? (file.metadata.size / 1024).toFixed(1) : "0.0"
					};
				})
			);
		} else {
			alert("Could not list files: " + error.message);
		}
	}

	function triggerFileInput() {
		if (canAnswer) fileInput.click();
	}

	async function handleFileChange(event) {
		const file = event.target.files[0];
		if (file) await handleFileUpload(file);
	}

	async function handleFileUpload(file) {
		if (!canAnswer || !currentUserId) return;
		progress = 0;
		uploading = true;

		const fileSize = file.size;
		const increment = 2 + 1000000 / fileSize;
		const interval = 100;
		const timer = setInterval(() => {
			if (progress < 90) progress = Math.min(progress + increment, 90);
		}, interval);

		const path = `users/${currentUserId}/${file.name}`;
		const { error } = await supabase.storage.from("user-files").upload(path, file, { upsert: true });
		clearInterval(timer);

		if (error) {
			uploading = false;
			progress = 0;
			alert(`Upload failed: ${error.message}`);
			return;
		}

		progress = 100;
		await listUserFiles();
		setTimeout(() => {
			uploading = false;
			progress = 0;
		}, 700);
	}

	async function deleteFile(fileName) {
		const path = `users/${currentUserId}/${fileName}`;
		const { error } = await supabase.storage.from("user-files").remove([path]);
		if (error) {
			alert(`Delete failed: ${error.message}`);
		} else {
			await listUserFiles();
		}
	}

	function handleDrop(event) {
		event.preventDefault();
		dragging = false;
		if (canAnswer) handleFileUpload(event.dataTransfer.files[0]);
	}
</script>

<BlockWrapper {canAnswer}>
	<div class="w-full space-y-8">
		<div
			role="button"
			tabindex={canAnswer ? 0 : -1}
			ondrop={handleDrop}
			ondragover={(e) => { e.preventDefault(); if (canAnswer) dragging = true; }}
			ondragleave={() => (dragging = false)}
			onclick={triggerFileInput}
			class={[
				"rounded-2xl border-[1.5px] border-dashed p-10 flex flex-col items-center text-center bg-gray-50",
				"transition-colors duration-200",
				canAnswer ? "cursor-pointer" : "cursor-not-allowed opacity-40",
				dragging ? "border-pink-500 bg-pink-50" : "border-gray-300"
			]}
		>
			<div class="w-[52px] h-[52px] rounded-full bg-pink-50 flex items-center justify-center mb-3.5">
				<CloudUpload size={24} strokeWidth={2} class="text-pink-500" />
			</div>

			{#if canAnswer}
				<p class="text-[0.95rem] font-medium text-gray-900 mb-0.5">Click or drag a file to upload</p>
				<p class="text-[0.8rem] text-gray-400">PNG, JPG or PDF</p>
			{/if}

			<input
				type="file"
				class="hidden"
				bind:this={fileInput}
				onchange={handleFileChange}
				disabled={!canAnswer}
			/>
		</div>

		{#if uploading}
			<div class="flex items-center gap-2.5 -mt-4">
				<div class="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
					<div
						class="h-full rounded-full bg-pink-500 transition-all duration-300 ease-out"
						style="width: {progress}%;"
					></div>
				</div>
				<span class="text-[0.8rem] text-gray-400 min-w-[32px]">{Math.floor(progress)}%</span>
			</div>
		{/if}

		{#if canAnswer && uploadedFiles.length > 0}
			<div class="flex flex-wrap gap-3.5 justify-center">
				{#each uploadedFiles as file}
					<div class="relative w-32 p-2.5 rounded-2xl border border-gray-200 bg-white flex flex-col items-center gap-1" title={file.name}>
						{#if file.name.match(/\.(jpg|jpeg|png|gif)$/i)}
							<img src={file.publicUrl} alt="preview" class="w-full h-[88px] rounded-[10px] object-cover" />
						{:else}
							<div class="w-full h-[88px] rounded-[10px] bg-gray-50 flex items-center justify-center">
								<FileText size={28} strokeWidth={1.6} class="text-gray-400" />
							</div>
						{/if}

						<span class="text-[0.8rem] font-medium text-gray-900 truncate w-full text-center mt-1">
							{file.name}
						</span>
						<span class="text-[0.7rem] text-gray-400">{file.sizeKB} KB</span>

						<button
							type="button"
							onclick={() => deleteFile(file.name)}
							aria-label={`Delete file ${file.name}`}
							title="Delete file"
							class="absolute top-2 right-2 w-[22px] h-[22px] rounded-full bg-gray-50 text-gray-400 flex items-center justify-center transition-colors duration-150 hover:bg-pink-50 hover:text-pink-800"
						>
							<Trash2 size={13} strokeWidth={2} />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</BlockWrapper>
