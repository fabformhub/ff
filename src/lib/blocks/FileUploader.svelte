<script>
	import { supabase } from "$lib/supabaseClient";
	import { BlockWrapper } from "$lib/blocks";
	import CloudUpload from "@lucide/svelte/icons/cloud-upload";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import FileText from "@lucide/svelte/icons/file-text";
	import FileSpreadsheet from "@lucide/svelte/icons/file-spreadsheet";

	let { canAnswer = false, formId, plan = "free" } = $props();

	const PLANS = {
		free: {
			maxFiles: 5,
			maxSize: 10 * 1024 * 1024
		},
		pro: {
			maxFiles: 20,
			maxSize: 50 * 1024 * 1024
		}
	};

	const limits = PLANS[plan];

	let fileInput;
	let uploadedFiles = $state([]);
	let uploading = $state(false);
	let dragging = $state(false);
	let uploadError = $state("");
	let sessionId = $state("");

	$effect(() => {
		if (!formId) return;

		let id = localStorage.getItem(`fabform-upload-${formId}`);

		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem(`fabform-upload-${formId}`, id);
		}

		sessionId = id;
		listFiles();
	});

	function folderPath() {
		return `forms/${formId}/sessions/${sessionId}`;
	}

	function isImage(name) {
		return /\.(jpg|jpeg|png|webp|gif)$/i.test(name);
	}

	function isSpreadsheet(name) {
		return /\.(xls|xlsx|csv)$/i.test(name);
	}

	function triggerFileInput() {
		if (!canAnswer) return;
		uploadError = "";
		fileInput.click();
	}

	async function listFiles() {
		if (!formId || !sessionId) return;

		const { data, error } = await supabase.storage
			.from("form-uploads")
			.list(folderPath(), {
				limit: 100,
				sortBy: {
					column: "created_at",
					order: "desc"
				}
			});

		if (error) {
			uploadError = error.message;
			return;
		}

		uploadedFiles = data.map(file => {
			const path = `${folderPath()}/${file.name}`;

			const { data:urlData } = supabase.storage
				.from("form-uploads")
				.getPublicUrl(path);

			return {
				name: file.name,
				path,
				publicUrl: urlData.publicUrl,
				sizeKB: file.metadata?.size
					? (file.metadata.size / 1024).toFixed(1)
					: "0",
				status: "complete"
			};
		});
	}

	async function handleFileChange(event) {
		for (const file of Array.from(event.target.files)) {
			uploadFile(file);
		}

		event.target.value = "";
	}

	async function uploadFile(file) {
		uploadError = "";

		if (uploadedFiles.length >= limits.maxFiles) {
			uploadError = `Maximum ${limits.maxFiles} files allowed`;
			return;
		}

		if (file.size > limits.maxSize) {
			uploadError = `Maximum file size is ${limits.maxSize / 1024 / 1024}MB`;
			return;
		}

		const tempId = crypto.randomUUID();

		const preview = {
			id: tempId,
			name: file.name,
			sizeKB: (file.size / 1024).toFixed(1),
			status: "uploading",
			progress: 0,
			publicUrl: file.type.startsWith("image/")
				? URL.createObjectURL(file)
				: null
		};

		uploadedFiles = [preview, ...uploadedFiles];

		const extension = file.name.includes(".")
			? file.name.split(".").pop()
			: "file";

		const filename = `${crypto.randomUUID()}.${extension}`;
		const path = `${folderPath()}/${filename}`;

		const { error } = await supabase.storage
			.from("form-uploads")
			.upload(path, file);

		if (error) {
			uploadedFiles = uploadedFiles.map(item =>
				item.id === tempId
					? { ...item, status: "error" }
					: item
			);

			uploadError = error.message;
			return;
		}

		const { data:urlData } = supabase.storage
			.from("form-uploads")
			.getPublicUrl(path);

		uploadedFiles = uploadedFiles.map(item =>
			item.id === tempId
				? {
					id: tempId,
					name: file.name,
					path,
					publicUrl: urlData.publicUrl,
					sizeKB: (file.size / 1024).toFixed(1),
					status: "complete"
				}
				: item
		);
	}

	async function deleteFile(file) {
		if (!file.path) return;

		const { error } = await supabase.storage
			.from("form-uploads")
			.remove([file.path]);

		if (error) {
			uploadError = error.message;
			return;
		}

		uploadedFiles = uploadedFiles.filter(
			item => item.path !== file.path
		);
	}

	function handleDrop(event) {
		event.preventDefault();
		dragging = false;

		if (!canAnswer) return;

		for (const file of event.dataTransfer.files) {
			uploadFile(file);
		}
	}
</script>

<BlockWrapper {canAnswer}>
	<div class="w-full space-y-6">
		<div
			role="button"
			tabindex="0"
			onclick={triggerFileInput}
			ondrop={handleDrop}
			ondragover={(e) => {
				e.preventDefault();
				dragging = true;
			}}
			ondragleave={() => dragging = false}
			class={[
				"rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300",
				dragging
					? "border-pink-500 bg-pink-50 scale-[1.02]"
					: "border-gray-200 bg-white",
				canAnswer
					? "cursor-pointer hover:border-pink-400 hover:shadow-lg"
					: "opacity-50"
			]}
		>
			<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-50">
				<CloudUpload size={28} class="text-pink-500" />
			</div>

			<h3 class="font-semibold text-gray-900">
				Upload files
			</h3>

			<p class="mt-2 text-sm text-gray-500">
				Drag files here or click to browse
			</p>

			<p class="mt-2 text-xs text-gray-400">
				{limits.maxFiles} files maximum · {limits.maxSize / 1024 / 1024}MB each
			</p>

			<input
				bind:this={fileInput}
				type="file"
				multiple
				class="hidden"
				onchange={handleFileChange}
			/>
		</div>

		{#if uploadError}
			<div class="rounded-xl bg-red-50 p-3 text-sm text-red-700">
				{uploadError}
			</div>
		{/if}

		{#if uploadedFiles.length}
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
				{#each uploadedFiles as file}
					<div class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
						<div class="relative aspect-square bg-gray-50">
							{#if isImage(file.name)}
								<img
									src={file.publicUrl}
									alt={file.name}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div class="flex h-full items-center justify-center">
									{#if isSpreadsheet(file.name)}
										<FileSpreadsheet size={42} class="text-green-500" />
									{:else}
										<FileText size={42} class="text-gray-400" />
									{/if}
								</div>
							{/if}

							{#if file.status === "uploading"}
								<div class="absolute inset-0 flex items-center justify-center bg-white/70">
									<div class="text-sm text-gray-600">
										Uploading...
									</div>
								</div>
							{/if}

							{#if file.status === "complete"}
								<button
									type="button"
									onclick={() => deleteFile(file)}
									class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-500 shadow-md opacity-0 scale-90 transition-all group-hover:opacity-100 group-hover:scale-100 hover:bg-red-50 hover:text-red-600"
									title="Delete file"
								>
									<Trash2 size={15} />
								</button>
							{/if}
						</div>

						<div class="p-3">
							<p class="truncate text-sm font-medium text-gray-900">
								{file.name}
							</p>

							<p class="mt-1 text-xs text-gray-400">
								{file.sizeKB} KB
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</BlockWrapper>
