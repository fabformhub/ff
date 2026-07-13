<script>
  import { Rocket, Sparkles } from '@lucide/svelte';
  import { navigate} from '$lib/router.js';

  let eyes = false;
  const goHome = () => navigate('/dashboard');

</script>


<div class="
  min-h-screen overflow-hidden relative bg-[#fff8f1] flex items-center justify-center ">


  <div class=" absolute inset-0 bg-[radial-gradient(circle_at_center,_#fde68a_0,_transparent_35%)] "></div>

  <div class=" absolute top-20 left-20 w-6 h-6 bg-purple-400 rounded-full animate-ping "></div>
  <div class=" absolute bottom-32 right-32 w-10 h-10 bg-pink-400 rounded-full animate-bounce "></div>

  <div class="relative z-10 text-center">

    <div class=" relative w-[360px] h-[300px] mx-auto ">


      <div class=" absolute left-1/2 top-10 -translate-x-1/2 text-[190px] leading-none font-black text-purple-700 rotate-[-8deg] animate-wobble "> 4 </div>


      <div class="
        absolute
        right-2
        top-28
        w-28
        h-28
        rounded-[45%]
        bg-yellow-300
        shadow-[0_20px_40px_rgba(0,0,0,.12)]
        animate-float
      ">

        <div class="absolute top-8 left-7 w-5 h-8 bg-black rounded-full"></div>
        <div class="absolute top-8 right-7 w-5 h-8 bg-black rounded-full"></div>

        <div class="
          absolute
          bottom-5
          left-8
          w-12
          h-5
          border-b-4
          border-black
          rounded-full
        "></div>

      </div>



      <div class="
        absolute
        left-8
        bottom-10
        w-20
        h-20
        rounded-full
        bg-indigo-500
        animate-spin-slow
      ">

        <div class="
          absolute
          inset-5
          bg-white
          rounded-full
        "></div>

      </div>


      <div class="
        absolute
        left-0
        top-0
        rotate-[-20deg]
        text-5xl
        animate-bounce
      ">
        ?
      </div>

    </div>



    <h1 class="
      mt-5
      text-5xl
      font-black
      tracking-tight
      text-gray-900
    ">
      Uh oh. Reality broke.
    </h1>


    <p class="
      mt-5
      max-w-lg
      mx-auto
      text-xl
      text-gray-600
    ">
      We looked everywhere.
      Under the sofa. Behind the pixels.
      Even checked the fridge.
      This page is definitely not here.
    </p>



    <button
      onclick={goHome}
      class="
        group
        mt-10
        relative
        overflow-hidden
        inline-flex
        items-center
        gap-3
        px-8
        py-5
        rounded-full
        bg-black
        text-white
        font-black
        text-lg
        shadow-[0_20px_50px_rgba(0,0,0,.25)]
        hover:scale-110
        transition-all
        duration-300
      "
    >

      <Rocket
        class="
          group-hover:-rotate-12
          group-hover:translate-x-2
          transition-all
        "
      />

      Beam me somewhere useful

      <Sparkles
        class="
          group-hover:rotate-180
          transition-transform
        "
      />

    </button>


    <div
      class="
        mt-6
        text-sm
        text-gray-400
        animate-pulse
      "
    >
      (The button has been trained. It knows the way.)
    </div>


  </div>


</div>


<style>
@keyframes wobble {
  0%,100% {
    transform:rotate(-8deg);
  }

  50% {
    transform:rotate(8deg);
  }
}


@keyframes float {
  0%,100% {
    translate:0 0;
  }

  50% {
    translate:0 -25px;
  }
}


@keyframes spin-slow {
  from {
    transform:rotate(0deg);
  }

  to {
    transform:rotate(360deg);
  }
}


:global(.animate-wobble) {
  animation:wobble 2s infinite ease-in-out;
}


:global(.animate-float) {
  animation:float 3s infinite ease-in-out;
}


:global(.animate-spin-slow) {
  animation:spin-slow 8s linear infinite;
}
</style>
