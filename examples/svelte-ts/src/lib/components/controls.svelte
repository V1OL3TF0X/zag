<script lang="ts">
  import type { UseControlsReturn } from "$lib/use-controls.svelte"
  import { deepGet } from "@zag-js/shared"

  const { controls }: { controls: UseControlsReturn } = $props()
</script>

<div class="controls-container">
  {#each Object.keys(controls.config) as key}
    {@const { type, label = key, options, placeholder, min, max, forceValue } = (controls.config[key] ?? {}) as any}
    {@const value = deepGet(controls.context, key)}
    {#if type === "boolean"}
      <div class="checkbox">
        <input
          data-testid={key}
          id={label}
          type="checkbox"
          checked={value}
          oninput={(e) => {
            controls.setContext(key, e.currentTarget.checked)
          }}
        />
        <label for={label}>{label}</label>
      </div>
    {:else if type === "string"}
      <div class="text">
        <label for={label} style="margin-right:10px;">{label}</label>
        <input
          data-testid={key}
          id={label}
          type="text"
          {placeholder}
          {value}
          onkeydown={(event) => {
            if (event.key === "Enter") {
              controls.setContext(key, event.currentTarget.value)
            }
          }}
        />
      </div>
    {:else if type === "select"}
      <div class="text">
        <label for={label} style="margin-right:10px;">
          {label}
        </label>
        <select
          data-testid={key}
          id={label}
          {value}
          onchange={(e) => {
            controls.setContext(key, (e.target as HTMLInputElement).value)
          }}
        >
          {#if !forceValue}<option>-----</option>{/if}
          {#each options as option}
            <option value={option}>
              {option}
            </option>
          {/each}
        </select>
      </div>
    {:else if type === "number"}
      <div class="text">
        <label for={label} style="margin-right:10px;">
          {label}
        </label>
        <input
          data-testid={key}
          id={label}
          type="number"
          {min}
          {max}
          {value}
          onkeydown={(e) => {
            if (e.key === "Enter") {
              const val = parseFloat((e.target as HTMLInputElement).value)
              controls.setContext(key, isNaN(val) ? 0 : val)
            }
          }}
        />
      </div>
    {:else if type === "number"}{/if}
  {/each}
</div>
