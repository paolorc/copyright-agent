# code-challenge

A code challenge used to assess developers knowledge and skills

### Scenario

A developer has tried to do a task that you must now take over and complete.

The task has been extended with additional requirements after the developer left.

OBS: The API mock must be used and it must not be changed.

### Requirements

- It must be possible to run the program and get back the colors green, blue and red in HEX format.
- It must be possible to define the colors using their names like red, blue and green.
- It must be possible to define the order the colors are returned.

### New additional requirements

- The program must support the colors white and black.
- The program must be able to return the RGB values.
- It must be possible to run the program asynchronously getting all the colors at the same time
- It must be possible to run the program synchronously getting one color a time

### How to use it

- Command structure: `node src/index.js arg1 arg2 arg 3`
  - arg1: color array in the order needed `(black, blue, green, red, white)`, by default will look for all colors e.g: `'["green","blue", "red", "white", "black"]'`
  - arg2: color format to return `(hex, rgb)`, by default will take `HEX` format
  - arg3: runner must be `(async, sync)`, by default is `async` to manage concurrency

### Example Command:

- Executing file

```
node src/index.js '["green","blue", "red", "white", "black"]' rgb async
```

- With npm

```
npm start '["green","blue", "red", "white", "black"]' rgb async
```
