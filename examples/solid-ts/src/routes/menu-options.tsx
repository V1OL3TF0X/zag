import * as menu from "@zag-js/menu"
import { menuControls, menuOptionData } from "@zag-js/shared"
import { normalizeProps, useMachine } from "@zag-js/solid"
import { createMemo, createSignal, createUniqueId, For } from "solid-js"
import { Portal } from "solid-js/web"
import { StateVisualizer } from "~/components/state-visualizer"
import { Toolbar } from "~/components/toolbar"
import { useControls } from "~/hooks/use-controls"

export default function Page() {
  const controls = useControls(menuControls)

  const [order, setOrder] = createSignal("")
  const [type, setType] = createSignal<string[]>([])

  const service = useMachine(menu.machine, { id: createUniqueId() })
  const api = createMemo(() => menu.connect(service, normalizeProps))

  const radios = createMemo(() =>
    menuOptionData.order.map((item) => ({
      type: "radio" as const,
      value: item.value,
      label: item.label,
      checked: order() === item.value,
      onCheckedChange: (checked: boolean) => setOrder(checked ? item.value : ""),
    })),
  )

  const checkboxes = createMemo(() =>
    menuOptionData.type.map((item) => ({
      type: "checkbox" as const,
      value: item.value,
      label: item.label,
      checked: type().includes(item.value),
      onCheckedChange: (checked: boolean) =>
        setType((prev) => (checked ? [...prev, item.value] : prev.filter((x) => x !== item.value))),
    })),
  )

  return (
    <>
      <main>
        <div>
          <button data-testid="trigger" {...api().getTriggerProps()}>
            Actions <span {...api().getIndicatorProps()}>▾</span>
          </button>

          <Portal>
            <div {...api().getPositionerProps()}>
              <div {...api().getContentProps()}>
                <For each={radios()}>
                  {(item) => (
                    <div {...api().getOptionItemProps(item)}>
                      <span {...api().getItemIndicatorProps(item)}>✅</span>
                      <span {...api().getItemTextProps(item)}>{item.label}</span>
                    </div>
                  )}
                </For>
                <hr {...api().getSeparatorProps()} />
                <For each={checkboxes()}>
                  {(item) => (
                    <div {...api().getOptionItemProps(item)}>
                      <span {...api().getItemIndicatorProps(item)}>✅</span>
                      <span {...api().getItemTextProps(item)}>{item.label}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Portal>
        </div>
      </main>

      <Toolbar controls={controls}>
        <StateVisualizer state={service} />
      </Toolbar>
    </>
  )
}
