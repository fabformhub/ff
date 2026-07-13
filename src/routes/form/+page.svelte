<script>
  import { onMount, setContext } from "svelte";
  import { DefaultLayout, Sidebar } from "$lib/layouts";
  import { FormView, BlockPicker } from "$lib/form-builder";
  import { AddBlockButton } from "$lib//ui";
  import { Dialog } from "$lib/dialogs";
  import { FormProperties } from "$lib/form-properties";
  import { BlockProperties } from "$lib/block-properties";
  import { openDialog } from "$lib/utils/dialog.svelte.js";
  import { createBlock, getBlocksByFormId, updateBlock, deleteBlockById, getForm, updateForm } from "$lib/services/formService.js";

  import { debounce } from "$lib/utils/debounce.js";
  import { route } from 'sv-router';
  const formId = $state(route.params.id);

  // ---------------------------------------------------------
  // REACTIVE SHELLS (KISS)
  // ---------------------------------------------------------

  let showBlockPicker = $state(false);
  let blocks = $state([]);
  let blockNo = $state(0);

  let form = $state({
    id: null,
    name: "",
    slug: "",
    views: 0,
    created_at: "",
    user_id: "",
    meta: {
      bgColor: "",
      bgImage: null,
      answerColor: "",
      buttonColor: "",
      buttonTextColor: "",
      color: "",
      fontFamily: "",
      fontSize: "",
      questionColor: ""
    }
  });

  let isLoaded = $state(false);

  // SNAPSHOTS
  let lastFormSnapshot = "";
  let lastBlockSnapshot = "";

  // ---------------------------------------------------------
  // SAVE SYSTEM (KISS)
  // ---------------------------------------------------------

  const save = debounce(async () => {
    try {
      if (!isLoaded) return;

      // FORM SAVE
      const formSnap = JSON.stringify(form);

      if (formSnap !== lastFormSnapshot) {
        await updateForm(form);
        lastFormSnapshot = formSnap;
      }

      // ACTIVE BLOCK SAVE
      const block = blocks[blockNo];

      if (block?.id) {
        const blockSnap = JSON.stringify(block);

        if (blockSnap !== lastBlockSnapshot) {
          await updateBlock(block);
          lastBlockSnapshot = blockSnap;
        }
      }

    } catch (err) {
      console.error("SAVE FAILED:", err);
    }
  }, 1500);

  // ---------------------------------------------------------
  // CHANGE DETECTION
  // ---------------------------------------------------------

  $effect(() => {
    if (!isLoaded || !form?.id) return;

    const snap = JSON.stringify(form);

    if (snap !== lastFormSnapshot) {
      save();
    }
  });

  $effect(() => {
    if (!isLoaded || !blocks[blockNo]) return;

    const snap = JSON.stringify(blocks[blockNo]);

    if (snap !== lastBlockSnapshot) {
      save();
    }
  });

  // ---------------------------------------------------------
  // FETCH + FILL REACTIVE SHELLS (KISS)
  // ---------------------------------------------------------

  const FetchForm = (async () => {
    try {
      // FORM
      const formRes = await getForm(formId);
      const apiForm = formRes.data.form;

      Object.assign(form, {
        id: apiForm.id,
        name: apiForm.name,
        slug: apiForm.slug,
        views: apiForm.views,
        created_at: apiForm.created_at,
        user_id: apiForm.user_id
      });

      Object.assign(form.meta, apiForm.meta);

      // BLOCKS
      const blocksRes = await getBlocksByFormId(formId);
      const apiBlocks = blocksRes.data.blocks;

      blocks.length = 0;

      apiBlocks
        .slice()
        .sort((a, b) => a.meta.blockTypeId - b.meta.blockTypeId)
        .forEach(b => {
          blocks.push({
            ...b,
            meta: {
              ...b.meta,
              coverImageProps: { ...b.meta.coverImageProps }
            }
          });
        });

      // Fix blockNo
      if (blocks.length === 0) {
        blockNo = 0;
      } else if (blockNo >= blocks.length) {
        blockNo = blocks.length - 1;
      }

      lastFormSnapshot = "";
      lastBlockSnapshot = "";

      isLoaded = true;

    } catch (err) {
      console.error("FETCH ERROR:", err);
      form = null;
    }
  });

  onMount(async () => {
  await FetchForm();
 });

  // ---------------------------------------------------------
  // BLOCK ACTIONS
  // ---------------------------------------------------------

  async function createBlockPick(block) {
    await createBlock(formId, block);
    await FetchForm();
  }

  async function deleteBlock(blockId) {
    const confirmed = await openDialog(
      "Delete Confirmation",
      "Are you sure you want to delete this block?",
      "Cancel",
      "Yes! Delete it"
    );

    if (confirmed) {
      await deleteBlockById(blockId);
      await FetchForm();
    }
  }

  const changeBlock = (i) => {
    blockNo = i;
  };

  const handleBlockUpdate = (e) => {
    blocks = blocks.map((b, i) =>
      i === blockNo ? { ...b, ...e.detail } : b
    );
  };

  setContext("blockPickerClick", createBlockPick);
</script>

{#if form === null}
  <p class="text-red-500 p-4">Failed to load form.</p>

{:else if !isLoaded}
  <p class="text-gray-500 p-4">Loading form...</p>

{:else}
  <DefaultLayout {form}>
    <main class="flex flex-col h-[100dvh] isolate">

      <div class="flex justify-center">
        <AddBlockButton largeIcon clickHandler={() => showBlockPicker = true} />
      </div>

      <FormProperties bind:form />

      <BlockPicker
        show={showBlockPicker}
        close={() => (showBlockPicker = false)}
      />

      <Dialog />

      <div class="flex flex-1 overflow-hidden items-stretch">

        <!-- LEFT SIDEBAR -->
        <div class="w-1/4 p-2 overflow-auto border-r border-gray-200">

          <div class="flex justify-end mb-2">
            <AddBlockButton clickHandler={() => (showBlockPicker = true)} />
          </div>

          <Sidebar
            bind:blockNo={blockNo}
            bind:blocks={blocks}
            {changeBlock}
            {deleteBlock}
          />
        </div>

        <!-- CENTER -->
        <div class="w-1/2 overflow-auto bg-white m-1 border border-dotted border-gray-400 rounded-xl shadow-sm">
          {#if blocks[blockNo]}
            <FormView
              form={form}
              canAnswer={false}
              bind:block={blocks[blockNo]}
              on:updateBlock={handleBlockUpdate}
            />
          {:else}
            <p class="text-gray-400">No blocks to display</p>
          {/if}
        </div>

        <!-- RIGHT -->
        <div class="w-1/4 p-2 overflow-auto border-l border-gray-200 flex flex-col">
          {#if blocks[blockNo]}
            <div class="flex-1 overflow-auto">
              <BlockProperties bind:block={blocks[blockNo]} />
            </div>
          {:else}
            <p class="text-gray-400">Loading...</p>
          {/if}
        </div>

      </div>
    </main>
  </DefaultLayout>
{/if}

