# ♭🎵 flat-entries

This npm package provides a simple, lightweight and robust way to **convert an object to a flat list of all its
non-object entries**.

## ⚙️ How to install

```bash
npm install flat-entries
```

## 🧑‍💻 How to use

The package provides two functions `flatEntries` and `fromFlatEntries`:

### `flatEntries`

It's actually similar to well known `Object.entries`, so let's compare that to `flatEntries`:

```javascript
import { flatEntries } from 'flat-entries';

const obj = {
  prop: 'value',
  nested: {
    prop: 'nested value'
  },
};

// built-in Object.entries keeps object values:
const entries = Object.entries(obj);
/**
 * [
 *   ['prop',   'value'                 ],
 *   ['nested', { prop: 'nested value' }],
 * ]
 */

// ♭🎵 flatEntries flattens all nested object values:
const flatEntries = flatEntries(obj);
/**
 * [
 *   [['prop'],           'value'       ],
 *   [['nested', 'prop'], 'nested value'],
 * ]
 */
```

### `fromFlatEntries`

Use your favorite array manipulation functions like `map`, `filter` etc. to process the entries. If you want to convert
them back into a multi-layer object again or create one from scratch, you can use `fromFlatEntries`:

```javascript
import { fromFlatEntries } from 'flat-entries';

const oldObj = {
  prop: 1,
  nested: {
    prop: 2,
  },
  too: {
    many: {
      layers: 3,
    },
  },
};

const updatedEntries = flatEntries(obj)        // example:
  .filter(([keys, _]) => keys.length < 3)      // remove entries with 3 or more layers
  .map(([keys, value]) => [keys, value * 10]); // and multiply values by 10

const newObj = fromFlatEntries(updatedEntries);
/**
 * {
 *   prop: 10,
 *   nested: {
 *     prop: 20,
 *   },
 * }
 */
```

## ✨ Key features

- 🔄 **two-way** conversion with `flatEntries` and `fromFlatEntries`, where `flatEntries` is strictly **inverted** by `fromFlatEntries`, i.e. `fromFlatEntries(flatEntries(obj)) === obj`
- 💾 all non-object values are **preserved**, including `undefined`, `null`, arrays and even functions
- 🔒 also works with **class instances** with private members
- 🪶 super **lightweight**, no peer dependencies
- ✅ **fully typed** when used with Typescript
