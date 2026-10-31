# @lp-labs/react-selection

Stable-key selection and modifier-aware ranges for custom lists and grids. React 18+ peer only. ESM, CommonJS and TypeScript included.

## Installation

```sh
npm install @lp-labs/react-selection
```

## Quick Start

```jsx
import { useSelection } from '@lp-labs/react-selection';
const ids = ['one', 'two', 'three'];
export default function Example() {
  const selection = useSelection(ids);
  return (
    <div role="listbox" aria-multiselectable="true">
      {ids.map((id) => (
        <button key={id} role="option" {...selection.getItemProps(id)}>
          {id}
        </button>
      ))}
    </div>
  );
}
```

## API

`useSelection(ids,{selectedIds,defaultSelectedIds,onChange,multiple=true,disabledIds})` returns `selectedIds`, `isSelected(id)`, `select(id,modifiers?)`, `toggle(id)`, `clear()`, `selectAll()`, `getItemProps(id)` and `onKeyDown(event,activeId)`. Apply `onChange` for controlled values. Click props support Ctrl/Cmd and Shift. Keyboard handling returns the next active ID for the caller to focus; arrows/Home/End move, Shift extends, Space toggles and Ctrl/Cmd+A selects. The hook does not move DOM focus itself.

## Benefits

| Area               | Details                                 |
| ------------------ | --------------------------------------- |
| Stable IDs         | Keep selection separate from rendering. |
| Modifier ranges    | Support additive and range selection.   |
| Disabled filtering | Skip disabled records consistently.     |

## Customization

| Area             | Details                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| Controlled state | Pass selected IDs and onChange.                                        |
| Behavior         | Set single/multiple mode and disabled IDs.                             |
| Integration      | Use returned key handler and item props in your own accessible widget. |

## Security And Limits

At most100,000 unique string/finite numeric IDs; disabled IDs are skipped. Selection is flat, not hierarchical or authorization. Removed IDs are excluded. Your UI must provide appropriate list/grid roles, labels and focus management; native buttons alone are not a complete ARIA widget. No global keyboard listener or DOM mutation is installed.

## Support

[Donate via PayPal](https://www.paypal.me/LibinPrasanth). Author: [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/).

## License

MIT License. See the packaged [LICENSE](LICENSE) file.
