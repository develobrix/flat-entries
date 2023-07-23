# ♭🎵 flat-entries

This npm package provides a simple, lightweight and robust way to get a **flat list** of all non-object entries within
an object. Its functionality is best seen when compared to node's built-in `Object.entries`:

```javascript
import { flatEntries } from 'flat-entries';

const obj = {
  prop: 'value',
  nested: {
    prop: 'nested value'
  }
};

// node's built-in Object.entries keeps object values:
const entries = Object.entries(obj);
/**
 * [
 *   ['prop',   'value'                 ],
 *   ['nested', { prop: 'nested value' }],
 * ]
 */

// flatEntries flattens all nested object values:
const flatEntries = flatEntries(obj);
/**
 * [
 *   [['prop'],           'value'       ],
 *   [['nested', 'prop'], 'nested value'],
 * ]
 */
```
