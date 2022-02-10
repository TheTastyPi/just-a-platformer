# CHANGE LOG

#### 5 Jan. 2021

Editor

- Added force field (can be used for one way passages)
- Added switch block and toggle blocks (simplified from the main game)
- Started recording these updates

## 6 Jan. 2021

Main Game

- Finished the gravity branch
- Added saving system
  - \[DELETE] to wipe save
    Editor
- Fixed visual bug related to toggle blocks

#### 6 Jan. 2021 #2

Editor

- Altered the appearance of G-Bounce Up, G-Bounce Down, and Force Fields

### 7 Jan. 2021

Editor

- Altered the appearance on Toggle Blocks
- Added Death Block variants to Toggle Blocks
- Added Timer Blocks (Solid & Death Block variants)
- Fixed spawn point bug related to altering level size
- Altering level size no longer let you control the player
- Altering level size now also moves the player with it

### 7 Jan. 2021 #2

Editor

- Added the ability to drag the stage around using the mouse
- Added the ability to refocus on the player along with that

#### 7 Jan. 2021 #3

Editor

- Altered the appearance of timer blocks

## 8 Jan. 2021

Editor

- Added the ability to select blocks from a list using a mouse

#### 8 Jan. 2021 #2

Editor

- Added the ability to toggle the block selection UI

#### 8 Jan. 2021 #3

Editor

- Added Ice Block

### 9 Jan. 2021

Editor

- Added Portals
- Made slight optimizations

#### 9 Jan. 2021 #2

Editor

- Force Blocks no long set speed if player speed is higher than the set speed.

#### 9 Jan. 2021 #3

Editor

- Portals now use relative coordinates
  - This fixed a bug related to changing level size and portals.

#### 10 Jan. 2021

Editor

- Even more optimizations
  - Now @gapples2 's dropper level should be able to be played with little to no lag

#### 14 Jan. 2021

Editor

- Fixed a small visual bug related to moving the level.
  Main Game
- Still working on the multi-jump branch.

#### 14 Jan. 2021 #2

Editor

- Fixed a bug caused by my previous bug fix, oops.

#### 15 Jan. 2021

Editor

- Actually fixed that bug from before since apparently I didn't actually fix it.
- Prevented \[ctrl] + \[arrow] from doing what it normally does on macOS, whatever that does.

## 22 Jan. 2021

Main Game

- Added the multi-jump branch
  - 18 new rooms
  - Might consider nerfing
- Made which block the switches affect more apparent
- Added hotkey \[R] to restart from checkpoint (didn't know why I hadn't added this sooner)

Editor

- Changed the color of player when in god mode
- oh i also added some cool tab icons. one for main game & one for the level editor

#### 23 Jan. 2021

Editor

- Added 4 new blocks
  - Jump Block A/B, Jump Death Block A/B

## 23 Jan. 2021 #2

Editor

- Added new UI for editing properties of blocks
  - Able to be used on portals
- Added tooltip to display properties of block
- Added Text Block
- Added noclip mode
- Changed how OoB positions are handled
- Changed restart from startpoint hotkey to \[shift] + \[R]

#### 23 Jan. 2021 #3

Editor

- Made it so that line breaks are allowed while editing block property (with \[shift]+ \[enter], as otherwise it submits)
- Added hotkey \[shift] + \[delete] to clear level

## 25 Jan. 2021

Editor

- Added 8 new blocks!
  - Custom Bounce Block
  - Custom G-Field
  - Custom Jump Field
  - Custom Speed Field
  - Colored Solid Block
  - Custom Toggle Block
  - Custom Timer Block
  - Custom Jump Block
- Now instead of editing the block property immediately after placing the block down, you can edit the default properties of the block by \[alt] + LMB on the selection icon
- I wanted to add a lot more, but I wanted to get this out there
  Main Game
- Fixed a bug where you can take double jump to the gravity branch

#### 26 Jan. 2021

Editor

- Fixed a few bugs with custom toggleable blocks and checkpoints and exporting and all that
- When the entire player is inside a solid block, the player dies from suffocation
- Changed edit property control to \[F] + LMB

#### 26 Jan. 2021 #2

Both

- Made non-solid blocks hitbox slightly bigger so that you can't fall off a solid block onto a death block with double jump, and waste your jump by jumping midair

#### 26 Jan. 2021 #3

Editor

- MMB now also copy properties
- You can now select a single block with both LMB and RMB

#### 26 Jan. 2021 #4

Editor

- Non-integer value are now allowed as properties
- Custom gravity limit has been doubled

#### 27 Jan. 2021

Editor

- The player now changes color from blue to red depending on number of jumps left
- You can no longer die from suffocation while in noclip

#### 27 Jan. 2021 #2

Editor

- Fixed a bug related to editing default properties

#### 27 Jan. 2021 #3

Editor

- Custom blocks now changes color based on their property

#### 28 Jan. 2021

Editor

- Added the ability to change the level size by multiple blocks at once using \[shift] + \[ctrl] + \[arrow]
- Added a max width to the control list

#### 28 Jan. 2021 #2

Editor

- Added "Invert" property to custom toggleable blocks
- Made it so that text from text boxes no longer goes off the screen

### 29 Jan. 2021

Editor

- Added the ability to undo (\[ctrl]+\[z]) & redo (\[ctrl]+\[shift]+\[z])

#### 29 Jan. 2021 #2

Editor

- Changed how "player fully inside block" is handled

#### 30 Jan. 2021

Editor

- Fixed a bug where you can hit a bounce block through a corner

### 31 Jan. 2021

Main Game

- Nerfed gravity branch
- Multi-jump branch is next

### 1 Feb. 2021

Main Game

- Nerfed multi-jump branch

#### 2 Feb. 2021

Main Game

- Added an "info" menu
- Moved some rooms around

## 7 Feb. 2021

Main Game

- Added wall-jump branch
- Moved some rooms around again
  Editor
- Added one-way blocks
- Fixed a bug where the block selection scroll when the player moves
  Both
- The js is now split into multiple files

#### 8 Feb. 2021

Editor

- Added a grid
- Made gravity magnitude change more gradual
- Changed the toggle \_\_\_ hotkeys to numbers

## 10 Feb. 2021

Editor

- Added 4 new blocks
  - G-Field Left
  - G-Field Right
  - G-Bounce Left
  - G-Bounce Right
- Added \[Horizontal] property to Custom G-Field
- Fixed a bug where checkboxes doesn't stay checked after confirming block properties

Main Game

- Fixed a bug where gameSpeed doesn't function as intended

#### 10 Feb. 2021 #2

Editor

- Sideways gravity is now saved on checkpoint

#### 10 Feb. 2021 #3

Editor

- All previous level data are now backward compatible with new features

## 11 Feb. 2021

Editor

- Added a saving system
- Changed edit property hotkey to \[E] + LMB
- Removed export and import hotkey for an "open save menu" hotkey: \[ctrl] + \[F]
- Oh and \[shift] + \[F] is save

### 12 Feb. 2021

Editor

- Added Timer Interval Field
- Refactored the checkpoint system
  - WHY HAVEN'T I DONE THIS SOONER

Main Game

- Player changes color based on jumps left, like in the editor

#### 13 Feb. 2021

Main game

- Added "return to start" hotkey \[shift] + \[R] (saves switch progress)
  - Not a "go to hub" hotkey, but it's fine right?

## 15 Feb. 2021

Editor

- Blocks with properties are now allowed to be properties themselves
  - AKA nested properties are a thing now
- Force fields now have a "power" property
- Changed the appearance of one-way blocks

#### 17 Feb. 2021

Editor

- Fixed a bug related to checkpoints and custom toggleable blocks not updating
- Fixed a bug related to speed?
  - I tried? Dunno if it worked
- New properties are now backward compatible with older saves
  - Thanks ████████? I replaced almost everything you added tho :/

#### 17 Feb. 2021 #2

Editor

- Memory leak problem fixed maybe?
  - Added a limit to undos because I was stupid and forgot to do that before

#### 18 Feb. 2021

Editor

- Made jump blocks actually update appearance, because I accidentally deleted a word in the code

### 19 Feb. 2021

Editor

- Added properties to Start and Goal
- Fixed a bug where sub-blocks doesn't update appearance

#### 21 Feb. 2021

Editor

- Fixed gaem braeking bug that made stuff go wrong when you touch the boundaries of a level.

## 27 Feb. 2021

Editor

- Added the "ID" and "Single Use" property to the Switch Block
- Fixed a bug where if there are multiple "block" properties of the same type, the property used would always be the first one listed.
- Knocking two off the list at once :o

#### 28 Feb. 2021

Editor

- Fixed a bug related to loading older saves
- Fixed a bug where the player can't jump inside a 1-jump field

#### 4 Mar. 2021

Main Game

- Fixed a bug where you can literally skip a save wtf was I doing

#### 4 Mar. 2021 #2

Both

- Made the camera movement smoother

## 11 Mar. 2021

Both

- Completely refactored the collision system
- Changed how wall-jumps controls
- You now just die if you're fully inside a block

Main Game

- Made adjustments to the wall-jump branch to prevent accidentally touching previous checkpoints
- Made adjustments to the entire game for balancing
- Fixed a bug where switch blocks wouldn't display properly on game load
  Editor
- Fixed a bug when creating a save where you still create a save even if you press cancel
- Fixed a bug where single-use switches don't reset on start or while as a non-active sub-block
- Made movement in One-Way Blocks smoother
- Added a changelog in the files
  - It was about time

#### 12 Mar. 2021

Main Game

- Changed \[shift] + \[R] to go to hub instead of the start

## 13 Mar. 2021

Editor

- Added 8 new blocks
  - Size Large/Medium/Small Field
  - Timer Fast/Normal/Slow Field
  - Custom Size/Time Field

### 17 Mar. 2021

Editor

- Added Unstable Block
- You now spawn on the floor instead of the center

#### 17 Mar. 2021 #2

Editor

- Fixed a bug related to replacing a unstable block while it's breaking/reforming
- Increased the lower bound of all properties of unstable block to 1

#### 18 Mar. 2021

Editor

- Fixed a bug related to changing the level size while a unstable block is breaking/reforming

### 20 Mar. 2021

Main Game

- Added a sneak peek of the speed branch
- Made a slight adjustment to the multi-jump branch
- Made it so that you spawn on the floor, like in the editor

Both

- Stopped holding jump from making you jump multiple times
- Respawning now has a 1/3 second delay so that players can register that they've died

Editor

- Fixed inconsistency with movement speed between the main game and editor
  - Might break some levels but, eh, it had to be fixed

## 27 Mar. 2021

Main Game

- Finished the speed branch

Editor

- Fixed a bug where game speed affects the spawn delay

#### 27 Mar. 2021 #2

Main Game

- Added discord server link

## 27 Mar. 2021 #3

Both

- Added mobile support

## 9 Apr. 2021

Main Game

- Added the final branch
  - Game complete!
- Added a time played stat
- Added a death counter
- Renamed "Info" to "Credits"
- Added a "Wipe Save" option to mobile because yhvr forgot to do that

Editor

- Added a credits screen
  - Also added the option to hide the button that opens said screen
- Fixed a bug where undo/redoing a level size change doesn't update stuff properly
- Fixed a bug where the save menu won't scroll
- When spawning, you now start at the default size before transitioning to your saved size

Both

- Credited Yhvr for mobile support
- Moved the credits button back to the top right to avoid conflict with the info display in the level editor
- Added a fade in transition when opening the page
- You can now jump by pressing down

#### 11 Apr. 2021

Editor

- \[shift] + \[R] now also resets checkpoint

### 14 Apr. 2021

Editor

- Optimization for extremely large levels
- Refactored the level size change code
- Fixed bug where switch state doesn't reset on start
- Removed some frames from unstable block's animation

#### 14 Apr. 2021 #2

Editor

- Fixed a bug where moving the level with \[ctrl] drag causes weird stuff to happen

#### 15 Apr. 2021

Editor

- Made unstable blocks have slightly more frames, since they literally only have like 2 because I went too far

Both

- Made the credit text smaller on mobile because the text were overflowing in landscape mode

## 3 May 2021

Editor

- Added mini blocks! Press \[M] to toggle their placement
- Changed control when in sideways gravity
- Fixed bug where the grid desyncs with the level
- Fixed bug where changing level size can cause the viewing range to be out-of-bound
- Fixed a bug where unstable sub-blocks just doesn't work

Both

- Using the power of basic kinematics, lower frame rates now no longer causes inaccurate physics

#### 4 May 2021

Editor

- Fixed bug where middle clicking causes weird stuff

### 4 May 2021 #2

Editor

- Added colored background blocks

#### 4 May 2021 #3

Editor

- Fixed bug where middle clicking a mini-unstable block doesn't select it

#### 6 May 2021

Editor

- Fixed bug where one-time switch used status doesn't save on checkpoint

## 9 May 2021

Editor

- Added two new blocks: Chain Start and Chain Block
- Fixed bug where middle clicking a block on a timer causes weird stuff
- Fixed bug where shift middle clicking can cause weird stuff to happen with the selection display

#### 9 May 2021 #2

Editor

- Fixed bug where Chain Start can activate chain blocks while they're already activated
- Fixed a visual issue with Chain Start and Chain Block

#### 11 May 2021

Editor

- Fixed bug where touching a Bounce Block++ while upside down will crash the game

#### 12 May 2021

Editor

- Fixed bug where Chain Start and Chain Block doesn't work as a sub-block

### 15 May 2021

Editor

- Added Coins
  - Can have a worth between 1-100
  - No use besides cosmetic, for now
  - Not saved on export/start block placement
- Changed how keybinds are viewed

Both

- Added `[Space]` as a substitute key for jumping

### 15 May 2021 #2

Editor

- Redesigned the appearance of coins
- Coins can now have a negative value

#### 16 May 2021

Editor

- Fixed coin hitboxes

#### 16 May 2021 #2

Editor

- Changed the appearance of custom switch/timer/jump blocks

## 17 May 2021

Editor

- Added 5 new blocks
  - Coin Block A/B, Coin Death Block A/B, Custom Coin Block
- Changed the appearance of switch IDs for visibility

#### 17 May 2021 #2

Editor

- Fixed a bug where coins as sub-blocks did not function property
  - ...by completely redoing the coin system. Thanks yhvr.

#### 18 May 2021

Editor

- Fixed a performance issue when touching multiple checkpoints at once
- Fixed a performance issue where drawLevel() draws blocks that are out-of-bound

#### 20 May 2021

Editor

- Fixed a bug where if you open the control list, then open the save menu, you will become unable to perform any action.

#### 21 May 2021

Editor

- Fixed a bug where a Start's default value were being strange

#### 21 May 2021 #2

Editor

- Fixed a visual issue with custom timer blocks

#### 22 May 2021

Both

- Added a link to my homepage

## 28 May 2021

Both

- Added an options menu
  - Dark mode
  - Respawn delay editing

#### 5 Jun. 2021

Both

- Changed respawn delay selection and default respawn delay to be consistant with the CMG version

### 5 Jun. 2021 #2

Editor

- Added animation for Unstable Block when reconstructing
- Added the ability to hide tooltips using \[6]
- Added the ability to hide subblock display in custom toggleable block using \[7]

### 6 Jun. 2021

Both

- Added an on-screen timer (toggleable from options, also resettable in editor)

#### 8 Jun. 2021

Main Game

- Adjusted the horizontal velocity code to be consistant with the level editor and the CMG version

#### 8 Jun. 2021 #2

Both

- Slightly adjusted the credits

### 8 Jun. 2021 #3

Main Game

- Added the options to not have a confirmation when resetting your save
- Also made it so that the default option is actually applied when you first open the game, damn you yhvr

## 14 Jun. 2021

Editor

- Added Vacuum, which is like ice, but for the air

#### 15 Jun. 2021

Main Game

- The time played stat now also shows the milliseconds

### 15 Jun. 2021 #2

Main Game

- Added a timer that keeps track of your time played in your current branch
  - On both the credit and the on-screen timer

#### 16 Jun. 2021

Main Game

- Fixed bug where the branch timer only save upon hitting a checkpoint, causing desync

#### 21 Jun. 2021

Main Game

- Fixed bug where the branch timer syncs with total time after a refresh

#### 30 Jun. 2021

Both

- Made player color brighter when in dark mode

#### 6 Jul. 2021

Main Game

- Fixed a skip in speed branch

#### 12 Jul. 2021

Editor

- Fixed a bug where block selection display would not update if the camera was not positioned at the origin

## 13 Jul. 2021

Main Game

- Added "EZ Mode"
  - Currently only the gravity branch is EZ-fied

### 13 Jul. 2021 #2

Main Game

- In EZ Mode, the background is now tinted green

## 13 Jul. 2021 #3

Editor

- Added support for advanced level creation by making an API
  - Embedded the Monaco editor
  - Added documentation for all the API

Both

- Changed "Yhvr" in the credits to a hyperlink

Misc.

- Severely overhauled README.md

### 14 Jul. 2021

Main Game

- Multi-jump branch is now EZ in EZ mode

### 15 Jul. 2021

Main Game

- Wall-jump branch is now EZ in EZ mode

Editor

- Fixed bug where dark mode isn't dark

### 15 Jul. 2021 #2

Main Game

- Speed branch is now EZ in EZ mode

## 17 Jul. 2021

Main Game

- EZ Mode finished

## 26 Jul. 2021

Original

- Added Mobile Support

Editor

- Fixed HTML injection with Text Blocks
- Added a Lua API for running Javascript code
- Added a (WIP) Lua API for creating and interacting with HTML elements
- Added a little missing functionality on mobile
- Updated Portal tile to indicate what direction it'll take you
- Polished the API and docs a little

## 30 Jul. 2021

Editor

- Added False Block, which are really sus
- In dark mode, various property edit menus now have a dark background

### 30 Jul. 2021 #2

Editor

- False Block with block with properties as its effect is now working

### 5 Aug. 2021

Editor

- Autosave can actually be disabled now
- Saves no longer gets named 'null' when cancelling rename

#### 6 Aug. 2021

Editor

- Added the ability to toggle false textures using \[0]

#### 21 Sep. 2021

Editor

- Fixed a bug where mini coins on the right or bottom edge won't be reset on start

#### 24 Sep. 2021

Editor

- Fixed a bug where collected and saved mini coins on the right or bottom edge resets on death

#### 28 Sep. 2021

Editor

- Fixed a bug where undo history is preserved between level loads
- "pointer-events" is now "none" for tooltips

### 10 Oct. 2021

Editor

- Added "Absolute" property to portals, which switches the x and y inputs from relative to absolute coordinates

## 18 Oct. 2021

Main Game

- Added HARD mode
  - Only pre-hub, gravity, and a portion of wall-jump is finished

Both

- Made the credit's opacity 0 when not opened.
  - Also added a scroll bar for the credit.

## 20 Oct. 2021

Main Game

- Made EZ mode easier
- Fixed a bug where manually respawning does not update toggleable block display

## 23 Oct. 2021

Main Game

- Added EZR mode, which is easier than EZ
- Made dark mode background slightly darker

#### 31 Oct. 2021

Main Game

- You can no longer go back up to the pre-hub area from the gravity branch switch room

## 14 Nov. 2021

Editor

- Added Chain Death Block and Custom Chain Block
- Added "Invert" property to Chain Block
- Added "Set Value" property to Coin

### 21 Nov. 2021

Main Game

- Finished japHARD Wall-Jump branch!

### 17 Jan. 2022

Main Game

- Fixed the last room of japHARD WJ branch

### 20 Jan. 2022

Main Game

- Finished japHARD Multi-Jump branch!

### 26 Jan. 2022

Main Game

- Finished japHARD Speed branch!

#### 9 Feb. 2022

Main Game

- Fixed japHARD MJ branch final room

## 10 Feb. 2022

Main Game

- Added music: 7 tracks
  - "/" by TheTastyPi
  - "v" by TheTastyPi
  - "+" by yhvr
  - "z" by yhvr
  - ">" by TheTastyPi
  - "Σ" by TheTastyPi
  - "." by TheTastyPi
- Added volume option
