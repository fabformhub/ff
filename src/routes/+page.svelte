<script>
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";

  let answer = $state("");
</script>

<div class="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-100 via-white to-slate-100 text-slate-800 relative">

  <!-- SMALL ICON TRIGGER AT TOP RIGHT -->
  <Dialog.Root>

    <Dialog.Trigger
      class="absolute top-6 right-6 bg-white hover:bg-slate-100 
             border border-slate-300 
             w-10 h-10 flex items-center justify-center 
             rounded-full shadow-md cursor-pointer 
             transition-all duration-300 hover:scale-110"
    >
      💬
    </Dialog.Trigger>

    <!-- ANSWER AT TOP CENTER -->
    <div
      class="absolute top-6 left-1/2 -translate-x-1/2 
             w-[90%] max-w-xl px-6 py-4 rounded-xl 
             bg-white border border-slate-300 shadow-md 
             text-center"
    >
      {#if answer === ""}
        <p class="text-slate-500 text-lg">You haven’t answered yet.</p>

      {:else if answer === "good"}
        <p class="text-emerald-600 text-xl font-semibold flex items-center justify-center gap-2">
          <span class="text-3xl">👍</span>
          You said you like the show
        </p>

      {:else}
        <p class="text-rose-600 text-xl font-semibold flex items-center justify-center gap-2">
          <span class="text-3xl">👎</span>
          You said it’s not great
        </p>
      {/if}
    </div>

    <!-- DIALOG CONTENT -->
    <Dialog.Content
      class="bg-white border border-slate-300 rounded-2xl 
             p-8 shadow-xl text-slate-800 
             max-w-sm w-[90%] animate-in fade-in zoom-in-50"
    >
      <Dialog.Header>
        <Dialog.Title class="text-2xl font-bold">
          How do you like the show so far?
        </Dialog.Title>
      </Dialog.Header>

      <div class="flex gap-4 mt-8 justify-center">

        <Dialog.Close>
          <Button
            onclick={() => answer = "good"}
            class="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 
                   rounded-xl shadow-md transition-all duration-300 hover:scale-105"
          >
            👍 Good
          </Button>
        </Dialog.Close>

        <Dialog.Close>
          <Button
            onclick={() => answer = "bad"}
            class="bg-rose-500 hover:bg-rose-400 text-white px-5 py-3 
                   rounded-xl shadow-md transition-all duration-300 hover:scale-105"
          >
            👎 Not great
          </Button>
        </Dialog.Close>

      </div>
    </Dialog.Content>

  </Dialog.Root>

</div>

