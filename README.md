# flat-entries

```bash
npm install flat-entries
```

This npm package provides a simple, lightweight and robust way to convert an object into a **flat list of all its
non-object entries**.

### 🧑‍💻 How to use

The package provides the two functions `flatEntries` and `fromFlatEntries`:

#### ⏩ `flatEntries`

It's actually similar to the well-known `Object.entries`, so let's compare their outputs:

```javascript
import {flatEntries} from 'flat-entries';

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

#### ⏪ `fromFlatEntries`

Use your favorite array manipulation functions like `map`, `filter` etc. to process the entries. Similar
to `Object.fromEntries`, if you want to convert them back into a multi-layer object again or create one from scratch,
you can use `fromFlatEntries`:

```javascript
import {flatEntries, fromFlatEntries} from 'flat-entries';

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

const updatedEntries = flatEntries(obj)          // example:
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

### ✨ Key features

- 🔄 **two-way** conversion, where `flatEntries` is **inverted** by `fromFlatEntries`
- 💾 all non-object values are **preserved**, including `undefined`, `null`, arrays and even functions
- 🔒 also works with **class instances** with private members
- 🪶 super **lightweight**, no peer dependencies
- ✅ **fully typed** when used with Typescript
