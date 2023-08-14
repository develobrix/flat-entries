# flat-entries

This package provides a simple, lightweight and robust way to convert an object to a flat list of all its non-object
entries - and of course back to an object.

```bash
npm install flat-entries
```

## 🧑‍💻 How to use

The package provides the two functions `flatEntries` and `fromFlatEntries`:

### ⏩ `flatEntries`

You can use it anywhere you would use `Object.entries`, but the outputs are slightly different:

```javascript
import { flatEntries } from 'flat-entries';

const obj = {
  prop: 'value',
  nested: {
    prop: 'nested value',
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

// flatEntries flattens all nested object values:
const flattenedEntries = flatEntries(obj);
/**
 * [
 *   [['prop'],           'value'       ],
 *   [['nested', 'prop'], 'nested value'],
 * ]
 */
```

The returned entries always consist of an **array of keys** (= layers of the object) and the **flat value**.

### ⏪ `fromFlatEntries`

Use your favorite array manipulation functions like `map`, `filter` etc. to process the entries. Similar
to `Object.fromEntries`, if you want to convert them back into a multi-layer object again or create one from scratch,
you can use `fromFlatEntries`:

```javascript
import { flatEntries, fromFlatEntries } from 'flat-entries';

const obj = {
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

### ⚙️ Options

You can pass an options object as the second parameter to `flatEntries`:

| option                  | value                              | default | effect                                                                                                           |
|-------------------------|------------------------------------|---------|------------------------------------------------------------------------------------------------------------------|
| `preserveValuesForKeys` | `string[]`<br/>list of object keys | `[]`    | object values at the specified keys will be preserved, i.e. not be flattened (regardless of layer in the object) |

```javascript
import { flatEntries } from 'flat-entries';

const obj = {
  flatten: {
    but: {
      keep: {
        this: 'object'
      },
    },
  },
};

const flattenedEntries = flatEntries(obj, { 
  preserveValuesForKeys: ['keep'],
});
/**
 * [
 *   [['flatten', 'but', 'keep'], { this: 'object' }],
 * ]
 */
```

## ✨ Key features

- 🔄 **two-way** conversion, where `flatEntries` is **inverted** by `fromFlatEntries`
- 💾 all non-object values are **preserved**, including `undefined`, `null`, arrays and even functions
- 🔒 also works with **class instances** with private members
- 🪶 super **lightweight**, no peer dependencies
- ✅ **fully typed** when used with Typescript - comes with a `FlatEntry<T>` type for the flat entries

## 📖 Changelog

- 2023/07/23 `[1.0.0]` initial release of `flatEntries` and `fromFlatEntries`
- 2023/07/27 `[1.1.0]` add `preserveValuesForKeys` option
- 2023/08/11 `[1.2.0]` add JSDoc and remove some type noise
- 2023/08/14 `[1.2.1]` fix re-export to enable top-level import of FlatEntry type
