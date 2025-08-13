<template>
  <Navbar />
  <template>
      <div class="relative min-h-160 lg:min-h-0 bg-surface-0 dark:bg-surface-900 flex lg:flex-row flex-col">
        <div class="flex lg:flex lg:flex-row flex-col justify-center md:justify-normal h-full flex-1">
          <div class="relative flex-1 z-20 flex items-center justify-center">
            <div class="flex items-center justify-center h-full">
              <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
                <h1
                  class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-6 leading-tight!">
                  <span class="block">Create the screens your</span>
                  <span class="block text-primary">visitors deserve to see</span>
                </h1>

                <p
                  class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>

                <div class="flex items-center gap-4 justify-center lg:justify-start">
                  <Button label="Learn More" type="button" />
                  <Button label="Live Demo" type="button" outlined />
                </div>
              </div>
            </div>
          </div>

          <div class="absolute lg:relative inset-0 lg:inset-auto flex-1">
            <div class="absolute lg:hidden inset-0 bg-surface-900/60 dark:bg-surface-900/80 z-10" />
            <img
              src="https://vcvwxwhiltffzmojiinc.supabase.co/storage/v1/object/sign/images/valkLaser.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NDMzZjlmNi01NGMzLTQxNzQtYmY0ZC01YzVjZDliNmI2MjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvdmFsa0xhc2VyLnBuZyIsImlhdCI6MTc1NDY1NTE3MywiZXhwIjoxNzg2MTkxMTczfQ.ycdvfecXN2uV8r3Z5yfBQXx_BTXjwmqJKydwhqDi_cs"
              alt="hero-1" class="h-full w-full object-cover xl:[clip-path:polygon(12%_0,100%_0%,100%_100%,0_100%)]" />
          </div>
        </div>
      </div>

      <!-- <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
        <div class="text-surface-700 dark:text-surface-100 text-center flex flex-col items-center gap-4">
          <div class="text-primary font-bold text-lg leading-tight">
            <div class="text-surface-900 dark:text-surface-0 font-bold text-4xl leading-tight">Rejoignez notre
              communauté
            </div>
            <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal">Lorem ipsum dolor sit, amet
              consectetur adipisicing elit. Velit numquam eligendi quos.</div>
            <Button class="mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord"
                viewBox="0 0 16 16">
                <path
                  d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
              </svg>
              <span>Rejoignez maintenant</span>
            </Button>
          </div>
        </div>
      </div> -->
  </template>

</template>

<script setup>
import Navbar from '@/composants/Navbar.vue';
import Button from 'primevue/button';
</script>