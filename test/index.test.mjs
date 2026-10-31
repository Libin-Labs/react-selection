import { beforeEach, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { act, createElement } from 'react';
import { setup } from './helpers.mjs';
import { useSelection } from '../dist/index.js';
let ui, api;
beforeEach(async () => (ui = await setup()));
afterEach(async () => ui.cleanup());
test('range and additive selection skip disabled items', async () => {
  function App() {
    api = useSelection(['a', 'b', 'c', 'd'], { disabledIds: ['b'] });
    return null;
  }
  await ui.render(createElement(App));
  await act(() => api.select('a'));
  await act(() => api.select('c', { shiftKey: true }));
  assert.deepEqual(api.selectedIds, ['a', 'c']);
  await act(() => api.toggle('d'));
  assert.deepEqual(api.selectedIds, ['a', 'c', 'd']);
  await act(() => api.clear());
  assert.deepEqual(api.selectedIds, []);
});
