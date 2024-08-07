<script lang="ts">
  import { slide } from 'svelte/transition';
  import arrow from '/src/assets/arrow.svg';
  import cx from 'clsx';
  import { onMount } from 'svelte';
  import BottomBar from '../public/BottomBar.svelte';
  import { isMobile } from '../../stores/isMobile';
  export let necessary: boolean = false;
  export let name: string;
  export let content: string;
  export let selectItems: readonly string[];
  export let editMode: boolean = false;
  export let placeholder: string = '';
  export let className:string = "";
  let input:HTMLDivElement;
  //ly: when bind:content isn't useful, use content & onChange
  export let onChange: (content?: string) => void = (_content?: string) => {};
  
  let showItems = false;
  onMount(() => {
    const close = (e) => {
      showItems = false;
    };
    document.addEventListener('click', close);
    return () => {
      document.removeEventListener('click', close);
    };
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:click={(e) => e.stopPropagation()}
  class={cx(["flex gap-[1rem] max-lg:my-[1.5rem] items-center", className])}
>
  <p class="max-sm:text-sm shrink-0">
    {@html necessary ? `<span class="text-blue-300">*</span>` : ''}{name}
  </p>
  <div class="relative w-full">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      bind:this={input}
      on:click={() => {
        if (!editMode) return;
        showItems = !showItems;
      }}
      class={cx([
        'p-[4px_12px] text-text-1 items-center max-sm:h-[42px] max-sm:text-sm flex relative w-full rounded-[8px] bg-gray-50 h-[48px] transition-all outline-none border-[1px] focus:border-[#165DFF]',
        editMode
          ? 'cursor-pointer border-gray-200 bg-transparent border-[1px]'
          : 'border-transparent',
      ])}
    >
      <input
        disabled
        value={content}
        class="bg-transparent pointer-events-none w-full"
      />
      <img
        src={arrow}
        alt="arrow"
        class={cx([
          ' h-[16px] flex-shrink-0 max-sm:hidden transition-all',
          showItems || 'rotate-180',
          editMode || 'hidden',
        ])}
      />
    </div>
    {#if showItems}
      <div
        class="absolute max-sm:hidden shadow-card z-10 top-[110%] max-h-[300px] overflow-y-auto p-[0.75rem_1rem] rounded-[4px] bg-white w-full border-gray-150 border-[1px] shadow-lg shadow-gray-150 left-0"
        transition:slide
      >
        {#if placeholder}
          <p
            class="p-[0.5rem_0.75rem] transition-all rounded-[0.5rem] cursor-pointer opacity-50"
          >
            {placeholder}
          </p>
        {/if}
        {#each selectItems as item, index}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <p
            on:click={() => {
              content = item;
              onChange(item);
              showItems = false;
            }}
            class="p-[0.5rem_0.75rem] transition-all rounded-[0.5rem] cursor-pointer hover:bg-gray-150"
          >
            {item}
          </p>
        {/each}
      </div>
    {/if}
  </div>
</div>

<BottomBar on:close={() => showItems = false} show={$isMobile && showItems} className="h-[200px] overflow-y-auto ">
  {#if placeholder}
    <p
      class="p-[1rem_0.75rem] transition-all  text-sm rounded-[0.5rem] cursor-pointer opacity-50"
    >
      {placeholder}
    </p>
  {/if}
  {#each selectItems as item, index}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <p
      on:click={() => {
        content = item;
        onChange(item);
        showItems = false;
      }}
      class="p-[1rem_0.75rem] mx-[3rem] text-center transition-all border-b-[1px] border-b-gray-150 rounded-[0.5rem] cursor-pointer hover:bg-gray-150"
    >
      {item}
    </p>
  {/each}
</BottomBar>
