# VideoPlatform - Move Smart Contract

## Introduction

This is a sample smart contract for a decentralized video platform on the Sui blockchain, featuring:
- Adding new videos (with title, description, CID, owner, and short/long type).
- Tipping creators with SUI tokens.
- Rewarding viewers (each viewer can claim once per video).

## Project Structure

```
VideoPlatform/
├── build/                  # Build artifacts (generated after build)
│   └── VideoPlatform/
│       ├── BuildInfo.yaml
│       ├── bytecode_modules/
│       │   └── VideoPlatform.mv
│       ├── debug_info/
│       │   ├── VideoPlatform.json
│       │   └── VideoPlatform.mvd
│       └── sources/
│           └── VideoPlatform.move
├── sources/                # Main Move source code
│   └── videoplatform.move
├── tests/                  # Move test files
│   └── videoplatform_tests.move
├── Move.toml               # Move package configuration
├── Move.lock               # Dependency/version/chain lock file
└── .gitignore              # Excludes build directory from git
```

## Main Components

- **sources/videoplatform.move**: The main module, defines structs `VideoList`, `Video`, and functions:
  - `init_video_list`: Initialize the video list object.
  - `add_video`: Add a new video.
  - `video_count`, `get_video`: Retrieve video information.
  - `tip`: Tip the creator.
  - `claim_reward`: Reward a viewer.

- **tests/videoplatform_tests.move**: (Currently commented out) - for writing test cases for the module.

- **build/**: Contains build artifacts, including bytecode, debug info, compiled sources, and built dependencies.

- **Move.toml**: Defines package name, edition, module address, and dependencies.

- **Move.lock**: Records the actual dependency state, compiler version, chain id, published id, etc.

- **.gitignore**: Excludes the entire build directory from version control.

## Usage

1. **Build the contract:**
   ```bash
   sui move build
   ```
2. **Deploy the contract to Sui:**
   ```bash
   sui client publish --gas-budget 100000000
   ```
3. **Run tests:**
   ```bash
   sui move test
   ```

## Notes

- The default module address is `0x0` (can be changed in Move.toml).
- Main dependencies: Sui, MoveStdlib, SuiSystem, Bridge (see Move.lock).
- The `build/` directory is generated after building and should not be committed to git. 